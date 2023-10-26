import { config } from "dotenv";
config();

import { Calculator } from "langchain/tools/calculator";
//import { SerpAPI } from "langchain/tools";
import { ChainTool } from "langchain/tools";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PlanAndExecuteAgentExecutor } from "langchain/experimental/plan_and_execute";
import { DynamicTool } from "langchain/tools";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { FaissStore } from "langchain/vectorstores/faiss";
import { VectorDBQAChain } from "langchain/chains";
import { exec } from 'child_process';

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
  returnDirect: true,
});

const model = new ChatOpenAI({
    temperature: 0,
    modelName: "gpt-3.5-turbo",
    verbose: true,
  });
/* Create the vectorstore */
const embeddings = new OpenAIEmbeddings();
const vectorStore = await FaissStore.load("./", embeddings);
/* Create the chain */
const chain = VectorDBQAChain.fromLLM(model, vectorStore);

const qaTool = new ChainTool({
    name: "Harry_Potter_Sorcerers_Stone_QA",
    description:
      "Useful for when you need to ask questions about Harry Potter books",
    chain: chain,
    returnDirect: true,
  });

const tools = [new Calculator(), dateTool, qaTool, sayTool];

const executor = PlanAndExecuteAgentExecutor.fromLLMAndTools({
  llm: model,
  tools
});

const result = await executor.call({
  input: `How many Hogwart houses in Harry Potter? Multiply the result by today's year. Tell the bot to say the answer`,//
});

//await saySomething("Hello, I am the Harry Potter robot. Ask me a question.");

// const result = await executor.call({
//   input: `Tell the bot tool to say "who are you?"`,//
// });

console.log(result);