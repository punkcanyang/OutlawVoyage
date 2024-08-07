"use client"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users } from 'lucide-react';
import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Espoir } from "@/contracts/Espoir";
import { useLocalStorage } from "usehooks-ts";
import { PageContainer } from "@/components/page-container";


export default function TableSelectionPage() {
  const { address } = useAccount()
  const router = useRouter();
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [cardHashesStorage, setCardHashesStorage] = useLocalStorage<{
    [address: string]: `0x${string}`[];
  }>('cardHashes', {});


  const handleGoBack = () => {
    router.back();
  }

  // 获取用户加入的航班号
  const { data: voyageId } = useReadContract({
    abi: Espoir.ABI,
    address: Espoir.ADDRESS,
    functionName: 'lastPlayerVoyage',
    args: address ? [BigInt(1), address] : undefined,
    query: {
      enabled: !!address,
    }
  })

  // 获取航程数据
  const { data: voyageData, isLoading: isVoyageDataLoading } = useReadContract({
    abi: Espoir.ABI,
    address: Espoir.ADDRESS,
    functionName: 'getVoyage',
    args: voyageId ? [voyageId] : undefined,
    query: {
      enabled: !!voyageId,
      select: (data) => {
        const [shipId, isSettled, playerCount, playerOut, tablesCount] = data
        return { playerCount, tablesCount }
      }
    }
  })

  // 获取所有table
  const { data: tablesData, isLoading: isTablesDataLoading } = useReadContract({
    abi: Espoir.ABI,
    address: Espoir.ADDRESS,
    functionName: 'getVoyageAllTables',
    args: voyageId ? [voyageId] : undefined,
    query: {
      enabled: !!voyageId,
    }
  })

  console.log({tablesData});

  const {
    writeContractAsync: createTableWrite,
    isPending: isCreateTableLoading,
    data: createTableHash,
  } = useWriteContract()
  const {isSuccess: isCreateTableSuccess} = useWaitForTransactionReceipt({
    hash: createTableHash,
  })

  const {
    writeContractAsync: joinTableWrite,
    isPending: isJoinTableLoading,
    data: joinTableHash,
  } = useWriteContract()
  const {isSuccess: isJoinTableSuccess} = useWaitForTransactionReceipt({
    hash: joinTableHash,
  })

  useEffect(() => {
    if (voyageId) {
      console.log({voyageId});
    }
  }, [voyageId])

  useEffect(() => {
    if (voyageData) {
      console.log(voyageData);
    }
  }, [voyageData])

  useEffect(() => {
    if (isJoinTableSuccess) {
      console.log(isJoinTableSuccess);
    }
  }, [isJoinTableSuccess])

  const tables = [
    { id: 1, name: '桌子 1', status: '正在用', players: 3 },
    { id: 2, name: '桌子 2', status: '正在用', players: 2 },
    { id: 3, name: '桌子 3', status: '空闲中', players: 0 },
    { id: 4, name: '桌子 4', status: '空闲中', players: 0 },
    { id: 5, name: '桌子 5', status: '空闲中', players: 0 },
    { id: 6, name: '桌子 6', status: '空闲中', players: 0 },
    { id: 7, name: '桌子 7', status: '空闲中', players: 0 },
    { id: 8, name: '桌子 8', status: '空闲中', players: 0 },
    { id: 9, name: '桌子 9', status: '空闲中', players: 0 },
  ];

  const handleCreateTable = async () => {
    if (!address) return
    const cards = cardHashesStorage[address]
    console.log({
      voyageId,
      address,
      cards,
    })
    if (!voyageId || !address || !cards) return

    await createTableWrite({
      address: Espoir.ADDRESS,
      abi: Espoir.ABI,
      functionName: 'createTable',
      args: [
        voyageId,
        address,
        cards[0],
      ]
    })
  }

  const handleJoinTable = async () => {
    if (!address) return

    console.log({
      voyageId,
      address,
      tablesData,
    })
    if (!voyageId || !address || !tablesData) return

    await joinTableWrite({
      address: Espoir.ADDRESS,
      abi: Espoir.ABI,
      functionName: 'joinTable',
      args: [
        voyageId,
        // _tableId
        tablesData[0],
        // _secondOwner
        address,
        // _secondHash
        cardHashesStorage[address][1]
      ]
    })
  }

  return (
    <PageContainer backgroundImage="/images/bg.png">
      <div className="flex items-center mb-4">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={handleGoBack}
          title="返回上级"
        >
          <ArrowLeft size={18}/>
        </Button>
      </div>

      <h1 className="text-center text-2xl font-bold">游戏倒计时</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>嘉年华幻想号</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <Button variant="outline" onClick={handleCreateTable}>创建</Button>
            <Button variant="outline" onClick={handleJoinTable}>加入</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {tables.map((table) => (
          <Card
            key={table.id}
            className={`cursor-pointer ${selectedTable === table.id ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => {
              setSelectedTable(table.id)
              router.push(`/table/${table.id}`);
            }}
          >
            <CardContent className="p-4 text-center">
              <p className="font-semibold">{table.name}</p>
              <p className="text-sm text-gray-600">{table.status}</p>
              <div className="flex items-center justify-center mt-2">
                <Users size={16} className="mr-1"/>
                <span>{table.players}/3</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-center border border-gray-600 p-4">
        <Users size={18} className="mr-2"/>
        <span>我的: 当前玩家星星数量</span>
      </div>

      <div className="flex flex-col border border-gray-600 p-4">
        <div className="flex justify-between items-center">
          <h3>公共聊天室</h3>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Users size={18} className="mr-2"/>
              玩家总数
            </Button>
            <Button variant="outline">玩家列表</Button>
          </div>
        </div>

        <div className="h-[120px]">
        </div>
      </div>
    </PageContainer>
  );
}
