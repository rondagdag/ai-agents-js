import { config } from "dotenv";
config();

import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";

const model = new OpenAI({ temperature: 0 });
const template =
  "Be very funny when answering questions\n Question: {question}";
const prompt = new PromptTemplate({ template, inputVariables: ["question"] });

const chain = new LLMChain({ llm: model, prompt });

const result = await chain.call({ question: "Who wrote the 'Harry Potter' series book? What's the real name? Why choose that name?" });
console.log(result);
