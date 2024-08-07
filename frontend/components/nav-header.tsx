"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const NavHeader = ({ children }: { children?: React.ReactNode }) => {
  return (
    <nav className="flex justify-end pt-8 px-4 sticky top-0 z-20">
      <ConnectButton/>
    </nav>
  );
};

