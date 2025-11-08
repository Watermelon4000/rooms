"use client"

import Link from "next/link";
import { SupabaseAuthPanel } from "@/components/auth/supabase-auth-panel";

export default function SignInPage() {
  return (
    <div className="space-y-6">
      <SupabaseAuthPanel
        heading="登录账号"
        description="使用 Supabase 官方 Auth 组件，支持邮箱 + 密码。"
        initialView="sign_in"
      />
      <p className="text-center text-sm text-muted-foreground">
        还没有账号？{" "}
        <Link href="/sign-up" className="font-medium text-primary hover:underline">
          前往注册
        </Link>
      </p>
    </div>
  );
}
