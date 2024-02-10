# nlw-24-1

## Introdução

Sistema onde é possível criar enquetes em diversos temas, possibilitando qualquer pessoa que queira participar realizar os votos e decidir qual opções é a melhor.

## Ferramentas envolvidas

1. **Fastify**: Poderosa ferramenta pra construção de APIS;

2. **Websocket**: Usado pra comunicação em tempo real, podendo enviar os resultados das votações em cada enquete no momento em que receber os eventos de voto;

3. **Redis**: Usado para guardar a quantidade de voto de cada enquete para visualização posterior;

> Pensado estratégicamente pra garantir uma performance na listagem das votações e suas quantidades, tirando a responsabilidade de criar querys no banco, possivelmente futuramente causando lentidões desnecessárias

4. **Cookies**: Usado justamente pra conseguirmos identificar os usuário na aplicação sem a necessidade de criar autenticação ou estratégias pra garantir que o usuário não faça mais de uma votação por enquete;

5. **Prisma**: Poderosissimo ORM pra lidar com conexão, construção e operações no nosso banco de dados;

6. **PostgreSQL**

7. **Zod**: Útil pra criarmos validação dos campos recebidos nas requisições dentro das rotas;

8. **Docker**

## Patterns usados

1. **Pub/Sub**

> Motivo: Acompanhado da conexão em tempo real com o usuário, sempre que houver um registro de voto, identificamos esse evento e retornamos em um canal para o usuário acompanhar de fato, em tempo real, os resultados.
