import { ethers } from 'ethers'

// Contract addresses (will be updated after deployment)
export const CONTRACT_ADDRESSES = {
  ConfidentialVoting: process.env.NEXT_PUBLIC_CONFIDENTIAL_VOTING_ADDRESS || '0x0000000000000000000000000000000000000000',
} as const

// FHEVM Testnet configuration
export const FHEVM_TESTNET = {
  chainId: 9000,
  name: 'FHEVM Testnet',
  rpcUrl: 'https://devnet.zama.ai',
  explorerUrl: 'https://explorer.zama.ai',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
}

// Contract ABIs (simplified for demo - in production, use full ABI from compilation)
export const CONFIDENTIAL_VOTING_ABI = [
  // View functions
  'function admin() view returns (address)',
  'function getTotalProposals() view returns (uint256)',
  'function getProposal(uint256 proposalId) view returns (string description, uint256 endTime, bool ended, bool revealed)',
  'function isAuthorizedVoter(address voter) view returns (bool)',
  'function hasVoted(uint256 proposalId, address voter) view returns (bool)',
  'function getVoteResults(uint256 proposalId) view returns (uint32 yesVotes, uint32 noVotes)',
  
  // Write functions
  'function authorizeVoter(address voter)',
  'function revokeVoter(address voter)',
  'function createProposal(string description) returns (uint256)',
  'function vote(uint256 proposalId, bytes calldata encryptedVote)',
  'function endVoting(uint256 proposalId)',
  
  // Events
  'event ProposalCreated(uint256 indexed proposalId, string description, uint256 endTime)',
  'event VoteCast(uint256 indexed proposalId, address indexed voter)',
  'event ProposalEnded(uint256 indexed proposalId, uint32 yesVotes, uint32 noVotes)',
  'event VoterAuthorized(address indexed voter)',
  'event VoterRevoked(address indexed voter)',
] as const

export interface Proposal {
  id: number
  description: string
  endTime: number
  ended: boolean
  revealed: boolean
  yesVotes?: number
  noVotes?: number
}

export interface VotingContract {
  address: string
  isAdmin: boolean
  isAuthorizedVoter: boolean
  proposals: Proposal[]
}

export class ConfidentialVotingService {
  private contract: ethers.Contract | null = null
  private signer: ethers.Signer | null = null

  constructor() {}

  async connect(provider: ethers.BrowserProvider): Promise<void> {
    try {
      // Request account access
      await provider.send('eth_requestAccounts', [])
      
      // Get signer
      this.signer = await provider.getSigner()
      
      // Check if we're on the correct network
      const network = await provider.getNetwork()
      if (network.chainId !== BigInt(FHEVM_TESTNET.chainId)) {
        await this.switchToFHEVMTestnet(provider)
      }
      
      // Initialize contract
      this.contract = new ethers.Contract(
        CONTRACT_ADDRESSES.ConfidentialVoting,
        CONFIDENTIAL_VOTING_ABI,
        this.signer
      )
    } catch (error) {
      console.error('Failed to connect to contract:', error)
      throw error
    }
  }

  private async switchToFHEVMTestnet(provider: ethers.BrowserProvider): Promise<void> {
    try {
      await provider.send('wallet_switchEthereumChain', [
        { chainId: `0x${FHEVM_TESTNET.chainId.toString(16)}` }
      ])
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        await provider.send('wallet_addEthereumChain', [
          {
            chainId: `0x${FHEVM_TESTNET.chainId.toString(16)}`,
            chainName: FHEVM_TESTNET.name,
            rpcUrls: [FHEVM_TESTNET.rpcUrl],
            nativeCurrency: FHEVM_TESTNET.nativeCurrency,
            blockExplorerUrls: [FHEVM_TESTNET.explorerUrl],
          },
        ])
      } else {
        throw switchError
      }
    }
  }

  async getContractInfo(): Promise<VotingContract> {
    if (!this.contract || !this.signer) {
      throw new Error('Contract not connected')
    }

    const userAddress = await this.signer.getAddress()
    const admin = await this.contract.admin()
    const totalProposals = await this.contract.getTotalProposals()
    const isAuthorizedVoter = await this.contract.isAuthorizedVoter(userAddress)

    // Fetch all proposals
    const proposals: Proposal[] = []
    for (let i = 0; i < totalProposals; i++) {
      const proposal = await this.contract.getProposal(i)
      const proposalData: Proposal = {
        id: i,
        description: proposal.description,
        endTime: proposal.endTime.toNumber(),
        ended: proposal.ended,
        revealed: proposal.revealed,
      }

      // If revealed, get vote results
      if (proposalData.revealed) {
        try {
          const results = await this.contract.getVoteResults(i)
          proposalData.yesVotes = results.yesVotes
          proposalData.noVotes = results.noVotes
        } catch (error) {
          // Results not available yet
        }
      }

      proposals.push(proposalData)
    }

    return {
      address: this.contract.target as string,
      isAdmin: admin.toLowerCase() === userAddress.toLowerCase(),
      isAuthorizedVoter,
      proposals,
    }
  }

  async createProposal(description: string): Promise<string> {
    if (!this.contract) throw new Error('Contract not connected')

    const tx = await this.contract.createProposal(description)
    const receipt = await tx.wait()
    
    // Find ProposalCreated event
    const event = receipt.logs.find((log: any) => 
      log.topics[0] === ethers.id('ProposalCreated(uint256,string,uint256)')
    )
    
    return tx.hash
  }

  async authorizeVoter(voterAddress: string): Promise<string> {
    if (!this.contract) throw new Error('Contract not connected')

    const tx = await this.contract.authorizeVoter(voterAddress)
    await tx.wait()
    return tx.hash
  }

  async vote(proposalId: number, vote: boolean): Promise<string> {
    if (!this.contract) throw new Error('Contract not connected')

    // In a real implementation, this would use TFHE.encrypt()
    // For demo purposes, we'll simulate encrypted data
    const encryptedVote = ethers.solidityPacked(
      ['uint256'], 
      [vote ? 1 : 0]
    )

    const tx = await this.contract.vote(proposalId, encryptedVote)
    await tx.wait()
    return tx.hash
  }

  async endVoting(proposalId: number): Promise<string> {
    if (!this.contract) throw new Error('Contract not connected')

    const tx = await this.contract.endVoting(proposalId)
    await tx.wait()
    return tx.hash
  }

  async hasVoted(proposalId: number): Promise<boolean> {
    if (!this.contract || !this.signer) throw new Error('Contract not connected')

    const userAddress = await this.signer.getAddress()
    return await this.contract.hasVoted(proposalId, userAddress)
  }

  // Event listeners
  onProposalCreated(callback: (proposalId: number, description: string, endTime: number) => void) {
    if (!this.contract) return

    this.contract.on('ProposalCreated', (proposalId, description, endTime) => {
      callback(proposalId.toNumber(), description, endTime.toNumber())
    })
  }

  onVoteCast(callback: (proposalId: number, voter: string) => void) {
    if (!this.contract) return

    this.contract.on('VoteCast', (proposalId, voter) => {
      callback(proposalId.toNumber(), voter)
    })
  }

  onProposalEnded(callback: (proposalId: number, yesVotes: number, noVotes: number) => void) {
    if (!this.contract) return

    this.contract.on('ProposalEnded', (proposalId, yesVotes, noVotes) => {
      callback(proposalId.toNumber(), yesVotes, noVotes)
    })
  }

  // Cleanup
  removeAllListeners() {
    if (this.contract) {
      this.contract.removeAllListeners()
    }
  }
}
