async function main() { 
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const CrowdfundingFactory = await ethers.getContractFactory("Crowdfunding");
  if (!CrowdfundingFactory) {
    console.error("Contract factory creation failed. Make sure the contract is compiled.");
    return;
  }
  console.log("Contract factory created...");

  let crowdfundingContract;
  try {
    crowdfundingContract = await CrowdfundingFactory.deploy();
    await crowdfundingContract.waitForDeployment();
    console.log("Contract deployment initiated...");
  } catch (error) {
    console.error("Error during contract deployment:", error);
    return;
  }

  console.log("Contract deployed successfully at:", crowdfundingContract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
