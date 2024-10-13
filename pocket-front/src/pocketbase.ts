import PocketBase, { SendOptions } from "pocketbase";

export const BASE_URL = "https://pm.hibot.fr";

const pb = new PocketBase(BASE_URL);
pb.beforeSend = (url: string, options: SendOptions) => {
    options.query = {
        ...options.query,
        rndString: Math.random().toString(36).substring(7)
    }
    return {
        url,
        options
    };
};


export default pb;
