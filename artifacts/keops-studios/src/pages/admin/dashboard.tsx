import { useEffect, useState, useCallback } from "react";
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
  getGetSiteContentQueryKey,
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
import { LogOut, Plus, Trash2, Edit, GripVertical, Eye, Settings, Users, Gamepad2, BarChart3 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: session, isLoading: sessionLoading } = useGetAdminMe();
  const logoutMutation = useAdminLogout();
  const { data: content } = useGetSiteContent();

  useEffect(() => {
    if (!sessionLoading && !session?.authenticated) setLocation("/admin");
  }, [session, sessionLoading, setLocation]);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, { onSuccess: () => setLocation("/admin") });
  };

  if (sessionLoading || !session?.authenticated) {
    return <div className="min-h-screen bg-background flex items-center justify-center font-mono tracking-widest uppercase text-xs">Yükleniyor...</div>;
  }

  return (
    <PageTransition className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 border-r border-border bg-card p-6 flex flex-col h-auto md:h-screen sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-8">
          <Logo className="h-8" />
          <span className="font-display font-bold tracking-widest uppercase text-sm">Admin</span>
        </div>

        {/* Visit counter badge */}
        {content?.totalVisits != null && (
          <div className="mb-8 p-3 border border-border rounded-md bg-primary/5">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
              <Eye className="h-3 w-3" /> Toplam Ziyaret
            </div>
            <div className="text-2xl font-display font-black text-primary">{content.totalVisits.toLocaleString()}</div>
          </div>
        )}

        <div className="flex-1" />
        <Button variant="outline" className="w-full justify-start gap-2 font-mono uppercase tracking-widest text-xs" onClick={handleLogout}>
          <LogOut className="h-4 w-4" /> Çıkış Yap
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto">
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-8">Kontrol Paneli</h1>

        <Tabs defaultValue="games" className="w-full">
          <TabsList className="mb-8 bg-card border border-border h-auto p-1 flex-wrap gap-1">
            {[
              { value: "games", label: "Oyunlar", icon: Gamepad2 },
              { value: "team", label: "Ekip", icon: Users },
              { value: "content", label: "İçerik", icon: Settings },
              { value: "seo", label: "SEO & Logo", icon: BarChart3 },
            ].map(({ value, label, icon: Icon }) => (
              <TabsTrigger key={value} value={value}
                className="font-mono text-xs uppercase tracking-widest py-3 px-5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none flex items-center gap-2 flex-1 md:flex-none">
                <Icon className="h-3.5 w-3.5" /> {label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="games"><GamesManager /></TabsContent>
          <TabsContent value="team"><TeamManager /></TabsContent>
          <TabsContent value="content"><ContentManager /></TabsContent>
          <TabsContent value="seo"><SeoManager /></TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}

/* ─────────────────────────── GAMES MANAGER (Drag & Drop) ─────────────────────────── */

interface SortableGameRowProps {
  game: any;
  onEdit: (game: any) => void;
  onDelete: (id: number) => void;
  index: number;
}

function SortableGameRow({ game, onEdit, onDelete, index }: SortableGameRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: game.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style}
      className={`flex items-center justify-between p-4 ${index !== 0 ? "border-t border-border" : ""} bg-card hover:bg-muted/50 transition-colors`}>
      <div className="flex items-center gap-3">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1">
          <GripVertical className="h-4 w-4" />
        </button>
        <div>
          <div className="font-bold">{game.title}</div>
          <div className="text-xs text-muted-foreground font-mono uppercase tracking-widest">{game.platform} • {game.status}</div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => onEdit(game)} className="hover:bg-primary/20 hover:text-primary">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(game.id)} className="text-destructive hover:bg-destructive/10">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function GamesManager() {
  const { data: games = [] } = useListGames();
  const createGame = useCreateGame();
  const updateGame = useUpdateGame();
  const deleteGame = useDeleteGame();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [localGames, setLocalGames] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "", description: "", platform: "", genre: "", status: "In Development", imageUrl: "", storeUrl: "", order: 0,
  });

  useEffect(() => {
    setLocalGames([...games].sort((a, b) => a.order - b.order));
  }, [games]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = localGames.findIndex(g => g.id === active.id);
    const newIndex = localGames.findIndex(g => g.id === over.id);
    const reordered = arrayMove(localGames, oldIndex, newIndex);
    setLocalGames(reordered);
    await Promise.all(reordered.map((game, i) =>
      updateGame.mutateAsync({ id: game.id, data: { order: i } })
    ));
    queryClient.invalidateQueries({ queryKey: getListGamesQueryKey() });
    toast({ title: "Sıralama güncellendi" });
  }, [localGames, updateGame, queryClient, toast]);

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", platform: "", genre: "", status: "In Development", imageUrl: "", storeUrl: "", order: localGames.length });
    setIsOpen(true);
  };

  const handleOpenEdit = (game: any) => {
    setEditingId(game.id);
    setFormData({ title: game.title || "", description: game.description || "", platform: game.platform || "", genre: game.genre || "", status: game.status || "", imageUrl: game.imageUrl || "", storeUrl: game.storeUrl || "", order: game.order || 0 });
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateGame.mutate({ id: editingId, data: formData }, {
        onSuccess: () => { toast({ title: "Oyun güncellendi" }); setIsOpen(false); queryClient.invalidateQueries({ queryKey: getListGamesQueryKey() }); }
      });
    } else {
      createGame.mutate({ data: formData }, {
        onSuccess: () => { toast({ title: "Oyun eklendi" }); setIsOpen(false); queryClient.invalidateQueries({ queryKey: getListGamesQueryKey() }); }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Bu oyunu silmek istediğinizden emin misiniz?")) {
      deleteGame.mutate({ id }, { onSuccess: () => { toast({ title: "Oyun silindi" }); queryClient.invalidateQueries({ queryKey: getListGamesQueryKey() }); } });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-widest">Oyun Kataloğu</h2>
          <p className="text-xs text-muted-foreground font-mono mt-1">Sıralamak için sürükleyip bırakın</p>
        </div>
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
                <div className="space-y-2"><Label>Başlık</Label><Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required /></div>
                <div className="space-y-2"><Label>Platform</Label><Input value={formData.platform} onChange={e => setFormData({ ...formData, platform: e.target.value })} required placeholder="PC, Mobile" /></div>
                <div className="space-y-2"><Label>Tür</Label><Input value={formData.genre} onChange={e => setFormData({ ...formData, genre: e.target.value })} /></div>
                <div className="space-y-2"><Label>Durum</Label><Input value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} required /></div>
                <div className="space-y-2"><Label>Görsel URL</Label><Input value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} /></div>
                <div className="space-y-2"><Label>Sıra</Label><Input type="number" value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} /></div>
                <div className="col-span-2 space-y-2"><Label>Mağaza URL</Label><Input value={formData.storeUrl} onChange={e => setFormData({ ...formData, storeUrl: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label>Açıklama</Label><Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
              <Button type="submit" className="w-full font-mono tracking-widest uppercase" disabled={createGame.isPending || updateGame.isPending}>Kaydet</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-border">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={localGames.map(g => g.id)} strategy={verticalListSortingStrategy}>
            {localGames.map((game, i) => (
              <SortableGameRow key={game.id} game={game} index={i} onEdit={handleOpenEdit} onDelete={handleDelete} />
            ))}
          </SortableContext>
        </DndContext>
        {localGames.length === 0 && <div className="p-8 text-center text-muted-foreground font-mono text-sm uppercase tracking-widest">Kayıt bulunamadı</div>}
      </div>
    </div>
  );
}

/* ─────────────────────────── TEAM MANAGER ─────────────────────────── */

function TeamManager() {
  const { data: team = [] } = useListTeamMembers();
  const createTeam = useCreateTeamMember();
  const updateTeam = useUpdateTeamMember();
  const deleteTeam = useDeleteTeamMember();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", role: "", roleTr: "", roleEn: "", bio: "", bioTr: "", bioEn: "", imageUrl: "", linkedinUrl: "", twitterUrl: "", order: 0 });

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({ name: "", role: "", roleTr: "", roleEn: "", bio: "", bioTr: "", bioEn: "", imageUrl: "", linkedinUrl: "", twitterUrl: "", order: 0 });
    setIsOpen(true);
  };

  const handleOpenEdit = (member: any) => {
    setEditingId(member.id);
    setFormData({ name: member.name || "", role: member.role || "", roleTr: member.roleTr || "", roleEn: member.roleEn || "", bio: member.bio || "", bioTr: member.bioTr || "", bioEn: member.bioEn || "", imageUrl: member.imageUrl || "", linkedinUrl: member.linkedinUrl || "", twitterUrl: member.twitterUrl || "", order: member.order || 0 });
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const action = editingId
      ? updateTeam.mutate({ id: editingId, data: formData }, { onSuccess: () => { toast({ title: "Üye güncellendi" }); setIsOpen(false); queryClient.invalidateQueries({ queryKey: getListTeamMembersQueryKey() }); } })
      : createTeam.mutate({ data: formData }, { onSuccess: () => { toast({ title: "Ekip üyesi eklendi" }); setIsOpen(false); queryClient.invalidateQueries({ queryKey: getListTeamMembersQueryKey() }); } });
    return action;
  };

  const handleDelete = (id: number) => {
    if (confirm("Bu üyeyi silmek istediğinizden emin misiniz?")) {
      deleteTeam.mutate({ id }, { onSuccess: () => { toast({ title: "Üye silindi" }); queryClient.invalidateQueries({ queryKey: getListTeamMembersQueryKey() }); } });
    }
  };

  const sorted = [...team].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold uppercase tracking-widest">Ekip Üyeleri</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenNew} className="gap-2 font-mono uppercase tracking-widest text-xs"><Plus className="h-4 w-4" /> Yeni Ekle</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl border-border bg-card max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display uppercase tracking-widest">{editingId ? "Üyeyi Düzenle" : "Yeni Üye Ekle"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>İsim</Label><Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required /></div>
                <div className="space-y-2"><Label>Sıra</Label><Input type="number" value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} required /></div>
                <div className="space-y-2"><Label>Görsel URL</Label><Input value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} /></div>
                <div className="space-y-2"><Label>Varsayılan Rol</Label><Input value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} required placeholder="Developer" /></div>
                <div className="space-y-2"><Label>LinkedIn</Label><Input value={formData.linkedinUrl} onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })} /></div>
                <div className="space-y-2"><Label>Twitter</Label><Input value={formData.twitterUrl} onChange={e => setFormData({ ...formData, twitterUrl: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 border border-border/50 p-4 rounded-md bg-muted/20">
                <div className="space-y-4">
                  <h4 className="font-mono text-xs uppercase tracking-widest text-primary font-bold border-b border-border pb-2">🇹🇷 Türkçe</h4>
                  <div className="space-y-2"><Label>Rol (TR)</Label><Input value={formData.roleTr} onChange={e => setFormData({ ...formData, roleTr: e.target.value })} placeholder="Yazılım Geliştirici" /></div>
                  <div className="space-y-2"><Label>Biyografi (TR)</Label><Textarea value={formData.bioTr} onChange={e => setFormData({ ...formData, bioTr: e.target.value })} rows={4} /></div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-mono text-xs uppercase tracking-widest text-secondary font-bold border-b border-border pb-2">🇬🇧 English</h4>
                  <div className="space-y-2"><Label>Role (EN)</Label><Input value={formData.roleEn} onChange={e => setFormData({ ...formData, roleEn: e.target.value })} placeholder="Software Developer" /></div>
                  <div className="space-y-2"><Label>Bio (EN)</Label><Textarea value={formData.bioEn} onChange={e => setFormData({ ...formData, bioEn: e.target.value })} rows={4} /></div>
                </div>
              </div>
              <Button type="submit" className="w-full font-mono tracking-widest uppercase" disabled={createTeam.isPending || updateTeam.isPending}>Kaydet</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-border">
        {sorted.map((member, i) => (
          <div key={member.id} className={`flex items-center justify-between p-4 ${i !== 0 ? "border-t border-border" : ""} bg-card hover:bg-muted/50 transition-colors`}>
            <div>
              <div className="font-bold">{member.name}</div>
              <div className="flex gap-3">
                {member.roleTr && <div className="text-xs text-primary font-mono uppercase tracking-widest">🇹🇷 {member.roleTr}</div>}
                {member.roleEn && <div className="text-xs text-secondary font-mono uppercase tracking-widest">🇬🇧 {member.roleEn}</div>}
                {!member.roleTr && !member.roleEn && <div className="text-xs text-muted-foreground font-mono uppercase tracking-widest">{member.role}</div>}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(member)} className="hover:bg-primary/20 hover:text-primary"><Edit className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)} className="text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
        {sorted.length === 0 && <div className="p-8 text-center text-muted-foreground font-mono text-sm uppercase tracking-widest">Kayıt bulunamadı</div>}
      </div>
    </div>
  );
}

/* ─────────────────────────── CONTENT MANAGER ─────────────────────────── */

function ContentManager() {
  const { data: content } = useGetSiteContent();
  const updateContent = useUpdateSiteContent();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    heroTitleTr: "", heroTitleEn: "", heroSubtitleTr: "", heroSubtitleEn: "",
    aboutTr: "", aboutEn: "", instagramUrl: "", twitterUrl: "", linkedinUrl: "", youtubeUrl: "", discordUrl: "", email: "",
  });

  useEffect(() => {
    if (content) {
      setFormData({
        heroTitleTr: content.heroTitleTr || "", heroTitleEn: content.heroTitleEn || "",
        heroSubtitleTr: content.heroSubtitleTr || "", heroSubtitleEn: content.heroSubtitleEn || "",
        aboutTr: content.aboutTr || "", aboutEn: content.aboutEn || "",
        instagramUrl: content.instagramUrl || "", twitterUrl: content.twitterUrl || "",
        linkedinUrl: content.linkedinUrl || "", youtubeUrl: content.youtubeUrl || "",
        discordUrl: content.discordUrl || "", email: content.email || "",
      });
    }
  }, [content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContent.mutate({ data: formData }, {
      onSuccess: () => { toast({ title: "İçerik güncellendi" }); queryClient.invalidateQueries({ queryKey: getGetSiteContentQueryKey() }); }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 border border-border p-6 bg-card">
          <h3 className="font-display font-bold uppercase tracking-widest text-lg border-b border-border pb-4">🇹🇷 Türkçe İçerik</h3>
          <div className="space-y-2"><Label>Hero Başlık (TR)</Label><Input value={formData.heroTitleTr} onChange={e => setFormData({ ...formData, heroTitleTr: e.target.value })} /></div>
          <div className="space-y-2"><Label>Hero Alt Başlık (TR)</Label><Input value={formData.heroSubtitleTr} onChange={e => setFormData({ ...formData, heroSubtitleTr: e.target.value })} /></div>
          <div className="space-y-2"><Label>Hakkımızda (TR)</Label><Textarea value={formData.aboutTr} onChange={e => setFormData({ ...formData, aboutTr: e.target.value })} rows={5} /></div>
        </div>
        <div className="space-y-6 border border-border p-6 bg-card">
          <h3 className="font-display font-bold uppercase tracking-widest text-lg border-b border-border pb-4">🇬🇧 English Content</h3>
          <div className="space-y-2"><Label>Hero Title (EN)</Label><Input value={formData.heroTitleEn} onChange={e => setFormData({ ...formData, heroTitleEn: e.target.value })} /></div>
          <div className="space-y-2"><Label>Hero Subtitle (EN)</Label><Input value={formData.heroSubtitleEn} onChange={e => setFormData({ ...formData, heroSubtitleEn: e.target.value })} /></div>
          <div className="space-y-2"><Label>About (EN)</Label><Textarea value={formData.aboutEn} onChange={e => setFormData({ ...formData, aboutEn: e.target.value })} rows={5} /></div>
        </div>
      </div>

      <div className="border border-border p-6 bg-card space-y-4">
        <h3 className="font-display font-bold uppercase tracking-widest text-lg border-b border-border pb-4">Sosyal Medya & İletişim</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Twitter / X</Label><Input value={formData.twitterUrl} onChange={e => setFormData({ ...formData, twitterUrl: e.target.value })} placeholder="https://twitter.com/..." /></div>
          <div className="space-y-2"><Label>Instagram</Label><Input value={formData.instagramUrl} onChange={e => setFormData({ ...formData, instagramUrl: e.target.value })} placeholder="https://instagram.com/..." /></div>
          <div className="space-y-2"><Label>LinkedIn</Label><Input value={formData.linkedinUrl} onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })} placeholder="https://linkedin.com/..." /></div>
          <div className="space-y-2"><Label>YouTube</Label><Input value={formData.youtubeUrl} onChange={e => setFormData({ ...formData, youtubeUrl: e.target.value })} placeholder="https://youtube.com/..." /></div>
          <div className="space-y-2"><Label>Discord</Label><Input value={formData.discordUrl} onChange={e => setFormData({ ...formData, discordUrl: e.target.value })} placeholder="https://discord.gg/..." /></div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="iletisim@keops.com" /></div>
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full font-mono uppercase tracking-widest" disabled={updateContent.isPending}>
        {updateContent.isPending ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
      </Button>
    </form>
  );
}

/* ─────────────────────────── SEO & LOGO MANAGER ─────────────────────────── */

function SeoManager() {
  const { data: content } = useGetSiteContent();
  const updateContent = useUpdateSiteContent();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    logoUrl: "", faviconUrl: "",
    metaTitleTr: "", metaTitleEn: "",
    metaDescriptionTr: "", metaDescriptionEn: "",
  });

  useEffect(() => {
    if (content) {
      setFormData({
        logoUrl: content.logoUrl || "",
        faviconUrl: content.faviconUrl || "",
        metaTitleTr: content.metaTitleTr || "",
        metaTitleEn: content.metaTitleEn || "",
        metaDescriptionTr: content.metaDescriptionTr || "",
        metaDescriptionEn: content.metaDescriptionEn || "",
      });
    }
  }, [content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContent.mutate({ data: formData }, {
      onSuccess: () => { toast({ title: "SEO & Logo ayarları kaydedildi" }); queryClient.invalidateQueries({ queryKey: getGetSiteContentQueryKey() }); }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Logo & Favicon */}
      <div className="border border-border p-6 bg-card space-y-6">
        <h3 className="font-display font-bold uppercase tracking-widest text-lg border-b border-border pb-4">🖼️ Logo & Favicon</h3>
        <p className="text-sm text-muted-foreground font-mono">Logo URL girmezseniz varsayılan Keops logosu kullanılır.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label>Logo URL</Label>
            <Input value={formData.logoUrl} onChange={e => setFormData({ ...formData, logoUrl: e.target.value })} placeholder="https://..." />
            {formData.logoUrl && (
              <div className="p-4 border border-border rounded-md bg-muted/30 flex items-center justify-center">
                <img src={formData.logoUrl} alt="Logo preview" className="h-16 object-contain" onError={e => (e.currentTarget.style.display = "none")} />
              </div>
            )}
          </div>
          <div className="space-y-3">
            <Label>Favicon URL</Label>
            <Input value={formData.faviconUrl} onChange={e => setFormData({ ...formData, faviconUrl: e.target.value })} placeholder="https://... (.ico veya .png)" />
            {formData.faviconUrl && (
              <div className="p-4 border border-border rounded-md bg-muted/30 flex items-center gap-3">
                <img src={formData.faviconUrl} alt="Favicon preview" className="h-8 w-8 object-contain" onError={e => (e.currentTarget.style.display = "none")} />
                <span className="text-xs text-muted-foreground font-mono">Favicon önizleme</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEO Meta */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6 border border-border p-6 bg-card">
          <h3 className="font-display font-bold uppercase tracking-widest text-lg border-b border-border pb-4">🇹🇷 SEO Türkçe</h3>
          <div className="space-y-2">
            <Label>Sayfa Başlığı (TR)</Label>
            <Input value={formData.metaTitleTr} onChange={e => setFormData({ ...formData, metaTitleTr: e.target.value })} placeholder="Keops Studios — Oyun Geliştirme" />
            <p className="text-xs text-muted-foreground font-mono">Tarayıcı sekmesinde ve arama sonuçlarında görünür.</p>
          </div>
          <div className="space-y-2">
            <Label>Meta Açıklama (TR)</Label>
            <Textarea value={formData.metaDescriptionTr} onChange={e => setFormData({ ...formData, metaDescriptionTr: e.target.value })} rows={3} placeholder="Keops Studios bağımsız bir oyun geliştirme stüdyosudur..." />
            <p className="text-xs text-muted-foreground font-mono">{formData.metaDescriptionTr.length}/160 karakter (ideal: 120–160)</p>
          </div>
        </div>
        <div className="space-y-6 border border-border p-6 bg-card">
          <h3 className="font-display font-bold uppercase tracking-widest text-lg border-b border-border pb-4">🇬🇧 SEO English</h3>
          <div className="space-y-2">
            <Label>Page Title (EN)</Label>
            <Input value={formData.metaTitleEn} onChange={e => setFormData({ ...formData, metaTitleEn: e.target.value })} placeholder="Keops Studios — Game Development" />
            <p className="text-xs text-muted-foreground font-mono">Shown in browser tab and search results.</p>
          </div>
          <div className="space-y-2">
            <Label>Meta Description (EN)</Label>
            <Textarea value={formData.metaDescriptionEn} onChange={e => setFormData({ ...formData, metaDescriptionEn: e.target.value })} rows={3} placeholder="Keops Studios is an independent game development studio..." />
            <p className="text-xs text-muted-foreground font-mono">{formData.metaDescriptionEn.length}/160 chars (ideal: 120–160)</p>
          </div>
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full font-mono uppercase tracking-widest" disabled={updateContent.isPending}>
        {updateContent.isPending ? "Kaydediliyor..." : "Kaydet"}
      </Button>
    </form>
  );
}
