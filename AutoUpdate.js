// ==UserScript==
// @name         StateFarmClient AutoUpdate
// @version      v1.1.2
// @description  Experimental Auto-Update for StateFarmClient
// @author       JakeFromStateFarm
// @match        *://shellshock.io/*
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

let src="https://raw.githubusercontent.com/hydroflame521/StateFarmClient/main/StateFarmClient.js";
function injectStateFarm() {
  if (document.body) {
    var e = document.createElement("script");
    e.src = src, e.type = "text/javascript", document.body.appendChild(e);
    let o = setInterval(function() {
      unsafeWindow.hack && (unsafeWindow.onloadingcomplete(), clearInterval(o), console.log("%cInjecting State Farm Client!", "color:red;font-family:monospace;font-size: 20px;font-weight: bold;"))
    }, 1);
    setTimeout(function() {
      unsafeWindow.hack || alert(`Client could not be Injected!. The hosting site may be down. \n Check if ${src} is working`)
    }, 1e4)
  } else setTimeout(loadCrackWare, 10)
}
if (unsafeWindow.bypass = "v2", unsafeWindow.Loader.loaded[0]) {
  console.warn("ShellShock script already loading using old loader method.");
  let e = function() {},
    o = 0,
    n = !1;
  Object.defineProperty(unsafeWindow, "onloadingcomplete", {
    get: () => e,
    set(t) {
      console.log(arguments, o, !!unsafeWindow.hack), ++o > 1 && (e = t, n = !0), n || loadCrackWare()
    },
    configurable: !1
  });
}
else {
  // New loader method. Thanks @helloworld#6969#3059 for the idea!
  unsafeWindow.injectStateFarm = injectStateFarm;
  let e = Object.getOwnPropertyDescriptor(unsafeWindow.XMLHttpRequest.prototype, "response"),
    o = e.get;
  Object.defineProperty(unsafeWindow.XMLHttpRequest.prototype, "response", {
    ...e,
    get: function() {
      return this.responseURL.includes("src/shellshock.js") ? "window.onloadingcomplete = window.injectStateFarm;" : o.apply(this, arguments)
    }
  });
}
