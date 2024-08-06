export const EspoirABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_houseCut",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_gamePaused",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ReentrancyGuardReentrantCall",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isPaused",
        "type": "bool"
      }
    ],
    "name": "GamePauseStatusChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newHouseCut",
        "type": "uint256"
      }
    ],
    "name": "HouseCutUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "voyageId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "player",
        "type": "address"
      }
    ],
    "name": "PlayerRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "voyageId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tableId",
        "type": "uint256"
      }
    ],
    "name": "TableCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "voyageId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "string",
        "name": "tradeId",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "enum Espoir.TradeStatus",
        "name": "status",
        "type": "uint8"
      }
    ],
    "name": "TradeCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "shipId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "voyageId",
        "type": "uint256"
      }
    ],
    "name": "VoyageCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "shipId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "voyageId",
        "type": "uint256"
      }
    ],
    "name": "VoyageSettled",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_voyageId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_walletAddress",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "_cardHash",
        "type": "bytes32"
      }
    ],
    "name": "checkCardValidity",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_cardHash",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "_plainText",
        "type": "string"
      }
    ],
    "name": "checkPlainText",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_voyageId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_tableId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_commiter",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_plainText",
        "type": "string"
      }
    ],
    "name": "commitPlain",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_shipId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_voyageId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_tradeId",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "_walletAddress",
        "type": "address"
      }
    ],
    "name": "confoirmTrade",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_entryFee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_startStar",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_winStar",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_startBlock",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_waitBlocks",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_gameBlocks",
        "type": "uint256"
      }
    ],
    "name": "createShip",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_voyageId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_firstOwner",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "_firstHash",
        "type": "bytes32"
      }
    ],
    "name": "createTable",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "tableId",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_shipId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_voyageId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_tradeId",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "_walletAddress",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "_hash",
        "type": "bytes32"
      }
    ],
    "name": "createTread",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "enum Espoir.TradeStatus",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "gamePaused",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getGamePaused",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_walletAddress",
        "type": "address"
      }
    ],
    "name": "getGlobalPlayer",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "wins",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "losses",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getHouseCut",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_shipId",
        "type": "uint256"
      }
    ],
    "name": "getNextVoyageId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "_voyageId",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_voyageId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_walletAddress",
        "type": "address"
      }
    ],
    "name": "getPlayer",
    "outputs": [
      {
        "internalType": "string",
        "name": "tgId",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "stars",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "status",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "cardCount",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isRegistered",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "walletAddress",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_shipId",
        "type": "uint256"
      }
    ],
    "name": "getShip",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "entryFee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "startStar",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "winStar",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "startBlock",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "waitBlocks",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "gameBlocks",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_voyageId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_tableId",
        "type": "uint256"
      }
    ],
    "name": "getTable",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "firstHash",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "firstPlaintext",
        "type": "string"
      },
      {
        "internalType": "bytes32",
        "name": "secondHash",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "secondPlaintext",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "firstOwner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "secondOwner",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "isEnded",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_voyageId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_tradeId",
        "type": "string"
      }
    ],
    "name": "getTrade",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "firstHash",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "firstOwner",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "secondHash",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "secondOwner",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "isCompleted",
        "type": "bool"
      },
      {
        "internalType": "enum Espoir.TradeStatus",
        "name": "status",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_voyageId",
        "type": "uint256"
      }
    ],
    "name": "getVoyage",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "shipId",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isSettled",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "playerCount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "playerOut",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "tablesCount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_voyageId",
        "type": "uint256"
      }
    ],
    "name": "getVoyageAllTables",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_voyageId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "cardType",
        "type": "string"
      }
    ],
    "name": "getVoyageCardCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_voyageId",
        "type": "uint256"
      }
    ],
    "name": "getVoyagePlayerArr",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_voyageId",
        "type": "uint256"
      }
    ],
    "name": "getVoyageWinPlayerArr",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "globalPlayers",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "wins",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "losses",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "houseCut",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_shipId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_voyageId",
        "type": "uint256"
      }
    ],
    "name": "isValidNextVoyageId",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_voyageId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_tableId",
        "type": "uint256"
      }
    ],
    "name": "isVoyageTableEnded",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_voyageId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_tableId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_secondOwner",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "_secondHash",
        "type": "bytes32"
      }
    ],
    "name": "joinTable",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "lastPlayerVoyage",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_shipId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_voyageId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_tgId",
        "type": "string"
      },
      {
        "internalType": "bytes32[]",
        "name": "_cardHashes",
        "type": "bytes32[]"
      }
    ],
    "name": "registerPlayer",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bool",
        "name": "_paused",
        "type": "bool"
      }
    ],
    "name": "setGamePaused",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_newHouseCut",
        "type": "uint256"
      }
    ],
    "name": "setHouseCut",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_shipId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_voyageId",
        "type": "uint256"
      }
    ],
    "name": "settleShip",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "ships",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "entryFee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "startStar",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "winStar",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "startBlock",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "waitBlocks",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "gameBlocks",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_shipId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_voyageId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_tgId",
        "type": "string"
      },
      {
        "internalType": "bytes32[]",
        "name": "_cardHashes",
        "type": "bytes32[]"
      }
    ],
    "name": "updateRegisteredPlayer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "voyages",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "shipId",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isSettled",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "playerCount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "playerOut",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "tablesCount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "globaltbCount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
] as const
