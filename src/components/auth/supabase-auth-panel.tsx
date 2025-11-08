"use client"

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { getBrowserSupabaseClient } from "@/lib/supabase";

type SupabaseAuthPanelProps = {
  heading: string;
  description?: string;
  initialView?: "sign_in" | "sign_up" | "forgotten_password";
};

export function SupabaseAuthPanel({
  heading,
  description,
  initialView = "sign_in",
}: SupabaseAuthPanelProps) {
  const router = useRouter();
  const search = useSearchParams();
  const redirectTo = search?.get("redirect") ?? "/dashboard";
  const supabase = getBrowserSupabaseClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "SIGNED_IN") {
        router.push(redirectTo);
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [router, redirectTo, supabase]);

  return (
    <div className="mx-auto max-w-md rounded-3xl border bg-card/80 p-8 shadow-xl backdrop-blur">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">{heading}</h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="mt-6">
        <Auth
          supabaseClient={supabase}
          view={initialView}
          providers={[]}
          redirectTo={redirectTo}
          appearance={{
            theme: ThemeSupa,
            className: {
              container: "supabase-auth-ui",
              button: "rounded-md bg-primary text-primary-foreground hover:bg-primary/90",
              input:
                "border border-input bg-transparent text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 rounded-md px-3 py-2",
            },
            variables: {
              default: {
                colors: {
                  brand: "var(--primary)",
                  brandAccent: "var(--primary-foreground)",
                },
              },
            },
          }}
          localization={{
            variables: {
              sign_in: {
                email_label: "邮箱",
                password_label: "密码",
                button_label: "登录",
              },
              sign_up: {
                email_label: "邮箱",
                password_label: "密码",
                button_label: "注册",
              },
            },
          }}
        />
      </div>
    </div>
  );
}
