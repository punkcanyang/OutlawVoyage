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
    mapping(uint => Ship) public ships; // 船班映射
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
    // 交易信息
    struct Trade {
        bytes32 firstHash; // 第一组Hash，原本归属钱包地址
        address firstOwner; // 第一组Hash的 原本归属钱包地址
        bytes32 secondHash; // 第二组Hash，原本归属钱包地址
        address secondOwner; // 第二组Hash的原本归属钱包地址
        bool isCompleted; //交易是否完成，避免有人一牌多换，最后检查双方牌归属都是正确的，Hash都是正确，才执行交换
    }
// 船班，一班就是一场游戏
    struct Voyage {
        uint shipId; // 船编号

        bool isSettled; // 状态：是否结算
        mapping(string => uint256) cardCounts; // 卡牌数量（三种牌分开计数）使用映射以节省Gas
        uint playerCount; // 全部玩家数量（不论死活）
        uint playerOut; //出局玩家数量
        uint tablesCount; //当前活跃桌数，如果Table被创建+1,如果Table对决结束-1，用来检查能不能开新桌
        mapping(uint => Table) tables; // Table映射
        mapping(address => Player) players; // 玩家映射
        mapping(uint => Trade) trades; // 交易厅映射
    }

    mapping(uint => Voyage) public voyages; // 船只映射


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
        newShip.shipId = _shipId;
        newShip.isSettled = false;
    }

    // 检查船班编号是否合法
    // 目前检查船只只能是下一场的，不能是过去的，也不能是下下场的
    function isValidNextVoyageId(
        uint _shipId,
        uint _voyageId
    ) public view returns (bool) {
        Voyage memory ship = ships[_shipId];
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
        require(isValidNextShipId(_shipId, _voyageId), "Invalid ship ID");
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
        ship.playerCount++;
    }

    // TODO:创建Table
    //     - 检查船班是否结算，已结算则无法进行
    //     - 当前有效的Table如果大于存活人数的一半，则无法再新增Table
    //     - 创建Table的玩家需要提交手上有效的卡牌Hash，无效hash则无法送出
    // TODO:加入Table
    //     - 检查船班是否结算，已结算则无法进行
    //     - 针对生效中的Table，提交有效的卡牌hash，提交前需要检查hash是否有效
    // TODO: Table Open，提交明文
    //     - 两人中第一个提交明文，检查明文是否符合Hash
    //     - 第二个提交明文，检查明文是否符合Hash，并结算Table
    //     - 结算Table后，胜者加一颗星星
    //     - 扣除船只上的牌型计数

    // TODO: 明文检查，玩家贴入明文后，确认牌跟Hash一致，不一致则违规出局！丧失资格


    // 交换牌的归属
    // - 检查船只是否结算，已结算则无法进行
    // - 检查hash是否有效，无效则无法进行
    // - 交易厅完成两个hash上传后，两边归属交换
    function exchangeCard(
        uint _voyageId,
        uint _shipId,
        address _walletAddress,
        bytes32 _cardHash,
        string memory _plainText
    ) public checkShip(_shipId, _voyageId){
        Ship storage ship = ships[_shipId];
        require(ship.isSettled == false, "Ship already settled");
        require(checkCardValidity(_shipId, _walletAddress, _cardHash), "Invalid card hash");
    }
    // 结算当前船只进度
    // - 检查是否符合结算条件
    // - 结算人员胜败跟金额（必须手上没有剩牌，且剩下超过3颗星）
    // - 如果时间到了，但有Table没有完结，视同手上还有牌，都出局
    // - 分配金额（按照胜者的星星总数评分）
    function settleShip(uint _voyageId, uint _shipId) public checkShip(_shipId, _voyageId){
    }
    // TODO: 庄家抽成储存到指定合约地址的功能 OwnerOnly（后续设计败部复活赛用）

    //  检查牌是否合规
    function checkCardValidity(
        uint _shipId,
        address _walletAddress,
        bytes32 _cardHash
    ) public view returns (bool) {
        Ship storage ship = ships[_shipId];
        Player storage player = ship.players[_walletAddress];
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
