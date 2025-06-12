// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LotteryHistory {
    struct LotteryRound {
        uint256 roundNumber;
        uint256 timestamp;
        address winner;
        uint256 potSize;
        uint256 participantCount;
    }

    LotteryRound[] public lotteryRounds;

    event LotteryRoundRecorded(
        uint256 indexed roundNumber, 
        uint256 timestamp, 
        address indexed winner, 
        uint256 potSize,
        uint256 participantCount
    );

    function recordLotteryRound(
        address _winner, 
        uint256 _potSize, 
        uint256 _participantCount
    ) external {
        uint256 roundNumber = lotteryRounds.length + 1;
        LotteryRound memory newRound = LotteryRound({
            roundNumber: roundNumber,
            timestamp: block.timestamp,
            winner: _winner,
            potSize: _potSize,
            participantCount: _participantCount
        });

        lotteryRounds.push(newRound);

        emit LotteryRoundRecorded(
            roundNumber, 
            block.timestamp, 
            _winner, 
            _potSize,
            _participantCount
        );
    }

    function getLotteryRoundHistory() external view returns (LotteryRound[] memory) {
        return lotteryRounds;
    }

    function getLotteryRoundCount() external view returns (uint256) {
        return lotteryRounds.length;
    }

    function getLotteryRoundByIndex(uint256 _index) external view returns (LotteryRound memory) {
        require(_index < lotteryRounds.length, "Invalid round index");
        return lotteryRounds[_index];
    }
}