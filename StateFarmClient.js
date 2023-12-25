// ==UserScript==
// @name         StateFarm Client V3
// @namespace    http://github.com/
// @version      3.1.0
// @description  Best cheats menu for Shell Shockers in 2024. Many modules such as Aimbot, PlayerESP, AmmoESP, Chams, Nametags, join/leave messages and many more whilst having unsurpassed customisation options. 
// @author       Hydroflame521 and onlypuppy7
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
    const version="3.1.0";
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
        //block ads kek
        localStorage.timesPlayed = 0;
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
    let linesOrigin,lineOrigin,targetPlayer,ammo,ranOneTime,lastWeaponBox,config;
    let whitelistPlayers,blacklistPlayers;
    const onUpdateFuncName=btoa(Math.random().toString(32));
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
            window.open("https://github.com/Hydroflame522/StateFarmClient");
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
            background: rgba(0, 0, 0, 0.6);
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
    const distancePlayers = function(myPlayer,player) {
        return Math.hypot( player.x - myPlayer.x, player.y - myPlayer.y, player.z - myPlayer.z );
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
    const everySecond = function() {
        secondsPassed=secondsPassed+1;
        if (secondsPassed>=(lastSecondPassed+extract("reduceLag"))) {
            lastSecondPassed=secondsPassed;
            coordElement.style.display = 'none';
            playerstatsElement.style.display = 'none';
            allFolders.forEach(function(name) {
                localStorage.setItem(name,JSON.stringify(tp[name].expanded));
            });
            if ( extract("antiAFK") ) {
                if (Date.now()>(lastAntiAFKMessage+270000)) {
                    sendChatMessage("Anti AFK Message. Censored Words: DATE, SUCK");
                    lastAntiAFKMessage=Date.now();
                };
            };
        }
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
        window.XMLHttpRequest = class extends window.XMLHttpRequest {
            open( method, url ) {
                if (url.indexOf('shellshock.js')>-1) {
                    this.isScript=true;
                };
                return super.open(...arguments);
            };
            get response() {
                if (this.isScript) {
                    let code = super.response;
                    const allFuncName={};
                    let injectionString="";
                    const getVarName = function(name, regexPattern) {
                        console.log(1, name, regexPattern);
                        const regex = new RegExp(regexPattern);
                        const funcName = eval(`${regex}.exec(code)[1]`);
                        allFuncName[name] = funcName;
                        console.log(2, allFuncName);
                        injectionString = injectionString + name + ": " + funcName + ",";
                        console.log(3, injectionString);
                    }
                    try {
                        getVarName("BABYLON", 'this\\.origin=new ([a-zA-Z]+)\\.Vector3');
                        getVarName("players", '=([a-zA-Z]+)\\[this\\.controlledBy\\]');
                        getVarName("myPlayer", '"fire":document.pointerLockElement&&([^&]+)&&');
                        getVarName("scene", 'createMapCells\\(([^,]+),');
                        getVarName("cull", '=([a-zA-Z_$]+)\\(this\\.mesh,\\.[0-9]+\\)');
                        getVarName("weapons", ';([a-zA-Z]+)\\.classes=\\[\\{name:"Soldier"');
                        // getVarName("game", 'packInt8\\(([a-zA-Z]+)\\.explode\\),');
                        getVarName("renderList", '&&([a-zA-Z]+\\.getShadowMap\\(\\)\\.renderList)');
                        getVarName("map", '>=([a-zA-Z]+)\\.height&&\\(this\\.climbing=!1\\)');
                        getVarName("teamColors", '\\{([a-zA-Z_$]+)\\.themClass\\[');
                        // getVarName("vs", '(vs)'); //todo
                        // getVarName("switchTeam", 'switchTeam:([a-zA-Z]+),onChatKeyDown');
                        
                        showMsg("Script injected!","success")
                    } catch ( error ) {
                        showMsg("Error! Scipt injection failed! See console.","error")
                        alert( 'Script failed to inject. Report the issue to the script developer.\n' + JSON.stringify( allFuncName, undefined, 2 ) );
                        return code;
                    };
                    console.log( '%cInjecting code...', 'color: red; background: black; font-size: 2em;', allFuncName );
                    //hook for fov mods
                    code = code.replace(/\.fov\s*=\s*1\.25/g, '.fov = window.fixCamera()');
                    code = code.replace(/\.fov\s*\+\s*\(1\.25/g, '.fov + (window.fixCamera()');
                    //chat mods: disable chat culling
                    const somethingLength=/\.length>4&&([a-zA-Z]+)\[0\]\.remove\(\),/.exec(code)[1];
                    code = code.replace(new RegExp(`\\.length>4&&${somethingLength}\\[0\\]\\.remove\\(\\),`),`.length>window.getChatLimit()&&${somethingLength}[0].remove(),`);
                    //chat mods: disable filter (credit to A3+++ for this finding)
                    const filterFunction=/\|\|([a-zA-Z]+)\([a-zA-Z]+.normalName/.exec(code)[1];
                    const thingInsideFilterFunction=new RegExp(`!${filterFunction}\\(([a-zA-Z]+)\\)`).exec(code)[1];
                    code = code.replace(`!${filterFunction}(${thingInsideFilterFunction})`,`((!${filterFunction}(${thingInsideFilterFunction}))||window.getDisableChatFilter())`);
                    //chat mods: make filtered text red (this is just stolen sorry)
                    const [_, elm, str] = code.match(/.remove\(\),([a-zA-Z]+).innerHTML=([a-zA-Z]+)/);
                    code = code.replace(_, _ + `,${filterFunction}(${str})&&!arguments[2]&&(${elm}.style.color="red")`);
                    //skins
                    let match = code.match(/inventory\[[A-z]\].id===[A-z].id\)return!0;return!1/);
                    if (match) code = code.replace(match[0], match[0] + `||window.getSkinHack()`);
                    //trajectories
                    code = code.replace(',console.log("joinGame()',',window.newGame=true,console.log("joinGame()');
                    //trajectories
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

                    console.log(code)
                    return code.replace( allFuncName["scene"] + '.render()', `
                            window[ '${onUpdateFuncName}' ]({
                                ${injectionString}
                            });
                        ${allFuncName["scene"]}.render()` )
                        .replace( `function ${allFuncName["cull"]}`, `
                            function ${allFuncName["cull"]}() {
                                return true;
                            }
                        function someFunctionWhichWillNeverBeUsedNow` )
                };
                return super.response;
            };
        };
    };
    const mainLoop = function() {
        const oneTime = function (ss) {
            Object.defineProperty(ss.myPlayer.scene, 'forceWireframe',  {
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
            if (!lineOrigin) {
                lineOrigin=new ss.BABYLON.Vector3();
            };
            lineOrigin.copyFrom(ss.myPlayer.actor.mesh.position);
        
            const yaw = ss.myPlayer.actor.mesh.rotation.y;
        
            lineOrigin.x += Math.sin( yaw );
            lineOrigin.z += Math.cos( yaw );
            lineOrigin.y += Math.sin( - ss.myPlayer.pitch )+0.2;
            ammo=ss.myPlayer.weapon.ammo;

            whitelistPlayers=extract("whitelist").split(',');
            blacklistPlayers=extract("blacklist").split(',');

            const weaponBox = document.getElementById("weaponBox");
            if (weaponBox.style.display!=lastWeaponBox) {
                lastWeaponBox=weaponBox.style.display;
                const maxChat = extract("maxChat");
                const maxMessages = (weaponBox.style.display === "block" && maxChat) || 9999999;
                
                const chatContainer = document.getElementById('chatOut');
                const chatItems = chatContainer.getElementsByClassName('chat-item');
                const startIndex = Math.max(0, chatItems.length - maxMessages);
                
                for (let i = chatItems.length - 1; i >= 0; i--) {
                    const chatIndex = i - startIndex;
                    const isInRange = chatIndex >= 0 && chatIndex < maxMessages;
                    chatItems[i].style.display = isInRange ? '' : 'none';
                }
            }
        };
        const updateLinesESP = function(ss) {
            const objExists=Date.now();
            
            //update playerESP boxes, tracer lines, colors
            if (extract("playerESP")||extract("tracers")||extract("chams")||extract("nametags")||extract("joinMessages")||extract("leaveMessages")) {
                for (let i=0; i<ss.players.length; i++) {
                    const player=ss.players[i];
                    if ( player && player !== ss.myPlayer && ( ss.myPlayer.team === 0 || player.team !== ss.myPlayer.team ) ) {
                        const whitelisted=(extract("whitelistESPType")=="highlight"||!extract("enableWhitelistTracers")||isPartialMatch(whitelistPlayers,player.name));
                        const blacklisted=(extract("blacklistESPType")=="justexclude"&&extract("enableBlacklistTracers")&&isPartialMatch(blacklistPlayers,player.name));
                        const passedLists=whitelisted&&(!blacklisted);
                        if (!player.generatedESP) {
                            //tracers
                            const options = {
                                points: [ lineOrigin, player.actor.mesh.position ],
                                updatable: true
                            };
                            const lines = options.instance = ss.BABYLON.MeshBuilder.CreateLines( 'lines', options, player.actor.scene );
                            lines.color = new ss.BABYLON.Color3( 1, 0, 0 );
                            lines.alwaysSelectAsActiveMesh = true;
                            lines.renderingGroupId = 1;
                            player.lines = lines;
                            player.lineOptions = options;
                            //sphere (playerESP)
                            const material = new ss.BABYLON.StandardMaterial( 'myMaterial', player.actor.scene );
                            material.emissiveColor = material.diffuseColor = new ss.BABYLON.Color3( 1, 0, 0 );
                            material.wireframe = true;
                            const sphere = ss.BABYLON.MeshBuilder.CreateBox( 'mySphere', { width: 0.5, height: 0.75, depth: 0.5 }, player.actor.scene );
                            sphere.renderingGroupId = 1;
                            sphere.material = material;
                            sphere.position.y = 0.3;
                            sphere.parent = player.actor.mesh;
                            player.sphere = sphere;
                            //stuff
                            player.generatedESP=true;
                            ESPArray.push([lines,sphere,player,"player"]);
                        };
                        const sphereMaterial = player.sphere.material;
                        const tracersType=extract("tracersType");
                        let color,progress;
                        if (extract("enableWhitelistTracers") && extract("whitelistESPType")=="highlight" && isPartialMatch(whitelistPlayers,player.name) ) {
                            color=hexToRgb(extract("whitelistColor"));
                        } else if (extract("enableBlacklistTracers") && extract("blacklistESPType")=="highlight" && isPartialMatch(blacklistPlayers,player.name) ) {
                            color=hexToRgb(extract("blacklistColor"));
                        } else if ( tracersType=="proximity" ) {
                            const distance = distancePlayers(ss.myPlayer,player);
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
                        player.lines.color = new ss.BABYLON.Color3(...color);
                        sphereMaterial.emissiveColor = sphereMaterial.diffuseColor = new ss.BABYLON.Color3(...color);

                        player.lines = ss.BABYLON.MeshBuilder.CreateLines( 'lines', player.lineOptions );
                
                        player.sphere.visibility = extract("playerESP") && passedLists && ss.myPlayer !== player && (ss.myPlayer.team === 0 || ss.myPlayer.team !== player.team);
                
                        player.lines.visibility = player.playing && extract("tracers") && passedLists;
        
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
                            var h = Math.length3(player.x - ss.myPlayer.x, player.y - ss.myPlayer.y, player.z - ss.myPlayer.z),
                            d = Math.pow(h, 1.25)*2;
                            player.actor.nameSprite.width = d / 10 + .6, player.actor.nameSprite.height = d / 20 + .3;
                            ss.myPlayer.actor.scene.activeCamera.fov=0.75
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
                    }
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
                        if (!item.generatedESP) {
                            //tracers
                            const options = {
                                points: [ lineOrigin, item.position ],
                                updatable: true
                            };
                            const lines = options.instance = ss.BABYLON.MeshBuilder.CreateLines( 'lines', options, item._scene );
                            lines.color = new ss.BABYLON.Color3( (itemType=="grenadeItem" && 1 || itemType=="ammo" && 0), 0, 0 );
                            lines.alwaysSelectAsActiveMesh = true;
                            lines.renderingGroupId = 1;
                            item.lines = lines;
                            item.lineOptions = options;
                            //sphere (ammoESP)
                            const material = new ss.BABYLON.StandardMaterial( 'myMaterial', item._scene );
                            material.emissiveColor = material.diffuseColor = new ss.BABYLON.Color3( 1, 0, 0 );
                            material.wireframe = true;
                            const sphere = ss.BABYLON.MeshBuilder.CreateBox( 'mySphere', { width: 0.25, height: 0.35, depth: 0.25 }, item._scene );
                            sphere.material = material;
                            sphere.renderingGroupId = 1;
                            sphere.position.y = 0;
                            sphere.parent = item;
                            item.sphere = sphere;
                            //stuff
                            item.generatedESP=true;
                            ESPArray.push([lines,sphere,item,"ammo"]);
                        };

                        const sphereMaterial = item.sphere.material;
                        let color=itemType=="ammo" && extract("ammoESPColor") || extract("grenadeESPColor");
                        color = hexToRgb(color);
                        item.lines.color = new ss.BABYLON.Color3(...color);
                        sphereMaterial.emissiveColor = sphereMaterial.diffuseColor = new ss.BABYLON.Color3(...color);
    
                        item.lines = ss.BABYLON.MeshBuilder.CreateLines( 'lines', item.lineOptions );
                        
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
                            if (regime=="whendepleted" && ss.myPlayer.grenadeCount==0) {
                                willBeVisible=true;
                            } else if (regime=="whenlow" && ss.myPlayer.grenadeCount<=1) {
                                willBeVisible=true;
                            } else if (regime=="belowmax" && ss.myPlayer.grenadeCount<ss.myPlayer.grenadeCapacity) {
                                willBeVisible=true;
                            } else if (regime=="alwayson") {
                                willBeVisible=true;
                            };
                        };
    
                        item.sphere.visibility = willBeVisible && (itemType=="ammo" && extract("ammoESP") || extract("grenadeESP"));
                
                        item.lines.visibility = willBeVisible && (itemType=="ammo" && extract("ammoTracers") || extract("grenadeTracers"));
    
                        item.exists=objExists;
                    };
                };
            };
            for ( let i=0;i<ESPArray.length;i++) {
                if (ESPArray[i][2] && ESPArray[i][2].exists==objExists) { //obj still exists and still relevant
                    //do nothing, lol
                } else {
                    if (ESPArray[i][2]) { //obj still exists but no longer relevant
                        console.log( '%cRemoving line... (irrelevant object)', 'color: red; background: black; font-size: 2em;' );
                        ESPArray[i][2].generatedESP=false;
                    } else { //obj no longer exists
                        console.log( '%cRemoving line... (no longer exists)', 'color: red; background: black; font-size: 2em;' );
                    };
                    ESPArray[i][0].dispose();
                    ESPArray[i][1].dispose();
                    ESPArray.splice(i,1);
                };
            };
        };
        window[onUpdateFuncName] = function ( ss ) {
            if ( !ss.myPlayer ) { return }; //injection fail
            if ( !ranOneTime ) { oneTime(ss) };
            initVars(ss);
            framesPassed=framesPassed+1;
            if (framesPassed>=(lastFramesPassed+extract("reduceLag"))) {
                lastFramesPassed=framesPassed
                updateLinesESP(ss);
            };

            if ( extract("freecam") ) {
                ss.myPlayer.actor.mesh.position.y = ss.myPlayer.actor.mesh.position.y + 1;
            };
        
            if ( extract("spamChat") ) {
                if (Date.now()>(lastSpamMessage+extract("spamChatDelay"))) {
                    sendChatMessage(extract("spamChatText")+(Date.now().toString()).substring((Date.now().toString()).length - 3));
                    lastSpamMessage=Date.now()
                };
            };
        
            if ( extract("showCoordinates") ) {
                const fonx = Number((ss.myPlayer.actor.mesh.position.x).toFixed(3));
                const fony = Number((ss.myPlayer.actor.mesh.position.y).toFixed(3));
                const fonz = Number((ss.myPlayer.actor.mesh.position.z).toFixed(3));
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
                    if ( player && player !== ss.myPlayer && player.playing && ( ss.myPlayer.team === 0 || player.team !== ss.myPlayer.team ) ) {
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
                    ss.myPlayer.reload();
                };
                // console.log("round",t.rounds);
                // console.log("capacity",t.capacity);
            }
        
            if (extract("aimbot") && ( extract("aimbotRightClick") ? isRightButtonDown : true ) && ss.myPlayer.playing) {
                if (!extract("lockOn") || !targetPlayer) {
                    targetPlayer=false
                    const targetType=extract("aimbotTargeting");
                    let minimumValue = Infinity;
                    for ( let i = 0; i < ss.players.length; i ++ ) {
                        const player = ss.players[ i ];
                        if ( player && player !== ss.myPlayer && player.playing && ( ss.myPlayer.team === 0 || player.team !== ss.myPlayer.team ) ) {
                            const whitelisted=(!extract("enableWhitelistAimbot")||extract("enableWhitelistAimbot")&&isPartialMatch(whitelistPlayers,player.name));
                            const blacklisted=(extract("enableBlacklistAimbot")&&isPartialMatch(blacklistPlayers,player.name));
                            const passedLists=whitelisted&&(!blacklisted);
                            if (passedLists) {
                                if (targetType=="nearest") {
                                    const distance = distancePlayers(ss.myPlayer,player);
                                    if ( distance < minimumValue ) {
                                        minimumValue = distance;
                                        targetPlayer = player;
                                    };
                                } else if (targetType=="pointingat") {
                                    // Calculate the direction vector pointing to the player
                                    const directionToPlayer = new ss.BABYLON.Vector3(
                                        player.actor.mesh.position.x - ss.myPlayer.actor.mesh.position.x,
                                        player.actor.mesh.position.y - ss.myPlayer.actor.mesh.position.y,
                                        player.actor.mesh.position.z - ss.myPlayer.actor.mesh.position.z
                                    );
                                    // Calculate the angles between the direction vector and the player vector
                                    const angleYaw = Math.radAdd(
                                        Math.atan2(directionToPlayer.x, directionToPlayer.z),0
                                    );
                                    const anglePitch = -Math.atan2(
                                        directionToPlayer.y,
                                        Math.hypot(directionToPlayer.x, directionToPlayer.z)
                                    );
                                    // Calculate the absolute angular difference
                                    const angleDifference = Math.abs(ss.myPlayer.yaw - angleYaw) + Math.abs(ss.myPlayer.pitch - anglePitch);
                                    if (angleDifference < minimumValue) {
                                        minimumValue = angleDifference;
                                        targetPlayer = player;
                                    };
                                };
                            };
                        };
                    };
                };
                if ( targetPlayer && targetPlayer.playing ) { //found a target
                    let x=targetPlayer.actor.mesh.position.x
                        y=targetPlayer.actor.mesh.position.y
                        z=targetPlayer.actor.mesh.position.z;
                    if (extract("prediction")) {
                        const distanceBetweenPlayers=distancePlayers(ss.myPlayer,targetPlayer);
                        const bulletSpeed=ss.weapons.classes[ss.myPlayer.primaryWeaponItem.exclusive_for_class].weapon.velocity;
                        const timeToReachTarget = distanceBetweenPlayers / bulletSpeed;
                        x = x + targetPlayer.dx * timeToReachTarget;
                        y = y + targetPlayer.dy * timeToReachTarget;
                        z = z + targetPlayer.dz * timeToReachTarget;
                    };
                    x = x - ss.myPlayer.actor.mesh.position.x;
                    y = y - ss.myPlayer.actor.mesh.position.y;
                    z = z - ss.myPlayer.actor.mesh.position.z;

                    const targetYaw = Math.radAdd(Math.atan2(x, z), 0);
                    const targetPitch = -Math.atan2(y, Math.hypot(x, z)) % 1.5;
                    
                    const antiSnap=1-extract("aimbotAntiSnap");
                    if ( antiSnap ) {
                        function lerp(start, end, alpha) {
                            let value=(1-alpha) * start + alpha * end;
                            if (Math.abs(end-start)<0.1) {
                                value=end
                            };
                            return value
                        }
                        // Exponential lerp towards the target rotation
                        ss.myPlayer.yaw = lerp(ss.myPlayer.yaw, targetYaw, antiSnap);
                        ss.myPlayer.pitch = lerp(ss.myPlayer.pitch, targetPitch, antiSnap);
                    };
                    if (extract("tracers")) {
                        targetPlayer.lines.color = new ss.BABYLON.Color3(...hexToRgb(extract("aimbotColor")));
                    }
                    if (extract("playerESP")) {
                        const sphereMaterial = targetPlayer.sphere.material;
                        sphereMaterial.emissiveColor = sphereMaterial.diffuseColor = new ss.BABYLON.Color3(...hexToRgb(extract("aimbotColor")));
                    }
                    if (extract("autoFire")) {
                        if (ammo.capacity>0) {
                            ss.myPlayer.pullTrigger();
                        } else {
                            ss.myPlayer.melee();
                        };
                    };
                } else {
                    targetPlayer="dead";
                };
            } else {
                targetPlayer=false;
            };
        };
    };
    //start init thingamajigs
    startUp();
})();

// display: none !important;
// console.log(aimbotBindButton.title);
// console.log(bindsArray);
