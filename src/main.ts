import { TwitterApi } from 'twitter-api-v2';
import {config} from "dotenv"
config()

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
async function getLikersById(tweetId:string) {
    let likersIds = (await client.v2.tweetLikedBy(tweetId)).data.map(like =>like.id);
    //let likersIds = (await client.v2.tweetLikedBy(tweetId));
    return  likersIds;
}

//console.log(await getLikersById('1433837647189917700'));

// Gets the user's ID and Wallet adress by the tweets ID
//Returns with the Address and the Users's Twitter ID 
async function getUserAndAddressById(tweetId:string):Promise<[string,string]> {
    const  [{ full_text, user: { id_str: userId } }] :any[] = await client.v1.tweets(tweetId);
    return  [/0x[a-zA-Z0-9]{40}/.exec(full_text)![0],userId]
} 

//console.log(await name("1434123996958707717"));

// Gets the useres, who retweeted the tweet specified by the param
// Returns with an array of the reteeres' IDs
async function getRetweetersById(tweetId:string) {
    let retweetersId = (await client.v2.tweetRetweetedBy(tweetId)).data.map(retweet =>retweet.id);
    return retweetersId;
}

//console.log(await getRetweetersById("1436035119610015744"));