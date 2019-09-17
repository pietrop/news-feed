const getDataFromFeed = require('./index.js');
const RSS_FEEDS = require('./RSS_FEEDS.js');

const res = Promise.resolve(getDataFromFeed(RSS_FEEDS));

res.then(function(data) {
  // not called
  console.log(data)
//   fs.writeFileSync('./sample/data.json', JSON.stringify(data,null,2))
}, function(e) {
  console.error(e); // TypeError: Throwing
});