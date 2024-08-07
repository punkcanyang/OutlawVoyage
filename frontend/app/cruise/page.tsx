"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useEffect } from "react";
import { Espoir } from "@/contracts/Espoir";
import { keccak256, toBytes, parseEther, formatEther } from "viem";
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from "usehooks-ts";
import { useForm } from 'react-hook-form'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { PageContainer } from "@/components/page-container";
import { Label } from "@/components/ui/label";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

// 定义牌型枚举
enum CardType {
  Rock = 'R',
  Scissors = 'S',
  Paper = 'P'
}

// 生成明文的函数
function generatePlainText(): { plainText: string; cardType: CardType } {
  const cardTypes = Object.values(CardType);
  const selectedType = cardTypes[Math.floor(Math.random() * cardTypes.length)] as CardType;
  return {
    plainText: `${selectedType}-${uuidv4()}`,
    cardType: selectedType
  };
}

export default function CruisePage() {
  const router = useRouter();
  const { address } = useAccount();
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [cardDetails, setCardDetails] = useLocalStorage<{
    [address: string]: { hash: `0x${string}`; plainText: string; cardType: CardType }[];
  }>('cardDetails', {});

  const form = useForm({
    defaultValues: {
      tgId: "",
    }
  })


  // 获取或生成当前用户的 cardHashes
  const getOrGenerateCardDetails = () => {
    if (address && cardDetails[address]) {
      return cardDetails[address];
    }

    const newCardDetails = Array(12).fill(0).map(() => {
      const { plainText, cardType } = generatePlainText();
      const hash = keccak256(toBytes(plainText));
      return { hash, plainText, cardType };
    });

    if (address) {
      setCardDetails(prevState => ({
        ...prevState,
        [address]: newCardDetails
      }));
    }

    return newCardDetails;
  }


  const handleSubmit = form.handleSubmit(async (formData) => {
    if (!voyageId) return;
    if (!formData.tgId) {
      alert("请填写 Telegram ID");
      return;
    }
    if (selectedCardIndex === null) {
      alert("请选择一张卡牌");
      return;
    }

    const cardDetailsArray = getOrGenerateCardDetails();
    const cardHashes = cardDetailsArray.map(detail => detail.hash);
    console.log({cardHashes});

    await registerPlayerWrite({
      address: Espoir.ADDRESS,
      abi: Espoir.ABI,
      functionName: 'registerPlayer',
      args: [
        // 1. _shipId
        BigInt(1),
        // 2. _voyageId
        voyageId,
        // 3. _tgId
        formData.tgId,
        // 4. _cardHashes
        cardHashes
      ],
      value: parseEther("1"),
    })
  })

  const handleGoBack = () => {
    router.back();
  }

  const { data: voyageId } = useReadContract({
    abi: Espoir.ABI,
    address: Espoir.ADDRESS,
    functionName: 'getNextVoyageId',
    args: [BigInt(1)],
  })

  const {
    writeContractAsync: registerPlayerWrite,
    isPending: isRegisterPlayerLoading,
    data: registerPlayerHash,
  } = useWriteContract()
  const {isSuccess: isRegisterPlayerSuccess} = useWaitForTransactionReceipt({
    hash: registerPlayerHash,
  })

  useEffect(() => {
    console.log(isRegisterPlayerSuccess);
    if (isRegisterPlayerSuccess) {
      router.push('/table')
    }
  }, [isRegisterPlayerSuccess]);

  return (
    <PageContainer backgroundImage="/images/bg.png" className="text-white">
      <div className="flex items-center mb-4">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={handleGoBack}
          title="返回"
        >
          <ArrowLeft size={18}/>
        </Button>
        <h1 className="text-2xl font-bold">所在游轮</h1>
      </div>

      <Card className="mb-6 px-16 py-8">
        <PlayerHand
          cardDetails={getOrGenerateCardDetails()}
          selectedCardIndex={selectedCardIndex}
          setSelectedCardIndex={setSelectedCardIndex}
        />
      </Card>


      <form className="space-y-4" onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>报名该游轮</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Telegram ID</Label>
                <Input placeholder="请输入" {...form.register('tgId')} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit" className="w-full">报名</Button>
          </CardFooter>
        </Card>
      </form>
    </PageContainer>
  );
}

export function PlayerHand({
  cardDetails,
  selectedCardIndex,
  setSelectedCardIndex
}: {
  cardDetails: { hash: `0x${string}`; plainText: string; cardType: CardType }[],
  selectedCardIndex: number | null,
  setSelectedCardIndex: (index: number | null) => void
}) {
  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
  }

  return (
    <Carousel opts={{ align: "start" }} className="w-full">
      <CarouselContent>
        {cardDetails.map((card, index) => (
          <CarouselItem key={index} className="basis-1/2">
            <div className="p-1">
              <Card
                className={`cursor-pointer ${selectedCardIndex === index ? 'border-blue-500 border-2' : ''}`}
                onClick={() => setSelectedCardIndex(index)}
              >
                <CardContent className="flex flex-col items-center justify-center p-6 h-48">
                  <span className="text-3xl font-semibold mb-2">{card.cardType}</span>
                  <span className="text-xs break-all">{truncateHash(card.hash)}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
