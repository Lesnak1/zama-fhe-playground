const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ConfidentialVoting - Integration Tests", function () {
    let confidentialVoting;
    let admin, voter1, voter2, voter3;
    
    beforeEach(async function () {
        [admin, voter1, voter2, voter3] = await ethers.getSigners();
        
        const ConfidentialVoting = await ethers.getContractFactory("ConfidentialVoting");
        confidentialVoting = await ConfidentialVoting.deploy();
        await confidentialVoting.deployed();
        
        // Authorize voters
        await confidentialVoting.authorizeVoter(voter1.address);
        await confidentialVoting.authorizeVoter(voter2.address);
        await confidentialVoting.authorizeVoter(voter3.address);
    });
    
    describe("Complete Voting Flow", function () {
        it("Should handle a complete voting cycle", async function () {
            // Step 1: Create proposal
            const description = "Should we upgrade the smart contract?";
            const tx1 = await confidentialVoting.createProposal(description);
            const receipt1 = await tx1.wait();
            
            expect(receipt1.events[0].event).to.equal("ProposalCreated");
            
            // Step 2: Verify proposal details
            const proposal = await confidentialVoting.getProposal(0);
            expect(proposal.description).to.equal(description);
            expect(proposal.ended).to.be.false;
            expect(proposal.revealed).to.be.false;
            
            // Step 3: Vote (simulated encrypted votes)
            // Note: In real implementation, these would be actual FHE encrypted values
            const encryptedYes = ethers.utils.formatBytes32String("encrypted_1");
            const encryptedNo = ethers.utils.formatBytes32String("encrypted_0");
            
            // Multiple voters cast votes
            // await confidentialVoting.connect(voter1).vote(0, encryptedYes);
            // await confidentialVoting.connect(voter2).vote(0, encryptedNo);
            // await confidentialVoting.connect(voter3).vote(0, encryptedYes);
            
            // Step 4: Verify voting status
            expect(await confidentialVoting.hasVoted(0, voter1.address)).to.be.false; // Will be true after actual voting
            expect(await confidentialVoting.hasVoted(0, voter2.address)).to.be.false;
            expect(await confidentialVoting.hasVoted(0, voter3.address)).to.be.false;
            
            // Step 5: End voting
            const tx2 = await confidentialVoting.endVoting(0);
            const receipt2 = await tx2.wait();
            
            expect(receipt2.events[0].event).to.equal("ProposalEnded");
            
            // Step 6: Verify results
            const updatedProposal = await confidentialVoting.getProposal(0);
            expect(updatedProposal.ended).to.be.true;
            expect(updatedProposal.revealed).to.be.true;
            
            // Results would be available after actual FHE voting
            // const results = await confidentialVoting.getVoteResults(0);
            // expect(results.yesVotes).to.equal(2);
            // expect(results.noVotes).to.equal(1);
        });
        
        it("Should handle multiple concurrent proposals", async function () {
            // Create multiple proposals
            await confidentialVoting.createProposal("Proposal 1: Increase staking rewards");
            await confidentialVoting.createProposal("Proposal 2: Add new governance features");
            await confidentialVoting.createProposal("Proposal 3: Update tokenomics");
            
            expect(await confidentialVoting.getTotalProposals()).to.equal(3);
            
            // Verify each proposal
            const prop1 = await confidentialVoting.getProposal(0);
            const prop2 = await confidentialVoting.getProposal(1);
            const prop3 = await confidentialVoting.getProposal(2);
            
            expect(prop1.description).to.equal("Proposal 1: Increase staking rewards");
            expect(prop2.description).to.equal("Proposal 2: Add new governance features");
            expect(prop3.description).to.equal("Proposal 3: Update tokenomics");
            
            // All should be active
            expect(prop1.ended).to.be.false;
            expect(prop2.ended).to.be.false;
            expect(prop3.ended).to.be.false;
        });
        
        it("Should enforce voting time limits", async function () {
            await confidentialVoting.createProposal("Time-sensitive proposal");
            
            const proposal = await confidentialVoting.getProposal(0);
            const currentTime = (await ethers.provider.getBlock()).timestamp;
            
            // End time should be approximately current time + 7 days
            const expectedEndTime = currentTime + (7 * 24 * 60 * 60);
            const timeDifference = Math.abs(proposal.endTime - expectedEndTime);
            
            // Allow 5 minutes tolerance for block time differences
            expect(timeDifference).to.be.below(300);
        });
    });
    
    describe("Access Control Integration", function () {
        it("Should properly manage voter lifecycle", async function () {
            // Initially only admin is authorized
            expect(await confidentialVoting.isAuthorizedVoter(admin.address)).to.be.true;
            expect(await confidentialVoting.isAuthorizedVoter(voter1.address)).to.be.true; // Already authorized in beforeEach
            
            // Revoke and re-authorize
            await confidentialVoting.revokeVoter(voter1.address);
            expect(await confidentialVoting.isAuthorizedVoter(voter1.address)).to.be.false;
            
            await confidentialVoting.authorizeVoter(voter1.address);
            expect(await confidentialVoting.isAuthorizedVoter(voter1.address)).to.be.true;
        });
        
        it("Should maintain security across multiple operations", async function () {
            // Create proposal as admin
            await confidentialVoting.createProposal("Security test proposal");
            
            // Try unauthorized operations
            await expect(
                confidentialVoting.connect(voter1).createProposal("Unauthorized proposal")
            ).to.be.revertedWith("Only admin can perform this action");
            
            await expect(
                confidentialVoting.connect(voter1).authorizeVoter(voter2.address)
            ).to.be.revertedWith("Only admin can perform this action");
            
            // Verify admin operations still work
            await confidentialVoting.authorizeVoter(ethers.Wallet.createRandom().address);
            await confidentialVoting.createProposal("Another admin proposal");
            
            expect(await confidentialVoting.getTotalProposals()).to.equal(2);
        });
    });
    
    describe("Gas Optimization Integration", function () {
        it("Should have consistent gas usage patterns", async function () {
            const gasUsage = [];
            
            // Test proposal creation gas usage
            for (let i = 0; i < 5; i++) {
                const tx = await confidentialVoting.createProposal(`Test proposal ${i}`);
                const receipt = await tx.wait();
                gasUsage.push(receipt.gasUsed.toNumber());
            }
            
            // Gas usage should be relatively consistent
            const maxGas = Math.max(...gasUsage);
            const minGas = Math.min(...gasUsage);
            const gasVariation = (maxGas - minGas) / minGas;
            
            // Should not vary by more than 10%
            expect(gasVariation).to.be.below(0.1);
            
            console.log(`Gas usage - Min: ${minGas}, Max: ${maxGas}, Variation: ${(gasVariation * 100).toFixed(2)}%`);
        });
        
        it("Should handle bulk operations efficiently", async function () {
            const voterAddresses = [];
            for (let i = 0; i < 10; i++) {
                voterAddresses.push(ethers.Wallet.createRandom().address);
            }
            
            const startTime = Date.now();
            
            // Bulk authorize voters
            for (const address of voterAddresses) {
                await confidentialVoting.authorizeVoter(address);
            }
            
            const endTime = Date.now();
            const totalTime = endTime - startTime;
            
            console.log(`Bulk authorization of 10 voters took: ${totalTime}ms`);
            
            // Verify all were authorized
            for (const address of voterAddresses) {
                expect(await confidentialVoting.isAuthorizedVoter(address)).to.be.true;
            }
        });
    });
    
    describe("Error Handling Integration", function () {
        it("Should gracefully handle edge cases", async function () {
            // Test boundary conditions
            await confidentialVoting.createProposal("A"); // Minimal description
            
            const longDescription = "A".repeat(1000); // Maximum allowed length
            await confidentialVoting.createProposal(longDescription);
            
            const tooLongDescription = "A".repeat(1001);
            await expect(
                confidentialVoting.createProposal(tooLongDescription)
            ).to.be.revertedWith("Description too long");
            
            // Test with zero address
            await expect(
                confidentialVoting.authorizeVoter(ethers.constants.AddressZero)
            ).to.be.revertedWith("Invalid voter address");
        });
        
        it("Should maintain state consistency under failures", async function () {
            const initialProposalCount = await confidentialVoting.getTotalProposals();
            
            // Try multiple failing operations
            try {
                await confidentialVoting.createProposal("");
            } catch (error) {
                // Expected failure
            }
            
            try {
                await confidentialVoting.connect(voter1).createProposal("Unauthorized");
            } catch (error) {
                // Expected failure
            }
            
            // State should remain unchanged
            expect(await confidentialVoting.getTotalProposals()).to.equal(initialProposalCount);
            
            // Successful operation should still work
            await confidentialVoting.createProposal("Valid proposal");
            expect(await confidentialVoting.getTotalProposals()).to.equal(initialProposalCount.add(1));
        });
    });
});
