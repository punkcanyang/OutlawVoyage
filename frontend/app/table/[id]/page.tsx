"use client"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star } from "lucide-react";
import { PageContainer } from "@/components/page-container";

export default function GamePage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
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

      <OpponentHand/>
      <div className="flex-grow flex items-center justify-center">
        <div className="text-white text-2xl">
          It's a tie, go again!
        </div>
      </div>
      <PlayerHand/>
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

function PlayerHand() {
  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-3 mb-4">
        {/* 这里放置玩家的牌 */}
        <img className="h-[200px]" src="/images/rock.png" alt=""/>
        <img className="h-[200px]" src="/images/paper.png" alt=""/>
        <img className="h-[200px]" src="/images/scissors.png" alt=""/>
      </div>
      <div className="flex">
        <Button variant="secondary">Play</Button>
      </div>
      <div className="mt-2 text-amber-500 flex gap-2">
        <Star />
        <Star />
        <Star />
      </div>
    </div>
  )
}
