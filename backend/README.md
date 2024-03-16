# AgendamentosGW Back-end

Pré-requisitos para rodar localmente:
- Node 18.19+
- Yarn

Passo a passo de como rodar o projeto:

1. Entre nessa pasta (backend)
1. Rode o comando `yarn` para instalar as dependências
1. Se estiver no Linux, rode o comando `cp .env.example .env` para copiar o arquivo das variáveis de ambiente. Caso esteja no Windows, é só copiar e colar o arquivo com o nome `.env`
1. Entre no arquivo que acabou de criar (`.env`) e coloque as variáveis necessárias


## Tecnologias utilizadas

- Principal framework: [Fastify](https://fastify.dev/)
- ORM: [Drizzle-ORM](https://orm.drizzle.team/)
- Validação: [Zod](https://zod.dev/)
- Encriptação de senhas: [Bcrypt](https://www.npmjs.com/package/bcrypt/)
- Testes unitários: [Jest](https://jestjs.io/)