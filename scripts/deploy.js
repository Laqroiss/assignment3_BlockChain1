async function main() { 
  // Fetch the deployer's account (from the local network)
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Ensure the contract is compiled and available
  const CrowdfundingFactory = await ethers.getContractFactory("Crowdfunding");
  if (!CrowdfundingFactory) {
    console.error("Contract factory creation failed. Make sure the contract is compiled.");
    return;
  }
  console.log("Contract factory created...");

  // Deploy the contract and ensure deployment completes
  let crowdfundingContract;
  try {
    crowdfundingContract = await CrowdfundingFactory.deploy();
    await crowdfundingContract.waitForDeployment(); // Ensure deployment is complete
    console.log("Contract deployment initiated...");
  } catch (error) {
    console.error("Error during contract deployment:", error);
    return;
  }

  // The contract is now deployed, get the address
  console.log("Contract deployed successfully at:", crowdfundingContract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
