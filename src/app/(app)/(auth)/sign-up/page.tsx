"use client"

import Link from "next/link";
import { SupabaseAuthPanel } from "@/components/auth/supabase-auth-panel";

export default function SignUpPage() {
  return (
    <div className="space-y-6">
      <SupabaseAuthPanel
        heading="创建账号"
        description="注册完成后即可前往 Dashboard 创建你的房间。"
        initialView="sign_up"
      />
      <p className="text-center text-sm text-muted-foreground">
        已经拥有账号？{" "}
        <Link href="/sign-in" className="font-medium text-primary hover:underline">
          去登录
        </Link>
      </p>
    </div>
  );
}
