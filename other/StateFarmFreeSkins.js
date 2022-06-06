// ==UserScript==
// @name         StateFarmClient FreeSkins Mod
// @version      1.0
// @description  Access to every skin in shell shockers? Here you go!
// @match        https://shellshock.io/*
// @match        https://eggcombat.com/*
// @match        https://eggfacts.fun/*
// @match        https://biologyclass.club/*
// @match        https://egghead.institute/*
// @match        https://egg.dance/*
// @match        https://eggisthenewblack.com/*
// @match        https://mathfun.rocks/*
// @match        https://hardboiled.life/*
// @match        https://overeasy.club/*
// @match        https://zygote.cafe/*
// @match        https://eggsarecool.com/*
// @match        https://deadlyegg.com/*
// @match        https://mathgames.world/*
// @match        https://hardshell.life/*
// @match        https://violentegg.club/*
// @match        https://yolk.life/*
// @match        https://softboiled.club/*
// @match        https://scrambled.world/*
// @match        https://algebra.best/*
// @match        https://scrambled.today/*
// @match        https://deathegg.world/*
// @match        https://violentegg.fun/*
// @icon         https://raw.githubusercontent.com/hydroflame521/StateFarmClient/main/icons/StateFarmClientLogo384px.png
// @run-at       document-start
// @grant        unsafeWindow
// @namespace    https://greasyfork.org/users/815159
// ==/UserScript==
(function () {
    unsafeWindow.XMLHttpRequest = class extends unsafeWindow.XMLHttpRequest {
        constructor() {
            super(...arguments);
        }
        open() {
            if (arguments[1] && arguments[1].includes("src/shellshock.js")) {
                this.scriptMatch = true;
            }
            super.open(...arguments);
        }
        get response() {
 
            if (this.scriptMatch) {
                let responseText = super.response;
                let match = responseText.match(/inventory\[[A-z]\].id===[A-z].id\)return!0;return!1/);
                if (match) responseText = responseText.replace(match[0], match[0] + `||true`);
                return responseText;
            }
            return super.response;
        }
    };
}())
//this does not actually give you free skins, it's only visual on your side. this script is only for experimental use.
