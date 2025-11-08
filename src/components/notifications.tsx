"use client";

import { useState } from "react";
import { AlertTriangle, Bell, CreditCard, Gift, Info, TrendingUp, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const notifications = [
  {
    id: 1,
    title: "新功能",
    message: "我们上线了预算仪表盘，快去体验。",
    date: "2024-12-08",
    icon: Info,
    color: "text-blue-500",
  },
  {
    id: 2,
    title: "账号提醒",
    message: "检测到异常登录，请及时检查。",
    date: "2024-12-07",
    icon: AlertTriangle,
    color: "text-yellow-500",
  },
  {
    id: 3,
    title: "支付提醒",
    message: "信用卡账单还有 3 天到期。",
    date: "2024-12-06",
    icon: CreditCard,
    color: "text-red-500",
  },
  {
    id: 4,
    title: "增长播报",
    message: "本月投资组合上涨 5%。",
    date: "2024-12-05",
    icon: TrendingUp,
    color: "text-green-500",
  },
  {
    id: 5,
    title: "新优惠",
    message: "解锁高息存款账户，收益更稳。",
    date: "2024-12-04",
    icon: Gift,
    color: "text-purple-500",
  },
];

export function Notifications() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" aria-label="查看通知" className="relative" onClick={() => setOpen(!open)}>
        <Bell className="h-5 w-5" />
        <span className="absolute right-0 top-0 size-2 rounded-full bg-red-500" />
      </Button>
      {open ? (
        <Card className="absolute right-0 mt-2 w-80 border shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">通知中心</CardTitle>
            <Button variant="ghost" size="icon" aria-label="关闭通知" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72 pr-2">
              {notifications.map((notification) => (
                <Card key={notification.id} className="mb-3 last:mb-0 border shadow-none">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`${notification.color} rounded-full bg-muted p-2`}>
                        <notification.icon className={`h-4 w-4 ${notification.color}`} />
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="font-medium leading-none">{notification.title}</p>
                        <p className="text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">{notification.date}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
