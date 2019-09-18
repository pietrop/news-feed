/**
 * async array modified From https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
 */
const Parser = require('rss-parser');
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
let parser = new Parser();

const fetchDataFromFeed = async (rssFeedEndPoint) => {
  return await parser.parseURL(CORS_PROXY + rssFeedEndPoint);
  // return await parser.parseURL(rssFeedEndPoint);
};


async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export default async function getDataFromFeed (RSS_FEEDS) {
  let result = [];
   await asyncForEach(RSS_FEEDS, async (rssFeed) => {
    try {
      let feed = await fetchDataFromFeed(rssFeed.value);
      const newFeedItems = await feed.items.map((item)=>{ item.display = true; item.brand = feed.title; return item;});
      result = result.concat(newFeedItems);
    }
    catch (e){
      console.log(`error for ${rssFeed.value}::`, e)
    }
  });
  // console.log('Done', result);
  return result;
}

// module.exports = getDataFromFeed;

