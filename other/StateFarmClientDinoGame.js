// ==UserScript==
// @name         StateFarmClient DinoGame
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  Hack Client for https://dino-chrome.com/
// @author       StateFarmClientFork
// @icon         https://raw.githubusercontent.com/hydroflame521/StateFarmClient/main/icons/StateFarmClientLogo384px.png
// @match        https://dino-chrome.com/
// @match        https://t-rex-game.com/
// @match        *://chromedino.com/*
// @grant        none
// ==/UserScript==
var button = document.createElement("Button");
button.innerHTML = "𝗦𝗣𝗘𝗘𝗗 𝗠𝗨𝗟𝗧𝗜𝗣𝗟𝗜𝗘𝗥";
button.style = "top:0;right:0;position:absolute;z-index:99999;padding:20px;";
document.body.appendChild(button);
button.onclick = function(){Runner.instance_.setSpeed(40)};
window.addEventListener("keydown", speedhacks, false);
function speedhacks(e){
    if(e.keyCode == "83"){
        var a = prompt("Enter Speed Multiplier Integer:");
        if(isNaN(a)){
            window.alert("The value provided was not a valid integer.");
        }else{
            Runner.instance_.setSpeed(a);
        }
    }
}
