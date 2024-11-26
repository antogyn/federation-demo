# Apollo Federation Demo

> Stupidly simple example of Apollo Federation v2.

## Installation

```sh
yarn
yarn run dev
```

This command will run two subgraphs and a federation gateway at once, and will listen to any change and restart the relevant subgraph and the gateway. The gateway is available on `http://localhost:4000`.

If you only want to run the subgraphs:

```sh
yarn run dev-subgraph
```

They are available on `http://localhost:4001` and `http://localhost:4002`.
