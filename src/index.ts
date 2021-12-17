require('dotenv').config(); // Load .env file
import { Client, Intents } from 'discord.js'; // Import discord.js
import { Waifu } from './classes/waifu';
import { StartBot } from './onStart/startBot'; // Import the StartBot class
import { MessageBot } from './messages/message'; // Import the MessageBot class
import { WaifuService } from './services/waifu'; // Import the WaifuService class
import { EasyEmbed } from './services/embedDiscord';
import { EasyButton } from './buttons/buttons';
import { InteractionBot } from './interraction/interraction';

// Discord Init
const allIntents: Intents = new Intents([Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]); // Create a new Intents for correct permissions
const client = new Client({intents: allIntents}); // Create a new Bot with the correct permissions

// Services Init
const waifuService = new WaifuService(); // Create a new WaifuService

// Discord Event Init
const onStart = new StartBot(client); // Creation de la class StartBot qui contient l'event ready
const messageAction = new MessageBot(client, new EasyEmbed, new EasyButton); // Creation de la class MessageBot qui contient l'event message du bot
const interractionAction = new InteractionBot(client, new WaifuService); // Creation de la class InteractionBot qui contient l'event interractionCreate du bot
let allWaifu: Waifu[];

waifuService.getAllWaifus().then(waifus => {
    allWaifu = waifus;
    console.log(allWaifu);
}) // Get all waifus

// Discord Event
onStart.startBot(); // event on ready
messageAction.messageAction(); // event on message
interractionAction.interractionAction(); // event on interractionCreate


client.login(process.env.TOKEN); // Login the bot with the token