import { config } from "dotenv";
config();

import { createOpenAPIChain } from "langchain/chains";

const chain = await createOpenAPIChain(
  "https://gist.githubusercontent.com/rondagdag/88fb4746fec0946ca8d465869c81eb91/raw/e17d2e73fc4d5c79f651b692d83b68a7ef2628c4/potterdb_openapi.yaml"
);
const result = await chain.invoke({ query:`give me the list of books`});

console.log(JSON.parse(result.response));

