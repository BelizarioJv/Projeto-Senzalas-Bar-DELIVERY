import express from "express";
import cors from "cors";
import "dotenv/config";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServer } from "@apollo/server";
import { resolvers } from "./graphql/resolver/resolvers.js";
import { typeDefs } from "./graphql/schema/schema.js";

//Inicalizaçao do server
const app = express();

const apollo = new ApolloServer({ typeDefs, resolvers });
await apollo.start();


//Configuraçao do server
app.use(express.json());
app.use(cors());
app.use("/graphql", expressMiddleware(apollo));


// ---------------------------------
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
  