# State Farm Client

Hack Client for Shell Shockers(shellshock.io). The most feature rich and powerful client to exist for the game, with custom binding, highly customisable modules, chat mods and more.

Join the discord server for the latest news:  [https://discord.gg/UTqWuQ7nq8](https://discord.gg/UTqWuQ7nq8)

# Table of Contents

1. [Installation Tutorial](#installation-tutorial)
2. [Features](#features)
3. [Gameplay Strategies](#gameplay-strategies)
4. [Anti-Detection:](#anti-detection)
5. [Issues and Troubleshooting](#issues-and-troubleshooting)
6. [Credits and Disclaimer](#credits-and-disclaimer)


# [](https://github.com/Hydroflame522/StateFarmClient/blob/main/README.md#installation-tutorial)Installation Tutorial:

Before you can install the client, there are a few things you must set up to be able to run userscripts.

1.  Install the proper version of Tampermonkey from  [https://tampermonkey.net/](https://tampermonkey.net/) or any other userscript manager.
    
2.  Make sure you are able to open the extension, and go to the dashboard.
    

Now you are ready to install StateFarm Client:

3.  Go to the releases tab of this GitHub or download the latest client release from the discord server (listed above in this description).
    
4.  Download the client and install it into Tampermonkey.
    

You are done with installation!

5.  Go to  [https://shellshock.io](https://shellshock.io/)  or one of the shell shockers proxies, and use the client!
    
6.  Our list of proxies can be found as a file in the "others" folder in this github repository. Have fun!

# [](https://github.com/Hydroflame522/StateFarmClient/blob/main/README.md#features)Features:
## Combat Tab:

-   _**Aimbot**_: locks onto targeted player. The player it locks onto is decided by the targeting type, see below.
-   _**Aimbot Targeting**_: decides the priority for which aimbot should target.
    -   _**Pointing At**_: Closest to direction the camera is pointing.
    -   _**Proximity**_: Closest in distance to player.
-   _**ToggleRM**_: allows for aimbot to be controlled by use of the right mouse button. This option makes it so that the player only locks on while right mouse is held.
-   _**Lock On**_: makes it so that while targeting a player, the target does not switch to another one until aimbot is turned back on.
-   _**Prediction**_: predicts where the player will be when bullet reaches them. Not very advanced prediction, so does not work against someone jumping around, but works well for player walking straight.
-   _**Antisnap**_: fairly useless feature which creates a smoother transition between selecting a target and focusing on it. Thought it would look less suspect, but does not much at all.
-   _**Aimbot ESP Color**_: the color that should be used to highlight the ESP of a targeted player.
-   _**Auto Refill**_: refills once ammo is used up.
-   _**Auto Fire**_: fires when locked onto target player. More fun than useful.
-
![combat tab](https://cdn.discordapp.com/attachments/898816619344699436/1188351975415365752/image.png?)

## Render Tab:

-   _**PlayerESP**_: creates boxes around enemy players.
-   _**Tracers**_: creates lines pointing from the center of the screen to the location of enemy players.
-   _**Chams**_: renders players through walls.
-   _**Nametags**_: enlarges nametags and makes them appear through walls.
-   _**PlayerESP Type**_: determines the scheme to be used to colour the tracers/ESP boxes:
    -   _**Static**_: one color is used, determined by Color 1.
    -   _**Proximity**_: fades between Colors 1-3 based on distance and configuration.
-   _**Color 1**_: static color/color to fade to when player is very close.
-   _**Dist 1->2**_: distance from 0 over which to fade to Color 2.
-   _**Color 2**_: color to indicate player is in range, but not very close. Fades from Color 3, and then to Color 1.
-   _**Dist 2->3**_: same idea as before.
-   _**Color 3**_: color to indicate that player is far from close range, and is more suited to sniping.
-   _**Ammo/Grenades Tracers**_: draws lines when enabled to the item.
-   _**Ammo/Grenades ESP**_: draws boxes around item when enabled.
-   _**Ammo Regime**_:
    -   _**When depleted**_: activates when you are out of ammo.
    -   _**When low**_: activates when you can only reload twice or less more times.
    -   _**Below max**_: activates when you're not at max capacity.
    -   _**Always on**_: self explanatory.
-   _**Grenades Regime**_:
    -   _**When depleted**_: activates when you are out of grenades.
    -   _**When low**_: activates when you have one remaining grenade.
    -   _**Below max**_: activates when you're not at max capacity (3 grenades).
    -   _**Always on**_: self explanatory.
-   _**Ammo/Grenades ESP Color**_: self explanatory.
-   _**FOV**_: changes fov which you see the map ingame. Higher will zoom out more (above 180 will invert).
-   _**Zoom FOV**_: changes the FOV at which to switch to while holding down the bind related to it (default C). Lower will zoom in more.
-   _**CamWIP**_: one day could be freecam. Currently just moves the camera up a bit.
-   _**Co-ords**_: displays current position in top left corner.
-   _**PlayerStats**_: displays the HP of all the online enemy players.
-   _**Wireframe**_: renders everything as a wireframe.
-   _**Egg size**_: changes size of eggs for lulz.
- 
- ![render tab](https://cdn.discordapp.com/attachments/898816619344699436/1188352803131891823/image.png?)


## Chat Tab:

-   _**InfiniHistory**_: disables the default limiting of history from 5 messages to no limit.
-   _**DisableFilter**_: see messages which were filtered for other players! Highlighted in red if a message you or someone else sent has been filtered on non-modified games.
-  _**AntiAFK**_: sends cencored messages periodically that others players will not see but prevents you from being kicked for afk.
-  _**Join msg**_: shows messages in that chat for player joins
-  _**Leave msg**_: shows messages in that chat for player leaves
-   _**HighlightTxt**_: allows you to highlight text from the chat to copy somewhere else.
-   _**Max Ingame**_: limits the amount of messages that will be shown whilst playing (this is needed as InfiniHistory will cause messages to go all the way up the left side).
-   _**Spammer**_: spams chosen text (very annoying and will make all the players in a game mute you. Also likely to get you banned if they implement a measure against this).
-   _**Delay (ms)**_: delay between each message. 0ms works, but higher values at least let people talk somewhat.
-   _**Spam Text**_: text to flood the chat with.

![chat tab](https://cdn.discordapp.com/attachments/898816619344699436/1188354106453147648/image.png)

## Misc Tab:

-   _**Unlock skins**_: unlocks all skins in shellshockers locally, other players will not see them.

![Misc tab](https://cdn.discordapp.com/attachments/898816619344699436/1188354584658329650/image.png)


## Client & About:

-   _**Hide GUI**_: hides upon pressing the button or the keybind (default H).
-   _**Reduce lag**_: reduces lag that the client causes; bigger numbers for more lag reduction. 
-   _**Pop-ups**_: suppose you want to be more "stealthy", you can turn off pop-ups.
-   _**Panic**_: replaces the shell shockers page to a URL of your choice. For educational purposes only.
-   _**Enable Panic**_: if you don't need to use this client for educational purposes only, and it is annoying, you can disable this feature.
-   _**Set Panic URL**_: where it should go.
-   _**Creator's Links**_: to stay up to date.
-   _**Reset**_: deletes all locally stored variables, resetting the client config to defaults.  _Warning_: some are used by the game too so you may lose your saved username and some stats.

![client tab](https://cdn.discordapp.com/attachments/898816619344699436/1188354874577002516/image.png)
## Binding Modules:

With the exception of the color pickers and some links, these should all be bindable to a key of your choice. Press the binds button in the tab, and click on the button next to the module you want to bind. Press a key to bind it, or alternatively press Delete to remove the bind. Use this flexibility to your advantage to be more stealthy, or secure more kills. Eg: switch to  **Nearest**  targeting when being attacked, and then to  **Pointing At**  when sniping.

# [](https://github.com/Hydroflame522/StateFarmClient/blob/main/README.md#gameplay-strategies)Gameplay Strategies:
-   _**Choose your weapon wisely**_: Statefarm client synergies with certian weapons better than others, use them to your advantage. 
> Aimbot (especially with prediction enabled) in powerful with weapons that require high levels of aim, and weak with weapons that do not rely on aiming.
> 
|                |Aimbot synergies                 |Strategy                       |
|----------------|-------------------------------|-----------------------------|
|Eggk47![eggk-47](https://cdn.discordapp.com/attachments/898816619344699436/1188361999319580673/latest.png)|close-mid range fights      |Jump around erratically while emptying magazine with aimbot locked on
|Scrambler![scrambler](https://cdn.discordapp.com/attachments/898816619344699436/1188362258061992016/latest.png?)|close quarter fights       |appoarch your target, reduce distance, quickly kill          |
|RPEGG ![rpegg](https://cdn.discordapp.com/attachments/898816619344699436/1188362328446599268/latest.png) |not good with aimbot|use esp to predict where they will go, shoot at the floor|
|Free Ranger![free ranger](https://cdn.discordapp.com/attachments/898816619344699436/1188362387217203240/latest.png)   |long-mid range|lock on your target and quickly spam shots with prediction|
|Whipper  ![whipper](https://cdn.discordapp.com/attachments/898816619344699436/1188362466292416633/latest.png)     |close-mid range fights|Jump around erratically while emptying magazine with aimbot locked on|
|Crackshot  ![crackshot](https://cdn.discordapp.com/attachments/898816619344699436/1188362580067094608/latest.png)     |Sniping|(with prediction) shot revealed opponents at long range, or defend yourself when attacked
|Tri-Hard![tri-hard](https://cdn.discordapp.com/attachments/898816619344699436/1188362657040973905/latest.png)      |close-mid (sometimes long) range |Jump around erratically while spamming shots at closer range, scope in and spam at longer range|
|Pistol ![pistol](https://cdn.discordapp.com/attachments/898816619344699436/1188362754805997639/latest.png)      |close-mid range|for finishing or opponents/no ammo|
|Whisk(Melee) ![melee](https://cdn.discordapp.com/attachments/898816619344699436/1188362823433191516/latest.png)     |close range|lock on with aimbot, follow them and spam whisk while jumping around erratically|
|Grenades  ![nade](https://cdn.discordapp.com/attachments/898816619344699436/1188362881604005938/latest.png)     |no use with aimbot|damage ememies at hard to reach locations (or just make them go away)|

-   _**Use lists tab to even further customise the client**_: use blacklist if you're teaming with someone and whitelist if someone talks smack in chat about you.
-  _**Use ESP to reveal all player locations**_: ESP can allow you to see know player locations, even when they are behind walls/obstacles
- _**Use Ammo/Grenade ESP to reveal all resource locations**_: Make sure you are never short on resources.
- _**Proximity ESP**_: use it to gather more info about opponent's distance with you
- _**Prediction**_: use predition to enhnce aimbot accuracy
- _**Lock On**_: use this feature to prevent aimbot from switching targets


# [](https://github.com/Hydroflame522/StateFarmClient/blob/main/README.md#anti-detection)Anti-Detection:
> BWD has appointed **Eggforcers** that will ban cheaters by **first-person spectating** them.

_**Eggforcers are likely to spectate you if**_:
- You have been reported by other players.
- They are in the same lobby with you and suspects you for cheating.

**Banning**:
![ban](https://cdn.discordapp.com/attachments/977271202924097588/1186465326192402614/image.png)

> This is the ban interface. It allows banning of 15, 20, and 60 minutes. Can only be used by Developers/Eggforcers.


**Ban Circumvention**:
> It is advised to not use an account while useing Statefarm.
> If you are banned, simiply deleted cookies and cache of the site and go back.

# [](https://github.com/Hydroflame522/StateFarmClient/blob/main/README.md#issues-and-troubleshooting)Issues and Troubleshooting


|       Know Issues         |  Solution                                                |
|----------------|---------------------------------------------|
|Stuck on Shellshockers loading screen|Press F5(or fn + F5) untill "Script Injected" in shown.

> If you have any issues, feel free to contact use in our discord server.
> https://discord.gg/HJuZ24jG

# [](https://github.com/Hydroflame522/StateFarmClient/blob/main/README.md#credits-and-disclaimer)Credits and Disclaimer

-  Zertalious for angles, rendering and other hooks. Credit also for base code.
-  Hydroflame521 and onlypuppy7 for main development
- Susdung for readme file.

## Disclaimer:

We are not responsible for your loss of friends if you use this with them. It certainly will make them upset so I would advise against it. If you use this in public lobbies, everyone will hate you, and you risk getting banned and having your stats reset. BWD may at any point ban you for cheating.
