// scripts/deploy.js

const hre = require("hardhat");

async function main() {
  const MyContract = await hre.ethers.getContractFactory("Espoir");
  const myContract = await MyContract.deploy(30,false);




  await myContract.deployed();

  console.log("MyContract deployed to:", myContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
