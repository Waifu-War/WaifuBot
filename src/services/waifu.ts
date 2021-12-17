import axios from "axios";
import { Waifu } from "../classes/waifu";

export class WaifuService {
    
    api: string = process.env.APIURL;
    constructor() {}

    async getAllWaifus(): Promise<Waifu[]> {
        const response = await axios.get(process.env.APIURL + "/waifu");
        return response.data as Waifu[];
    }

    async addWaifu(newWaifu: Waifu): Promise<void> {
        const response = await axios.post(process.env.APIURL + "/waifu", newWaifu);
        if (response.data !== "Waifu created") {
            throw new Error("Error while creating waifu");
        }
    }
}