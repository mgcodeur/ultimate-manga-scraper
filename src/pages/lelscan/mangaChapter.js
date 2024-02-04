import playwright from 'playwright';
import { getAllChapterLinks } from './mangaDetail.js';
import { readJsonFile, saveInJsonFile } from '../../helpers/file.js';
import { config } from '../../../config/scraper.js';

const scrapeMangaChapter = async (slug, chapter) => {
  const chapterLinks = await getAllChapterLinks(slug);

  const browser = await playwright.chromium.launch({
    headless: false
  });

  const context = await browser.newContext();

  const page = await context.newPage();

  for(const link of chapterLinks) {
    await page.goto(link, {
      timeout: 180000
    });

    const chapterName = (await page.$eval('select#chapter option[selected]', el => el.textContent, {
      timeout: 180000
    }))
    .normalize('NFD').trim()

    const images = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img.ts-main-image'));

      return imgs.map((img) => {
        if(!img.getAttribute('data-src')) {
          return img.src;
        }
        return img.getAttribute('data-src');
      });
    }, {timeout: 180000});

    const data = readJsonFile(`${config.output.catalog}/${slug}/details.json`);
    data.chapters = data.chapters || [];
    data.chapters.push({
      name: chapterName,
      images: images
    });

    await saveInJsonFile(data, `${config.output.catalog}/${slug}/details.json`);

    console.log('Chapter', chapterName, 'done');
  }

  await browser.close();

  return true;
};

export { scrapeMangaChapter };