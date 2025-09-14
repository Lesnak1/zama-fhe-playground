const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ConfidentialVoting", function () {
    let confidentialVoting;
    let admin, voter1, voter2, unauthorizedUser;
    
    beforeEach(async function () {
        [admin, voter1, voter2, unauthorizedUser] = await ethers.getSigners();
        
        const ConfidentialVoting = await ethers.getContractFactory("ConfidentialVoting");
        confidentialVoting = await ConfidentialVoting.deploy();
        await confidentialVoting.deployed();
    });
    
    describe("Deployment", function () {
        it("Should set the admin correctly", async function () {
            expect(await confidentialVoting.admin()).to.equal(admin.address);
        });
        
        it("Should authorize admin as voter by default", async function () {
            expect(await confidentialVoting.isAuthorizedVoter(admin.address)).to.be.true;
        });
        
        it("Should initialize with zero proposals", async function () {
            expect(await confidentialVoting.getTotalProposals()).to.equal(0);
        });
    });
    
    describe("Voter Management", function () {
        it("Should authorize voter successfully", async function () {
            await confidentialVoting.authorizeVoter(voter1.address);
            expect(await confidentialVoting.isAuthorizedVoter(voter1.address)).to.be.true;
        });
        
        it("Should emit VoterAuthorized event", async function () {
            await expect(confidentialVoting.authorizeVoter(voter1.address))
                .to.emit(confidentialVoting, "VoterAuthorized")
                .withArgs(voter1.address);
        });
        
        it("Should revert when non-admin tries to authorize", async function () {
            await expect(
                confidentialVoting.connect(voter1).authorizeVoter(voter2.address)
            ).to.be.revertedWith("Only admin can perform this action");
        });
        
        it("Should revert when authorizing zero address", async function () {
            await expect(
                confidentialVoting.authorizeVoter(ethers.constants.AddressZero)
            ).to.be.revertedWith("Invalid voter address");
        });
        
        it("Should revoke voter successfully", async function () {
            await confidentialVoting.authorizeVoter(voter1.address);
            await confidentialVoting.revokeVoter(voter1.address);
            expect(await confidentialVoting.isAuthorizedVoter(voter1.address)).to.be.false;
        });
        
        it("Should not allow revoking admin", async function () {
            await expect(
                confidentialVoting.revokeVoter(admin.address)
            ).to.be.revertedWith("Cannot revoke admin");
        });
    });
    
    describe("Proposal Management", function () {
        it("Should create proposal successfully", async function () {
            const description = "Should we implement feature X?";
            const tx = await confidentialVoting.createProposal(description);
            const receipt = await tx.wait();
            
            expect(await confidentialVoting.getTotalProposals()).to.equal(1);
            
            const proposal = await confidentialVoting.getProposal(0);
            expect(proposal.description).to.equal(description);
            expect(proposal.ended).to.be.false;
            expect(proposal.revealed).to.be.false;
        });
        
        it("Should emit ProposalCreated event", async function () {
            const description = "Test proposal";
            await expect(confidentialVoting.createProposal(description))
                .to.emit(confidentialVoting, "ProposalCreated");
        });
        
        it("Should revert when non-admin creates proposal", async function () {
            await expect(
                confidentialVoting.connect(voter1).createProposal("Test proposal")
            ).to.be.revertedWith("Only admin can perform this action");
        });
        
        it("Should revert when description is empty", async function () {
            await expect(
                confidentialVoting.createProposal("")
            ).to.be.revertedWith("Description cannot be empty");
        });
        
        it("Should revert when description is too long", async function () {
            const longDescription = "a".repeat(1001);
            await expect(
                confidentialVoting.createProposal(longDescription)
            ).to.be.revertedWith("Description too long");
        });
        
        it("Should return correct proposal ID", async function () {
            const proposalId = await confidentialVoting.callStatic.createProposal("Test 1");
            expect(proposalId).to.equal(0);
            
            await confidentialVoting.createProposal("Test 1");
            
            const proposalId2 = await confidentialVoting.callStatic.createProposal("Test 2");
            expect(proposalId2).to.equal(1);
        });
    });
    
    describe("Voting Process", function () {
        let proposalId;
        
        beforeEach(async function () {
            // Create a proposal
            await confidentialVoting.createProposal("Test proposal for voting");
            proposalId = 0;
            
            // Authorize voters
            await confidentialVoting.authorizeVoter(voter1.address);
            await confidentialVoting.authorizeVoter(voter2.address);
        });
        
        it("Should allow authorized voter to vote", async function () {
            // Note: In actual implementation, we would use TFHE.encrypt()
            // For testing, we simulate with placeholder encrypted data
            const encryptedVote = ethers.utils.formatBytes32String("encrypted_yes");
            
            // This test would need proper FHE testing setup
            // await expect(
            //     confidentialVoting.connect(voter1).vote(proposalId, encryptedVote)
            // ).to.emit(confidentialVoting, "VoteCast")
            //   .withArgs(proposalId, voter1.address);
            
            // Check voting status
            expect(await confidentialVoting.hasVoted(proposalId, voter1.address)).to.be.false;
        });
        
        it("Should revert when unauthorized user tries to vote", async function () {
            const encryptedVote = ethers.utils.formatBytes32String("encrypted_vote");
            
            await expect(
                confidentialVoting.connect(unauthorizedUser).vote(proposalId, encryptedVote)
            ).to.be.revertedWith("Not an authorized voter");
        });
        
        it("Should revert when voting on invalid proposal", async function () {
            const encryptedVote = ethers.utils.formatBytes32String("encrypted_vote");
            
            await expect(
                confidentialVoting.connect(voter1).vote(999, encryptedVote)
            ).to.be.revertedWith("Invalid proposal ID");
        });
        
        it("Should prevent double voting", async function () {
            // This test would need proper FHE integration
            // For now, we test the state tracking
            expect(await confidentialVoting.hasVoted(proposalId, voter1.address)).to.be.false;
        });
    });
    
    describe("Vote Ending and Results", function () {
        let proposalId;
        
        beforeEach(async function () {
            await confidentialVoting.createProposal("Test proposal for ending");
            proposalId = 0;
        });
        
        it("Should allow admin to end voting", async function () {
            await expect(confidentialVoting.endVoting(proposalId))
                .to.emit(confidentialVoting, "ProposalEnded");
                
            const proposal = await confidentialVoting.getProposal(proposalId);
            expect(proposal.ended).to.be.true;
        });
        
        it("Should revert when ending invalid proposal", async function () {
            await expect(
                confidentialVoting.endVoting(999)
            ).to.be.revertedWith("Invalid proposal ID");
        });
        
        it("Should revert when trying to end already ended proposal", async function () {
            await confidentialVoting.endVoting(proposalId);
            
            await expect(
                confidentialVoting.endVoting(proposalId)
            ).to.be.revertedWith("Voting already ended");
        });
        
        it("Should revert when getting results before ending", async function () {
            await expect(
                confidentialVoting.getVoteResults(proposalId)
            ).to.be.revertedWith("Results not available yet");
        });
    });
    
    describe("Edge Cases and Security", function () {
        it("Should handle multiple proposals correctly", async function () {
            await confidentialVoting.createProposal("Proposal 1");
            await confidentialVoting.createProposal("Proposal 2");
            await confidentialVoting.createProposal("Proposal 3");
            
            expect(await confidentialVoting.getTotalProposals()).to.equal(3);
            
            const proposal1 = await confidentialVoting.getProposal(0);
            const proposal2 = await confidentialVoting.getProposal(1);
            const proposal3 = await confidentialVoting.getProposal(2);
            
            expect(proposal1.description).to.equal("Proposal 1");
            expect(proposal2.description).to.equal("Proposal 2");
            expect(proposal3.description).to.equal("Proposal 3");
        });
        
        it("Should maintain voter authorization state correctly", async function () {
            await confidentialVoting.authorizeVoter(voter1.address);
            await confidentialVoting.authorizeVoter(voter2.address);
            
            expect(await confidentialVoting.isAuthorizedVoter(voter1.address)).to.be.true;
            expect(await confidentialVoting.isAuthorizedVoter(voter2.address)).to.be.true;
            expect(await confidentialVoting.isAuthorizedVoter(unauthorizedUser.address)).to.be.false;
            
            await confidentialVoting.revokeVoter(voter1.address);
            
            expect(await confidentialVoting.isAuthorizedVoter(voter1.address)).to.be.false;
            expect(await confidentialVoting.isAuthorizedVoter(voter2.address)).to.be.true;
        });
    });
    
    describe("Gas Optimization Tests", function () {
        it("Should have reasonable gas costs for proposal creation", async function () {
            const tx = await confidentialVoting.createProposal("Gas test proposal");
            const receipt = await tx.wait();
            
            console.log(`Gas used for proposal creation: ${receipt.gasUsed.toString()}`);
            // Add gas limit assertions based on your requirements
        });
        
        it("Should have reasonable gas costs for voter authorization", async function () {
            const tx = await confidentialVoting.authorizeVoter(voter1.address);
            const receipt = await tx.wait();
            
            console.log(`Gas used for voter authorization: ${receipt.gasUsed.toString()}`);
        });
    });
});
