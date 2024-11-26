import { ApolloServer, gql } from "apollo-server";
import { buildSubgraphSchema } from "@apollo/subgraph";

const typeDefs = gql`
  scalar link__Import

  directive @link(
    url: String!,
    import: [link__Import],
  ) repeatable on SCHEMA

  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.4",
      import: ["@key"])

  interface Identity @key(fields: "id") {
    id: ID!
    name: String
    username: String
  }

  extend type Query {
    me: Identity
  }

  type User implements Identity @key(fields: "id")  {
    id: ID!
    name: String
    username: String
  }
`;

const resolvers = {
  Query: {
    me() {
      return users[0];
    }
  },
  User: {
    __resolveReference(object) {
      return users.find(user => user.id === object.id);
    }
  },
  Identity: {
    __resolveReference(object) {
      return users.find(user => user.id === object.id);
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

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const users = [
  {
    __typename: "User",
    id: "1",
    name: "Ada Lovelace",
    birthDate: "1815-12-10",
    username: "@ada"
  },
  {
    __typename: "User",
    id: "2",
    name: "Alan Turing",
    birthDate: "1912-06-23",
    username: "@complete"
  }
];
