-- Adiciona lista de autores (nome, foto e link IJEP) por artigo.
ALTER TABLE "Post"
  ADD COLUMN IF NOT EXISTS "authors" JSONB NOT NULL DEFAULT '[]';
