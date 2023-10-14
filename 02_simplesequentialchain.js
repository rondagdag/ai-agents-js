import { config } from "dotenv";
config();

import { SimpleSequentialChain, LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";


const responseTemplate1 = `
You are an expert on Harry Potter Series. Given the name of a spell, it is your job to explain what the spell does. If it's a spell that is not in the Harry Potter Series, you should say so.

Spell: {spell}
Description: This is a synopsis for above spell:
`;

const responseTemplate2 = `
You are a playwright. Given the Harry Potter spell, it is your job to write a story for that spell. if the synopsis spell that is not in the Harry Potter Series, skip writing a playwright for it, just respond with "This is not a Harry Potter spell."

Spell Description: {synopsis}
Playwright: This is a synopsis for the above Spell:
`;

const reviewPromptTemplate1 = new PromptTemplate({
  template: responseTemplate1,
  inputVariables: ["spell"],
});

const reviewPromptTemplate2 = new PromptTemplate({
  template: responseTemplate2,
  inputVariables: ["synopsis"],
});

const llm = new OpenAI({ temperature: 0 });
const reviewChain1 = new LLMChain({ llm, prompt: reviewPromptTemplate1 });
const reviewChain2 = new LLMChain({ llm, prompt: reviewPromptTemplate2 });

const overallChain = new SimpleSequentialChain({
  chains: [reviewChain1, reviewChain2],
  verbose: true,
});

const result = await overallChain.run( "Alomohora");
//const result = await overallChain.run( "Hello");

console.log(result);
