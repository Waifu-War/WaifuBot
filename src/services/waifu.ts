import axios from "axios";
import { Waifu } from "../classes/waifu";

export class WaifuService {
    
    api: string = process.env.APIURL;
    constructor() {}

    async getAllWaifus(): Promise<Waifu[]> {
        const response = await axios.get('http://51.178.17.93:3000' + "/waifu");
        return response.data as Waifu[];
    }
}