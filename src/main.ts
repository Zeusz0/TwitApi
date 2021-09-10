import { TwitterApi } from 'twitter-api-v2';
import { config } from 'dotenv';
config();

const apikey = process.env.apikey;
const apiSecKey = process.env.apiSecKey;
const accToken = process.env.accToken;
const accTokenSec = process.env.accTokenSec;

const client = new TwitterApi({
  appKey: apikey,
  appSecret: apiSecKey,
  accessToken: accToken,
  accessSecret: accTokenSec,
});

// Gets the useres, who liked the tweet specified by the param
// Returns with an array of the likers' IDs
async function getLikersById(tweetId: string) {
  const tweetLikers = await client.v2.tweetLikedBy(tweetId);
  return tweetLikers.data?.map((like) => like.id) ?? [];
}

async function getLikersByIds(tweetIds: string[]) {
  return Promise.all(tweetIds.map(getLikersById));
}

// Gets the user's ID and Wallet adress by the tweets ID
//Returns with the Address and the Users's Twitter ID
async function getUserAndAddressById(
  tweetId: string,
): Promise<[string, string]> {
  const [
    {
      full_text,
      user: { id_str: userId },
    },
  ]: any[] = await client.v1.tweets(tweetId);
  return [/0x[a-zA-Z0-9]{40}/.exec(full_text)![0], userId];
}

// Gets the useres, who retweeted the tweet specified by the param
// Returns with an array of the reteeres' IDs
async function getRetweetersById(tweetId: string) {
  const tweetLikers = await client.v2.tweetRetweetedBy(tweetId);
  return tweetLikers.data?.map((like) => like.id) ?? [];
}

async function getRetweetersByIds(tweetIds: string[]) {
  return Promise.all(tweetIds.map(getRetweetersById));
}

async function getUserActivity(userIds: string[], tweetIds: string[]) {
  const tweetData = await Promise.all(
    Array.from(new Set(tweetIds)).map((tweetId) =>
      Promise.all([getRetweetersById(tweetId), getLikersById(tweetId)]).then(
        ([retweets, likes]) => ({ retweets, likes }),
      ),
    ),
  );

  const userIdPairs = Object.fromEntries(userIds.map((id) => [id, 0]));

  tweetData.forEach(({ retweets, likes }) => {
    retweets.concat(likes).forEach((id) => {
      if (id in userIdPairs) {
        userIdPairs[id]++;
      }
    });
  });

  return userIdPairs;
}

console.log(await getRetweetersByIds(['1435209340819021824', '0']));
