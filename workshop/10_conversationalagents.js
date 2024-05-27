


/*
import { config } from "dotenv";
config();


import { BufferMemory } from "langchain/memory";
import { Calculator } from "langchain/tools/calculator";
import { DynamicTool } from "@langchain/community/tools/dynamic";

import { RunnableSequence } from "@langchain/core/runnables";
import { AgentExecutor } from "langchain/agents";

import { formatToOpenAIFunctionMessages } from "langchain/agents/format_scratchpad";
import { OpenAIFunctionsAgentOutputParser } from "langchain/agents/openai/output_parser";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

import { ChatOpenAI, formatToOpenAIFunction } from "@langchain/openai";


process.env.LANGCHAIN_HANDLER = "langchain";

function getTodayDateTime() {
  const timeZone = 'America/Chicago';
  const options = {
      timeZone: timeZone,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
  };
  const today = new Date();
  const formattedDate = today.toLocaleString('en-US', options);
  const result = {
      "formattedDate": formattedDate,
      "timezone": timeZone
  };
  return JSON.stringify(result);
}

const dateTool = new DynamicTool({
  name: "todays_date_time",
  description:
    "Useful to get current day, date and time.",
  func: async () => getTodayDateTime(),
});
const tools = [new Calculator(), dateTool];


const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are very powerful assistant"],
  new MessagesPlaceholder("history"),
  ["human", "{input}"],
  new MessagesPlaceholder("agent_scratchpad"),
]);

const model = new ChatOpenAI({
  temperature: 0,
});

const modelWithFunctions = model.bind({
  functions: tools.map((tool) => formatToOpenAIFunction(tool)),
});

const memory = new BufferMemory({
  returnMessages: true,
  inputKey: "input",
  outputKey: "output",
  memoryKey: "history",
});


console.log(await memory.loadMemoryVariables({}));

const runnableAgent = RunnableSequence.from([
  {
    input: (i) => i.input,
    memory: () => memory.loadMemoryVariables({}),
    agent_scratchpad: (i) => formatToOpenAIFunctionMessages(i.steps),
  },
  {
    input: (previousOutput) => previousOutput.input,
    agent_scratchpad: (previousOutput) => previousOutput.agent_scratchpad,
    history: (previousOutput) => previousOutput.memory.history,
  },
  prompt,
  modelWithFunctions,
  new OpenAIFunctionsAgentOutputParser()
]);


const executor = AgentExecutor.fromAgentAndTools({
  agent: runnableAgent,
  tools,
});

const input0 = { input: "Harry Potter's birthday Jan 01, 2000" };

const result0 = await executor.invoke(input0);
console.log(result0);
// Save to History

await memory.saveContext(input0, {
  output: result0.output,
});
console.log(await memory.loadMemoryVariables({}));

const input1 = { input: "What is his age today? show how you calculated it." };

const result1 = await executor.invoke(input1);
console.log(result1);

await memory.saveContext(input1, {
  output: result1.output,
});


const input2 = { input: "Multiply his age raised to the second power then add 5? show your calculation}" };

const result2 = await executor.invoke(input2);
console.log(result2);
*/