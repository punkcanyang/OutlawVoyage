// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OutlawVoyage {
    // 系统参数
    uint256 public dealerFeePercentage;
    bool public isGamePaused;

    // 船班结构
    struct Voyage {
        uint256 voyageId;
        uint256 entryFee;
        uint256 startBlock;
        uint256 waitingBlocks;
        uint256 gameDurationBlocks;
    }

    // 船只结构
    struct Ship {
        uint256 shipId;
        uint256 voyageId;
        bool isSettled;
        mapping(string => uint256) cardCounts; // 使用映射以节省Gas
        uint256 playerCount;
        uint256 tableCount;
        mapping(uint256 => Table) tables;
        mapping(address => Player) players;
    }

    // Table结构
    struct Table {
        uint256 tableId;
        string firstHash;
        string firstPlain;
        string secondHash;
        string secondPlain;
        bool isFinished;
    }

    // 玩家结构
    struct Player {
        address walletAddress;
        string tgId;
        uint256 starCount;
        string status; // 状态：游戏中，0星出局，犯规出局，胜，负
        mapping(string => bool) cards; // 卡牌HASH
    }

    // 全局玩家清单
    struct GlobalPlayer {
        address walletAddress;
        uint256 winCount;
        uint256 loseCount;
    }

    // 交易结构
    struct Trade {
        uint256 tradeId;
        string firstHash;
        address firstOwner;
        string secondHash;
        address secondOwner;
    }

    // 船班列表
    mapping(uint256 => Voyage) public voyages;
    uint256 public nextVoyageId;

    // 船只列表
    mapping(uint256 => Ship) public ships;
    uint256 public nextShipId;

    // 全局玩家列表
    mapping(address => GlobalPlayer) public globalPlayers;

    // 交易大厅
    mapping(uint256 => Trade) public trades;
    uint256 public nextTradeId;

    // Owner地址
    address public owner;

    // 构造函数
    constructor(uint256 _dealerFeePercentage) {
        owner = msg.sender;
        dealerFeePercentage = _dealerFeePercentage;
        isGamePaused = false;
        nextVoyageId = 1;
        nextShipId = 1;
        nextTradeId = 1;
    }

    // 修改器：仅限Owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    // 设置系统参数（仅限Owner）
    function setSystemParams(uint256 _dealerFeePercentage, bool _isGamePaused) public onlyOwner {
        dealerFeePercentage = _dealerFeePercentage;
        isGamePaused = _isGamePaused;
    }

    // 设置船班（仅限Owner）
    function setVoyage(uint256 entryFee, uint256 waitingBlocks, uint256 gameDurationBlocks) public onlyOwner {
        voyages[nextVoyageId] = Voyage(nextVoyageId, entryFee, block.number, waitingBlocks, gameDurationBlocks);
        nextVoyageId++;
    }

    // 创建船只
    function createShip(uint256 voyageId) public {
        require(!isGamePaused, "Game is paused");
        require(voyages[voyageId].voyageId == voyageId, "Voyage does not exist");

        ships[nextShipId].shipId = nextShipId;
        ships[nextShipId].voyageId = voyageId;
        ships[nextShipId].isSettled = false;
        ships[nextShipId].playerCount = 0;
        ships[nextShipId].tableCount = 0;

        nextShipId++;
    }

    // 玩家报名
    function registerPlayer(uint256 shipId, string memory tgId, string[] memory cardHashes) public payable {
        require(!isGamePaused, "Game is paused");
        require(ships[shipId].shipId == shipId, "Ship does not exist");
        require(msg.value == voyages[ships[shipId].voyageId].entryFee, "Incorrect entry fee");

        ships[shipId].players[msg.sender].walletAddress = msg.sender;
        ships[shipId].players[msg.sender].tgId = tgId;
        ships[shipId].players[msg.sender].starCount = 0;
        ships[shipId].players[msg.sender].status = "playing";

        for (uint256 i = 0; i < cardHashes.length; i++) {
            ships[shipId].players[msg.sender].cards[cardHashes[i]] = true;
        }

        ships[shipId].playerCount++;
    }

    // 检查出牌的hash是否合规
    function checkCardHash(uint256 shipId, string memory cardHash) public view returns (bool) {
        require(ships[shipId].shipId == shipId, "Ship does not exist");
        return ships[shipId].players[msg.sender].cards[cardHash];
    }

    // 明文检查
    function checkPlain(uint256 shipId, string memory cardHash, string memory cardPlain) public view returns (bool) {
        require(ships[shipId].shipId == shipId, "Ship does not exist");
        // 使用keccak256检查hash
        return keccak256(abi.encodePacked(cardPlain)) == keccak256(abi.encodePacked(cardHash));
    }

    // 创建Table
    function createTable(uint256 shipId, string memory cardHash) public {
        require(!isGamePaused, "Game is paused");
        require(ships[shipId].shipId == shipId, "Ship does not exist");
        require(!ships[shipId].isSettled, "Ship is settled");
        require(ships[shipId].tables[ships[shipId].tableCount].isFinished, "Table is active");

        ships[shipId].tables[ships[shipId].tableCount].tableId = ships[shipId].tableCount;
        ships[shipId].tables[ships[shipId].tableCount].firstHash = cardHash;
        ships[shipId].tableCount++;
    }

    // 加入Table
    function joinTable(uint256 shipId, uint256 tableId, string memory cardHash) public {
        require(!isGamePaused, "Game is paused");
        require(ships[shipId].shipId == shipId, "Ship does not exist");
        require(!ships[shipId].isSettled, "Ship is settled");
        require(!ships[shipId].tables[tableId].isFinished, "Table is finished");
        require(ships[shipId].players[msg.sender].cards[cardHash], "Invalid card hash");

        ships[shipId].tables[tableId].secondHash = cardHash;
    }

    // 提交明文
    function submitPlain(uint256 shipId, uint256 tableId, string memory cardPlain) public {
        require(!isGamePaused, "Game is paused");
        require(ships[shipId].shipId == shipId, "Ship does not exist");
        require(!ships[shipId].isSettled, "Ship is settled");
        require(!ships[shipId].tables[tableId].isFinished, "Table is finished");

        Table storage table = ships[shipId].tables[tableId];
        Player storage player = ships[shipId].players[msg.sender];

        if (keccak256(abi.encodePacked(cardPlain)) == keccak256(abi.encodePacked(table.firstHash))) {
            table.firstPlain = cardPlain;
        } else if (keccak256(abi.encodePacked(cardPlain)) == keccak256(abi.encodePacked(table.secondHash))) {
            table.secondPlain = cardPlain;
            table.isFinished = true;
            // 结算Table，这里简单地加一颗星星作为示例
            player.starCount++;
        } else {
            revert("Invalid plain text");
        }
    }

    // 更多功能的实现可以继续扩展...

    // 资金提取（仅限Owner）
    function withdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
