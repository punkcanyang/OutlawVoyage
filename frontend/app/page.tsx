"use client"
import Link from "next/link";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { EspoirABI } from '../abi/Espoir'
import { useReadContract, useAccount } from "wagmi";
import { cn } from "@/lib/utils"

const contractAddress = '0x8539989C5fFce3660937a7d00EC852421428E4E9'

export default function Home() {
  const { address } = useAccount()

  const { data: shipData, isLoading } = useReadContract({
    abi: EspoirABI,
    address: contractAddress,
    functionName: 'getShip',
    args: [BigInt(1)],
  })

  const { data: voyageId } = useReadContract({
    abi: EspoirABI,
    address: contractAddress,
    functionName: 'getNextVoyageId',
    args: [BigInt(1)],
  })

  console.log({
    shipData,
    voyageId,
  });

  return (
    <main className="container px-4 max-w-4xl flex min-h-screen flex-col py-12 gap-4 bg-[length:100%_100%] bg-no-repeat" style={{ backgroundImage: `url('/images/johnwick.jpg')` }}>
      <nav className="flex justify-end mb-12">
        <ConnectButton />
      </nav>

      <div>
        <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white relative z-20 mb-12">
          Outlaw Voyage
        </h1>

        <div className="mb-4">
          {/*<h3 className="text-lg font-semibold mb-2 text-white">游轮列表</h3>*/}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((item, index) => (
              <Link href={`/cruise/${index + 1}`} key={index} className="block transition-transform hover:scale-105">
                <CardDemo />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function CardDemo() {
  return (
    <div className="max-w-xs w-full group/card">
      <div
        className={cn(
          "cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl  max-w-sm mx-auto backgroundImage flex flex-col p-4",
          "bg-[url('/images/home-card.jpg')] bg-cover"
        )}
      >
        <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
        <h1 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10 mb-8">
          Sample Game
        </h1>

        <div className="text content font-normal text-gray-50 space-y-1.5">
          <p><strong>开始时间:</strong> 2024-07-27 10:00</p>
          <p><strong>结束时间:</strong> 2024-07-27 12:00</p>
          <p><strong>人数上限:</strong> 10</p>
          <p><strong>入场金:</strong> 100u</p>
          <p><strong>总奖金:</strong> 1000u</p>
        </div>
      </div>
    </div>
  );
}
