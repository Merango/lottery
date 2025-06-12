import { expect } from "chai";
import { ethers } from "hardhat";
import { Lottery } from "../typechain-types/contracts/Lottery";

describe("Lottery Statistics Methods", function () {
  let lottery: Lottery;
  let owner: any;
  let player1: any;
  let player2: any;

  beforeEach(async function () {
    const signers = await ethers.getSigners();
    owner = signers[0];
    player1 = signers[1];
    player2 = signers[2];

    const LotteryFactory = await ethers.getContractFactory("Lottery");
    lottery = await LotteryFactory.deploy() as Lottery;
    await lottery.deployed();
  });

  it("should track initial total rounds played", async function () {
    const initialRounds = await lottery.getTotalRoundsPlayed();
    expect(initialRounds).to.equal(0);
  });

  it("should retrieve round statistics after a lottery round", async function () {
    // Simulate a lottery round
    await lottery.connect(player1).enter({ value: ethers.utils.parseEther("0.01") });
    await lottery.connect(player2).enter({ value: ethers.utils.parseEther("0.01") });
    
    // Start picking winner
    await lottery.connect(owner).startPickingWinner();

    // Simulate VRF callback (simplified for testing)
    const randomNumber = 1; // Deterministic for testing
    await lottery.fulfillRandomWords(1, [randomNumber]);

    // Check round statistics
    const roundStats = await lottery.getRoundStatistics(1);
    expect(roundStats.roundId).to.equal(1);
    expect(roundStats.numberOfParticipants).to.equal(2);
    expect(roundStats.totalPotSize).to.equal(ethers.utils.parseEther("0.02"));
  });

  it("should calculate total historical pot size", async function () {
    // Simulate multiple lottery rounds
    await lottery.connect(player1).enter({ value: ethers.utils.parseEther("0.01") });
    await lottery.connect(owner).startPickingWinner();
    await lottery.fulfillRandomWords(1, [1]);

    await lottery.connect(player2).enter({ value: ethers.utils.parseEther("0.02") });
    await lottery.connect(owner).startPickingWinner();
    await lottery.fulfillRandomWords(2, [2]);

    const totalPotSize = await lottery.getTotalHistoricalPotSize();
    expect(totalPotSize).to.equal(ethers.utils.parseEther("0.03"));
  });

  it("should calculate average pot size", async function () {
    // Simulate multiple lottery rounds
    await lottery.connect(player1).enter({ value: ethers.utils.parseEther("0.01") });
    await lottery.connect(owner).startPickingWinner();
    await lottery.fulfillRandomWords(1, [1]);

    await lottery.connect(player2).enter({ value: ethers.utils.parseEther("0.02") });
    await lottery.connect(owner).startPickingWinner();
    await lottery.fulfillRandomWords(2, [2]);

    const averagePotSize = await lottery.getAveragePotSize();
    expect(averagePotSize).to.equal(ethers.utils.parseEther("0.015"));
  });
});