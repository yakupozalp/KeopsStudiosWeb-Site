import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, label = "Görsel Yükle", className }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Sadece görsel dosyaları yüklenebilir.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Dosya boyutu en fazla 10 MB olabilir.");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const urlRes = await fetch("/api/storage/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
      });

      if (!urlRes.ok) throw new Error("URL alınamadı");
      const { uploadURL, objectPath } = await urlRes.json();

      const uploadRes = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) throw new Error("Yükleme başarısız");

      // objectPath is like "/objects/uploads/uuid"
      // The serve route already prepends "/objects/", so strip it here
      const servePath = objectPath.replace(/^\/objects/, "");
      onChange(`/api/storage/objects${servePath}`);
    } catch (err) {
      setError("Yükleme başarısız oldu. Tekrar deneyin.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        className="relative border-2 border-dashed border-border rounded-md p-4 transition-colors hover:border-primary/50 cursor-pointer"
        onClick={() => !isUploading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />

        {value ? (
          <div className="relative group">
            <img
              src={value}
              alt="Yüklenen görsel"
              className="w-full h-40 object-contain rounded"
              onError={e => { e.currentTarget.style.display = "none"; }}
            />
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onChange(""); }}
              className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-4 text-muted-foreground">
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            ) : (
              <Upload className="h-8 w-8" />
            )}
            <p className="text-sm font-mono uppercase tracking-widest">
              {isUploading ? "Yükleniyor..." : label}
            </p>
            <p className="text-xs">Sürükle & bırak veya tıkla • Maks 10 MB</p>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-destructive font-mono">{error}</p>}

      {value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full text-xs font-mono"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Upload className="h-3 w-3 mr-2" />}
          Görseli Değiştir
        </Button>
      )}
    </div>
  );
}
