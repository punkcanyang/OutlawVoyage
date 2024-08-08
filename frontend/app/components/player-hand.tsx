"use client";
import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card";
import { CardType } from '@/app/types';

export function PlayerHand({
  cardDetails,
  selectedCardIndex,
  setSelectedCardIndex,
  selectable = true
}: {
  cardDetails: { hash: `0x${string}`; plainText: string; cardType: CardType }[],
  selectedCardIndex: number | null,
  setSelectedCardIndex: (index: number | null) => void,
  selectable?: boolean
}) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  if (!isClient) return null;

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
                className={`cursor-pointer ${selectable && selectedCardIndex === index ? 'border-blue-500 border-2' : ''}`}
                onClick={() => selectable && setSelectedCardIndex(index)}
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
