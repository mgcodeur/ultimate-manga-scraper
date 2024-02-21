import {env} from "../src/helpers/dotenv.js";

export const config = {
  lelScan: {
    baseUrl: env('LELMANGA_BASE_URL', 'https://www.lelmanga.com'),
  },
  output: {
    catalog: 'catalog',
  }
}