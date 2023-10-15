import { config } from "dotenv";
config();

import { ChatOpenAI } from "langchain/chat_models/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { Calculator } from "langchain/tools/calculator";
import { DynamicTool } from "langchain/tools";

process.env.LANGCHAIN_HANDLER = "langchain";
const model = new ChatOpenAI({ 
  temperature: 0,
  modelName: "gpt-3.5-turbo",
  verbose: false
});

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

const executor = await initializeAgentExecutorWithOptions(tools, model, {
  agentType: "zero-shot-react-description",
  verbose: true,
});

const input0 = "When is Harry Potters birthday? What is his age today? Multiply his age raised to the second power then add 5? show your calculations.";

const result0 = await executor.call({ input: input0 });
console.log(result0);
