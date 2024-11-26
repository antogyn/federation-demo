import { ApolloServer } from "apollo-server";
import { ApolloGateway, IntrospectAndCompose } from "@apollo/gateway";

(async () => {
  await Promise.all([
    waitForSubgraph("http://localhost:4001/graphql"),
    waitForSubgraph("http://localhost:4002/graphql"),
  ]);

  const supergraphSdl = new IntrospectAndCompose({
    // This entire subgraph list is optional when running in managed federation
    // mode, using Apollo Studio as the source of truth.  In production,
    // using a single source of truth to compose a schema is recommended and
    // prevents composition failures at runtime using schema validation using
    // real usage-based metrics.
    subgraphs: [
      { name: "users", url: "http://localhost:4001/graphql" },
      { name: "products", url: "http://localhost:4002/graphql" },
    ],
  });
  
  const gateway = new ApolloGateway({
    supergraphSdl,
    // Experimental: Enabling this enables the query plan view in Playground.
    __exposeQueryPlanExperimental: false,
  });

  const server = new ApolloServer({
    gateway,

    // Apollo Graph Manager (previously known as Apollo Engine)
    // When enabled and an `ENGINE_API_KEY` is set in the environment,
    // provides metrics, schema management and trace reporting.
    engine: false,

    // Subscriptions are unsupported but planned for a future Gateway version.
    subscriptions: false,
  });

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
})();

async function waitForSubgraph(url, interval = 100, attempts = 200) {
  let count = 1
  return new Promise(async (resolve, reject) => {
    while (count < attempts) {
      await new Promise(resolve => setTimeout(resolve, interval))
      try {
        await fetch(url);
        resolve();
      } catch {
        count++
      }
    }
    reject(new Error("Subgraph was down for too long"));
  })
}