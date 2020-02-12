const blockedSitesKey = "StudyBuddyBlockedSites"
const statusKey = "StudyBuddyActive"

// Initialize the list of blocked sites
let blocked = new Set();

// Set the default list on installation.
browser.runtime.onInstalled.addListener(details => {
  browser.storage.local.set({
    siteList: blocked
  });
});

// Get the stored list
browser.storage.local.get(data => {
  if (data[blockedSitesKey]) {
    blocked = data[blockedSitesKey];
  }
});

// Listen for changes in the blocked list
browser.storage.onChanged.addListener(changeData => {
    blocked = changeData[blockedSitesKey];
});

const handleRequest = async (details) => {
    // Read the web address of the page to be visited 
    const storageObject = await browser.storage.local.get(blockedSitesKey);
    const blockedSites = storageObject[blockedSitesKey]
    const url = new URL(details.url);
    if (blockedSites.has(url.hostname)) {
        console.log("BLOCKED");
//        console.log(blocked);
        return {
            redirectUrl: browser.extension.getURL('/redirect/redirect.html')
        }
    }
}

const init = async () => {
    const storageObject = await browser.storage.local.get([blockedSitesKey, statusKey]);
    if (!(blockedSitesKey in storageObject)) {
        browser.storage.local.set({[blockedSitesKey]: new Set()});
        browser.storage.local.set({[statusKey]:false});
    }
}

browser.webRequest.onBeforeRequest.addListener(
  handleRequest,
  {urls: ["<all_urls>"]},
  ["blocking"]
);

init();
