import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createArticle, deleteArticle, fetchAdminArticles, fetchArticleAuthors, publishArticle, unpublishArticle, updateArticle } from '@/api/queries';
import type { Article, ArticleAuthor } from '@/types';

export function useArticles() {
  return useQuery<Article[]>({ queryKey: ['admin', 'posts'], queryFn: fetchAdminArticles });
}

export function useArticleAuthors() {
  return useQuery<ArticleAuthor[]>({ queryKey: ['admin', 'post-authors'], queryFn: fetchArticleAuthors });
}

export function useCreateArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Article>) => createArticle(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'posts'] });
      qc.invalidateQueries({ queryKey: ['articles'] });
      qc.invalidateQueries({ queryKey: ['admin', 'post-authors'] });
    }
  });
}

export function useUpdateArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Article> }) => updateArticle(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'posts'] });
      qc.invalidateQueries({ queryKey: ['articles'] });
      qc.invalidateQueries({ queryKey: ['admin', 'post-authors'] });
    }
  });
}

export function useDeleteArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'posts'] });
      qc.invalidateQueries({ queryKey: ['articles'] });
      qc.invalidateQueries({ queryKey: ['admin', 'post-authors'] });
    }
  });
}

export function usePublishArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: publishArticle,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'posts'] });
      qc.invalidateQueries({ queryKey: ['articles'] });
      qc.invalidateQueries({ queryKey: ['admin', 'post-authors'] });
    }
  });
}

export function useUnpublishArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: unpublishArticle,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'posts'] });
      qc.invalidateQueries({ queryKey: ['articles'] });
      qc.invalidateQueries({ queryKey: ['admin', 'post-authors'] });
    }
  });
}
