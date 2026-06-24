import { createReadStream } from "node:fs";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { Readable } from "node:stream";
import {
  ObjectAclPolicy,
  ObjectPermission,
  canAccessObject,
  getObjectAclPolicy,
  setObjectAclPolicy,
} from "./objectAcl";

const METADATA_SUFFIX = ".meta.json";

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

export interface StoredObjectFileMetadata {
  contentType?: string;
  size?: number;
  metadata?: Record<string, string>;
}

export class LocalStoredObjectFile {
  constructor(public readonly filePath: string) {}

  get name(): string {
    return this.filePath;
  }

  async exists(): Promise<[boolean]> {
    try {
      await stat(this.filePath);
      return [true];
    } catch {
      return [false];
    }
  }

  async getMetadata(): Promise<[StoredObjectFileMetadata]> {
    const [exists] = await this.exists();
    if (!exists) {
      throw new ObjectNotFoundError();
    }

    const fileStat = await stat(this.filePath);
    const metadata = await readObjectMetadata(this.metadataPath(), true);

    return [
      {
        contentType: metadata.contentType ?? guessContentType(this.filePath),
        size: fileStat.size,
        metadata: metadata.metadata,
      },
    ];
  }

  createReadStream() {
    return createReadStream(this.filePath);
  }

  async setMetadata(input: { metadata?: Record<string, string> }): Promise<void> {
    const [exists] = await this.exists();
    if (!exists) {
      throw new ObjectNotFoundError();
    }

    const current = await readObjectMetadata(this.metadataPath(), true);
    await writeObjectMetadata(this.metadataPath(), {
      ...current,
      metadata: {
        ...(current.metadata ?? {}),
        ...(input.metadata ?? {}),
      },
    });
  }

  async writeFile(input: {
    content: Buffer | Uint8Array | string;
    contentType?: string;
    metadata?: Record<string, string>;
  }): Promise<void> {
    await mkdir(path.dirname(this.filePath), { recursive: true });
    await writeFile(this.filePath, input.content);
    await writeObjectMetadata(this.metadataPath(), {
      contentType: input.contentType,
      metadata: input.metadata ?? {},
    });
  }

  private metadataPath(): string {
    return `${this.filePath}${METADATA_SUFFIX}`;
  }
}

export class ObjectStorageService {
  getPublicObjectSearchPaths(): Array<string> {
    const pathsStr = process.env.PUBLIC_OBJECT_SEARCH_PATHS || defaultPublicSearchPath();
    return Array.from(
      new Set(
        pathsStr
          .split(",")
          .map((value) => value.trim())
          .filter((value) => value.length > 0),
      ),
    );
  }

  getPrivateObjectDir(): string {
    return process.env.PRIVATE_OBJECT_DIR || defaultPrivateObjectDir();
  }

  getObjectEntityPath(objectId: string): string {
    return path.join(this.getPrivateObjectDir(), "uploads", objectId);
  }

  getObjectEntityUploadURL(baseUrl: string): { objectId: string; uploadURL: string } {
    const objectId = randomUUID();
    const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    return {
      objectId,
      uploadURL: `${normalizedBaseUrl}/api/storage/uploads/${objectId}`,
    };
  }

  getObjectEntityObjectPath(objectId: string): string {
    return `/objects/uploads/${objectId}`;
  }

  async searchPublicObject(filePath: string): Promise<LocalStoredObjectFile | null> {
    for (const searchPath of this.getPublicObjectSearchPaths()) {
      const fullPath = path.join(searchPath, filePath);
      const file = new LocalStoredObjectFile(fullPath);
      const [exists] = await file.exists();
      if (exists) {
        return file;
      }
    }

    return null;
  }

  async downloadObject(file: LocalStoredObjectFile, cacheTtlSec: number = 3600): Promise<Response> {
    const [metadata] = await file.getMetadata();
    const aclPolicy = await getObjectAclPolicy(file);
    const isPublic = aclPolicy?.visibility === "public";

    const headers: Record<string, string> = {
      "Content-Type": metadata.contentType ?? "application/octet-stream",
      "Cache-Control": `${isPublic ? "public" : "private"}, max-age=${cacheTtlSec}`,
    };
    if (typeof metadata.size === "number") {
      headers["Content-Length"] = String(metadata.size);
    }

    const nodeStream = file.createReadStream();
    const webStream = Readable.toWeb(nodeStream) as ReadableStream;
    return new Response(webStream, { headers });
  }

  async writeObjectEntity(
    objectId: string,
    input: { content: Buffer | Uint8Array | string; contentType?: string },
  ): Promise<LocalStoredObjectFile> {
    const objectFile = new LocalStoredObjectFile(this.getObjectEntityPath(objectId));
    await objectFile.writeFile(input);
    return objectFile;
  }

  async getObjectEntityFile(objectPath: string): Promise<LocalStoredObjectFile> {
    if (!objectPath.startsWith("/objects/")) {
      throw new ObjectNotFoundError();
    }

    const parts = objectPath.slice(1).split("/");
    if (parts.length < 2) {
      throw new ObjectNotFoundError();
    }

    const entityId = parts.slice(1).join("/");
    const objectFile = new LocalStoredObjectFile(this.getObjectEntityPath(entityId));
    const [exists] = await objectFile.exists();
    if (!exists) {
      throw new ObjectNotFoundError();
    }
    return objectFile;
  }

  normalizeObjectEntityPath(rawPath: string): string {
    if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) {
      const url = new URL(rawPath);
      rawPath = url.pathname;
    }

    if (rawPath.startsWith("/api/storage/uploads/")) {
      return rawPath.replace("/api/storage/uploads/", "/objects/uploads/");
    }

    if (rawPath.startsWith("/api/storage/objects/")) {
      return rawPath.replace("/api/storage/objects/", "/objects/");
    }

    return rawPath;
  }

  async trySetObjectEntityAclPolicy(
    rawPath: string,
    aclPolicy: ObjectAclPolicy,
  ): Promise<string> {
    const normalizedPath = this.normalizeObjectEntityPath(rawPath);
    if (!normalizedPath.startsWith("/")) {
      return normalizedPath;
    }

    const objectFile = await this.getObjectEntityFile(normalizedPath);
    await setObjectAclPolicy(objectFile, aclPolicy);
    return normalizedPath;
  }

  async canAccessObjectEntity({
    userId,
    objectFile,
    requestedPermission,
  }: {
    userId?: string;
    objectFile: LocalStoredObjectFile;
    requestedPermission?: ObjectPermission;
  }): Promise<boolean> {
    return canAccessObject({
      userId,
      objectFile,
      requestedPermission: requestedPermission ?? ObjectPermission.READ,
    });
  }
}

async function readObjectMetadata(
  metadataPath: string,
  allowMissing: boolean,
): Promise<{ contentType?: string; metadata?: Record<string, string> }> {
  try {
    const raw = await readFile(metadataPath, "utf8");
    return JSON.parse(raw) as { contentType?: string; metadata?: Record<string, string> };
  } catch {
    if (allowMissing) {
      return {};
    }
    throw new Error(`Metadata not found: ${metadataPath}`);
  }
}

async function writeObjectMetadata(
  metadataPath: string,
  metadata: { contentType?: string; metadata?: Record<string, string> },
): Promise<void> {
  await mkdir(path.dirname(metadataPath), { recursive: true });
  await writeFile(metadataPath, JSON.stringify(metadata, null, 2), "utf8");
}

function guessContentType(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();
  switch (extension) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    case ".svg":
      return "image/svg+xml";
    case ".json":
      return "application/json";
    case ".css":
      return "text/css";
    case ".js":
    case ".mjs":
      return "text/javascript";
    default:
      return "application/octet-stream";
  }
}

function defaultPrivateObjectDir(): string {
  return path.resolve(process.cwd(), "data/private");
}

function defaultPublicSearchPath(): string {
  return path.resolve(process.cwd(), "data/public");
}