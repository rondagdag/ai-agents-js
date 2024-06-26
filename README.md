
# Prompt Engineer and the AI Agents in Javascript

Prompts in a language model are like magic spells. You tell the model what you want to talk about or ask, and it generates a magical response based on the input. AI agents are like the wizard who consults their spell book to cast a series of spells. AI Agents use a large language model (LLM) as a reasoning engine to determine which actions to take and in which order. Attend this session to learn how to craft AI Agents in JavaScript using LangChain and other prompt engineering techniques. Alohomora!

## Demo: 
In this example you find a node app that can be used to learn LangChain in Javascript. This repository contains a series of sample scripts showcasing the usage of Langchain, a JavaScript library for creating conversational AI applications.

- `00_basics.js`: Introduction to basics of using OpenAI API without Langchain.
- `01_first_chain.js`: How to create your first conversation chain in Langchain.
- `02_simplesequentialchain.js`: A simple example of creating a sequential conversation chain.
- `03_sequentialchain.js`: Detailed walkthrough of creating and utilizing a sequential conversation chain in Langchain.
- `04_parsers.js`: How to use parsers to process input and output in a conversation chain.
- `05_indexes.js`: How to create and use indexes in Langchain for efficient retrieval of information.
- `06_usestore.js`: How to utilize the Vector Databases in Langchain for maintaining and retrieving information which was not trained into the model.
- `07_chathistory.js`: How to create a chat bot in Langchain, forming the basis of a conversational AI application.
- `09_openapichain.js`: How to use simple open api.
- `09_openaifunc.js`: How to create an agent in Langchain the uses OpenAI Functions.
- `10_conversationalagents.js`: How to create an agent in Langchain that designed to be used for conversational settings.
- `11_planexecute.js`: Plan and execute agents accomplish an objective by first planning what to do, then executing the sub tasks. This idea is largely inspired by BabyAGI and then the "Plan-and-Solve" paper.
- `12_sqltoolkit.js`: This example shows how to load and use an agent with a SQL toolkit.
- `13_sequentialchaincocktail.js`: This example shows how to generate unique meals.
- `14_moderation.js`: This example shows how to add moderation/filter before sending to LLM.

To run these examples, clone the git repository and run npm install to install the dependencies. You need to create a .env file and add your API Key for OpenAI like this: OPENAI_API_KEY=sk-...

This codes utilizes ES6 modules, to allow import statements and async/await within NodeJS.
  
Click my binder link to test it out! 
[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/rondagdag/ai-agents-js/HEAD)

### Presentation resources
- [Slidedeck](./ai-agents-js.pdf)

### Resources

- [JS/TS Langchain](https://js.langchain.com/)

- [Deep Learning Short Course - Build LLM apps with Langchan JS](https://www.deeplearning.ai/short-courses/build-llm-apps-with-langchain-js/)

- [Flowise](https://flowiseai.com/)

- [Learn Prompting](https://learnprompting.org/)

- [Inspired by LangChain JS Crash Course](https://github.com/Coding-Crashkurse/LangChain-JS-Full-Course#readme)

- [Harry Potter Manuscript](https://github.com/amephraim/nlp/blob/master/texts/)
```
curl "https://raw.githubusercontent.com/amephraim/nlp/master/texts/J.%20K.%20Rowling%20-%20Harry%20Potter%201%20-%20Sorcerer's%20Stone.txt" > "texts/J. K. Rowling - Harry Potter 1 - Sorcerer's Stone.txt"
```

- [OpenAI Cocktail Recipes Generator](https://github.com/swamichandra/cocktails)

### Speakers
- [Ron Dagdag](https://www.dagdag.net)






Original source:

