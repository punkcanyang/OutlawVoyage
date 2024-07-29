import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Home() {
  return (
    <main className="container px-4 max-w-4xl flex min-h-screen flex-col py-12 gap-4">
      <nav className="flex justify-end mb-12">
        <ConnectButton />
      </nav>

      <div>
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-4">石头剪刀布</h1>
          <h2 className="text-xl mb-4">赌博显示录</h2>
          <h2 className="text-3xl">Web 3</h2>
        </div>

        <div className="flex items-center mb-4 mt-6">
          <span className="font-semibold">cruise detail</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">入场金</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="选择金额"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1u">1u</SelectItem>
                <SelectItem value="10u">10u</SelectItem>
                <SelectItem value="100u">100u</SelectItem>
                <SelectItem value="1000u">1000u</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">游戏时长</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="选择时长"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30m">30m</SelectItem>
                <SelectItem value="1h">1h</SelectItem>
                <SelectItem value="2h">2h</SelectItem>
                <SelectItem value="4h">4h</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex space-x-4 mb-4">
          <Button variant="outline">开始时间</Button>
          <span className="flex items-center">today tmr</span>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">当前游戏列表</h3>
          <div className="flex justify-end mb-2">
            <Select>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Filter"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((item, index) => (
              <Link href={`/cruise/${index + 1}`} key={index} className="block transition-transform hover:scale-105">
                <Card className="h-full cursor-pointer hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>Sample Game {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p><strong>开始时间:</strong> 2024-07-27 10:00</p>
                    <p><strong>结束时间:</strong> 2024-07-27 12:00</p>
                    <p><strong>人数上限:</strong> 10</p>
                    <p><strong>入场金:</strong> 100u</p>
                    <p><strong>总奖金:</strong> 1000u</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
