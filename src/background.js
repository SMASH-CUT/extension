import { browser } from 'webextension-polyfill-ts';
import * as axios from 'axios';
import { setupCache } from 'axios-cache-adapter';

browser.runtime.onInstalled.addListener(() => {
    console.log('extension installed');
});

console.log('process.env', process.env);

// Create `axios-cache-adapter` instance
const cache = setupCache({
    maxAge: 15 * 60 * 1000
});

const api = axios.create({
    adapter: cache.adapter
});

browser.runtime.connect();

let calledOnce = false;

function sendMessageToTabs(tabs, data) {
    browser.tabs.sendMessage(
        tabs[0].id,
        data
    ).then(() => {
        calledOnce = true;
    }).catch((error) => {
        console.log(`data: ${data}`);
        console.log(`error: ${error}`);
        console.log(`error: ${JSON.stringify(error, null, 4)}`);
    });
}

const getScript = (gotMessage) => {
    if (!gotMessage || typeof gotMessage !== 'string' || gotMessage.length === 0) {
        return;
    }

    browser.tabs.query({
        title: 'Netflix'
    }).then((tabs) => {
        api({
            method: 'get',
            url: process.env.fetch_supported_movies,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
            'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        })
            .then((response) => {
                const additionalParams = tabs[0].url.indexOf('?');
                let nfId;
                if (additionalParams > 0) {
                    nfId = tabs[0].url.slice(tabs[0].url.indexOf('/watch/') + '/watch/'.length, additionalParams);
                } else {
                    nfId = tabs[0].url.slice(tabs[0].url.indexOf('/watch/') + '/watch/'.length);
                }
                if (response.data.movies.Items.length) {
                    const exists = response.data.movies.Items.some((movie) => movie.nf_id === nfId);
                    if (exists) {
                        api({
                            method: 'post',
                            url: process.env.fetch_movie,
                            data: {
                                nfId,
                            },
                            headers: {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                                'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
                                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                            },
                        })
                            .then((response2) => {
                                sendMessageToTabs(tabs, JSON.parse(response2.data.script));
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    } else {
                        console.log("movie doesn't exist");
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }).catch((error) => {
        console.error(`ERROR: ${error}`);
    });
};

browser.tabs.onUpdated.addListener((_, changeInfo, tab) => {
    if (changeInfo.url && changeInfo.url.match(/.*netflix.com\/.*/) && !changeInfo.url.match(/.*netflix.com\/watch\/.*/)) {
        // change to
        browser.tabs.query({
            index: tab.index
        }).then((tabs) => {
            sendMessageToTabs(tabs, []);
        }).catch((error) => {
            console.error(`ERROR: ${error}`);
        });
    } else if (calledOnce && changeInfo.url && changeInfo.url.match(/.*netflix.com\/.*/)) {
        browser.tabs.query({
            index: tab.index
        }).then((tabs) => {
            sendMessageToTabs(tabs, { titleRequest: true });
        }).catch((error) => {
            console.error(`ERROR: ${error}`);
        });
    }
});


browser.runtime.onMessage.addListener(getScript);
