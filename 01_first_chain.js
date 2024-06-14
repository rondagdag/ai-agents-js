/* 
    PromptTemplate + LLM = 🔗
                           ⬇
                           invoke
                           = input variable(s) ⮕ prompt template ⮕ prompt ⮕ model ⮕ result
*/

import { config } from "dotenv";
config();

import { ChatOpenAI } from "@langchain/openai";

import { PromptTemplate } from "@langchain/core/prompts";

import { StringOutputParser } from "@langchain/core/output_parsers";

const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0
});

const joke = await model.invoke(
  "Tell me a Harry Potter joke."
);

const promptTemplate = PromptTemplate.fromTemplate(
  "Be very funny when answering questions\nQuestion: {question}"
);

const outputParser = new StringOutputParser();

const chain = promptTemplate.pipe(model).pipe(outputParser);

const result = await chain.invoke({
  question: "Who wrote the 'Harry Potter' series book? What's the real name? Why choose that name?",
});

console.log(result);

