// ==UserScript==
// @name         StateFarm Client V3
// @namespace    http://github.com/
// @version      3.1.4
// @license      GPL-3.0
// @description  Only public script with bloom cheats! Best cheats menu for Shell Shockers in 2024. Many modules such as Aimbot, PlayerESP, AmmoESP, Chams, Nametags, Join/Leave messages, Chat Filter Disabling, AntiAFK, FOV Slider, Zooming, Co-ords, Player Stats, Auto Refill and many more whilst having unsurpassed customisation options such as binding to any key, easily editable colour scheme and themes - all on the fly!
// @author       Hydroflame521, onlypuppy7, enbyte and notfood
// @match        *://shellshock.io/*
// @match        *://algebra.best/*
// @match        *://algebra.vip/*
// @match        *://biologyclass.club/*
// @match        *://deadlyegg.com/*
// @match        *://deathegg.world/*
// @match        *://eggboy.club/*
// @match        *://eggboy.xyz/*
// @match        *://eggcombat.com/*
// @match        *://egg.dance/*
// @match        *://eggfacts.fun/*
// @match        *://egghead.institute/*
// @match        *://eggisthenewblack.com/*
// @match        *://eggsarecool.com/*
// @match        *://geometry.best/*
// @match        *://geometry.monster/*
// @match        *://geometry.pw/*
// @match        *://geometry.report/*
// @match        *://hardboiled.life/*
// @match        *://hardshell.life/*
// @match        *://humanorganising.org/*
// @match        *://mathactivity.xyz/*
// @match        *://mathactivity.club/*
// @match        *://mathdrills.info/*
// @match        *://mathdrills.life/*
// @match        *://mathfun.rocks/*
// @match        *://mathgames.world/*
// @match        *://math.international/*
// @match        *://mathlete.fun/*
// @match        *://mathlete.pro/*
// @match        *://overeasy.club/*
// @match        *://scrambled.best/*
// @match        *://scrambled.tech/*
// @match        *://scrambled.today/*
// @match        *://scrambled.us/*
// @match        *://scrambled.world/*
// @match        *://shellshockers.club/*
// @match        *://shellshockers.site/*
// @match        *://shellshockers.us/*
// @match        *://shellshockers.world/*
// @match        *://shellshockers.xyz/*
// @match        *://shellsocks.com/*
// @match        *://softboiled.club/*
// @match        *://urbanegger.com/*
// @match        *://violentegg.club/*
// @match        *://violentegg.fun/*
// @match        *://yolk.best/*
// @match        *://yolk.life/*
// @match        *://yolk.rocks/*
// @match        *://yolk.tech/*
// @match        *://yolk.quest/*
// @match        *://yolk.today/*
// @match        *://zygote.cafe/*
// @icon         https://raw.githubusercontent.com/Hydroflame522/StateFarmClient/main/icons/StateFarmClientLogo384px.png
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js
// @run-at       document-start
// ==/UserScript==
(function () {
    //script info
    const name="StateFarmClient";
    const version="3.1.4";
    //startup sequence
    const startUp=function () {
        mainLoop()
        injectScript()
        document.addEventListener("DOMContentLoaded", function () {
            initMenu();
            applyStylesAddElements(); //set font and change menu cass, and other stuff to do with the page
            const intervalId1 = setInterval(everySecond, 1000);
            const intervalId2 = setInterval(updateConfig, 100);
        });
    };
    //INIT VARS
    window.newGame=false
    let binding=false;
    let lastSpamMessage=0;
    let lastAntiAFKMessage=0;
    let yawCache=0;
    let yawDiff=0;
    let pitchCache=0;
    let pitchDiff=0;
    let targetingComplete=false;
    const allModules=[];
    const allFolders=[];
    const isKeyToggled={};
    let ESPArray=[];
    let onlinePlayersArray=[];
    let bindsArray={};
    const tp={}; // <-- tp = tweakpane
    let msgElement,redCircle,crosshairsPosition,currentlyTargeting,ammo,ranOneTime,lastWeaponBox,lastChatItemLength,config;
    let whitelistPlayers,blacklistPlayers;
    const mainLoopFunction=Array.from({length: 10}, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
    let isLeftButtonDown = false;
    let isRightButtonDown = false;
    //menu interaction functions
    const extract = function (variable,shouldUpdate) {
        if (shouldUpdate) {updateConfig()};
        return config[variable];
    };
    const beginBinding = function (value) {
        if (binding == false) {
            binding=value;
            tp[binding+"BindButton"].title="PRESS KEY";
        };
    };
    const change = function (module,newValue) { //its important to note that every module must have a unique name
        const labels = document.querySelectorAll('.tp-lblv_l');
        const moduleButton=module+"Button";
        const moduleLabel=tp[moduleButton].label;
        for (const label of labels) {
            if (label.textContent.includes(moduleLabel)) {
                const inputContainer = label.nextElementSibling;
                const currentValue=extract(module);
                // check for checkbox
                const checkbox = inputContainer.querySelector('.tp-ckbv_i');
                if (checkbox) {
                    if (newValue==undefined) {
                        newValue=(!currentValue);
                    };
                    if (newValue!=currentValue) {
                        checkbox.click(); // Toggle checkbox
                    };
                    return extract(module,true);
                };
                // check for button
                const button = inputContainer.querySelector('.tp-btnv_b');
                if (button) {
                    button.click(); // Trigger button click
                    return ("NOMSG"); //no change of state, dont show pop up message
                };
                // check for dropdown
                const dropdown = inputContainer.querySelector('.tp-lstv_s');
                if (dropdown) {
                    if (newValue==undefined) { //if youre going to set a list to a certain value, use the int value of the list item
                        newValue=(dropdown.selectedIndex + 1) % dropdown.options.length;
                    };
                    dropdown.selectedIndex = newValue;
                    dropdown.dispatchEvent(new Event('change')); // trigger change event for dropdown
                    return extract(module,true);
                };
            };
        };
    };
    document.addEventListener('mousedown', function (event) {
        if (event.button === 2) {
            isRightButtonDown = true;
        };
        if (event.button === 0) {
            isLeftButtonDown = true;
        };
    });
    document.addEventListener('mouseup', function (event) {
        if (event.button === 2) {
            isRightButtonDown = false;
        };
        if (event.button === 0) {
            isLeftButtonDown = false;
        };
    });
    //menu
    document.addEventListener("keydown", function (event) {
        event=(event.code.substring(3));
        isKeyToggled[event]=true;
    });
    document.addEventListener("keyup", function (event) {
        event=(event.code.replace("Key",""));
        isKeyToggled[event]=false;
        if (document.activeElement&&document.activeElement.tagName==='INPUT' ) {
            return;
        } else if (binding!=false) {
                if (event=="Delete") { event="Set Bind" };
                tp[binding+"BindButton"].title=event;
                bindsArray[binding]=event;
                localStorage.setItem(binding+"Bind",JSON.stringify(event));
                showMsg("Binded "+tp[binding+"Button"].label+" to key: "+event);
                binding=false;
        } else {
            Object.keys(bindsArray).forEach(function (module) {
                if ((bindsArray[module] == event) && module!="zoom") {
                    let state=change(module)
                    if (typeof state === "boolean") {
                        state = (state ? 'ON' : 'OFF');
                    };
                    if (state!="NOMSG") {
                        state="Set "+module+" to: "+state;
                    } else {
                        switch (module) {
                            case ("hide"):
                                state="Toggled GUI"; break;
                            case ("panic"):
                                state="Exiting to set URL..."; break;
                        };
                    };
                    showMsg(state);
                };
            });
        };
    });
    const initTab = function(tab) {
        tp[tab.storeAs]=tab.location.addTab({
            pages: [
            {title: 'Modules'},
            {title: 'Binds'},
            ],
        });
    };
    const initFolder = function(folder) {
        tp[folder.storeAs]=folder.location.addFolder({
            title: folder.title,
            expanded: JSON.parse(localStorage.getItem(folder.storeAs)) !== null ? JSON.parse(localStorage.getItem(folder.storeAs)) : false
        });
        allFolders.push(folder.storeAs);
    };
    const initModule = function (module) {
        const value={}
        value[module.storeAs]=(JSON.parse(localStorage.getItem(module.storeAs)) || (module.defaultValue !== undefined ? module.defaultValue : false));
        if (!(module.slider&&module.slider.step)) {module.slider={}};
        const config={
            label: module.title,
            options: module.dropdown,
            min: module.slider.min,
            max: module.slider.max,
            step: module.slider.step,
            title: module.button,
        };
        if (!module.button) {
            tp[(module.storeAs+"Button")]=module.location.addInput(value,module.storeAs,config
            ).on("change", (value) => {
                localStorage.setItem(module.storeAs,JSON.stringify(value.value));
                if (module.changeFunction!==undefined) {module.changeFunction(value)};
            });
        } else {
            tp[(module.storeAs+"Button")]=module.location.addButton({
                label: module.title,
                title: module.button,
            }).on("click", (value) => {
                if (module.clickFunction!==undefined) {module.clickFunction(value)};
            });
        };
        allModules.push(name.replace("Button",""));
        if (module.bindLocation) {initBind(module)};
    };
    const initBind = function (module) {
        const theBind=(JSON.parse(localStorage.getItem(module.storeAs+"Bind")) || module.defaultBind || "Set Bind");
        tp[(module.storeAs+"BindButton")]=module.bindLocation.addButton({
            label: module.title,
            title: theBind,
        }).on("click", (value) => {
            beginBinding(module.storeAs);
        });
        bindsArray[module.storeAs]=theBind;
    };
    const initMenu = function () {
        //INIT MENU
        //init tp.pane

        tp.pane = new Tweakpane.Pane();
        tp.pane.title = name + " v" + version;
        //COMBAT MODULES
        initFolder({ location: tp.pane, title: "Combat", storeAs: "combatFolder",});
        initTab({ location: tp.combatFolder, storeAs: "combatTab" })
            initModule({ location: tp.combatTab.pages[0], title: "Aimbot", storeAs: "aimbot", bindLocation: tp.combatTab.pages[1], defaultBind:"V",});
            initFolder({ location: tp.combatTab.pages[0], title: "Aimbot Options", storeAs: "aimbotFolder",});
                initModule({ location: tp.aimbotFolder, title: "Target", storeAs: "aimbotTargeting", bindLocation: tp.combatTab.pages[1], defaultBind:"T", dropdown: [{text: "Pointing At", value: "pointingat"}, {text: "Nearest", value: "nearest"}], defaultValue: "pointingat"});
                initModule({ location: tp.aimbotFolder, title: "ToggleRM", storeAs: "aimbotRightClick", bindLocation: tp.combatTab.pages[1],});
                initModule({ location: tp.aimbotFolder, title: "AntiBloom", storeAs: "antiBloom", bindLocation: tp.combatTab.pages[1],});
                initModule({ location: tp.aimbotFolder, title: "AntiSwitch", storeAs: "antiSwitch", bindLocation: tp.combatTab.pages[1],});
                initModule({ location: tp.aimbotFolder, title: "1 Kill", storeAs: "oneKill", bindLocation: tp.combatTab.pages[1],});
                initModule({ location: tp.aimbotFolder, title: "Prediction", storeAs: "prediction", bindLocation: tp.combatTab.pages[1],});
                initModule({ location: tp.aimbotFolder, title: "Antisnap", storeAs: "aimbotAntiSnap", bindLocation: tp.combatTab.pages[1], slider: {min: 0, max: 1.05, step: 0.01}, defaultValue: 0,});
                initModule({ location: tp.aimbotFolder, title: "Antisneak", storeAs: "antiSneak", bindLocation: tp.combatTab.pages[1], slider: {min: 0, max: 5, step: 0.2}, defaultValue: 0,});
                initModule({ location: tp.aimbotFolder, title: "ESPColor", storeAs: "aimbotColor", defaultValue: "#0000ff"});
            initModule({ location: tp.combatTab.pages[0], title: "Auto Refill", storeAs: "autoRefill", bindLocation: tp.combatTab.pages[1],});
            initModule({ location: tp.combatTab.pages[0], title: "HoldToFire", storeAs: "holdToFire", bindLocation: tp.combatTab.pages[1],});
            initModule({ location: tp.combatTab.pages[0], title: "Auto Fire", storeAs: "autoFire", bindLocation: tp.combatTab.pages[1],});
            initModule({ location: tp.combatTab.pages[0], title: "GrenadeMAX", storeAs: "grenadeMax", bindLocation: tp.combatTab.pages[1],});
        //RENDER MODULES
        initFolder({ location: tp.pane, title: "Render", storeAs: "renderFolder",});
        initTab({ location: tp.renderFolder, storeAs: "renderTab" })
            initModule({ location: tp.renderTab.pages[0], title: "PlayerESP", storeAs: "playerESP", bindLocation: tp.renderTab.pages[1],});
            initModule({ location: tp.renderTab.pages[0], title: "Tracers", storeAs: "tracers", bindLocation: tp.renderTab.pages[1],});
            initModule({ location: tp.renderTab.pages[0], title: "Chams", storeAs: "chams", bindLocation: tp.renderTab.pages[1],});
            initModule({ location: tp.renderTab.pages[0], title: "Nametags", storeAs: "nametags", bindLocation: tp.renderTab.pages[1],});
            initFolder({ location: tp.renderTab.pages[0], title: "Player ESP/Tracers Options", storeAs: "tracersFolder",});
                initModule({ location: tp.tracersFolder, title: "Type", storeAs: "tracersType", bindLocation: tp.renderTab.pages[1], dropdown: [{text: "Static", value: "static"}, {text: "Proximity", value: "proximity"}], defaultValue: "static",});
                initModule({ location: tp.tracersFolder, title: "Color 1", storeAs: "tracersColor1", defaultValue: "#ff0000",});
                initModule({ location: tp.tracersFolder, title: "Dist 1->2", storeAs: "tracersColor1to2", slider: {min: 0, max: 30, step: 0.25}, defaultValue: 5,});
                initModule({ location: tp.tracersFolder, title: "Color 2", storeAs: "tracersColor2", defaultValue: "#00ff00",});
                initModule({ location: tp.tracersFolder, title: "Dist 2->3", storeAs: "tracersColor2to3", slider: {min: 0, max: 30, step: 0.25}, defaultValue: 15,});
                initModule({ location: tp.tracersFolder, title: "Color 3", storeAs: "tracersColor3", defaultValue: "#ffffff",});
            initFolder({ location: tp.renderTab.pages[0], title: "Ammo ESP/Tracers Options", storeAs: "tracersAmmoFolder",});
                initFolder({ location: tp.tracersAmmoFolder, title: "Ammo", storeAs: "ammoFolder",});
                    initModule({ location: tp.ammoFolder, title: "AESP", storeAs: "ammoESP", bindLocation: tp.renderTab.pages[1],});
                    initModule({ location: tp.ammoFolder, title: "ATracers", storeAs: "ammoTracers", bindLocation: tp.renderTab.pages[1],});
                    initModule({ location: tp.ammoFolder, title: "ARegime", storeAs: "ammoESPRegime", bindLocation: tp.renderTab.pages[1], dropdown: [{text: "When Depleted", value: "whendepleted"},{text: "When Low", value: "whenlow"},{text: "Below Max", value: "belowmax"},{text: "Always On", value: "alwayson"},], defaultValue: "whendepleted"});
                    initModule({ location: tp.ammoFolder, title: "AColor", storeAs: "ammoESPColor", defaultValue: "#ffff00",});
                initFolder({ location: tp.tracersAmmoFolder, title: "Grenades", storeAs: "grenadesFolder",});
                    initModule({ location: tp.grenadesFolder, title: "GESP", storeAs: "grenadeESP", bindLocation: tp.renderTab.pages[1],});
                    initModule({ location: tp.grenadesFolder, title: "GTracers", storeAs: "grenadeTracers", bindLocation: tp.renderTab.pages[1],});
                    initModule({ location: tp.grenadesFolder, title: "GRegime", storeAs: "grenadeESPRegime", bindLocation: tp.renderTab.pages[1], dropdown: [{text: "When Depleted", value: "whendepleted"},{text: "When Low", value: "whenlow"},{text: "Below Max", value: "belowmax"},{text: "Always On", value: "alwayson"},], defaultValue: "whendepleted"});
                    initModule({ location: tp.grenadesFolder, title: "GColor", storeAs: "grenadeESPColor", defaultValue: "#00ffff",});
            initModule({ location: tp.renderTab.pages[0], title: "FOV", storeAs: "fov", slider: {min: 0, max: 360, step: 3}, defaultValue: 72,});
            initModule({ location: tp.renderTab.pages[0], title: "Zoom FOV", storeAs: "zoom", slider: {min: 0, max: 72, step: 3}, defaultValue: 15, bindLocation: tp.renderTab.pages[1], defaultBind: "C",});
            initModule({ location: tp.renderTab.pages[0], title: "ShowBloom", storeAs: "revealBloom", bindLocation: tp.renderTab.pages[1],});
            initModule({ location: tp.renderTab.pages[0], title: "CamWIP", storeAs: "freecam", bindLocation: tp.renderTab.pages[1],});
            initModule({ location: tp.renderTab.pages[0], title: "Co-ords", storeAs: "showCoordinates", bindLocation: tp.renderTab.pages[1],});
            initModule({ location: tp.renderTab.pages[0], title: "PlayerStats", storeAs: "playerStats", bindLocation: tp.renderTab.pages[1],});
            initModule({ location: tp.renderTab.pages[0], title: "Wireframe", storeAs: "wireframe", bindLocation: tp.renderTab.pages[1],});
            initModule({ location: tp.renderTab.pages[0], title: "Egg Size", storeAs: "eggSize", slider: {min: 0, max: 10, step: 0.25}, defaultValue: 1,});
        //CHAT MODULES
        initFolder({ location: tp.pane, title: "Chat", storeAs: "chatFolder",});
        initTab({ location: tp.chatFolder, storeAs: "chatTab" })
            initModule({ location: tp.chatTab.pages[0], title: "InfiniHistory", storeAs: "chatExtend", bindLocation: tp.chatTab.pages[1],});
            initModule({ location: tp.chatTab.pages[0], title: "Max Ingame", storeAs: "maxChat", slider: {min: 0, max: 30, step: 1}, defaultValue: 5,});
            initModule({ location: tp.chatTab.pages[0], title: "DisableFilter", storeAs: "disableChatFilter", bindLocation: tp.chatTab.pages[1],});
            initModule({ location: tp.chatTab.pages[0], title: "AntiAFK", storeAs: "antiAFK", bindLocation: tp.chatTab.pages[1],});
            initModule({ location: tp.chatTab.pages[0], title: "HighlightTxt", storeAs: "chatHighlight", bindLocation: tp.chatTab.pages[1],});
            initModule({ location: tp.chatTab.pages[0], title: "Filter Bypass", storeAs: "chatFilterBypass", bindLocation: tp.chatTab.pages[1],});
            initModule({ location: tp.chatTab.pages[0], title: "Spammer", storeAs: "spamChat", bindLocation: tp.chatTab.pages[1],});
            initFolder({ location: tp.chatTab.pages[0], title: "Spammer Options", storeAs: "spammerFolder",});
                initModule({ location: tp.spammerFolder, title: "Delay (ms)", storeAs: "spamChatDelay", slider: {min: 0, max: 60000, step: 10}, defaultValue: 500,});
                initModule({ location: tp.spammerFolder, title: "Spam Text", storeAs: "spamChatText", defaultValue: "StateFarm On Top! ",});
            initFolder({ location: tp.chatTab.pages[0], title: "Join/Leave Msgs Options", storeAs: "joinLeaveFolder",});
                initModule({ location: tp.joinLeaveFolder, title: "Join Msgs", storeAs: "joinMessages", bindLocation: tp.chatTab.pages[1],});
                initModule({ location: tp.joinLeaveFolder, title: "Leave Msgs", storeAs: "leaveMessages", bindLocation: tp.chatTab.pages[1],});
                initModule({ location: tp.joinLeaveFolder, title: "Send2Chat", storeAs: "publicBroadcast", bindLocation: tp.chatTab.pages[1],});
                initModule({ location: tp.joinLeaveFolder, title: "Branded", storeAs: "joinLeaveBranding", bindLocation: tp.chatTab.pages[1],});
        //LISTS MODULES
        initFolder({ location: tp.pane, title: "Lists", storeAs: "listsFolder",});
        initTab({ location: tp.listsFolder, storeAs: "listsTab" })
            initModule({ location: tp.listsTab.pages[0], title: "Whitelist", storeAs: "whitelist", defaultValue: "User-1, User-2",});
            initFolder({ location: tp.listsTab.pages[0], title: "Whitelist (Target Only) Options", storeAs: "whitelistFolder",});
                initModule({ location: tp.whitelistFolder, title: "WAimbot", storeAs: "enableWhitelistAimbot", bindLocation: tp.listsTab.pages[1],});
                initModule({ location: tp.whitelistFolder, title: "WESP", storeAs: "enableWhitelistTracers", bindLocation: tp.listsTab.pages[1],});
                initModule({ location: tp.whitelistFolder, title: "WESPType", storeAs: "whitelistESPType", bindLocation: tp.listsTab.pages[1], dropdown: [{text: "Only Include", value: "onlyinclude"},{text: "Highlight", value: "highlight"},], defaultValue: "onlyinclude",});
                initModule({ location: tp.whitelistFolder, title: "WHighlight", storeAs: "whitelistColor", defaultValue: "#e80aac",});
            initModule({ location: tp.listsTab.pages[0], title: "Blacklist", storeAs: "blacklist", defaultValue: "User-1, User-2",});
            initFolder({ location: tp.listsTab.pages[0], title: "Blacklist (Exclude) Options", storeAs: "blacklistFolder",});
                initModule({ location: tp.blacklistFolder, title: "BAimbot", storeAs: "enableBlacklistAimbot", bindLocation: tp.listsTab.pages[1],});
                initModule({ location: tp.blacklistFolder, title: "BESP", storeAs: "enableBlacklistTracers", bindLocation: tp.listsTab.pages[1],});
                initModule({ location: tp.blacklistFolder, title: "BESPType", storeAs: "blacklistESPType", bindLocation: tp.listsTab.pages[1], dropdown: [{text: "Just Exclude", value: "justexclude"},{text: "Highlight", value: "highlight"},], defaultValue: "justexclude",});
                initModule({ location: tp.blacklistFolder, title: "BHighlight", storeAs: "blacklistColor", defaultValue: "#00ff00",});
        //MISC MODULES
        initFolder({ location: tp.pane, title: "Misc", storeAs: "miscFolder",});
        initTab({ location: tp.miscFolder, storeAs: "miscTab" })
            initModule({ location: tp.miscTab.pages[0], title: "Unlock Skins", storeAs: "unlockSkins", bindLocation: tp.miscTab.pages[1],});
            initModule({ location: tp.miscTab.pages[0], title: "ShowStreams", storeAs: "showStreams", bindLocation: tp.miscTab.pages[1],});
        //CLIENT MODULES
        initFolder({ location: tp.pane, title: "Client & About", storeAs: "clientFolder",});
        initTab({ location: tp.clientFolder, storeAs: "clientTab" })
            initModule({ location: tp.clientTab.pages[0], title: "Hide GUI", storeAs: "hide", bindLocation: tp.clientTab.pages[1], button: "Hide!", clickFunction: function(){tp.pane.hidden=!tp.pane.hidden}, defaultBind:"H",});
            initModule({ location: tp.clientTab.pages[0], title: "Theme", storeAs: "themeType", bindLocation: tp.clientTab.pages[1], dropdown: [
                {text: "Default", value: "defaultTheme"},
                {text: "Iceberg", value: "icebergTheme"},
                {text: "Jetblack", value: "jetblackTheme"},
                {text: "Light", value: "lightTheme"},
                {text: "Retro", value: "retroTheme"},
                {text: "Translucent", value: "translucentTheme"},
                {text: "Statefarmer", value: "statefarmerTheme"}
            ], defaultValue: "defaultTheme", changeFunction: function(value) {
                applyTheme(value.value);
            }});
            initModule({ location: tp.clientTab.pages[0], title: "Pop-ups", storeAs: "popups", bindLocation: tp.clientTab.pages[1], defaultValue: true,});
            initModule({ location: tp.clientTab.pages[0], title: "Panic", storeAs: "panic", bindLocation: tp.clientTab.pages[1], button: "EXIT!", clickFunction: function(){if (extract("enablePanic")) { window.location.replace(extract("panicURL")) }}, defaultBind:"X",});
            initFolder({ location: tp.clientTab.pages[0], title: "Panic Options", storeAs: "panicFolder",});
                initModule({ location: tp.panicFolder, title: "Enable", storeAs: "enablePanic", bindLocation: tp.clientTab.pages[1], defaultValue: true,});
                initModule({ location: tp.panicFolder, title: "Set URL", storeAs: "panicURL", defaultValue: "https://classroom.google.com/",});
            initFolder({ location: tp.clientTab.pages[0], title: "Creator's Links", storeAs: "linksFolder",});
                initModule({ location: tp.linksFolder, title: "Discord", storeAs: "discord", button: "Link", clickFunction: function(){window.open("https://discord.gg/mPa95HB7Q6")},});
                initModule({ location: tp.linksFolder, title: "GitHub", storeAs: "github", button: "Link", clickFunction: function(){window.open("https://github.com/Hydroflame522/StateFarmClient")},});
            initModule({ location: tp.clientTab.pages[0], title: "Reset", storeAs: "clear", button: "DELETE", clickFunction: function(){
                const userConfirmed=confirm("Are you sure you want to continue? This will clear all stored keybinds, but also some of the game's stuff too (username, and other stuff).");
                if (userConfirmed) {
                    localStorage.clear();
                    userConfirmed=alert("Reload to reset to defaults.");
                };
            },});
        initModule({ location: tp.pane, title: "Guide", storeAs: "documentation", button: "Link", clickFunction: function(){window.open("https://github.com/Hydroflame522/StateFarmClient/tree/main#features")},});

        updateConfig();
    };
    //visual functions
    const showMsg = function (text,type) {
        try {
            if (extract("popups")) {
                const messageContainer = document.getElementById('message-container');
                const messages = messageContainer.getElementsByClassName('msg');
                if (messages.length > 5) {
                    messageContainer.removeChild(messages[0]);
                };
                const clonedMsgElement = msgElement.cloneNode(true);
                clonedMsgElement.innerText = text;
                switch (type) {
                    case ("success"):
                        clonedMsgElement.style.border='2px solid rgba(0, 255, 0, 0.5)'; break;
                    case ("error"):
                        clonedMsgElement.style.border='2px solid rgba(255, 0, 0, 0.5)'; break;
                };
                clonedMsgElement.style.display='none';
                const messageOffset=(messages.length+1)*50;
                clonedMsgElement.style.bottom=messageOffset+"px";
                void clonedMsgElement.offsetWidth;
                clonedMsgElement.style.display='';
                messageContainer.appendChild(clonedMsgElement);
                //reorder such that newest is lowest
                for (let i=messages.length-1;i>=0;i--) {
                    messages[i].style.bottom=(((messages.length-i)*50)-40)+"px";
                };
            };
        } catch (error) {
            // Handle the error and display an error message onscreen
            console.error("An error occurred:", error);
            alert("Bollocks! If you're getting this message, injection probably failed. To solve this, perform CTRL+F5 - this performs a hard reload. If this does not work, contact the moderators.");
        }
    };
    const applyStylesAddElements = function (themeToApply = "null") {
        const head = document.head || document.getElementsByTagName('head').pages[0];
        //menu customisation (apply font, button widths, adjust checkbox right slightly, make menu appear on top, add anim to message)
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            @font-face {
                font-family: "Bahnschrift";
                src: url("https://db.onlinewebfonts.com/t/0a6ee448d1bd65c56f6cf256a7c6f20a.eot");
                src: url("https://db.onlinewebfonts.com/t/0a6ee448d1bd65c56f6cf256a7c6f20a.eot?#iefix")format("embedded-opentype"),
                url("https://db.onlinewebfonts.com/t/0a6ee448d1bd65c56f6cf256a7c6f20a.woff2")format("woff2"),
                url("https://db.onlinewebfonts.com/t/0a6ee448d1bd65c56f6cf256a7c6f20a.woff")format("woff"),
                url("https://db.onlinewebfonts.com/t/0a6ee448d1bd65c56f6cf256a7c6f20a.ttf")format("truetype"),
                url("https://db.onlinewebfonts.com/t/0a6ee448d1bd65c56f6cf256a7c6f20a.svg#Bahnschrift")format("svg");
            }
            .tp-dfwv, .tp-rotv_t, .tp-fldv_t, .tp-ckbv_l, .tp-lblv_l, .tp-tabv_i, .msg, .coords, .playerstats {
                font-family: 'Bahnschrift', sans-serif !important;
                font-size: 16px;
            }
            .tp-lblv_v, .tp-lstv, .tp-btnv_b, .tp-btnv_t {
                font-family: 'Bahnschrift';
                font-size: 12px;
            }
            .tp-lblv_l {
                font-size: 14px;
                letter-spacing: -1px;
            }
            .tp-btnv {
                width: 100px;
                margin-left: 60px !important;
            }
            .tp-ckbv_w {
                margin-left: 4px !important;
            }
            .tp-dfwv, .tp-rotv, .tp-rotv_c, .tp-fldv, .tp-fldv_c, .tp-lblv, .tp-lstv, .tp-btnv, .tp-sldv {
                z-index: 9999 !important;
                white-space: nowrap !important;
            }
            @keyframes msg {
                from {
                    transform: translate(-120%, 0);
                    opacity: 0;
                }
                to {
                    transform: none;
                    opacity: 1;
                }
            }
        `;

        document.head.appendChild(styleElement);
        applyTheme();

        //initiate message div and css and shit
        msgElement = document.createElement('div'); // create the element directly
        msgElement.classList.add('msg');
        msgElement.setAttribute('style', `
            position: absolute;
            left: 10px;
            color: #fff;
            background: rgba(0, 0, 0, 0.7);
            font-weight: normal;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.5);
            animation: msg 0.5s forwards, msg 0.5s reverse forwards 3s;
            z-index: 999999;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        `);
        document.body.appendChild(msgElement);
        msgElement.style.display = 'none';
        const messageContainer = document.createElement('div'); //so it can be cloned. i think.
        messageContainer.id = 'message-container';
        document.body.appendChild(messageContainer);
        //initiate coord div and css and shit
        coordElement = document.createElement('div'); // create the element directly
        coordElement.classList.add('coords');
        coordElement.setAttribute('style', `
            position: fixed;
            top: -2px;
            left: -2px;
            color: #fff;
            background: rgba(0, 0, 0, 0.6);
            font-weight: bolder;
            padding: 2px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.5);
            z-index: 999999;
        `);
        document.body.appendChild(coordElement);
        coordElement.style.display = 'none';
        //initiate hp div and css and shit
        playerstatsElement = document.createElement('div'); // create the element directly
        playerstatsElement.classList.add('playerstats');
        playerstatsElement.setAttribute('style', `
            position: fixed;
            top: 20px;
            left: 280px;
            color: #fff;
            background: rgba(0, 0, 0, 0.6);
            font-weight: bolder;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.5);
            z-index: 999999;
        `);
        document.body.appendChild(playerstatsElement);
        playerstatsElement.style.display = 'none';
        //initiate bloom indicator div and css and shit
        redCircle = document.createElement('div');
        redCircle.style.position = 'fixed';
        redCircle.style.width = '5px';
        redCircle.style.height = '5px';
        redCircle.style.borderRadius = '50%';
        redCircle.style.backgroundColor = 'red';
        redCircle.style.transform = 'translate(-50%, -50%)';
        document.body.appendChild(redCircle);
    };
    const applyTheme = function(setTheme) {
        setTheme = (setTheme||extract("themeType")||"defaultTheme");
        switch (setTheme) {
            case ("defaultTheme"):
            rootTheme = `
--tp-base-background-color: hsla(230, 7%, 17%, 1.00);
--tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
--tp-button-background-color: hsla(230, 7%, 70%, 1.00);
--tp-button-background-color-active: hsla(230, 7%, 85%, 1.00);
--tp-button-background-color-focus: hsla(230, 7%, 80%, 1.00);
--tp-button-background-color-hover: hsla(230, 7%, 75%, 1.00);
--tp-button-foreground-color: hsla(230, 7%, 17%, 1.00);
--tp-container-background-color: hsla(230, 7%, 75%, 0.10);
--tp-container-background-color-active: hsla(230, 7%, 75%, 0.25);
--tp-container-background-color-focus: hsla(230, 7%, 75%, 0.20);
--tp-container-background-color-hover: hsla(230, 7%, 75%, 0.15);
--tp-container-foreground-color: hsla(230, 7%, 75%, 1.00);
--tp-groove-foreground-color: hsla(230, 7%, 75%, 0.10);
--tp-input-background-color: hsla(230, 7%, 75%, 0.10);
--tp-input-background-color-active: hsla(230, 7%, 75%, 0.25);
--tp-input-background-color-focus: hsla(230, 7%, 75%, 0.20);
--tp-input-background-color-hover: hsla(230, 7%, 75%, 0.15);
--tp-input-foreground-color: hsla(230, 7%, 75%, 1.00);
--tp-label-foreground-color: hsla(230, 7%, 75%, 0.70);
--tp-monitor-background-color: hsla(230, 7%, 0%, 0.20);
--tp-monitor-foreground-color: hsla(230, 7%, 75%, 0.70);`; break;
        case ( "icebergTheme" ):
            rootTheme = `
--tp-base-background-color: hsla(230, 20%, 11%, 1.00);
--tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
--tp-button-background-color: hsla(230, 10%, 80%, 1.00);
--tp-button-background-color-active: hsla(230, 10%, 95%, 1.00);
--tp-button-background-color-focus: hsla(230, 10%, 90%, 1.00);
--tp-button-background-color-hover: hsla(230, 10%, 85%, 1.00);
--tp-button-foreground-color: hsla(230, 20%, 11%, 1);
--tp-container-background-color: hsla(230, 25%, 16%, 1.00);
--tp-container-background-color-active: hsla(230, 25%, 31%, 1.00);
--tp-container-background-color-focus: hsla(230, 25%, 26%, 1.00);
--tp-container-background-color-hover: hsla(230, 25%, 21%, 1.00);
--tp-container-foreground-color: hsla(230, 10%, 80%, 1.00);
--tp-groove-foreground-color: hsla(230, 20%, 8%, 1.00);
--tp-input-background-color: hsla(230, 20%, 8%, 1.00);
--tp-input-background-color-active: hsla(230, 28%, 23%, 1.00);
--tp-input-background-color-focus: hsla(230, 28%, 18%, 1.00);
--tp-input-background-color-hover: hsla(230, 20%, 13%, 1.00);
--tp-input-foreground-color: hsla(230, 10%, 80%, 1.00);
--tp-label-foreground-color: hsla(230, 12%, 48%, 1.00);
--tp-monitor-background-color: hsla(230, 20%, 8%, 1.00);
--tp-monitor-foreground-color: hsla(230, 12%, 48%, 1.00);`; break;
        case ( "jetblackTheme" ):
            rootTheme = `
--tp-base-background-color: hsla(0, 0%, 0%, 1.00);
--tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
--tp-button-background-color: hsla(0, 0%, 70%, 1.00);
--tp-button-background-color-active: hsla(0, 0%, 85%, 1);
--tp-button-background-color-focus: hsla(0, 0%, 80%, 1.00);
--tp-button-background-color-hover: hsla(0, 0%, 75%, 1.00);
--tp-button-foreground-color: hsla(0, 0%, 0%, 1.00);
--tp-container-background-color: hsla(0, 0%, 10%, 1.00);
--tp-container-background-color-active: hsla(0, 0%, 25%, 1.00);
--tp-container-background-color-focus: hsla(0, 0%, 20%, 1.00);
--tp-container-background-color-hover: hsla(0, 0%, 15%, 1.00);
--tp-container-foreground-color: hsla(0, 0%, 50%, 1.00);
--tp-groove-foreground-color: hsla(0, 0%, 10%, 1.00);
--tp-input-background-color: hsla(0, 0%, 10%, 1.00);
--tp-input-background-color-active: hsla(0, 0%, 25%, 1.00);
--tp-input-background-color-focus: hsla(0, 0%, 20%, 1.00);
--tp-input-background-color-hover: hsla(0, 0%, 15%, 1.00);
--tp-input-foreground-color: hsla(0, 0%, 70%, 1.00);
--tp-label-foreground-color: hsla(0, 0%, 50%, 1.00);
--tp-monitor-background-color: hsla(0, 0%, 8%, 1.00);
--tp-monitor-foreground-color: hsla(0, 0%, 48%, 1.00);`; break;
        case ( "lightTheme" ):
            rootTheme = `
--tp-base-background-color: hsla(230, 5%, 90%, 1.00);
--tp-base-shadow-color: hsla(0, 0%, 0%, 0.10);
--tp-button-background-color: hsla(230, 7%, 75%, 1.00);
--tp-button-background-color-active: hsla(230, 7%, 60%, 1.00);
--tp-button-background-color-focus: hsla(230, 7%, 65%, 1.00);
--tp-button-background-color-hover: hsla(230, 7%, 70%, 1.00);
--tp-button-foreground-color: hsla(230, 10%, 30%, 1.00);
--tp-container-background-color: hsla(230, 15%, 30%, 0.20);
--tp-container-background-color-active: hsla(230, 15%, 30%, 0.32);
--tp-container-background-color-focus: hsla(230, 15%, 30%, 0.28);
--tp-container-background-color-hover: hsla(230, 15%, 30%, 0.24);
--tp-container-foreground-color: hsla(230, 10%, 30%, 1.00);
--tp-groove-foreground-color: hsla(230, 15%, 30%, 0.10);
--tp-input-background-color: hsla(230, 15%, 30%, 0.10);
--tp-input-background-color-active: hsla(230, 15%, 30%, 0.22);
--tp-input-background-color-focus: hsla(230, 15%, 30%, 0.18);
--tp-input-background-color-hover: hsla(230, 15%, 30%, 0.14);
--tp-input-foreground-color: hsla(230, 10%, 30%, 1.00);
--tp-label-foreground-color: hsla(230, 10%, 30%, 0.70);
--tp-monitor-background-color: hsla(230, 15%, 30%, 0.10);
--tp-monitor-foreground-color: hsla(230, 10%, 30%, 0.50);`; break;
        case ( "retroTheme" ):
            rootTheme = `
--tp-base-background-color: hsla(40, 3%, 90%, 1.00);
--tp-base-shadow-color: hsla(0, 0%, 0%, 0.30);
--tp-button-background-color: hsla(40, 3%, 70%, 1.00);
--tp-button-background-color-active: hsla(40, 3%, 55%, 1.00);
--tp-button-background-color-focus: hsla(40, 3%, 60%, 1.00);
--tp-button-background-color-hover: hsla(40, 3%, 65%, 1.00);
--tp-button-foreground-color: hsla(40, 3%, 20%, 1.00);
--tp-container-background-color: hsla(40, 3%, 70%, 1.00);
--tp-container-background-color-active: hsla(40, 3%, 55%, 1.00);
--tp-container-background-color-focus: hsla(40, 3%, 60%, 1.00);
--tp-container-background-color-hover: hsla(40, 3%, 65%, 1.00);
--tp-container-foreground-color: hsla(40, 3%, 20%, 1.00);
--tp-groove-foreground-color: hsla(40, 3%, 40%, 1.00);
--tp-input-background-color: hsla(120, 3%, 20%, 1.00);
--tp-input-background-color-active: hsla(120, 3%, 35%, 1.00);
--tp-input-background-color-focus: hsla(120, 3%, 30%, 1.00);
--tp-input-background-color-hover: hsla(120, 3%, 25%, 1.00);
--tp-input-foreground-color: hsla(120, 40%, 60%, 1.00);
--tp-label-foreground-color: hsla(40, 3%, 50%, 1.00);
--tp-monitor-background-color: hsla(120, 3%, 20%, 1.00);
--tp-monitor-foreground-color: hsla(120, 40%, 60%, 0.80);`; break;
        case ( "translucentTheme" ):
            rootTheme = `
--tp-base-background-color: hsla(0, 0%, 10%, 0.80);
--tp-base-shadow-color: hsla(0, 0%, 0%, 0.20);
--tp-button-background-color: hsla(0, 0%, 80%, 1.00);
--tp-button-background-color-active: hsla(0, 0%, 100%, 1.00);
--tp-button-background-color-focus: hsla(0, 0%, 95%, 1.00);
--tp-button-background-color-hover: hsla(0, 0%, 85%, 1.00);
--tp-button-foreground-color: hsla(0, 0%, 0%, 0.80);
--tp-container-background-color: hsla(0, 0%, 0%, 0.30);
--tp-container-background-color-active: hsla(0, 0%, 0%, 0.60);
--tp-container-background-color-focus: hsla(0, 0%, 0%, 0.50);
--tp-container-background-color-hover: hsla(0, 0%, 0%, 0.40);
--tp-container-foreground-color: hsla(0, 0%, 100%, 0.50);
--tp-groove-foreground-color: hsla(0, 0%, 0%, 0.20);
--tp-input-background-color: hsla(0, 0%, 0%, 0.30);
--tp-input-background-color-active: hsla(0, 0%, 0%, 0.60);
--tp-input-background-color-focus: hsla(0, 0%, 0%, 0.50);
--tp-input-background-color-hover: hsla(0, 0%, 0%, 0.40);
--tp-input-foreground-color: hsla(0, 0%, 100%, 0.50);
--tp-label-foreground-color: hsla(0, 0%, 100%, 0.50);
--tp-monitor-background-color: hsla(0, 0%, 0%, 0.30);
--tp-monitor-foreground-color: hsla(0, 0%, 100%, 0.30);`; break;
        case ( "statefarmerTheme" ):
            rootTheme = `
--tp-base-background-color: hsla(0, 80%, 40%, 1.00);
--tp-base-shadow-color: hsla(0, 0%, 0%, 0.2);
--tp-button-background-color: hsla(0, 0%, 100%, 1.00);
--tp-button-background-color-active: hsla(0, 0%, 85%, 1.00);
--tp-button-background-color-focus: hsla(0, 0%, 90%, 1.00);
--tp-button-background-color-hover: hsla(0, 0%, 95%, 1.00);
--tp-button-foreground-color: hsla(230, 20%, 11%, 1.00);
--tp-container-background-color: hsla(0, 0%, 0%, 0.20);
--tp-container-background-color-active: hsla(0, 0%, 0%, 0.35);
--tp-container-background-color-focus: hsla(0, 0%, 0%, 0.30);
--tp-container-background-color-hover: hsla(0, 0%, 0%, 0.25);
--tp-container-foreground-color: hsla(0, 0%, 100%, 0.90);
--tp-groove-foreground-color: hsla(0, 0%, 0%, 0.50);
--tp-input-background-color: hsla(0, 0%, 0%, 0.50);
--tp-input-background-color-active: hsla(0, 0%, 0%, 0.65);
--tp-input-background-color-focus: hsla(0, 0%, 0%, 0.60);
--tp-input-background-color-hover: hsla(0, 0%, 0%, 0.55);
--tp-input-foreground-color: hsla(0, 0%, 100%, 0.90);
--tp-label-foreground-color: hsla(0, 0%, 100%, 0.90);
--tp-monitor-background-color: hsla(0, 0%, 0%, 0.50);
--tp-monitor-foreground-color: hsla(0, 0%, 100%, 0.50);`; break;
        }

        //menu customisation (apply font, button widths, adjust checkbox right slightly, make menu appear on top, add anim to message)
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            :root { ${rootTheme} }
        `;
        document.head.appendChild(styleElement);
    };
    //1337 H4X
    const hexToRgb = function (hex) {
        // Remove the hash sign, if present
        hex = hex.replace(/^#/, '');

        // Parse the hexadecimal value into RGB components
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;

        // Normalize the values to the range [0, 1]
        return [r / 255, g / 255, b / 255];
    };
    const fadeBetweenColors = function (color1, color2, progress) {
        const rgb1 = hexToRgb(color1);
        const rgb2 = hexToRgb(color2);
        const resultRgb = [
            rgb1[0] + (rgb2[0] - rgb1[0]) * progress,
            rgb1[1] + (rgb2[1] - rgb1[1]) * progress,
            rgb1[2] + (rgb2[2] - rgb1[2]) * progress
        ];
        return resultRgb;
    };
    const distancePlayers = function (yourPlayer,player) {
        return Math.hypot(player.x-yourPlayer.x,player.y-yourPlayer.y,player.z-yourPlayer.z ); //pythagoras' theorem in 3 dimensions. no one owns maths, zert.
    };
    const setPrecision = function (value) { return Math.floor(value * 8192) / 8192 }; //required precision
    const calculateYaw = function (pos) {
        return setPrecision(Math.mod(Math.atan2(pos.x,pos.z), Math.PI2));
    };
    const calculatePitch = function (pos) {
        return setPrecision(-Math.atan2(pos.y,Math.hypot(pos.x,pos.z))%1.5);
    };
    const isPartialMatch = function (array, searchString) {
        return array.some(item => searchString.toLowerCase().includes(item.toLowerCase()));
    };
    const radianAngleDiff = function (angle1,angle2) {
        const fullCircle = 2 * Math.PI;

        // Normalize angles to be within [0, 2π)
        angle1 = (angle1 % fullCircle + fullCircle) % fullCircle;
        angle2 = (angle2 % fullCircle + fullCircle) % fullCircle;

        // Find the absolute angular difference
        let diff = Math.abs(angle1 - angle2);

        // Ensure the difference is within [0, π)
        diff = Math.min(diff, fullCircle - diff);

        // Determine the sign of the difference correctly
        if ((angle1 - angle2 + fullCircle) % fullCircle > Math.PI) {
            return -diff;
        } else {
            return diff;
        }
    };
    const processChatItem = function (ss,text,playerName,playerTeam,highlightColor) {
        let chatItem = document.createElement("div");
        let playerNameSpan = document.createElement("span");
        let playerInfoContainer = document.createElement("div");
        let serverIcon = document.createElement("i");

        chatItem.classList.add("chat-item");
        playerInfoContainer.style.display = "inline-block";

        playerNameSpan.classList.add("chat-player-name", "ss_marginright_xs");
        playerNameSpan.textContent = playerName + " ";

        playerInfoContainer.style.color = ss.teamColors.text[playerTeam];
        playerInfoContainer.appendChild(serverIcon);
        playerInfoContainer.appendChild(playerNameSpan);

        let messageSpan = document.createElement("span");
        messageSpan.innerHTML = text;
        chatItem.style.fontStyle = "italic";
        messageSpan.style.backgroundColor = highlightColor;
        playerInfoContainer.style.backgroundColor = highlightColor;

        chatItem.appendChild(playerInfoContainer);
        chatItem.appendChild(messageSpan);

        document.getElementById("chatOut").appendChild(chatItem);

        if (document.querySelector(".chat-container")) {
            document.querySelector(".chat-container").scrollTop = document.querySelector(".chat-container").scrollHeight;
        };
    };
    const updateOrCreateLinesESP = function (ss,object,type,color) {
        let newPosition,newScene,newParent
        if (type=="playerESP") {
            newPosition = object.actor.mesh.position;
            newScene    = object.actor.scene;
            newParent   = object.actor.mesh;
        } else {
            newPosition = object.position;
            newScene    = object._scene;
            newParent   = object;
        };
        if (!object.generatedESP) {
            //tracers
            const tracerLines = ss.BABYLON.MeshBuilder.CreateLines("tracerLines", { points: [newPosition, crosshairsPosition] }, newScene);
            tracerLines.color=new ss.BABYLON.Color3(1, 1, 1);
            tracerLines.renderingGroupId=1;
            object.tracerLines = tracerLines;
            //ESP
            const boxMaterial = new ss.BABYLON.StandardMaterial('boxMaterial', newScene);
            boxMaterial.emissiveColor = boxMaterial.diffuseColor = new ss.BABYLON.Color3(1, 0, 0);
            boxMaterial.wireframe = true;
            const boxSize = {
                playerESP: {width:0.5,height:0.75,depth:0.5},
                ammoESP: {width: 0.25, height: 0.35, depth: 0.25},
            }
            const box = ss.BABYLON.MeshBuilder.CreateBox('box',  boxSize[type] , newScene);
            const boxOffset = {
                playerESP: 0.3,
                ammoESP: 0,
            }
            box.position.y=boxOffset[type];
            box.material = boxMaterial;
            box.renderingGroupId = 1;
            box.parent = newParent;
            object.box = box;
            //stuff
            object.generatedESP=true;
            ESPArray.push([tracerLines,box,object]);
        };
        object.tracerLines.setVerticesData(ss.BABYLON.VertexBuffer.PositionKind, [crosshairsPosition.x, crosshairsPosition.y, crosshairsPosition.z, newPosition.x, newPosition.y, newPosition.z]);
        object.tracerLines.color = new ss.BABYLON.Color3(...color);
        const boxMaterial = object.box.material;
        boxMaterial.emissiveColor = boxMaterial.diffuseColor = new ss.BABYLON.Color3(...color);
    };
    const everySecond = function () {
        coordElement.style.display = 'none';
        playerstatsElement.style.display = 'none';
        redCircle.style.display = 'none';
        allFolders.forEach(function (name) {
            localStorage.setItem(name,JSON.stringify(tp[name].expanded));
        });
        if (extract("antiAFK")) {
            if (Date.now()>(lastAntiAFKMessage+270000)) {
                sendChatMessage("Anti AFK Message. Censored Words: DATE, SUCK");
                lastAntiAFKMessage=Date.now();
            };
        };
        addStreamsToInGameUI();
        //block ads kek
        localStorage.timesPlayed = 0;
    };
    const updateConfig = function () {
        config=tp.pane.exportPreset();
    };
    const sendChatMessage = function (text) { //basic method (simulates legit method of sending message)
        chatThing=document.getElementById('chatIn');
        if (chatThing) {
            extern.startChat();
            chatThing.value=text;
            chatThing.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true,
            }))
        };
    };
    const addStreamsToInGameUI = function () {
        let inGameUIElement = document.getElementById("inGameUI");
        let streams = document.getElementById("stream_scroll").children;
        if ( inGameUIElement && streams.length > 0) {
            for (let i = 0; i < streams.length; i++) {
                let hrefValue = streams[i].querySelector('a').href;
                let nameValue = streams[i].querySelector(".stream_name").textContent;
                const streamElement = inGameUIElement.querySelector('div[data-name="' + nameValue + '"]');
                if (extract("showStreams") && !streamElement) {
                    let containerDiv = document.createElement("div");
                    let nameDiv = document.createElement("div");
                    nameDiv.textContent = nameValue;
                    nameDiv.setAttribute('data-href', hrefValue);
                    nameDiv.style.color = 'white';
                    nameDiv.style.cursor = 'pointer';
                    nameDiv.style.textDecoration = 'none';
                    nameDiv.addEventListener('mouseover', function() { nameDiv.style.textDecoration = 'underline'; nameDiv.style.color = 'blue' });
                    nameDiv.addEventListener('mouseout', function() { nameDiv.style.textDecoration = 'none'; nameDiv.style.color = 'white' });
                    nameDiv.addEventListener('click', function() { window.open(hrefValue, '_blank'); });
                    containerDiv.setAttribute('data-name', nameValue);
                    containerDiv.appendChild(nameDiv);
                    containerDiv.appendChild(nameDiv);
                    inGameUIElement.appendChild(containerDiv);
                } else if (!extract("showStreams") && streamElement) {
                    inGameUIElement.removeChild(streamElement);
                };
            };
        };
    };
    const highlightCurrentlyTargeting = function (currentlyTargeting, players) {
        let playerArray = [];
        for (let i=0;i<players.length; i++)
        {
        player = players[ i ];
            if ( player && player !== currentlyTargeting && player.playing && ( currentlyTargeting.team === 0 || player.team !== currentlyTargeting.team ) ) {
                const uniqueId = player.uniqueId;
                const name = player.name;
                const hp = player.hp
                playerArray.push({ player, uniqueId, name, hp });
            };
        };
        let playerList = document.getElementById("playerList").children;
        for (let i = 0; i < playerList.length; i++) {
            if (currentlyTargeting?.playing && currentlyTargeting?.name === playerList[i].textContent.slice(0, -3))//need to slice otherwise won't match properly
            {
                playerList[i].style.backgroundColor = 'blue';
            }
            else{playerList[i].style.backgroundColor = '';}
            console.log(playerArray.find(player => player.name === playerList[i].textContent.slice(0, -3))?.hp);
        };
    };
    const highlightCrossHairReticleDot = function (ss, bool) {
        let dot = document.getElementById("reticleDot");
        let crosshair = document.getElementById("crosshairContainer");
        if (bool){
            let isAmmoFull = ss.yourPlayer.weapon.ammo.rounds === ss.yourPlayer.weapon.ammo.capacity
            dot.style.backgroundColor = isAmmoFull ? 'blue' : '';
            for(let i=0;i<crosshair.children.length;i++){
                crosshair.children[i].style.backgroundColor = isAmmoFull ? 'blue' : '';
                crosshair.children[i].style.padding = isAmmoFull ? '2px' : '';
            };
        } else {
            dot.style.backgroundColor = '';
            dot.style.padding = '';
            for(let i=0;i<crosshair.children.length;i++){
                crosshair.children[i].style.backgroundColor = '';
                crosshair.children[i].style.padding = '';
            };
        };
    };
    const constructChatPacket = function (str) {
        if (str.length > 255) {
            console.log('%c UH OH UR PACKET IS TOO LONG!!!!', css);
            str.length = 255;
        };

        var arr = new Uint8Array(2 * str.length + 2);
        arr[0] = 4;
        arr[1] = str.length;

        for (var i = 0; i < str.length; i++) {
            arr[2 * i + 2] = str[i].charCodeAt(0) & 255;
            arr[2 * i + 3] = str[i].charCodeAt(0) >> 8 & 255; // ripped straight outta packInt16
        };
        //console.log(arr);
        return arr.buffer;
    };
    
    const extractChatPacket = function (packet) {
        if (!(packet instanceof ArrayBuffer)) {
            var pack_arr = new Uint8Array(packet);
        } else {
            var pack_arr = packet;
        }

        var str = "";

        for (var i = 0; i < pack_arr[1]; i++) {
            str += String.fromCharCode(pack_arr[2 * i + 2] + (pack_arr[2 * i + 3] << 8)); // ripped straight outta unpackInt16 (thanks github copilot)
        }

        return str;

        
    }

    const reverse_string = function (str) {
        return str.split("").reverse().join("");
    }

    const UNICODE_RTL_OVERRIDE = '\u202e'

    const chatPacketHandler = function (packet) {
        if (extract("chatFilterBypass")) {
            string = extractChatPacket(packet);
            new_str = ([UNICODE_RTL_OVERRIDE,].concat(reverse_string(string).split(""))).join("");
            var constructed =  constructChatPacket(new_str);
            console.log('%c Chat packet sent: original str %s, reversed %s, list %s', css, string, reverse_string(string), new_str);
            return constructed;
        }
        
        return packet;  
    }

    const modifyPacket = function (data) {
        if (data instanceof String) { // avoid server comm, ping, etc. necessary to load
            return data;
        };

        if (data.byteLength == 0) {
            return data;
        };

        var arr = new Uint8Array(data);

        if (arr[0] == 49) { // comm code 49 = client to server grenade throw
            if (extract("grenadeMax")) {
                arr[1] = 255;
                return arr.buffer;
                console.log("StateFarm: modified a grenade packet to be at full power");
            } else {
                console.log("StateFarm: didn't modify grenade packet")
            };
        } else if (arr[0] == 4) {
            console.log('%c Chat packet sent, chat handler!!!', css);
            return chatPacketHandler(data);
        } else {

        };

        return data;
    };
    const is39Packet = function (packetData) { // packet only sent if we are in-game
        if (packetData instanceof String) { // avoid server comm, ping, etc. necessary to load
            return false;
        };

        if (packetData.byteLength == 0) {
            return false;
        };

        var arr = new Uint8Array(packetData);
        return arr[0] == 39;
    };
    const ghostSpamToggle = function () {}
    ghostSpamToggle.enabled = false;
    WebSocket.prototype._send = WebSocket.prototype.send;
    WebSocket.prototype.send = function (data) {

        var modified = modifyPacket(data);
        this._send(modified);

        if (is39Packet(data) && ghostSpamToggle.enabled) {
            for (var i = 0; i < 5; i++) {
                this._send(constructChatPacket("spammeroonie number #" + new Date().getTime() % 1000));
            }
        }
    };
    const predictBloom = function(ss,yaw,pitch) { //outputs the difference in yaw/pitch from the bloom
        let seed = ss.yourPlayer.randomGen.seed;
        let numbers = [];
        const accuracy=ss.yourPlayer.weapon.accuracy;
        for (var i = 0; i < 3; i++) { //generate from seed the values used to scatter shot
            seed = (seed * 9301 + 49297) % 233280;
            numbers.push(((seed/233280)-0.5)*accuracy);
        };
        const predictedYaw=(yaw-yawDiff)%(Math.PI*2)
        const predictedPitch=Math.min(Math.max(pitch-pitchDiff,-1.5),1.5);
        const range = ss.weapons.classes[ss.yourPlayer.primaryWeaponItem.exclusive_for_class].weapon.range;
        const playerYPRMatrixThing = ss.BABYLON.Matrix.RotationYawPitchRoll(predictedYaw, predictedPitch, 0);
        const rangeMatrixThing = ss.BABYLON.Matrix.Translation(0, 0, range);
        const playerAndRangeMatrix = rangeMatrixThing.multiply(playerYPRMatrixThing);
        const bloomMatrix = ss.BABYLON.Matrix.RotationYawPitchRoll(numbers[0],numbers[1],numbers[2]);
        const finalBulletMatrix = playerAndRangeMatrix.multiply(bloomMatrix);
        const finalBulletTranslation = finalBulletMatrix.getTranslation();
        const bulletYaw = calculateYaw(finalBulletTranslation);
        const bulletPitch = calculatePitch(finalBulletTranslation);
        const yawBulletDiff = radianAngleDiff(yaw,bulletYaw)
        const pitchBulletDiff = radianAngleDiff(pitch,bulletPitch)
        //console.log("current accuracy: ",accuracy)
        //console.log("input yaw: ",yaw)
        //console.log("input pitch: ",pitch)
        //console.log("diff yaw/pitch",yawDiff,pitchDiff)
        //console.log("predicted yaw/pitch",predictedYaw,predictedPitch)
        //console.log("calculated bullet yaw: ",bulletYaw)
        //console.log("calculated bullet pitch: ",bulletPitch)
        //console.log("therefore yaw diff: ",yawBulletDiff)
        //console.log("therefore pitch diff: ",pitchBulletDiff)

        return [yawBulletDiff,pitchBulletDiff];
    };
    const injectScript = function () {
        window.fixCamera = function () {
            return isKeyToggled[bindsArray.zoom] && (extract("zoom")*(Math.PI / 180)) || (extract("fov")*(Math.PI/180)) || 1.25;
        };
        window.getChatLimit = function () {
            return (extract("chatExtend")&&999999)||4;
        };
        window.getDisableChatFilter = function () {
            return extract("disableChatFilter");
        };
        window.getSkinHack = function () {
            return extract("unlockSkins");
        };
        window.beforeFiring = function (yourPlayer) { //i kept this here, but do not use this. the delay is usually too great to do some kind of secret fire
            // yourPlayer.yaw=1;
            return;
        };
        class ModifiedXMLHttpRequest extends window.XMLHttpRequest {
            open(method, url) {
                if (url.includes('shellshock.js')) {
                    this.isCorrectJS = true;
                }
                return super.open(...arguments);
            }
            get response() {
                if (this.isCorrectJS) {
                    let code = super.response;
                    const allFuncName={};
                    let injectionString="";
                    let match;
                    const getVarName = function (name, regexPattern) {
                        console.log(1, name, regexPattern);
                        const regex = new RegExp(regexPattern);
                        const funcName = eval(`${regex}.exec(code)[1]`);
                        allFuncName[name] = funcName;
                        console.log(2, allFuncName);
                        injectionString = injectionString + name + ": " + funcName + ",";
                        console.log(3, injectionString);
                    };
                    try {
                        getVarName("BABYLON", ';([a-zA-Z]+)\\.TransformNode\\.prototype\\.setVisible'); //done
                        getVarName("players", '=([a-zA-Z]+)\\[this\\.controlledBy\\]'); //done
                        getVarName("yourPlayer", '&&([a-zA-Z]+)\\.grenadeCountdown<=0\\)this\\.cancelGrenade'); //done
                        getVarName("weapons", ';([a-zA-Z]+)\\.classes=\\[\\{name:"Soldier"');
                        // getVarName("game", 'packInt8\\(([a-zA-Z]+)\\.explode\\),');
                        getVarName("renderList", '&&([a-zA-Z]+\\.getShadowMap\\(\\)\\.renderList)');
                        getVarName("gameMap", '>=([a-zA-Z]+)\\.height&&\\(this\\.climbing=!1\\)');
                        getVarName("teamColors", '\\{([a-zA-Z_$]+)\\.themClass\\[');
                        getVarName("camera", ',([a-zA-Z_$]+)=new T\\.TargetCamera\\("camera"');
                        getVarName("rays", '\\.25\\),([a-zA-Z_$]+)\\.rayCollidesWithPlayer');
                        // getVarName("vs", '(vs)'); //todo
                        // getVarName("switchTeam", 'switchTeam:([a-zA-Z]+),onChatKeyDown');

                        showMsg("Script injected!","success")
                    } catch (err) {
                        showMsg("Error! Scipt injection failed! See console.","error")
                        alert( 'Oh bollocks! Looks like the script is out of date. Report this data to the original developers and any errors in the console.\n' + JSON.stringify( allFuncName, undefined, 2 ) );
                        console.log(err);
                        return code;
                    };
                    console.log("Variable retrieval successful!")
                    //hook for main loop function in render loop
                    match=code.match(/\.engine\.runRenderLoop\(function\(\)\{([a-zA-Z]+)\(/);
                    code = code.replace(`\.engine\.runRenderLoop\(function\(\)\{${match[1]}\(`,`.engine.runRenderLoop(function (){${match[1]}(),window["${mainLoopFunction}"]({${injectionString}}`);
                    //hook for modifications just before firing
                    code = code.replace('fire(){var','fire(){window.beforeFiring(this.player);var');
                    //hook for fov mods
                    code = code.replace(/\.fov\s*=\s*1\.25/g, '.fov = window.fixCamera()');
                    code = code.replace(/\.fov\s*\+\s*\(1\.25/g, '.fov + (window.fixCamera()');
                    //stop removal of objects
                    match=code.match(/playing&&!([a-zA-Z]+)&&/);
                    code = code.replace(`if(${match[1]})`,`if(true)`);
                    //chat mods: disable chat culling
                    const somethingLength=/\.length>4&&([a-zA-Z]+)\[0\]\.remove\(\),/.exec(code)[1];
                    code = code.replace(new RegExp(`\\.length>4&&${somethingLength}\\[0\\]\\.remove\\(\\),`),`.length>window.getChatLimit()&&${somethingLength}[0].remove(),`);
                    //chat mods: disable filter (credit to A3+++ for this finding)
                    const filterFunction=/\|\|([a-zA-Z]+)\([a-zA-Z]+.normalName/.exec(code)[1];
                    const thingInsideFilterFunction=new RegExp(`!${filterFunction}\\(([a-zA-Z]+)\\)`).exec(code)[1];
                    code = code.replace(`!${filterFunction}(${thingInsideFilterFunction})`,`((!${filterFunction}(${thingInsideFilterFunction}))||window.getDisableChatFilter())`);
                    //chat mods: make filtered text red
                    const [_, elm, str] = code.match(/.remove\(\),([a-zA-Z]+).innerHTML=([a-zA-Z]+)/);
                    code = code.replace(_, _ + `,${filterFunction}(${str})&&!arguments[2]&&(${elm}.style.color="red")`);
                    //skins
                    match = code.match(/inventory\[[A-z]\].id===[A-z].id\)return!0;return!1/);
                    if (match) code = code.replace(match[0], match[0] + `||window.getSkinHack()`);
                    //reset join/leave msgs
                    code = code.replace(',console.log("joinGame()',',window.newGame=true,console.log("value changed, also joinGame()');



                    //replace graveyard:

                    //trajectories
                    //bullet debugging
                    code = code.replace('.bulletPool.retrieve();i.fireThis(t,f,c,r)',`.bulletPool.retrieve();i.fireThis(t,f,c,r);
                    //console.log("##################################################");
                    //console.log("______PLAYER FIRED FUNCTION");
                    //console.log("Player Name: ",t.name);
                    //console.log("Actual Bullet Yaw: ",Math.radAdd(Math.atan2(c.x, c.z), 0));
                    //console.log("Actual Bullet Pitch: ",-Math.atan2(c.y, Math.hypot(c.x, c.z)) % 1.5);
                `);
                    code = code.replace('var s=n.getTranslation();',`var s=n.getTranslation();
                    console.log("##################################################");
                    console.log("______IN FIRE FUNCTION");
                    console.log("Range Number: ",this.constructor.range);
                    console.log("Accuracy: ",this.accuracy);
                    console.log("Yaw/Pitch: ",this.player.yaw, this.player.pitch);
                    console.log("Actual Bullet Yaw: ",Math.radAdd(Math.atan2(a.x, a.z), 0));
                    console.log("Actual Bullet Pitch: ",-Math.atan2(a.y, Math.hypot(a.x, a.z)) % 1.5);
                `);
                    // code = code.replace('this.actor.fire(),this.fireMunitions','console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");console.log(r);var yaw = Math.atan2(r[4], r.elements[0]);var pitch = Math.asin(-r.elements[8]);console.log("Final Yaw/Pitch:", [yaw, pitch].map(angle => angle * (180 / Math.PI)));this.actor.fire(),this.fireMunitions');
                    // code = code.replace('var o=Ce.getBuffer()',';console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA");console.log(s);var o=Ce.getBuffer()');
                    // code = code.replace('var c=this.seed/233280','var c=this.seed/233280;console.log(c)');
                    // code = code.replace('let i=this.accuracy','let i=0');
                    // code = code.replace('T.Matrix.RotationYawPitchRoll((this.player.randomGen.getFloat()-.5)*l,(this.player.randomGen.getFloat()-.5)*l,(this.player.randomGen.getFloat()-.5)*l)','T.Matrix.RotationYawPitchRoll(-0.5*l,-0.5*l,0)');
                    // code = code.replace('a=0;a<20;a++','a=0;a<200;a++');
                    // code = code.replace("this.grenadeThrowPower=Math.clamp(t,0,1),","this.grenadeThrowPower=Math.clamp(t,0,1),console.log('hello',this.grenadeThrowPower),");
                    // code = code.replace("s.packFloat(a.x)","s.packFloat(a.x),console.log('hello2',this.grenadeThrowPower,n,r,a)");
                    //disable autopause
                    // code = code.replace('&&(Li=null,Ue=0,q.controlKeys=0,q.releaseTrigger(),setTimeout(()=>{var f=Ce.getBuffer();f.packInt8(he.pause),f.send(we),q.resetCountdowns();let c=Gr&&!O.productBlockAds&&!pokiActive?10:5;ro(c)},100),ci=!0,vueApp.statsLoading(),Ei.set(function (){q.removeFromPlay(),as()},3e3),Sn!==void 0&&Tn!==void 0&&(aiptag=Sn,aipDisplay=Tn),console.log("pausing game via pointerlock exit"),to(),Nh(),crazyGamesActive&&crazysdk.gameplayStop())', '');
                    //safe unfocus
                    // code = code.replace('document.onpointerlockchange', 'document.dopausingstuff');
                    // code = code.replace(',document.exitPointerLock())', ',document.exitPointerLock(),document.dopausingstuff())');
                    // code = code.replace(',document.exitPointerLock())', ',document.exitPointerLock(),document.dopausingstuff())');
                    // code = code.replace(',document.exitPointerLock())', ',document.exitPointerLock(),document.dopausingstuff())');
                    // code = code.replace(',xc("down")', '');
                    //adblock/vip spoof
                    // code = code.replace(/z\.isUpgraded\(\)/g,'true');
                    // code = code.replace(/aipAPItag\.sdkBlocked/g,'false');
                    // code = code.replace(/this\.adBlockerDetected\(\)/,'false');

                    console.log("Code replacements successful!")
                    console.log(code)
                    return code
                };
                return super.response;
            };
        };
        window.XMLHttpRequest = ModifiedXMLHttpRequest;
    };

    JSON.safeStringify = (obj, indent = 2) => {
        let cache = [];
        const retVal = JSON.stringify(
          obj,
          (key, value) =>
            typeof value === "object" && value !== null
              ? cache.includes(value)
                ? undefined // Duplicate reference found, discard key
                : cache.push(value) && value // Store value in our collection
              : value,
          indent
        );
        cache = null;
        return retVal;
      };

    function loggedGameMap() {}
    loggedGameMap.logged = false;

    const mainLoop = function () {
        const oneTime = function (ss) {
            crosshairsPosition=new ss.BABYLON.Vector3();
            Object.defineProperty(ss.yourPlayer.scene, 'forceWireframe',  {
                get: () => {
                    return extract("wireframe");
                }
            });
            ranOneTime=true;
        };
        const initVars = function (ss) {
            if (window.newGame) {
                onlinePlayersArray=[];
            };
            if (!loggedGameMap.logged) {
                console.log(ss.gameMap.width, ss.gameMap.height, ss.gameMap.data);
                loggedGameMap.logged = true;
            };

            crosshairsPosition.copyFrom(ss.yourPlayer.actor.mesh.position);
            const horizontalOffset = Math.sin(ss.yourPlayer.actor.mesh.rotation.y);
            const verticalOffset = Math.sin(-ss.yourPlayer.pitch);
            crosshairsPosition.x += horizontalOffset;
            crosshairsPosition.z += Math.cos(ss.yourPlayer.actor.mesh.rotation.y);
            crosshairsPosition.y += verticalOffset + 0.4;

            ammo=ss.yourPlayer.weapon.ammo;

            whitelistPlayers=extract("whitelist").split(',');
            blacklistPlayers=extract("blacklist").split(',');

            const weaponBox = document.getElementById("weaponBox");
            const chatContainer = document.getElementById('chatOut');
            const chatItems = chatContainer.getElementsByClassName('chat-item');
            if ((weaponBox.style.display!=lastWeaponBox)||(chatItems.length!=lastChatItemLength)) {
                lastWeaponBox=weaponBox.style.display;
                lastChatItemLength=chatItems.length;

                const maxChat = extract("maxChat");
                const maxMessages = (weaponBox.style.display === "block" && maxChat) || 9999999;

                const startIndex = Math.max(0, chatItems.length - maxMessages);

                for (let i = chatItems.length - 1; i >= 0; i--) {
                    const chatIndex = i - startIndex;
                    const isInRange = chatIndex >= 0 && chatIndex < maxMessages;
                    chatItems[i].style.display = isInRange ? '' : 'none';
                };
            };
            // accuracyDiff=ss.yourPlayer.weapon.accuracy-accuracy;
            yawDiff=radianAngleDiff(yawCache,ss.yourPlayer.yaw);
            pitchDiff=radianAngleDiff(pitchCache,ss.yourPlayer.pitch);
        };
        const updateLinesESP = function (ss) {
            const objExists=Date.now();

            //update playerESP boxes, tracer lines, colors
            if (extract("playerESP")||extract("tracers")||extract("chams")||extract("nametags")||extract("joinMessages")||extract("leaveMessages")) {
                for (let i=0; i<ss.players.length; i++) {
                    const player=ss.players[i];
                    if ( player && player !== ss.yourPlayer && ( ss.yourPlayer.team === 0 || player.team !== ss.yourPlayer.team ) ) {
                        const whitelisted=(extract("whitelistESPType")=="highlight"||!extract("enableWhitelistTracers")||isPartialMatch(whitelistPlayers,player.name));
                        const blacklisted=(extract("blacklistESPType")=="justexclude"&&extract("enableBlacklistTracers")&&isPartialMatch(blacklistPlayers,player.name));
                        const passedLists=whitelisted&&(!blacklisted);
                        const tracersType=extract("tracersType");

                        let color,progress;
                        if (extract("enableWhitelistTracers") && extract("whitelistESPType")=="highlight" && isPartialMatch(whitelistPlayers,player.name) ) {
                            color=hexToRgb(extract("whitelistColor"));
                        } else if (extract("enableBlacklistTracers") && extract("blacklistESPType")=="highlight" && isPartialMatch(blacklistPlayers,player.name) ) {
                            color=hexToRgb(extract("blacklistColor"));
                        } else if ( tracersType=="proximity" ) {
                            const distance = distancePlayers(ss.yourPlayer,player);
                            if (distance < extract("tracersColor1to2")) { //fade between first set
                                progress=(distance/extract("tracersColor1to2"));
                                color=fadeBetweenColors(extract("tracersColor1"),extract("tracersColor2"),progress);
                            } else if (distance < extract("tracersColor2to3")) { //fade between second set
                                progress=((distance-extract("tracersColor1to2"))/(extract("tracersColor2to3")-extract("tracersColor1to2")));
                                color=fadeBetweenColors(extract("tracersColor2"),extract("tracersColor3"),progress);
                            } else {
                                color=hexToRgb(extract("tracersColor3"));
                            };
                        } else if (tracersType=="static") {
                            color=hexToRgb(extract("tracersColor1"));
                        };

                        updateOrCreateLinesESP(ss,player,"playerESP",color);

                        player.tracerLines.visibility = player.playing && extract("tracers") && passedLists;
                        player.box.visibility = extract("playerESP") && passedLists;

                        if (player.actor){
                            eggSize=extract("eggSize")
                            player.actor.bodyMesh.scaling = {x:eggSize, y:eggSize, z:eggSize}
                        };

                        player.actor.bodyMesh.renderingGroupId = extract("chams") ? 1 : 0;

                        player.exists=objExists;
                    };
                    if (player) {
                        if (extract("nametags") && player.actor && player.actor.nameSprite) { //taken from shellshock.js, so var names are weird
                            player.actor.nameSprite._manager.renderingGroupId = 1;
                            player.actor.nameSprite.renderingGroupId = 1;
                            var h = Math.length3(player.x - ss.yourPlayer.x, player.y - ss.yourPlayer.y, player.z - ss.yourPlayer.z),
                            d = Math.pow(h, 1.25)*2;
                            player.actor.nameSprite.width = d / 10 + .6, player.actor.nameSprite.height = d / 20 + .3;
                            ss.yourPlayer.actor.scene.activeCamera.fov=0.75
                        };
                        if (!player.logged) {
                            player.logged=true;
                            if (extract("joinMessages") && (!window.newGame)) {
                                if (extract("publicBroadcast")) {
                                    sendChatMessage((extract("joinLeaveBranding") ? "[SFC] " : "")+player.name+" joined.")
                                } else {
                                    processChatItem(ss,"joined.",player.name,player.team,"rgba(0, 255, 0, 0.2)");
                                };
                            };
                            onlinePlayersArray.push([player,player.name,player.team]);
                        };
                        player.isOnline=objExists;
                    };
                };
                for ( let i=0;i<onlinePlayersArray.length;i++) {
                    if (onlinePlayersArray[i][0] && onlinePlayersArray[i][0].isOnline==objExists) { //player still online
                        onlinePlayersArray[i][2]=onlinePlayersArray[i][0].team;
                    } else {
                        if (extract("leaveMessages") && (!window.newGame)) {
                            if (extract("publicBroadcast")) {
                                sendChatMessage((extract("joinLeaveBranding") ? "[SFC] " : "")+onlinePlayersArray[i][1]+" left.")
                            } else {
                                processChatItem(ss,"left.",onlinePlayersArray[i][1],onlinePlayersArray[i][2],"rgba(255, 0, 0, 0.2)");
                            };
                        };
                        onlinePlayersArray.splice(i,1);
                    };
                };
            };
            //update ammoESP boxes, tracer lines, colors
            if (extract("ammoESP")||extract("ammoTracers")||extract("grenadeESP")||extract("grenadeTracers")) {
                for (let i=0; i<ss.renderList.length; i++) {
                    const item=ss.renderList[i];
                    if ( item._isEnabled && item.sourceMesh && item.sourceMesh.name && (item.sourceMesh.name=="grenadeItem" || item.sourceMesh.name=="ammo") ) { //this is what we want
                        const itemType=item.sourceMesh.name;
                        let color=itemType=="ammo" && extract("ammoESPColor") || extract("grenadeESPColor");
                        color = hexToRgb(color);

                        updateOrCreateLinesESP(ss,item,"ammoESP",color)

                        let willBeVisible=false;

                        if (itemType=="ammo") { //ammo
                            const regime=extract("ammoESPRegime");
                            if (regime=="whendepleted" && ammo.store==0) {
                                willBeVisible=true;
                            } else if (regime=="whenlow" && ammo.store<=ammo.capacity) {
                                willBeVisible=true;
                            } else if (regime=="belowmax" && ammo.store<ammo.storeMax) {
                                willBeVisible=true;
                            } else if (regime=="alwayson") {
                                willBeVisible=true;
                            };
                        } else { //grenades
                            const regime=extract("grenadeESPRegime");
                            if (regime=="whendepleted" && ss.yourPlayer.grenadeCount==0) {
                                willBeVisible=true;
                            } else if (regime=="whenlow" && ss.yourPlayer.grenadeCount<=1) {
                                willBeVisible=true;
                            } else if (regime=="belowmax" && ss.yourPlayer.grenadeCount<ss.yourPlayer.grenadeCapacity) {
                                willBeVisible=true;
                            } else if (regime=="alwayson") {
                                willBeVisible=true;
                            };
                        };

                        item.box.visibility = willBeVisible && (itemType=="ammo" && extract("ammoESP") || extract("grenadeESP"));
                        item.tracerLines.visibility = willBeVisible && (itemType=="ammo" && extract("ammoTracers") || extract("grenadeTracers"));

                        item.exists=objExists;
                    };
                };
            };
            for ( let i=0;i<ESPArray.length;i++) {
                if (ESPArray[i][2] && ESPArray[i][2].exists==objExists) { //obj still exists and still relevant
                    //do nothing, lol
                } else {
                    if (ESPArray[i][2]) { //obj still exists but no longer relevant
                        console.log( '%cRemoving tracer line due to irrelevant object', 'color: white; background: red' );
                        ESPArray[i][2].generatedESP=false;
                    } else { //obj no longer exists
                        console.log( '%cRemoving tracer line due to no longer exists', 'color: white; background: red' );
                    };
                    ESPArray[i][0].dispose();
                    ESPArray[i][1].dispose();
                    ESPArray.splice(i,1);
                };
            }; window.newGame=false;
        };
        window[mainLoopFunction] = function ( ss ) {
            if ( !ss.yourPlayer ) { return }; //injection fail
            if ( !ranOneTime ) { oneTime(ss) };
            initVars(ss);
            updateLinesESP(ss);
            if ( extract("freecam") ) {
                ss.yourPlayer.actor.mesh.position.y = ss.yourPlayer.actor.mesh.position.y + 1;
            };

            if ( extract("spamChat") ) {
                if (Date.now()>(lastSpamMessage+extract("spamChatDelay"))) {
                    sendChatMessage(extract("spamChatText")+(Date.now().toString()).substring((Date.now().toString()).length - 3));
                    lastSpamMessage=Date.now()
                };
            };

            if ( extract("showCoordinates") ) {
                const fonx = Number((ss.yourPlayer.actor.mesh.position.x).toFixed(3));
                const fony = Number((ss.yourPlayer.actor.mesh.position.y).toFixed(3));
                const fonz = Number((ss.yourPlayer.actor.mesh.position.z).toFixed(3));
                const yaw = Number((ss.yourPlayer.yaw).toFixed(3));
                const pitch = Number((ss.yourPlayer.pitch).toFixed(3));
                const personalCoordinate = `XYZ: ${fonx}, ${fony}, ${fonz} Rot: ${yaw}, ${pitch}`;
                coordElement.innerText = personalCoordinate;
                void coordElement.offsetWidth;
                coordElement.style.display = '';
            };
            if (extract("playerStats")) {
                let playerStates="";
                for ( let i = 0; i < ss.players.length; i ++ ) {
                    const player = ss.players[i];
                    globalPlayer=ss;
                    if ( player && player !== ss.yourPlayer && player.playing && ( ss.yourPlayer.team === 0 || player.team !== ss.yourPlayer.team ) ) {
                        playerStates=playerStates+player.name+": "+Math.round(player.hp)+" HP\n";
                    };
                };
                if (playerStates=="") {playerStates="No Enemy Players"};
                playerstatsElement.innerText = playerStates;
                void playerstatsElement.offsetWidth;
                playerstatsElement.style.display = '';
            };

            if ( extract("chatHighlight") ) {
                document.getElementById("chatOut").style.userSelect="text"
            };
            if ( extract("autoRefill") ) {
                if (ammo.rounds==0) {
                    ss.yourPlayer.reload();
                };
            };
            if (extract("holdToFire") && isLeftButtonDown) {
                ss.yourPlayer.pullTrigger();
            };
            if (extract("revealBloom")) {
                redCircle.style.display='';
                const distCenterToOuter = 2 * (200 / ss.camera.fov);
                const bloomValues=predictBloom(ss,ss.yourPlayer.yaw,ss.yourPlayer.pitch);
                // Set the new position of the circle
                const centerX = (window.innerWidth / 2);
                const centerY = (window.innerHeight / 2);
                const offsettedX = centerX + (2 * distCenterToOuter * bloomValues[0]);
                const offsettedY = centerY + (2 * distCenterToOuter * bloomValues[1]);
                redCircle.style.bottom = offsettedY + 'px';
                redCircle.style.right = offsettedX + 'px';
            } else {
                redCircle.style.display='none';
            };
            let minimumDistance = Infinity;
            let nearestPlayer;
            let previousTarget=currentlyTargeting;
            if (extract("aimbot") && (extract("aimbotRightClick") ? isRightButtonDown : true) && ss.yourPlayer.playing) {
                if (!extract("antiSwitch") || !currentlyTargeting) {
                    currentlyTargeting=false
                    const targetType=extract("aimbotTargeting");
                    let minimumValue = 9999;
                    for (let i=0; i<ss.players.length; i++) {
                        const player = ss.players[i];
                        if (player && player !== ss.yourPlayer && player.playing && (ss.yourPlayer.team===0||player.team!==ss.yourPlayer.team) ) {
                            const whitelisted=(!extract("enableWhitelistAimbot")||extract("enableWhitelistAimbot")&&isPartialMatch(whitelistPlayers,player.name));
                            const blacklisted=(extract("enableBlacklistAimbot")&&isPartialMatch(blacklistPlayers,player.name));
                            const passedLists=whitelisted&&(!blacklisted);
                            if (passedLists) {
                                const distance = distancePlayers(ss.yourPlayer,player);
                                if (distance < minimumValue) {
                                    minimumDistance = distance;
                                    nearestPlayer = player;
                                }
                                if (targetType=="nearest") {
                                    if ( distance < minimumValue ) {
                                        minimumValue = distance;
                                        currentlyTargeting = player;
                                    };
                                } else if (targetType=="pointingat") {
                                    // Calculate the direction vector pointing to the player
                                    const directionToPlayer = new ss.BABYLON.Vector3(
                                        player.actor.mesh.position.x - ss.yourPlayer.actor.mesh.position.x,
                                        player.actor.mesh.position.y - ss.yourPlayer.actor.mesh.position.y,
                                        player.actor.mesh.position.z - ss.yourPlayer.actor.mesh.position.z
                                    );
                                    // Calculate the angles between the direction vector and the player vector
                                    const angleYaw = calculateYaw(directionToPlayer);
                                    const anglePitch = calculatePitch(directionToPlayer);
                                    // Calculate the absolute angular difference
                                    const angleDifference = Math.abs(ss.yourPlayer.yaw - angleYaw) + Math.abs(ss.yourPlayer.pitch - anglePitch);
                                    if (angleDifference < minimumValue) {
                                        minimumValue = angleDifference;
                                        currentlyTargeting = player;
                                    };
                                };
                            };
                        };
                    };
                    highlightCurrentlyTargeting(currentlyTargeting, ss);
                    highlightCrossHairReticleDot(ss, true);
                };
                if ( currentlyTargeting && currentlyTargeting.playing ) { //found a target
                    let x = currentlyTargeting.x - ss.yourPlayer.x;
                    let y = currentlyTargeting.y - ss.yourPlayer.y;
                    let z = currentlyTargeting.z - ss.yourPlayer.z;
                    const bulletSpeed=ss.weapons.classes[ss.yourPlayer.primaryWeaponItem.exclusive_for_class].weapon.velocity;

                    if (extract("prediction")) {
                        const distanceBetweenPlayers = distancePlayers(ss.yourPlayer,currentlyTargeting);
                        const timeToReachTarget = distanceBetweenPlayers/bulletSpeed;
                        x += + (currentlyTargeting.dx - ss.yourPlayer.dx) * timeToReachTarget;
                        y += + (currentlyTargeting.dx - ss.yourPlayer.dx) * timeToReachTarget;
                        z += + (currentlyTargeting.dx - ss.yourPlayer.dx) * timeToReachTarget;
                    };

                    let finalYaw = calculateYaw({x: x,y: y,z: z});
                    let finalPitch = calculatePitch({x: x,y: y,z: z});

                    if (extract("antiBloom")) {
                        // const predictAccuracy = Math.min(Math.max(accuracy+(2*accuracyDiff),ss.yourPlayer.weapon.accuracyMin),ss.yourPlayer.weapon.accuracyMax);
                        const bloomValues=predictBloom(ss,finalYaw,finalPitch);
                        finalYaw  =finalYaw  +(bloomValues[0]);
                        finalPitch=finalPitch+(bloomValues[1]);
                    };

                    const antiSnap=1-(extract("aimbotAntiSnap")||0);

                    if (previousTarget!==currentlyTargeting) { targetingComplete=false };

                    function lerp(start, end, alpha, player) {
                        let value = (1 - alpha ) * start + alpha * end;
                        if ((Math.abs(end - start) < 0.1) || (targetingComplete)) {
                            value = end; targetingComplete=true;
                        };
                        return value
                    };

                    // Exponential lerp towards the target rotation
                    ss.yourPlayer.yaw = setPrecision(lerp(ss.yourPlayer.yaw, finalYaw, antiSnap));
                    ss.yourPlayer.pitch = setPrecision(lerp(ss.yourPlayer.pitch, finalPitch, antiSnap));
                    if (extract("antiSneak")!==0) {
                        let acceptableDistance = extract("antiSneak");
                        if ( minimumDistance < acceptableDistance) {
                            currentlyTargeting = nearestPlayer;
                            if (ammo.rounds === 0) { //basically after MAGDUMP, switch to pistol, if that is empty reload and keep shootin'
                                if (ss.yourPlayer.weaponIdx === 0){ss.yourPlayer.swapWeapon(1);}
                                else {ss.yourPlayer.reload();}
                            };
                            ss.yourPlayer.pullTrigger();
                            console.log("ANTISNEAK---->", nearestPlayer?.name, minimumDistance);
                        };
                    };

                    if (extract("tracers")) {
                        currentlyTargeting.tracerLines.color = new ss.BABYLON.Color3(...hexToRgb(extract("aimbotColor")));
                    };
                    if (extract("playerESP")) {
                        const boxMaterial = currentlyTargeting.box.material;
                        boxMaterial.emissiveColor = boxMaterial.diffuseColor = new ss.BABYLON.Color3(...hexToRgb(extract("aimbotColor")));
                    };
                    if (extract("autoFire")) {
                        if (ammo.capacity>0) {
                            ss.yourPlayer.pullTrigger();
                        } else {
                            ss.yourPlayer.melee();
                        };
                    };
                } else {
                    if (extract("oneKill")) {
                        currentlyTargeting="dead";
                    } else {
                        currentlyTargeting=false;
                    };
                };
            } else {
                currentlyTargeting=false;
                targetingComplete=false;
                if (!extract("aimbot")) {
                    highlightCrossHairReticleDot(ss, false);
                };
            };
            yawCache=ss.yourPlayer.yaw;
            pitchCache=ss.yourPlayer.pitch;
        };
    };

    var css = "text-shadow: -1px -1px hsl(0,100%,50%), 1px 1px hsl(5.4, 100%, 50%), 3px 2px hsl(10.8, 100%, 50%), 5px 3px hsl(16.2, 100%, 50%), 7px 4px hsl(21.6, 100%, 50%), 9px 5px hsl(27, 100%, 50%), 11px 6px hsl(32.4, 100%, 50%), 13px 7px hsl(37.8, 100%, 50%), 14px 8px hsl(43.2, 100%, 50%), 16px 9px hsl(48.6, 100%, 50%), 18px 10px hsl(54, 100%, 50%), 20px 11px hsl(59.4, 100%, 50%), 22px 12px hsl(64.8, 100%, 50%), 23px 13px hsl(70.2, 100%, 50%), 25px 14px hsl(75.6, 100%, 50%), 27px 15px hsl(81, 100%, 50%), 28px 16px hsl(86.4, 100%, 50%), 30px 17px hsl(91.8, 100%, 50%), 32px 18px hsl(97.2, 100%, 50%), 33px 19px hsl(102.6, 100%, 50%), 35px 20px hsl(108, 100%, 50%), 36px 21px hsl(113.4, 100%, 50%), 38px 22px hsl(118.8, 100%, 50%), 39px 23px hsl(124.2, 100%, 50%), 41px 24px hsl(129.6, 100%, 50%), 42px 25px hsl(135, 100%, 50%), 43px 26px hsl(140.4, 100%, 50%), 45px 27px hsl(145.8, 100%, 50%), 46px 28px hsl(151.2, 100%, 50%), 47px 29px hsl(156.6, 100%, 50%), 48px 30px hsl(162, 100%, 50%), 49px 31px hsl(167.4, 100%, 50%), 50px 32px hsl(172.8, 100%, 50%), 51px 33px hsl(178.2, 100%, 50%), 52px 34px hsl(183.6, 100%, 50%), 53px 35px hsl(189, 100%, 50%), 54px 36px hsl(194.4, 100%, 50%), 55px 37px hsl(199.8, 100%, 50%), 55px 38px hsl(205.2, 100%, 50%), 56px 39px hsl(210.6, 100%, 50%), 57px 40px hsl(216, 100%, 50%), 57px 41px hsl(221.4, 100%, 50%), 58px 42px hsl(226.8, 100%, 50%), 58px 43px hsl(232.2, 100%, 50%), 58px 44px hsl(237.6, 100%, 50%), 59px 45px hsl(243, 100%, 50%), 59px 46px hsl(248.4, 100%, 50%), 59px 47px hsl(253.8, 100%, 50%), 59px 48px hsl(259.2, 100%, 50%), 59px 49px hsl(264.6, 100%, 50%), 60px 50px hsl(270, 100%, 50%), 59px 51px hsl(275.4, 100%, 50%), 59px 52px hsl(280.8, 100%, 50%), 59px 53px hsl(286.2, 100%, 50%), 59px 54px hsl(291.6, 100%, 50%), 59px 55px hsl(297, 100%, 50%), 58px 56px hsl(302.4, 100%, 50%), 58px 57px hsl(307.8, 100%, 50%), 58px 58px hsl(313.2, 100%, 50%), 57px 59px hsl(318.6, 100%, 50%), 57px 60px hsl(324, 100%, 50%), 56px 61px hsl(329.4, 100%, 50%), 55px 62px hsl(334.8, 100%, 50%), 55px 63px hsl(340.2, 100%, 50%), 54px 64px hsl(345.6, 100%, 50%), 53px 65px hsl(351, 100%, 50%), 52px 66px hsl(356.4, 100%, 50%), 51px 67px hsl(361.8, 100%, 50%), 50px 68px hsl(367.2, 100%, 50%), 49px 69px hsl(372.6, 100%, 50%), 48px 70px hsl(378, 100%, 50%), 47px 71px hsl(383.4, 100%, 50%), 46px 72px hsl(388.8, 100%, 50%), 45px 73px hsl(394.2, 100%, 50%), 43px 74px hsl(399.6, 100%, 50%), 42px 75px hsl(405, 100%, 50%), 41px 76px hsl(410.4, 100%, 50%), 39px 77px hsl(415.8, 100%, 50%), 38px 78px hsl(421.2, 100%, 50%), 36px 79px hsl(426.6, 100%, 50%), 35px 80px hsl(432, 100%, 50%), 33px 81px hsl(437.4, 100%, 50%), 32px 82px hsl(442.8, 100%, 50%), 30px 83px hsl(448.2, 100%, 50%), 28px 84px hsl(453.6, 100%, 50%), 27px 85px hsl(459, 100%, 50%), 25px 86px hsl(464.4, 100%, 50%), 23px 87px hsl(469.8, 100%, 50%), 22px 88px hsl(475.2, 100%, 50%), 20px 89px hsl(480.6, 100%, 50%), 18px 90px hsl(486, 100%, 50%), 16px 91px hsl(491.4, 100%, 50%), 14px 92px hsl(496.8, 100%, 50%), 13px 93px hsl(502.2, 100%, 50%), 11px 94px hsl(507.6, 100%, 50%), 9px 95px hsl(513, 100%, 50%), 7px 96px hsl(518.4, 100%, 50%), 5px 97px hsl(523.8, 100%, 50%), 3px 98px hsl(529.2, 100%, 50%), 1px 99px hsl(534.6, 100%, 50%), 7px 100px hsl(540, 100%, 50%), -1px 101px hsl(545.4, 100%, 50%), -3px 102px hsl(550.8, 100%, 50%), -5px 103px hsl(556.2, 100%, 50%), -7px 104px hsl(561.6, 100%, 50%), -9px 105px hsl(567, 100%, 50%), -11px 106px hsl(572.4, 100%, 50%), -13px 107px hsl(577.8, 100%, 50%), -14px 108px hsl(583.2, 100%, 50%), -16px 109px hsl(588.6, 100%, 50%), -18px 110px hsl(594, 100%, 50%), -20px 111px hsl(599.4, 100%, 50%), -22px 112px hsl(604.8, 100%, 50%), -23px 113px hsl(610.2, 100%, 50%), -25px 114px hsl(615.6, 100%, 50%), -27px 115px hsl(621, 100%, 50%), -28px 116px hsl(626.4, 100%, 50%), -30px 117px hsl(631.8, 100%, 50%), -32px 118px hsl(637.2, 100%, 50%), -33px 119px hsl(642.6, 100%, 50%), -35px 120px hsl(648, 100%, 50%), -36px 121px hsl(653.4, 100%, 50%), -38px 122px hsl(658.8, 100%, 50%), -39px 123px hsl(664.2, 100%, 50%), -41px 124px hsl(669.6, 100%, 50%), -42px 125px hsl(675, 100%, 50%), -43px 126px hsl(680.4, 100%, 50%), -45px 127px hsl(685.8, 100%, 50%), -46px 128px hsl(691.2, 100%, 50%), -47px 129px hsl(696.6, 100%, 50%), -48px 130px hsl(702, 100%, 50%), -49px 131px hsl(707.4, 100%, 50%), -50px 132px hsl(712.8, 100%, 50%), -51px 133px hsl(718.2, 100%, 50%), -52px 134px hsl(723.6, 100%, 50%), -53px 135px hsl(729, 100%, 50%), -54px 136px hsl(734.4, 100%, 50%), -55px 137px hsl(739.8, 100%, 50%), -55px 138px hsl(745.2, 100%, 50%), -56px 139px hsl(750.6, 100%, 50%), -57px 140px hsl(756, 100%, 50%), -57px 141px hsl(761.4, 100%, 50%), -58px 142px hsl(766.8, 100%, 50%), -58px 143px hsl(772.2, 100%, 50%), -58px 144px hsl(777.6, 100%, 50%), -59px 145px hsl(783, 100%, 50%), -59px 146px hsl(788.4, 100%, 50%), -59px 147px hsl(793.8, 100%, 50%), -59px 148px hsl(799.2, 100%, 50%), -59px 149px hsl(804.6, 100%, 50%), -60px 150px hsl(810, 100%, 50%), -59px 151px hsl(815.4, 100%, 50%), -59px 152px hsl(820.8, 100%, 50%), -59px 153px hsl(826.2, 100%, 50%), -59px 154px hsl(831.6, 100%, 50%), -59px 155px hsl(837, 100%, 50%), -58px 156px hsl(842.4, 100%, 50%), -58px 157px hsl(847.8, 100%, 50%), -58px 158px hsl(853.2, 100%, 50%), -57px 159px hsl(858.6, 100%, 50%), -57px 160px hsl(864, 100%, 50%), -56px 161px hsl(869.4, 100%, 50%), -55px 162px hsl(874.8, 100%, 50%), -55px 163px hsl(880.2, 100%, 50%), -54px 164px hsl(885.6, 100%, 50%), -53px 165px hsl(891, 100%, 50%), -52px 166px hsl(896.4, 100%, 50%), -51px 167px hsl(901.8, 100%, 50%), -50px 168px hsl(907.2, 100%, 50%), -49px 169px hsl(912.6, 100%, 50%), -48px 170px hsl(918, 100%, 50%), -47px 171px hsl(923.4, 100%, 50%), -46px 172px hsl(928.8, 100%, 50%), -45px 173px hsl(934.2, 100%, 50%), -43px 174px hsl(939.6, 100%, 50%), -42px 175px hsl(945, 100%, 50%), -41px 176px hsl(950.4, 100%, 50%), -39px 177px hsl(955.8, 100%, 50%), -38px 178px hsl(961.2, 100%, 50%), -36px 179px hsl(966.6, 100%, 50%), -35px 180px hsl(972, 100%, 50%), -33px 181px hsl(977.4, 100%, 50%), -32px 182px hsl(982.8, 100%, 50%), -30px 183px hsl(988.2, 100%, 50%), -28px 184px hsl(993.6, 100%, 50%), -27px 185px hsl(999, 100%, 50%), -25px 186px hsl(1004.4, 100%, 50%), -23px 187px hsl(1009.8, 100%, 50%), -22px 188px hsl(1015.2, 100%, 50%), -20px 189px hsl(1020.6, 100%, 50%), -18px 190px hsl(1026, 100%, 50%), -16px 191px hsl(1031.4, 100%, 50%), -14px 192px hsl(1036.8, 100%, 50%), -13px 193px hsl(1042.2, 100%, 50%), -11px 194px hsl(1047.6, 100%, 50%), -9px 195px hsl(1053, 100%, 50%), -7px 196px hsl(1058.4, 100%, 50%), -5px 197px hsl(1063.8, 100%, 50%), -3px 198px hsl(1069.2, 100%, 50%), -1px 199px hsl(1074.6, 100%, 50%), -1px 200px hsl(1080, 100%, 50%), 1px 201px hsl(1085.4, 100%, 50%), 3px 202px hsl(1090.8, 100%, 50%), 5px 203px hsl(1096.2, 100%, 50%), 7px 204px hsl(1101.6, 100%, 50%), 9px 205px hsl(1107, 100%, 50%), 11px 206px hsl(1112.4, 100%, 50%), 13px 207px hsl(1117.8, 100%, 50%), 14px 208px hsl(1123.2, 100%, 50%), 16px 209px hsl(1128.6, 100%, 50%), 18px 210px hsl(1134, 100%, 50%), 20px 211px hsl(1139.4, 100%, 50%), 22px 212px hsl(1144.8, 100%, 50%), 23px 213px hsl(1150.2, 100%, 50%), 25px 214px hsl(1155.6, 100%, 50%), 27px 215px hsl(1161, 100%, 50%), 28px 216px hsl(1166.4, 100%, 50%), 30px 217px hsl(1171.8, 100%, 50%), 32px 218px hsl(1177.2, 100%, 50%), 33px 219px hsl(1182.6, 100%, 50%), 35px 220px hsl(1188, 100%, 50%), 36px 221px hsl(1193.4, 100%, 50%), 38px 222px hsl(1198.8, 100%, 50%), 39px 223px hsl(1204.2, 100%, 50%), 41px 224px hsl(1209.6, 100%, 50%), 42px 225px hsl(1215, 100%, 50%), 43px 226px hsl(1220.4, 100%, 50%), 45px 227px hsl(1225.8, 100%, 50%), 46px 228px hsl(1231.2, 100%, 50%), 47px 229px hsl(1236.6, 100%, 50%), 48px 230px hsl(1242, 100%, 50%), 49px 231px hsl(1247.4, 100%, 50%), 50px 232px hsl(1252.8, 100%, 50%), 51px 233px hsl(1258.2, 100%, 50%), 52px 234px hsl(1263.6, 100%, 50%), 53px 235px hsl(1269, 100%, 50%), 54px 236px hsl(1274.4, 100%, 50%), 55px 237px hsl(1279.8, 100%, 50%), 55px 238px hsl(1285.2, 100%, 50%), 56px 239px hsl(1290.6, 100%, 50%), 57px 240px hsl(1296, 100%, 50%), 57px 241px hsl(1301.4, 100%, 50%), 58px 242px hsl(1306.8, 100%, 50%), 58px 243px hsl(1312.2, 100%, 50%), 58px 244px hsl(1317.6, 100%, 50%), 59px 245px hsl(1323, 100%, 50%), 59px 246px hsl(1328.4, 100%, 50%), 59px 247px hsl(1333.8, 100%, 50%), 59px 248px hsl(1339.2, 100%, 50%), 59px 249px hsl(1344.6, 100%, 50%), 60px 250px hsl(1350, 100%, 50%), 59px 251px hsl(1355.4, 100%, 50%), 59px 252px hsl(1360.8, 100%, 50%), 59px 253px hsl(1366.2, 100%, 50%), 59px 254px hsl(1371.6, 100%, 50%), 59px 255px hsl(1377, 100%, 50%), 58px 256px hsl(1382.4, 100%, 50%), 58px 257px hsl(1387.8, 100%, 50%), 58px 258px hsl(1393.2, 100%, 50%), 57px 259px hsl(1398.6, 100%, 50%), 57px 260px hsl(1404, 100%, 50%), 56px 261px hsl(1409.4, 100%, 50%), 55px 262px hsl(1414.8, 100%, 50%), 55px 263px hsl(1420.2, 100%, 50%), 54px 264px hsl(1425.6, 100%, 50%), 53px 265px hsl(1431, 100%, 50%), 52px 266px hsl(1436.4, 100%, 50%), 51px 267px hsl(1441.8, 100%, 50%), 50px 268px hsl(1447.2, 100%, 50%), 49px 269px hsl(1452.6, 100%, 50%), 48px 270px hsl(1458, 100%, 50%), 47px 271px hsl(1463.4, 100%, 50%), 46px 272px hsl(1468.8, 100%, 50%), 45px 273px hsl(1474.2, 100%, 50%), 43px 274px hsl(1479.6, 100%, 50%), 42px 275px hsl(1485, 100%, 50%), 41px 276px hsl(1490.4, 100%, 50%), 39px 277px hsl(1495.8, 100%, 50%), 38px 278px hsl(1501.2, 100%, 50%), 36px 279px hsl(1506.6, 100%, 50%), 35px 280px hsl(1512, 100%, 50%), 33px 281px hsl(1517.4, 100%, 50%), 32px 282px hsl(1522.8, 100%, 50%), 30px 283px hsl(1528.2, 100%, 50%), 28px 284px hsl(1533.6, 100%, 50%), 27px 285px hsl(1539, 100%, 50%), 25px 286px hsl(1544.4, 100%, 50%), 23px 287px hsl(1549.8, 100%, 50%), 22px 288px hsl(1555.2, 100%, 50%), 20px 289px hsl(1560.6, 100%, 50%), 18px 290px hsl(1566, 100%, 50%), 16px 291px hsl(1571.4, 100%, 50%), 14px 292px hsl(1576.8, 100%, 50%), 13px 293px hsl(1582.2, 100%, 50%), 11px 294px hsl(1587.6, 100%, 50%), 9px 295px hsl(1593, 100%, 50%), 7px 296px hsl(1598.4, 100%, 50%), 5px 297px hsl(1603.8, 100%, 50%), 3px 298px hsl(1609.2, 100%, 50%), 1px 299px hsl(1614.6, 100%, 50%), 2px 300px hsl(1620, 100%, 50%), -1px 301px hsl(1625.4, 100%, 50%), -3px 302px hsl(1630.8, 100%, 50%), -5px 303px hsl(1636.2, 100%, 50%), -7px 304px hsl(1641.6, 100%, 50%), -9px 305px hsl(1647, 100%, 50%), -11px 306px hsl(1652.4, 100%, 50%), -13px 307px hsl(1657.8, 100%, 50%), -14px 308px hsl(1663.2, 100%, 50%), -16px 309px hsl(1668.6, 100%, 50%), -18px 310px hsl(1674, 100%, 50%), -20px 311px hsl(1679.4, 100%, 50%), -22px 312px hsl(1684.8, 100%, 50%), -23px 313px hsl(1690.2, 100%, 50%), -25px 314px hsl(1695.6, 100%, 50%), -27px 315px hsl(1701, 100%, 50%), -28px 316px hsl(1706.4, 100%, 50%), -30px 317px hsl(1711.8, 100%, 50%), -32px 318px hsl(1717.2, 100%, 50%), -33px 319px hsl(1722.6, 100%, 50%), -35px 320px hsl(1728, 100%, 50%), -36px 321px hsl(1733.4, 100%, 50%), -38px 322px hsl(1738.8, 100%, 50%), -39px 323px hsl(1744.2, 100%, 50%), -41px 324px hsl(1749.6, 100%, 50%), -42px 325px hsl(1755, 100%, 50%), -43px 326px hsl(1760.4, 100%, 50%), -45px 327px hsl(1765.8, 100%, 50%), -46px 328px hsl(1771.2, 100%, 50%), -47px 329px hsl(1776.6, 100%, 50%), -48px 330px hsl(1782, 100%, 50%), -49px 331px hsl(1787.4, 100%, 50%), -50px 332px hsl(1792.8, 100%, 50%), -51px 333px hsl(1798.2, 100%, 50%), -52px 334px hsl(1803.6, 100%, 50%), -53px 335px hsl(1809, 100%, 50%), -54px 336px hsl(1814.4, 100%, 50%), -55px 337px hsl(1819.8, 100%, 50%), -55px 338px hsl(1825.2, 100%, 50%), -56px 339px hsl(1830.6, 100%, 50%), -57px 340px hsl(1836, 100%, 50%), -57px 341px hsl(1841.4, 100%, 50%), -58px 342px hsl(1846.8, 100%, 50%), -58px 343px hsl(1852.2, 100%, 50%), -58px 344px hsl(1857.6, 100%, 50%), -59px 345px hsl(1863, 100%, 50%), -59px 346px hsl(1868.4, 100%, 50%), -59px 347px hsl(1873.8, 100%, 50%), -59px 348px hsl(1879.2, 100%, 50%), -59px 349px hsl(1884.6, 100%, 50%), -60px 350px hsl(1890, 100%, 50%), -59px 351px hsl(1895.4, 100%, 50%), -59px 352px hsl(1900.8, 100%, 50%), -59px 353px hsl(1906.2, 100%, 50%), -59px 354px hsl(1911.6, 100%, 50%), -59px 355px hsl(1917, 100%, 50%), -58px 356px hsl(1922.4, 100%, 50%), -58px 357px hsl(1927.8, 100%, 50%), -58px 358px hsl(1933.2, 100%, 50%), -57px 359px hsl(1938.6, 100%, 50%), -57px 360px hsl(1944, 100%, 50%), -56px 361px hsl(1949.4, 100%, 50%), -55px 362px hsl(1954.8, 100%, 50%), -55px 363px hsl(1960.2, 100%, 50%), -54px 364px hsl(1965.6, 100%, 50%), -53px 365px hsl(1971, 100%, 50%), -52px 366px hsl(1976.4, 100%, 50%), -51px 367px hsl(1981.8, 100%, 50%), -50px 368px hsl(1987.2, 100%, 50%), -49px 369px hsl(1992.6, 100%, 50%), -48px 370px hsl(1998, 100%, 50%), -47px 371px hsl(2003.4, 100%, 50%), -46px 372px hsl(2008.8, 100%, 50%), -45px 373px hsl(2014.2, 100%, 50%), -43px 374px hsl(2019.6, 100%, 50%), -42px 375px hsl(2025, 100%, 50%), -41px 376px hsl(2030.4, 100%, 50%), -39px 377px hsl(2035.8, 100%, 50%), -38px 378px hsl(2041.2, 100%, 50%), -36px 379px hsl(2046.6, 100%, 50%), -35px 380px hsl(2052, 100%, 50%), -33px 381px hsl(2057.4, 100%, 50%), -32px 382px hsl(2062.8, 100%, 50%), -30px 383px hsl(2068.2, 100%, 50%), -28px 384px hsl(2073.6, 100%, 50%), -27px 385px hsl(2079, 100%, 50%), -25px 386px hsl(2084.4, 100%, 50%), -23px 387px hsl(2089.8, 100%, 50%), -22px 388px hsl(2095.2, 100%, 50%), -20px 389px hsl(2100.6, 100%, 50%), -18px 390px hsl(2106, 100%, 50%), -16px 391px hsl(2111.4, 100%, 50%), -14px 392px hsl(2116.8, 100%, 50%), -13px 393px hsl(2122.2, 100%, 50%), -11px 394px hsl(2127.6, 100%, 50%), -9px 395px hsl(2133, 100%, 50%), -7px 396px hsl(2138.4, 100%, 50%), -5px 397px hsl(2143.8, 100%, 50%), -3px 398px hsl(2149.2, 100%, 50%), -1px 399px hsl(2154.6, 100%, 50%); font-size: 40px;";

    //start init thingamajigs
    startUp();
})();

// display: none !important;
// console.log(aimbotBindButton.title);
// console.log(bindsArray);
