import { useState, useEffect } from 'react';
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

  const cardDetailsArray = getOrGenerateCardDetails();
  const cardHashes = cardDetailsArray.map(detail => detail.hash);

  const selectedCard = selectedCardIndex !== null ? cardDetailsArray[selectedCardIndex] : null;

  return {
    cardDetailsArray,
    cardHashes,
    selectedCardIndex,
    setSelectedCardIndex,
    selectedCard
  };
}
