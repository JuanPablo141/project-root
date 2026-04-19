-- 001_initial_schema_v1.sql
-- Objetivo: criar a estrutura inicial executável do banco de dados (v1)
-- Escopo: bloco, curso, usuario e comentario

BEGIN;

-- =========================================
-- TABELA: bloco
-- =========================================
CREATE TABLE public.bloco (
    id_bloco INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome_bloco VARCHAR(50) NOT NULL,

    CONSTRAINT uq_bloco_nome UNIQUE (nome_bloco)
);

-- =========================================
-- TABELA: curso
-- =========================================
CREATE TABLE public.curso (
    id_curso INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome_curso VARCHAR(50) NOT NULL,
    id_bloco INTEGER NOT NULL,

    CONSTRAINT uq_curso_nome UNIQUE (nome_curso),

    CONSTRAINT fk_curso_bloco
        FOREIGN KEY (id_bloco)
        REFERENCES public.bloco (id_bloco)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT
);

-- =========================================
-- TABELA: usuario
-- =========================================
CREATE TABLE public.usuario (
    id_usuario INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    id_curso INTEGER NOT NULL,

    CONSTRAINT fk_usuario_curso
        FOREIGN KEY (id_curso)
        REFERENCES public.curso (id_curso)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT
);

-- Índice único case-insensitive para email
-- Evita duplicidade lógica como:
-- aluno@faculdade.com e Aluno@faculdade.com
CREATE UNIQUE INDEX uq_usuario_email_lower
    ON public.usuario (LOWER(email));

-- =========================================
-- TABELA: comentario
-- =========================================
CREATE TABLE public.comentario (
    id_comentario INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    texto TEXT NOT NULL,
    data_criacao TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    id_usuario INTEGER NOT NULL,

    CONSTRAINT fk_comentario_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES public.usuario (id_usuario)
        ON UPDATE RESTRICT
        ON DELETE RESTRICT
);

-- =========================================
-- ÍNDICES PARA FKs
-- =========================================
CREATE INDEX idx_curso_id_bloco
    ON public.curso (id_bloco);

CREATE INDEX idx_usuario_id_curso
    ON public.usuario (id_curso);

CREATE INDEX idx_comentario_id_usuario
    ON public.comentario (id_usuario);

COMMIT;