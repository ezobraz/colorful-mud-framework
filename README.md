# Node JS MUD server and engine
[![Build Status](https://travis-ci.org/ezobraz/colorful-mud-server-node.js.svg?branch=master)](https://travis-ci.org/ezobraz/colorful-mud-server-node.js)
![image](https://status.david-dm.org/gh/ezobraz/colorful-mud-server-node.js.svg)

Multi User Dungeon (MUD) is a multiplayer game that is played online through command line terminal, however can also be played with any MUD client out there (mudlet for example).

This project is an attempt to create the MUD server in javascript.

[![image.png](https://i.postimg.cc/qvmnN2b5/image.png)](https://postimg.cc/3kvW60HX)

# Features
* ### WYSIWYG-like world building.
Everything (locations, npcs, items) can be created from the command line, no need to edit the soruce files.
* ### [nedb](https://github.com/louischatriot/nedb) as a database. 
All data is stored into `/db/*.db` files with json-like syntax
* ### Drawing. 
With `draw` command you can create 8-bit pictures and set them as images for locations  
[![image.png](https://i.postimg.cc/W3xxTFcD/image.png)](https://postimg.cc/JDcpQhnm)
* ### All entities in game have their own classes and are easily customizable. 
For example, sword's condition is not just a number, it is a function that returns the number based on sharpness, quality, date it was created, etc.
* ### Nice player stats  
[![image.png](https://i.postimg.cc/jdcn1zbS/image.png)](https://postimg.cc/PPLqpvJg)
* ### Convenient server logs  
[![image.png](https://i.postimg.cc/XqS3xDJD/image.png)](https://postimg.cc/DJgtw61q)

# Installation
1. Clone this repository `git clone https://github.com/ezobraz/colorful-mud-server-node.js.git .`
2. type `npm i` to install all the dependencies
3. type `npm run start` to run the server
4. open another terminal window (or mud client) and type `telnet localhost 4000`

First account you create will be the "super admin" (it will have all the permissions)
To create your first location, log in into the game and type `location create locationame` where locationname - is the name of your location.

To see all the available commands type `help commands`
