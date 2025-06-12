import { expect } from 'vitest';
import { ethers } from 'hardhat';
import { LotteryHistory } from '../src/contracts/LotteryHistory.sol';

describe('LotteryHistory', () => {
    let lotteryHistory: LotteryHistory;
    let owner: any;
    let winner: any;

    beforeEach(async () => {
        [owner, winner] = await ethers.getSigners();
        const LotteryHistoryFactory = await ethers.getContractFactory('LotteryHistory');
        lotteryHistory = await LotteryHistoryFactory.deploy();
    });

    it('should record a lottery round', async () => {
        const potSize = ethers.parseEther('10');
        const participantCount = 5;

        await lotteryHistory.recordLotteryRound(winner.address, potSize, participantCount);

        const roundCount = await lotteryHistory.getLotteryRoundCount();
        expect(roundCount).toBe(1);

        const round = await lotteryHistory.getLotteryRoundByIndex(0);
        expect(round.winner).toBe(winner.address);
        expect(round.potSize).toBe(potSize);
        expect(round.participantCount).toBe(participantCount);
    });

    it('should retrieve lottery round history', async () => {
        const potSize1 = ethers.parseEther('10');
        const participantCount1 = 5;
        const potSize2 = ethers.parseEther('20');
        const participantCount2 = 10;

        await lotteryHistory.recordLotteryRound(winner.address, potSize1, participantCount1);
        await lotteryHistory.recordLotteryRound(owner.address, potSize2, participantCount2);

        const history = await lotteryHistory.getLotteryRoundHistory();
        expect(history.length).toBe(2);
        expect(history[0].winner).toBe(winner.address);
        expect(history[1].winner).toBe(owner.address);
    });

    it('should throw error for invalid round index', async () => {
        await expect(lotteryHistory.getLotteryRoundByIndex(0)).rejects.toThrow('Invalid round index');
    });
});