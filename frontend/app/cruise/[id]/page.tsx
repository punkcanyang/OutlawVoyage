"use client"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CruisePage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  }

  return (
    <div className="container px-4 max-w-4xl flex min-h-screen flex-col py-12 gap-4">
      <div className="flex items-center mb-4">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={handleGoBack}
          title="返回"
        >
          <ArrowLeft size={18}/>
        </Button>
        <h1 className="text-2xl font-bold">所在游轮</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>游轮信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p><strong>游轮名称:</strong></p>
            <p>示例游轮</p>
            <p><strong>预定开始时间:</strong></p>
            <p>2024-07-27 10:00</p>
            <p><strong>预定结束时间:</strong></p>
            <p>2024-07-27 14:00</p>
            <p><strong>人数上限:</strong></p>
            <p>100</p>
            <p><strong>入场金:</strong></p>
            <p>1000u</p>
            <p><strong>游戏总奖金:</strong></p>
            <p>100000u</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Button variant="outline">链接钱包</Button>
        <Button variant="outline">支付</Button>
        <Button variant="outline">下载模板</Button>
        <Button variant="outline">下载HASH号表单</Button>
        <Button variant="outline" className="col-span-2">上传HASH</Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">报名该游轮</h2>
        <div>
          <label className="block text-sm font-medium mb-1">玩家昵称</label>
          <Input placeholder="请输入"/>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">钱包地址</label>
          <div className="flex">
            <Input placeholder="支付入场" className="flex-grow mr-2"/>
            <Button variant="outline" size="icon">
              <Upload size={18}/>
            </Button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">上传字符和随机量</label>
          <div className="flex">
            <Input type="file" className="flex-grow mr-2"/>
            <Button variant="outline" size="icon">
              <Upload size={18}/>
            </Button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">telegram id</label>
          <Input placeholder="请输入"/>
        </div>
        <Button className="w-full" onClick={() => router.push('/table')}>I'm In</Button>
      </div>

    </div>
  );
}
