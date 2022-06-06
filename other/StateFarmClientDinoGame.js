// ==UserScript==
// @name         StateFarmClient DinoGame
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Hack Client for https://dino-chrome.com/
// @author       StateFarmClientFork
// @icon         https://raw.githubusercontent.com/hydroflame521/StateFarmClient/main/icons/StateFarmClientLogo384px.png
// @match        https://dino-chrome.com/
// @match        https://t-rex-game.com/
// @match        *://chromedino.com/*
// @grant        none
// ==/UserScript==

//Speed hack
var button = document.createElement("Button");
button.innerHTML = "Speed Multiplier";
button.style = "top:0;right:0;position:absolute;z-index:99999;padding:20px;";
document.body.appendChild(button);
button.onclick = function(){Runner.instance_.setSpeed(40)};

// Other Speed Hack (press "s" for it)

window.addEventListener("keydown", hehe, false);

showHacks();

function showHacks(){
    var box = document.getElementById("desktop-controls");
    var controls = document.createElement("div");
    controls.className = "title2";
    controls.id = "adamsstuff";
    var lol = document.getElementById("adamsstuff");
}

function hehe(e){
    if(e.keyCode == "83"){
        var a = prompt("Enter Speed Multiplier Integer:");
        if(isNaN(a)){
            window.alert("The value provided was not a valid integer.");
        }else{
            Runner.instance_.setSpeed(a);
        }
    }

else if(e.keyCode == "68"){
        var b = prompt("Location to teleport to:");
        if(isNaN(b)){
            window.alert("Invalid Value detected!");
        }else{
            Runner.instance_.distanceRan = b
        }
    }
}
