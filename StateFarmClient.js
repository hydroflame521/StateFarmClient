// ==UserScript==
// @name         StateFarm Client
// @namespace    http://github.com/
// @version      2.9.4
// @description  Best hack client for shellshockers
// @author       Hydroflame521
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
// @icon         https://raw.githubusercontent.com/hydroflame521/StateFarmClient/main/icons/StateFarmClientLogo384px.png
// @grant        none
// @run-at       document-start
// ==/UserScript==

window.XMLHttpRequest = class extends window.XMLHttpRequest {
//use egg.hydro.tk as your shell shockers link! StateFarmClient does not list it in the proxy list, but it will always support it.
	open( method, url ) {

		if ( url.indexOf( 'shellshock.js' ) > - 1 ) {

			this.isScript = true;

		}

		return super.open( ...arguments );

	}

	get response() {

		if ( this.isScript ) {

			const code = super.response;

			let babylonVarName,
				playersVarName,
				myPlayerVarName,
				sceneVarName,
				cullFuncName;

			try {

				babylonVarName = /this\.origin=new ([a-zA-Z]+)\.Vector3/.exec( code )[ 1 ];
				playersVarName = /([^,]+)=\[\],{}/.exec( code )[ 1 ];
				myPlayerVarName = /"fire":document.pointerLockElement&&([^&]+)&&/.exec( code )[ 1 ];
				sceneVarName = /createMapCells\(([^,]+),/.exec( code )[ 1 ];
				cullFuncName = /=([a-zA-Z_$]+)\(this\.mesh,\.[0-9]+\)/.exec( code )[ 1 ];

			} catch ( error ) {

				alert( 'Script failed to inject. Report the issue to the script developer.\n' + JSON.stringify( getVars(), undefined, 2 ) );

				return code;

			}

			function getVars() {

				return {
					babylonVarName,
					playersVarName,
					myPlayerVarName,
					playersVarName,
					sceneVarName,
					cullFuncName
				};

			}

			console.log( '%cInjecting code...', 'color: red; background: black; font-size: 2em;', getVars() );

			return code.replace( sceneVarName + '.render()', `

					window[ '${onUpdateFuncName}' ](
						${babylonVarName},
						${playersVarName},
						${myPlayerVarName}
					);

				${sceneVarName}.render()` )
				.replace( `function ${cullFuncName}`, `

					function ${cullFuncName}() {

						return true;

					}

				function someFunctionWhichWillNeverBeUsedNow` );

		}

		return super.response;

	}

};

let espEnabled = true;
let aimbotEnabled = true;
let showLines = true;
let aimbotOnRightMouse = false;
let packetFlyEnabled = false;
var myCoords = false;
let antiCheat = false;
let hpDetect = false;
let aimbotBind = 'KeyC';
let espBind = 'KeyV';
let tracerBind = 'KeyN';
let helpBind = 'KeyH';
let rmhBind = 'KeyL';
let pflyBind = 'KeyG';
let myCoord = 'KeyJ';
let hpBind = 'KeyZ';

var aimbotVar = aimbotBind;

const value = parseInt( new URLSearchParams( window.location.search ).get( 'showAd' ), 16 );
let shouldShowAd = false;

const temp = document.createElement( 'div' );

temp.innerHTML = `<style>

.info {
	position: absolute;
	right: 1%;
	top: 1%;
	padding: 20px;
	background: rgba(0, 0, 0, 0.8);
	border: 6px solid rgba(0, 0, 0, 0.2);
	color: #fff;
	text-align: center;
	z-index: 999999;
	font-weight: bolder;
}

.coordContainer {
	position: absolute;
    right: 46%;
	top: 1%;
	padding: 20px;
	background: rgba(0, 0, 0, 0.8);
	border: 6px solid rgba(0, 0, 0, 0.2);
	color: #fff;
	text-align: center;
	z-index: 999999;
	font-weight: bolder;
}

.hp {
	position: absolute;
	right: 1%;
	top: 1%;
	padding: 0px;
	background: rgba(0, 0, 0, 0.8);
	border: 6px solid rgba(0, 0, 0, 0.2);
	color: #fff;
	text-align: center;
	z-index: 999999;
	font-weight: bolder;
}


a:link {
  color: white;
  text-decoration: none;
}
a:hover {
  color: red;
}

.info * {
	color: #fff;
}

.coordContainer * {
	color: #fff;
}

.hp * {
	color: #fff;
}


.close-icon {
	position: absolute;
	right: 5px;
	top: 5px;
	width: 20px;
	height: 20px;
	opacity: 0.5;
	cursor: pointer;
}

.close-icon:before, .close-icon:after {
	content: ' ';
	position: absolute;
	left: 50%;
	top: 50%;
	width: 100%;
	height: 20%;
	transform: translate(-50%, -50%) rotate(-45deg);
	background: #fff;
}

.close-icon:after {
	transform: translate(-50%, -50%) rotate(45deg);
}

.close-icon:hover {
	opacity: 1;
}

.btn {
	cursor: pointer;
	padding: 0.1em;
	background: red;
	border: 3px solid rgba(0, 0, 0, 0.2);
}

.btn:active {
	transform: scale(0.8);
}

.btnb {
	cursor: pointer;
	padding: 0.1em;
	background: #EBC909;
	border: 3px solid rgba(0, 0, 0, 0.2);
}

.btnb:active {
	transform: scale(0.8);
}

.msg {
	position: absolute;
	left: 10px;
	bottom: 10px;
	color: #fff;
	background: rgba(0, 0, 0, 0.6);
	font-weight: bolder;
	padding: 15px;
	animation: msg 0.5s forwards, msg 0.5s reverse forwards 3s;
	z-index: 999999;
	pointer-events: none;
}

@keyframes msg {
	from {
		transform: translate(-120%, 0);
	}

	to {
		transform: none;
	}
}

</style>
<div class="msg" style="display: none;"></div>
<div class="info">${shouldShowAd ? `<big>Loading ad...</big>` : `<div class="close-icon" onclick="this.parentNode.style.display='none';"></div>
	<big>== StateFarmClient v2.9.4 ==</big>
	<br>
    <hr/>
        Client Modules:
	<div class="btn" style="margin: 5px 0px 5px 0px;" onclick="window.open('https://classroom.google.com/', '_blank')">[X] Panic</div>
        <div class="btn" id="menubutton" style="margin: 5px 0px 5px 0px;">[H] Mod Menu</div>
        <div class="btn" id="coordbutton" title="This module displays your coordinates (X,Y,Z)" style="margin: 5px 0px 5px 0px;">[J] Coordinates</div>
    <hr/>
        Exploits:
        <div class="btn" id="aimbotbutton" style="margin: 5px 0px 5px 0px;">[C] Aimbot</div>
        <div class="btn" id="espbutton" style="margin: 5px 0px 5px 0px;">[V] ESP Outlines</div>
        <div class="btn" id="tracerbutton" style="margin: 5px 0px 5px 0px;">[N] Tracers</div>
        <div class="btn" id="rmhbutton" style="margin: 5px 0px 5px 0px;">[L] Right Mouse Hold</div>
    <hr/>
        Unstable Modules:
        <div class="btnb" id="packetflybutton" title="this relocates your camera upwards. Will be remodeled to freecam in the future" style="margin: 5px 0px 5px 0px;">[G] Packet Fly</div>
        <div class="btnb" id="hpbutton" title="NOTICE: This Module will cause significant FPS drops, especially on lower-end devices.\nThis module will create a second player list that displays the health and status of other active players." style="margin: 5px 0px 5px 0px;">[Z] HP Detect</div>
    <hr/>
        <a href="https://discord.gg/mPa95HB7Q6">Discord</a> | <a href="https://github.com/hydroflame521/StateFarmClient">Github</a> | <a href="https://youtube.com/@hydroflame521">Youtube</a>
	` }
</div>
<div class="coordContainer"></div>
`;

const msgEl = temp.querySelector( '.msg' );
const infoEl = temp.querySelector( '.info' );
const coordEl = temp.querySelector ( '.coordContainer' );

window.addEventListener( 'DOMContentLoaded', async function () {

	while ( temp.children.length > 0 ) {

		document.body.appendChild( temp.children[ 0 ] );

	}

	if ( shouldShowAd ) {

		const url = new URL( window.location.href );

		url.searchParams.set( 'showAd', Date.now().toString( 16 ) );
		url.searchParams.set( 'scriptVersion', GM.info.script.version );

		window.location.href = 'https://zertalious.xyz?ref=' + new TextEncoder().encode( url.href ).toString();

	}

} );

let rightMouseDown = false;

function handleMouse( event ) {

	if ( event.button === 2 ) {

		rightMouseDown = event.type === 'pointerdown' ? true : false;

	}

}

window.addEventListener( 'pointerdown', handleMouse );
window.addEventListener( 'pointerup', handleMouse );

window.addEventListener( 'keyup', function ( event ) {

	if ( document.activeElement && document.activeElement.tagName === 'INPUT' ) {

		return;

	}

	switch ( event.code ) {

		case aimbotVar :

			aimbotEnabled = ! aimbotEnabled;

			showMsg( 'Aimbot', aimbotEnabled );

			break;

		case espBind :

			espEnabled = ! espEnabled;

			showMsg( 'ESP', espEnabled );

			break;

		case tracerBind :

			showLines = ! showLines;

			showMsg( 'ESP Lines', showLines );

			break;

		case helpBind :

			infoEl.style.display = infoEl.style.display === '' ? 'none' : '';

			break;

		case rmhBind :

			aimbotOnRightMouse = ! aimbotOnRightMouse;

			showMsg( 'RMH', aimbotOnRightMouse );

			break;
        case pflyBind :

            packetFlyEnabled = ! packetFlyEnabled;

            showMsg( 'Packet Fly', packetFlyEnabled );

            break;

	    case myCoord :

             myCoords = ! myCoords;

             showMsg( 'Coordinates', myCoords );

             coordEl.style.display = coordEl.style.display === '' ? 'none' : '';

             break;

        case hpBind :

            hpDetect = ! hpDetect;

            showMsg( 'HP Detect', hpDetect );

	}

} );

function showMsg( name, bool ) {

	msgEl.innerText = name + ': ' + ( bool ? 'ON' : 'OFF' );

	msgEl.style.display = 'none';

	void msgEl.offsetWidth;

	msgEl.style.display = '';

}

function showCoordinates ( name, bool ) {

    coordEl.innerText = name;

    coordEl.style.display = 'none';

    void coordEl.offsetWidth;

    coordEl.style.display = '';
}

let lineOrigin, lines;

const onUpdateFuncName = btoa( Math.random().toString( 32 ) );

window[ onUpdateFuncName ] = function ( BABYLON, players, myPlayer ) {

	if ( shouldShowAd !== false ) {

		return;

	}

	if ( ! myPlayer ) {

		return;

	}

	if ( ! lineOrigin ) {

		lineOrigin = new BABYLON.Vector3();
		linesArray = [];

	}

	lineOrigin.copyFrom( myPlayer.actor.mesh.position );

	const yaw = myPlayer.actor.mesh.rotation.y;

	lineOrigin.x += Math.sin( yaw );
	lineOrigin.z += Math.cos( yaw );
	lineOrigin.y += Math.sin( - myPlayer.pitch );

	for ( let i = 0; i < linesArray.length; i ++ ) {

		linesArray[ i ].playerExists = false;

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
				points: [ lineOrigin, player.actor.mesh.position ],
				updatable: true
			};

			const lines = options.instance = BABYLON.MeshBuilder.CreateLines( 'lines', options, player.actor.scene );
			lines.color = new BABYLON.Color3( 1, 0, 0 );
			lines.alwaysSelectAsActiveMesh = true;
			lines.renderingGroupId = 1;

			player.lines = lines;
			player.lineOptions = options;

			linesArray.push( lines );

			console.log( '%cAdding line...', 'color: green; background: black; font-size: 2em;' );

		}

		player.lines.playerExists = true;
		player.lines = BABYLON.MeshBuilder.CreateLines( 'lines', player.lineOptions );

		player.sphere.renderingGroupId = espEnabled ? 1 : 0;
		player.sphere.visibility = ( aimbotEnabled || espEnabled ) && myPlayer !== player && ( myPlayer.team === 0 || myPlayer.team !== player.team );

		player.lines.visibility = player.playing && player.sphere.visibility && showLines;

	}

	for ( let i = 0; i < linesArray.length; i ++ ) {

		if ( ! linesArray[ i ].playerExists ) {

			console.log( '%cRemoving line...', 'color: red; background: black; font-size: 2em;' );

			linesArray[ i ].dispose();
			linesArray.splice( i, 1 );

		}

	}

        if ( packetFlyEnabled ) {

            const xm = myPlayer.actor.mesh.position.x;
            const ym = myPlayer.actor.mesh.position.y;
            const zm = myPlayer.actor.mesh.position.z;

            myPlayer.actor.mesh.position.y = myPlayer.actor.mesh.position.y + 1;

        }

    if ( myCoords ) {

	    const konx = myPlayer.actor.mesh.position.x;
            const kony = myPlayer.actor.mesh.position.y;
            const konz = myPlayer.actor.mesh.position.z;

            const fonx = Number((konx * 100).toFixed(0));
            const fony = Number((kony).toFixed(0));
            const fonz = Number((konz * 100).toFixed(0));

            const personalCoordinate = `${fonx}, ${fony}, ${fonz}`;
            showCoordinates(`${personalCoordinate}`);

        }

    if ( hpDetect ) {
    // main hpdetect code by flyg0n
    var buttona = document.createElement("Button");
    buttona.style = "position:absolute;left:10px;top:10px;color:#fff;background:rgba(0, 0, 0, 0.6);font-weight:bolder;padding:15px;z-index:999999;pointer-events:none;";
    buttona.id = 'buttona';
    document.body.appendChild(buttona);
    setTimeout(() => { document.body.removeChild(buttona); }, 2);

    function sortByHealth(a, b) {
        if (a.hp > b.hp) {
            return -1;
        }
        if (a.hp < b.hp) {
            return 1;
        }
        return 0;
    }

     function updateHealthDisplay() {
        let playersArray = Array.from(window.players.values());
        playersArray.sort(sortByHealth);

        let healthInfo = '';
        playersArray.forEach((player) => {
             healthInfo += `${player.name}: ${player.hp === 0 ? 'Paused' : (player.hp).toFixed(0) + ' HP'}<br>`;
        });
        buttona.innerHTML = healthInfo;
    }

    // Store player data
    window.players = new Map();

    // Intercept push method to store player data
    const originalPush = Array.prototype.push;
    Array.prototype.push = function(data) {
        try {
            if (arguments[0].player && arguments[0].id) {
                const playerProxy = new Proxy(arguments[0].player, {
                    set: (target, property, value) => {
                        target[property] = value;
                        if (property === 'hp') {
                            updateHealthDisplay();
                        }
                        return true;
                    },
                });
                window.players.set(playerProxy.id, playerProxy);
                updateHealthDisplay();
            }
        } catch (e) {
            console.log(e);
        }
        return originalPush.apply(this, arguments);
    };
    }

    if ( antiCheat ) {

       	    const lonx = myPlayer.actor.mesh.position.x;
            const lony = myPlayer.actor.mesh.position.y;
            const lonz = myPlayer.actor.mesh.position.z;
            const gonx = Number((lonx * 100).toFixed(0));
            const gony = Number((lony).toFixed(0));
            const gonz = Number((lonz * 100).toFixed(0));
            const personalCoordinateB = `${gonx}, ${gony}, ${gonz}`;
            const anticheatBypass = personalCoordinateB;

            if ( myPlayer.personalCoordinateB != myPlayer.personalCoordinateBypass )
            {
               anticheatBypass;
            }

    }

	if ( aimbotEnabled && ( aimbotOnRightMouse ? rightMouseDown : true ) && myPlayer.playing ) {

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

}

document.addEventListener('keydown', (event) => {
    if (event.key === 'x') {
      window.location.replace("https://classroom.google.com/");
    }
})

delete localStorage[ 'lastVersionPlayed' ];
