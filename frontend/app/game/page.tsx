"use client"
import { useRouter } from 'next/navigation';
import { useGameContext } from '@/contexts/game-context';
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
  const { address } = useAccount()
  const router = useRouter();
  const { gameData } = useGameContext();
  const { tableId, voyageId } = gameData;

  console.log("tableId: ", tableId);
  console.log("voyageId: ", voyageId);

  const handleGoBack = () => {
    router.back();
  }

  const [hasOpponentJoined, setHasOpponentJoined] = useState(false);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [gameResult, setGameResult] = useState<string | null>(null);

  const [playerStars, setPlayerStars] = useState<number | null>(null);
  const [opponentStars, setOpponentStars] = useState<number | null>(null);

  const [firstPlaintext, setFirstPlaintext] = useState<string | undefined>(undefined);
  const [secondPlaintext, setSecondPlaintext] = useState<string | undefined>(undefined);

  const [isPlayerOne, setIsPlayerOne] = useState<boolean | null>(null);

  const [playerOneAddress, setPlayerOneAddress] = useState<string | undefined>(undefined);
  const [playerTwoAddress, setPlayerTwoAddress] = useState<string | undefined>(undefined);

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
          const [firstHash, firstPlain, secondHash, secondPlain, firstOwner, secondOwner, isEnded] = data.state.data ?? [];
          if (secondOwner && !hasOpponentJoined) {
            setHasOpponentJoined(true);
            toast({
              title: "成功",
              description: "玩家加入牌桌",
            });
          }
          setFirstPlaintext(firstPlain);
          setSecondPlaintext(secondPlain);

          const isPlayerOne = address === firstOwner;
          const shouldContinueRefetch = isPlayerOne ? !secondPlain : !firstPlain;

          return shouldContinueRefetch ? 3000 : false;
        }
      },
    },
  })
  console.log("tableData: ", tableData);

  useEffect(() => {
    if (tableData) {
      const [,,,,firstOwner, secondOwner] = tableData;
      setPlayerOneAddress(firstOwner);
      setPlayerTwoAddress(secondOwner);
    }
  }, [tableData]);

  const { data: playerOneData } = useReadContract({
    abi: Espoir.ABI,
    address: Espoir.ADDRESS,
    functionName: 'getPlayer',
    args: (playerOneAddress && voyageId) ? [BigInt(voyageId), playerOneAddress] : undefined,
    query: {
      enabled: !!playerOneAddress && !!voyageId,
    },
  })

  const { data: playerTwoData } = useReadContract({
    abi: Espoir.ABI,
    address: Espoir.ADDRESS,
    functionName: 'getPlayer',
    args: (playerTwoAddress && voyageId) ? [BigInt(voyageId), playerTwoAddress] : undefined,
    query: {
      enabled: !!playerTwoAddress && !!voyageId,
    },
  })

  useEffect(() => {
    if (playerOneData && playerTwoData && address) {
      const myStars = address === playerOneAddress ? Number(playerOneData[1]) : Number(playerTwoData[1]);
      const opponentStars = address === playerOneAddress ? Number(playerTwoData[1]) : Number(playerOneData[1]);
      setPlayerStars(myStars);
      setOpponentStars(opponentStars);
    }
  }, [playerOneData, playerTwoData, address, playerOneAddress, playerTwoAddress]);

  useEffect(() => {
    if (firstPlaintext && secondPlaintext) {
      setIsGameEnded(true);
      const result = determineWinner(firstPlaintext, secondPlaintext);
      setGameResult(result);
    }
  }, [firstPlaintext, secondPlaintext]);

  useEffect(() => {
    if (tableData && address) {
      const [firstHash, firstPlain, secondHash, secondPlain, firstOwner, secondOwner, isEnded] = tableData;
      setIsPlayerOne(firstOwner === address);
    }
  }, [tableData, address]);

  function determineWinner(firstPlaintext: string, secondPlaintext: string) {
    if (isPlayerOne === null) return "等待判定...";

    const myMove = isPlayerOne ? firstPlaintext.charAt(0) : secondPlaintext.charAt(0);
    const opponentMove = isPlayerOne ? secondPlaintext.charAt(0) : firstPlaintext.charAt(0);

    if (myMove === opponentMove) return "平局";
    if (
      (myMove === "R" && opponentMove === "S") ||
      (myMove === "S" && opponentMove === "P") ||
      (myMove === "P" && opponentMove === "R")
    ) {
      return "你赢了！";
    }
    return "你输了！";
  }

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

      <OpponentHand stars={opponentStars} />
      <div className="flex-grow flex items-center justify-center">
        <div className="text-white text-2xl">
          {isGameEnded ? gameResult : "等待对手出牌..."}
        </div>
      </div>
      <MyCards stars={playerStars} />
    </PageContainer>
  );
}

function OpponentHand({ stars }: { stars: number | null }) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 text-amber-500 flex gap-2">
        {stars !== null && Array(stars).fill(0).map((_, i) => (
          <Star key={i}/>
        ))}
      </div>
      {/* 这里放置对手的牌 */}
      {/*<img className="h-[200px]" src="/images/paper.png" alt=""/>*/}
      <img src="/images/back-card.svg" alt="card back" height="189" width="135"/>
    </div>
  )
}

function MyCards({stars}: { stars: number | null }) {
  const {gameData } = useGameContext();
  const { tableId, voyageId } = gameData;
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
        {stars !== null && Array(stars).fill(0).map((_, i) => (
          <Star key={i} />
        ))}
      </div>
    </div>
  )
}