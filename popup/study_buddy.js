var addPicButton = document.getElementById("plus");
var otherField = document.getElementById("other-site");

var addButton = document.getElementById("add-site");
var studyButton = document.getElementById("study-button");

const socialInputs = document.getElementsByName('social');

const siteMappings = {
    "fb" : "facebook.com",
    "ig" : "instagram.com",
    "rd" : "reddit.com",
    "tw" : "twitter.com",
    "yt" : "youtube.com",
    "az" : "amazon.com"
}

const blockedSitesKey = "StudyBuddyBlockedSites"
const statusKey = "StudyBuddyActive"

// check if the user clicked on the "add" Image button
addPicButton.addEventListener("click",function() {
    if (otherField.classList.contains("show")){
        hide();
    }
    else{
        show();
    }
}) 

addButton.addEventListener("click", function(e){
    e.preventDefault();
    // TODO: validate input url 
    hide();
})

studyButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const storageObject = await browser.storage.local.get(statusKey);
    const isActive = storageObject[statusKey]
    if (isActive === false) {
        browser.storage.local.set({[statusKey]:true});
        studyButton.setAttribute("active", true);
        studyButton.innerText = "Stop!";
    } else {
        browser.storage.local.set({[statusKey]:false});
        studyButton.setAttribute("active", false);
        studyButton.innerText = "Study!";
    }
});

for (elem of socialInputs) {
    elem.addEventListener("click", (e) => {
        const site = siteMappings[e.target.value];
        const checkboxState = e.target.checked;
        if (checkboxState === true) {
            addBlockedSite(site);
        } else {
            removeBlockedSite(site);
        }
    });
}

// hides the "new site" input field
function hide() {
    otherField.classList.remove("show");
    otherField.classList.add("hide");
    addPicButton.src = "../socials/add.png";
}

// shows the "new site" input field
function show() {
    otherField.classList.remove("hide");
    otherField.classList.add("show");
    addPicButton.src = "../socials/minus.png";
}

const addBlockedSite = async (site) => {
    const storageObject = await browser.storage.local.get(blockedSitesKey)
    const currentSites = storageObject[blockedSitesKey]
    currentSites.add(site);
    browser.storage.local.set({[blockedSitesKey]:currentSites});
}

const removeBlockedSite = async (site) => {
    const storageObject = await browser.storage.local.get(blockedSitesKey);
    const currentSites = storageObject[blockedSitesKey]
    currentSites.delete(site);
    browser.storage.local.set({[blockedSitesKey]:currentSites});
}

const init = async () => {
    const storageObject = await browser.storage.local.get([blockedSitesKey, statusKey]);
    if (blockedSitesKey in storageObject) {
        blockedSites = storageObject[blockedSitesKey]
        for (elem of socialInputs) {
            if (blockedSites.has(siteMappings[elem.value])) {
                elem.checked = true;
            }
        }
    } else {
        browser.storage.local.set({[blockedSitesKey]: new Set()});
    }

    if (statusKey in storageObject) {
        
    } else {
        browser.storage.local.set({[statusKey]:false});
    }
}

const blocker = (req) => {
    console.log(req);
    return {cancel: true};
}

browser.webRequest.onBeforeRequest.addListener(
    blocker, 
    {urls:['<all_urls>']}, 
    ['blocking']
);
document.addEventListener('DOMContentLoaded', init);
