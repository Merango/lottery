import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { expect } from "chai";

describe('LotteryHistory', () => {
    async function deployLotteryHistoryFixture() {
        const [owner, winner] = await ethers.getSigners();

        const LotteryHistory = await ethers.getContractFactory('LotteryHistory');
        const lotteryHistory = await LotteryHistory.deploy();

        return { lotteryHistory, owner, winner };
    }

    it('should record a lottery round', async () => {
        const { lotteryHistory, winner } = await loadFixture(deployLotteryHistoryFixture);

        const potSize = ethers.parseEther('10');
        const participantCount = 5;

        await lotteryHistory.recordLotteryRound(winner.address, potSize, participantCount);

        const roundCount = await lotteryHistory.getLotteryRoundCount();
        expect(roundCount).to.equal(1);

        const round = await lotteryHistory.getLotteryRoundByIndex(0);
        expect(round.winner).to.equal(winner.address);
        expect(round.potSize).to.equal(potSize);
        expect(round.participantCount).to.equal(participantCount);
    });

    it('should retrieve lottery round history', async () => {
        const { lotteryHistory, winner, owner } = await loadFixture(deployLotteryHistoryFixture);

        const potSize1 = ethers.parseEther('10');
        const participantCount1 = 5;
        const potSize2 = ethers.parseEther('20');
        const participantCount2 = 10;

        await lotteryHistory.recordLotteryRound(winner.address, potSize1, participantCount1);
        await lotteryHistory.recordLotteryRound(owner.address, potSize2, participantCount2);

        const history = await lotteryHistory.getLotteryRoundHistory();
        expect(history.length).to.equal(2);
        expect(history[0].winner).to.equal(winner.address);
        expect(history[1].winner).to.equal(owner.address);
    });

    it('should throw error for invalid round index', async () => {
        const { lotteryHistory } = await loadFixture(deployLotteryHistoryFixture);

        await expect(lotteryHistory.getLotteryRoundByIndex(0)).to.be.revertedWith('Invalid round index');
    });
});