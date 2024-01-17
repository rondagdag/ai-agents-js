import { config } from "dotenv";
config();

import { OpenAI } from "@langchain/openai";
import { SqlDatabase } from "langchain/sql_db";
import { createSqlAgent, SqlToolkit } from "langchain/agents/toolkits/sql";
import { DataSource } from "typeorm";

/** This example uses Chinook database, which is a sample database available for SQL Server, Oracle, MySQL, etc.
 * To set it up follow the instructions on https://database.guide/2-sample-databases-sqlite/, placing the .db file
 * in the examples folder.
 */
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

  console.log(`Got output ${result.output}`);

  console.log(
    `Got intermediate steps ${JSON.stringify(
      result.intermediateSteps,
      null,
      2
    )}`
  );

//   const input1 = `SELECT a.name, b.name FROM lovers 
//   JOIN characters a 
//   ON lovers.id = a.id 
//   JOIN characters b 
//   ON lovers.id_lover = b.id;`
  // const input1 = `Join characters with lovers by id. lookup lover id in characters. List all characters with their corresponding lover names`;

  // console.log(`Executing with input "${input1}"...`);

  // const result1 = await executor.call({ input:input1 });

  // console.log(`Got output ${result1.output}`);

  //   console.log(
  //   `Got intermediate steps ${JSON.stringify(
  //     result1.intermediateSteps,
  //     null,
  //     2
  //   )}`
  // );

  await datasource.destroy();
};

run();