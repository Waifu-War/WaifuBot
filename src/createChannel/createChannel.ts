import { CategoryChannel, Guild, Role } from "discord.js";

export class createChannel {

    constructor() {
    }

    async createWaifuCategory(guild: Guild, name: string, manga: string) {
        const role = guild.roles.cache.find(role => role.name === name) as Role
        const roleManga = guild.roles.cache.find(role => role.name === manga) as Role
        await this.createCategory(guild, name, role);
        const category = guild.channels.cache.find(channel => channel.name === name && channel.type === "GUILD_CATEGORY") as CategoryChannel
        this.createChannel(guild, `chat-${name}`, category, false, null);
        this.createChannel(guild, `fanart-${name}`, category, false, null);
        this.createChannel(guild, `nsfw-${name}`, category, true, null);
        if (!guild.channels.cache.find(channel => channel.name === manga.replaceAll(" ", "-").replaceAll("'", ""))) {
            const animeCategory = guild.channels.cache.find(channel => channel.name === 'anime' && channel.type === "GUILD_CATEGORY") as CategoryChannel
            this.createChannel(guild, manga, animeCategory, false, roleManga);
        }
            
    }

    async createCategory(guild: Guild, name: string, role: Role) {
        await guild.channels.create(name, {type: 'GUILD_CATEGORY', permissionOverwrites: [
            {
                type: 'role',
                id: role.id,
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY','ATTACH_FILES', 'ADD_REACTIONS', 'USE_EXTERNAL_EMOJIS', 'CONNECT', 'SPEAK', 'STREAM', 'USE_VAD', 'CHANGE_NICKNAME']
            },
            {
                type: 'role',
                id: guild.roles.everyone.id,
                deny: ['VIEW_CHANNEL']
            }
        ]});
    }

    createChannel(guild: Guild, name: string, category: CategoryChannel, nsfw: boolean, role: Role) {
        if (role) {
            guild.channels.create(name, {type: 'GUILD_TEXT', parent: category, nsfw: nsfw, permissionOverwrites: 
            [
                {
                    type: 'role',
                    id: role.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY','ATTACH_FILES', 'ADD_REACTIONS', 'USE_EXTERNAL_EMOJIS', 'CONNECT', 'SPEAK', 'STREAM', 'USE_VAD', 'CHANGE_NICKNAME']
                },
                {
                    type: 'role',
                    id: guild.roles.everyone.id,
                    deny: ['VIEW_CHANNEL']
                }
            ]});
        } else {
            guild.channels.create(name, {type: 'GUILD_TEXT', parent: category, nsfw: nsfw});
        }
    }
}