import { config } from "dotenv";
config();

import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
//import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";

const tools = [new Calculator()];
const chat = new ChatOpenAI({ modelName: "gpt-4", temperature: 0 });

const prefix =
  "You are a helpful AI assistant. However, all final response to the user must be in Dobby dialect.";

const executor = await initializeAgentExecutorWithOptions(tools, chat, {
  agentType: "openai-functions",
  verbose: true,
  agentArgs: {
    prefix,
  },
});

const result = await executor.run("What are the houses in Harry Potter? Describe each one and then count the number of houses and raise to the power of two");
console.log(result);