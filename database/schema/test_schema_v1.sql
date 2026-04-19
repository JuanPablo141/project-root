-- test_schema_v1.sql
-- Pré-requisito: o arquivo 001_initial_schema_v1.sql já deve ter sido executado.
-- Objetivo: validar estrutura, integridade referencial, unicidade e regra de negócio.

-- =========================================================
-- TESTE 1: fluxo principal da aplicação
-- Esperado: sucesso
-- =========================================================
BEGIN;

DO $$
DECLARE
    v_bloco_id INTEGER;
    v_curso_id INTEGER;
    v_usuario_id INTEGER;
    v_comentario_id INTEGER;
    v_total INTEGER;
BEGIN
    INSERT INTO public.bloco (nome_bloco)
    VALUES ('Bloco Teste Fluxo')
    RETURNING id_bloco INTO v_bloco_id;

    INSERT INTO public.curso (nome_curso, id_bloco)
    VALUES ('Curso Teste Fluxo', v_bloco_id)
    RETURNING id_curso INTO v_curso_id;

    INSERT INTO public.usuario (nome, email, senha_hash, id_curso)
    VALUES ('Usuário Teste Fluxo', 'fluxo@example.com', '$2b$12$hash.fake.teste', v_curso_id)
    RETURNING id_usuario INTO v_usuario_id;

    INSERT INTO public.comentario (texto, id_usuario)
    VALUES ('Comentário de teste do fluxo principal', v_usuario_id)
    RETURNING id_comentario INTO v_comentario_id;

    SELECT COUNT(*)
    INTO v_total
    FROM public.comentario c
    JOIN public.usuario u
        ON u.id_usuario = c.id_usuario
    JOIN public.curso cu
        ON cu.id_curso = u.id_curso
    JOIN public.bloco b
        ON b.id_bloco = cu.id_bloco
    WHERE c.id_comentario = v_comentario_id
      AND u.id_usuario = v_usuario_id
      AND cu.id_curso = v_curso_id
      AND b.id_bloco = v_bloco_id;

    IF v_total = 1 THEN
        RAISE NOTICE 'TESTE 1 OK: fluxo principal validado com sucesso.';
    ELSE
        RAISE EXCEPTION 'TESTE 1 FALHOU: join final não retornou o registro esperado.';
    END IF;
END $$;

ROLLBACK;

-- =========================================================
-- TESTE 2: FK inválida em curso.id_bloco
-- Esperado: falha por foreign_key_violation
-- =========================================================
DO $$
BEGIN
    BEGIN
        INSERT INTO public.curso (nome_curso, id_bloco)
        VALUES ('Curso FK Inválida', 999999);

        RAISE EXCEPTION 'TESTE 2 FALHOU: inserção de curso com bloco inexistente foi aceita.';
    EXCEPTION
        WHEN foreign_key_violation THEN
            RAISE NOTICE 'TESTE 2 OK: banco rejeitou curso com id_bloco inexistente.';
    END;
END $$;

-- =========================================================
-- TESTE 3: FK inválida em usuario.id_curso
-- Esperado: falha por foreign_key_violation
-- =========================================================
DO $$
BEGIN
    BEGIN
        INSERT INTO public.usuario (nome, email, senha_hash, id_curso)
        VALUES ('Usuário FK Inválida', 'fkusuario@example.com', '$2b$12$hash.fake.teste', 999999);

        RAISE EXCEPTION 'TESTE 3 FALHOU: inserção de usuário com curso inexistente foi aceita.';
    EXCEPTION
        WHEN foreign_key_violation THEN
            RAISE NOTICE 'TESTE 3 OK: banco rejeitou usuário com id_curso inexistente.';
    END;
END $$;

-- =========================================================
-- TESTE 4: FK inválida em comentario.id_usuario
-- Esperado: falha por foreign_key_violation
-- =========================================================
DO $$
BEGIN
    BEGIN
        INSERT INTO public.comentario (texto, id_usuario)
        VALUES ('Comentário com usuário inexistente', 999999);

        RAISE EXCEPTION 'TESTE 4 FALHOU: inserção de comentário com usuário inexistente foi aceita.';
    EXCEPTION
        WHEN foreign_key_violation THEN
            RAISE NOTICE 'TESTE 4 OK: banco rejeitou comentário com id_usuario inexistente.';
    END;
END $$;

-- =========================================================
-- TESTE 5: email duplicado exato
-- Esperado: falha por unique_violation
-- =========================================================
BEGIN;

DO $$
DECLARE
    v_bloco_id INTEGER;
    v_curso_id INTEGER;
BEGIN
    INSERT INTO public.bloco (nome_bloco)
    VALUES ('Bloco Teste Email Exato')
    RETURNING id_bloco INTO v_bloco_id;

    INSERT INTO public.curso (nome_curso, id_bloco)
    VALUES ('Curso Teste Email Exato', v_bloco_id)
    RETURNING id_curso INTO v_curso_id;

    INSERT INTO public.usuario (nome, email, senha_hash, id_curso)
    VALUES ('Usuário Base', 'duplicado@example.com', '$2b$12$hash.fake.1', v_curso_id);

    BEGIN
        INSERT INTO public.usuario (nome, email, senha_hash, id_curso)
        VALUES ('Usuário Duplicado', 'duplicado@example.com', '$2b$12$hash.fake.2', v_curso_id);

        RAISE EXCEPTION 'TESTE 5 FALHOU: banco aceitou email duplicado exato.';
    EXCEPTION
        WHEN unique_violation THEN
            RAISE NOTICE 'TESTE 5 OK: banco rejeitou email duplicado exato.';
    END;
END $$;

ROLLBACK;

-- =========================================================
-- TESTE 6: email duplicado com diferença de maiúsculas/minúsculas
-- Esperado: falha por unique_violation
-- =========================================================
BEGIN;

DO $$
DECLARE
    v_bloco_id INTEGER;
    v_curso_id INTEGER;
BEGIN
    INSERT INTO public.bloco (nome_bloco)
    VALUES ('Bloco Teste Email Case')
    RETURNING id_bloco INTO v_bloco_id;

    INSERT INTO public.curso (nome_curso, id_bloco)
    VALUES ('Curso Teste Email Case', v_bloco_id)
    RETURNING id_curso INTO v_curso_id;

    INSERT INTO public.usuario (nome, email, senha_hash, id_curso)
    VALUES ('Usuário Base Case', 'case@example.com', '$2b$12$hash.fake.1', v_curso_id);

    BEGIN
        INSERT INTO public.usuario (nome, email, senha_hash, id_curso)
        VALUES ('Usuário Duplicado Case', 'CASE@example.com', '$2b$12$hash.fake.2', v_curso_id);

        RAISE EXCEPTION 'TESTE 6 FALHOU: banco aceitou email duplicado com variação de caixa.';
    EXCEPTION
        WHEN unique_violation THEN
            RAISE NOTICE 'TESTE 6 OK: banco rejeitou email duplicado case-insensitive.';
    END;
END $$;

ROLLBACK;

-- =========================================================
-- TESTE 7: NOT NULL em usuario.nome
-- Esperado: falha por not_null_violation
-- =========================================================
BEGIN;

DO $$
DECLARE
    v_bloco_id INTEGER;
    v_curso_id INTEGER;
BEGIN
    INSERT INTO public.bloco (nome_bloco)
    VALUES ('Bloco Teste Not Null Usuario')
    RETURNING id_bloco INTO v_bloco_id;

    INSERT INTO public.curso (nome_curso, id_bloco)
    VALUES ('Curso Teste Not Null Usuario', v_bloco_id)
    RETURNING id_curso INTO v_curso_id;

    BEGIN
        INSERT INTO public.usuario (nome, email, senha_hash, id_curso)
        VALUES (NULL, 'nonnull-usuario@example.com', '$2b$12$hash.fake', v_curso_id);

        RAISE EXCEPTION 'TESTE 7 FALHOU: banco aceitou usuario.nome nulo.';
    EXCEPTION
        WHEN not_null_violation THEN
            RAISE NOTICE 'TESTE 7 OK: banco rejeitou usuario.nome nulo.';
    END;
END $$;

ROLLBACK;

-- =========================================================
-- TESTE 8: NOT NULL em comentario.texto
-- Esperado: falha por not_null_violation
-- =========================================================
BEGIN;

DO $$
DECLARE
    v_bloco_id INTEGER;
    v_curso_id INTEGER;
    v_usuario_id INTEGER;
BEGIN
    INSERT INTO public.bloco (nome_bloco)
    VALUES ('Bloco Teste Not Null Comentario')
    RETURNING id_bloco INTO v_bloco_id;

    INSERT INTO public.curso (nome_curso, id_bloco)
    VALUES ('Curso Teste Not Null Comentario', v_bloco_id)
    RETURNING id_curso INTO v_curso_id;

    INSERT INTO public.usuario (nome, email, senha_hash, id_curso)
    VALUES ('Usuário Comentário Null', 'comentario-null@example.com', '$2b$12$hash.fake', v_curso_id)
    RETURNING id_usuario INTO v_usuario_id;

    BEGIN
        INSERT INTO public.comentario (texto, id_usuario)
        VALUES (NULL, v_usuario_id);

        RAISE EXCEPTION 'TESTE 8 FALHOU: banco aceitou comentario.texto nulo.';
    EXCEPTION
        WHEN not_null_violation THEN
            RAISE NOTICE 'TESTE 8 OK: banco rejeitou comentario.texto nulo.';
    END;
END $$;

ROLLBACK;

-- =========================================================
-- TESTE 9: ON DELETE RESTRICT em bloco -> curso
-- Esperado: falha por foreign_key_violation
-- =========================================================
BEGIN;

DO $$
DECLARE
    v_bloco_id INTEGER;
BEGIN
    INSERT INTO public.bloco (nome_bloco)
    VALUES ('Bloco Teste Delete Restrict')
    RETURNING id_bloco INTO v_bloco_id;

    INSERT INTO public.curso (nome_curso, id_bloco)
    VALUES ('Curso Dependente Delete Restrict', v_bloco_id);

    BEGIN
        DELETE FROM public.bloco
        WHERE id_bloco = v_bloco_id;

        RAISE EXCEPTION 'TESTE 9 FALHOU: banco permitiu excluir bloco com curso dependente.';
    EXCEPTION
        WHEN foreign_key_violation THEN
            RAISE NOTICE 'TESTE 9 OK: banco bloqueou exclusão de bloco com curso dependente.';
    END;
END $$;

ROLLBACK;

-- =========================================================
-- TESTE 10: ON DELETE RESTRICT em curso -> usuario
-- Esperado: falha por foreign_key_violation
-- =========================================================
BEGIN;

DO $$
DECLARE
    v_bloco_id INTEGER;
    v_curso_id INTEGER;
BEGIN
    INSERT INTO public.bloco (nome_bloco)
    VALUES ('Bloco Teste Delete Curso')
    RETURNING id_bloco INTO v_bloco_id;

    INSERT INTO public.curso (nome_curso, id_bloco)
    VALUES ('Curso Teste Delete Curso', v_bloco_id)
    RETURNING id_curso INTO v_curso_id;

    INSERT INTO public.usuario (nome, email, senha_hash, id_curso)
    VALUES ('Usuário Dependente Curso', 'delete-curso@example.com', '$2b$12$hash.fake', v_curso_id);

    BEGIN
        DELETE FROM public.curso
        WHERE id_curso = v_curso_id;

        RAISE EXCEPTION 'TESTE 10 FALHOU: banco permitiu excluir curso com usuário dependente.';
    EXCEPTION
        WHEN foreign_key_violation THEN
            RAISE NOTICE 'TESTE 10 OK: banco bloqueou exclusão de curso com usuário dependente.';
    END;
END $$;

ROLLBACK;

-- =========================================================
-- TESTE 11: ON DELETE RESTRICT em usuario -> comentario
-- Esperado: falha por foreign_key_violation
-- =========================================================
BEGIN;

DO $$
DECLARE
    v_bloco_id INTEGER;
    v_curso_id INTEGER;
    v_usuario_id INTEGER;
BEGIN
    INSERT INTO public.bloco (nome_bloco)
    VALUES ('Bloco Teste Delete Usuario')
    RETURNING id_bloco INTO v_bloco_id;

    INSERT INTO public.curso (nome_curso, id_bloco)
    VALUES ('Curso Teste Delete Usuario', v_bloco_id)
    RETURNING id_curso INTO v_curso_id;

    INSERT INTO public.usuario (nome, email, senha_hash, id_curso)
    VALUES ('Usuário Dependente Comentário', 'delete-usuario@example.com', '$2b$12$hash.fake', v_curso_id)
    RETURNING id_usuario INTO v_usuario_id;

    INSERT INTO public.comentario (texto, id_usuario)
    VALUES ('Comentário que impede exclusão do usuário', v_usuario_id);

    BEGIN
        DELETE FROM public.usuario
        WHERE id_usuario = v_usuario_id;

        RAISE EXCEPTION 'TESTE 11 FALHOU: banco permitiu excluir usuário com comentário dependente.';
    EXCEPTION
        WHEN foreign_key_violation THEN
            RAISE NOTICE 'TESTE 11 OK: banco bloqueou exclusão de usuário com comentário dependente.';
    END;
END $$;

ROLLBACK;

-- =========================================================
-- TESTE 12: validação explícita da consulta de domínio
-- Esperado: sucesso e retorno de 1 registro no NOTICE
-- =========================================================
BEGIN;

DO $$
DECLARE
    v_bloco_id INTEGER;
    v_curso_id INTEGER;
    v_usuario_id INTEGER;
    v_registros INTEGER;
BEGIN
    INSERT INTO public.bloco (nome_bloco)
    VALUES ('Bloco Teste Join Domínio')
    RETURNING id_bloco INTO v_bloco_id;

    INSERT INTO public.curso (nome_curso, id_bloco)
    VALUES ('Curso Teste Join Domínio', v_bloco_id)
    RETURNING id_curso INTO v_curso_id;

    INSERT INTO public.usuario (nome, email, senha_hash, id_curso)
    VALUES ('Usuário Join Domínio', 'join-dominio@example.com', '$2b$12$hash.fake', v_curso_id)
    RETURNING id_usuario INTO v_usuario_id;

    INSERT INTO public.comentario (texto, id_usuario)
    VALUES ('Comentário para validação do join de domínio', v_usuario_id);

    SELECT COUNT(*)
    INTO v_registros
    FROM public.comentario c
    JOIN public.usuario u
        ON u.id_usuario = c.id_usuario
    JOIN public.curso cu
        ON cu.id_curso = u.id_curso
    JOIN public.bloco b
        ON b.id_bloco = cu.id_bloco
    WHERE u.id_usuario = v_usuario_id
      AND cu.id_curso = v_curso_id
      AND b.id_bloco = v_bloco_id;

    IF v_registros = 1 THEN
        RAISE NOTICE 'TESTE 12 OK: consulta de domínio retornou exatamente 1 registro.';
    ELSE
        RAISE EXCEPTION 'TESTE 12 FALHOU: consulta de domínio retornou % registros.', v_registros;
    END IF;
END $$;

ROLLBACK;