import { ButtonInteraction, Message, TextChannel } from "discord.js";

export class EasyDelete {
    constructor() {
    }

    deleteMessageByInteraction(interaction: ButtonInteraction) {
        interaction.channel.messages.fetch(interaction.message.id).then(message => {
            message.delete();
        });
    }

    deleteMessageByMessage(message: Message) {
        message.delete();
    }

    deleteAmountOfMessages(amount: number, channel: TextChannel) {
        channel.bulkDelete(amount);
    }
}