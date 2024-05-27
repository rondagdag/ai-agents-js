



/*import { config } from "dotenv";
config();

import { BufferMemory } from "langchain/memory";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";

const model = new ChatOpenAI({ temperature: 0 });

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know. The AI has an opinion on everything and is very talkative."],
  new MessagesPlaceholder("history"),
  ["human", "{input}"],
]);

// Default "inputKey", "outputKey", and "memoryKey values would work here
// but we specify them for clarity.
const memory = new BufferMemory({
  returnMessages: true,
  inputKey: "input",
  outputKey: "output",
  memoryKey: "history",
});


console.log(await memory.loadMemoryVariables({}));

//  { history: [] }


const chain = RunnableSequence.from([
  {
    input: (initialInput) => initialInput.input,
    memory: () => memory.loadMemoryVariables({}),
  },
  {
    input: (previousOutput) => previousOutput.input,
    history: (previousOutput) => previousOutput.memory.history,
  },
  prompt,
  model,
  new StringOutputParser(),
]);


const inputs = {
  input: "What are the names of Hogwarts houses?",
};

const response = await chain.invoke(inputs);

console.log("AI Response: " + response);


// Save to History
await memory.saveContext(inputs, {
  output: response,
});
console.log(await memory.loadMemoryVariables({}));

const inputs2 = {
  input: "Which do you identify with based on your qualities, please select one and why?",
};
const response2 = await chain.invoke(inputs2);

console.log("AI Response: " +response2);*/
