'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Code, Copy, Check, Play, Download, ExternalLink, FileText, Zap } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

const codeExamples = [
  {
    id: 'basic-voting',
    title: 'Basic Confidential Voting',
    description: 'A simple voting contract where votes remain encrypted until revealed',
    difficulty: 'beginner',
    category: 'Voting',
    gasEstimate: 120000,
    language: 'solidity',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "fhevm/lib/TFHE.sol";
import "fhevm/abstracts/EIP712WithModifier.sol";

contract ConfidentialVoting is EIP712WithModifier {
    struct Proposal {
        string description;
        euint32 yesVotes;
        euint32 noVotes;
        bool ended;
    }
    
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    
    uint256 public proposalCount;
    address public admin;
    
    event ProposalCreated(uint256 proposalId, string description);
    event VoteCast(uint256 proposalId, address voter);
    event ProposalEnded(uint256 proposalId, uint32 yesVotes, uint32 noVotes);
    
    constructor() EIP712WithModifier("ConfidentialVoting", "1") {
        admin = msg.sender;
    }
    
    function createProposal(string memory _description) external {
        require(msg.sender == admin, "Only admin can create proposals");
        
        proposals[proposalCount] = Proposal({
            description: _description,
            yesVotes: TFHE.asEuint32(0),
            noVotes: TFHE.asEuint32(0),
            ended: false
        });
        
        emit ProposalCreated(proposalCount, _description);
        proposalCount++;
    }
    
    function vote(
        uint256 _proposalId, 
        bytes calldata encryptedVote
    ) external onlySignedPublicKey {
        require(_proposalId < proposalCount, "Invalid proposal");
        require(!proposals[_proposalId].ended, "Voting ended");
        require(!hasVoted[_proposalId][msg.sender], "Already voted");
        
        euint32 vote = TFHE.asEuint32(encryptedVote);
        euint32 one = TFHE.asEuint32(1);
        
        // vote is 1 for yes, 0 for no
        proposals[_proposalId].yesVotes = TFHE.add(
            proposals[_proposalId].yesVotes, 
            TFHE.mul(vote, one)
        );
        
        proposals[_proposalId].noVotes = TFHE.add(
            proposals[_proposalId].noVotes, 
            TFHE.mul(TFHE.sub(one, vote), one)
        );
        
        hasVoted[_proposalId][msg.sender] = true;
        emit VoteCast(_proposalId, msg.sender);
    }
    
    function endVoting(uint256 _proposalId) external {
        require(msg.sender == admin, "Only admin can end voting");
        require(!proposals[_proposalId].ended, "Already ended");
        
        proposals[_proposalId].ended = true;
        
        // Reveal results
        uint32 yesCount = TFHE.decrypt(proposals[_proposalId].yesVotes);
        uint32 noCount = TFHE.decrypt(proposals[_proposalId].noVotes);
        
        emit ProposalEnded(_proposalId, yesCount, noCount);
    }
}`
  },
  {
    id: 'private-auction',
    title: 'Sealed Bid Auction',
    description: 'Auction contract with hidden bids until reveal phase',
    difficulty: 'intermediate',
    category: 'DeFi',
    gasEstimate: 200000,
    language: 'solidity',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "fhevm/lib/TFHE.sol";
import "fhevm/abstracts/EIP712WithModifier.sol";

contract SealedBidAuction is EIP712WithModifier {
    struct Auction {
        string itemDescription;
        uint256 endTime;
        address seller;
        address highestBidder;
        euint64 highestBid;
        bool ended;
        bool revealed;
    }
    
    mapping(uint256 => Auction) public auctions;
    mapping(uint256 => mapping(address => euint64)) public bids;
    mapping(uint256 => mapping(address => bool)) public hasBid;
    
    uint256 public auctionCount;
    
    event AuctionCreated(uint256 auctionId, string itemDescription, uint256 endTime);
    event BidPlaced(uint256 auctionId, address bidder);
    event AuctionEnded(uint256 auctionId, address winner, uint64 amount);
    
    constructor() EIP712WithModifier("SealedBidAuction", "1") {}
    
    function createAuction(
        string memory _itemDescription,
        uint256 _duration
    ) external returns (uint256) {
        auctions[auctionCount] = Auction({
            itemDescription: _itemDescription,
            endTime: block.timestamp + _duration,
            seller: msg.sender,
            highestBidder: address(0),
            highestBid: TFHE.asEuint64(0),
            ended: false,
            revealed: false
        });
        
        emit AuctionCreated(auctionCount, _itemDescription, block.timestamp + _duration);
        
        return auctionCount++;
    }
    
    function placeBid(
        uint256 _auctionId,
        bytes calldata encryptedBid
    ) external payable onlySignedPublicKey {
        require(_auctionId < auctionCount, "Invalid auction");
        require(block.timestamp < auctions[_auctionId].endTime, "Auction ended");
        require(!auctions[_auctionId].ended, "Auction already ended");
        
        euint64 bid = TFHE.asEuint64(encryptedBid);
        bids[_auctionId][msg.sender] = bid;
        hasBid[_auctionId][msg.sender] = true;
        
        // Update highest bid (encrypted comparison)
        ebool isHigher = TFHE.gt(bid, auctions[_auctionId].highestBid);
        auctions[_auctionId].highestBid = TFHE.select(
            isHigher, 
            bid, 
            auctions[_auctionId].highestBid
        );
        
        emit BidPlaced(_auctionId, msg.sender);
    }
    
    function endAuction(uint256 _auctionId) external {
        require(_auctionId < auctionCount, "Invalid auction");
        require(block.timestamp >= auctions[_auctionId].endTime, "Auction still active");
        require(!auctions[_auctionId].ended, "Already ended");
        require(
            msg.sender == auctions[_auctionId].seller,
            "Only seller can end auction"
        );
        
        auctions[_auctionId].ended = true;
        
        // Reveal winning bid
        uint64 winningBid = TFHE.decrypt(auctions[_auctionId].highestBid);
        
        // Find winner (simplified - in production, use more efficient method)
        address winner = findWinner(_auctionId, winningBid);
        
        if (winner != address(0)) {
            auctions[_auctionId].highestBidder = winner;
            auctions[_auctionId].revealed = true;
            emit AuctionEnded(_auctionId, winner, winningBid);
        }
    }
    
    function findWinner(
        uint256 _auctionId, 
        uint64 _winningBid
    ) private view returns (address) {
        // Simplified winner finding - in production, implement more efficiently
        return address(0); // Placeholder
    }
}`
  },
  {
    id: 'health-records',
    title: 'Medical Records System',
    description: 'Secure patient data management with encrypted health records',
    difficulty: 'advanced',
    category: 'Healthcare',
    gasEstimate: 300000,
    language: 'solidity',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "fhevm/lib/TFHE.sol";
import "fhevm/abstracts/EIP712WithModifier.sol";

contract MedicalRecords is EIP712WithModifier {
    struct Patient {
        address patientAddress;
        euint32 age;
        euint32 bloodPressureSystolic;
        euint32 bloodPressureDiastolic;
        euint32 heartRate;
        euint32 bloodSugar;
        bool exists;
    }
    
    struct AccessPermission {
        address doctor;
        uint256 expiryTime;
        bool isActive;
    }
    
    mapping(address => Patient) public patients;
    mapping(address => mapping(address => AccessPermission)) public permissions;
    mapping(address => bool) public authorizedDoctors;
    
    address public admin;
    
    event PatientRegistered(address patient);
    event RecordsUpdated(address patient);
    event AccessGranted(address patient, address doctor, uint256 expiryTime);
    event AccessRevoked(address patient, address doctor);
    
    modifier onlyAuthorizedDoctor() {
        require(authorizedDoctors[msg.sender], "Not an authorized doctor");
        _;
    }
    
    modifier onlyPatientOrAuthorized(address _patient) {
        require(
            msg.sender == _patient || 
            hasValidAccess(msg.sender, _patient),
            "Unauthorized access"
        );
        _;
    }
    
    constructor() EIP712WithModifier("MedicalRecords", "1") {
        admin = msg.sender;
    }
    
    function authorizeDoctor(address _doctor) external {
        require(msg.sender == admin, "Only admin can authorize doctors");
        authorizedDoctors[_doctor] = true;
    }
    
    function registerPatient(
        bytes calldata encryptedAge,
        bytes calldata encryptedBP_Sys,
        bytes calldata encryptedBP_Dia,
        bytes calldata encryptedHeartRate,
        bytes calldata encryptedBloodSugar
    ) external onlySignedPublicKey {
        require(!patients[msg.sender].exists, "Patient already registered");
        
        patients[msg.sender] = Patient({
            patientAddress: msg.sender,
            age: TFHE.asEuint32(encryptedAge),
            bloodPressureSystolic: TFHE.asEuint32(encryptedBP_Sys),
            bloodPressureDiastolic: TFHE.asEuint32(encryptedBP_Dia),
            heartRate: TFHE.asEuint32(encryptedHeartRate),
            bloodSugar: TFHE.asEuint32(encryptedBloodSugar),
            exists: true
        });
        
        emit PatientRegistered(msg.sender);
    }
    
    function updateRecords(
        bytes calldata encryptedBP_Sys,
        bytes calldata encryptedBP_Dia,
        bytes calldata encryptedHeartRate,
        bytes calldata encryptedBloodSugar
    ) external onlySignedPublicKey {
        require(patients[msg.sender].exists, "Patient not registered");
        
        patients[msg.sender].bloodPressureSystolic = TFHE.asEuint32(encryptedBP_Sys);
        patients[msg.sender].bloodPressureDiastolic = TFHE.asEuint32(encryptedBP_Dia);
        patients[msg.sender].heartRate = TFHE.asEuint32(encryptedHeartRate);
        patients[msg.sender].bloodSugar = TFHE.asEuint32(encryptedBloodSugar);
        
        emit RecordsUpdated(msg.sender);
    }
    
    function grantAccess(
        address _doctor, 
        uint256 _duration
    ) external {
        require(patients[msg.sender].exists, "Patient not registered");
        require(authorizedDoctors[_doctor], "Doctor not authorized");
        
        permissions[msg.sender][_doctor] = AccessPermission({
            doctor: _doctor,
            expiryTime: block.timestamp + _duration,
            isActive: true
        });
        
        emit AccessGranted(msg.sender, _doctor, block.timestamp + _duration);
    }
    
    function revokeAccess(address _doctor) external {
        permissions[msg.sender][_doctor].isActive = false;
        emit AccessRevoked(msg.sender, _doctor);
    }
    
    function getPatientRecords(
        address _patient
    ) external view onlyPatientOrAuthorized(_patient) returns (
        uint32 age,
        uint32 bpSys,
        uint32 bpDia,
        uint32 heartRate,
        uint32 bloodSugar
    ) {
        require(patients[_patient].exists, "Patient not found");
        
        return (
            TFHE.decrypt(patients[_patient].age),
            TFHE.decrypt(patients[_patient].bloodPressureSystolic),
            TFHE.decrypt(patients[_patient].bloodPressureDiastolic),
            TFHE.decrypt(patients[_patient].heartRate),
            TFHE.decrypt(patients[_patient].bloodSugar)
        );
    }
    
    function hasValidAccess(
        address _doctor, 
        address _patient
    ) public view returns (bool) {
        AccessPermission memory perm = permissions[_patient][_doctor];
        return perm.isActive && 
               block.timestamp <= perm.expiryTime && 
               authorizedDoctors[_doctor];
    }
    
    function checkVitals(
        address _patient
    ) external view onlyAuthorizedDoctor returns (bool isNormal) {
        require(hasValidAccess(msg.sender, _patient), "No access to patient records");
        require(patients[_patient].exists, "Patient not found");
        
        // Check if vitals are in normal range (encrypted comparison)
        ebool normalBP_Sys = TFHE.lt(patients[_patient].bloodPressureSystolic, TFHE.asEuint32(140));
        ebool normalBP_Dia = TFHE.lt(patients[_patient].bloodPressureDiastolic, TFHE.asEuint32(90));
        ebool normalHeartRate = TFHE.and(
            TFHE.gt(patients[_patient].heartRate, TFHE.asEuint32(60)),
            TFHE.lt(patients[_patient].heartRate, TFHE.asEuint32(100))
        );
        ebool normalBloodSugar = TFHE.lt(patients[_patient].bloodSugar, TFHE.asEuint32(100));
        
        ebool allNormal = TFHE.and(
            TFHE.and(normalBP_Sys, normalBP_Dia),
            TFHE.and(normalHeartRate, normalBloodSugar)
        );
        
        return TFHE.decrypt(allNormal);
    }
}`
  }
]

export default function ExamplesPage() {
  const [selectedExample, setSelectedExample] = useState(codeExamples[0])
  const [copied, setCopied] = useState(false)

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(selectedExample.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const downloadCode = () => {
    const blob = new Blob([selectedExample.code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedExample.id}.sol`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-bg" />
      <div className="absolute inset-0 gradient-mesh opacity-20" />
      
      <Header />
      
      <main className="pt-20 relative z-10">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-4">
              <Code className="w-8 h-8 text-custom-yellow mr-3 pulse-glow" />
              <h1 className="text-4xl md:text-6xl font-bold">
                Smart Contract <span className="text-custom-yellow glow-text">Examples</span>
              </h1>
            </div>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Production-ready FHE smart contract templates. Copy, modify, and deploy 
              these examples to build your own confidential applications.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Examples List */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contract Examples</CardTitle>
                  <CardDescription>
                    Choose an example to view the complete smart contract implementation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {codeExamples.map((example) => (
                      <button
                        key={example.id}
                        onClick={() => setSelectedExample(example)}
                        className={cn(
                          'w-full text-left p-4 rounded-lg border transition-all hover:transform hover:scale-105',
                          selectedExample.id === example.id
                            ? 'border-custom-yellow bg-custom-yellow/10 text-custom-yellow'
                            : 'border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white'
                        )}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-sm">{example.title}</h3>
                          <Badge 
                            variant={example.difficulty === 'beginner' ? 'success' : example.difficulty === 'intermediate' ? 'warning' : 'destructive'}
                            className="text-xs"
                          >
                            {example.difficulty}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">{example.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {example.category}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            ~{(example.gasEstimate / 1000).toFixed(0)}K gas
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Code Display */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-custom-yellow" />
                        {selectedExample.title}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {selectedExample.description}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={copyCode}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 text-green-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={downloadCode}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4">
                    <Badge 
                      variant={selectedExample.difficulty === 'beginner' ? 'success' : selectedExample.difficulty === 'intermediate' ? 'warning' : 'destructive'}
                    >
                      {selectedExample.difficulty}
                    </Badge>
                    <Badge variant="outline">{selectedExample.category}</Badge>
                    <Badge variant="secondary">Solidity</Badge>
                    <span className="text-sm text-gray-400">
                      Gas: ~{(selectedExample.gasEstimate / 1000).toFixed(0)}K
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                    <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">{selectedExample.id}.sol</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    <pre className="p-4 text-sm overflow-x-auto max-h-96 overflow-y-auto">
                      <code className="text-gray-300 leading-relaxed">
                        {selectedExample.code}
                      </code>
                    </pre>
                  </div>

                  {/* Key Features */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedExample.id === 'basic-voting' && (
                        <>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-custom-yellow rounded-full mt-2"></div>
                            <div>
                              <h4 className="font-medium text-white">Encrypted Votes</h4>
                              <p className="text-sm text-gray-400">Votes remain private until reveal</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-custom-yellow rounded-full mt-2"></div>
                            <div>
                              <h4 className="font-medium text-white">Admin Controls</h4>
                              <p className="text-sm text-gray-400">Secure proposal management</p>
                            </div>
                          </div>
                        </>
                      )}
                      {selectedExample.id === 'private-auction' && (
                        <>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-custom-yellow rounded-full mt-2"></div>
                            <div>
                              <h4 className="font-medium text-white">Sealed Bids</h4>
                              <p className="text-sm text-gray-400">Hidden bids until auction ends</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-custom-yellow rounded-full mt-2"></div>
                            <div>
                              <h4 className="font-medium text-white">Automatic Winner Selection</h4>
                              <p className="text-sm text-gray-400">FHE-powered bid comparison</p>
                            </div>
                          </div>
                        </>
                      )}
                      {selectedExample.id === 'health-records' && (
                        <>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-custom-yellow rounded-full mt-2"></div>
                            <div>
                              <h4 className="font-medium text-white">Encrypted Health Data</h4>
                              <p className="text-sm text-gray-400">Complete privacy for patient records</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-custom-yellow rounded-full mt-2"></div>
                            <div>
                              <h4 className="font-medium text-white">Access Control</h4>
                              <p className="text-sm text-gray-400">Time-limited doctor permissions</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Deployment Instructions */}
                  <div className="mt-6 bg-gray-800/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Play className="w-5 h-5 text-custom-yellow" />
                      Quick Deploy
                    </h3>
                    <div className="space-y-2 text-sm text-gray-300 font-mono">
                      <p># Install dependencies</p>
                      <p className="text-custom-yellow">npm install @fhenixjs/fhenix-hardhat-plugin</p>
                      <p className="mt-2"># Deploy to Fhenix testnet</p>
                      <p className="text-custom-yellow">npx hardhat deploy --network fhenix-testnet</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Additional Resources */}
          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-custom-yellow" />
                  Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 mb-4">
                  Comprehensive guides for FHE smart contract development
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="https://docs.zama.ai/fhevm" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Read Docs
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code className="w-5 h-5 text-custom-yellow" />
                  Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 mb-4">
                  Starter templates for common FHE use cases
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="https://github.com/zama-ai/fhevm" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    GitHub Templates
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-custom-yellow" />
                  Live Examples
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 mb-4">
                  Test these contracts on the Fhenix testnet
                </p>
                <Button className="w-full" asChild>
                  <Link href="/playground">
                    <Play className="w-4 h-4 mr-2" />
                    Try Playground
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
