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
  if (data.siteList) {
    blocked = data.siteList;
  }
});

// Listen for changes in the blocked list
browser.storage.onChanged.addListener(changeData => {
    blocked = changeData.siteList.newValue;
});

browser.webRequest.onBeforeRequest.addListener(
  handleRequest,
  {urls: ["<all_urls>"]},
  ["blocking"]
);

function handleRequest(details) {
    // Read the web address of the page to be visited 
    const url = new URL(details.url);
    if (blocked.has(url.hostname)) {
        console.log("BLOCKED");
//        console.log(blocked);
//         return {cancel: true};
        return {redirectUrl: browser.extension.getURL("redirect/redirect.html")};

    }
}
