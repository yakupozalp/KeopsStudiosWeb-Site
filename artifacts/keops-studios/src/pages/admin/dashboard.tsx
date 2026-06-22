import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { 
  useGetAdminMe, 
  useAdminLogout,
  useListGames,
  useCreateGame,
  useUpdateGame,
  useDeleteGame,
  useListTeamMembers,
  useCreateTeamMember,
  useUpdateTeamMember,
  useDeleteTeamMember,
  useGetSiteContent,
  useUpdateSiteContent,
  getListGamesQueryKey,
  getListTeamMembersQueryKey,
  getGetSiteContentQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { PageTransition } from "@/components/layout/page-transition";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Plus, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: session, isLoading: sessionLoading } = useGetAdminMe();
  const logoutMutation = useAdminLogout();

  useEffect(() => {
    if (!sessionLoading && !session?.authenticated) {
      setLocation("/admin");
    }
  }, [session, sessionLoading, setLocation]);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setLocation("/admin");
      }
    });
  };

  if (sessionLoading || !session?.authenticated) {
    return <div className="min-h-screen bg-background flex items-center justify-center font-mono tracking-widest uppercase text-xs">Yükleniyor...</div>;
  }

  return (
    <PageTransition className="min-h-screen bg-background flex flex-col md:flex-row">
      <div className="w-full md:w-64 border-r border-border bg-card p-6 flex flex-col h-auto md:h-screen sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-12">
          <Logo className="h-8" />
          <span className="font-display font-bold tracking-widest uppercase">Admin</span>
        </div>
        
        <div className="flex-1" />

        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 font-mono uppercase tracking-widest text-xs mt-8 md:mt-0"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" /> Çıkış Yap
        </Button>
      </div>

      <div className="flex-1 p-6 md:p-12 overflow-y-auto">
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-8">Sistem Kontrol Paneli</h1>
        
        <Tabs defaultValue="games" className="w-full">
          <TabsList className="mb-8 bg-card border border-border h-auto p-1 flex-wrap">
            <TabsTrigger value="games" className="font-mono text-xs uppercase tracking-widest py-3 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none flex-1 md:flex-none">Oyunlar</TabsTrigger>
            <TabsTrigger value="team" className="font-mono text-xs uppercase tracking-widest py-3 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none flex-1 md:flex-none">Ekip</TabsTrigger>
            <TabsTrigger value="content" className="font-mono text-xs uppercase tracking-widest py-3 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none flex-1 md:flex-none">İçerik</TabsTrigger>
          </TabsList>
          
          <TabsContent value="games">
            <GamesManager />
          </TabsContent>
          
          <TabsContent value="team">
            <TeamManager />
          </TabsContent>

          <TabsContent value="content">
            <ContentManager />
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}

function GamesManager() {
  const { data: games = [] } = useListGames();
  const createGame = useCreateGame();
  const updateGame = useUpdateGame();
  const deleteGame = useDeleteGame();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    title: "", description: "", platform: "", genre: "", status: "In Development", imageUrl: "", storeUrl: "", order: 0
  });

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", platform: "", genre: "", status: "In Development", imageUrl: "", storeUrl: "", order: 0 });
    setIsOpen(true);
  };

  const handleOpenEdit = (game: any) => {
    setEditingId(game.id);
    setFormData({
      title: game.title || "",
      description: game.description || "",
      platform: game.platform || "",
      genre: game.genre || "",
      status: game.status || "",
      imageUrl: game.imageUrl || "",
      storeUrl: game.storeUrl || "",
      order: game.order || 0
    });
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateGame.mutate({ id: editingId, data: formData }, {
        onSuccess: () => {
          toast({ title: "Oyun güncellendi" });
          setIsOpen(false);
          queryClient.invalidateQueries({ queryKey: getListGamesQueryKey() });
        }
      });
    } else {
      createGame.mutate({ data: formData }, {
        onSuccess: () => {
          toast({ title: "Oyun eklendi" });
          setIsOpen(false);
          queryClient.invalidateQueries({ queryKey: getListGamesQueryKey() });
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Emin misiniz?")) {
      deleteGame.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Oyun silindi" });
          queryClient.invalidateQueries({ queryKey: getListGamesQueryKey() });
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold uppercase tracking-widest">Oyun Kataloğu</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenNew} className="gap-2 font-mono uppercase tracking-widest text-xs">
              <Plus className="h-4 w-4" /> Yeni Ekle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl border-border bg-card max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display uppercase tracking-widest">{editingId ? "Oyunu Düzenle" : "Yeni Oyun Ekle"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Başlık</Label>
                  <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Input value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})} required placeholder="PC, Mobile" />
                </div>
                <div className="space-y-2">
                  <Label>Tür</Label>
                  <Input value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Durum</Label>
                  <Input value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Sıra (Order)</Label>
                  <Input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} />
                </div>
                <div className="space-y-2">
                  <Label>Görsel URL</Label>
                  <Input value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Mağaza URL</Label>
                  <Input value={formData.storeUrl} onChange={e => setFormData({...formData, storeUrl: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Açıklama</Label>
                <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} />
              </div>
              <Button type="submit" className="w-full font-mono tracking-widest uppercase" disabled={createGame.isPending || updateGame.isPending}>
                Kaydet
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-border">
        {games.map((game, i) => (
          <div key={game.id} className={`flex items-center justify-between p-4 ${i !== 0 ? 'border-t border-border' : ''} bg-card hover:bg-muted/50 transition-colors`}>
            <div>
              <div className="font-bold">{game.title}</div>
              <div className="text-xs text-muted-foreground font-mono uppercase tracking-widest">{game.platform} • {game.status}</div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(game)} className="hover:bg-primary/20 hover:text-primary">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(game.id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {games.length === 0 && <div className="p-8 text-center text-muted-foreground font-mono text-sm uppercase tracking-widest">Kayıt bulunamadı</div>}
      </div>
    </div>
  );
}

function TeamManager() {
  const { data: team = [] } = useListTeamMembers();
  const createTeam = useCreateTeamMember();
  const updateTeam = useUpdateTeamMember();
  const deleteTeam = useDeleteTeamMember();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    roleTr: "",
    roleEn: "",
    bio: "",
    bioTr: "",
    bioEn: "",
    imageUrl: "",
    linkedinUrl: "",
    twitterUrl: "",
    order: 0
  });

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({ name: "", role: "", roleTr: "", roleEn: "", bio: "", bioTr: "", bioEn: "", imageUrl: "", linkedinUrl: "", twitterUrl: "", order: 0 });
    setIsOpen(true);
  };

  const handleOpenEdit = (member: any) => {
    setEditingId(member.id);
    setFormData({
      name: member.name || "",
      role: member.role || "",
      roleTr: member.roleTr || "",
      roleEn: member.roleEn || "",
      bio: member.bio || "",
      bioTr: member.bioTr || "",
      bioEn: member.bioEn || "",
      imageUrl: member.imageUrl || "",
      linkedinUrl: member.linkedinUrl || "",
      twitterUrl: member.twitterUrl || "",
      order: member.order || 0
    });
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateTeam.mutate({ id: editingId, data: formData }, {
        onSuccess: () => {
          toast({ title: "Üye güncellendi" });
          setIsOpen(false);
          queryClient.invalidateQueries({ queryKey: getListTeamMembersQueryKey() });
        }
      });
    } else {
      createTeam.mutate({ data: formData }, {
        onSuccess: () => {
          toast({ title: "Ekip üyesi eklendi" });
          setIsOpen(false);
          queryClient.invalidateQueries({ queryKey: getListTeamMembersQueryKey() });
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Emin misiniz?")) {
      deleteTeam.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Üye silindi" });
          queryClient.invalidateQueries({ queryKey: getListTeamMembersQueryKey() });
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold uppercase tracking-widest">Ekip Üyeleri</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenNew} className="gap-2 font-mono uppercase tracking-widest text-xs">
              <Plus className="h-4 w-4" /> Yeni Ekle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl border-border bg-card max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display uppercase tracking-widest">{editingId ? "Üyeyi Düzenle" : "Yeni Üye Ekle"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>İsim</Label>
                  <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Sıra (Order)</Label>
                  <Input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} required />
                </div>
                <div className="space-y-2">
                  <Label>Görsel URL</Label>
                  <Input value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Varsayılan Rol (Fallback)</Label>
                  <Input value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required placeholder="Örn: Developer" />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn URL</Label>
                  <Input value={formData.linkedinUrl} onChange={e => setFormData({...formData, linkedinUrl: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Twitter URL</Label>
                  <Input value={formData.twitterUrl} onChange={e => setFormData({...formData, twitterUrl: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border border-border/50 p-4 rounded-md bg-muted/20">
                <div className="space-y-4">
                  <h4 className="font-mono text-xs uppercase tracking-widest text-primary font-bold border-b border-border pb-2">🇹🇷 Türkçe</h4>
                  <div className="space-y-2">
                    <Label>Rol (TR)</Label>
                    <Input value={formData.roleTr} onChange={e => setFormData({...formData, roleTr: e.target.value})} placeholder="Örn: Yazılım Geliştirici" />
                  </div>
                  <div className="space-y-2">
                    <Label>Biyografi (TR)</Label>
                    <Textarea value={formData.bioTr} onChange={e => setFormData({...formData, bioTr: e.target.value})} rows={4} placeholder="Türkçe biyografi..." />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-mono text-xs uppercase tracking-widest text-secondary font-bold border-b border-border pb-2">🇬🇧 English</h4>
                  <div className="space-y-2">
                    <Label>Role (EN)</Label>
                    <Input value={formData.roleEn} onChange={e => setFormData({...formData, roleEn: e.target.value})} placeholder="e.g. Software Developer" />
                  </div>
                  <div className="space-y-2">
                    <Label>Bio (EN)</Label>
                    <Textarea value={formData.bioEn} onChange={e => setFormData({...formData, bioEn: e.target.value})} rows={4} placeholder="English bio..." />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full font-mono tracking-widest uppercase" disabled={createTeam.isPending || updateTeam.isPending}>
                Kaydet
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-border">
        {team.map((member, i) => (
          <div key={member.id} className={`flex items-center justify-between p-4 ${i !== 0 ? 'border-t border-border' : ''} bg-card hover:bg-muted/50 transition-colors`}>
            <div>
              <div className="font-bold">{member.name}</div>
              <div className="text-xs text-primary font-mono uppercase tracking-widest">{member.roleTr || member.role}</div>
              {member.roleEn && <div className="text-xs text-secondary font-mono uppercase tracking-widest">{member.roleEn}</div>}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(member)} className="hover:bg-primary/20 hover:text-primary">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {team.length === 0 && <div className="p-8 text-center text-muted-foreground font-mono text-sm uppercase tracking-widest">Kayıt bulunamadı</div>}
      </div>
    </div>
  );
}

function ContentManager() {
  const { data: content } = useGetSiteContent();
  const updateContent = useUpdateSiteContent();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    heroTitleTr: "", heroTitleEn: "", heroSubtitleTr: "", heroSubtitleEn: "",
    aboutTr: "", aboutEn: "", instagramUrl: "", twitterUrl: "", linkedinUrl: "", youtubeUrl: "", discordUrl: "", email: ""
  });

  useEffect(() => {
    if (content) {
      setFormData({
        heroTitleTr: content.heroTitleTr || "", heroTitleEn: content.heroTitleEn || "",
        heroSubtitleTr: content.heroSubtitleTr || "", heroSubtitleEn: content.heroSubtitleEn || "",
        aboutTr: content.aboutTr || "", aboutEn: content.aboutEn || "",
        instagramUrl: content.instagramUrl || "", twitterUrl: content.twitterUrl || "",
        linkedinUrl: content.linkedinUrl || "", youtubeUrl: content.youtubeUrl || "",
        discordUrl: content.discordUrl || "", email: content.email || ""
      });
    }
  }, [content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContent.mutate({ data: formData }, {
      onSuccess: () => {
        toast({ title: "İçerik güncellendi" });
        queryClient.invalidateQueries({ queryKey: getGetSiteContentQueryKey() });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 border border-border p-6 bg-card">
          <h3 className="font-display font-bold uppercase tracking-widest text-lg border-b border-border pb-4">🇹🇷 Türkçe İçerik</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Hero Başlık (TR)</Label>
              <Input value={formData.heroTitleTr} onChange={e => setFormData({...formData, heroTitleTr: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Hero Alt Başlık (TR)</Label>
              <Input value={formData.heroSubtitleTr} onChange={e => setFormData({...formData, heroSubtitleTr: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Hakkımızda (TR)</Label>
              <Textarea value={formData.aboutTr} onChange={e => setFormData({...formData, aboutTr: e.target.value})} rows={5} />
            </div>
          </div>
        </div>

        <div className="space-y-6 border border-border p-6 bg-card">
          <h3 className="font-display font-bold uppercase tracking-widest text-lg border-b border-border pb-4">🇬🇧 English Content</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Hero Title (EN)</Label>
              <Input value={formData.heroTitleEn} onChange={e => setFormData({...formData, heroTitleEn: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Hero Subtitle (EN)</Label>
              <Input value={formData.heroSubtitleEn} onChange={e => setFormData({...formData, heroSubtitleEn: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>About (EN)</Label>
              <Textarea value={formData.aboutEn} onChange={e => setFormData({...formData, aboutEn: e.target.value})} rows={5} />
            </div>
          </div>
        </div>
      </div>

      <div className="border border-border p-6 bg-card space-y-6">
        <h3 className="font-display font-bold uppercase tracking-widest text-lg border-b border-border pb-4">Sosyal Medya & İletişim</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Twitter / X</Label>
            <Input value={formData.twitterUrl} onChange={e => setFormData({...formData, twitterUrl: e.target.value})} placeholder="https://twitter.com/..." />
          </div>
          <div className="space-y-2">
            <Label>Instagram</Label>
            <Input value={formData.instagramUrl} onChange={e => setFormData({...formData, instagramUrl: e.target.value})} placeholder="https://instagram.com/..." />
          </div>
          <div className="space-y-2">
            <Label>LinkedIn</Label>
            <Input value={formData.linkedinUrl} onChange={e => setFormData({...formData, linkedinUrl: e.target.value})} placeholder="https://linkedin.com/..." />
          </div>
          <div className="space-y-2">
            <Label>YouTube</Label>
            <Input value={formData.youtubeUrl} onChange={e => setFormData({...formData, youtubeUrl: e.target.value})} placeholder="https://youtube.com/..." />
          </div>
          <div className="space-y-2">
            <Label>Discord</Label>
            <Input value={formData.discordUrl} onChange={e => setFormData({...formData, discordUrl: e.target.value})} placeholder="https://discord.gg/..." />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="iletisim@keops.com" />
          </div>
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full font-mono uppercase tracking-widest" disabled={updateContent.isPending}>
        {updateContent.isPending ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
      </Button>
    </form>
  );
}
