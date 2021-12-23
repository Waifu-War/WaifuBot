import { ButtonInteraction, Client, Interaction, MessageEmbed } from "discord.js";
import { Waifu } from "../classes/waifu";
import { createChannel } from "../createChannel/createChannel";
import { CreateRole } from "../services/createRoles";
import { WaifuService } from "../services/waifu";
import { EasyDelete } from "../services/delete";

export class InteractionBot {
    client: Client;

    constructor(client: Client, 
                private waifuService: WaifuService,
                private easyDelete: EasyDelete) {
        this.client = client;
    }

    interractionAction() {
        this.client.on("interactionCreate", (interaction: Interaction) => {
            if (!interaction.isButton()) return;
            this.acceptWaifu(interaction)
            this.refuseWaifu(interaction)
        });
    }

    async acceptWaifu(interaction: ButtonInteraction) {
        if (interaction.customId === "createWaifu") {
            const createChannelService = new createChannel()
            let newWaifu: Waifu = new Waifu();
            let createRolesService = new CreateRole();
            let interractionMessage = interaction.message.embeds[0];
            let description = interractionMessage.description.split("\n");
            newWaifu.nickname = interractionMessage.title;
            newWaifu.img = interractionMessage.thumbnail.url;
            newWaifu.firstIdea = interractionMessage.footer.text.replace("Idea proposed by ", "").trim();
            newWaifu.creationDate = new Date(interractionMessage.timestamp);
            description.forEach(line => {
                line = line.toLowerCase();
                if (line.startsWith("lastname")) {
                    newWaifu.lastname = line.replace("lastname:", "").trim();
                } else if (line.startsWith("firstname")) {
                    newWaifu.firstname = line.replace("firstname:", "").trim();
                } else if (line.startsWith("age")) {
                    newWaifu.age = parseInt(line.replace("age:", "").trim());
                } else if (line.startsWith("manga")) {
                    newWaifu.manga = line.replace("manga:", "").trim();
                }
            });
            this.easyDelete.deleteMessageByInteraction(interaction);
            interaction.channel.send(`${interaction.message.embeds[0].title} created !`);
            this.waifuService.addWaifu(newWaifu);
            await createRolesService.createRole(interaction.guild, `${newWaifu.nickname}`, "#000000");
            if (!interaction.guild.roles.cache.find(role => role.name === newWaifu.manga)) {
                await createRolesService.createRole(interaction.guild, `${newWaifu.manga}`, "#000000");
            }
            createChannelService.createWaifuCategory(interaction.guild, `${newWaifu.nickname}`, newWaifu.manga);
        }
    }

    refuseWaifu(interaction: ButtonInteraction) {
        if (interaction.customId === "refuseWaifu") {
            this.easyDelete.deleteMessageByInteraction(interaction);
            interaction.channel.send(`${interaction.message.embeds[0].title} refused !`);
        }
    }
}