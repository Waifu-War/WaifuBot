import { ButtonInteraction, Client, Interaction, MessageEmbed } from "discord.js";
import { Waifu } from "../classes/waifu";
import { WaifuService } from "../services/waifu";

export class InteractionBot {
    client: Client;

    constructor(client: Client, 
                private waifuService: WaifuService) {
        this.client = client;
    }

    interractionAction() {
        this.client.on("interactionCreate", (interaction: Interaction) => {
            if (!interaction.isButton()) return;
            this.acceptWaifu(interaction)
            this.refuseWaifu(interaction)
        });
    }

    acceptWaifu(interaction: ButtonInteraction) {
        if (interaction.customId === "createWaifu") {
            let newWaifu: Waifu = new Waifu();
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
            this.deleteMessage(interaction);
            interaction.channel.send(`${interaction.message.embeds[0].title} created !`);
            this.waifuService.addWaifu(newWaifu);
        }
    }

    refuseWaifu(interaction: ButtonInteraction) {
        if (interaction.customId === "refuseWaifu") {
            this.deleteMessage(interaction);
            interaction.channel.send(`${interaction.message.embeds[0].title} refused !`);
        }
    }

    deleteMessage(interaction: ButtonInteraction) {
        interaction.channel.messages.fetch(interaction.message.id).then(message => {
            message.delete();
        });
    }

}