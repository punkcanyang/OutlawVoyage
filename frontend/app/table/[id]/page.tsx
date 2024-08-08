"use client"
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Espoir } from "@/contracts/Espoir";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { usePlayerCards } from "@/hooks/use-player-cards";
import { PlayerHand } from '@/app/components/player-hand';

export default function GamePage() {
  const router = useRouter();
  const [player2, setPlayer2] = useState<`0x${string}` | null>(null);
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const voyageId = searchParams.get('voyageId') || ""
  const tableId = params.id
  console.log("tableId: ", tableId);
  console.log("voyageId: ", voyageId);

  const handleGoBack = () => {
    router.back();
  }

  const [hasOpponentJoined, setHasOpponentJoined] = useState(false);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [gameResult, setGameResult] = useState<string | null>(null);

  const {
    data: tableData
  } = useReadContract({
    abi: Espoir.ABI,
    address: Espoir.ADDRESS,
    functionName: 'getTable',
    args: tableId ? [BigInt(voyageId), BigInt(tableId)] : undefined,
    query: {
      enabled: !!tableId && !!voyageId,
      refetchInterval: (data) => {
        if (data.state.status === "success") {
          console.log(data.state.data);
          const [firstHash, firstPlaintext, secondHash, secondPlaintext, firstOwner, secondOwner, isEnded] = data.state.data ?? [];
          if (secondOwner && !hasOpponentJoined) {
            setHasOpponentJoined(true);
            toast({
              title: "成功",
              description: "玩家加入牌桌",
            });
          }
          if (secondPlaintext) {
            setIsGameEnded(true);
            // 这里需要根据实际游戏逻辑判断输赢
            setGameResult("游戏结束，请查看结果");
          }
          return secondPlaintext ? false : 3000
        }
      },
    },
  })
  console.log("tableData: ", tableData);

  return (
    <PageContainer backgroundImage="/images/bg2.jpg">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 text-white"
          onClick={handleGoBack}
          title="返回上级"
        >
          <ArrowLeft size={18}/>
        </Button>
      </div>

      <OpponentHand/>
      <div className="flex-grow flex items-center justify-center">
        <div className="text-white text-2xl">
          {isGameEnded ? gameResult : "等待对手出牌..."}
        </div>
      </div>
      <MyCards voyageId={voyageId} tableId={tableId} />
    </PageContainer>
  );
}

function OpponentHand() {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 text-amber-500 flex gap-2">
        <Star/>
        <Star/>
      </div>
      {/* 这里放置对手的牌 */}
      <img className="h-[200px]" src="/images/paper.png" alt=""/>
    </div>
  )
}

function MyCards({ voyageId, tableId }: {
  voyageId: string;
  tableId: string;
}) {
  const { address } = useAccount()
  const {
    cardDetailsArray,
    cardHashes,
    selectedCardIndex,
    setSelectedCardIndex,
    selectedCard
  } = usePlayerCards();

  console.log("MyCards voyageId", voyageId);
  console.log("MyCards tableId", tableId);
  console.log("selectedCard: ", selectedCard);

  const {
    data: isPlainText,
    isSuccess: isPlainTextCheckSuccess,
    isLoading: isPlainTextCheckLoading,
    refetch
  } = useReadContract({
    abi: Espoir.ABI,
    address: Espoir.ADDRESS,
    functionName: 'checkPlainText',
    args: selectedCard ? [selectedCard.hash, selectedCard.plainText] : undefined,
    query: {
      enabled: !!selectedCard,
      // queryKey: ['checkPlainText', selectedCard?.hash, selectedCard?.plainText],
      gcTime: 0,
    }
  })

  const {
    writeContractAsync: commitPlainWrite,
    isPending: isCommitPlainLoading,
    data: commitPlainHash,
  } = useWriteContract()
  const { isSuccess: isCommitPlainSuccess } = useWaitForTransactionReceipt({
    hash: commitPlainHash,
  })

  useEffect(() => {
    console.log("isPlainText: ", isPlainText);
  }, [isPlainText]);

  const handlePlay = async () => {
    if (!address) return
    if (!selectedCard) {
      toast({
        title: "错误",
        description: "请先选择一张卡牌",
        variant: "destructive",
      })
      return
    }
    await refetch()
    console.log("refetch: ", isPlainText);
    if (!isPlainText) {
      toast({
        title: "错误",
        description: "请选择验证过的卡牌，否则会被嘎",
        variant: "destructive",
      })
      return
    }

    await commitPlainWrite({
      address: Espoir.ADDRESS,
      abi: Espoir.ABI,
      functionName: 'commitPlain',
      args: [
        BigInt(voyageId),
        BigInt(tableId),
        address,
        selectedCard.plainText,
      ]
    })
  }

  useEffect(() => {
    console.log("出牌成功: ", isCommitPlainSuccess);
  }, [isCommitPlainSuccess]);

  return (
    <div className="flex flex-col items-center">
      <div className="w-9/12 mb-4">
        <PlayerHand
          cardDetails={cardDetailsArray}
          selectedCardIndex={selectedCardIndex}
          setSelectedCardIndex={setSelectedCardIndex}
          selectable={true}
        />
      </div>
      <div className="flex">
        <Button
          variant="secondary"
          onClick={handlePlay}
          disabled={isPlainTextCheckLoading || !isPlainTextCheckSuccess || !isPlainText}
        >
          {isPlainTextCheckLoading ? "验证中..." : "Play"}
        </Button>
      </div>
      <div className="mt-2 text-amber-500 flex gap-2">
        <Star />
        <Star />
        <Star />
      </div>
    </div>
  )
}
