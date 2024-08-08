"use client"
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageContainer } from '@/components/page-container';
import { PlayerHand } from '@/app/components/player-hand';
import { Espoir } from '@/contracts/Espoir';
import { usePlayerCards } from '@/hooks/use-player-cards';

export default function CruisePage() {
  const router = useRouter();
  const { address } = useAccount();
  const {
    cardDetailsArray,
    cardHashes,
    selectedCardIndex,
    setSelectedCardIndex,
    selectedCard
  } = usePlayerCards();

  const form = useForm({
    defaultValues: {
      tgId: "",
    }
  })

  const handleSubmit = form.handleSubmit(async (formData) => {
    if (!voyageId) return;
    if (!formData.tgId) {
      alert("请填写 Telegram ID");
      return;
    }

    console.log({selectedCard});

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
    if (isRegisterPlayerSuccess) {
      router.push('/table');
    }
  }, [isRegisterPlayerSuccess, router])

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
          cardDetails={cardDetailsArray}
          selectedCardIndex={selectedCardIndex}
          setSelectedCardIndex={setSelectedCardIndex}
          selectable={false}
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
