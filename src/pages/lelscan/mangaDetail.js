import playwright from 'playwright';
import { removeTrailingSlashTabOrNewLine } from '../../helpers/string.js';
import { config } from '../../../config/scraper.js';
import { downloadFile } from '../../helpers/file.js';
import { getTimestamp } from '../../helpers/date.js';
import { saveInJsonFile } from '../../helpers/file.js';
import { cleanObject } from '../../helpers/object.js';

const scrapeMangaDetail = async (slug) => {
  const browser = await playwright.chromium.launch({
    headless: true
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  page.__proto__.getByXpath = async (text, tagName = 'i') => {
    return await page.evaluate(({text, tagName}) => {
        const el = document.evaluate(
            `//div[contains(text(), "${text}")]`,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
  
        return el ? el.querySelector(tagName).textContent.trim().replace(/\s+/g, ' ') : '';
    }, {text, tagName})
    .catch(() => '');
  }
  
  await page.goto(`${config.lelScan.baseUrl}/manga/${slug}/`, {
    timeout: 1800000
  });
  
  const mangaDetails = {
    title: await page.$eval('h1.entry-title', el => el.textContent, {
      timeout: 1800000
    }),
    alternative: await page.evaluate(() => {
      const el = document.querySelector('.alternative');
      return el ? el.textContent : '';
    }),
    synopsis: removeTrailingSlashTabOrNewLine(
      await page.$eval('.entry-content', el => el.textContent)
    ),
    status: await page.getByXpath('Status'),
    type: await page.getByXpath('Type', 'a'),
    publishedAt: await page.getByXpath('Publié'),
    Author: await page.getByXpath('Auteur'),
    artist: await page.getByXpath('Artiste'),
    Tags: await page.$$eval('[rel="tag"]', els => els.map(el => el.textContent)),
  }
  
  const imageThumb = await page.$eval('.thumb img', el => el.src);
  const downloadPath = `${config.output.catalog}/${slug}/cover.webp`;
  await downloadFile(imageThumb, downloadPath)
  
  mangaDetails.thumb = downloadPath;
  
  await saveInJsonFile(
    cleanObject(mangaDetails), 
    `${config.output.catalog}/${slug}/details.json`
  );

  await browser.close();
  
  return mangaDetails;
};

const getAllChapterLinks = async (slug) => {
  const browser = await playwright.chromium.launch({
    headless: true
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto(`${config.lelScan.baseUrl}/manga/${slug}/`, {
    timeout: 1800000
  });
  
  const chapterLinks = await page.$$eval('[data-num] a', els => els.map(el => el.href).reverse());

  await browser.close();

  return chapterLinks;
}

export { scrapeMangaDetail, getAllChapterLinks };