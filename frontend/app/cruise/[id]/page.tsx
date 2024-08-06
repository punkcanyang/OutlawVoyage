"use client"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useEffect } from "react";
import { EspoirABI } from "@/abi/Espoir";
import { keccak256, toBytes, parseEther, formatEther } from "viem";
import { useLocalStorage } from "usehooks-ts";
import { useForm } from 'react-hook-form'

const contractAddress = '0x8539989C5fFce3660937a7d00EC852421428E4E9'

export default function CruisePage() {
  const router = useRouter();
  const { address } = useAccount();
  const [cardHashesStorage, setCardHashesStorage] = useLocalStorage<{
    [address: string]: `0x${string}`[];
  }>('cardHashes', {});
  const form = useForm({
    defaultValues: {
      tgId: "",
    }
  })

  // 获取或生成当前用户的 cardHashes
  const getOrGenerateCardHashes = () => {
    if (address && cardHashesStorage[address]) {
      return cardHashesStorage[address];
    }

    const newCardHashes = Array(12).fill(0).map(() => keccak256(toBytes(Math.random().toString())));

    if (address) {
      setCardHashesStorage(prevState => ({
        ...prevState,
        [address]: newCardHashes
      }));
    }

    return newCardHashes;
  }


  const handleSubmit = form.handleSubmit(async (formData) => {
    console.log(formData);
    console.log("voyageId: ", voyageId)

    if (!voyageId) return
    if (!formData.tgId) return
    const cardHashes = getOrGenerateCardHashes()
    console.log({cardHashes});

    await registerPlayerWrite({
      address: contractAddress,
      abi: EspoirABI,
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
    abi: EspoirABI,
    address: contractAddress,
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
    <div className="container px-4 max-w-4xl flex min-h-screen flex-col py-12 gap-4">
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

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>游轮信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p><strong>游轮名称:</strong></p>
            <p>示例游轮</p>
            <p><strong>预定开始时间:</strong></p>
            <p>2024-07-27 10:00</p>
            <p><strong>预定结束时间:</strong></p>
            <p>2024-07-27 14:00</p>
            <p><strong>人数上限:</strong></p>
            <p>100</p>
            <p><strong>入场金:</strong></p>
            <p>1000u</p>
            <p><strong>游戏总奖金:</strong></p>
            <p>100000u</p>
          </div>
        </CardContent>
      </Card>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold">报名该游轮</h2>
        <div>
          <label className="block text-sm font-medium mb-1">玩家昵称</label>
          <Input placeholder="请输入"/>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">钱包地址</label>
          <div className="flex">
            <Input placeholder="支付入场" className="flex-grow mr-2"/>
            <Button variant="outline" size="icon">
              <Upload size={18}/>
            </Button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">上传字符和随机量</label>
          <div className="flex">
            <Input type="file" className="flex-grow mr-2"/>
            <Button variant="outline" size="icon">
              <Upload size={18}/>
            </Button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">telegram id</label>
          <Input placeholder="请输入" {...form.register('tgId')} />
        </div>
        <Button type="submit" className="w-full">支付</Button>
      </form>

    </div>
  );
}
