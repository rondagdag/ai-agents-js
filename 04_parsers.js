import { config } from "dotenv";
config();

import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";

const parser = new StringOutputParser();

const model = new ChatOpenAI({ temperature: 0 });

const stream = await model.pipe(parser).stream("Who wrote the 'Harry Potter' series book?");

for await (const chunk of stream) {
  console.log(chunk);
}
