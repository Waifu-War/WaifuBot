require('dotenv').config(); // Load .env file
import { Client, Intents } from 'discord.js'; // Import discord.js
import { StartBot } from './onStart/startBot'; // Import the StartBot class

const allIntents: Intents = new Intents([Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]); // Create a new Intents for correct permissions
const client = new Client({intents: allIntents}); // Create a new Bot with the correct permissions
const onStart = new StartBot(client); // Creation de la class StartBot qui contient l'event ready
 
onStart.startBot(); // event on ready

client.login(process.env.TOKEN); // Login the bot with the token