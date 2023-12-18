 <H1 align="center">State Farm Client</H1> 
Hack Client for Shell Shockers. Starting off as a skid of Zertalious Aimbot, it has been modified to the extent that it is now it's own thing. Now it is one of the most feature rich clients to exist for the game, with custom binding, highly customisable modules, chat mods and more.

Join the discord server for the latest news: https://discord.gg/UTqWuQ7nq8

# Installation tutorial:
Before you can install the client, there are a few things you must set up to be able to run userscripts. 

1. Install the proper version of Tampermonkey from https://tampermonkey.net/

2. Make sure you are able to open the extension, and go to the dashboard.

Now you are ready to install StateFarm Client:

3. Go to the releases tab of this GitHub or download the latest client release from the discord server (listed above in this description).

4. Download the client and install it into Tampermonkey.

You are done with installation!

5. Go to https://shellshock.io or one of the shell shockers proxies, and use the client!

6. Our list of proxies can be found as a file in the "others" folder in this github repository. Have fun!

# Modules Overview:
All buttons in the ClickGUI are fully usable and the majority have bindings associated with them.


<div style="overflow: hidden;">
  <img src="https://raw.githubusercontent.com/Hydroflame522/StateFarmClient/main/icons/gui2.png" height="1500px" style="float: left; margin-right: 20px;" />
  
## Combat Tab:

 - ***Aimbot***: locks onto targeted player. The player it locks onto is decided by the targeting type, see below.
 - ***Aimbot Targeting***: decides the priority for which aimbot should target.
	 - ***Pointing At***: Closest to direction the camera is pointing.
	 - ***Proximity***: Closest in distance to player.
 - ***ToggleRM***: allows for aimbot to be controlled by use of the right mouse button. This option makes it so that the player only locks on while right mouse is held.
 - ***Lock On***: makes it so that while targeting a player, the target does not switch to another one until aimbot is turned back on.
 - ***Prediction***: predicts where the player will be when bullet reaches them. Not very advanced prediction, so does not work against someone jumping around, but works well for player walking straight. Best use is with weapons with slow bullets (Rpegg) at long range).
 - ***Antisnap***: fairly useless feature which creates a smoother transition between selecting a target and focusing on it. Thought it would look less suspect, but does not much at all.
 - ***Aimbot ESP Color***: the color that should be used to highlight the ESP of a targeted player.
 - ***Auto Refill***: refills once ammo is used up.
 - ***Auto Fire***: fires when locked onto target player. More fun than useful.
## Render Tab:
 - ***PlayerESP***: creates boxes around enemy players.
 - ***Tracers***: creates lines pointing from the center of the screen to the location of enemy players.
 - ***Chams***: renders players through walls.
 - ***Nametags***: enlarges nametags and makes them appear through walls.
 - ***PlayerESP Type***: determines the scheme to be used to colour the tracers/ESP boxes:
	 - ***Static***: one color is used, determined by Color 1.
	 - ***Proximity***: fades between Colors 1-3 based on distance and configuration.
 - ***Color 1***: static color/color to fade to when player is very close.
 - ***Dist 1->2***: distance from 0 over which to fade to Color 2.
 - ***Color 2***: color to indicate player is in range, but not very close. Fades from Color 3, and then to Color 1.
 - ***Dist 2->3***: same idea as before.
 - ***Color 3***: color to indicate that player is far from close range, and is more suited to sniping.
 - ***Ammo/Grenades Tracers***: draws lines when enabled to the item.
 - ***Ammo/Grenades ESP***: draws boxes around item when enabled.
 - ***Ammo Regime***:
	 - ***When depleted***: activates when you are out of ammo.
	 - ***When low***: activates when you can only reload twice or less more times.
	 - ***Below max***: activates when you're not at max capacity.
	 - ***Always on***: self explanatory.
 - ***Grenades Regime***:
	 - ***When depleted***: activates when you are out of grenades.
	 - ***When low***: activates when you have one remaining grenade.
	 - ***Below max***: activates when you're not at max capacity (3 grenades).
	 - ***Always on***: self explanatory.
 - ***Ammo/Grenades ESP Color***: self explanatory.
 - ***FOV***: changes fov which you see the map ingame. Higher will zoom out more (above 180 will invert).
 - ***Zoom FOV***: changes the FOV at which to switch to while holding down the bind related to it (default C). Lower will zoom in more.
 - ***CamWIP***: one day could be freecam. Currently just moves the camera up a bit.
 - ***Co-ords***: displays current position in top left corner.
 - ***PlayerStats***: displays the HP of all the online enemy players.
 - ***Wireframe***: renders everything as a wireframe.
 - ***Egg size***: changes size of eggs for lulz.
## Chat Tab:
 - ***InfiniHistory***: disables the default limiting of history from 5 messages to no limit.
 - ***DisableFilter***: see messages which were filtered for other players! Highlighted in red if a message you or someone else sent has been filtered on non-modified games.
 - ***HighlightTxt***: allows you to highlight text from the chat to copy somewhere else.
 - ***Max Ingame***: limits the amount of messages that will be shown whilst playing (this is needed as InfiniHistory will cause messages to go all the way up the left side).
 - ***Spammer***: spams chosen text (very annoying and will make all the players in a game mute you. Also likely to get you banned if they implement a measure against this).
 - ***Delay (ms)***: delay between each message. 0ms works, but higher values at least let people talk somewhat.
 - ***Spam Text***: text to flood the chat with.
## Lists Tab:
 - WHITELIST OPTIONS:
 - ***Whitelist***: enter a list of names to be used with the corresponding whitelist options. They do not need to be complete and partial matches will work. Separate by commas to list multiple.
 - ***Whitelist Aimbot***: only targets the specified player(s). *Warning*: if the player(s) is dead or not found, nothing will be targeted.
 - ***Whitelist ESP***: activates ESP options based on chosen type, info below.
 - ***Whitelist ESP Type***:
	 - ***Only Include***: changes the ESP to only show those whitelisted.
	 - ***Highlight***: just changes the color of ESP boxes/tracers if the whitelist matches that player.
 - ***Whitelist Highlight Color***: if type selected is *Highlight*, it will use this color and replace the one it had.
 - BLACKLIST OPTIONS:
 - ***Blacklist***: Same idea as whitelist.
 - ***Blacklist Aimbot***: disables targeting those who match the blacklist.
 - ***Blacklist ESP Type***:
	 - ***Just Exclude***: changes the ESP to not display tracers or ESP of blacklisted players.
	 - ***Highlight***: just changes the color of ESP boxes/tracers if the blacklist matches that player.
 - ***Blacklist Highlight Color***: self explanatory.

> As you can see, you can use the Lists tab to even further customise the client. Hint: use blacklist if you're teaming with someone and whitelist if someone talks smack in chat about you.
## Misc Tab:

 - ***Hide GUI***: hides upon pressing the button or the keybind (default H).
 - ***Pop-ups***: suppose you want to be more "stealthy", you can turn off pop-ups.
 - ***Panic***: replaces the shell shockers page to a URL of your choice. For educational purposes only.
 - ***Enable Panic***: if you don't need to use this client for educational purposes only, and it is annoying, you can disable this feature.
 - ***Set Panic URL***: where it should go.
 - ***Creator's Links***: to stay up to date.
 - ***Reset***: deletes all locally stored variables, resetting the client config to defaults. *Warning*: some are used by the game too so you may lose your saved username and some stats.
## Binding Modules:
With the exception of the color pickers and some links, these should all be bindable to a key of your choice. Press the binds button in the tab, and click on the button next to the module you want to bind. Press a key to bind it, or alternatively press Delete to remove the bind. Use this flexibility to your advantage to be more stealthy, or secure more kills. Eg: switch to **Nearest** targeting when being attacked, and then to **Pointing At** when sniping.
## Disclaimer:
We are not responsible for your loss of friends if you use this with them. It certainly will make them upset so I would advise against it. If you use this in public lobbies, everyone will hate you, and you risk getting banned and having your stats reset. BWD may at any point implement detectors for StateFarm and ban your IP address.
</div>



# Credits:
- Zertalious for angles, rendering and other hooks. Credit also for base code.
- Hydroflame521 and onlypuppy7
