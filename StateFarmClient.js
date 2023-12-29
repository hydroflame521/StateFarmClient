// ==UserScript==
// @name         StateFarm Client V3
// @namespace    http://github.com/
// @version      3.1.2
// @license      SSM
// @description  Best cheats menu for Shell Shockers in 2024. Many modules such as Aimbot, PlayerESP, AmmoESP, Chams, Nametags, Join/Leave messages, Chat Filter Disabling, AntiAFK, FOV Slider, Zooming, Co-ords, Player Stats, Auto Refill and many more whilst having unsurpassed customisation options such as binding to any key and easily editable colour scheme - all on the fly!
// @author       Hydroflame521, onlypuppy7, and enbyte
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
    const version="3.1.1";
    //startup sequence
    const startUp=function() {
        mainLoop()
        injectScript()
        document.addEventListener("DOMContentLoaded", function() {
            initMenu();
            applyStylesAddElements(); //set font and change menu cass, and other stuff to do with the page
            getBinds();
            const intervalId1 = setInterval(everySecond, 1000);
            const intervalId2 = setInterval(updateConfig, 100);
        });
    };
    //INIT VARS
    window.newGame=false
    let binding=false;
    let lastSpamMessage=0;
    let lastAntiAFKMessage=0;
    let framesPassed=0;
    let lastFramesPassed=0;
    let secondsPassed=0;
    let lastSecondPassed=0;
    const allModules=[];
    const allFolders=[];
    const isKeyToggled={};
    let ESPArray=[];
    let onlinePlayersArray=[];
    const tp={}; // <-- tp = tweakpane
    let bindsArray,msgElement;
    let crosshairsPosition,currentlyTargeting,ammo,ranOneTime,lastWeaponBox,lastChatItemLength,config;
    let whitelistPlayers,blacklistPlayers;
    const mainLoopFunction=Array.from({length: 10}, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
    let isRightButtonDown = false;
    //menu interaction functions
    const extract = function(variable) {
        return config[variable];
    };
    const initBind = function(value) {
        if (binding == false) {
            binding=value;
            tp[binding+"BindButton"].title="PRESS KEY";
        };
    };
    const registerModule = function(name,button) { //usage: not for folders or binding buttons. point of it is to get a module list without hardcoding one
        tp[name]=button;
        allModules.push(name.replace("Button",""));
    };
    const registerFolder = function(name,folder) { //usage: not for folders or binding buttons. point of it is to get a module list without hardcoding one
        tp[name]=folder;
        allFolders.push(name);
    };
    const change = function(moduleLabel,module) {
        const labels = document.querySelectorAll('.tp-lblv_l');
        for (const label of labels) {
            if (label.textContent.includes(moduleLabel)) {
                const inputContainer = label.nextElementSibling;
                // check for checkbox
                const checkbox = inputContainer.querySelector('.tp-ckbv_i');
                if (checkbox) {
                    checkbox.click(); // Toggle checkbox
                    return extract(module);
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
                    const selectedIndex = (dropdown.selectedIndex + 1) % dropdown.options.length;
                    dropdown.selectedIndex = selectedIndex;
                    dropdown.dispatchEvent(new Event('change')); // trigger change event for dropdown
                    return extract(module);
                };
            };
        };
    };
    const getBinds = function() {
        bindsArray={};
        allModules.forEach(function(name) {
            let nameBindButton=name+"BindButton";
            try {
                nameBindButton=tp[nameBindButton].title
                if (nameBindButton) {
                    bindsArray[name] = nameBindButton;
                };
            } catch (error) {}; //basically, bind button does not exist, so there wont be any binding going on
        });
    };
    document.addEventListener('mousedown', function(event) {
        if (event.button === 2) {
            isRightButtonDown = true;
        };
    });
    document.addEventListener('mouseup', function(event) {
        if (event.button === 2) {
            isRightButtonDown = false;
        };
    });
    //menu
    document.addEventListener("keydown", function (event) {
        event=(event.code.substring(3));
        isKeyToggled[event]=true;
    });
    document.addEventListener("keyup", function (event) {
        event=(event.code.substring(3));
        isKeyToggled[event]=false;
        if (document.activeElement&&document.activeElement.tagName==='INPUT' ) {
      return;
    } else if (binding!=false) {
            if (event=="ete") { event="Set Bind" };
            tp[binding+"BindButton"].title=event;
            bindsArray[binding]=event;
            localStorage.setItem(binding+"Bind",JSON.stringify(event));
            showMsg("Binded "+tp[binding+"Button"].label+" to key: "+event);
            binding=false;
        } else {
            Object.keys(bindsArray).forEach(function(module) {
                if ((bindsArray[module] == event) && module!="zoom") {
                    const moduleButton=module+"Button";
                    const moduleLabel=tp[moduleButton].label;
                    let state=change(moduleLabel,module)
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
    const initMenu = function() {
        //INIT MENU
        //init tp.pane

        tp.pane = new Tweakpane.Pane();
        tp.pane.title = name+version;
        //init folders
        registerFolder("combatFolder",tp.pane.addFolder({
            title: "Combat",
            expanded: JSON.parse(localStorage.getItem("combatFolder")) !== null ? JSON.parse(localStorage.getItem("combatFolder")) : true
        }));
        registerFolder("renderFolder",tp.pane.addFolder({
            title: "Render",
            expanded: JSON.parse(localStorage.getItem("renderFolder")) !== null ? JSON.parse(localStorage.getItem("renderFolder")) : true
        }));
        registerFolder("chatFolder",tp.pane.addFolder({
            title: "Chat",
            expanded: JSON.parse(localStorage.getItem("chatFolder")) !== null ? JSON.parse(localStorage.getItem("chatFolder")) : true
        }));
        registerFolder("listsFolder",tp.pane.addFolder({
            title: "Lists",
            expanded: JSON.parse(localStorage.getItem("listsFolder")) !== null ? JSON.parse(localStorage.getItem("listsFolder")) : true
        }));
        registerFolder("miscFolder",tp.pane.addFolder({
            title: "Misc",
            expanded: JSON.parse(localStorage.getItem("miscFolder")) !== null ? JSON.parse(localStorage.getItem("miscFolder")) : true
        }));
        registerFolder("clientFolder",tp.pane.addFolder({
            title: "Client & About",
            expanded: JSON.parse(localStorage.getItem("clientFolder")) !== null ? JSON.parse(localStorage.getItem("clientFolder")) : true
        }));

        //init module/binds tabs

        tp.combatTab=tp.combatFolder.addTab({
            pages: [
            {title: 'Modules'},
            {title: 'Binds'},
            ],
        });
        tp.renderTab=tp.renderFolder.addTab({
            pages: [
            {title: 'Modules'},
            {title: 'Binds'},
            ],
        });
        tp.chatTab=tp.chatFolder.addTab({
            pages: [
            {title: 'Modules'},
            {title: 'Binds'},
            ],
        });
        tp.listsTab=tp.listsFolder.addTab({
            pages: [
            {title: 'Modules'},
            {title: 'Binds'},
            ],
        });
        tp.miscTab=tp.miscFolder.addTab({
            pages: [
            {title: 'Modules'},
            {title: 'Binds'},
            ],
        });
        tp.clientTab=tp.clientFolder.addTab({
            pages: [
            {title: 'Modules'},
            {title: 'Binds'},
            ],
        });

        //init combat modules tab

        registerModule("aimbotButton",tp.combatTab.pages[0].addInput(
            {aimbot: JSON.parse(localStorage.getItem("aimbot")) || false}, "aimbot", {
                label: "Aimbot",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerFolder("aimbotFolder",tp.combatTab.pages[0].addFolder({
            title: "Aimbot Options",
            expanded: JSON.parse(localStorage.getItem("aimbotFolder")) !== null ? JSON.parse(localStorage.getItem("aimbotFolder")) : false
        }));

        registerModule("aimbotTargetingButton",tp.aimbotFolder.addInput(
            {aimbotTargeting: (JSON.parse(localStorage.getItem("aimbotTargeting")) || "pointingat")}, "aimbotTargeting", {
                label: "Target",
                options: [
                    {text: "Pointing At", value: "pointingat"},
                    {text: "Nearest", value: "nearest"},
                ],
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("aimbotRightClickButton",tp.aimbotFolder.addInput(
            {aimbotRightClick: JSON.parse(localStorage.getItem("aimbotRightClick")) || false}, "aimbotRightClick", {
                label: "ToggleRM",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("lockOnButton",tp.aimbotFolder.addInput(
            {lockOn: JSON.parse(localStorage.getItem("lockOn")) || false}, "lockOn", {
                label: "Lock On",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("predictionButton",tp.aimbotFolder.addInput(
            {prediction: JSON.parse(localStorage.getItem("prediction")) || false}, "prediction", {
                label: "Prediction",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("aimbotAntiSnapButton",tp.aimbotFolder.addInput(
            {aimbotAntiSnap: 0}, "aimbotAntiSnap", {
                label: "Antisnap",
                min: 0, //slider
                max: 1.05,
                step: 0.05,
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("antiSneakButton",tp.aimbotFolder.addInput(
            {antiSneak: 0}, "antiSneak", {
                label: "Anti Sneak",
                min: 0,
                max: 5,
                step: 0.5,
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("aimbotColorButton",tp.aimbotFolder.addInput(
            {aimbotColor: (JSON.parse(localStorage.getItem("aimbotColor")) || "#0000ff")}, "aimbotColor", {
                label: "ESPColor",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("autoRefillButton",tp.combatTab.pages[0].addInput(
            {autoRefill: JSON.parse(localStorage.getItem("autoRefill")) || false}, "autoRefill", {
                label: "Auto Refill",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("autoFireButton",tp.combatTab.pages[0].addInput(
            {autoFire: JSON.parse(localStorage.getItem("autoFire")) || false}, "autoFire", {
                label: "Auto Fire",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        //init combat binds tab

        tp.aimbotBindButton = tp.combatTab.pages[1].addButton({
            label: "Aimbot",
            title: (JSON.parse(localStorage.getItem("aimbotBind")) || "V"),
        }).on("click", (value) => {
            initBind("aimbot")
        });

        tp.aimbotTargetingBindButton = tp.combatTab.pages[1].addButton({
            label: "Targeting",
            title: (JSON.parse(localStorage.getItem("aimbotTargetingBind")) || "T"),
        }).on("click", (value) => {
            initBind("aimbotTargeting")
        });

        tp.aimbotRightClickBindButton = tp.combatTab.pages[1].addButton({
            label: "ToggleRM",
            title: (JSON.parse(localStorage.getItem("aimbotRightClickBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("aimbotRightClick")
        });

        tp.lockOnBindButton = tp.combatTab.pages[1].addButton({
            label: "Lock On",
            title: (JSON.parse(localStorage.getItem("lockOnBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("lockOn")
        });

        tp.predictionBindButton = tp.combatTab.pages[1].addButton({
            label: "Prediction",
            title: (JSON.parse(localStorage.getItem("predictionBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("prediction")
        });

        tp.autoRefillBindButton = tp.combatTab.pages[1].addButton({
            label: "AutoRefill",
            title: (JSON.parse(localStorage.getItem("autoRefillBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("autoRefill")
        });

        tp.autoFireBindButton = tp.combatTab.pages[1].addButton({
            label: "Auto Fire",
            title: (JSON.parse(localStorage.getItem("autoFireBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("autoFire")
        });

        //init render modules tab

        registerModule("playerESPButton",tp.renderTab.pages[0].addInput(
            {playerESP: JSON.parse(localStorage.getItem("playerESP")) || false}, "playerESP", {
                label: "PlayerESP",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("tracersButton",tp.renderTab.pages[0].addInput(
            {tracers: JSON.parse(localStorage.getItem("tracers")) || false}, "tracers", {
                label: "Tracers",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("chamsButton",tp.renderTab.pages[0].addInput(
            {chams: JSON.parse(localStorage.getItem("chams")) || false}, "chams", {
                label: "Chams",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("nametagsButton",tp.renderTab.pages[0].addInput(
            {nametags: JSON.parse(localStorage.getItem("nametags")) || false}, "nametags", {
                label: "Nametags",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerFolder("tracersFolder",tp.renderTab.pages[0].addFolder({
            title: "Player ESP/Tracers Options",
            expanded: JSON.parse(localStorage.getItem("tracersFolder")) !== null ? JSON.parse(localStorage.getItem("tracersFolder")) : false
        }));

        registerModule("tracersTypeButton",tp.tracersFolder.addInput(
            {tracersType: (JSON.parse(localStorage.getItem("tracersType")) || "static")}, "tracersType", {
                label: "Type",
                options: [
                    {text: "Static", value: "static"},
                    {text: "Proximity", value: "proximity"},
                ],
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("tracersColor1Button",tp.tracersFolder.addInput(
            {tracersColor1: (JSON.parse(localStorage.getItem("tracersColor1")) || "#ff0000")}, "tracersColor1", {
                label: "Color 1",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("tracersColor1to2Button",tp.tracersFolder.addInput(
            {tracersColor1to2: (JSON.parse(localStorage.getItem("tracersColor1to2")) || 5)}, "tracersColor1to2", {
                label: "Dist 1->2",
                min: 0, //slider
                max: 30,
                step: 1,
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("tracersColor2Button",tp.tracersFolder.addInput(
            {tracersColor2: (JSON.parse(localStorage.getItem("tracersColor2")) || "#00ff00")}, "tracersColor2", {
                label: "Color 2",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("tracersColor2to3Button",tp.tracersFolder.addInput(
            {tracersColor2to3: (JSON.parse(localStorage.getItem("tracersColor2to3")) || 15)}, "tracersColor2to3", {
                label: "Dist 2->3",
                min: 0, //slider
                max: 30,
                step: 1,
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("tracersColor3Button",tp.tracersFolder.addInput(
            {tracersColor3: (JSON.parse(localStorage.getItem("tracersColor3")) || "#ffffff")}, "tracersColor3", {
                label: "Color 3",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerFolder("tracersAmmoFolder",tp.renderTab.pages[0].addFolder({
            title: "Ammo ESP/Tracers Options",
            expanded: JSON.parse(localStorage.getItem("tracersAmmoFolder")) !== null ? JSON.parse(localStorage.getItem("tracersAmmoFolder")) : false
        }));

        registerFolder("ammoFolder",tp.tracersAmmoFolder.addFolder({
            title: "Ammo",
            expanded: JSON.parse(localStorage.getItem("ammoFolder")) !== null ? JSON.parse(localStorage.getItem("ammoFolder")) : false
        }));

        registerModule("ammoESPButton",tp.ammoFolder.addInput(
            {ammoESP: JSON.parse(localStorage.getItem("ammoESP")) || false}, "ammoESP", {
                label: "AESP",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("ammoTracersButton",tp.ammoFolder.addInput(
            {ammoTracers: JSON.parse(localStorage.getItem("ammoTracers")) || false}, "ammoTracers", {
                label: "ATracers",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("ammoESPRegimeButton",tp.ammoFolder.addInput(
            {ammoESPRegime: (JSON.parse(localStorage.getItem("ammoESPRegime")) || "whendepleted")}, "ammoESPRegime", {
                label: "ARegime",
                options: [
                    {text: "When Depleted", value: "whendepleted"},
                    {text: "When Low", value: "whenlow"},
                    {text: "Below Max", value: "belowmax"},
                    {text: "Always On", value: "alwayson"},
                ],
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("ammoESPColorButton",tp.ammoFolder.addInput(
            {ammoESPColor: (JSON.parse(localStorage.getItem("ammoESPColor")) || "#ffff00")}, "ammoESPColor", {
                label: "AColor",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerFolder("grenadesFolder",tp.tracersAmmoFolder.addFolder({
            title: "Grenades",
            expanded: JSON.parse(localStorage.getItem("grenadesFolder")) !== null ? JSON.parse(localStorage.getItem("grenadesFolder")) : false
        }));

        registerModule("grenadeESPButton",tp.grenadesFolder.addInput(
            {grenadeESP: JSON.parse(localStorage.getItem("grenadeESP")) || false}, "grenadeESP", {
                label: "GESP",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("grenadeTracersButton",tp.grenadesFolder.addInput(
            {grenadeTracers: JSON.parse(localStorage.getItem("grenadeTracers")) || false}, "grenadeTracers", {
                label: "GTracers",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("grenadeESPRegimeButton",tp.grenadesFolder.addInput(
            {grenadeESPRegime: (JSON.parse(localStorage.getItem("grenadeESPRegime")) || "whendepleted")}, "grenadeESPRegime", {
                label: "GRegime",
                options: [
                    {text: "When Depleted", value: "whendepleted"},
                    {text: "When Low", value: "whenlow"},
                    {text: "Below Max", value: "belowmax"},
                    {text: "Always On", value: "alwayson"},
                ],
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("grenadeESPColorButton",tp.grenadesFolder.addInput(
            {grenadeESPColor: (JSON.parse(localStorage.getItem("grenadeESPColor")) || "#00ffff")}, "grenadeESPColor", {
                label: "GColor",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("fovButton",tp.renderTab.pages[0].addInput(
            {fov: (JSON.parse(localStorage.getItem("fov")) || 72)}, "fov", {
                label: "FOV",
                min: 0, //slider
                max: 360,
                step: 3,
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("zoomButton",tp.renderTab.pages[0].addInput(
            {zoom: (JSON.parse(localStorage.getItem("zoom")) || 15)}, "zoom", {
                label: "Zoom FOV",
                min: 0, //slider
                max: 72,
                step: 3,
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("freecamButton",tp.renderTab.pages[0].addInput(
            {freecam: JSON.parse(localStorage.getItem("freecam")) || false}, "freecam", {
                label: "CamWIP",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("showCoordinatesButton",tp.renderTab.pages[0].addInput(
            {showCoordinates: JSON.parse(localStorage.getItem("showCoordinates")) || false}, "showCoordinates", {
                label: "Co-ords",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("playerStatsButton",tp.renderTab.pages[0].addInput(
            {playerStats: JSON.parse(localStorage.getItem("playerStats")) || false}, "playerStats", {
                label: "PlayerStats",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("wireframeButton",tp.renderTab.pages[0].addInput(
            {wireframe: JSON.parse(localStorage.getItem("wireframe")) || false}, "wireframe", {
                label: "Wireframe",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("eggSizeButton",tp.renderTab.pages[0].addInput(
            {eggSize: 1}, "eggSize", { //no saving, its a bit ridiculous for that...
                label: "Egg Size",
                min: 0,
                max: 10,
                step: 0.25,
            }).on("change", (value) => {
        }));

        //init render binds tab

        tp.playerESPBindButton = tp.renderTab.pages[1].addButton({
            label: "PlayerESP",
            title: (JSON.parse(localStorage.getItem("playerESPBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("playerESP")
        });

        tp.tracersBindButton = tp.renderTab.pages[1].addButton({
            label: "Tracers",
            title: (JSON.parse(localStorage.getItem("tracersBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("tracers")
        });

        tp.chamsBindButton = tp.renderTab.pages[1].addButton({
            label: "Chams",
            title: (JSON.parse(localStorage.getItem("chamsBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("chams")
        });

        tp.nametagsBindButton = tp.renderTab.pages[1].addButton({
            label: "Nametags",
            title: (JSON.parse(localStorage.getItem("nametagsBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("nametags")
        });

        tp.tracersTypeBindButton = tp.renderTab.pages[1].addButton({
            label: "TracerType",
            title: (JSON.parse(localStorage.getItem("tracersTypeBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("tracersType")
        });

        tp.ammoESPBindButton = tp.renderTab.pages[1].addButton({
            label: "AESP",
            title: (JSON.parse(localStorage.getItem("ammoESPBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("ammoESP")
        });

        tp.ammoTracersBindButton = tp.renderTab.pages[1].addButton({
            label: "ATracers",
            title: (JSON.parse(localStorage.getItem("ammoTracersBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("ammoTracers")
        });

        tp.ammoESPRegimeBindButton = tp.renderTab.pages[1].addButton({
            label: "ARegime",
            title: (JSON.parse(localStorage.getItem("ammoESPRegimeBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("ammoESPRegime")
        });

        tp.grenadeESPBindButton = tp.renderTab.pages[1].addButton({
            label: "GESP",
            title: (JSON.parse(localStorage.getItem("grenadeESPBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("grenadeESP")
        });

        tp.grenadeTracersBindButton = tp.renderTab.pages[1].addButton({
            label: "GTracers",
            title: (JSON.parse(localStorage.getItem("grenadeTracersBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("grenadeTracers")
        });

        tp.grenadeESPRegimeBindButton = tp.renderTab.pages[1].addButton({
            label: "GRegime",
            title: (JSON.parse(localStorage.getItem("grenadeESPRegimeBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("grenadeESPRegime")
        });

        tp.zoomBindButton = tp.renderTab.pages[1].addButton({
            label: "Zoom",
            title: (JSON.parse(localStorage.getItem("zoomBind")) || "C"),
        }).on("click", (value) => {
            initBind("zoom")
        });

        tp.freecamBindButton = tp.renderTab.pages[1].addButton({
            label: "CamWIP",
            title: (JSON.parse(localStorage.getItem("freecamBind")) || "G"),
        }).on("click", (value) => {
            initBind("freecam")
        });

        tp.showCoordinatesBindButton = tp.renderTab.pages[1].addButton({
            label: "Co-ords",
            title: (JSON.parse(localStorage.getItem("showCoordinatesBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("showCoordinates")
        });

        tp.playerStatsBindButton = tp.renderTab.pages[1].addButton({
            label: "PlayerStats",
            title: (JSON.parse(localStorage.getItem("playerStatsBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("playerStats")
        });

        tp.wireframeBindButton = tp.renderTab.pages[1].addButton({
            label: "Wireframe",
            title: (JSON.parse(localStorage.getItem("wireframeBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("wireframe")
        });

        //init chat modules tab

        registerModule("chatExtendButton",tp.chatTab.pages[0].addInput(
            {chatExtend: JSON.parse(localStorage.getItem("chatExtend")) || false}, "chatExtend", {
                label: "InfiniHistory",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("maxChatButton",tp.chatTab.pages[0].addInput(
            {maxChat: (JSON.parse(localStorage.getItem("maxChat")) || 10)}, "maxChat", {
                label: "Max Ingame",
                min: 0, //slider
                max: 30,
                step: 1,
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("disableChatFilterButton",tp.chatTab.pages[0].addInput(
            {disableChatFilter: JSON.parse(localStorage.getItem("disableChatFilter")) || false}, "disableChatFilter", {
                label: "DisableFilter",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("antiAFKButton",tp.chatTab.pages[0].addInput(
            {antiAFK: JSON.parse(localStorage.getItem("antiAFK")) || false}, "antiAFK", {
                label: "AntiAFK",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("joinMessagesButton",tp.chatTab.pages[0].addInput(
            {joinMessages: JSON.parse(localStorage.getItem("joinMessages")) || false}, "joinMessages", {
                label: "Join Msgs",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("leaveMessagesButton",tp.chatTab.pages[0].addInput(
            {leaveMessages: JSON.parse(localStorage.getItem("leaveMessages")) || false}, "leaveMessages", {
                label: "Leave Msgs",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerFolder("joinLeaveFolder",tp.chatTab.pages[0].addFolder({
            title: "Join/Leave Msgs Options",
            expanded: JSON.parse(localStorage.getItem("joinLeaveFolder")) !== null ? JSON.parse(localStorage.getItem("joinLeaveFolder")) : false
        }));

        registerModule("publicBroadcastButton",tp.joinLeaveFolder.addInput(
            {publicBroadcast: JSON.parse(localStorage.getItem("publicBroadcast")) || false}, "publicBroadcast", {
                label: "Send2Chat",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("brandingButton",tp.joinLeaveFolder.addInput(
            {branding: JSON.parse(localStorage.getItem("branding")) || false}, "branding", {
                label: "Branded",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("chatHighlightButton",tp.chatTab.pages[0].addInput(
            {chatHighlight: JSON.parse(localStorage.getItem("chatHighlight")) || false}, "chatHighlight", {
                label: "HighlightTxt",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("spamChatButton",tp.chatTab.pages[0].addInput(
            {spamChat: JSON.parse(localStorage.getItem("spamChat")) || false}, "spamChat", {
                label: "Spammer",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("spamChatDelayButton",tp.chatTab.pages[0].addInput(
            {spamChatDelay: (JSON.parse(localStorage.getItem("spamChatDelay")) || 500)}, "spamChatDelay", {
                label: "Delay (ms)",
                min: 0, //slider
                max: 60000,
                step: 10,
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("spamChatTextButton",tp.chatTab.pages[0].addInput(
            {spamChatText: JSON.parse(localStorage.getItem("spamChatText")) || "StateFarm On Top!"}, "spamChatText", {
                label: "Spam Text",
            }).on("change", (value) => {
                localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        //init chat binds tab

        tp.chatExtendBindButton = tp.chatTab.pages[1].addButton({
            label: "InfiniHistory",
            title: (JSON.parse(localStorage.getItem("chatExtendBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("chatExtend")
        });

        tp.disableChatFilterBindButton = tp.chatTab.pages[1].addButton({
            label: "DisableFilter",
            title: (JSON.parse(localStorage.getItem("disableChatFilterBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("disableChatFilter")
        });

        tp.antiAFKBindButton = tp.chatTab.pages[1].addButton({
            label: "AntiAFK",
            title: (JSON.parse(localStorage.getItem("antiAFKBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("antiAFK")
        });

        tp.joinMessagesBindButton = tp.chatTab.pages[1].addButton({
            label: "Join Msgs",
            title: (JSON.parse(localStorage.getItem("joinMessagesBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("joinMessages")
        });

        tp.leaveMessagesBindButton = tp.chatTab.pages[1].addButton({
            label: "Leave Msgs",
            title: (JSON.parse(localStorage.getItem("leaveMessagesBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("leaveMessages")
        });

        tp.publicBroadcastBindButton = tp.chatTab.pages[1].addButton({
            label: "Send2Chat",
            title: (JSON.parse(localStorage.getItem("publicBroadcastBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("publicBroadcast")
        });

        tp.brandingBindButton = tp.chatTab.pages[1].addButton({
            label: "Branded",
            title: (JSON.parse(localStorage.getItem("brandingBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("branding")
        });

        tp.chatHighlightBindButton = tp.chatTab.pages[1].addButton({
            label: "ChatHighlight",
            title: (JSON.parse(localStorage.getItem("chatHighlightBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("chatHighlight")
        });

        tp.spamChatBindButton = tp.chatTab.pages[1].addButton({
            label: "Spammer",
            title: (JSON.parse(localStorage.getItem("spamChatBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("spamChat")
        });

        //init lists modules tab

        //whitelist

        registerModule("whitelistButton",tp.listsTab.pages[0].addInput(
            {whitelist: JSON.parse(localStorage.getItem("whitelist")) || "Enter Names"}, "whitelist", {
                label: "Whitelist",
            }).on("change", (value) => {
                localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerFolder("whitelistFolder",tp.listsTab.pages[0].addFolder({
            title: "Whitelist (Target Only) Options",
            expanded: JSON.parse(localStorage.getItem("whitelistFolder")) !== null ? JSON.parse(localStorage.getItem("whitelistFolder")) : false
        }));

        registerModule("enableWhitelistAimbotButton",tp.whitelistFolder.addInput(
            {enableWhitelistAimbot: JSON.parse(localStorage.getItem("enableWhitelistAimbot")) || false}, "enableWhitelistAimbot", {
                label: "WAimbot",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("enableWhitelistTracersButton",tp.whitelistFolder.addInput(
            {enableWhitelistTracers: JSON.parse(localStorage.getItem("enableWhitelistTracers")) || false}, "enableWhitelistTracers", {
                label: "WESP",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("whitelistESPTypeButton",tp.whitelistFolder.addInput(
            {whitelistESPType: (JSON.parse(localStorage.getItem("whitelistESPType")) || "onlyinclude")}, "whitelistESPType", {
                label: "WESPType",
                options: [
                    {text: "Only Include", value: "onlyinclude"},
                    {text: "Highlight", value: "highlight"},
                ],
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("whitelistColorButton",tp.whitelistFolder.addInput(
            {whitelistColor: (JSON.parse(localStorage.getItem("whitelistColor")) || "#e80aac")}, "whitelistColor", {
                label: "WHighlight",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        //blacklist

        registerModule("blacklistButton",tp.listsTab.pages[0].addInput(
            {blacklist: JSON.parse(localStorage.getItem("blacklist")) || "Enter Names"}, "blacklist", {
                label: "Blacklist",
            }).on("change", (value) => {
                localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerFolder("blacklistFolder",tp.listsTab.pages[0].addFolder({
            title: "Blacklist (Exclude) Options",
            expanded: JSON.parse(localStorage.getItem("blacklistFolder")) !== null ? JSON.parse(localStorage.getItem("blacklistFolder")) : false
        }));

        registerModule("enableBlacklistAimbotButton",tp.blacklistFolder.addInput(
            {enableBlacklistAimbot: JSON.parse(localStorage.getItem("enableBlacklistAimbot")) || false}, "enableBlacklistAimbot", {
                label: "BAimbot",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("enableBlacklistTracersButton",tp.blacklistFolder.addInput(
            {enableBlacklistTracers: JSON.parse(localStorage.getItem("enableBlacklistTracers")) || false}, "enableBlacklistTracers", {
                label: "BESP",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("blacklistESPTypeButton",tp.blacklistFolder.addInput(
            {blacklistESPType: (JSON.parse(localStorage.getItem("blacklistESPType")) || "justexclude")}, "blacklistESPType", {
                label: "BESPType",
                options: [
                    {text: "Just Exclude", value: "justexclude"},
                    {text: "Highlight", value: "highlight"},
                ],
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("blacklistColorButton",tp.blacklistFolder.addInput(
            {blacklistColor: (JSON.parse(localStorage.getItem("blacklistColor")) || "#00ff00")}, "blacklistColor", {
                label: "BHighlight",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        //init lists binds tab

        tp.enableWhitelistAimbotBindButton = tp.listsTab.pages[1].addButton({
            label: "WAimbot",
            title: (JSON.parse(localStorage.getItem("enableWhitelistAimbotBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("enableWhitelistAimbot")
        });

        tp.enableWhitelistTracersBindButton = tp.listsTab.pages[1].addButton({
            label: "WESP",
            title: (JSON.parse(localStorage.getItem("enableWhitelistTracersBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("enableWhitelistTracers")
        });

        tp.whitelistESPTypeBindButton = tp.listsTab.pages[1].addButton({
            label: "WESPType",
            title: (JSON.parse(localStorage.getItem("whitelistESPTypeBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("whitelistESPType")
        });

        tp.enableBlacklistAimbotBindButton = tp.listsTab.pages[1].addButton({
            label: "BAimbot",
            title: (JSON.parse(localStorage.getItem("enableBlacklistAimbotBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("enableBlacklistAimbot")
        });

        tp.enableBlacklistTracersBindButton = tp.listsTab.pages[1].addButton({
            label: "BESP",
            title: (JSON.parse(localStorage.getItem("enableBlacklistTracersBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("enableBlacklistTracers")
        });

        tp.blacklistESPTypeBindButton = tp.listsTab.pages[1].addButton({
            label: "BESPType",
            title: (JSON.parse(localStorage.getItem("blacklistESPTypeBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("blacklistESPType")
        });

        //init misc modules tab

        registerModule("unlockSkinsButton",tp.miscTab.pages[0].addInput(
            {unlockSkins: JSON.parse(localStorage.getItem("unlockSkins")) || false}, "unlockSkins", {
                label: "Unlock Skins",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        //init misc binds tab

        tp.unlockSkinsBindButton = tp.miscTab.pages[1].addButton({
            label: "Unlock Skins",
            title: (JSON.parse(localStorage.getItem("unlockSkinsBind")) || "Set Bind"),
        }).on("click", (value) => {
            initBind("unlockSkins")
        });

        registerModule("grenadeMaxPowerButton",tp.miscTab.pages[0].addInput(
            {grenadeMax: JSON.parse(localStorage.getItem("grenadeMax")) || false}, "grenadeMax", {
                label: "Set all grenades to max power",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey, JSON.stringify(value.value));
        }));

        //init client modules tab

        registerModule("hideButton",tp.clientTab.pages[0].addButton({
            label: "Hide GUI",
            title: "Hide",
        }).on("click", (value) => {
            tp.pane.hidden=!tp.pane.hidden;
        }));

        registerModule("reduceLagButton",tp.clientTab.pages[0].addInput(
            {reduceLag: (JSON.parse(localStorage.getItem("reduceLag")) || 1)}, "reduceLag", {
                label: "Reduce Lag",
                min: 1, //slider
                max: 4,
                step: 1,
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("popupsButton",tp.clientTab.pages[0].addInput(
            {popups: JSON.parse(localStorage.getItem("popups")) || true}, "popups", {
                label: "Pop-ups",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("panicButton",tp.clientTab.pages[0].addButton({
            label: "Panic",
            title: "EXIT!",
        }).on("click", (value) => {
            if (extract("enablePanic")) {
                window.location.replace(extract("panicURL"));
            };
        }));

        registerFolder("panicFolder",tp.clientTab.pages[0].addFolder({
            title: "Panic Options",
            expanded: JSON.parse(localStorage.getItem("panicFolder")) !== null ? JSON.parse(localStorage.getItem("panicFolder")) : false
        }));

        registerModule("enablePanicButton",tp.panicFolder.addInput(
            {enablePanic: JSON.parse(localStorage.getItem("enablePanic")) || true}, "enablePanic", {
                label: "Enable",
            }).on("change", (value) => {
            localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerModule("panicURLButton",tp.panicFolder.addInput(
            {panicURL: JSON.parse(localStorage.getItem("panicURL")) || "https://classroom.google.com/"}, "panicURL", {
                label: "Set URL",
            }).on("change", (value) => {
                localStorage.setItem(value.presetKey,JSON.stringify(value.value));
        }));

        registerFolder("linksFolder",tp.clientTab.pages[0].addFolder({
            title: "Creator's Links",
            expanded: JSON.parse(localStorage.getItem("linksFolder")) !== null ? JSON.parse(localStorage.getItem("linksFolder")) : false
        }));

        registerModule("discordButton",tp.linksFolder.addButton({
            label: "Discord",
            title: "Link",
        }).on("click", (value) => {
            window.open("https://discord.gg/mPa95HB7Q6");
        }));

        registerModule("githubButton",tp.linksFolder.addButton({
            label: "Github",
            title: "Link",
        }).on("click", (value) => {
            window.open("https://github.com/onlypuppy7/StateFarmClient");
        }));

        registerModule("clearButton",tp.clientTab.pages[0].addButton({
            label: "Reset",
            title: "DELETE",
        }).on("click", (value) => {
            const userConfirmed=confirm("Are you sure you want to continue? This will clear all stored keybinds, but also some of the game's stuff too (username, and other stuff).");
            if (userConfirmed) {
                localStorage.clear();
                userConfirmed=alert("Reload to reset to defaults.");
            };
        }));

        //init client binds tab

        tp.hideBindButton = tp.clientTab.pages[1].addButton({
            label: "Hide GUI",
            title: (JSON.parse(localStorage.getItem("hideBind")) || "H"),
        }).on("click", (value) => {
            initBind("hide")
        });

        tp.panicBindButton = tp.clientTab.pages[1].addButton({
            label: "Panic",
            title: (JSON.parse(localStorage.getItem("panicBind")) || "X"),
        }).on("click", (value) => {
            initBind("panic")
        });

        updateConfig();
    };
    //visual functions
    const showMsg = function (text,type) {
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
    };
    const applyStylesAddElements = function() {
        //get custom font - condensed font works well for space saving
        const head = document.head || document.getElementsByTagName('head').pages[0];
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css?family=Roboto+Condensed';
        head.appendChild(link);

        //menu customisation (apply font, button widths, adjust checkbox right slightly, make menu appear on top, add anim to message)
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .tp-dfwv, tp-rotv_t, .tp-fldv_t, .tp-ckbv_l, .tp-lblv_l, .msg, .coords, .playerstats {
                font-family: 'Roboto Condensed', sans-serif !important;
            }
            .tp-lblv_l {
                font-size: 16px;
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
            top: 10px;
            left: 240px;
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
    };
    //1337 H4X
    const hexToRgb = function(hex) {
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
    const fadeBetweenColors = function(color1, color2, progress) {
        const rgb1 = hexToRgb(color1);
        const rgb2 = hexToRgb(color2);
        const resultRgb = [
            rgb1[0] + (rgb2[0] - rgb1[0]) * progress,
            rgb1[1] + (rgb2[1] - rgb1[1]) * progress,
            rgb1[2] + (rgb2[2] - rgb1[2]) * progress
        ];
        return resultRgb;
    };
    const distancePlayers = function(yourPlayer,player) {
        return Math.hypot(player.x-yourPlayer.x,player.y-yourPlayer.y,player.z-yourPlayer.z ); //pythagoras' theorem in 3 dimensions. no one owns maths, zert.
    };
    const isPartialMatch = function(array, searchString) {
        return array.some(item => searchString.toLowerCase().includes(item.toLowerCase()));
    };
    const processChatItem = function(ss,text,playerName,playerTeam,highlightColor) {
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
    const updateOrCreateLinesESP = function(ss,object,type,color) {
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
    const everySecond = function() {
        secondsPassed=secondsPassed+1;
        if (secondsPassed>=(lastSecondPassed+extract("reduceLag"))) {
            lastSecondPassed=secondsPassed;
            coordElement.style.display = 'none';
            playerstatsElement.style.display = 'none';
            allFolders.forEach(function(name) {
                localStorage.setItem(name,JSON.stringify(tp[name].expanded));
            });
            if (extract("antiAFK")) {
                if (Date.now()>(lastAntiAFKMessage+270000)) {
                    sendChatMessage("Anti AFK Message. Censored Words: DATE, SUCK");
                    lastAntiAFKMessage=Date.now();
                };
            };
        };
        //block ads kek
        localStorage.timesPlayed = 0;
    };
    const updateConfig = function() {
        config=tp.pane.exportPreset();
    };
    const sendChatMessage = function (text) {
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
    const injectScript = function() {
        window.fixCamera = function () {
            return isKeyToggled[bindsArray.zoom] && (extract("zoom")*(Math.PI / 180)) || (extract("fov")*(Math.PI / 180)) || 1.25;
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
                    const getVarName = function(name, regexPattern) {
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
                        getVarName("map", '>=([a-zA-Z]+)\\.height&&\\(this\\.climbing=!1\\)');
                        getVarName("teamColors", '\\{([a-zA-Z_$]+)\\.themClass\\[');
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
                    code = code.replace(`\.engine\.runRenderLoop\(function\(\)\{${match[1]}\(`,`.engine.runRenderLoop(function(){${match[1]}(),window["${mainLoopFunction}"]({${injectionString}}`);
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

                    //replace graveyard:

                    //trajectories
                    // code = code.replace(',console.log("joinGame()',',window.newGame=true,console.log("joinGame()');
                    // code = code.replace("this.grenadeThrowPower=Math.clamp(t,0,1),","this.grenadeThrowPower=Math.clamp(t,0,1),console.log('hello',this.grenadeThrowPower),");
                    // code = code.replace("s.packFloat(a.x)","s.packFloat(a.x),console.log('hello2',this.grenadeThrowPower,n,r,a)");
                    //disable autopause
                    // code = code.replace('&&(Li=null,Ue=0,q.controlKeys=0,q.releaseTrigger(),setTimeout(()=>{var f=Ce.getBuffer();f.packInt8(he.pause),f.send(we),q.resetCountdowns();let c=Gr&&!O.productBlockAds&&!pokiActive?10:5;ro(c)},100),ci=!0,vueApp.statsLoading(),Ei.set(function(){q.removeFromPlay(),as()},3e3),Sn!==void 0&&Tn!==void 0&&(aiptag=Sn,aipDisplay=Tn),console.log("pausing game via pointerlock exit"),to(),Nh(),crazyGamesActive&&crazysdk.gameplayStop())', '');
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
    const mainLoop = function() {
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
                window.newGame=false;
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
        };
        const updateLinesESP = function(ss) {
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
                            if (extract("joinMessages")) {
                                if (extract("publicBroadcast")) {
                                    sendChatMessage((extract("branding") ? "[SFC] " : "")+player.name+" joined.")
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
                        if (extract("leaveMessages")) {
                            if (extract("publicBroadcast")) {
                                sendChatMessage((extract("branding") ? "[SFC] " : "")+onlinePlayersArray[i][1]+" left.")
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
            };
        };
        window[mainLoopFunction] = function ( ss ) {
            if ( !ss.yourPlayer ) { return }; //injection fail
            if ( !ranOneTime ) { oneTime(ss) };
            initVars(ss);
            framesPassed=framesPassed+1;
            if (framesPassed>=(lastFramesPassed+extract("reduceLag"))) {
                lastFramesPassed=framesPassed
                updateLinesESP(ss);
            };

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
                const personalCoordinate = `XYZ: ${fonx}, ${fony}, ${fonz}`;
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
            }
            if ( extract("autoRefill") ) {
                if (ammo.rounds==0) {
                    ss.yourPlayer.reload();
                };
                // console.log("round",t.rounds);
                // console.log("capacity",t.capacity);
            }
            let minimumDistance = Infinity;
            let nearestPlayer;
            if (extract("aimbot") && ( extract("aimbotRightClick") ? isRightButtonDown : true ) && ss.yourPlayer.playing) {
                if (!extract("lockOn") || !currentlyTargeting) {
                    currentlyTargeting=false
                    const targetType=extract("aimbotTargeting");
                    let minimumValue = Infinity;
                    for ( let i = 0; i < ss.players.length; i ++ ) {
                        const player = ss.players[ i ];
                        if ( player && player !== ss.yourPlayer && player.playing && ( ss.yourPlayer.team === 0 || player.team !== ss.yourPlayer.team ) ) {
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
                                    const angleYaw = Math.radAdd(Math.atan2(directionToPlayer.x, directionToPlayer.z),0);
                                    const anglePitch = -Math.atan2(
                                        directionToPlayer.y,
                                        Math.hypot(directionToPlayer.x, directionToPlayer.z)
                                    );
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
                    if (extract("antiSneak")!==0) {//beacause people like to jump from up above on you and this will prevent that, or people sneaking from behind when aiming far away
                       acceptableDistance = extract("antiSneak");
                       console.log('here');
                       if (minimumDistance < acceptableDistance)
                       {
                           currentlyTargeting = nearestPlayer;
                       }
                    };
                };
                highlightCurrentlyTargeting(currentlyTargeting, ss.players);
                if ( currentlyTargeting && currentlyTargeting.playing ) { //found a target
                    let x=currentlyTargeting.actor.mesh.position.x
                        y=currentlyTargeting.actor.mesh.position.y
                        z=currentlyTargeting.actor.mesh.position.z;
                    if (extract("prediction")) {
                        const distanceBetweenPlayers=distancePlayers(ss.yourPlayer,currentlyTargeting);
                        const bulletSpeed=ss.weapons.classes[ss.yourPlayer.primaryWeaponItem.exclusive_for_class].weapon.velocity;
                        const timeToReachTarget = distanceBetweenPlayers / bulletSpeed;
                        x = x + currentlyTargeting.dx * timeToReachTarget;
                        z = z + currentlyTargeting.dz * timeToReachTarget;
                        let yourMult = ss.yourPlayer.weapon.accuracy;
                        let targetMult = 2*Math.sqrt(distanceBetweenPlayers)-0.1*(distanceBetweenPlayers) + 0.005*parseInt(document.getElementById("ping").textContent.slice(0,-2));
                        y = currentlyTargeting.actor.mesh.position.y - ss.yourPlayer.actor.mesh.position.y + timeToReachTarget*(currentlyTargeting.dy - (yourMult*ss.yourPlayer.dy ));
                        //parseInt(document.getElementById("ping").textContent.slice(0,-2) is the ping given by the game, incorporate this is a positive gain factor for the other three axes, and find a metter mult than 0.005

                    };
                    x = x - ss.yourPlayer.actor.mesh.position.x;
                    z = z - ss.yourPlayer.actor.mesh.position.z;

                    if(!extract("prediction"))
                    {
                        x = currentlyTargeting.actor.mesh.position.x - ss.yourPlayer.actor.mesh.position.x;
                        y = currentlyTargeting.actor.mesh.position.y - ss.yourPlayer.actor.mesh.position.y;
                        z = currentlyTargeting.actor.mesh.position.z - ss.yourPlayer.actor.mesh.position.z;
                    }

                    const finalYaw = Math.radAdd(Math.atan2(x,z),0);
                    const finalPitch = -Math.atan2(y,Math.hypot(x,z))%1.5;

                    const antiSnap=1-(extract("aimbotAntiSnap")||0);
                    function lerp(start, end, alpha) {
                        let value=(1-alpha) * start + alpha * end;
                        if (Math.abs(end-start)<0.1) {
                            value=end
                        };
                        return value
                    };
                    // Exponential lerp towards the target rotation
                    ss.yourPlayer.yaw = lerp(ss.yourPlayer.yaw, finalYaw, antiSnap);
                    ss.yourPlayer.pitch = lerp(ss.yourPlayer.pitch, finalPitch, antiSnap);
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
                    currentlyTargeting="dead";
                };
            } else {
                currentlyTargeting=false;
            };
        };
    };
    var css = "text-shadow: -1px -1px hsl(0,100%,50%), 1px 1px hsl(5.4, 100%, 50%), 3px 2px hsl(10.8, 100%, 50%), 5px 3px hsl(16.2, 100%, 50%), 7px 4px hsl(21.6, 100%, 50%), 9px 5px hsl(27, 100%, 50%), 11px 6px hsl(32.4, 100%, 50%), 13px 7px hsl(37.8, 100%, 50%), 14px 8px hsl(43.2, 100%, 50%), 16px 9px hsl(48.6, 100%, 50%), 18px 10px hsl(54, 100%, 50%), 20px 11px hsl(59.4, 100%, 50%), 22px 12px hsl(64.8, 100%, 50%), 23px 13px hsl(70.2, 100%, 50%), 25px 14px hsl(75.6, 100%, 50%), 27px 15px hsl(81, 100%, 50%), 28px 16px hsl(86.4, 100%, 50%), 30px 17px hsl(91.8, 100%, 50%), 32px 18px hsl(97.2, 100%, 50%), 33px 19px hsl(102.6, 100%, 50%), 35px 20px hsl(108, 100%, 50%), 36px 21px hsl(113.4, 100%, 50%), 38px 22px hsl(118.8, 100%, 50%), 39px 23px hsl(124.2, 100%, 50%), 41px 24px hsl(129.6, 100%, 50%), 42px 25px hsl(135, 100%, 50%), 43px 26px hsl(140.4, 100%, 50%), 45px 27px hsl(145.8, 100%, 50%), 46px 28px hsl(151.2, 100%, 50%), 47px 29px hsl(156.6, 100%, 50%), 48px 30px hsl(162, 100%, 50%), 49px 31px hsl(167.4, 100%, 50%), 50px 32px hsl(172.8, 100%, 50%), 51px 33px hsl(178.2, 100%, 50%), 52px 34px hsl(183.6, 100%, 50%), 53px 35px hsl(189, 100%, 50%), 54px 36px hsl(194.4, 100%, 50%), 55px 37px hsl(199.8, 100%, 50%), 55px 38px hsl(205.2, 100%, 50%), 56px 39px hsl(210.6, 100%, 50%), 57px 40px hsl(216, 100%, 50%), 57px 41px hsl(221.4, 100%, 50%), 58px 42px hsl(226.8, 100%, 50%), 58px 43px hsl(232.2, 100%, 50%), 58px 44px hsl(237.6, 100%, 50%), 59px 45px hsl(243, 100%, 50%), 59px 46px hsl(248.4, 100%, 50%), 59px 47px hsl(253.8, 100%, 50%), 59px 48px hsl(259.2, 100%, 50%), 59px 49px hsl(264.6, 100%, 50%), 60px 50px hsl(270, 100%, 50%), 59px 51px hsl(275.4, 100%, 50%), 59px 52px hsl(280.8, 100%, 50%), 59px 53px hsl(286.2, 100%, 50%), 59px 54px hsl(291.6, 100%, 50%), 59px 55px hsl(297, 100%, 50%), 58px 56px hsl(302.4, 100%, 50%), 58px 57px hsl(307.8, 100%, 50%), 58px 58px hsl(313.2, 100%, 50%), 57px 59px hsl(318.6, 100%, 50%), 57px 60px hsl(324, 100%, 50%), 56px 61px hsl(329.4, 100%, 50%), 55px 62px hsl(334.8, 100%, 50%), 55px 63px hsl(340.2, 100%, 50%), 54px 64px hsl(345.6, 100%, 50%), 53px 65px hsl(351, 100%, 50%), 52px 66px hsl(356.4, 100%, 50%), 51px 67px hsl(361.8, 100%, 50%), 50px 68px hsl(367.2, 100%, 50%), 49px 69px hsl(372.6, 100%, 50%), 48px 70px hsl(378, 100%, 50%), 47px 71px hsl(383.4, 100%, 50%), 46px 72px hsl(388.8, 100%, 50%), 45px 73px hsl(394.2, 100%, 50%), 43px 74px hsl(399.6, 100%, 50%), 42px 75px hsl(405, 100%, 50%), 41px 76px hsl(410.4, 100%, 50%), 39px 77px hsl(415.8, 100%, 50%), 38px 78px hsl(421.2, 100%, 50%), 36px 79px hsl(426.6, 100%, 50%), 35px 80px hsl(432, 100%, 50%), 33px 81px hsl(437.4, 100%, 50%), 32px 82px hsl(442.8, 100%, 50%), 30px 83px hsl(448.2, 100%, 50%), 28px 84px hsl(453.6, 100%, 50%), 27px 85px hsl(459, 100%, 50%), 25px 86px hsl(464.4, 100%, 50%), 23px 87px hsl(469.8, 100%, 50%), 22px 88px hsl(475.2, 100%, 50%), 20px 89px hsl(480.6, 100%, 50%), 18px 90px hsl(486, 100%, 50%), 16px 91px hsl(491.4, 100%, 50%), 14px 92px hsl(496.8, 100%, 50%), 13px 93px hsl(502.2, 100%, 50%), 11px 94px hsl(507.6, 100%, 50%), 9px 95px hsl(513, 100%, 50%), 7px 96px hsl(518.4, 100%, 50%), 5px 97px hsl(523.8, 100%, 50%), 3px 98px hsl(529.2, 100%, 50%), 1px 99px hsl(534.6, 100%, 50%), 7px 100px hsl(540, 100%, 50%), -1px 101px hsl(545.4, 100%, 50%), -3px 102px hsl(550.8, 100%, 50%), -5px 103px hsl(556.2, 100%, 50%), -7px 104px hsl(561.6, 100%, 50%), -9px 105px hsl(567, 100%, 50%), -11px 106px hsl(572.4, 100%, 50%), -13px 107px hsl(577.8, 100%, 50%), -14px 108px hsl(583.2, 100%, 50%), -16px 109px hsl(588.6, 100%, 50%), -18px 110px hsl(594, 100%, 50%), -20px 111px hsl(599.4, 100%, 50%), -22px 112px hsl(604.8, 100%, 50%), -23px 113px hsl(610.2, 100%, 50%), -25px 114px hsl(615.6, 100%, 50%), -27px 115px hsl(621, 100%, 50%), -28px 116px hsl(626.4, 100%, 50%), -30px 117px hsl(631.8, 100%, 50%), -32px 118px hsl(637.2, 100%, 50%), -33px 119px hsl(642.6, 100%, 50%), -35px 120px hsl(648, 100%, 50%), -36px 121px hsl(653.4, 100%, 50%), -38px 122px hsl(658.8, 100%, 50%), -39px 123px hsl(664.2, 100%, 50%), -41px 124px hsl(669.6, 100%, 50%), -42px 125px hsl(675, 100%, 50%), -43px 126px hsl(680.4, 100%, 50%), -45px 127px hsl(685.8, 100%, 50%), -46px 128px hsl(691.2, 100%, 50%), -47px 129px hsl(696.6, 100%, 50%), -48px 130px hsl(702, 100%, 50%), -49px 131px hsl(707.4, 100%, 50%), -50px 132px hsl(712.8, 100%, 50%), -51px 133px hsl(718.2, 100%, 50%), -52px 134px hsl(723.6, 100%, 50%), -53px 135px hsl(729, 100%, 50%), -54px 136px hsl(734.4, 100%, 50%), -55px 137px hsl(739.8, 100%, 50%), -55px 138px hsl(745.2, 100%, 50%), -56px 139px hsl(750.6, 100%, 50%), -57px 140px hsl(756, 100%, 50%), -57px 141px hsl(761.4, 100%, 50%), -58px 142px hsl(766.8, 100%, 50%), -58px 143px hsl(772.2, 100%, 50%), -58px 144px hsl(777.6, 100%, 50%), -59px 145px hsl(783, 100%, 50%), -59px 146px hsl(788.4, 100%, 50%), -59px 147px hsl(793.8, 100%, 50%), -59px 148px hsl(799.2, 100%, 50%), -59px 149px hsl(804.6, 100%, 50%), -60px 150px hsl(810, 100%, 50%), -59px 151px hsl(815.4, 100%, 50%), -59px 152px hsl(820.8, 100%, 50%), -59px 153px hsl(826.2, 100%, 50%), -59px 154px hsl(831.6, 100%, 50%), -59px 155px hsl(837, 100%, 50%), -58px 156px hsl(842.4, 100%, 50%), -58px 157px hsl(847.8, 100%, 50%), -58px 158px hsl(853.2, 100%, 50%), -57px 159px hsl(858.6, 100%, 50%), -57px 160px hsl(864, 100%, 50%), -56px 161px hsl(869.4, 100%, 50%), -55px 162px hsl(874.8, 100%, 50%), -55px 163px hsl(880.2, 100%, 50%), -54px 164px hsl(885.6, 100%, 50%), -53px 165px hsl(891, 100%, 50%), -52px 166px hsl(896.4, 100%, 50%), -51px 167px hsl(901.8, 100%, 50%), -50px 168px hsl(907.2, 100%, 50%), -49px 169px hsl(912.6, 100%, 50%), -48px 170px hsl(918, 100%, 50%), -47px 171px hsl(923.4, 100%, 50%), -46px 172px hsl(928.8, 100%, 50%), -45px 173px hsl(934.2, 100%, 50%), -43px 174px hsl(939.6, 100%, 50%), -42px 175px hsl(945, 100%, 50%), -41px 176px hsl(950.4, 100%, 50%), -39px 177px hsl(955.8, 100%, 50%), -38px 178px hsl(961.2, 100%, 50%), -36px 179px hsl(966.6, 100%, 50%), -35px 180px hsl(972, 100%, 50%), -33px 181px hsl(977.4, 100%, 50%), -32px 182px hsl(982.8, 100%, 50%), -30px 183px hsl(988.2, 100%, 50%), -28px 184px hsl(993.6, 100%, 50%), -27px 185px hsl(999, 100%, 50%), -25px 186px hsl(1004.4, 100%, 50%), -23px 187px hsl(1009.8, 100%, 50%), -22px 188px hsl(1015.2, 100%, 50%), -20px 189px hsl(1020.6, 100%, 50%), -18px 190px hsl(1026, 100%, 50%), -16px 191px hsl(1031.4, 100%, 50%), -14px 192px hsl(1036.8, 100%, 50%), -13px 193px hsl(1042.2, 100%, 50%), -11px 194px hsl(1047.6, 100%, 50%), -9px 195px hsl(1053, 100%, 50%), -7px 196px hsl(1058.4, 100%, 50%), -5px 197px hsl(1063.8, 100%, 50%), -3px 198px hsl(1069.2, 100%, 50%), -1px 199px hsl(1074.6, 100%, 50%), -1px 200px hsl(1080, 100%, 50%), 1px 201px hsl(1085.4, 100%, 50%), 3px 202px hsl(1090.8, 100%, 50%), 5px 203px hsl(1096.2, 100%, 50%), 7px 204px hsl(1101.6, 100%, 50%), 9px 205px hsl(1107, 100%, 50%), 11px 206px hsl(1112.4, 100%, 50%), 13px 207px hsl(1117.8, 100%, 50%), 14px 208px hsl(1123.2, 100%, 50%), 16px 209px hsl(1128.6, 100%, 50%), 18px 210px hsl(1134, 100%, 50%), 20px 211px hsl(1139.4, 100%, 50%), 22px 212px hsl(1144.8, 100%, 50%), 23px 213px hsl(1150.2, 100%, 50%), 25px 214px hsl(1155.6, 100%, 50%), 27px 215px hsl(1161, 100%, 50%), 28px 216px hsl(1166.4, 100%, 50%), 30px 217px hsl(1171.8, 100%, 50%), 32px 218px hsl(1177.2, 100%, 50%), 33px 219px hsl(1182.6, 100%, 50%), 35px 220px hsl(1188, 100%, 50%), 36px 221px hsl(1193.4, 100%, 50%), 38px 222px hsl(1198.8, 100%, 50%), 39px 223px hsl(1204.2, 100%, 50%), 41px 224px hsl(1209.6, 100%, 50%), 42px 225px hsl(1215, 100%, 50%), 43px 226px hsl(1220.4, 100%, 50%), 45px 227px hsl(1225.8, 100%, 50%), 46px 228px hsl(1231.2, 100%, 50%), 47px 229px hsl(1236.6, 100%, 50%), 48px 230px hsl(1242, 100%, 50%), 49px 231px hsl(1247.4, 100%, 50%), 50px 232px hsl(1252.8, 100%, 50%), 51px 233px hsl(1258.2, 100%, 50%), 52px 234px hsl(1263.6, 100%, 50%), 53px 235px hsl(1269, 100%, 50%), 54px 236px hsl(1274.4, 100%, 50%), 55px 237px hsl(1279.8, 100%, 50%), 55px 238px hsl(1285.2, 100%, 50%), 56px 239px hsl(1290.6, 100%, 50%), 57px 240px hsl(1296, 100%, 50%), 57px 241px hsl(1301.4, 100%, 50%), 58px 242px hsl(1306.8, 100%, 50%), 58px 243px hsl(1312.2, 100%, 50%), 58px 244px hsl(1317.6, 100%, 50%), 59px 245px hsl(1323, 100%, 50%), 59px 246px hsl(1328.4, 100%, 50%), 59px 247px hsl(1333.8, 100%, 50%), 59px 248px hsl(1339.2, 100%, 50%), 59px 249px hsl(1344.6, 100%, 50%), 60px 250px hsl(1350, 100%, 50%), 59px 251px hsl(1355.4, 100%, 50%), 59px 252px hsl(1360.8, 100%, 50%), 59px 253px hsl(1366.2, 100%, 50%), 59px 254px hsl(1371.6, 100%, 50%), 59px 255px hsl(1377, 100%, 50%), 58px 256px hsl(1382.4, 100%, 50%), 58px 257px hsl(1387.8, 100%, 50%), 58px 258px hsl(1393.2, 100%, 50%), 57px 259px hsl(1398.6, 100%, 50%), 57px 260px hsl(1404, 100%, 50%), 56px 261px hsl(1409.4, 100%, 50%), 55px 262px hsl(1414.8, 100%, 50%), 55px 263px hsl(1420.2, 100%, 50%), 54px 264px hsl(1425.6, 100%, 50%), 53px 265px hsl(1431, 100%, 50%), 52px 266px hsl(1436.4, 100%, 50%), 51px 267px hsl(1441.8, 100%, 50%), 50px 268px hsl(1447.2, 100%, 50%), 49px 269px hsl(1452.6, 100%, 50%), 48px 270px hsl(1458, 100%, 50%), 47px 271px hsl(1463.4, 100%, 50%), 46px 272px hsl(1468.8, 100%, 50%), 45px 273px hsl(1474.2, 100%, 50%), 43px 274px hsl(1479.6, 100%, 50%), 42px 275px hsl(1485, 100%, 50%), 41px 276px hsl(1490.4, 100%, 50%), 39px 277px hsl(1495.8, 100%, 50%), 38px 278px hsl(1501.2, 100%, 50%), 36px 279px hsl(1506.6, 100%, 50%), 35px 280px hsl(1512, 100%, 50%), 33px 281px hsl(1517.4, 100%, 50%), 32px 282px hsl(1522.8, 100%, 50%), 30px 283px hsl(1528.2, 100%, 50%), 28px 284px hsl(1533.6, 100%, 50%), 27px 285px hsl(1539, 100%, 50%), 25px 286px hsl(1544.4, 100%, 50%), 23px 287px hsl(1549.8, 100%, 50%), 22px 288px hsl(1555.2, 100%, 50%), 20px 289px hsl(1560.6, 100%, 50%), 18px 290px hsl(1566, 100%, 50%), 16px 291px hsl(1571.4, 100%, 50%), 14px 292px hsl(1576.8, 100%, 50%), 13px 293px hsl(1582.2, 100%, 50%), 11px 294px hsl(1587.6, 100%, 50%), 9px 295px hsl(1593, 100%, 50%), 7px 296px hsl(1598.4, 100%, 50%), 5px 297px hsl(1603.8, 100%, 50%), 3px 298px hsl(1609.2, 100%, 50%), 1px 299px hsl(1614.6, 100%, 50%), 2px 300px hsl(1620, 100%, 50%), -1px 301px hsl(1625.4, 100%, 50%), -3px 302px hsl(1630.8, 100%, 50%), -5px 303px hsl(1636.2, 100%, 50%), -7px 304px hsl(1641.6, 100%, 50%), -9px 305px hsl(1647, 100%, 50%), -11px 306px hsl(1652.4, 100%, 50%), -13px 307px hsl(1657.8, 100%, 50%), -14px 308px hsl(1663.2, 100%, 50%), -16px 309px hsl(1668.6, 100%, 50%), -18px 310px hsl(1674, 100%, 50%), -20px 311px hsl(1679.4, 100%, 50%), -22px 312px hsl(1684.8, 100%, 50%), -23px 313px hsl(1690.2, 100%, 50%), -25px 314px hsl(1695.6, 100%, 50%), -27px 315px hsl(1701, 100%, 50%), -28px 316px hsl(1706.4, 100%, 50%), -30px 317px hsl(1711.8, 100%, 50%), -32px 318px hsl(1717.2, 100%, 50%), -33px 319px hsl(1722.6, 100%, 50%), -35px 320px hsl(1728, 100%, 50%), -36px 321px hsl(1733.4, 100%, 50%), -38px 322px hsl(1738.8, 100%, 50%), -39px 323px hsl(1744.2, 100%, 50%), -41px 324px hsl(1749.6, 100%, 50%), -42px 325px hsl(1755, 100%, 50%), -43px 326px hsl(1760.4, 100%, 50%), -45px 327px hsl(1765.8, 100%, 50%), -46px 328px hsl(1771.2, 100%, 50%), -47px 329px hsl(1776.6, 100%, 50%), -48px 330px hsl(1782, 100%, 50%), -49px 331px hsl(1787.4, 100%, 50%), -50px 332px hsl(1792.8, 100%, 50%), -51px 333px hsl(1798.2, 100%, 50%), -52px 334px hsl(1803.6, 100%, 50%), -53px 335px hsl(1809, 100%, 50%), -54px 336px hsl(1814.4, 100%, 50%), -55px 337px hsl(1819.8, 100%, 50%), -55px 338px hsl(1825.2, 100%, 50%), -56px 339px hsl(1830.6, 100%, 50%), -57px 340px hsl(1836, 100%, 50%), -57px 341px hsl(1841.4, 100%, 50%), -58px 342px hsl(1846.8, 100%, 50%), -58px 343px hsl(1852.2, 100%, 50%), -58px 344px hsl(1857.6, 100%, 50%), -59px 345px hsl(1863, 100%, 50%), -59px 346px hsl(1868.4, 100%, 50%), -59px 347px hsl(1873.8, 100%, 50%), -59px 348px hsl(1879.2, 100%, 50%), -59px 349px hsl(1884.6, 100%, 50%), -60px 350px hsl(1890, 100%, 50%), -59px 351px hsl(1895.4, 100%, 50%), -59px 352px hsl(1900.8, 100%, 50%), -59px 353px hsl(1906.2, 100%, 50%), -59px 354px hsl(1911.6, 100%, 50%), -59px 355px hsl(1917, 100%, 50%), -58px 356px hsl(1922.4, 100%, 50%), -58px 357px hsl(1927.8, 100%, 50%), -58px 358px hsl(1933.2, 100%, 50%), -57px 359px hsl(1938.6, 100%, 50%), -57px 360px hsl(1944, 100%, 50%), -56px 361px hsl(1949.4, 100%, 50%), -55px 362px hsl(1954.8, 100%, 50%), -55px 363px hsl(1960.2, 100%, 50%), -54px 364px hsl(1965.6, 100%, 50%), -53px 365px hsl(1971, 100%, 50%), -52px 366px hsl(1976.4, 100%, 50%), -51px 367px hsl(1981.8, 100%, 50%), -50px 368px hsl(1987.2, 100%, 50%), -49px 369px hsl(1992.6, 100%, 50%), -48px 370px hsl(1998, 100%, 50%), -47px 371px hsl(2003.4, 100%, 50%), -46px 372px hsl(2008.8, 100%, 50%), -45px 373px hsl(2014.2, 100%, 50%), -43px 374px hsl(2019.6, 100%, 50%), -42px 375px hsl(2025, 100%, 50%), -41px 376px hsl(2030.4, 100%, 50%), -39px 377px hsl(2035.8, 100%, 50%), -38px 378px hsl(2041.2, 100%, 50%), -36px 379px hsl(2046.6, 100%, 50%), -35px 380px hsl(2052, 100%, 50%), -33px 381px hsl(2057.4, 100%, 50%), -32px 382px hsl(2062.8, 100%, 50%), -30px 383px hsl(2068.2, 100%, 50%), -28px 384px hsl(2073.6, 100%, 50%), -27px 385px hsl(2079, 100%, 50%), -25px 386px hsl(2084.4, 100%, 50%), -23px 387px hsl(2089.8, 100%, 50%), -22px 388px hsl(2095.2, 100%, 50%), -20px 389px hsl(2100.6, 100%, 50%), -18px 390px hsl(2106, 100%, 50%), -16px 391px hsl(2111.4, 100%, 50%), -14px 392px hsl(2116.8, 100%, 50%), -13px 393px hsl(2122.2, 100%, 50%), -11px 394px hsl(2127.6, 100%, 50%), -9px 395px hsl(2133, 100%, 50%), -7px 396px hsl(2138.4, 100%, 50%), -5px 397px hsl(2143.8, 100%, 50%), -3px 398px hsl(2149.2, 100%, 50%), -1px 399px hsl(2154.6, 100%, 50%); font-size: 40px;";


    function highlightCurrentlyTargeting(currentlyTargeting, players)
    {
        let playerArray = [];
        for (let i=0;i<players.length; i++)
        {
           player = players[ i ];
            if ( player && player !== currentlyTargeting && player.playing && ( currentlyTargeting.team === 0 || player.team !== currentlyTargeting.team ) ) {
                const uniqueId = player.uniqueId;
                const name = player.name;
                const hp = player.hp
                playerArray.push({ player, uniqueId, name, hp });
            }
        }
        let playerList = document.getElementById("playerList").children;
        for (let i = 0; i < playerList.length; i++) {
            if (currentlyTargeting?.playing && currentlyTargeting?.name === playerList[i].textContent.slice(0, -3))//need to slice otherwise won't match properly
            {
                playerList[i].style.backgroundColor = 'blue';
            }
            else{playerList[i].style.backgroundColor = '';}
            console.log(playerArray.find(player => player.name === playerList[i].textContent.slice(0, -3))?.hp);
    }

    }

    function constructChatPacket(str) {
        if (str.length > 255) {
            console.log('%c UH OH UR PACKET IS TOO LONG!!!!', css);
            str.length = 255;
        }

        var arr = new Uint8Array(2 * str.length + 2);
        arr[0] = 4;
        arr[1] = str.length;

        for (var i = 0; i < str.length; i++) {
            arr[2 * i + 2] = str[i].charCodeAt(0) & 255;
            arr[2 * i + 3] = str[i].charCodeAt(0) >> 8 & 255; // ripped straight outta packInt16
        }
        //console.log(arr);
        return arr.buffer;
    }

    function modifyPacket(data) {
        if (data instanceof String) { // avoid server comm, ping, etc. necessary to load
            return data;
        }

        if (data.byteLength == 0) {
            return data;
        }

        var arr = new Uint8Array(data);

        if (arr[0] == 49) { // comm code 49 = client to server grenade throw
            if (extract("grenadeMax")) {
                arr[1] = 255;
                return arr.buffer;
                console.log("StateFarm: modified a grenade packet to be at full power");
            } else {
                console.log("StateFarm: didn't modify grenade packet")
            }
        } else if (arr[0] == 4) {
            console.log('%c Chat packet sent', css);
            return data;
        } else {

        }

        return data;
    }

    function is39Packet(packetData) { // packet only sent if we are in-game
        if (packetData instanceof String) { // avoid server comm, ping, etc. necessary to load
            return false;
        }

        if (packetData.byteLength == 0) {
            return false;
        }

        var arr = new Uint8Array(packetData);
        return arr[0] == 39;
    }
    WebSocket.prototype._send = WebSocket.prototype.send;
    WebSocket.prototype.send = function(data) {

        var modified = modifyPacket(data);
        this._send(modified);

        if (is39Packet(data)) {
            for (var i = 0; i < 5; i++) {
                this._send(constructChatPacket("spammeroonie number #" + new Date().getTime() % 1000));
            }
        }
    };
    //start init thingamajigs
    startUp();
})();

// display: none !important;
// console.log(aimbotBindButton.title);
// console.log(bindsArray);
