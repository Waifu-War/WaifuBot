import { Client, Message, MessageActionRow, MessageEmbed, TextChannel } from "discord.js";
import { EasyButton } from "../services/buttons";
import { Waifu } from "../classes/waifu";
import { EasyEmbed } from "../services/embedDiscord";
import { EasyDelete } from "../services/delete";

// Class StartBot qui permet de faire des choses au lancement du bot
export class MessageBot {
    client: Client;

    constructor(client: Client, 
                private embed: EasyEmbed,
                private button: EasyButton,
                private easyDelete: EasyDelete) {
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
            this.clearChannel(command, message, args);
        });
    }

    clearChannel(command: string, message: Message, args: string[]) {
        if (message.member.permissions.has("MANAGE_MESSAGES")) {
        if (args.length < 1) this.easyDelete.deleteMessageByMessage(message);
        let channel = message.channel as TextChannel;
        let ammount = parseInt(args[0]);
            if (command === "clear") {
                if (ammount > 100) {
                    this.easyDelete.deleteMessageByMessage(message);
                    let embed: MessageEmbed;
                    embed = this.embed.createEmbed("Error", null, "You can't delete more than 100 messages", 0xFF0000, null, 'Bot created by Bastien#0147', true);
                    message.author.send({embeds: [embed]});
                } else {
                    this.easyDelete.deleteAmountOfMessages(ammount, channel);
                    let embed: MessageEmbed;
                    embed = this.embed.createEmbed("Success", null, `${ammount} message(s) have been deleted`, 0x006400, null, 'Bot created by Bastien#0147', true);
                    message.author.send({embeds: [embed]});
                }
            }
        } else {
            this.easyDelete.deleteMessageByMessage(message);
            let embed: MessageEmbed;
            embed = this.embed.createEmbed("Error", null, "You don't have the permission to do that", 0xFF0000, null, 'Bot created by Bastien#0147', true);
            message.author.send({embeds: [embed]});
        }
    }

    // function contenant la fonction de création de waifu
    createWaifu(command: string, lines: string[], message: Message) {
        let waifu: Waifu = new Waifu();
        let channel = message.channel as TextChannel;
        if (command === "addwaifu" && channel.name.toLowerCase().includes("create-waifu")) {
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
            
        } else if (command === "addwaifu") {
            this.easyDelete.deleteMessageByMessage(message);
            let embed: MessageEmbed;
            embed = this.embed.createEmbed("Error", null, "You need to send your waifu in chanel create-waifu", 0xFF0000, null, 'Bot created by Bastien#0147', true);
            message.author.send({embeds: [embed]});
        }
    }

}