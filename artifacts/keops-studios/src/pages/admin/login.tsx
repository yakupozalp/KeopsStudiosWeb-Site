import { useState } from "react";
import { useLocation } from "wouter";
import { useAdminLogin, useGetAdminMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import { useToast } from "@/hooks/use-toast";
import { PageTransition } from "@/components/layout/page-transition";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";

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
            toast({ title: "Giriş başarılı", description: "Sisteme yönlendiriliyorsunuz." });
            setLocation("/admin/dashboard");
          } else {
            toast({ title: "Erişim Reddedildi", description: "Geçersiz güvenlik anahtarı.", variant: "destructive" });
          }
        },
        onError: () => {
          toast({ title: "Sistem Hatası", description: "Bağlantı kurulamadı.", variant: "destructive" });
        }
      }
    );
  };

  return (
    <PageTransition className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="orb-1 absolute top-0 left-0 w-full h-full bg-primary/5 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-card/60 backdrop-blur-xl border border-border/50 rounded-xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
        
        <div className="p-10">
          <div className="flex flex-col items-center mb-10">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl border border-primary/30 flex items-center justify-center mb-6 shadow-[0_0_30px_hsl(var(--primary)/0.2)]">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-black uppercase tracking-widest text-center text-white mb-2">
              Sistem Erişimi
            </h1>
            <p className="text-muted-foreground font-mono text-xs uppercase tracking-[0.3em]">
              Yetkili Personel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="password" className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em] ml-1">
                Güvenlik Anahtarı
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50 border-border/50 focus-visible:ring-primary focus-visible:border-primary font-mono h-12 text-center text-lg tracking-widest shadow-inner"
                placeholder="••••••••"
                disabled={loginMutation.isPending}
                autoFocus
              />
            </div>

            <Button
              type="submit"
              className="w-full h-14 font-mono uppercase tracking-widest font-bold bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_hsl(var(--primary)/0.3)] transition-all"
              disabled={loginMutation.isPending || !password}
            >
              {loginMutation.isPending ? "Doğrulanıyor..." : "Bağlantı Kur"}
            </Button>
          </form>
        </div>
      </motion.div>
    </PageTransition>
  );
}
