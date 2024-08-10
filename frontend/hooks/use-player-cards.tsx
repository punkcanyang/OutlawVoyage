import { useState, useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useLocalStorage } from 'usehooks-ts';
import { keccak256, toBytes } from 'viem';
import { v4 as uuidv4 } from 'uuid';
import { CardType } from '@/app/types';

function generatePlainText(): { plainText: string; cardType: CardType } {
  const cardTypes = Object.values(CardType);
  const selectedType = cardTypes[Math.floor(Math.random() * cardTypes.length)] as CardType;
  return {
    plainText: `${selectedType}-${uuidv4()}`,
    cardType: selectedType
  };
}

export function usePlayerCards() {
  const { address } = useAccount();
  const [cardDetails, setCardDetails] = useLocalStorage<{
    [address: string]: { hash: `0x${string}`; plainText: string; cardType: CardType }[];
  }>('cardDetails', {});
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);

  const cardDetailsArray = useMemo(() => {
    if (address && cardDetails[address]) {
      return cardDetails[address];
    }

    const newCardDetails = Array(12).fill(0).map(() => {
      const { plainText, cardType } = generatePlainText();
      const hash = keccak256(toBytes(plainText));
      return { hash, plainText, cardType };
    });

    return newCardDetails;
  }, [address, cardDetails]);

  useEffect(() => {
    if (address && !cardDetails[address]) {
      setCardDetails(prevState => ({
        ...prevState,
        [address]: cardDetailsArray
      }));
    }
  }, [address, cardDetails, cardDetailsArray, setCardDetails]);

  const cardHashes = useMemo(() => cardDetailsArray.map(detail => detail.hash), [cardDetailsArray]);

  const selectedCard = useMemo(() =>
      selectedCardIndex !== null ? cardDetailsArray[selectedCardIndex] : null,
    [selectedCardIndex, cardDetailsArray]
  );

  return {
    cardDetailsArray,
    cardHashes,
    selectedCardIndex,
    setSelectedCardIndex,
    selectedCard
  };
}
