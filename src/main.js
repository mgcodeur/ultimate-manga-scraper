import { scrapeMangaChapter } from "./pages/lelscan/mangaChapter.js";
import { scrapeMangaDetail } from "./pages/lelscan/mangaDetail.js";

await scrapeMangaDetail('jujutsu-kaisen');

await scrapeMangaChapter('jujutsu-kaisen');