const { ethers, upgrades } = require("hardhat");

async function main() {
  const FlashMint = await ethers.getContractFactory("FlashMint");
  const contract = await upgrades.deployProxy(
    FlashMint,
    ["FlashMint", "FLASH", "https://your-base-uri.com/"], // name, symbol, baseURI
    { initializer: "initialize" }
  );
  await contract.deployed();
  console.log("FlashMint deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 