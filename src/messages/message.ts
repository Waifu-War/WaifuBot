import { channel } from "diagnostics_channel";
import { Client, Message, MessageActionRow, MessageEmbed } from "discord.js";
import { Agent } from "http";
import { EasyButton } from "../buttons/buttons";
import { Waifu } from "../classes/waifu";
import { EasyEmbed } from "../services/embedDiscord";

// Class StartBot qui permet de faire des choses au lancement du bot
export class MessageBot {
    client: Client;

    constructor(client: Client, 
                private embed: EasyEmbed,
                private button: EasyButton) {
        this.client = client;
    }

    // function contenant l'event message du bot
    messageAction() {
        this.client.on('messageCreate', async (message: Message) => {
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
        let waifu: Waifu = new Waifu();
        if (command === "addwaifu") {
            let embed: MessageEmbed;
            if (lines.length === 0) {
                embed = this.embed.createEmbed("Error", null, "You need to follow the pinned exemple", 0xFF0000, null, 'Bot created by Bastien#0147', true);
                return message.channel.send({embeds: [embed]});
            } else {
                lines.forEach(line => {
                    line = line.toLowerCase();
                    if (line.startsWith("nickname")) {
                        waifu.nickname = line.replace("nickname:", "").trim();
                    } else if (line.startsWith("lastname")) {
                        waifu.lastname = line.replace("lastname:", "").trim();;
                    } else if (line.startsWith("firstname")) {
                        waifu.firstname = line.replace("firstname:", "").trim();
                    } else if (line.startsWith("age")) {
                        waifu.age = parseInt(line.replace("age:", "").trim());
                    } else if (line.startsWith("image")) {
                        waifu.img = line.replace("image:", "").trim();
                    } else if (line.startsWith("manga")) {
                        waifu.manga = line.replace("manga:", "").trim();
                    }
                });
                waifu.firstIdea = message.author.tag;
                waifu.creationDate = new Date();
                if (waifu.nickname === undefined || waifu.lastname === undefined || waifu.firstname === undefined || waifu.age === undefined || waifu.img === undefined || waifu.manga === undefined) {
                    embed = this.embed.createEmbed("Error", null, "You need to follow the pinned exemple", 0xFF0000, null, 'Bot created by Bastien#0147', true);
                    return message.channel.send({embeds: [embed]});
                } else {
                    embed = this.embed.createEmbed("Success", null, "The waifu has been sent for verification", 0x006400, null, 'Bot created by Bastien#0147', true);
                    message.channel.send({embeds: [embed]});
                    const waifuVerif =  message.guild.channels.cache.find(channel => channel.name.includes("waifu-verification"));
                    if (waifuVerif.isText()) {
                        embed = this.embed.createEmbed(waifu.nickname, waifu.img, `Firstname: ${waifu.firstname}\nLastname: ${waifu.lastname}\nAge: ${waifu.age}\nManga: ${waifu.manga}`, 0x006400, null, 'Idea proposed by ' + waifu.firstIdea, true);
                        let acceptButton = new MessageActionRow().addComponents(this.button.createButton('Create this waifu', null, 'SUCCESS', 'createWaifu')).addComponents(this.button.createButton('Refuse this waifu', null, 'DANGER', 'refuseWaifu'));
                        waifuVerif.send({embeds: [embed], components:[acceptButton]});
                    }
                    
                }
            }
            
        }
    }

}