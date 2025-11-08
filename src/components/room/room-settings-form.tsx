"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type RoomSettingsFormProps = {
  roomId: string;
  initialTitle: string;
  initialGridSize: number;
  initialPublic: boolean;
};

export function RoomSettingsForm({
  roomId,
  initialTitle,
  initialGridSize,
  initialPublic,
}: RoomSettingsFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [gridSize, setGridSize] = useState(initialGridSize);
  const [isPublic, setIsPublic] = useState(initialPublic);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      toast.error("房间标题不能为空");
      return;
    }

    setSubmitting(true);
    const response = await fetch("/api/room/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomId,
        title,
        gridSize,
        isPublic,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      toast.error(data.error ?? "更新失败");
      setSubmitting(false);
      return;
    }

    toast.success("房间信息已更新");
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="room-title">
          房间名称
        </label>
        <Input
          id="room-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="例如：像素客厅"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground" htmlFor="grid-size">
          网格尺寸（10-40）
        </label>
        <Input
          id="grid-size"
          type="number"
          min={10}
          max={40}
          value={gridSize}
          onChange={(event) => setGridSize(Number(event.target.value))}
        />
      </div>
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <p className="text-sm font-medium">公开房间</p>
          <p className="text-xs text-muted-foreground">
            {isPublic ? "房间可在公共列表中被看到" : "仅限持有链接或房主访问"}
          </p>
        </div>
        <Button
          type="button"
          variant={isPublic ? "default" : "outline"}
          size="sm"
          onClick={() => setIsPublic((prev) => !prev)}
        >
          {isPublic ? "公开" : "私密"}
        </Button>
      </div>
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "保存中..." : "保存设置"}
      </Button>
    </form>
  );
}
