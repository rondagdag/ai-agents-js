import { config } from "dotenv";
config();

import { ChatOpenAI } from "langchain/chat_models/openai";
import { SerpAPI } from "langchain/tools";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { Calculator } from "langchain/tools/calculator";

process.env.LANGCHAIN_HANDLER = "langchain";
const model = new ChatOpenAI({ 
  temperature: 0,
//  modelName: "gpt-3.5-turbo",
  verbose: true
});
const tools = [new Calculator()];

const executor = await initializeAgentExecutorWithOptions(tools, model, {
  agentType: "chat-conversational-react-description",
  verbose: true,
});

const input0 = "What is Harry Potters birth date? What is his age today? What is their current age raised to the second power?";

const result0 = await executor.call({ input: input0 });
console.log(result0);

//const input1 = "Multiply his age by 2.";

//const result1 = await executor.call({ input: input1 });
//console.log(result1);
