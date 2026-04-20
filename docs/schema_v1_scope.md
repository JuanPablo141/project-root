# Escopo do schema v1

## Objetivo

Esta versão representa a estrutura inicial executável do banco de dados do projeto, com foco em disponibilizar uma base relacional estável para integração com o backend e evolução incremental do sistema.

## Origem

O schema v1 foi derivado do modelo lógico completo do projeto, mas não materializa todas as entidades previstas na modelagem geral. O recorte foi feito para atender ao escopo da feature `database-schema-v1`, cujo objetivo é permitir a criação inicial do banco com tabelas, chaves primárias e chaves estrangeiras essenciais.

## Entidades incluídas na v1

As tabelas previstas nesta versão são:

- `usuario`
- `bloco`
- `curso`
- `comentario`

Essas entidades cobrem a estrutura relacional principal necessária para:

- cadastro de usuários
- associação de usuários a cursos
- associação de cursos a blocos
- registro de comentários

## Entidades adiadas para versões futuras

As tabelas abaixo, embora façam parte da visão completa do sistema, não serão implementadas nesta primeira versão:

- `emocao`
- `embedding`
- `classificacao_emocao`

## Justificativa do recorte

O adiamento dessas entidades foi decidido para reduzir a complexidade inicial do banco e permitir a entrega de uma primeira versão funcional, estável e validável. As estruturas relacionadas à classificação emocional e embeddings dependem de definições adicionais de processamento e integração com a camada de inteligência da aplicação.

## Diretriz de evolução

As entidades não incluídas no schema v1 deverão ser adicionadas em versões futuras do banco por meio de novas migrations, sem necessidade de alteração dos artefatos conceituais e lógicos já versionados na branch principal.

## Observação de implementação

O schema v1 não substitui o modelo conceitual nem o modelo lógico completos do projeto. Ele representa apenas um subconjunto físico inicial, criado para viabilizar a implantação incremental da aplicação.