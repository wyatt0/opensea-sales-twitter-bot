const axios = require('axios');
const twit = require('twit');
const moment = require('moment');
const _ = require('lodash');
const { spawn } = require('child_process');
const sharp = require('sharp');

const twitterConfig = {
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
};

const twitterClient = new twit(twitterConfig);

// OpenSea doesn't give us access to Webhooks; need to poll every 60 seconds
// Occasionaly in the split second of delay, dupelicates are retrieved - filter them out here
async function handleDupesAndTweet(tokenName, tweetText, imageUrl) {
    // Search our twitter account's recent tweets for anything exactly matching our new tweet's text
    twitterClient.get('search/tweets', { q: tokenName, count: 1, result_type: 'recent' }, (error, data, response) => {
        if (!error) {
            const statuses = _.get(data, 'statuses');

            // No duplicate statuses found
            if (_.isEmpty(data) || _.isEmpty(statuses)) {
                console.log('No duplicate statuses found, continuing to tweet...');

                return tweet(tweetText, imageUrl);
            }

            const mostRecentMatchingTweetCreatedAt = _.get(statuses[0], 'created_at');
            const statusOlderThan10Mins = moment(mostRecentMatchingTweetCreatedAt).isBefore(moment().subtract(10, 'minutes'));

            // Status found is older than 10 minutes, not a cached transaction, just sold at same price
            if (statusOlderThan10Mins) {
                console.log('Previous status is older than 10 minutes, continuing to tweet...');

                return tweet(tweetText, imageUrl);
            }

            console.error('Tweet is a duplicate; possible delayed transaction retrieved from OpenSea');
        } else {
            console.error(err);
        }
    });
}
// Upload image of item retrieved from OpenSea & then tweet that image + provided text
async function tweett(tweetText, imageUrl) {
    const tweet = {
                status: tweetText
    };
    //twitterClient.post('statuses/update', tweet, (error, tweet, response) => {
                //if (!error) {
                //    console.log(`Successfully tweeted: ${tweetText}`);
                //} else {
                //    console.error(error);
                //}
     //});
}
async function _arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa( binary );
}
// Upload image of item retrieved from OpenSea & then tweet that image + provided text
async function tweet(tweetText, imageUrl) { 
    const prcTest = await getBase64('https://upload.wikimedia.org/wikipedia/commons/4/47/VU-Banana-1000x1000.png');
    
    //
    
    
    console.log("SVG URL: " + imageUrl);   
    const processedImage = await getBase64(imageUrl);
    console.log("yo"); 
    let imagee = "";
    await sharp(processedImage)
        .toFormat('png')
        .toBuffer()
        .then(data => { imagee = data })
        .catch(err => { console.log("Sharp error: " + err) });
    console.log(imagee)
    const procb64 = _arrayBufferToBase64(imagee);
                       
    console.log("yoyo")
    //const processedPng = await getBase64(pngimageUrl);
    //console.log("SVG Proccessed: " + processedImage);
    //console.log("PNG Proccessed: " + processedPng);
    // Upload the item's image from OpenSea to Twitter & retrieve a reference to it
    twitterClient.post('media/upload', { media_data: procb64 }, (error, media, response) => {
        if (!error) {
            console.log("noerror");
            const tweet = {
                status: tweetText,
                media_ids: [media.media_id_string]
            };

            //twitterClient.post('statuses/update', tweet, (error, tweet, response) => {
            //    if (!error) {
            //        console.log(`Successfully tweeted: ${tweetText}`);
            //    } else {
            //        console.error(error);
            //    }
            //});
        } else {
            console.error("yo?");
            console.error(error);
        }
    });
}

// Format a provided URL into it's base64 representation
function getBase64(url) {
    console.log("here3");
    return axios.get(url, { responseType: 'arraybuffer'}).then(response => Buffer.from(response.data, 'binary'))
}

module.exports = {
    handleDupesAndTweet: handleDupesAndTweet
};
