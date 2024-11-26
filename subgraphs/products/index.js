import { ApolloServer, gql } from "apollo-server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { readFileSync } from "fs";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const typeDefs = gql`${readFileSync(__dirname + "/schema.graphql", "utf-8")}`

const resolvers = {
  Product: {
    __resolveReference(object) {
      return products.find(product => product.upc === object.upc);
    }
  },
  Query: {
    topProducts(_, args) {
      return products.slice(0, args.first);
    }
  },
  Identity: {
    likesProduct() {
      return true;
    }
  }
};

const server = new ApolloServer({
  schema: buildSubgraphSchema([
    {
      typeDefs,
      resolvers,
    }
  ])
});

server.listen({ port: 4002 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const products = [
  {
    upc: "1",
    name: "Table",
    price: 899,
    weight: 100,
    owner: {
      id: "1",
    }
  },
  {
    upc: "2",
    name: "Couch",
    price: 1299,
    weight: 1000,
    owner: {
      id: "2",
    }
  },
  {
    upc: "3",
    name: "Chair",
    price: 54,
    weight: 50,
    owner: {
      id: "1",
    }
  }
];
