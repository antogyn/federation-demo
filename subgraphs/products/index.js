import { ApolloServer, gql } from "apollo-server";
import { buildSubgraphSchema } from "@apollo/subgraph";

const typeDefs = gql`
  # Required for all subgraph schemas
  scalar link__Import

  directive @link(
    url: String!,
    import: [link__Import],
  ) repeatable on SCHEMA

  directive @interfaceObject on OBJECT

  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.4",
      import: ["@key", "@interfaceObject"])

  extend type Query {
    topProducts(first: Int = 5): [Product]
  }

  type Product @key(fields: "upc") {
    upc: String!
    name: String
    price: Int
    weight: Int
    owner: Identity
  }

  type Identity @key(fields: "id") @interfaceObject {
    id: ID!
    likesProduct: Boolean!
  }
`;

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
      resolvers
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
