import { Prisma, PostStatus } from '@prisma/client';
import { prisma } from '../config/prisma';

export type PostFilters = {
  search?: string;
  excludeIds?: string[];
  page?: number;
  limit?: number;
};

export type PostWithMedia = Prisma.PostGetPayload<{ include: { coverMedia: true } }>;

export class PostRepository {
  listPublished(filters?: PostFilters): Promise<PostWithMedia[]> {
    return prisma.post.findMany({
      where: {
        status: PostStatus.published,
        id: filters?.excludeIds?.length ? { notIn: filters.excludeIds } : undefined,
        title: filters?.search
          ? {
              contains: filters.search,
              mode: 'insensitive'
            }
          : undefined
      },
      orderBy: { publishedAt: 'desc' },
      include: { coverMedia: true }
    });
  }

  async paginatePublished(filters?: PostFilters) {
    const page = Math.max(filters?.page ?? 1, 1);
    const limit = Math.min(Math.max(filters?.limit ?? 9, 1), 50);
    const where: Prisma.PostWhereInput = {
      status: PostStatus.published,
      id: filters?.excludeIds?.length ? { notIn: filters.excludeIds } : undefined,
      title: filters?.search
        ? {
            contains: filters.search,
            mode: 'insensitive'
          }
        : undefined
    };

    const [items, total] = await prisma.$transaction([
      prisma.post.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { coverMedia: true }
      }),
      prisma.post.count({ where })
    ]);

    const totalPages = Math.max(Math.ceil(total / limit), 1);

    return { items, total, page, limit, totalPages };
  }

  listFeatured(limit = 3): Promise<PostWithMedia[]> {
    return prisma.post.findMany({
      where: { status: PostStatus.published, isFeatured: true },
      orderBy: [{ updatedAt: 'desc' }, { publishedAt: 'desc' }],
      take: limit,
      include: { coverMedia: true }
    });
  }

  async listMostViewed(limit = 3, excludeIds?: string[]): Promise<PostWithMedia[]> {
    const posts = await prisma.post.findMany({
      where: {
        status: PostStatus.published,
        id: excludeIds?.length ? { notIn: excludeIds } : undefined
      },
      orderBy: [
        { views: 'desc' },
        { publishedAt: 'desc' }
      ],
      take: limit,
      include: { coverMedia: true }
    });
    
    return posts;
  }

  countFeaturedPublished(excludeId?: string): Promise<number> {
    return prisma.post.count({
      where: {
        status: PostStatus.published,
        isFeatured: true,
        id: excludeId ? { not: excludeId } : undefined
      }
    });
  }

  findPublishedBySlug(slug: string): Promise<PostWithMedia | null> {
    return prisma.post.findFirst({
      where: { slug, status: PostStatus.published },
      include: { coverMedia: true }
    });
  }

  findPublishedById(id: string): Promise<PostWithMedia | null> {
    return prisma.post.findFirst({
      where: { id, status: PostStatus.published },
      include: { coverMedia: true }
    });
  }

  listAll(): Promise<PostWithMedia[]> {
    return prisma.post.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { coverMedia: true }
    });
  }

  findById(id: string): Promise<PostWithMedia | null> {
    return prisma.post.findUnique({ where: { id }, include: { coverMedia: true } });
  }

  findBySlug(slug: string): Promise<PostWithMedia | null> {
    return prisma.post.findUnique({ where: { slug }, include: { coverMedia: true } });
  }

  create(data: Prisma.PostCreateInput): Promise<PostWithMedia> {
    return prisma.post.create({ data, include: { coverMedia: true } });
  }

  update(id: string, data: Prisma.PostUpdateInput): Promise<PostWithMedia> {
    return prisma.post.update({ where: { id }, data, include: { coverMedia: true } });
  }

  delete(id: string): Promise<PostWithMedia> {
    return prisma.post.delete({ where: { id }, include: { coverMedia: true } });
  }

  async listDistinctAuthors(): Promise<
    Array<{ name: string; photoUrl: string | null; photoMediaId: string | null; profileUrl: string | null }>
  > {
    const rows = await prisma.post.findMany({ select: { authors: true } });
    const map = new Map<
      string,
      { name: string; photoUrl: string | null; photoMediaId: string | null; profileUrl: string | null }
    >();
    for (const row of rows) {
      const list = Array.isArray(row.authors) ? row.authors : [];
      for (const raw of list) {
        if (!raw || typeof raw !== 'object') continue;
        const a = raw as Record<string, unknown>;
        const name = typeof a.name === 'string' ? a.name.trim() : '';
        if (!name) continue;
        const profileUrl = typeof a.profileUrl === 'string' && a.profileUrl ? a.profileUrl : null;
        const photoUrl = typeof a.photoUrl === 'string' && a.photoUrl ? a.photoUrl : null;
        const photoMediaId = typeof a.photoMediaId === 'string' && a.photoMediaId ? a.photoMediaId : null;
        const key = (profileUrl || name).toLowerCase();
        const existing = map.get(key);
        if (!existing) {
          map.set(key, { name, photoUrl, photoMediaId, profileUrl });
        } else if (!existing.photoUrl && photoUrl) {
          existing.photoUrl = photoUrl;
          existing.photoMediaId = photoMediaId;
        }
      }
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }

  incrementViews(id: string): Promise<PostWithMedia> {
    return prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } },
      include: { coverMedia: true }
    });
  }
}
