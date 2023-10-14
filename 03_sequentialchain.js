import { config } from "dotenv";
config();

import { SequentialChain, LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

const llm = new OpenAI({ temperature: 0 });

let template =
  "You ordered {book_name} and your experience was {experience}. Write a review: ";
let promptTemplate = new PromptTemplate({
  template,
  inputVariables: ["book_name", "experience"],
});
const reviewChain = new LLMChain({
  llm,
  prompt: promptTemplate,
  outputKey: "review",
});

template = "Given the book review: {review}, write a follow-up comment: ";
promptTemplate = new PromptTemplate({
  template,
  inputVariables: ["review"],
});
const commentChain = new LLMChain({
  llm,
  prompt: promptTemplate,
  outputKey: "comment",
});

template = `Summarise the review in one short sentence: \n\n {review}

Summary: `;

promptTemplate = new PromptTemplate({
  template,
  inputVariables: ["review"],
});
const summaryChain = new LLMChain({
  llm,
  prompt: promptTemplate,
  outputKey: "summary",
});

template = "Translate the summary to Parseltongue: \n\n {summary}";
promptTemplate = new PromptTemplate({
  template,
  inputVariables: ["summary"],
});
const translationChain = new LLMChain({
  llm,
  prompt: promptTemplate,
  outputKey: "Parseltongue_translation",
});

const overallChain = new SequentialChain({
  chains: [reviewChain, commentChain, summaryChain, translationChain],
  inputVariables: ["book_name", "experience"],
  outputVariables: ["review", "comment", "summary", "Parseltongue_translation"],
});

const result = await overallChain.call({
  book_name: "Harry Potter And The Half-Blood Prince",
  experience: "It is the best!",
});
console.log(result);
