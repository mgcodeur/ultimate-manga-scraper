import { scrapeMangaChapter } from "./pages/lelscan/mangaChapter.js";
import { scrapeMangaDetail } from "./pages/lelscan/mangaDetail.js";
import { Argument } from "./Console/Argument.js";
import fetch from "node-fetch";
import {env} from "./helpers/dotenv.js";

const args = Argument.fromProcess();

await scrapeMangaDetail(
    args.getParams('slug')
);

const dataToSend = await scrapeMangaChapter(
    args.getParams('slug')
);

const webHookRequest = await fetch(env('LELMANGA_WEBHOOK_URL'), {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataToSend)
});

if(webHookRequest.json()) {
    console.log('Webhook response', webHookRequest.json());
}
