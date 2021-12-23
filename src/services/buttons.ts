import { MessageButton, MessageButtonStyle, MessageButtonStyleResolvable } from "discord.js";

export class EasyButton {

    constructor() { }

    createButton(content: string, url: string, style: MessageButtonStyle, id: string): MessageButton {
        const button = new MessageButton();
        if (content) button.setLabel(content)
        if (url) button.setURL(url)
        if (style) button.setStyle(style);
        if (id) button.setCustomId(id);
        return button;
    }
}