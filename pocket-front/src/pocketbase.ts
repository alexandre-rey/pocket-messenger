import PocketBase from "pocketbase";

export const BASE_URL = "https://pocketchat.me";

const pb = new PocketBase(BASE_URL);

export default pb;
