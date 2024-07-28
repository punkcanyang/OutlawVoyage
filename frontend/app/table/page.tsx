"use client"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users } from 'lucide-react';
import { useState } from "react";


export default function TableSelectionPage() {
  const router = useRouter();
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  const handleGoBack = () => {
    router.back();
  };

  const tables = [
    { id: 1, name: '桌子 1', status: '正在用', players: 3 },
    { id: 2, name: '桌子 2', status: '正在用', players: 2 },
    { id: 3, name: '桌子 3', status: '空闲中', players: 0 },
    { id: 4, name: '桌子 4', status: '空闲中', players: 0 },
    { id: 5, name: '桌子 5', status: '空闲中', players: 0 },
    { id: 6, name: '桌子 6', status: '空闲中', players: 0 },
    { id: 7, name: '桌子 7', status: '空闲中', players: 0 },
    { id: 8, name: '桌子 8', status: '空闲中', players: 0 },
    { id: 9, name: '桌子 9', status: '空闲中', players: 0 },
  ];

  return (
    <div className="container px-4 max-w-4xl flex min-h-screen flex-col py-12 gap-4">
      <div className="flex items-center mb-4">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={handleGoBack}
          title="返回上级"
        >
          <ArrowLeft size={18}/>
        </Button>
      </div>

      <h1 className="text-center text-2xl font-bold">游戏倒计时</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>嘉年华幻想号</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-semibold mb-2">剩余卡量</p>
          <div className="flex justify-between mb-4">
            <Button variant="outline">石头</Button>
            <Button variant="outline">剪刀</Button>
            <Button variant="outline">布</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {tables.map((table) => (
          <Card
            key={table.id}
            className={`cursor-pointer ${selectedTable === table.id ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => {
              setSelectedTable(table.id)
              router.push(`/table/${table.id}`);
            }}
          >
            <CardContent className="p-4 text-center">
              <p className="font-semibold">{table.name}</p>
              <p className="text-sm text-gray-600">{table.status}</p>
              <div className="flex items-center justify-center mt-2">
                <Users size={16} className="mr-1"/>
                <span>{table.players}/3</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-center border border-gray-600 p-4">
        <Users size={18} className="mr-2"/>
        <span>我的: 当前玩家星星数量</span>
      </div>

      <div className="flex flex-col border border-gray-600 p-4">
        <div className="flex justify-between items-center">
          <h3>公共聊天室</h3>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Users size={18} className="mr-2"/>
              玩家总数
            </Button>
            <Button variant="outline">玩家列表</Button>
          </div>
        </div>

        <div className="h-[120px]">
        </div>
      </div>
    </div>
  );
}
