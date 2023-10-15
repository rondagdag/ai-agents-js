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
      "Harry Potter QA - useful for when you need to ask questions about Harry Potter",
    chain: chain,
    returnDirect: true,
  });

const tools = [new Calculator(), dateTool, qaTool];

const executor = PlanAndExecuteAgentExecutor.fromLLMAndTools({
  llm: model,
  tools
});

const result = await executor.call({
  input: `How many houses in Harry Potter? Multiply the result by today's day.`,
});

console.log(result);