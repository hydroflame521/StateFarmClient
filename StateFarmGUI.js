// ==UserScript==
// @name         StateFarm GUI Addon
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  Aimbot + Tracers + Wallhack; Keybinds V, C, N.
// @author       JakeFromStateFarm
// @match        *://shellshock.io/*
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
// @match        *://mathactivity.xyz/*
// @match        *://math.international/*
// @match        *://geometry.pw/*
// @icon         https://raw.githubusercontent.com/hydroflame521/StateFarmClient/main/StateFarmClientLogo.png
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==
(function () {
 
    const shellMod = {
        interval: null,
        gui: null,
        storedData: {
            scene: null,
            camera: null,
            reticle: null,
            rainbowCrosshairEnabled: false,
            colorDelta: 0.89,
            colorIdx: 0,
            colors: [[], [], []],
            skyColor: "#FFFFFF",
            skyBoxAlpha: 1,
            useSkyColor: false,
            fogDensity: 0.01,
            fogColor: "#FFFFFF",
        },
        replacements: {
            unlockSkins: {
                regex: /inventory\[[A-z]\].id===[A-z].id\)return!0;return!1/,
                replace: "rep = `${match[0]}||true`"
            },
            camera: {
                regex: /.push\(([A-z])\),\w.maxZ=100/,
                replace: "rep = `${match[0]},window.modHelper.camera=${match[1]}`"
            },
            scene: {
                regex: /([A-z][A-z])\.fogDensity=.01\);/,
                replace: "rep = `${match[0]}window.modHelper.scene=${match[1]};`"
            },
            crosshairs: {
                regex: /document.getElementById\("dotReticle"\)/,
                replace: "rep = `${match[0]};window.modHelper.reticle=this;${atob('ZG9jdW1lbnQudGl0bGU=')}=atob('U2hlbGwgU2hvY2tlcnMgfCBNb2RkZWQgYnkgQTMgfCBieSBCbHVlIFdpemFyZCBEaWdpdGFs');`"
            }
        },
        updateSky: function () {
            if (!this.storedData.scene) return;
            let skyMesh = this.storedData.scene.getMeshByID("skyBox");
            if (skyMesh) {
                if (!skyMesh.oldTexture) skyMesh.oldTexture = skyMesh.material.reflectionTexture;
 
                if (this.storedData.useSkyColor) {
                    skyMesh.material.emissiveColor.set(...this.hexToRgb(this.storedData.skyColor));
                    skyMesh.material.reflectionTexture = null;
                    skyMesh.material.alpha = this.storedData.skyBoxAlpha;
 
                } else {
                    skyMesh.material.emissiveColor.set(...this.hexToRgb("#000000"));
                    skyMesh.material.reflectionTexture = skyMesh.oldTexture;
                    skyMesh.material.alpha = 1;
 
                }
            }
        },
        updateFog: function () {
            if (!this.storedData.scene) return;
 
            this.storedData.scene.fogColor.set(...this.hexToRgb(this.storedData.fogColor));
            this.storedData.scene.fogDensity = this.storedData.fogDensity;
        },
        hexToRgb: function (hex) {
            let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255] : [];
        },
        doHooks: function () {
            window.XMLHttpRequest = class extends window.XMLHttpRequest {
                constructor() {
                    super(...arguments);
                }
                open() {
                    if (arguments[1] && arguments[1].includes("shellshock.js")) this.scriptMatch = true;
 
                    super.open(...arguments);
                }
                get response() {
 
                    if (this.scriptMatch) {
                        let responseText = super.response;
 
 
                        let rep;
                        for (let key of Object.keys(shellMod.replacements)) {
 
                            let replacement = shellMod.replacements[key];
                            let match = responseText.match(replacement.regex);
                            if (match) responseText = responseText.replace(match[0], eval(replacement.replace));
                        }
 
                        return responseText;
                    }
                    return super.response;
                }
            };
 
        },
        createGUI: function () {
            this.gui = new guify({
                title: "<b>State Farm Client</b>",
                theme: "dark",
                align: "left",
                width: 300,
                barMode: "none",
                panelMode: "none",
                opacity: 0.90,
                root: window.container,
                open: true
            });
 
            this.gui.panel.menuButton.style.opacity = 0.3;
        },
        loadMod: function () {
            const addScript = function () {
                let script = document.createElement('script');
                script.onload = function () { shellMod.createGUI() };
                script.src = "https://unpkg.com/guify@0.12.0/lib/guify.min.js";
                document.body.appendChild(script);
            }
            document.body ? addScript() : document.addEventListener("DOMContentLoaded", addScript);
 
            this.doHooks();
 
            function HSVtoRGB(h, s, v) {
                var r, g, b, i, f, p, q, t;
                i = Math.floor(h * 6);
                f = h * 6 - i;
                p = v * (1 - s);
                q = v * (1 - f * s);
                t = v * (1 - (1 - f) * s);
                switch (i % 6) {
                    case 0: r = v, g = t, b = p; break;
                    case 1: r = q, g = v, b = p; break;
                    case 2: r = p, g = v, b = t; break;
                    case 3: r = p, g = q, b = v; break;
                    case 4: r = t, g = p, b = v; break;
                    case 5: r = v, g = p, b = q; break;
                }
                return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
            }
 
            for (let wl = 0; wl < 100; wl++) {
                const { r, g, b } = HSVtoRGB(wl / 100.0 * 0.85, 1.0, 1.0);
 
                this.storedData.colors[0].push(r);
                this.storedData.colors[1].push(g);
                this.storedData.colors[2].push(b);
            }
 
            if (!this.interval) {
                this.interval = setInterval(function () {
                    if (shellMod.storedData.rainbowCrosshairEnabled && typeof extern !== "undefined" && extern.inGame) {
                        for (let i = 0; i < 4; i++) {
 
                            let ch = shellMod.storedData.reticle.crosshairs[i];
                            const idx = Math.mod(Math.floor(shellMod.storedData.colorIdx + 30 * i), 100);
 
                            const rgbString = `rgb(${shellMod.storedData.colors[0][idx]}, ${shellMod.storedData.colors[1][idx]}, ${shellMod.storedData.colors[2][idx]})`;
                            ch.style.backgroundColor = rgbString;
                            ch.style.color = rgbString;
 
                        }
 
                        shellMod.storedData.colorIdx += shellMod.storedData.colorDelta;
                        if (shellMod.storedData.colorIdx >= 100) shellMod.storedData.colorIdx = 0;
                    }
                    if (typeof extern !== "undefined" && typeof vueApp !== "undefined") {
                        if (!vueApp.isUpgraded || !extern.account.isSubscriber) { vueApp.setAccountUpgraded(true, ""); extern.account.isSubscriber = true; }
                    }
                }, 33);
            }
        }
 
    }
 
    window.modHelper = {
        set scene(c) { shellMod.storedData.scene = c },
        set camera(c) { shellMod.storedData.camera = c },
        set reticle(c) { shellMod.storedData.reticle = c }
    }
}())
