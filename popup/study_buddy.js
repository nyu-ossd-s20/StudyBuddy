
var addPicButton = document.getElementById("plus");
var otherField = document.getElementById("other-site");

var addButton = document.getElementById("add-site");
var studyButton = document.getElementById("study-button");
var otherInputField = document.getElementById("other");

const socialInputs = document.getElementsByName('social');
var blockedList = new Set();

const siteMappings = {
  "fb" : "www.facebook.com",
  "ig" : "www.instagram.com",
  "rd" : "www.reddit.com",
  "tw" : "www.twitter.com",
  "yt" : "www.youtube.com",
  "az" : "www.amazon.com"
}

const blockedSitesKey = "StudyBuddyBlockedSites";
const statusKey = "StudyBuddyActive";

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

    // validate input url
    var newUrl =  otherInputField.value;

    if(isUrlValid(newUrl)) {
        // make a list of new sites
        var newSiteList = document.getElementById("new-sites");
        var site = document.createElement('li');
        var text = document.createTextNode(newUrl);
        site.appendChild(text);
        newSiteList.appendChild(site);
        document.getElementById("new-sites").classList.remove("hide");
        document.getElementById("new-sites").classList.add("show");
        hide();
        // add to set
        addBlockedSite(newUrl);

    } else { otherInputField.style.borderColor = "red"; }
})

// study/stop portion
studyButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const storageObject = await browser.storage.local.get(statusKey);
  const isActive = storageObject[statusKey];
  if (isActive === false) {
    browser.storage.local.set({[statusKey]:true});
    studyButton.setAttribute("active", true);

      getSites();
      storeBlocked();
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
      if (checkboxState) {
          addBlockedSite(site);
      }
      else {
          removeBlockedSite(site);
      }
  });
}

// hides the "new site" input field
function hide() {
  otherField.classList.remove("show");
  otherField.classList.add("hide");
  addPicButton.src = "../socials/add.png";
  otherInputField.value = "";
  otherInputField.style.borderColor = "#aea397";
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

  if (storageObject[statusKey]) {
      studyButton.setAttribute("active", true);
      studyButton.innerText = "Stop!";
  } else {
      browser.storage.local.set({[statusKey]:false});
  }
}

const getSites = async () => {
    var siteList = await browser.storage.local.get(blockedSitesKey);
    blockedList = siteList[blockedSitesKey];
}

// updates blocked list in background.js
function storeBlocked() {
    let siteList = blockedList;
    browser.storage.local.set({
        siteList
    });
}

// determines if provided input is url
function isUrlValid(userInput) {
    var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res == null)
        return false;
    else
        return true;
}

document.addEventListener('DOMContentLoaded', init);
