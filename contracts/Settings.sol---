// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract GameSettings is Ownable {

    // 游戏参数
    uint8 public initialRockCards;  // 石头卡
    uint8 public initialPaperCards;  // 布卡
    uint8 public initialScissorsCards;  // 剪刀卡
    uint8 public initialDoubleCards;  // 翻倍卡
    uint256 public initialCreditPoints;  // 信用点数
    uint256 public gameDuration;  // 游戏持续时间
    uint256 public dealerRatio; // 庄家抽成比例
    bool public isGamePaused; // 游戏暂停状态
    bool public gameInitialized;  // 游戏初始状态


    // 事件通知
    event GameParametersUpdated(
        uint8 rockCards,
        uint8 paperCards,
        uint8 scissorsCards,
        uint8 doubleCards,
        uint256 creditPoint,
        uint256 duration,
        uint256 dealerRatio
    );

    event GamePaused(bool isPaused);

    constructor() {
        // 设置默认值
        initialRockCards = 4;
        initialPaperCards = 4;
        initialScissorsCards = 4;
        initialDoubleCards = 2;
        initialCreditPoints = 3;
        gameDuration = 10 minutes;
        dealerRatio = 250; // 默认2.5%的庄家抽成
        isGamePaused = false;
    }

    // 初始化默认游戏参数
    function initializeGame(
        uint8 _rockCards,
        uint8 _paperCards,
        uint8 _scissorsCards,
        uint256 _doubleCards,
        uint256 _creditPoint,
        uint256 _dealerRatio,
        uint256 _gameDuration
    ) external onlyOwner {
        require(!gameInitialized, "Game is already initialized");
        
        initialRockCards = _rockCards;
        initialPaperCards = _paperCards;
        initialScissorsCards = _scissorsCards;
        initialDoubleCards = _doubleCards;
        initialCreditPoints = _creditPoint;
        dealerRatio = _dealerRatio;
        gameDuration = _gameDuration;

        gameInitialized = true;

        emit GameParametersInitialized(
            _rockCards,
            _paperCards,
            _scissorsCards,
            _doubleCards,
            _creditPoint,
            _dealerRatio,
            _gameDuration
        );
    }

    // 更新游戏参数
    function updateGameParameters(
        uint8 _rockCards,
        uint8 _paperCards,
        uint8 _scissorsCards,
        uint256 _doubleCards,
        uint256 _creditPoint,
        uint256 _dealerRatio,
        uint256 _gameDuration
    ) external onlyOwner {
        initialRockCards = _rockCards;
        initialPaperCards = _paperCards;
        initialScissorsCards = _scissorsCards;
        initialDoubleCards = _doubleCards;
        initialCreditPoints = _creditPoint;
        dealerRatio = _dealerRatio;
        gameDuration = _gameDuration;

        emit GameParametersUpdated(
            _rockCards,
            _paperCards,
            _scissorsCards,
            _doubleCards,
            _creditPoint,
            _dealerRatio,
            _gameDuration
        );
    }
    // 获取卡牌及道具参数
    function getInitialCardCounts() external view returns (uint8, uint8, uint8) {
        return (initialRockCards, initialPaperCards, initialScissorsCards, initialDoubleCards);
    }
    // 获取游戏配置参数
    function getGameSettings() external view returns (uint256, uint256) {
        return (initialCreditPoints, dealerRatio, gameDuration);
    }

    // 设置庄家抽成比例
    function setDealerRatio(uint256 _dealerRatio) external onlyOwner {
        require(_dealerRatio <= 1000, "Dealer ratio cannot exceed 10%");
        dealerRatio = _dealerRatio;
        emit GameParametersUpdated(
            initialRockCards,
            initialPaperCards,
            initialScissorsCards,
            initialDoubleCards,
            initialCreditPoints,
            dealerRatio,
            gameDuration
        );
    }

    // 暂停游戏
    function pauseGame() external onlyOwner {
        gameInitialized = false;
    }

    // 恢复游戏
    function resumeGame() external onlyOwner {
        gameInitialized = true;
    }

    // 获取游戏状态
    function getGameStatus() external view returns (bool) {
        return isGamePaused;
    }

}
