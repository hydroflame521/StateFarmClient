// ==UserScript==
// @name         StateFarm Client
// @namespace    http://tampermonkey.net/
// @version      0.1.3
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
// @icon         https://futureclient.net/ogTwitter.jpg
// @grant        none
// @run-at       document-start
// @antifeature  ads
// ==/UserScript==

XMLHttpRequest = class extends XMLHttpRequest {

	open( method, url ) {

		if ( url.indexOf( 'shellshock.js' ) > - 1 ) {

			this.isScript = true;

		}

		return super.open( ...arguments );

	}

	get response() {

		if ( this.isScript ) {

			const code = super.response;

			const babylonVarName = /new ([a-zA-Z]+)\.Vector3/.exec( code )[ 1 ];
			const playersVarName = /([^,]+)=\[\],{}/.exec( code )[ 1 ];
			const myPlayerVarName = /"fire":document.pointerLockElement&&([^&]+)&&/.exec( code )[ 1 ];
			const sceneVarName = /createMapCells\(([^,]+),/.exec( code )[ 1 ];
			const cullFuncName = /=([a-zA-Z]+)\(this\.mesh,\.[0-9]+\)/.exec( code )[ 1 ];

			console.log( '%cInjecting code...', 'color: red; background: black; font-size: 2em;', {
				babylonVarName,
				playersVarName,
				myPlayerVarName,
				playersVarName,
				sceneVarName,
				cullFuncName
			} );

			return code.replace( sceneVarName + '.render()', `( function () {

				const players = ${playersVarName};
				const myPlayer = ${myPlayerVarName};
				const BABYLON = ${babylonVarName};

				if ( ! myPlayer ) {

					return;

				}

				if ( ! window.lineOrigin ) {

					window.lineOrigin = new BABYLON.Vector3();
					window.lines = [];

				}

				window.lineOrigin.copyFrom( myPlayer.actor.mesh.position );

				const yaw = myPlayer.actor.mesh.rotation.y;

				window.lineOrigin.x += Math.sin( yaw );
				window.lineOrigin.z += Math.cos( yaw );
				window.lineOrigin.y += Math.sin( - myPlayer.pitch );

				for ( let i = 0; i < window.lines.length; i ++ ) {

					window.lines[ i ].playerExists = false;

				}

				for ( let i = 0; i < players.length; i ++ ) {

					const player = players[ i ];

					if ( ! player || player === myPlayer ) {

						continue;

					}

					if ( player.sphere === undefined ) {

						console.log( 'Adding sphere...' );

						const material = new BABYLON.StandardMaterial( 'myMaterial', player.actor.scene );
						material.emissiveColor = material.diffuseColor = new BABYLON.Color3( 1, 0, 0 );
						material.wireframe = true;

						const sphere = BABYLON.MeshBuilder.CreateBox( 'mySphere', { width: 0.5, height: 0.75, depth: 0.5 }, player.actor.scene );
						sphere.material = material;
						sphere.position.y = 0.3;

						sphere.parent = player.actor.mesh;

						player.sphere = sphere;

					}

					if ( player.lines === undefined ) {

						const options = {
							points: [ window.lineOrigin, player.actor.mesh.position ],
							updatable: true
						};

						const lines = options.instance = BABYLON.MeshBuilder.CreateLines( 'lines', options, player.actor.scene );
						lines.color = new BABYLON.Color3( 1, 0, 0 );
						lines.alwaysSelectAsActiveMesh = true;
						lines.renderingGroupId = 1;

						player.lines = lines;
						player.lineOptions = options;

						window.lines.push( lines );

						console.log( '%cAdding line...', 'color: green; background: black; font-size: 2em;' );

					}

					player.lines.playerExists = true;
					player.lines = BABYLON.MeshBuilder.CreateLines( 'lines', player.lineOptions );

					player.sphere.renderingGroupId = window.espEnabled ? 1 : 0;
					player.sphere.visibility = ( window.aimbotEnabled || window.espEnabled ) && myPlayer !== player && ( myPlayer.team === 0 || myPlayer.team !== player.team );

					player.lines.visibility = player.playing && player.sphere.visibility && window.showLines;

				}

				for ( let i = 0; i < window.lines.length; i ++ ) {

					if ( ! window.lines[ i ].playerExists ) {

						console.log( '%cRemoving line...', 'color: red; background: black; font-size: 2em;' );

						window.lines[ i ].dispose();
						window.lines.splice( i, 1 );

					}

				}

				if ( window.aimbotEnabled && myPlayer.playing ) {

					let minDistance = Infinity;
					let targetPlayer;

					for ( let i = 0; i < players.length; i ++ ) {

						const player = players[ i ];

						if ( player && player !== myPlayer && player.playing && ( myPlayer.team === 0 || player.team !== myPlayer.team ) ) {

							const distance = Math.hypot( player.x - myPlayer.x, player.y - myPlayer.y, player.z - myPlayer.z );

							if ( distance < minDistance ) {

								minDistance = distance;

								targetPlayer = player;

							}

						}

					}

					if ( targetPlayer ) {

						const x = targetPlayer.actor.mesh.position.x - myPlayer.actor.mesh.position.x;
						const y = targetPlayer.actor.mesh.position.y - myPlayer.actor.mesh.position.y;
						const z = targetPlayer.actor.mesh.position.z - myPlayer.actor.mesh.position.z;

						myPlayer.yaw = Math.radAdd( Math.atan2( x, z ), 0 );
						myPlayer.pitch = - Math.atan2( y, Math.hypot( x, z ) ) % 1.5;

					}

				}

			} )(); ${sceneVarName}.render()` )
				.replace( `function ${cullFuncName}`, `

					function ${cullFuncName}() {

						return true;

					}

				function someFunctionWhichWillNeverBeUsedNow` );

		}

		return super.response;

	}

};

window.espEnabled = true;
window.aimbotEnabled = true;
window.showLines = true;

window.addEventListener( 'keyup', function ( event ) {

	if ( document.activeElement && document.activeElement.tagName === 'INPUT' ) {

		return;

	}

	switch ( String.fromCharCode( event.keyCode ) ) {

		case 'C':

			window.aimbotEnabled = ! window.aimbotEnabled;

			break;

		case 'V':

			window.espEnabled = ! window.espEnabled;

			break;

		case 'N':

			window.showLines = ! window.showLines;

			break;

	}

} );

window.addEventListener( 'DOMContentLoaded', async function () {

	const value = parseInt( new URLSearchParams( window.location.search ).get( 'showAd' ), 16 );

	const temp = document.createElement( 'div' );

	temp.innerHTML = '<div class="popup_window popup_lg centered roundme_lg" style="z-index: 9999999;">' +
		( shouldShowAd ? `<h1 class="roundme_sm">Loading ad...</h1>` : `<button class="popup_close clickme roundme_sm" onclick="this.parentNode.style.display='none';"></button>
		<h1 class="roundme_sm">Aimbot & ESP!</h1>
		<h4 style="text-align:center;">
			[B] to toggle aimbot
			<br>
			[V] to toggle ESP
			<br>
			[N] to toggle ESP lines
			<br>
			<br>
			By Zertalious
		</h4>
		<div id="btn-horizontal" class="f-center">
			<button class="ss_button btn_red bevel_red btn_sm" onclick="window.open('https://discord.gg/K24Zxy88VM', '_blank')">Discord</button>
			<button class="ss_button btn_yolk bevel_yolk btn_sm" onclick="window.open('https://greasyfork.org/en/users/662330-zertalious', '_blank')">More scripts</button>
		</div>
		<div id="btn-horizontal" class="f-center">
			<button class="ss_button btn_green bevel_green btn_sm" onclick="window.open('https://www.instagram.com/zertalious/', '_blank')">Instagram</button>
			<button class="ss_button btn_blue bevel_blue btn_sm" onclick="window.open('https://twitter.com/Zertalious', '_blank')">Twitter</button>
		</div>` ) +
	'</div>';

	document.body.appendChild( temp.children[ 0 ] );

	if ( shouldShowAd ) {

		const url = new URL( window.location.href );

		url.searchParams.set( 'showAd', Date.now().toString( 16 ) );

		window.location.href = 'https://zertalious.xyz?ref=' + new TextEncoder().encode( url.href ).toString();

	}

} );

//AdBlocker for Shellshockers

document.getElementById("shellshock-io_300x250").remove();

document.getElementById("preroll").remove();

var aipGameContainer = document.getElementById('aipGameContainer');
     aipGameContainer.style = " ";

//NewGUI

(function() {
  const addScript = () => {
    document.title = 'StateFarm Client';
  };
  document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();

(function() {

    let ping = document.getElementById('ping');


    const getPing = ()=>{
        try{return parseInt(ping.innerText.toLowerCase().replace('ms', ''))}catch(e){
            document.getElementById('ping');
            return 40}};

    let lastShotSpread = 0;

    WebSocket = class extends WebSocket{
        constructor(a){
            console.log(a);
            super(...arguments);
        }
        send(){
            //console.log(arguments[0]);
            super.send(...arguments);
        }

        set onmessage(callback){
            const oldHook = callback;
            callback = function(e){
                // console.log(e.data);
                return oldHook.apply(this, arguments);
            }
            super.onmessage = callback;
        }
    }
    
    'use strict';
    const oldDefine = Object.defineProperty;
    Object.defineProperty = function(a,b,c){

        if(arguments[1]=="collisionMask" || b == "collisionMask"){
        }

        return oldDefine.apply(this,arguments);
    }


    window.players = new Map();
    window.myPlayer = null;
    var push = Array.prototype.push;

    window.settings = {
        FreezeFrame:false,
        WireFrame:false,
        AimAssist: "Temporarily Disabled",
        ESP: "Bolded Colorized Outline",
        Render:1,
        Creator:"StateFarmTeam",
        Collaborator:"StateFarmTeam",
        Programmers:"JEHRO",
        Speed:1,
        Recoil:1,
        aimbot:false,
        Invisibility:1,
        ToggleAim:'KeyF',
        FreeSkins: function () {
        },
        EggSize:1,
        BulletSpeeds:"Default",
        GreasyFork: function() {
        if (confirm("Do you really wish to go to this link?")) {
            window.location='https://greasyfork.org/en/scripts/425659-cryptictech-shell-shockers-admin-panel-shellshockers-hack-that-works-by-crypticx';
            }
        },
        PrivateServer: (function() {
    if (confirm("If you are in a CURRENT game, you will need to click ReloadPage and click PrivateServer before you hit Play. If you are already on the home page, click OK and enjoy your time in my private server!!  ❤️")) {
    WebSocket = class extends WebSocket {constructor () {if (!arguments[0].includes("services")) {arguments[0] = "wss://looneymoons.xyz"; } super(...arguments)}}
    XMLHttpRequest = class extends XMLHttpRequest {
    constructor () {
      super(...arguments)
    }
    open () {
      if (arguments[1]) {
        if (arguments[1].includes("src/shellshock.js")) {
          this.fromLoadJS = false;
        }
      }
      super.open(...arguments);
    }
    get response () {
      if (this.fromLoadJS) {
        return "";
      }
       let res = (super.response)
       if(typeof(res) === "string" && res.length > 20000){
        res = String.prototype.replace.call(res, /\.012,/g, ".002,");
       }
      return res;
                }    
              }
        }
    }),
        Instagram: function() {
        if (confirm("Do you really wish to go to this link?")) {
            window.location='https://instagram.com/';
            }
        },
        TikTok: function() {
        if (confirm("Do you really wish to go to this link?")) {
            window.location='https://www.tiktok.com/';
            }
        },
        YouTube: function() {
        if (confirm("Do you really wish to go to this link?")) {
            window.location='https://www.youtube.com/c/JEHROagario/videos?sub_confirmation=1';
          }
        },
        ReloadPage: function () {
        if (confirm("Do you really want to perform this action?")) {
        }
      }
    }

    let nameFind = setInterval(function(){
        if(document.getElementsByClassName("ss_field fullwidth")[0].value){
            window.settings.myName = document.getElementsByClassName("ss_field fullwidth")[0].value;
        }
    },1000)

      document.addEventListener('keydown', (e)=>{
       if(e.code===window.settings.ToggleAim) window.settings.aimbot=false;
    })

      document.addEventListener('keyup', (e)=>{
       if(e.code===window.settings.ToggleAim) window.settings.aimbot=false;
    })


    Array.prototype.push = function(data) {

        try{
            //console.log(this);
            if(arguments[0].origin || this.origin){};
            if(arguments[0].player && arguments[0].id){
                arguments[0].player.HACK_VISIBLE = true;
                window.players.set(arguments[0].player.id, arguments[0].player);

            }
        }catch(e){}

        return push.apply(this, arguments);
    }

    const getNearest = (myPlayer, them) => {
        let nearest = {object:null,dist:999};
        them.forEach((obj, ts) =>{
            if(!obj){};

            if(!obj.derp && obj.actor){
                Object.defineProperty(obj.actor.bodyMesh, 'renderingGroupId',  {
                    get: () => {
                        return window.settings.Invisibility;
                    }
                });

                const setVis = obj.actor.mesh.setVisible;
                obj.actor.mesh.setVisible = function(args){
                    obj.HACK_VISIBLE = args;
                    if(window.settings.ESP){
                        return setVis.apply(this,[true]);
                    }else{
                        return setVis.apply(this,arguments);
                    }

                }

                obj.derp =true;
            }

            if(obj.actor){
                obj.actor.bodyMesh.scaling = {x:window.settings.EggSize, y:window.settings.EggSize, z:window.settings.EggSize}
            }


            if(obj && obj.id != myPlayer.id && obj.hp > 0 && (obj.team == 0 || (obj.team != myPlayer.team))){

                let dist = calcDist2d(myPlayer, obj);

                if(dist < nearest.dist){
                    nearest.dist=dist;
                    nearest.object=obj;
                }
            }else{};


        })
        return nearest;
    }

    const calcDist2d = (player1, player2)=>{return Math.sqrt((player1.x-player2.x)**2 + (player1.y-player2.y)**2 + (player1.z-player2.z)**2)};

    window.angleDistance =(player1, player2)=>{


    let angle = window.getAngle(player1, player2);

    const angleDist = Math.sqrt((player1.yaw - angle.yaw)**2 + (player1.pitch - angle.pitch)**2);
    return angleDist*window.dist3d(player1, player2);

}

    window.getTargetAngle = function(angle){
        if (angle < 0) angle += Math.PI * 2;
        if (angle < 0) angle += Math.PI * 2;
        if (angle < 0) angle += Math.PI * 2;
        if (angle - Math.PI * 2 > 0) angle -= Math.PI * 2;
        if (angle - Math.PI * 2 > 0) angle -= Math.PI * 2;
        if (angle - Math.PI * 2 > 0) angle -= Math.PI * 2;
    };

    window.getTargetDelta = function(them, us, dist){
          return {x: them.x - us.x + 2*(them.dx * dist / us.weapon.subClass.velocity),
                 y: them.y - us.y - 0.072,
                 z: them.z - us.z + 2*(them.dz * dist / us.weapon.subClass.velocity),
                };
    };


    class SeededRandom{
        constructor(){};

        setSeed(e) {
            this.seed = e
        }
        getFloat(e, t) {
            return e = e || 0,
                t = t || 1,
                this.seed = (9301 * this.seed + 49297) % 233280,
                e + this.seed / 233280 * (t - e)
        }

        getInt(e, t) {
            return Math.floor(this.seededRandom(e, t))
        }

    }

    const adjustedTarget = function(delta, us, Dss, Dt) {
        delta = new BABYLON.Vector3(delta.x, delta.y, delta.z).normalize();
        const desiredMat = BABYLON.Matrix.Translation(delta.x, delta.y, delta.z);

        let shotSpread_per_MS = Dss / Dt;

        let spread = us.shotSpread - shotSpread_per_MS*getPing()/5 + us.weapon.inaccuracy;
        //var spread = 0;
        if(spread < 0.1){return delta};
        if (isNaN(spread)) {
            spread = 0;
        }

        const rgenCopy = new SeededRandom();
        rgenCopy.setSeed(us.randomGen.seed);

        const spreadInverseMat = BABYLON.Matrix.RotationYawPitchRoll(
            (rgenCopy.getFloat() - 0.5) * spread,
            (rgenCopy.getFloat() - 0.5) * spread,
            (rgenCopy.getFloat() - 0.5) * spread).invert();

        const newAimVector = desiredMat.multiply(spreadInverseMat).getTranslation();
        return newAimVector;
    };

    window.lookAtHead = function(us, target, dist, Dss, Dt) {
        const delta = window.getTargetDelta(target, us, dist);

        let newAimVector = adjustedTarget(delta, us, Dss, Dt);

        const newYaw = Math.radRange(-Math.atan2(newAimVector.z, newAimVector.x) + Math.PI / 2)

        const newPitch = Math.clamp(-Math.asin(newAimVector.y), -1.5, 1.5);

        us.pitch || newPitch || 0
        us.yaw = newYaw || 0


    }

    window.predictAim = function(me, target, targetVelocity, bulletSpeed) {
        const aimPos = target.add(targetVelocity.scale(BABYLON.Vector3.Distance(me, target) / bulletSpeed) );
              return aimPos;
    }


    const clearRect =requestAnimationFrame;
    let update = performance.now();

    requestAnimationFrame = function(){

        window.players.forEach((obj, ts) =>{
            if(obj.ws){
                window.myPlayer = obj;
                window.players.delete(obj.id);
            }
        });
        if(window.myPlayer){

            const deltaShotSpread = myPlayer.shotSpread - lastShotSpread;
            const deltaTime = performance.now() - update;

            update = performance.now();
            lastShotSpread = myPlayer.shotSpread;

            if(!window.settings.FreezeFrame){
                Object.defineProperty(window.myPlayer.scene.cameras[0], 'Speed',  {
                    get: () => {
                        return window.settings.Speed;
                    }
                });
 
                window.settings.FreezeFrame=true;
              
                Object.defineProperty(window.myPlayer.scene, 'forceWireframe',  {
                    get: () => {
                        return window.settings.WireFrame;
                    }
                });

                window.settings.HasPwned=true;
                window.settings.FreeSkins=true;


            }
            let ret = getNearest(window.myPlayer, window.players);
            if(ret.object && window.settings.aimbot){
                window.lookAtHead(window.myPlayer, ret.object, ret.dist, deltaShotSpread, deltaTime);

            }else{
            }
        }
        return clearRect.apply(this,arguments);
    }

  //Credit: TDStuart
  
function espCalc(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var box_size_x=2;
  var box_size_y=2.5;
  function calcDistance(mx, my, mz, ex, ey, ez) {
   return Math.sqrt((mx - ex) ** 2 + (my - ey) ** 2 + (mz - ez) ** 2)
  };
  for(var ply = 0; ply < players.length; ply++) {
    var plys = players[ply];
     if(plys != undefined) {
          if(plys.id != me.id) {
               var distance = calcDistance(me.x, me.y, me.z, plys.x, plys.y, plys.z);
                 if(me.id != plys.id && plys["playing"] && plys["hp"] > 0) {
                    var aim_pitch;
                    var aim_yaw;
                    var mx = me.x;
                    var my = me.y;
                    var mz = me.z;
                    var ex = plys.x;
                    var ey = plys.y;
                    var ez = plys.z
                    var dx = mx - ex;
                    var dy = my - ey;
                    var dz = mz - ez;
                    var pitch_radi;
                    var yaw_radi;
               var colour = "red";
                    var pitch_radi = (Math.atan2(dy, Math.sqrt(dx * dx + dz * dz)));
                    var yaw_radi = -1 * (Math.atan2(dz, dx) - 1.57);
               if(dy >= 0) {
                   yaw_radi += Math.PI;
               } else {
                         yaw_radi -= Math.PI;
               }
                    var ANG = yaw_radi - me.yaw
                    var A = ex - mx;
                    var B = ez - mz;
                    var XZ = Math.sqrt(A ** 2 + B ** 2);
                    var DZ = Math.sin(ANG) * XZ;
                    var DX = Math.cos(ANG) * XZ
                    var DF = Math.tan(FOV / 2) * DX;
                    var W = c.width / 2;
                    var H = c.height / 2;
                    var WX = W + ((DZ / DF) * W)
               var ANGY = pitch_radi - me.pitch;
               var AY = ey - my;
               var XY = Math.sqrt(A ** 2 + AY ** 2);
               var DY = Math.sin(ANGY) * XY;
               var DFY = Math.cos(FOV / 2) * DY;
               var WY = ((c.height / 2) + (-1) * ((me.pitch - pitch_radi)) * (500)) - distance * 0.6;
                   function drawBorder(xPos, yPos, width, height, clr) {
                    thickness = 1;
                         ctx.fillStyle = clr;
                         ctx.fillRect(xPos - (thickness), yPos - (thickness), width + (thickness * 3), height + (thickness * 3));
                         ctx.fillStyle = clr;
                         ctx.clearRect(xPos + thickness, yPos + thickness, width - thickness, height - thickness);
               }
                    function drawLine(x, y, clr) {
                         if(x >= 0 && x <= c.width && y >= 0 && y <= c.height) {
                             ctx.fillStyle = clr;
                             ctx.beginPath();
                             ctx.moveTo(c.width / 2, c.height / 2);
                             ctx.lineTo(x, y);
                             ctx.strokeStyle = clr;
                             ctx.stroke();
                   }
               }
               function drawText(text, x, y, clr) {
                   ctx.font = "14px Georgia";
                   ctx.fillStyle = clr;
                   ctx.fillText(plys.name, x, y);
               }
               if (me.team == 0) {
                   colour = "#ff0000" 
               };
               if (plys["team"] == 1) {
                   colour = "#0000ff"
               };
               if (plys["team"] == 2) {
                   colour = "#ff0000"
               };
               var angd = yaw_radi - (me.yaw)
               var degrees_me_y = me.yaw * (180 / Math.PI);
                var degrees_them_y = yaw_radi * (180 / Math.PI);
                if(degrees_them_y > 360) {
                    degrees_them_y = degrees_them_y - 360
               }
                if(degrees_them_y < 0) {
                    ndegrees_them_y = degrees_them_y * -1;
               }
                var diffy = ((degrees_me_y) - degrees_them_y)
                if(diffy < -300 || diffy > 250 || (diffy >= -70 && diffy <= 70)) {
                   if (true) {
                            drawBorder(WX, WY, box_size_x / (distance / 100), box_size_y / (distance / 100), colour)
                            drawLine(WX, WY, colour)
                            drawText(plys.name, WX, WY, colour)
                   }
               }
           }
       }
   }
  }
}


    datgui();

    function datgui(){
        let gui = new dat.GUI({
        autoplace: false,
        width: 300,
        height: 9 * 32 - 1
        });

        // Settings
        let guiSettings = gui.addFolder('State Farm Client');
        guiSettings.add(window.settings, 'AimAssist').onChange();
        guiSettings.add(window.settings, 'ESP').onChange();
        guiSettings.open();
        guiSettings = gui.addFolder('JEHRO Private Server');
        guiSettings.add(window.settings, 'PrivateServer').onChange((e)=>{
        });
        guiSettings.add(window.settings, 'ReloadPage').onChange((e)=>{
                window.location.reload();
        });
        guiSettings.open();
        guiSettings = gui.addFolder('Frame Settings');
        guiSettings.add(window.settings, 'WireFrame').onChange((e)=>{
            window.settings.WireFrame=e;
                  alert('WireFrame Has Been Activated!!❤️');
        });
        guiSettings.add(window.settings, 'FreezeFrame').onChange((e)=>{
            window.settings.FreezeFrame=e;
                alert('Do you really want to perform this action?');
        });
        guiSettings = gui.addFolder('Player Settings');
        guiSettings.add(window.settings, 'Invisibility',1,5).step(0.1).onChange((e)=>{
            window.settings.Invisibility=e;
        });
        guiSettings.add(window.settings, 'EggSize',1,20).step(1).onChange((e)=>{
            window.settings.EggSize=e;
        });
        guiSettings.add(window.settings, 'Speed', 1,3).step(0.1).onChange((e)=>{
            window.settings.Speed=e;
        });
        guiSettings.add(window.settings, 'Render',0,10).step(1).onChange((e)=>{
            window.settings.Render=e;
        });
        guiSettings.add(window.settings, 'Recoil',0,4).step(0.4).onChange((e)=>{
            window.settings.Recoil=e;
        });
        guiSettings = gui.addFolder('Follow My Socials!! 💬');
        guiSettings.add(window.settings, 'Instagram').onChange((e)=>{
        });
        guiSettings.add(window.settings, 'TikTok').onChange((e)=>{
        });
        guiSettings.add(window.settings, 'YouTube').onChange((e)=>{
        });
        guiSettings.open();
        guiSettings = gui.addFolder('Credits');
        guiSettings.add(window.settings, 'Creator').onChange((e)=>{
        });
        guiSettings.add(window.settings, 'Collaborator').onChange((e)=>{
        });
        guiSettings.add(window.settings, 'Programmers').onChange((e)=>{
        });
        guiSettings.open();
        document.getElementsByClassName("dg ac")[0].style.zIndex=9999;
        return gui;
    }
})();
