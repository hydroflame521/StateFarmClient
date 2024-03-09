# StateFarm Client for Shell Shockers

![Discord Shield](https://discordapp.com/api/guilds/988104240000028706/widget.png?style=shield) 

Hack Client for Shell Shockers (shellshock.io). The most feature rich and powerful client to exist for the game. 
It includes **Aimbot**, **ESP**, **Blooms Hacks**, **Botting**, **Custom Binding**, **Highly Customisable Modules**, **Chat Mods** and much much more.
> StateFarm Client V3 is based off [LibertyMutual Client](https://github.com/onlypuppy7/LibertyMutualShellShockers)

- Information accurate as of StateFarm Client v3.3.3-pre7
- _**Join the [Discord](https://discord.gg/Vf5qtxAmvU) server for the latest news**_.

# Table of Contents
1. [Download Sources](#download-sources)
2. [Installation Tutorial](#installation-tutorial)
3. [Getting Started](#getting-started)
4. [Features](#features)
	- [Combat](#-combat)
	- [Render](#-render)
	- [HUD](#-hud)
	- [Chat](#-chat)
	- [Automation](#-automation)
	- [Botting](#-botting)
	- [Miscellaneous](#-misc)
	- [Client & About](#-client-&-about)
5. [Gameplay Strategies](#gameplay-strategies)
6. [Adblocking](#adblocking)
7. [Issues and Troubleshooting](#issues-and-troubleshooting)
8. [Credits and Disclaimer](#credits-and-disclaimer)
   
# [](#download-sources)Download Sources:
- _**Check out our [GitHub repository](https://github.com/Hydroflame522/StateFarmClient)**_.
- _**Install on [GreasyFork](https://greasyfork.org/en/scripts/482982-statefarm-client-v3)**_.
- _**Alternatively, you can use [OpenUserJS](https://openuserjs.org/scripts/onlypuppy7/StateFarm_Client_V3)**_.
  
> For older versions of this client, see: https://github.com/Hydroflame521/StateFarmClient

# [](#installation-tutorial)Installation Tutorial:
Before you can install the client, there are a few things you must set up to be able to run userscripts.
1.  Install the proper version of Tampermonkey from  [https://tampermonkey.net/](https://tampermonkey.net/) or any other userscript manager.
2.  Make sure you are able to open the extension, and go to the dashboard.
Now you are ready to install StateFarm Client:
3.  Go to the [GreasyFork](https://greasyfork.org/en/scripts/482982-statefarm-client-v3) page and press install.
    - Alternatively, go to the Github repository and download/copy [StateFarmClient.js](https://github.com/Hydroflame522/StateFarmClient/blob/main/StateFarmClient.js)
    - You can also use OpenUserJS.
5.  Download the client and install it into your userscript manager of choice.
You are done with installation!
5.  Go to  [https://shellshock.io](https://shellshock.io/)  or one of the shell shockers proxies, and use the client!
6.  Our list of proxies can be found as a file in the "others" folder in this github repository. Have fun!
# [](#getting-started)Getting Started:
> You just installed Statefarm Client. Confused by the dozens of modules, sliders, tabs and panels.

> In order start your journey of Shell Shockers mastery, first learn a few quick tips below.

- H to hide/show Statefarm panel
- Tabs can be clicked to expand/minimize
- The panel is draggable
- J to hide/show bot panel
- P to free cursor mid game, press again to revert

> Here are a few important features you  should use to maximise performance.

### Aimbot
 Aimbot is one of the key features of Statefarm, it is the most powerful combat module. Set it to a key bind you can easily disable/enable as it makes movement difficult.
- All aimbot & releated features are in the _**Combat Tab**_.
- (Use _**Prediction**_ to greatly enhance aimbot accuracy)
- (Use _**ToggleRM**_ if preferred)
- After they are vulnerable, enable aimbot and shoot.
- Disable aimbot and approach the player you wish to kill.
  
### ESP
- Also called wall hacks, allows you to see players locations though walls. A great informative advantage.
- If you wish to use it enable _**PlayerESP**_ and _**Tracers**_ in the _**Render Tab**_.
- You can find a lot of other ESP related features in the _**Render Tab**_ such as Chams.
  
### Bloom Hacks
- Bloom is Shell Shocker's tendency of making the crosshairs bigger and more random if you move/jump etc.
- Statefarm Bloom hacks can predict where the bloom of the bullet will go.
- Bloom hacks drastically improves aim and makes trickshotting easier.
- Enable _**AntiBloom**_ in the _**Combat tab**_ to make the aimbot lock the predicted bloom point instead of crosshair center on targeted players.
- Enable _**ShowBloom**_ in the _**Render tab**_ to show the predicted location of shot.
  
# [](#features) Features:
### Binding Modules:
With the exception of the color pickers and some links, these should all be bindable to a key of your choice. Press the binds button in the tab, and click on the button next to the module you want to bind. Press a key to bind it, or alternatively press Delete to remove the bind. Use this flexibility to your advantage to be more stealthy, or secure more kills. Eg: switch to **Nearest**  targeting when being attacked, and then to  **Pointing At**  when sniping. 

![Binding](https://raw.githubusercontent.com/Hydroflame522/StateFarmClient/main/images/readme/3-1-3/binding.png)

### Module Tagging:

> To help gauge how useful a module is, each has an applied "tag".

- _**Powerful❗❗**_: very powerful modules (such as antibloom, aimbot)
- _**Strong❗**_: less powerful or additional configs of powerful modules (such as los, prediction)
- _**Blatant 🔴**_: very obvious cheat modules the user should avoid excessive usage due to easy detection (such as aimbot).
- _**Stealth ✅**_: modules that makes certain blatant features more difficult to detect (such as 1kill, antiswitch, antisnap). Is **not** enough of a safety net to prevent bans.
- _**Info 💡**_: informative modules that provide info but no direct gameplay advantage (such as esp, HP detect). Rather, strategic advantage is provided.
- _**Troll 🗿**_: annoying or funny modules that do not benefit gameplay wise but can annoy other players.
- _**Utility🔧**_: useful tools of the client, might not directly relate to gameplay.

> A module can have multiple tags.

### [](#combat) Combat:
-   _**Aimbot**_(Powerful❗❗)(Blatant🔴): locks onto targeted player. The player it locks onto is decided by the targeting type, see below.
-   _**TargetMode**_(Strong❗): decides the priority for which player aimbot should target.
	-  _**Pointing At**_: Closest to direction the camera is pointing.
	-  _**Proximity**_: Closest in distance to player.
- _**TargetVisible**_(Strong❗): decides target based on line of sight
	-  _**Disabled**_: disable
	-  _**Prioritise Visible**_: prioritises visible players, only targets players behind walls if none are visible.
	-  _**Only Visible**_: only targets visible players.
-   _**ToggleRM**_(Strong❗)(Stealth ✅): allows for aimbot to be controlled by use of the right mouse button. This option makes it so that the player only locks on while right mouse is held.
-   _**SilentAim**_(Strong❗)(Blatant🔴): shoot at someone without moving your camera. Achieved by changing your direction packets upon shooting. Causes some movement desync for the client. Blatant for other players as they will see flicks.
-  _**NoWallTrack**_(Stealth ✅): aimbot will not track if the targeted player is behind obstacles.
-   _**Prediction**_(Powerful❗❗): predicts where the player will be when bullet reaches them. Works well! Currently working on nearer to 100% y axis accuracy.
-   _**AntiBloom**_(Powerful❗❗): locks the predicted bloom point on to the target player instead of the center crosshair.
-   _**AntiSwitch**_(Stealth ✅): prevents the aimbot from changing targets (locks on to a player).
-   _**1 Kill**_(Stealth ✅): disables aimbot after you've killed your target (doesn't disable the module, but aimbot will consider it's job done. you have to reenable it for it to pick a new target).
-   _**MinAngle**_(Stealth ✅): minimum allowed angle difference between the player's aiming direction and the target's position. This value is in radians. It is different depending on your mode:
	-   SilentAimbot OFF: you will target players at any range, but only aimlock once they are in the range.
 	-   SilentAimbot ON: you will only target players in your specified range.
-   _**AntiSnap**_(Stealth ✅): this feature used to be useless, but has been modified to be quite useful against "botter spotters". Set to a high number (above 0.9) to see effects.
-   _**AntiSneak**_(Strong❗): recommended distance of 1.8, automatically detects and autokills players within this range. Set to 0 to cancel feature. An example usage:
    -   user is targeting someone far away
    -   enemy player sneaks up behind them
    -   inside a radius of 1.8 BOOM! MAGDUMP on them, then switch to pistol and magdump, then reload and continue
    -   think of it like a tripwire where you are aiming on a target, say, and someone trips within your tripwire's radius now you are firing on them
-   _**Aimbot ESP Color**_(Info 💡): the color that should be used to highlight the ESP of a targeted player.
-   _**Auto Refill**_: refills once ammo is used up.
-   _**Smart Refill**_: an extra modifier for AutoRefill, makes it refill at the most optimum point (reduces reload time).
-   _**Auto Fire**_: auto fires with the condition in AutoFireType (below).
-   _**AutoFireType**_:
	- _**Force Automatic**_: hold to shoot, changes guns which normally aren't automatic into ones that are.
	- _**While Visible**_(Strong❗): auto shoots if target is not behind obstacles
	- _**While Aimbotting**_
	- _**Always**_
-   _**GrenadeMAX**_(Strong❗): sets grenades to be thrown to max power immediately without the need of charging.

![combat tab](https://cdn.discordapp.com/attachments/898816619344699436/1201497372056899664/image.png)
### [](#render) Render:
-   _**PlayerESP**_(Info 💡): creates boxes around enemy players.
-   _**Tracers**_(Info 💡): creates lines pointing from the center of the screen to the location of enemy players.
-   _**Chams**_(Info 💡): renders players through walls.
-   _**Nametags**_(Info 💡): enlarges nametags and makes them appear through walls.
-   _**Targets**_(Info 💡): render a red sphere inside players that in theory is optimal for shooting. Aimbot's goal is to align the crosshair to this point.
-   _**PlayerESP Type**_(Info 💡): determines the scheme to be used to colour the tracers/ESP boxes:
    -   _**Static**_(Info 💡): one color is used, determined by Color 1.
    -   _**Proximity**_(Info 💡): fades between Colors 1-3 based on distance and configuration.
-   _**Color 1**_: static color/color to fade to when player is very close.
-   _**Dist 1->2**_: distance from 0 over which to fade to Color 2.
-   _**Color 2**_: color to indicate player is in range, but not very close. Fades from Color 3, and then to Color 1.
-   _**Dist 2->3**_: same idea as before.
-   _**Color 3**_: color to indicate that player is far from close range, and is more suited to sniping.
-   _**Ammo/Grenades Tracers**_(Info 💡): draws lines when enabled to the objects.
-   _**Ammo/Grenades ESP**_(Info 💡): draws boxes around objects when enabled.
-   _**Ammo Regime**_:
    -   _**When Depleted**_: activates when you are out of ammo.
    -   _**When low**_: activates when you can only reload twice or less more times.
    -   _**Below Max**_: activates when you're not at max capacity.
    -   _**Always On**_: self explanatory.
-   _**Grenades Regime**_:
    -   _**When Depleted**_: activates when you are out of grenades.
    -   _**When low**_: activates when you have one remaining grenade.
    -   _**Below Max**_: activates when you're not at max capacity (3 grenades).
    -   _**Always On**_: self explanatory.
-   _**Ammo/Grenades ESP Color**_: self explanatory.
-   _**FOV**_(Utility🔧): changes fov which you see the map ingame. Higher will zoom out more (above 180 will invert).
-   _**Zoom FOV**_(Utility🔧): changes the FOV at which to switch to while holding down the bind related to it (default C). Lower will zoom in more.
-   _**CamWIP**_(Info 💡)(Utility🔧): one day could be freecam. Currently just moves the camera up a bit.
-   _**Wireframe**_(Info 💡)(Utility🔧): renders everything as a wireframe.
-   _**Egg Size**_(Utility🔧): changes size of eggs for lulz.
-   _**SetDetail**_(Utility🔧): detail settings. Automatically sets different combinations of the settings available ingame.
	- Disabled
	- Auto Detail
	- No details
	- Shadows
	- High Res
	- Shadows+High Res
-  _**Textures**_(Utility🔧): show textures or not (mainly affects skybox, most of map does not use textures anyway).

![render tab](https://cdn.discordapp.com/attachments/898816619344699436/1201501695981658152/image.png)
### [](#hud) HUD:
-   _**ShowBloom**_(Info💡): shows the bloom of the next shot as a red dot on screen.
-   _**ShowLOS**_(Info💡): changes crosshair to green/red depending on the line of sight (if aim is obstructed or not) (incomplete).
-   _**Leaderboard**_(Info💡): highlights currently targeted player in blue on leaderboard.
-   _**Co-ords**_(Utility🔧): displays current position in top left corner.
-   _**RadarWIP**_(Info💡): displays other player locations with arrows on screen (work in progress).
-   _**HPDisplay**_(Info💡): displays opponent HPs.
-   _**PlayerStats**_: displays the HP of all the online enemy players (top left).
-   _**GameInfo**_(Info💡): displays information about the game including code, server, type, map, player count.
-   _**ShowStream**_(Info💡)(Utility🔧): shows currently ongoing streams inside a game
![HUD tab](https://cdn.discordapp.com/attachments/898816619344699436/1201501949783187486/image.png)


### [](#chat-tab) Chat:
-   _**InfiniHistory**_(Utility🔧): disables the default limiting of history from 5 messages to no limit.
-   _**HighlightTxt**_(Utility🔧): allows you to highlight text from the chat to copy somewhere else.
-   _**Max Ingame**_(Utility🔧): limits the amount of messages that will be shown whilst playing (this is needed as InfiniHistory will cause messages to go all the way up the left side).
-   _**ShowFiltered**_(Utility🔧): see messages which were filtered for other players. Highlighted in red if a message you or someone else sent has been filtered. *[TIP: use this to your advantage to whisper messages to other StateFarm users!]*
-   _**BypassFilter**_(Utility🔧): bypass chat filter with a certain unicode character.
-   _**TallChat**_(Utility🔧): allows you to make the chat text taller, appends the weird Unicode character "᥊" to the end of every message sent in the chat.
-   _**AntiAFK**_(Utility🔧): sends cencored messages periodically that others players will not see but prevents you from being kicked for afk.
-   _**Spammer**_(Troll 🗿): spams chosen text (very annoying and will make all the players in a game mute you. Also likely to get you banned if they implement a measure against this).
-   _**Delay (ms)**_(Troll 🗿): delay between each message. 0ms works, but higher values at least let people talk somewhat.
-   _**Spam Text**_(Troll 🗿): text to flood the chat with.
-   _**Mock**_(Troll 🗿): repeats whatever other players say and sends to chat, certain keywords trigger different messages
-   _**Announcer**_(Troll 🗿): sents whatever changes to make to you client settings into the chat(e.g aimbot on/off)
-   _**AutoEZ**_(Troll 🗿): whenever you kill a player, sends to chat:
    - "*imagine dying ${currentlyTargetingName}, couldn't be me*"
-   _**CheatAccuse**_(Troll 🗿): whenever you die, sends to chat:
    - "*are you cheating ${currentlyTargetingName}? everyone report*"
-   _**Join Msg**_(Utility🔧): shows messages in that chat for player joins.
-   _**Leave Msg**_(Utility🔧): shows messages in that chat for player leaves.
-   _**Send2Chat**_(Troll 🗿): sends the join/leave messages to chat.
-   _**[SFC]Added**_(Troll 🗿): adds [SFC] infront of all names (**S** tate **F** arm **C** lient).

![chat tab](https://cdn.discordapp.com/attachments/898816619344699436/1197154651125076049/image.png)
### [](#list) Lists:

- **WHITELIST OPTIONS**:
- _**Whitelist**_: enter a list of names to be used with the corresponding whitelist options. They do not need to be complete and partial matches will work. Separate by commas to list multiple.
- _**Whitelist Aimbot**_: only targets the specified player(s). *Warning*: if the player(s) is dead or not found, nothing will be targeted.
- _**Whitelist ESP**_: activates ESP options based on chosen type, info below.
- _**Whitelist ESP Type**_:
- _**Only Include**_: changes the ESP to only show those whitelisted.
- _**Highlight**_: just changes the color of ESP boxes/tracers if the whitelist matches that player.
- _**Whitelist Highlight Color**_: if type selected is *Highlight*, it will use this color and replace the one it had.
- **BLACKLIST OPTIONS**:
- _**Blacklist**_: Same idea as whitelist.
- _**Blacklist Aimbot**_: disables targeting those who match the blacklist.
- _**Blacklist ESP Type**_:
- _**Just Exclude**_: changes the ESP to not display tracers or ESP of blacklisted players.
- _**Highlight**_: just changes the color of ESP boxes/tracers if the blacklist matches that player.
- _**Blacklist Highlight Color**_: self explanatory.

![enter image description here](https://cdn.discordapp.com/attachments/898816619344699436/1194992411693301831/image.png)
## [](#automation) Automation:
- _**AutoWalk**_: walks forward automatically
- _**AutoJump**_: automatically jumps with the delay set
- _**JumpDelay**_: the delay in jumps(ms)
- _**AutoWeapon**_ :automatically chooses the weapon
- _**Auto Grenade**_: automatically grenades with a delay (ineffective)
- _**AutoRespawn**_: automatically respawns
- _**Auto Join**_: self explanatory
- _**Join Code**_: self explanatory
- _**Get code**_: get code for current lobby
- _**Username**_: self explanatory
- _**CopyName**_: copies your name right now

![automation tab](https://cdn.discordapp.com/attachments/898816619344699436/1201504026169188432/image.png)
## [](#botting) Botting:

> To open the botting panel, open it in the botting tab, or press J (default key).

1. **Make sure you have pop-ups enabled for your website.** You can see an article for [Google Chrome here](https://support.google.com/chrome/answer/95472?hl=en-GB&co=GENIE.Platform%3DDesktop#zippy=%2Callow-pop-ups-and-redirects-from-a-site), and for [other browsers see here](https://letmegooglethat.com/?q=how+to+allow+pop-ups+in+firefox%3F).

2. **Configure your settings and press the Deploy button.** For information on what you can configure, see the Botting section of the Modules guide. 


3. **Make sure your windows stay "focused".** See setup below that keeps the windows running. The windows must be partially visible to execute the needed javascript. I don't doubt that there's tools that can trick Windows to do this without having to use this kind of setup.


> An example setup. Host player is on the bottom while the bots are above, stacked so that they are all counted as "active". StateFarm will automatically arrange bots into this formation.

> You can change any setting for all bots in the botting panel and the settings will be automatically applyed to all bots without the need of redeploying them.
<img src="https://github.com/Hydroflame522/StateFarmClient/blob/main/images/readme/3-3-0/Screenshot%202024-01-15%20181034.png?raw=true" alt="SetUp" width="60%">

### Deploy
- _**BotsAmount**_: amount of bots to deploy
- _**Deploy**_: starts the bots
- _**Use Names**_: config the names or not
- _**Bot Name**_: the name your bots will use
- _**Antidupe**_: prevents duplicate names by adding random letters at the end of the name
- _**CopyNames**_: copies names froms other players in the lobby
- _**Don'tKillMe**_: all bots will whitelist you and not target you
- _**Don'tKillBot**_: all bots will whitelist all other bots to prevent your bots from killing each other
- _**Bot Color**_: sets the egg skin color of your bots (default colors only)
- _**Bot Stamp**_: sets the stamp of your bots (default stamps only)
- _**Bot Hat**_: sets the hat of your bots (default hats only)

![deploy tab](https://cdn.discordapp.com/attachments/898816619344699436/1201504761481003018/image.png)
### Manage
- _**Close bots**_: closes all bots
- _**Refresh pages**_: refreshes all bots, might take some time
- _**New Proxies**_: Use new proxies for bots
- _**Unban all**_: unbans all bots
- _**AutoUnbanBot**_: auto unbans if bot is banned
- _**Leave Games**_: Make all bots leave the game
- _**Leave empty**_: leaves the game automatically if game is empty
- _**Spam Report**_: all bots will spam reports
- _**JoinGame**_: auto join game
- _**GameCode**_: code of the game the bots will join
-  _**GetCode**_: gets the code of current game
- _**GameType**_: type of game to join
- _**AutoRegion**_: game region to join
- _**SelectTeam**_: auto join team for bots

![manage tab](https://cdn.discordapp.com/attachments/898816619344699436/1201507767970709544/image.png)
### Params

- _**DoPlay**_: bots will spawn in game
- _**LowRes**_: all bots will use low resolution to make the game run smoother
- _**DoSeizure**_: bots will enable seizure mode 
- _**DoTallChat**_: bots add characters behind messages
- _**DoMock**_: bots will enable mock mode_
- _**DoAutoEZ**_: bots send a certain message on kill
- _**DoChAccuse**_: bots send a certain message on death
- _**DoSpam**_: bots spam in chat
- _**SpamText**_: text bots spam with
- _**SelectWeapon**_: bot's weapon
- _**DoMove**_: bots move forward
- _**DoShoot**_: shoots on sight of enemy. 
- _**DoAimbot**_: enables a set of modules such as predictions, antibloom and of course aimbot. Means the bot will look the direction of a targeted player. 


![params tab](https://cdn.discordapp.com/attachments/898816619344699436/1201510309123326062/image.png)
> You can find information on your deployed bots in the Info tab of the botting panel

## [](#misc) Miscellaneous:
-   _**UnlockSkins**_: unlocks all skins in Shell Shockers locally, other players will not see them.
-  _**AdminSpoof**_: Shows admin options such as boot, ban, info(won't do anything). Doesn't do anything server sided. 
-  _**Unban**_: Unbans the user by forcing signout and resetting the session.
-  _**AutoUnban**_: auto unbans if banned.
-  _**NewProxy**_:  switches to new proxy.
-  _**Reload Page**_: hard reloads the page. 
-  _**Switch focus**_ frees cursor so you can change settings mid game without despawning, press again to resume crosshair control (default P). 
- _**SilentRoll**_: an auto seizure option that allows for moving around.
-  **SEIZURE OPTIONS**: This is intended to cause visual effects similar to an epileptic seizure for other players.

-   _**SeizureX**_: This adds the amount entered in the slider every frame to the yaw. Just enabling this is like helicopter hacks.
-   _**SeizureY**_: This does the same but vertically by modifying pitch (vertical) angle. Enabling just this will make the player appear to be rolling. 
> When both the X and Y options are enabled and high values are entered, the player's yaw/pitch will effectively be random every frame, causing them to look ridiculous.

> Sometimes a side effect of this is that the player model remains skewed even while returning to normal play.

![Misc tab](https://cdn.discordapp.com/attachments/898816619344699436/1201513326744698950/image.png)
## [](#client-&-about) Client & About:
-   _**Hide GUI**_: hides upon pressing the button or the keybind (default H).
-   _**Theme**_: Allows the user to choose from a wide range of themes.
![enter image description here](https://cdn.discordapp.com/attachments/898816619344699436/1201515020224315522/image.png)
-   _**Pop-ups**_: suppose you want to be more "stealthy", you can turn off pop-ups.
-   _**Replace Logo**_: Replaces Shell Shockers logo with a Statefarm logo we made.
-   _**Panic**_: replaces the shell shockers page to a URL of your choice. For educational purposes only.
-   _**Enable Panic**_: if you don't need to use this client for educational purposes only, and it is annoying, you can disable this feature.
-   _**Set Panic URL**_: where it should go.
-   _**Creator's Links**_: to stay up to date.
-   _**Presets**_: preset configs to make your life easier
-   _**Apply Presets**_: apply presets
-   _**Save Preset**_: Save you current settings as a preset
-   _**Remove Preset**_: Deletes preset. Can not delete hardcoded presets.
-   _**Reset**_: deletes all locally stored variables, resetting the client config to defaults.  _Warning_: some are used by the game too so you may lose your saved username and some stats.
-  _**Debug**_: debug for devs. Warning: exposes some variables to the global scope.

![client tab](https://cdn.discordapp.com/attachments/898816619344699436/1201515431324823664/image.png)


# [](#gameplay-strategies)Gameplay Strategies:
-   _**Choose your weapon wisely**_: StateFarm Client synergises with certain weapons better than others, use them to your advantage. 
> Aimbot (especially with prediction enabled) is powerful with weapons that require high levels of aim, and weak with weapons that do not rely on aiming.
>
> Bloom hacks are powerful with weapons with bigger blooms, such as the crackshot.

|                |Range  |Recommended Modules |Strategy                       |
|----------------|----------------|----------|-----------------------------|
|Eggk47![eggk-47](https://cdn.discordapp.com/attachments/898816619344699436/1188361999319580673/latest.png)|Close-mid range fights      |Antibloom greatly enhances DPS|Jump around erratically while emptying magazine with aimbot locked on
|Scrambler![scrambler](https://cdn.discordapp.com/attachments/898816619344699436/1188362258061992016/latest.png?)|Close quarter fights       |Just aimbot is best, with nearest targeting |Appoarch your target, reduce distance, quickly kill          |
|RPEGG ![rpegg](https://cdn.discordapp.com/attachments/898816619344699436/1188362328446599268/latest.png) |Long range|Poor synergies with most modules | Use ESP to predict where they will go, shoot at the floor|
|Free Ranger![free ranger](https://cdn.discordapp.com/attachments/898816619344699436/1188362387217203240/latest.png)   |Long-mid range|Use HoldToFire and Antibloom to quickly deal damage|Walk in a straight line approaching your target, taking advantage of the gun's high ammo count.|
|Whipper![enter image description here](https://cdn.discordapp.com/attachments/898816619344699436/1188362466292416633/latest.png)   |Close-mid range fights|Antibloom greatly enhances DPS|Empty magazine with aimbot locked on, jump around erratically or keep distance at mid range|
|Crackshot  ![crackshot](https://cdn.discordapp.com/attachments/898816619344699436/1188362580067094608/latest.png)     |Sniping/All ranges|In closer ranges, antibloom makes this very powerful. Good for trickshotting|(with prediction) Shoot revealed opponents at long range, or defend yourself when attacked
|Tri-Hard![tri-hard](https://cdn.discordapp.com/attachments/898816619344699436/1188362657040973905/latest.png)      |close-mid (sometimes long) range |Antibloom greatly enhances DPS|Jump around erratically while spamming shots at closer range, scope in and spam at longer range|
|Pistol ![pistol](https://cdn.discordapp.com/attachments/898816619344699436/1188362754805997639/latest.png)      |close-mid range|Antibloom greatly enhances DPS, HoldToFire to turn it automatic|For finishing of opponents/no ammo or to use with worse weapons eg RPEGG|
|Whisk (Melee) ![melee](https://cdn.discordapp.com/attachments/898816619344699436/1188362823433191516/latest.png)     |very close range|No synergies|Lock on with aimbot, follow them and spam whisk while jumping around erratically. It is generally just better to use pistol.|
|Grenades  ![nade](https://cdn.discordapp.com/attachments/898816619344699436/1188362881604005938/latest.png)     |NA|GrenadeMAX|Damage ememies at hard to reach locations (or just make them go away)|

- _**Use lists tab to even further customise the client**_: use blacklist if you're teaming with someone and whitelist if someone talks smack in chat about you.
- _**Use ESP and Chams to reveal all player locations**_: ESP can allow you to see know player locations, even when they are behind walls/obstacles.
- _**Use Ammo/Grenade ESP to reveal all resource locations**_: Make sure you are never short on resources.
- _**Proximity ESP**_: Use it to gather more info about opponent's distance with you.
- _**Prediction**_: Use prediction to greatly enhance aimbot accuracy. If you're using aimbot, there's never a good reason to not use this.
- _**Antibloom**_: Easiest way to do more damage is to enable this. Automatic guns get the biggest advantage, while crackshot and free ranger can be used at close range.
- _**Lock On**_: Use this feature to prevent aimbot from switching targets.

# [](#adblocking)Adblocking
> Advertisments are quite a nuisance in Shell Shockers, and BWD even added Adblock punishments (5 seconds extra waiting time). Luckily, there are multiple methods to remove ads in Shell Shockers reliably and quickly.
 
> This is unspecific to StateFarm Client but is here as a helpful tip for general user experience improvement.

**Procedure:**
1. Install [Ublock Orgin](https://ublockorigin.com/) -  the best blocker. (Note that you should install "[Ublock Origin](https://ublockorigin.com/)" and not "Ublock" they are different.)

2. Go to the Ublock Origin settings.![enter image description here](https://cdn.discordapp.com/attachments/898816619344699436/1194989237431443466/image.png)
3. Enter the "Filter lists" tab.
![enter image description here](https://cdn.discordapp.com/attachments/898816619344699436/1194989547159834634/image.png)
4. Keep the default filter lists and enable "uBlock filters – Annoyances".
![enter image description here](https://cdn.discordapp.com/attachments/898816619344699436/1194990012488482876/image.png)
5. Click the "Apply changes" button on the top.
![enter image description here](https://cdn.discordapp.com/attachments/898816619344699436/1194990278709358642/image.png)
6. You are done! Go to Shell Shockers and enjoy Ad-free gameplay!

> If Adblock is still detected, disable other extensions/userscripts that might interfere with uBlock Orgin's blocking. Also disable built in browser blocking.
# [](#issues-and-troubleshooting)Issues and Troubleshooting


|       Known Issues         |  Solution                                                |
|----------------|---------------------------------------------|
|Stuck on Shellshockers loading screen|Press Crrl + F5 (or fn + F5) until "Script Injected" in shown. This performs a 'hard reset', discarding any cached files which could be causing issues.

> If you have any issues, feel free to contact us in our [Discord server](https://discord.gg/HJuZ24jG).

# [](#credits-and-disclaimer)Credits and Disclaimer

 - **Hydroflame521** for founding the project.

- **Hydroflame521**, **onlypuppy7**, **porcupane**, and **not_food**. for development.

- **de_Neuublue**, **OakSwingZZZ** and **1ust/VillainsRules** for contributed code.

- **susdung** for README additions.

- **Zertalious**: code that used to be present in significantly outdated versions.


## Disclaimer:

We would like to emphasize that we cannot be held accountable for any negative consequences, such as the loss of friendships or a tarnished reputation, that may arise from your decision to use StateFarm client. It is highly likely that such a choice will result in significant displeasure among those around you. We strongly discourage using StateFarm in public lobbies, as it may lead to widespread animosity, potential bans, and the reset of your statistics.
