import { Client } from "discord.js";

// Class StartBot qui permet de faire des choses au lancement du bot
export class StartBot {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    // function contenant l'event ready du bot
    startBot() {
        this.client.on('ready', () => {
            console.log('Ready!');
        });
    }
}