import { config } from "dotenv";
config();

import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import { StringOutputParser } from "@langchain/core/output_parsers";
import OpenAI from "openai";


const PRIMARY_MODEL = 'gpt-3.5-turbo' //'gpt-4-0314' ' //"text-davinci-002"
const SECONDARY_MODEL = 'gpt-3.5-turbo' //'text-curie-001'

//This is an LLMChain to generate a cocktail and associated instructions.

//Number between -2.0 and 2.0. 
//Positive values penalize new tokens based on their existing frequency in the text so far, 
//decreasing the model's likelihood to repeat the same line verbatim.
const FREQ_PENALTY = 1.02

//Number between -2.0 and 2.0. 
//Positive values penalize new tokens based on whether they appear in the text so far, 
//increasing the model's likelihood to talk about new topics
const PRESENCE_PENALTY = 1.02

let template = `I want someone who can suggest a Harry Potter inspired dish. You are my master chef. You will come up with olfactory pleasant Harry Potter inspired {meal} dish that is appealing and inspired by {cuisine} cuisine. Identify which House they would fit in. Use {ingredient} in your recipe. Make sure it pairs well existing drink recipe of {inspiration}. Apply understanding of flavor compounds and food pairing theories. Give the dish a unique name with Harry Potter inspired title. Ingredients must start in a new line. Add a catch phrase for the meal within double quotes. Always provide a rationale. Also try to provide a scientific explanation for why the ingredients were chosen. {additional_instructions}. Provide evidence and citations for where you took the recipe from.
Meal Name: 
House: 
Rationale:
Ingredients:
Instructions:
Citations:###
`

const parser = new JsonOutputFunctionsParser();

const functionSchema = [
  {
    name: "meal",
    description: "A meal",
    parameters: {
      type: "object",
      properties: {
        mealName: {
          type: "string",
          description: "The meal name",
        },
        house : {
          type: "string",
          description: "Harry Potter House it belongs to",
        },
        rationale: {
          type: "string",
          description: "Rationale of this meal",
        },
        ingredients: {
          type: "string",
          description: "ingredients used to make the meal",
        },
        instructions: {
          type: "string",
          description: "list of Instructions to prepare the meal",
        },
        cuisine: {
          type: "string",
          description: "based from cuisine",
        },
      },
      required: ["mealName", "house", "rationale", "ingredients","instructions","cuisine"],
    },
  },
];

const model = new ChatOpenAI({ modelName:PRIMARY_MODEL, temperature: 1, frequencyPenalty:FREQ_PENALTY, presencePenalty:PRESENCE_PENALTY, maxTokens:600, topP:1});

const prompt4Meal = new PromptTemplate({
  template,
  inputVariables: ["meal", "ingredient", "inspiration", "cuisine", "additional_instructions"],
});

const mealGenChain = prompt4Meal
    .pipe(model.bind({
        functions: functionSchema, 
        function_call: { name: "meal" }
      }))
    .pipe(parser)

//This is an LLMChain to generate a short haiku caption for the cocktail based on the ingredients.

const llm = new ChatOpenAI({ modelName:SECONDARY_MODEL, temperature: 0.7, frequencyPenalty:FREQ_PENALTY, presencePenalty:PRESENCE_PENALTY, maxTokens:200, bestOf:3, topP:0.5 });

let template2 = `###Write a restaurant menu style short description for a {mealName} inspired by with {cuisine} cuisine that has the following ingredients {ingredients}. Limit to 60 words. ###.`

const prompt4Caption = new PromptTemplate({
  template: template2,
  inputVariables: ["mealName", "ingredients", "cuisine"],
});

let captionChain = RunnableSequence.from([
  { mealName : (prevInput) => prevInput.mealName,
    ingredients : (prevInput) => prevInput.ingredients,
    cuisine : (prevInput) => prevInput.cuisine
  },
  prompt4Caption,
  llm,
  new StringOutputParser()
]);


let overallChain = RunnableSequence.from([
  prompt4Meal,
  { mealName : (prevInput) => prevInput.mealName,
    ingredients : (prevInput) => prevInput.ingredients,
    cuisine : (prevInput) => prevInput.cuisine
  },
  prompt4Caption,
  llm,
  new StringOutputParser()
]);

//END LLM portions

let { meal, ingredientInput, inspirationInput, cuisine } = GetRandomInput();
console.log(meal);

const newMeal = await mealGenChain.invoke({'meal': meal, 'ingredient': ingredientInput, 'inspiration': inspirationInput, 'cuisine': cuisine,'meal_name': '', 'additional_instructions':''});

console.log(newMeal);

const caption = await captionChain.invoke(newMeal);
console.log(caption);

const openai = new OpenAI();

let prompt4Diffusion = `${meal} meal: ${newMeal.mealName}. \nCaption: ${caption}\nInspiration: ${cuisine} meal. Magazine cover --ar 4:3 --v 4 --c 100`;
console.log(prompt4Diffusion);

//Here's how you could create an image using OpenAI's API
let image_resp = await openai.images.generate({
  prompt: prompt4Diffusion,
  n: 1,
  size: '512x512'
});

console.log(image_resp.data);



function getRandomChoices(array, k) {
  let result = new Array(k),
    len = array.length,
    taken = new Array(len);
  if (k > len)
    throw new RangeError("getRandomChoices: more elements taken than available");
  while (k--) {
    let x = Math.floor(Math.random() * len);
    result[k] = array[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

function getIngredient(drink, ingredients, ingredientsNonalcoholic, optionalIngredient) {
  let inputText;
  if (drink === 'Non-Alcoholic') {
    inputText = getRandomChoices(ingredientsNonalcoholic, 5).join(', ') + ', ' + optionalIngredient.join(', ');
  } else {
    inputText = getRandomChoices(ingredients, 5).join(', ') + ', ' + optionalIngredient.join(', ');
  }
  return inputText;
}

function getInspiration(drink, inspiration, inspirationNonalcoholic) {
  let inputText;
  if (drink === 'Non-Alcoholic') {
    inputText = getRandomChoices(inspirationNonalcoholic, 1);
  } else {
    inputText = getRandomChoices(inspiration, 1);
  }
  inputText = inputText.join('');
  return inputText;
}

function GetRandomInput() {
  let ingredients = ['Reeses Peanut Butter Cup', 'Hersheys Chocolate Syrup', '42 Below Kiwi Vodka', '42 Below Manuka Honey Vodka', '9th Street Alphabet City Coffee Concentrate', 'A.B. Smeby Verbena Bitters', 'Abbotts Bitters', 'Adam Elmegirabs Bokers Bitters', 'Afel Anise Hyssop Essence', 'Aftel Clove Essence', 'Aftel Tobacco Essence', 'Agave', 'Agave Nectar', 'Agave Syrup', 'Al Wadi Pomegranate Molasses', 'Amaro Ciociaro', 'Amass', 'Amer Picon', 'Anchor Genevieve', 'Angostura Bitters', 'Angostura Orange Bitters', 'Aperol', 'Apple', 'Apple Fan', 'Apple Slice', 'Appleton Estate Reserve Rum', 'Appleton Estate V/X Rum', 'Ardbeg 10-Year-Old Single Malt Scotch Whisky', 'Asparagus Tip', 'Averna Amaro', 'Aviation Gin', 'Bacardi 8 Rum', 'Banana', 'Banks 5 Island Rum', 'Barbancourt 8-Year-Old Rhum', 'Barbancourt Rhum Blanc', 'Barenjager Honey Liqueur', 'Barsol Quebranta Pisco', 'Beaujolais Nouveau', 'Beefeater 24 Gin', 'Beefeater Gin', 'Bek Se Ju 100-year wine', 'Beleza Pura Cachaca', 'Belle de Brillet', 'Belvedere Vodka', 'Benedictine', 'Benromach 12-Year-Old Single Malt Scotch Whisky', 'Bentons Bacon Fat-Infused Four Roses Bourbon', 'Berkshire Mountain Distillers Greylock Gin', 'Birch-Infused Rittenhouse Bonded Rye Whiskey', 'Bittermens Xocolatl Mole Bitters', 'Black Bush Irish Whiskey', 'Black Cardamom Syrup', 'Black Sesame-Infused Krogstad Aquavit', 'BlackTea-Infused Elijah Craig 12-Year-Old Bourbon', 'Blackberries', 'Blackberry', 'Blandys Sercial Madeira', 'Blood Orange Juice', 'Blueberries', 'Blueberry', 'Boiron Passion Fruit Puree', 'Boiron Rhubarb Puree', 'Bols Genever', 'Bonne Maman Apricot Preserves', 'Bonne Maman Orange Marmalade', 'Bonne Maman Raspberry Preserves', 'Bonne Maman Strawberry Preserves', 'Bookers Bourbon', 'Borsci Sambuca', 'Brandied Cherry', 'Brooklyn Black Chocolate Stout', 'Brooklyn Brewery Local 1', 'Bulleit Bourbon', 'Bushmills Irish Whiskey', 'Buttermilk', 'Campari', 'Candied Ginger', 'Canton Ginger Liqueur', 'Caramelized Simple Syrup', 'Carlshamns Flaggpunch', 'Carpano Antica Sweet Vermouth', 'Carpene Malvolti Prosecco', 'Cayenne', 'Celery Salt', 'Celery Stalk', 'Chamomile-Infused Barsol Quebranta Pisco', 'Chamomile-Infused Compass Box Asyla Blended Scotch Whisky', 'Channing Daughters Scuttlehole Chardonnay', 'Cherry', 'Cherry Heering', 'Chilled Brewed Hibiscus Tea', 'Chivas Regal 12-Year-Old Blended Scotch Whiskey', 'Cholula', 'Ciaco Bella Coconut Sorbet', 'Cinnamon Stick', 'Clear Creek Kirschwasser', 'Clear Creek Pear Brandy', 'Clear Creek Plum Brandy', 'Clove', 'Clove Syrup', 'Club Soda', 'Coca-Cola Classic', 'Cocchi Americano', 'Cocktail Umbrellas', 'Cocoa Powder', 'Cointreau', 'Compass Box Asyla Blended Scotch Whisky', 'Compass Box Oak Cross Blended Malt Scotch Whisky', 'Compass Box Peat Monster Blended Malt Scotch Whisky', 'Concord Grape', 'Concord Shrubb', 'Corn Water', 'Cranberry Syrup', 'Creme Yvette', 'Cruzan Black Strap Rum', 'Cucumber Ribbon', 'Cucumber Slice', 'Cucumber Wheel', 'Cynar', 'Dandelion Root-Infused Rittenhouse Bonded Rye Whiskey', 'Deep Mountain Grade B Maple Syrup', 'Dehydrated Citrus', 'Del Maguey Vida Mezcal', 'Demerara Sugar', 'Demerara Sugar Cube', 'Demerara Sugar cube soaked in Angostura Bitters', 'Demerara Syrup', 'Dill Sprig', 'Diluted Aftel Bergamot Essence', 'Diluted Aftel Black Pepper Essence', 'Dolin Blanc Vermouth', 'Dolin Dry Vermouth', 'Dolin Sweet Vermouth', 'Don Julio Anejo Tequila', 'Don Julio Reposado Tequila', 'Dows Ruby Port', 'Dows Tawny Port', 'Dr. Konstantin Frank Dry Riesling', 'Drambuie', 'Dried Lavender Sprig', 'Dried Persimmon Slice', 'Drouhin Pommeau', 'Dubonnet Rouge', 'Dupont Brut Sparkling Cider', 'Edible Flowers', 'Edible Orchid', 'Edouard Absinthe', 'Egg White', 'Egg Yolk', 'El Dorado 15-Year-Old Rum', 'El Tesoro Anejo Tequila', 'El Tesoro Platinum Tequila', 'El Tesoro Reposado Tequila', 'Elijah Craig 12-Year-Old Bourbon', 'Eurovanille Vanilla Syrup', 'Famous Grouse Blended Scotch Whisky', 'Fee Brothers Grapefruit Bitters', 'Fee Brothers Old Fashion Bitters', 'Fee Brothers Peach Bitters', 'Fee Brothers Rhubarb Bitters', 'Fee Brothers Whiskey Barrel Aged Bitters', 'Feldmans Barrel Aged Bitters', 'Fennel Bulb Slice', 'Fernet Branca', 'Fever-Tree Bitter Lemon Soda', 'Fever-Tree Ginger Ale', 'Fitzs Root Beer', 'Flamed Orange Twist', 'Flor de Cana Silver Dry Rum', 'Freshly Brewed Chamomile Tea', 'Freshly Brewed Coffee', 'Freshly Peeled Ginger Slice', 'Freshly Whipped Cream', 'Galliano LAutentico', 'George Dickel No. 12 Tennessee Whisky', 'George T. Stagg Bourbon', 'Glen Thunder Corn Whiskey', 'Glenlivet 12-Year-Old Single Malt Scotch Whisky', 'Godiva Original Liqueur', 'Goji Berry-Infused Four Roses Single Barrel Bourbon', 'Golden Star Sparkling White Jasmine Tea', 'Goslings Black Seal Rum', 'Gran Centenario Blanco Tequila', 'Gran Centenario Reposado Tequila', 'Gran Classico Bitter', 'Gran Duque DAlba Brandy de Jerez', 'Grand Marnier', 'Granny Smith Apple Slice', 'Grapefruit Juice', 'Grapefruit Syrup', 'Grapefruit Twist', 'Green Chartreuse', 'Green Chartreuse V.E.P.', 'Green Pepper Slice', 'Ground Black Pepper', 'Guldens Spicy Brown Mustard', 'Half a Grapefruit Wheel', 'Half an Orange Wheel', 'Hangar One Buddhas Hand Vodka', 'Havana Club 7-Year-Old Rum', 'Haymans Old Tom Gin', 'Heart of the Hudson Apple Vodka', 'Heavy Cream', 'Hendricks Gin', 'Herb Pharm Goldenseal Tincture', 'Hibiscus-Infused Bernheim Wheat Whiskey', 'Hine V.S.O.P. Cognac', 'Honey Nut Cheerios', 'Honey Syrup', 'Honeydew Melon Ball', 'Honeydew Melon Juice', 'Horchata', 'Hot Water', 'House Ginger Beer', 'House Grenadine', 'House Orange Bitters', 'Ice-Cold Filtered Water', 'Illegal Reposado Mezcal', 'Illy Espresso Liqueur', 'J.M. Rhum Blanc', 'Jalapeno Slice no seeds', 'Jalapeno Slice with few seeds', 'Jameson 12-Year-Old Irish Whiskey', 'Jameson Irish Whiskey', 'John D. Taylors Velvet Falernum', 'Jose Cuervo Platino Tequila', 'Jose Cuervo Tradicional Tequila', 'Jujube Tea-infused Vya Sweet Vermouth', 'Kahlua', 'Kamoizumi Nigori Sake', 'Kamoizumi Shusen Sake', 'Karlssons Gold Vodka', 'Kassatly Chtaura Orgeat', 'Kirsch Brandied Cherry', 'Kosher Salt', 'Krogstad Aquavit', 'Kubler Absinthe', 'Kumquat Syrup', 'L & J Blanco Tequila', 'La Diablada Pisco', 'Lairds Applejack', 'Lairds Bonded Apple Brandy', 'Lakewood Cranberry Juice', 'Laphroaig 10-Year-Old Single Malt Scotch', 'Large Straw', 'Lavender', 'Lavender Tincture', 'Lemon', 'Lemon Balm', 'Lemon Hart Overproof Rum', 'Lemon Juice', 'Lemon Peel', 'Lemon Syrup', 'Lemon Twist', 'Lemon Wedge', 'Lemon Wheel', 'Lemon and Lime Zest', 'Lemongrass Syrup', 'Libbys Pumpkin Puree', 'Licor 43', 'Lillet Blanc', 'Lillet Rouge', 'Lime Cordial', 'Lime Disc', 'Lime Juice', 'Lime Twist', 'Lime Wedge', 'Lime Wheel', 'Lime Zest', 'Linie Aquavit', 'Liquiteria Coconut Water', 'Lustau Cream Sherry', 'Lustau East India Sherry', 'Lustau Manzanilla Sherry', 'Lustau Palo Cortado Sherry', 'Lustau Pedro Ximenez Sherry', 'Luxardo Amaretto', 'Luxardo Bitter', 'Luxardo Maraschino Liqueur', 'Lyre American Malt', 'Macchu Pisco', 'Macerated Cranberry', 'Mae de Ouro Cachaca', 'Makers Mark Bourbon', 'Mandarin Napoleon', 'Mape Syrup', 'Maraschino Cherry', 'Maraska Maraschino Liqueur', 'Marie Brizard Creme de Banane', 'Marie Brizard Dark Creme de Cacao', 'Marie Brizard Orange Curacao', 'Marie Brizard White Creme de Cacao', 'Marivani Lavender Essence', 'Marivani Orange Flower Water', 'Marivani Rose Flower Water', 'Martell V.S.O.P. Cognac', 'Martini Bianco Vermouth', 'Martini Sweet Vermouth', 'Martinique Sugar Cane Syrup', 'Masumi Arabashiri Sake', 'Masumi Okuden Junmai Sake', 'Mathilde Pear Liqueur', 'Mathilde Peche', 'Matusalem Gran Reserva Rum', 'Mint Leaf', 'Mint Leaves', 'Mint Sprig', 'Moet Imperial Champagne', 'Monteverdi Nocino', 'Mount Gay Eclipse Amber Rum', 'Mount Gay Eclipse White Rum', 'Mount Gay X.O. Rum', 'Myerss Dark Rum', 'Mymoune Rose Syrup', 'Navan Vanilla Liqueur', 'Neisson Rhum Blanc', 'Neisson Rhum Reserve Speciale', 'Nikka Taketsuru 12-Year-Old Japanese Malt Whisky', 'Noilly Prat Dry Vermouth', 'Nonino Amaro', 'Nonino Gioiello', 'Noval Black Port', 'Oban 14-Year-Old Single Malt Scotch Whisky', 'Ocho Anejo Tequila', 'Old Grand-Dad Bonded Bourbon', 'Old Overholt Rye Whiskey', 'Old Potrero Hotalings Rye Whiskey', 'Orange', 'Orange Juice', 'Orange Peel', 'Orange Slice', 'Orange Twist', 'Orange Wedge', 'Orange Wheel', 'Orange Zest', 'Orange-Cherry Flag', 'Oregano Sprig', 'Oud Beersel Framboise', 'Pama Pomegranate Liqueur', 'Pampero Aniversario Rum', 'Pansy Flower', 'Partida Blanco Tequila', 'Partida Reposado Tequila', 'Paumanok Cabernet Franc', 'Peach', 'Pear', 'Pepsi', 'Perfect Purees of Napa Valley Prickly Pear Puree', 'Pernod', 'Peruvian Amargo Bitters', 'Peychauds Bitters', 'Pickled Ramp Brine', 'Pickled Ramps', 'Pierre Ferrand Ambre Cognac', 'Pimms No. 1 Cup', 'Pinch Grated Cinnamon', 'Pinch Grated Nutmeg', 'Pinch Ground Chili', 'Pinch Kosher Salt', 'Pinch Sea Salt', 'Pineapple', 'Pineapple Juice', 'Pineapple Leaf', 'Pineapple Slice', 'Pink Rose Petal', 'Pitted Cherry', 'Plymouth Gin', 'Plymouth Sloe Gin', 'Popcorn-Infused Flor de Cana Silver Dry Rum', 'Punt e Mes', 'Q Tonic', 'Quince Shrubb (Huilerie Beaujolaise Vinaigre de Coing)', 'Raisins', 'Ransom Old Tom Gin', 'Raspberries', 'Red Bell Pepper Slice', 'Red Jacket Orchards Apple Butter', 'Red Jacket Orchards Apple Cider', 'Regans Orange Bitters', 'Remy Martin V.S.O.P. Cognac', 'Rhum Clement Creole Shrubb', 'Rhum Clement V.S.O.P.', 'Ricard Pastis', 'Rittenhouse Bonded Rye Whiskey', 'Ritual Gin', 'Ritual Tequila', 'Rock Candy Swizzle', 'Ron Zacapa 23 Centenario Rum', 'Ron Zacapa Centenario 23 Rum', 'Rose-Infused Plymouth Gin', 'Rosemary', 'Rosemary Sprig', 'Rothman & Winter Creme de Violette', 'Rothman & Winter Orchard Apricot', 'Rothman & Winter Orchard Pear', 'Ruby Red Grapefruit Juice', 'Sagatiba Cachaca', 'Sage', 'Sage Leaf', 'Salt', 'San Pellegrino Limonata', 'Sazerac 6-Year-Old Rye Whiskey', 'Schonauer Apfel Schnapps', 'Seedlip', 'Sencha Green Tea-Infused Leblon Cachaca', 'Shinn Estate Rose', 'Shiso Leaves', 'Siembra Azul Blanco Tequila', 'Siembra Azul Reposado Tequila', 'Siete Leguas Blanco Tequila', 'Siete Leguas Reposado Tequila', 'Simple Syrup', 'Small Hand Foods Grapefruit Cordial', 'Smirnoff Black Vodka', 'Smith & Cross Jamaican Rum', 'Sombra Mezcal', 'Southampton Double White Ale', 'Southampton Pumpkin Ale', 'Spiced Macchu Pisco', 'Spiced Sorrel', 'Ssal-Yut Rice Syrup', 'St. Dalfour Fig Jam', 'St. Elizabeth Allspice Dram', 'St. George Absinthe', 'St. Germain Elderflower Liqueur', 'Star Anise Pod', 'Strawberries', 'Strawberry Fan', 'Strawberry Slice', 'Strawberry-Infused Mae de Ouro Cachaca', 'Strega', 'Sugar', 'Sugar Cube', 'Suze', 'Sweetened Whipped Cream', 'Talisker 10-Year-Old Single Malt Scotch Whisky', 'Tamarind Puree', 'Tangerine Zest', 'Tanqueray Gin', 'The Bitter Truth Celery Bitters', 'The Bitter Truth Grapefruit Bitters', 'The Bitter Truth Jerry Thomas Bitters', 'The Bitter Truth Lemon Bitters', 'Theurlet Creme de Cassis', 'Thyme', 'Ting Grapefruit Soda', 'Tokaji Aszu 5 Puttonyos Red Label', 'Tonic Syrup', 'Tonic Water', 'Toro Albala Pedro Ximenez Sherry', 'Trader Tikis Dons Mix', 'Trimbach Framboise', 'Umbrella', 'Vanilla Butter', 'Victory Pilsner', 'Vieux Pontarlier Absinthe', 'Vya Dry Vermouth', 'Vya Sweet Vermouth', 'Walnut-Infused Hine V.S.O.P. Cognac', 'Watermelon Ball', 'Watermelon Juice', 'Whiskey-soaked Goji Berry', 'Whole Black Peppercorn', 'Whole Egg', 'Whole Milk', 'Wild Turkey Russells Reserve 6-Year-Old Rye Whiskey', 'Wild Turkey Rye Whiskey', 'Wilfreds Aperitif', 'Wray & Nephew Overproof Rum', 'Yamazaki 12-Year-Old Japanese Single Malt Whisky', 'Yellow Chartreuse', 'Yogurt', 'Zwack', 'van Oosten Batavia Arrack', 'Mango', 'Maharani Mahansar', 'Four Roses Bourbon', 'Single Malt by Amrut', 'Apologue Liqueur Saffron', 'Jagermeister', 'Rampur Indian Single Malt Whisky', 'Tanqueray Rangpur', 'Palm Wine'];

  ingredients = ingredients.sort();

  let ingredients_nonalcoholic = ['Agave', 'Amass', 'Apple', 'Banana', 'Blackberries', 'Blueberries', 'Buttermilk', 'Club Soda', 'Cocktail Umbrellas', 'Coke', 'Dehydrated Citrus', 'Edible Flowers', 'Grapefruit Juice', 'Honey Syrup', 'Lassi', 'Lavender', 'Lemon', 'Lemon Balm', 'Lemon Juice', 'Lemon and Lime Zest', 'Lime Juice', 'Lyre American Malt', 'Mango Lassi', 'Mape Syrup', 'Maraschino Cherry', 'Mint Leaves', 'Orange', 'Orange Juice', 'Peach', 'Pear', 'Pepsi', 'Pineapple', 'Pineapple Juice', 'Raspberries', 'Ritual Gin', 'Ritual Tequila', 'Rosemary', 'Sage', 'Salt Lassi', 'Seedlip', 'Strawberries', 'Thyme', 'Tonic Water', 'Wilfreds Aperitif', 'Yogurt'];
  ingredients_nonalcoholic = ingredients_nonalcoholic.sort();

  let inspiration = ['#3 Cup', '#8', '100 Year Punch', '20th Century', '212', '21st Century', 'Absinthe Drip', 'Against All Odds Cocktail', 'Aguila Azteca', 'Airmail', 'Albert Mathieu', 'Algonquin', 'Americano Highball', 'Aperol Spritz', 'Apple Daiquiri', 'Apple Malt Toddy', 'Applejack Rabbit', 'Apricot Flip', 'Archangel', 'Astoria Bianco', 'Aviation', 'Beachbum', 'Bees Knees', 'Bees Sip', 'Beer Cassis', 'Beer and a Smoke', 'Bentons Old-Fashioned', 'Berlioni', 'Betsy Ross', 'Betula', 'Bijou', 'Bizet', 'Black Flip', 'Black Jack', 'Black Thorn (Irish)', 'Blackbeard', 'Blackstar', 'Blackthorn (English)', 'Blackthorn Rose', 'Blinker', 'Blood and Sand', 'Bobby Burns', 'Brandy Crusta', 'Brazilian Tea Punch', 'Brewers Breakfast', 'Bronx', 'Brooklyn', 'Brown Bomber', 'Brown Derby', 'Bubbaloo', 'Buona Notte', 'Caipirinha', 'Camerons Kick', 'Caprice', 'Cavalier', 'Champagne Cocktail', 'Champs-Elysees', 'Cherry Pop', 'Chien Chaud', 'Chrysanthemum', 'Cinema Highball', 'Cloister', 'Clover Club', 'Coconut Colada', 'Coda', 'Coke', 'Coffee Cocktail', 'Condiment Cocktail', 'Conquistador', 'Corpse Reviver No. 2', 'Cosmopolitan', 'Cranberry Cobbler', 'Crimson Tide', 'Cuzco', 'Daiquiri', 'De La Louisiane', 'Death Bed', 'Desert Rose', 'Deshler', 'Dewey D.', 'Diamondback', 'Donizetti', 'Dry County Cocktail', 'Duboudreau Cocktail', 'Dulce de Leche', 'East India Cocktail', 'East Village Athletic Club Cocktail', 'Eclipse Cocktail', 'Edgewood', 'El Burro', 'El Diablo', 'El Molino', 'El Puente', 'Ephemeral', 'Espresso Bongo', 'Falling Leaves', 'Field Cocktail', 'Figetaboutit', 'Fish House Punch', 'Flora Astoria', 'Flying Dutchman', 'Fog Cutter', 'Foreign Legion', 'Framboise Fizz', 'Frankfort Rose', 'French 75', 'French Maid', 'Fresa Verde', 'Frisco', 'Gilchrist', 'Gimlet', 'Gin & Tonic', 'Girl from Jerez', 'Gold Coast', 'Gold Rush', 'Golden Star Fizz', 'Great Pumpkin', 'Green Deacon', 'Green Harvest', 'Greenpoint', 'Hanky Panky', 'Harvest Moon', 'Harvest Sling', 'Heirloom', 'Hemingway Daiquiri', 'Henry Hudson', 'Honeymoon Cocktail', 'Hot Buttered Pisco', 'Hotel D Alsace', 'Hotel Nacional Special', 'Imperial Blueberry Fizz', 'Imperial Silver Corn Fizz', 'Improved Whiskey Cocktail', 'Jack Rose', 'Japanese Cocktail', 'Japanese Courage', 'Jimmie Roosevelt', 'Johnny Apple Collins', 'Judgment Day', 'Junior', 'Kansai Kick', 'Kin Kan', 'Kina Miele', 'King Bee', 'Koyo', 'L.E.S. Globetrotter', 'La Florida Cocktail', 'La Louche', 'La Perla', 'Lacrimosa', 'Lake George', 'Last Word', 'Lawn Dart', 'Le Pere Bis', 'Leapfrog', 'Left Coast', 'Left Hand Cocktail', 'Lions Tooth', 'Little Bit Country', 'Luau', 'Mae West Royal Diamond Fizz', 'Mai-Tai', 'Manhattan', 'Margarita', 'Mariner', 'Martinez', 'Martini', 'Mary Pickford', 'Masataka Swizzle', 'Master Cleanse', 'May Daisy', 'May Day', 'Melon Stand', 'Mexicano', 'Mezcal Mule', 'Midnight Express', 'Milk Punch', 'Mint Apple Crisp', 'Mint Julep', 'Mojito', 'Monkey Gland', 'Montgomery Smith', 'Morango Fizz', 'Moscow Mule', 'Mount Vernon', 'Mums Apple Pie', 'Navy Grog', 'Negroni', 'New Amsterdam', 'New York Flip', 'Newark', 'Newfangled', 'Nigori Milk Punch', 'Noce Royale', 'Norman Inversion', 'Nouveau Carre', 'Nouveau Sangaree', 'Noval Cup', 'Nth Degree', 'Occidental', 'Old Flame', 'Old Maid', 'Old Pal', 'Old-Fashioned Whiskey Cocktail', 'Opera Cocktail', 'Paddington', 'Paddy Wallbanger', 'Paloma', 'Parkside Fizz', 'Pauls Club Cocktail', 'Pearl Button', 'Pearl of Puebla', 'Perfect Pear', 'Persephone', 'Pharaoh Cooler', 'Pimms Cup', 'Pink Lady', 'Pisco Sour', 'Platanos en Mole Old Fashioned', 'Primavera', 'Prince Edward', 'Prince of Wales', 'Professor', 'Pumpkin Toddy', 'Queen Park Swizzle', 'Rack & Rye', 'Ramos Gin Fizz', 'Rapscallion', 'Raspberries Reaching', 'Rattlesnake', 'Red Devil', 'Red-headed Saint', 'Remember Maine', 'Remember the Maine', 'Resting Point', 'Reverend Palmer', 'Rhubarbarita', 'Rhum Club', 'Rio Bravo', 'Rite of Spring', 'Rob Roy', 'Romeo Y Julieta', 'Rose', 'Rosita', 'Royal Bermuda Yachtclub Cocktail', 'Rust Belt', 'Rusty Nail', 'Rye Witch', 'Sage Old Buck', 'Sazerac', 'Seelbach Cocktail', 'Shaddock Rose', 'Shiso Delicious', 'Shiso Malt Sour', 'Sidecar', 'Siesta', 'Silk Road', 'Silver Lining', 'Silver Root Beer Fizz', 'Silver Sangaree', 'Singapore Sling', 'Single Malt Sangaree', 'Sloe Gin Fizz', 'Smoky Grove', 'Solstice', 'South Slope', 'Southside', 'Spice Market', 'St. Rita', 'Staggerac', 'Statesman', 'Swiss Mist', 'Swollen Gland', 'T&T', 'Talbott Leaf', 'Tao of Pooh', 'There Will Be Blood', 'Ti-Punch', 'Tipperary Cocktail', 'Tom Collins', 'Tommys Margarita', 'Triborough', 'Trident', 'Tuxedo', 'Up to Date', 'Vaccari', 'Vauvert Slim', 'Velvet Club', 'Vesper', 'Vieux Carre', 'Vieux Mot', 'Ward Eight', 'Water Lily', 'Weeski', 'Wellington Fizz', 'Whiskey Smash', 'White Birch Fizz', 'White Lady', 'White Negroni', 'Widows Kiss', 'Witchs Kiss', 'Woolworth', 'Wrong Aisle', 'Zombie Punch'];

  let inspiration_nonalcoholic = ['Club Soda & Lime', 'Coconut Water', 'Faux Tropical Fizz', 'Frozen Blackberry Smoothie', 'Ginger Beer', 'Gunner', 'Iced Tea', 'Kombucha', 'Lassi', 'Lemon, Lime & Bitters', 'Lemonade', 'Mango Lassi', 'Nojito', 'Pineapple & Ginger Punch', 'Sidecar Mocktail', 'Summer Cup Mocktail', 'Tortuga', 'Piña Colada', 'Strawberry Milkshake', 'Chill-Out Honeydew Cucumber Slushy', 'Salted Watermelon Juice', 'Chile-Lime-Pineapple Soda', 'Strawberry-Ginger Lemonade', 'Huckleberry Shrub', 'Chai Blossom', 'Maple-Ginger Cider Switchel', 'Turmeric Tonic', 'Homemade Hawaiian Ginger Ale', 'Spicy Citrus Refresher', 'Better Than Celery Juice', 'Beet-Sumac Soda', 'Raspberry-Almond Soda', 'Salted Meyer Lemon and Sage Pressé', 'Lemon-Ginger Brew'];

  let cuisine_list = ['All Occasions', 'Chinese', 'Greek', 'Indian', 'Italian', 'Japanese', 'American', 'Mexican', 'Thai', 'Mediterranean','Filipino','Tex-Mex','Turkish','French'];
  cuisine_list = cuisine_list.sort();

  //const NON_ALCOHOLIC_FLAG = true;
  let drinkOptions = ['Cocktail', 'Shot', 'Punch', 'Non-Alcoholic'];
  let mealOptions = ['Breakfast', 'Lunch', 'Dinner', 'Late-Night'];


  let optionalIngredient = [];
  let meal = getRandomChoices(mealOptions, 1).toString();
  let drink = getRandomChoices(drinkOptions, 1).toString();

  let mainDish = getRandomChoices(cuisine_list, 1).toString();
  let ingredientInput = getIngredient(drink, ingredients, ingredients_nonalcoholic, optionalIngredient);
  let inspirationInput = getInspiration(drink, inspiration, inspiration_nonalcoholic);
  let cuisine = getRandomChoices(cuisine_list, 1).toString();
  return { meal, ingredientInput, inspirationInput, cuisine, mainDish };
}

