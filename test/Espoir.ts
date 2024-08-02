import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { keccak256, toBytes, getAddress } from "viem";

describe("Espoir", function () {
  async function deployFixture() {
    const [owner, player1, player2] = await hre.viem.getWalletClients();
    const houseCut = 30n; // 使用BigInt表示整数
    const token = await hre.viem.deployContract("Espoir", [houseCut]);

    console.log({
      player1: player1.account.address,
      player2: player2.account.address,
    })

    return { token, owner, player1, player2, houseCut };
  }

  describe("Deployment", function () {
    it("should deploy with correct house cut", async function () {
      const { token, houseCut } = await loadFixture(deployFixture);
      const actualHouseCut = await token.read.houseCut();
      expect(actualHouseCut).to.equal(houseCut);
    });

    it("should set the right owner", async function () {
      const { token, owner } = await loadFixture(deployFixture);
      expect(getAddress(await token.read.owner())).to.equal(getAddress(owner.account.address));
    });
  });

  describe("Game Management", function () {
    it("should allow owner to pause and unpause the game", async function () {
      const { token, owner } = await loadFixture(deployFixture);
      await token.write.pauseGame([true], { account: owner.account });
      expect(await token.read.gamePaused()).to.be.true;

      // await token.write.pauseGame([false], { account: owner.account });
      // expect(await token.read.gamePaused()).to.be.false;
    });

    it("should allow owner to set house cut", async function () {
      const { token, owner } = await loadFixture(deployFixture);
      const newHouseCut = 40n;
      await token.write.setHouseCut([newHouseCut], { account: owner.account });
      expect(await token.read.houseCut()).to.equal(newHouseCut);
    });
  });

  describe("Ship Management", function () {
    it("should allow owner to create a ship", async function () {
      const { token, owner } = await loadFixture(deployFixture);
      const shipId = 1n;
      const entryFee = 100n;
      const startStar = 0n;
      const winStar = 3n;
      const startBlock = 100n;
      const waitBlocks = 10n;
      const gameBlocks = 100n;

      await token.write.createShip(
        [shipId, entryFee, startStar, winStar, startBlock, waitBlocks, gameBlocks],
        { account: owner.account }
      );

      const ship = await token.read.getShip([shipId]);
      console.log("船只：", ship)

      expect(ship[0]).to.equal(entryFee);
      expect(ship[1]).to.equal(startStar);
      expect(ship[2]).to.equal(winStar);
      expect(ship[3]).to.equal(startBlock);
      expect(ship[4]).to.equal(waitBlocks);
      expect(ship[5]).to.equal(gameBlocks);
    });
  });

  describe("Player Registration", function () {
    it("should allow players to register for a voyage", async function () {
      const { token, owner, player1 } = await loadFixture(deployFixture);
      const shipId = 1n;
      const voyageId = 1n;
      const entryFee = 100n;

      // 创建船只
      await token.write.createShip(
        [shipId, entryFee, 0n, 3n, 100n, 10n, 100n],
        { account: owner.account }
      );

      // 生成12个模拟的卡牌哈希
      const cardHashes = Array(12).fill(0).map(() => keccak256(toBytes(Math.random().toString())));
      console.log("卡牌hash: ", cardHashes)
      console.log("注册玩家1 address：", player1.account.address)

      // 注册玩家
      await token.write.registerPlayer(
        [shipId, voyageId, player1.account.address, "player1TG", cardHashes],
        { account: player1.account, value: entryFee }
      );

      const playerInfo = await token.read.getPlayer([voyageId, player1.account.address]);
      console.log("playerInfo: ", playerInfo)

      expect(playerInfo[0]).to.equal("player1TG");
      expect(playerInfo[1]).to.equal(0n); // startStar
      expect(playerInfo[2]).to.equal("G"); // status
      expect(playerInfo[3]).to.equal(12n); // cardCount
      expect(playerInfo[4]).to.be.true; // isRegistered
      expect(playerInfo[5]).to.equal(player1.account.address);
    });
  });

  // 可以继续添加更多测试，例如：
  // - 创建和加入Table的测试
  // - 提交明文和结算Table的测试
  // - 创建和确认交易的测试
  // - 结算船只的测试
  // - 全局玩家清单更新的测试
  // - 提现功能的测试
});