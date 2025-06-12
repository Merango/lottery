// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./VRFv2DirectFundingConsumer.sol";

contract Lottery is ConfirmedOwner, VRFv2DirectFundingConsumer {
    using SafeMath for uint256;

    address payable[] public players;
    address[] public winners;
    uint256 public lotteryId;
    uint256 public potWidthdrawalEndTime;

    // New struct to track lottery round statistics
    struct LotteryRoundStats {
        uint256 roundId;
        uint256 totalPotSize;
        uint256 numberOfParticipants;
        address winner;
        uint256 timestamp;
    }

    // Mapping to store lottery round statistics
    mapping(uint256 => LotteryRoundStats) public lotteryRoundStatistics;

    event PlayerEntered(address indexed player, uint256 amount);
    event WinnerPicked(address indexed winner, uint256 amount);
    event LotteryReset(uint256 indexed lotteryId);
    event Received(address, uint);

    constructor() VRFv2DirectFundingConsumer() {
        lotteryId = 1;
        potWidthdrawalEndTime = block.timestamp;
    }

    // Existing methods remain the same...

    function finishPickingWinner(uint256 _randomNumber) internal {
        uint256 randomPlayerIndex = _randomNumber % players.length;
        address payable winner = players[randomPlayerIndex];
        uint256 pot = address(this).balance;
        winners.push(winner);

        // Store lottery round statistics
        lotteryRoundStatistics[lotteryId] = LotteryRoundStats({
            roundId: lotteryId,
            totalPotSize: pot,
            numberOfParticipants: players.length,
            winner: winner,
            timestamp: block.timestamp
        });

        lotteryId = lotteryId.add(1);

        emit WinnerPicked(winner, pot);
        emit LotteryReset(lotteryId);

        players = new address payable[](0);
        potWidthdrawalEndTime = block.timestamp + 10 minutes;
    }

    // New getter methods for lottery statistics
    function getTotalRoundsPlayed() public view returns (uint256) {
        return lotteryId - 1; // Subtract 1 as lotteryId starts at 1
    }

    function getRoundStatistics(uint256 roundId) public view returns (LotteryRoundStats memory) {
        require(roundId > 0 && roundId < lotteryId, "Invalid round ID");
        return lotteryRoundStatistics[roundId];
    }

    function getTotalHistoricalPotSize() public view returns (uint256 totalPotSize) {
        for (uint256 i = 1; i < lotteryId; i++) {
            totalPotSize += lotteryRoundStatistics[i].totalPotSize;
        }
    }

    function getAveragePotSize() public view returns (uint256) {
        uint256 totalRounds = getTotalRoundsPlayed();
        if (totalRounds == 0) return 0;
        return getTotalHistoricalPotSize() / totalRounds;
    }

    function getMostFrequentWinners() public view returns (address[] memory) {
        // Placeholder implementation - could be expanded with more complex tracking
        return winners;
    }

    // Existing methods remain the same...
}