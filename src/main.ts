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

//let likersIds = (await client.v2.tweetLikedBy('1433837647189917700')).data.map(like =>like.id);
//client.v2.tweetLikedBy('1433837647189917700').then(console.log);
//console.log(likersIds);
async function name(tweetId:string):Promise<[string,string]> {
    const  [{ full_text, user: { id_str: userId } }] :any[] = await client.v1.tweets(tweetId);
    return  [/0x[a-zA-Z0-9]{40}/.exec(full_text)![0],userId]
}

console.log(await name("1434123996958707717"));