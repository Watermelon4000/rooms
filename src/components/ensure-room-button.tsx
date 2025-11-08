"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button, type ButtonProps } from "@/components/ui/button";

type EnsureRoomButtonProps = ButtonProps & {
  redirect?: "editor" | "room";
};

export function EnsureRoomButton({
  redirect = "editor",
  children,
  ...props
}: EnsureRoomButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const response = await fetch("/api/room/ensure", { method: "POST" });
    if (!response.ok) {
      const data = await response.json();
      toast.error(data.error ?? "创建房间失败");
      setLoading(false);
      return;
    }

    const data = await response.json();
    const roomId = data.id as string;
    toast.success("房间准备就绪");
    setLoading(false);
    router.push(`/${redirect}/${roomId}`);
  };

  return (
    <Button {...props} onClick={handleClick} disabled={loading}>
      {loading ? "处理中..." : children}
    </Button>
  );
}
