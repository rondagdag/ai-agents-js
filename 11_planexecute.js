import { config } from "dotenv";
config();

import { Calculator } from "@langchain/community/tools/calculator";
import { DynamicTool } from "@langchain/community/tools/dynamic";
import { AgentExecutor, createReactAgent } from "langchain/agents";
import { pull } from "langchain/hub";

import { ChatOpenAI, OpenAI, formatToOpenAIFunction } from "@langchain/openai";

import { exec } from 'child_process';

//#region Date Tool
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
//#endregion

//#region Say Tool
const saySomething = (text) => {
  console.log(`Saying: ${text}`);
  exec(`say ${text}`, (error) => {
    if (error) {
      console.error(`Error: ${error}`);
    }
  });
  return "I said it.";
};

const sayTool = new DynamicTool({
  name: "harrybot_say",
  description:
    "call this to let the bot to say something, passing the text as input.",
  func: async (text) => saySomething(text),
});
//#endregion

const tools = [new Calculator(), dateTool, sayTool];

// Get the prompt to use - you can modify this!
// If you want to see the prompt in full, you can at:
// https://smith.langchain.com/hub/hwchase17/react
const prompt = await pull("hwchase17/react");

const llm = new OpenAI({
  modelName: "gpt-3.5-turbo-instruct",
  temperature: 0,
//  verbose: true
});

const agent = await createReactAgent({
  llm,
  tools,
  prompt
});

const agentExecutor = new AgentExecutor({
  agent,
  tools
});

const result = await agentExecutor.invoke({
  input: `How many Hogwart houses in Harry Potter? Multiply the result by today's year. Tell the bot to say the answer`,//
});

//await saySomething("Hello, I am the Harry Potter robot. Ask me a question.");

// const result = await executor.call({
//   input: `Tell the bot tool to say "who are you?"`,//
// });

console.log(result);