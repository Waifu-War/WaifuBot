import { MessageEmbed } from "discord.js";

export class EasyEmbed {
    
        constructor() { }
    
        createEmbed(title: string, image: string, description: string, color: number, fields: any[], footer: string, timestamp: boolean): MessageEmbed {
            const embed = new MessageEmbed();
            if (title) embed.setTitle(title);
            if (description) embed.setDescription(description);
            if (color) embed.setColor(color);
            if (timestamp) embed.setTimestamp();
            if (image) embed.setThumbnail(image)
            if (footer) embed.setFooter(footer);
            if (fields) {
                fields.forEach(field => {
                    embed.addField(field.name, field.value);
                });
            }
            return embed;
        }
    }