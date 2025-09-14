const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Starting deployment of Zama FHE contracts...\n");
    
    // Get the deployer account
    const [deployer] = await ethers.getSigners();
    console.log("📝 Deploying contracts with account:", deployer.address);
    console.log("💰 Account balance:", (await deployer.getBalance()).toString(), "wei\n");
    
    // Deploy ConfidentialVoting
    console.log("🔐 Deploying ConfidentialVoting contract...");
    const ConfidentialVoting = await ethers.getContractFactory("ConfidentialVoting");
    const confidentialVoting = await ConfidentialVoting.deploy();
    await confidentialVoting.deployed();
    
    console.log("✅ ConfidentialVoting deployed to:", confidentialVoting.address);
    console.log("🔗 Transaction hash:", confidentialVoting.deployTransaction.hash);
    
    // Wait for a few block confirmations
    console.log("⏳ Waiting for block confirmations...");
    await confidentialVoting.deployTransaction.wait(2);
    
    // Verify deployment
    console.log("🔍 Verifying deployment...");
    const admin = await confidentialVoting.admin();
    const totalProposals = await confidentialVoting.getTotalProposals();
    
    console.log("👑 Admin address:", admin);
    console.log("📊 Initial proposal count:", totalProposals.toString());
    
    // Create a test proposal (optional)
    if (process.env.CREATE_TEST_PROPOSAL === "true") {
        console.log("\n🗳️  Creating test proposal...");
        const tx = await confidentialVoting.createProposal(
            "Should we implement confidential token transfers in the next version?"
        );
        await tx.wait();
        
        console.log("✅ Test proposal created");
        console.log("📋 Total proposals now:", (await confidentialVoting.getTotalProposals()).toString());
    }
    
    // Save deployment info to file
    const fs = require('fs');
    const deploymentInfo = {
        network: hre.network.name,
        chainId: (await ethers.provider.getNetwork()).chainId,
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
        contracts: {
            ConfidentialVoting: {
                address: confidentialVoting.address,
                transactionHash: confidentialVoting.deployTransaction.hash,
                blockNumber: confidentialVoting.deployTransaction.blockNumber,
                gasUsed: confidentialVoting.deployTransaction.gasLimit?.toString(),
            }
        }
    };
    
    const deploymentPath = `./deployments/${hre.network.name}.json`;
    fs.mkdirSync('./deployments', { recursive: true });
    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
    
    console.log(`\n📁 Deployment info saved to: ${deploymentPath}`);
    
    // Display summary
    console.log("\n" + "=".repeat(60));
    console.log("🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(60));
    console.log("🌐 Network:", hre.network.name);
    console.log("🔐 ConfidentialVoting:", confidentialVoting.address);
    console.log("👑 Admin:", admin);
    console.log("💡 Remember to:");
    console.log("   • Verify contracts on block explorer");
    console.log("   • Update frontend with contract addresses");
    console.log("   • Test all functions before mainnet deployment");
    console.log("=".repeat(60) + "\n");
}

// Handle deployment errors
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Deployment failed:");
        console.error(error);
        process.exit(1);
    });
