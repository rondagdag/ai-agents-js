

/*import { config } from "dotenv";
config();


import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { OpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { ConsoleCallbackHandler } from "@langchain/core/tracers/console";


const model = new OpenAI({ 
  temperature: 0,
  // These tags will be attached to all calls made with this LLM.
  tags: ["example", "callbacks", "constructor"],
  // This handler will be used for all calls made with this LLM.
  callbacks: [new ConsoleCallbackHandler()],
});

let reviewPromptTemplate = PromptTemplate.fromTemplate(
  `You ordered {book_name} and your experience was {experience}. Write a review: `
)

const reviewChain = reviewPromptTemplate.pipe(model).pipe(new StringOutputParser());

let commentPromptTemplate = PromptTemplate.fromTemplate(
  `Given the book review: {review}, write a follow-up comment: `
)

const commentChain = RunnableSequence.from([
  {
    review: reviewChain
  },
  commentPromptTemplate,
  model,
  new StringOutputParser(),
]);

const summaryPromptTemplate = PromptTemplate.fromTemplate(
  `Summarise the review in one short sentence: \n\n {review}

  Summary: `
)

const summaryChain = RunnableSequence.from([
  {
    review: commentChain
  },
  summaryPromptTemplate,
  model,
  new StringOutputParser(),
]);

const translationPromptTemplate = PromptTemplate.fromTemplate(
  `Translate the summary to {language}: \n\n {summary}`
)

const translationChain = RunnableSequence.from([
  {
    summary: summaryChain,
    language: (input) => input.language,
  },
  translationPromptTemplate,
  model,
  new StringOutputParser(),
]);

const result = await translationChain.invoke({
  book_name: "Harry Potter And The Half-Blood Prince",
  experience: "It is the best!",
  language: "Greek"});
console.log(result);*/
