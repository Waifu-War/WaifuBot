import { Client, Message, MessageEmbed } from "discord.js";
import { EasyEmbed } from "../services/embedDiscord";

// Class StartBot qui permet de faire des choses au lancement du bot
export class MessageBot {
    client: Client;

    constructor(client: Client, 
                private embed: EasyEmbed) {
        this.client = client;
    }

    // function contenant l'event message du bot
    messageAction() {
        this.client.on('messageCreate', (message: Message) => {
            if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;
            const args = message.content.slice(process.env.PREFIX.length).split(/[ \n]+/);
            const lines = message.content.slice(process.env.PREFIX.length).split(/[\n]+/);
            lines.shift();
            const command = args.shift().toLowerCase();
            this.createWaifu(command, lines, message);
        });
    }

    // function contenant la fonction de création de waifu
    createWaifu(command: string, lines: string[], message: Message) {
        if (command === "addwaifu") {
            let embed: MessageEmbed;
            console.log(lines.length);
            if (lines.length === 0) {
                embed = this.embed.createEmbed("Error", null, "You need to follow the pinned exemple", 0xFF0000, null, 'Bot created by Bastien#0147', true);
                return message.channel.send({embeds: [embed]});
            } else {
                message.channel.send({embeds: [embed]});
            }
            message.channel.send({embeds: [embed]});
        }
    }

}