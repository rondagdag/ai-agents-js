import { config } from "dotenv";
config();

import { Calculator } from "langchain/tools/calculator";
import { DynamicTool } from "@langchain/community/tools/dynamic";

import { RunnableSequence } from "@langchain/core/runnables";

import { formatToOpenAIFunctionMessages } from "langchain/agents/format_scratchpad";
import { OpenAIFunctionsAgentOutputParser } from "langchain/agents/openai/output_parser";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

import { ChatOpenAI, formatToOpenAIFunction } from "@langchain/openai";

import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";

function getTodayDateTime() {
  const timeZone = 'America/Chicago';
  const today = new Date();
  const formattedDate = today.toLocaleString('en-US', {
      timeZone: timeZone,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
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

// Available Tools
const tools = [new Calculator(), dateTool];


const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are very powerful assistant"],
  ["human", "{input}"],
  new MessagesPlaceholder("agent_scratchpad"),
]);

/**
 * Define your chat model to use.
 */
const llm = new ChatOpenAI({
  temperature: 0,
});

/*
const agent = await createOpenAIFunctionsAgent({
  llm,
  tools,
  prompt,
});

const executor = new AgentExecutor({
  agent,
  tools,
});*/

const modelWithFunctions = llm.bind({
  functions: tools.map((tool) => formatToOpenAIFunction(tool)),
});

const runnableAgent = RunnableSequence.from([
  {
    input: (i) => i.input,
    agent_scratchpad: (i) =>
      formatToOpenAIFunctionMessages(i.steps),
  },
  prompt,
  modelWithFunctions,
  new OpenAIFunctionsAgentOutputParser(),
]);

const executor = AgentExecutor.fromAgentAndTools({
  agent: runnableAgent,
  tools,
})


const input = "What is today?";

const promptTemplate = ChatPromptTemplate.fromTemplate(
  "You are very powerful assistant\nQuestion: {input}"
);

const chain = promptTemplate.pipe(llm).pipe(new OpenAIFunctionsAgentOutputParser());
console.log(`Calling simple chain with query: ${input}`);
const res = await chain.invoke({
  input,
});
console.log(res);

console.log(`Calling agent executor with query: ${input}`);

const result = await executor.invoke({
  input,
});

console.log(result);

const input1 = "What is today? When is Harry Potter's birth date? How old is he today? show your calculation";
console.log(`Calling agent executor with query: ${input1}`);

const result1 = await executor.invoke({
  input: input1,
});

console.log(result1);


