import "dotenv/config";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServer } from "@apollo/server";
import { resolvers } from "./graphql/resolver/resolvers.js";
import { typeDefs } from "./graphql/schema/schema.js";
import { connectRedis } from "./services/redis-cache.service.js";
import { createApp } from "./http/app.js";
// Inicializa Redis e Apollo Server.
connectRedis();
// Inicializa o Apollo Server com os resolvers e typeDefs
const apollo = new ApolloServer({ typeDefs, resolvers });
await apollo.start();
//Inicializa o app express com o middleware do Apollo Server
const app = createApp(expressMiddleware(apollo));
// ---------------------------------
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
