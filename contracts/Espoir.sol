// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Espoir is Ownable {

    constructor(uint _houseCut) Ownable(msg.sender){
        houseCut = _houseCut;
    }
    // 系统相关
    uint public houseCut; // 庄家抽成比例
    bool public gamePaused; // 游戏是否暂停
    // 船相关
    struct Ship {
        uint entryFee; // 入场金
        uint startStar; // 起始星星数
        uint winStar; //获胜星星数
        uint startBlock; // 起始区块
        uint waitBlocks; // 等候报名时间（等候几个区块）
        uint gameBlocks; // 游戏时间（历经几个区块）
    }
    mapping(uint => Ship) public ships; // 船映射
    // Table相关
    struct Table {
        bytes32 firstHash; // 第一组Hash
        string firstPlaintext; // 第一组明文
        bytes32 secondHash; // 第二组Hash
        string secondPlaintext; // 第二组明文
        address firstOwner; // 第一组Hash归属钱包地址
        address secondOwner; // 第二组Hash归属钱包地址
        bool isEnded; // 是否结束
    }
    // 玩家信息
    struct Player {
        string tgId; // TG ID
        uint stars; // 星星数量
        string status; // 状态（游戏中:G，0星出局:Z，犯规出局:O，胜:W）
        uint cardCount; //手上剩余牌数，如果完成一局Table，则扣1
        mapping(bytes32 => bool) cards; // 卡牌（用卡牌HASH作为Key），如果换牌了，玩家旧牌false，并增加新牌
        bool isRegistered; // 用来检查是否已报名
        address walletAddress; // 玩家钱包地址
    }
    // 交易状态
    enum TradeStatus {
        FirstOwnCheckPass, // 第一方检查通过
        SenondOwnCheckPass, // 第二方检查通过
        ToBeConfirmed, // 双方检查通过，带确定交换
        Completed // 交换完成
    }
    // 交易信息
    struct Trade {
        bytes32 firstHash; // 第一组Hash，原本归属钱包地址
        address firstOwner; // 第一组Hash的 原本归属钱包地址
        bytes32 secondHash; // 第二组Hash，原本归属钱包地址
        address secondOwner; // 第二组Hash的原本归属钱包地址
        bool isCompleted; //交易是否完成，避免有人一牌多换，最后检查双方牌归属都是正确的，Hash都是正确，才执行交换
        TradeStatus status;
    }
    // 船班，一班就是一场游戏   
    struct Voyage {
        uint shipId; // 船编号
        bool isSettled; // 状态：是否结算
        mapping(string => uint256) cardCounts; // R: 石头，P: 布，S:剪刀 卡牌数量（三种牌分开计数）使用映射以节省Gas
        uint playerCount; // 全部玩家数量（不论死活）
        uint playerOut; //出局玩家数量
        uint tablesCount; //当前活跃桌数，如果Table被创建+1,如果Table对决结束-1，用来检查能不能开新桌
        address[] playerArr; // 玩家数组
        mapping(uint => Table) tables; // Table映射
        mapping(address => Player) players; // 玩家映射
        mapping(string => Trade) trades; // 交易厅映射
    }

    mapping(uint => Voyage) public voyages; // 船班映射


    // 全局玩家清单
    struct GlobalPlayer {
        uint wins; // 胜数
        uint losses; // 败数
    }

    mapping(address => GlobalPlayer) public globalPlayers; // 全局玩家映射

    // 系统相关功能
    // 设定抽成比例，例如30，就是先扣除30%
    function setHouseCut(uint _houseCut) public onlyOwner {
        houseCut = _houseCut;
    }

    //暂停游戏的设计，主要是怕万一这个有bug，用户又继续玩出问题
    function pauseGame(bool _pause) public onlyOwner {
        gamePaused = _pause;
    }

    // - 设计和开发船班的相关逻辑，包括编号、入场金、起始区块、等候报名时间和游戏时间等。
    // - 负责创建船只的逻辑，包括船只的编号、状态、卡牌数量、玩家数量等。

    // 船相关功能
    //
    function createShip(
        uint _id,
        uint _entryFee,
        uint _startStar,
        uint _winStar,
        uint _startBlock,
        uint _waitBlocks,
        uint _gameBlocks
    ) public onlyOwner {
        ships[_id] = Ship({
            entryFee: _entryFee,
            startStar: _startStar,
            winStar: _winStar,
            startBlock: _startBlock,
            waitBlocks: _waitBlocks,
            gameBlocks: _gameBlocks
        });
    }

    function getShip(uint _id) public view returns (Ship memory) {
        return ships[_id];
    }

    // 船班相关功能
    function createVoyage(uint _shipId, uint _voyageId) internal {
        Voyage storage newVoyage = voyages[_voyageId];
        newVoyage.shipId = _shipId;
        newVoyage.isSettled = false;
        newVoyage.playerArr = new address[](0);
    }

    // 检查船班编号是否合法
    // 目前检查船只只能是下一场的，不能是过去的，也不能是下下场的
    function isValidNextVoyageId(
        uint _shipId,
        uint _voyageId
    ) public view returns (bool) {
        Ship memory ship = ships[_shipId];
        if (ship.startBlock == 0) return false; // 船不存在

        uint cycleLength = ship.waitBlocks + ship.gameBlocks;
        uint currentBlock = block.number;

        // 计算当前周期编号
        uint currentCycle = (currentBlock - ship.startBlock) / cycleLength;

        // 下一场船班编号应该是当前周期编号加一
        return _voyageId == currentCycle + 1;
    }


    // 玩家注册，如果还没有船班就创建一艘船
    // function addCardToPlayer 前端产生12组牌跟hash，hash存入玩家的资料中，已经合并到registerPlayer

    function registerPlayer(uint _shipId , uint _voyageId, address _walletAddress, string memory _tgId, bytes32[] memory _cardHashes) public payable {
        require(isValidNextVoyageId(_shipId, _voyageId), "Invalid voyage ID");
        require(!gamePaused, "Game is paused");
        require(msg.value == ships[_shipId].entryFee, "Incorrect entry fee");

        Voyage storage voyage = voyages[_voyageId];
        if (voyage.shipId == 0) {
            // 默认情况下，如果voyage尚未初始化，shipId和isSettled应该是0和false
            createVoyage(_shipId, _voyageId);
        }
        Player storage player = voyage.players[_walletAddress];
        require(!player.isRegistered, "Player already registered");

        Ship memory ship = ships[_shipId];
        // 检查卡片数量是否12张
        require(_cardHashes.length == 12, "Must provide exactly 12 card hashes");        
        for (uint i = 0; i < _cardHashes.length; i++) {
            player.cards[_cardHashes[i]] = true;
        }
        player.tgId = _tgId;
        player.stars = ship.startStar;
        player.status = "G"; // 预设状态
        player.isRegistered = true; // 标记玩家已报名
        voyage.playerCount++;
        // voyage.playerArr.push(address);
        // 更新卡牌数量
        voyage.cardCounts["R"] += 4;
        voyage.cardCounts["P"] += 4;
        voyage.cardCounts["S"] += 4;
    }

    // TODO:创建Table
    //     - 检查船班是否结算，已结算则无法进行
    //     - 当前有效的Table如果大于存活人数的一半，则无法再新增Table
    //     - 创建Table的玩家需要提交手上有效的卡牌Hash，无效hash则无法送出
    function createTable(
        uint _voyageId,
        address _firstOwner,
        bytes32 _firstHash
    ) public returns (uint tableId) {
        Voyage storage voyage = voyages[_voyageId];
        Player storage fistOwner = voyage.players[_firstOwner];
        require(voyage.isSettled == false, "Voyage already settled");
        require(voyage.tablesCount < voyage.playerCount / 2, "Too many tables");
        require(voyage.players[_firstOwner].cardCount > 0, "Player has no cards");
        voyage.tablesCount++;
        //提交有效的卡牌hash，提交前需要检查hash是否有效
        require(checkCardValidity(_voyageId, _firstOwner, _firstHash), "Invalid card hash");
        voyage.tables[voyage.tablesCount] = Table({
            firstHash: _firstHash,
            firstPlaintext: "",
            secondHash: "",
            secondPlaintext: "",
            firstOwner: _firstOwner,
            secondOwner: address(0),
            isEnded: false
        });
        return voyage.tablesCount;
    }
    // TODO:加入Table
    //     - 检查船班是否结算，已结算则无法进行
    //     - 针对生效中的Table，提交有效的卡牌hash，提交前需要检查hash是否有效
    function joinTable(
        uint _voyageId,
        uint _tableId,
        address _secondOwner,
        bytes32 _secondHash
    ) public {
        Voyage storage voyage = voyages[_voyageId];
        require(voyage.isSettled == false, "Voyage already settled");
        Table storage table = voyage.tables[_tableId];
        require(table.isEnded == false, "Table already ended");
        require(voyage.players[_secondOwner].cardCount > 0, "Player has no cards");
        require(checkCardValidity(_voyageId, _secondOwner, _secondHash), "Invalid card hash");
        table.secondHash = _secondHash;
        table.secondOwner = _secondOwner;
        //opentable

    }

    // TODO: Table Open，提交明文
    //     - 两人中第一个提交明文，检查明文是否符合Hash
    //     - 第二个提交明文，检查明文是否符合Hash，并结算Table
    //     - 结算Table后，胜者加一颗星星
    //     - 扣除船只上的牌型计数
    function commitPlain(
        uint _voyageId,
        uint _tableId,
        address _commiter,
        string memory _plainText
    ) public {
        Voyage storage voyage = voyages[_voyageId];
        require(voyage.isSettled == false, "Voyage already settled");
        Table storage table = voyage.tables[_tableId];
        require(table.isEnded == false, "Table already ended");
        if (table.firstOwner == _commiter) {
            require(checkPlainText(table.firstHash, _plainText), "Invalid plain text");
            table.firstPlaintext = _plainText;
        } else if (table.secondOwner == _commiter) {
            require(checkPlainText(table.secondHash, _plainText), "Invalid plain text");
            table.secondPlaintext = _plainText;
        }
        if (table.firstPlaintext != "" && table.secondPlaintext != "") {
            // 结算Table
            //置空玩家使用了的卡牌
            voyage.players[table.firstOwner].cards[table.firstHash] = false;
            voyage.players[table.secondOwner].cards[table.secondHash] = false;
            if (table.firstPlaintext == table.secondPlaintext) {
                // 平局
                voyage.players[table.firstOwner].cardCount--;
                voyage.players[table.secondOwner].cardCount--;
            } else {
                // 胜者加一颗星星
                if (table.firstPlaintext == "1") {
                    voyage.players[table.firstOwner].stars++;
                } else {
                    voyage.players[table.secondOwner].stars++;
                }
            }
            // 扣除船只上的牌型计数
            voyage.cardCounts[table.firstHash]--;
            voyage.cardCounts[table.secondHash]--;
            table.isEnded = true;
        }
    }

    // TODO: 明文检查，玩家贴入明文后，确认牌跟Hash一致，不一致则违规出局！丧失资格
    function checkPlainText(
        bytes32 _cardHash,
        string memory _plainText
    ) public returns (bool) {
        return keccak256(abi.encodePacked(_plainText)) == _cardHash;
    }
     // 创建交易 
     // 第二个人 贴 hash 交易也是这个逻辑
     // 返回的第一个值为 交易 id ，第二个值为 交易状态
    function createTread(uint _shipId , uint _voyageId, string memory _tradeId, address _walletAddress, bytes32 _hash) public returns (string memory, TradeStatus) {
        // 判断航班是否正常
        Voyage storage voyage = voyages[_voyageId];
        require(voyage.shipId > 0, "Voyage not existed");
        require(voyage.isSettled == false, "Voyage already settled");
        // 判断 玩家地址是否存在
        Player storage fistOwner = voyage.players[_walletAddress];
        require(voyage.players[_walletAddress].walletAddress != address(0), "address not existed");
        // 校验卡片
        require(checkCardValidity(_voyageId, _walletAddress,_hash) == true, "card not belong you");
        Trade memory tradeInfo = voyage.trades[_tradeId];
        // 如果交易存在，就代表是第二个人来贴 hash 进行交易
        // 如果交易不存在，就代表是第一个人来贴 hash 进行交易
        if (tradeInfo.firstHash != "") {
            tradeInfo.secondHash = _hash;
            tradeInfo.secondOwner = _walletAddress;
            tradeInfo.status = TradeStatus.SenondOwnCheckPass;
        } else {
            // 创建交易对象
           tradeInfo = Trade({
                firstHash: _hash,
                secondHash: "",
                firstOwner: _walletAddress,
                secondOwner: address(0),
                isCompleted: false,
                status: TradeStatus.FirstOwnCheckPass
            });
            voyage.trades[_tradeId] = tradeInfo;
        }
        return (_tradeId, tradeInfo.status);
    }

   // 确认交易，交换归属
   function confoirmTrade(int _shipId , uint _voyageId, string memory _tradeId, address _walletAddress) public {
        Voyage storage voyage = voyages[_voyageId];
        require(voyage.shipId > 0, "Voyage not existed");
        require(voyage.isSettled == false, "Voyage already settled");
        Trade memory tradeInfo = voyage.trades[_tradeId];
        require(tradeInfo.status == TradeStatus.ToBeConfirmed, "Trade info error");
        // 判断地址是否交易中的一个
        require(tradeInfo.firstOwner == _walletAddress || tradeInfo.secondOwner == _walletAddress, "address is error");
        // 判断 2 张 hash 是否已经交换过
        Player storage fistOwner = voyage.players[tradeInfo.firstOwner];
        Player storage secondOwner = voyage.players[tradeInfo.secondOwner];
        require(fistOwner.cards[tradeInfo.firstHash] == true && secondOwner.cards[tradeInfo.secondHash] == true, "card hava been exchanged");
        // 修改归属
        fistOwner.cards[tradeInfo.firstHash] = false;
        fistOwner.cards[tradeInfo.secondHash] = true;
        secondOwner.cards[tradeInfo.secondHash] = false;
        secondOwner.cards[tradeInfo.firstHash] = true; 
   }
    // 结算当前船只进度
    // - 检查是否符合结算条件
    // - 手里必须没有牌+星星必须大于等于 3 颗 才算赢，其他情况的都算输
    // - 分配金额（按照胜者的星星总数评分）
    function settleShip(uint _shipId,uint _voyageId) public payable {
        // 判断航班是否正常
        Voyage storage voyage = voyages[_voyageId];
        require(voyage.shipId > 0, "Voyage not existed");
        require(voyage.isSettled == false, "Voyage already settled");
        // 获取船
        Ship storage ship = ships[_shipId];
        // 判断当前的区块是否大于等待区块+游戏时间区块
        require(block.number > ship.startBlock + ship.waitBlocks + ship.gameBlocks, "game not ended");
        // 判断输赢，遍历玩家
        uint winStarCount = 0; // 全部胜星数量
        uint totalEntryFee = ship.entryFee * voyage.playerArr.length * houseCut / 100; // 全部入场金
        // 庄家获取 分成比例
        address[] storage winPlayerAddressArr;
        // 判断输赢，并记录相关的数据
        for (uint256 i = 0; i < voyage.playerArr.length; i++) {
            address playerAddress = voyage.playerArr[i];
            Player storage player = voyage.players[playerAddress];
            // 判断输赢
            if (player.stars >= ship.winStar && player.cardCount == 0) {
                globalPlayers[playerAddress].wins += 1;
                winStarCount += player.stars;
                winPlayerAddressArr.push(playerAddress);
            } else {
                globalPlayers[playerAddress].losses += 1;
            }
        }
        // 遍历转账
        for (uint256 i = 0; i < winPlayerAddressArr.length; i++) {
            address playerAddress = winPlayerAddressArr[i];
            uint winAmount = totalEntryFee * voyage.players[playerAddress].stars / winStarCount;
            payable(playerAddress).transfer(winAmount);
        }
    }
    // TODO: 庄家抽成储存到指定合约地址的功能 OwnerOnly（后续设计败部复活赛用）

    //  检查牌是否合规
    function checkCardValidity(
        uint _voyageId,
        address _walletAddress,
        bytes32 _cardHash
    ) public view returns (bool) {
        Voyage storage voyage = voyages[_voyageId];
        Player storage player = voyage.players[_walletAddress];
        return player.cards[_cardHash];
    }

    // 全局玩家清单相关功能
    function updateGlobalPlayer(address _walletAddress, bool _won) internal {
        GlobalPlayer storage player = globalPlayers[_walletAddress];

        // 如果玩家记录不存在，创建新记录
        if (player.wins == 0 && player.losses == 0) {
            globalPlayers[_walletAddress] = GlobalPlayer({
                wins: _won ? 1 : 0,
                losses: _won ? 0 : 1
            });
        } else {
            // 更新已有记录
            if (_won) {
                player.wins += 1;
            } else {
                player.losses += 1;
            }
        }
    }

    //  获取指定玩家 全局输赢次数记录
    function getGlobalPlayer(
        address _walletAddress
    ) public view returns (GlobalPlayer memory) {
        return globalPlayers[_walletAddress];
    }

    // 提现功能
    function withdraw(uint _amount, address _to) public onlyOwner {
        payable(_to).transfer(_amount);
    }

    receive() external payable {}
}
