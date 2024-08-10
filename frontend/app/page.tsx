"use client"
import Link from "next/link";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Espoir } from '@/contracts/Espoir'
import { useReadContract, useAccount } from "wagmi";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/page-container";

export default function Home() {
  const { data: shipData, isLoading } = useReadContract({
    abi: Espoir.ABI,
    address: Espoir.ADDRESS,
    functionName: 'getShip',
    args: [BigInt(1)],
  })

  const { data: voyageId } = useReadContract({
    abi: Espoir.ABI,
    address: Espoir.ADDRESS,
    functionName: 'getNextVoyageId',
    args: [BigInt(1)],
  })

  console.log({
    shipData,
    voyageId,
  });

  return (
    <PageContainer backgroundImage="/images/bg.png">
      <div className="flex flex-col items-center gap-20 mt-24">
        <h1 className="md:text-5xl text-3xl lg:text-7xl font-bold text-center text-white relative z-20 mb-12">
          Outlaw Voyage
        </h1>

        <Link href="/cruise">
          <Button className="w-40">Play</Button>
        </Link>
      </div>
    </PageContainer>
  )
}
