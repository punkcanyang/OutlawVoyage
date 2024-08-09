"use client";
import React, { createContext, useContext, useState } from 'react';

type GameData = {
  tableId: string;
  voyageId: string;
};

type GameContextType = {
  gameData: GameData;
  setGameData: React.Dispatch<React.SetStateAction<GameData>>;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameData, setGameData] = useState<GameData>({ tableId: "", voyageId: "" });

  return (
    <GameContext.Provider value={{ gameData, setGameData }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
