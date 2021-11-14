const hre = require("hardhat");

async function main() {
  const CudosContract = await hre.ethers.getContractFactory("Cudos");
  const contract = await CudosContract.deploy();

  await contract.deployed();

  console.log("Greeter deployed to:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
