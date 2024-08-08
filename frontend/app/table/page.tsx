"use client"
import { useState, useEffect } from 'react';
import { useAccount, useWatchContractEvent } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { PlayerHand } from "@/app/components/player-hand";
import { Espoir } from '@/contracts/Espoir';
import { usePlayerCards } from '@/hooks/use-player-cards';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

export default function TableSelectionPage() {
  const { address } = useAccount()
  const router = useRouter();
  const {
    cardDetailsArray,
    cardHashes,
    selectedCardIndex,
    setSelectedCardIndex,
    selectedCard
  } = usePlayerCards();
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);

  const handleGoBack = () => {
    router.back();
  }

  const {
    data: voyageId
  } = useReadContract({
    abi: Espoir.ABI,
    address: Espoir.ADDRESS,
    functionName: 'lastPlayerVoyage',
    args: address ? [BigInt(1), address] : undefined,
    query: {
      enabled: !!address,
    }
  })

  const {
    data: voyageData,
    isLoading: isVoyageDataLoading
  } = useReadContract({
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

  const {
    data: activeTablesData,
    isLoading: isActiveTablesDataLoading
  } = useReadContract({
    abi: Espoir.ABI,
    address: Espoir.ADDRESS,
    functionName: 'getVoyageTablesOnlyOne',
    args: voyageId ? [voyageId] : undefined,
    query: {
      enabled: !!voyageId,
    }
  })

  const {
    writeContractAsync: createTableWrite,
    isPending: isCreateTableLoading,
    data: createTableHash,
  } = useWriteContract()
  const { isSuccess: isCreateTableSuccess, data: tableReceipt } = useWaitForTransactionReceipt({
    hash: createTableHash,
  })
  useWatchContractEvent({
    address: Espoir.ADDRESS,
    abi: Espoir.ABI,
    eventName: 'TableCreated',
    onLogs(logs) {
      console.log('createTable logs!', logs)
      logs.map(v => {
        if (v.transactionHash === createTableHash) {
          const { tableId, voyageId } = v.args
          router.push(`/table/${tableId}?voyageId=${voyageId}`);
        }
      })
    },
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
    if (isJoinTableSuccess && selectedTable) {
      router.push(`/table/${selectedTable}?voyageId=${voyageId}`);
    }
  }, [isJoinTableSuccess, selectedTable, router])

  useEffect(() => {
    if (voyageData) {
      console.log(voyageData);
    }
  }, [voyageData])

  const formattedActiveTables = activeTablesData?.map((table, index) => ({
    id: table.toString(),
    name: `桌子 ${index + 1}`,
    status: '正在用',
    players: 1,
  })) || [];

  const handleCreateTable = async () => {
    if (!address || !selectedCard) {
      toast({
        title: "错误",
        description: "请先选择一张卡牌",
        variant: "destructive",
      });
      return;
    }
    console.log({
      voyageId,
      address,
      selectedCard,
    })
    if (!voyageId || !address) return

    await createTableWrite({
      address: Espoir.ADDRESS,
      abi: Espoir.ABI,
      functionName: 'createTable',
      args: [
        voyageId,
        address,
        selectedCard.hash,
      ]
    })
  }

  const handleJoinTable = async () => {
    if (!address || !selectedCard) {
      toast({
        title: "错误",
        description: "请先选择一张卡牌",
        variant: "destructive",
      });
      return;
    }
    console.log("selectedTable: ", selectedTable)
    if (!selectedTable) {
      toast({
        title: "错误",
        description: "请选择要加入的桌子",
        variant: "destructive",
      });
      return;
    }

    if (!voyageId) {
      toast({
        title: "错误",
        description: "无法获取航程信息",
        variant: "destructive",
      });
      return;
    }

    try {
      await joinTableWrite({
        address: Espoir.ADDRESS,
        abi: Espoir.ABI,
        functionName: 'joinTable',
        args: [
          voyageId,
          BigInt(selectedTable),
          address,
          selectedCard.hash
        ]
      });
      // 加入成功后的跳转逻辑移到了 useEffect 中
    } catch (error) {
      console.error("加入桌子失败", error);
      toast({
        title: "错误",
        description: "加入桌子失败，请重试",
        variant: "destructive",
      });
    }
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

      <h1 className="text-center text-2xl font-bold">嘉年华幻想号</h1>

      <div className="text-center py-2 text-white">
        <Button onClick={handleCreateTable}>创建新桌子</Button>
      </div>

      <Card className="mb-6 px-10">
        <CardHeader>
          <CardTitle>选择卡牌</CardTitle>
        </CardHeader>
        <CardContent>
          <PlayerHand
            cardDetails={cardDetailsArray}
            selectedCardIndex={selectedCardIndex}
            setSelectedCardIndex={setSelectedCardIndex}
            selectable={true}
          />
        </CardContent>
      </Card>

      {formattedActiveTables.length > 0 ? (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {formattedActiveTables.map((table) => (
            <Card
              key={table.id}
              className={`cursor-pointer ${selectedTable === table.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => {
                setSelectedTable(table.id);
                setIsJoinDialogOpen(true);
              }}
            >
              <CardContent className="p-4 text-center">
                <p className="font-semibold">{table.name}</p>
                <p className="text-sm text-gray-600">{table.status}</p>
                <div className="flex items-center justify-center mt-2">
                  <Users size={16} className="mr-1"/>
                  <span>{table.players}/2</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-white">
          <p>暂无可用桌子</p>
        </div>
      )}

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

      <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>加入桌子</DialogTitle>
            <DialogDescription>
              您确定要加入这个桌子吗？
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsJoinDialogOpen(false)}>取消</Button>
            <Button onClick={() => {
              setIsJoinDialogOpen(false);
              handleJoinTable();
            }}>确认加入</Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
