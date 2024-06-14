import { config } from "dotenv";
config();

import { TextLoader } from "langchain/document_loaders/fs/text";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";


const loader = new TextLoader("./texts/J. K. Rowling - Harry Potter 1 - Sorcerer's Stone.txt");

// const loader = new TextLoader("./texts/J. K. Rowling - Harry Potter 2 - The Chamber Of Secrets.txt");

const docs = await loader.load();

const splitter = new CharacterTextSplitter({
  chunkSize: 200,
  chunkOverlap: 50,
});

const documents = await splitter.splitDocuments(docs);
console.log(documents);

const embeddings = new OpenAIEmbeddings();

const vectorstore = await FaissStore.fromDocuments(documents, embeddings);
await vectorstore.save("./");
