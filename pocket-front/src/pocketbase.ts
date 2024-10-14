import PocketBase from "pocketbase";

export const BASE_URL = "https://pm.hibot.fr";

const pb = new PocketBase(BASE_URL);

export default pb;
