// scripts/deploy.js

// const hre = require("hardhat");

import hre from "hardhat";

async function main() {
  const MyContract = await hre.ethers.getContractFactory("Espoir");
  const myContract = await MyContract.deploy(30,false);

  // await myContract.deployed();

  console.log("MyContract deployed to:", await myContract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
