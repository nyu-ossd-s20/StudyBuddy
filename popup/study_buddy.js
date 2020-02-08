var addPicButton = document.getElementById("plus");
var otherField = document.getElementById("other-site");

var addButton = document.getElementById("add-site");
var studyButton = document.getElementById("study");

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