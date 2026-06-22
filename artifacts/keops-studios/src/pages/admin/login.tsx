import { useState } from "react";
import { useLocation } from "wouter";
import { useAdminLogin, useGetAdminMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import { useToast } from "@/hooks/use-toast";
import { PageTransition } from "@/components/layout/page-transition";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: session, isLoading: sessionLoading } = useGetAdminMe();
  const loginMutation = useAdminLogin();

  // Redirect if already logged in
  if (session?.authenticated && !sessionLoading) {
    setLocation("/admin/dashboard");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    loginMutation.mutate(
      { data: { password } },
      {
        onSuccess: (data) => {
          if (data.authenticated) {
            toast({ title: "Giriş başarılı" });
            setLocation("/admin/dashboard");
          } else {
            toast({ title: "Hatalı şifre", variant: "destructive" });
          }
        },
        onError: () => {
          toast({ title: "Giriş başarısız", variant: "destructive" });
        }
      }
    );
  };

  return (
    <PageTransition className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm border border-border bg-card p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
        
        <div className="flex flex-col items-center mb-8">
          <Logo className="h-16 mb-6" />
          <h1 className="text-2xl font-black uppercase tracking-widest text-center">
            Sistem Erişimi
          </h1>
          <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest mt-2">
            Yetkili Personel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="font-mono text-xs uppercase tracking-widest">
              Güvenlik Anahtarı
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-background border-border focus-visible:ring-primary font-mono"
              placeholder="••••••••"
              disabled={loginMutation.isPending}
            />
          </div>

          <Button
            type="submit"
            className="w-full font-mono uppercase tracking-widest"
            disabled={loginMutation.isPending || !password}
          >
            {loginMutation.isPending ? "Doğrulanıyor..." : "Giriş Yap"}
          </Button>
        </form>
      </div>
    </PageTransition>
  );
}
