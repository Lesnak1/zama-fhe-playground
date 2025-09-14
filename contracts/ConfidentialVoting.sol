// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "fhevm/lib/TFHE.sol";
import "fhevm/abstracts/EIP712WithModifier.sol";

/// @title ConfidentialVoting
/// @notice A confidential voting contract using Fully Homomorphic Encryption (FHE)
/// @dev Votes remain encrypted throughout the voting process and are only revealed when voting ends
contract ConfidentialVoting is EIP712WithModifier {
    struct Proposal {
        string description;
        euint32 yesVotes;
        euint32 noVotes;
        uint256 endTime;
        bool ended;
        bool revealed;
    }
    
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(address => bool) public authorizedVoters;
    
    uint256 public proposalCount;
    address public admin;
    uint256 public constant VOTING_DURATION = 7 days;
    
    event ProposalCreated(uint256 indexed proposalId, string description, uint256 endTime);
    event VoteCast(uint256 indexed proposalId, address indexed voter);
    event ProposalEnded(uint256 indexed proposalId, uint32 yesVotes, uint32 noVotes);
    event VoterAuthorized(address indexed voter);
    event VoterRevoked(address indexed voter);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    modifier onlyAuthorizedVoter() {
        require(authorizedVoters[msg.sender], "Not an authorized voter");
        _;
    }
    
    modifier validProposal(uint256 _proposalId) {
        require(_proposalId < proposalCount, "Invalid proposal ID");
        _;
    }
    
    constructor() EIP712WithModifier("ConfidentialVoting", "1") {
        admin = msg.sender;
        authorizedVoters[admin] = true; // Admin is automatically authorized
    }
    
    /// @notice Authorize a voter to participate in voting
    /// @param _voter Address of the voter to authorize
    function authorizeVoter(address _voter) external onlyAdmin {
        require(_voter != address(0), "Invalid voter address");
        authorizedVoters[_voter] = true;
        emit VoterAuthorized(_voter);
    }
    
    /// @notice Revoke voting authorization from a voter
    /// @param _voter Address of the voter to revoke
    function revokeVoter(address _voter) external onlyAdmin {
        require(_voter != admin, "Cannot revoke admin");
        authorizedVoters[_voter] = false;
        emit VoterRevoked(_voter);
    }
    
    /// @notice Create a new proposal for voting
    /// @param _description Description of the proposal
    function createProposal(string memory _description) external onlyAdmin returns (uint256) {
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(bytes(_description).length <= 1000, "Description too long");
        
        uint256 proposalId = proposalCount;
        uint256 endTime = block.timestamp + VOTING_DURATION;
        
        proposals[proposalId] = Proposal({
            description: _description,
            yesVotes: TFHE.asEuint32(0),
            noVotes: TFHE.asEuint32(0),
            endTime: endTime,
            ended: false,
            revealed: false
        });
        
        emit ProposalCreated(proposalId, _description, endTime);
        
        proposalCount++;
        return proposalId;
    }
    
    /// @notice Cast an encrypted vote on a proposal
    /// @param _proposalId ID of the proposal to vote on
    /// @param encryptedVote Encrypted vote (1 for yes, 0 for no)
    function vote(
        uint256 _proposalId, 
        bytes calldata encryptedVote
    ) external 
      onlySignedPublicKey 
      onlyAuthorizedVoter 
      validProposal(_proposalId) 
    {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp < proposal.endTime, "Voting period has ended");
        require(!proposal.ended, "Voting has ended");
        require(!hasVoted[_proposalId][msg.sender], "Already voted on this proposal");
        
        euint32 vote = TFHE.asEuint32(encryptedVote);
        euint32 one = TFHE.asEuint32(1);
        
        // Ensure vote is either 0 or 1
        ebool isValidVote = TFHE.or(
            TFHE.eq(vote, TFHE.asEuint32(0)),
            TFHE.eq(vote, one)
        );
        require(TFHE.decrypt(isValidVote), "Invalid vote value");
        
        // Add vote: if vote=1 add to yesVotes, if vote=0 add to noVotes
        proposal.yesVotes = TFHE.add(
            proposal.yesVotes, 
            TFHE.mul(vote, one)
        );
        
        proposal.noVotes = TFHE.add(
            proposal.noVotes, 
            TFHE.mul(TFHE.sub(one, vote), one)
        );
        
        hasVoted[_proposalId][msg.sender] = true;
        emit VoteCast(_proposalId, msg.sender);
    }
    
    /// @notice End voting and reveal results for a proposal
    /// @param _proposalId ID of the proposal to end
    function endVoting(uint256 _proposalId) external validProposal(_proposalId) {
        Proposal storage proposal = proposals[_proposalId];
        require(
            msg.sender == admin || block.timestamp >= proposal.endTime,
            "Only admin or after end time can end voting"
        );
        require(!proposal.ended, "Voting already ended");
        
        proposal.ended = true;
        
        // Reveal results by decrypting the votes
        uint32 yesCount = TFHE.decrypt(proposal.yesVotes);
        uint32 noCount = TFHE.decrypt(proposal.noVotes);
        
        proposal.revealed = true;
        emit ProposalEnded(_proposalId, yesCount, noCount);
    }
    
    /// @notice Get proposal details (public information only)
    /// @param _proposalId ID of the proposal
    function getProposal(uint256 _proposalId) external view validProposal(_proposalId) returns (
        string memory description,
        uint256 endTime,
        bool ended,
        bool revealed
    ) {
        Proposal memory proposal = proposals[_proposalId];
        return (
            proposal.description,
            proposal.endTime,
            proposal.ended,
            proposal.revealed
        );
    }
    
    /// @notice Get revealed vote counts for a ended proposal
    /// @param _proposalId ID of the proposal
    function getVoteResults(uint256 _proposalId) external view validProposal(_proposalId) returns (
        uint32 yesVotes,
        uint32 noVotes
    ) {
        Proposal memory proposal = proposals[_proposalId];
        require(proposal.ended && proposal.revealed, "Results not available yet");
        
        return (
            TFHE.decrypt(proposal.yesVotes),
            TFHE.decrypt(proposal.noVotes)
        );
    }
    
    /// @notice Check if an address is authorized to vote
    /// @param _voter Address to check
    function isAuthorizedVoter(address _voter) external view returns (bool) {
        return authorizedVoters[_voter];
    }
    
    /// @notice Get total number of proposals
    function getTotalProposals() external view returns (uint256) {
        return proposalCount;
    }
}
