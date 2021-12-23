import { ColorResolvable, Guild } from "discord.js";

export class CreateRole {
    constructor() {
    }

    async createRole(guild: Guild, name: string, color: ColorResolvable) {
        await guild.roles.create({name: name, color: color});
    }
}