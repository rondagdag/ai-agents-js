


/*
import { config } from "dotenv";
config();

import { OpenAI } from "@langchain/openai";
import { SqlDatabase } from "langchain/sql_db";
import { createSqlAgent, SqlToolkit } from "langchain/agents/toolkits/sql";
import { DataSource } from "typeorm";

export const run = async () => {
  const datasource = new DataSource({
    type: "sqlite",
    database: "./sql/potter_movies.db",
  });
  const db = await SqlDatabase.fromDataSourceParams({
    appDataSource: datasource,
  });
  const model = new OpenAI({ temperature: 0 });
  const toolkit = new SqlToolkit(db, model);
  const executor = createSqlAgent(model, toolkit);

  //const input = `List all movies`;

  //const input = `List all movies with corresponding bad guys names`;

  const input = `List all movies and join with list all bad guys using rowid`;

  console.log(`Executing with input "${input}"...`);

  const result = await executor.invoke({ input });

  console.log(
    `Got intermediate steps ${JSON.stringify(
      result.intermediateSteps,
      null,
      2
    )}`
  );

  console.log(`Got output ${JSON.stringify(result.output,null,4)}`);


  await datasource.destroy();
};

run();*/