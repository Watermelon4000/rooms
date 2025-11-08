"use client"

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getBrowserSupabaseClient } from "@/lib/supabase";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = getBrowserSupabaseClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("已退出");
    router.push("/");
    router.refresh();
  };

  return (
    <Button variant="ghost" onClick={handleSignOut} size="sm">
      退出
    </Button>
  );
}
