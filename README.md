# Colorful MUD Framework
![image](https://status.david-dm.org/gh/ezobraz/colorful-mud-server-node.js.svg)

<img src="https://i.postimg.cc/x87Mw6FG/image.png">

__Colorful MUD Framework__ or __CMF__ is an open source MUD Framework you can use to build your own MUD games.

Multi User Dungeon (MUD) is a multiplayer game that is played online through command line interface (terminal), however can also be played with any MUD client out there (mudlet for example).

<img src="https://i.postimg.cc/qvmnN2b5/image.png" width="350"> <img src="https://i.postimg.cc/jdcn1zbS/image.png" width="350"> 
<img src="https://i.postimg.cc/fRHtp2tV/image.png" width="350"> <img src="https://i.postimg.cc/W3xxTFcD/image.png" width="180">

# Features

* Modular. You can create your own modules (see `modules` folder for some examples) to extend the game

* WYSIWYG-like world building. Everything (locations, npcs, items) can be created from the command line, no need to edit the source files.

* i18n. All game texts are translatable.

* [Nedb](https://github.com/louischatriot/nedb) as a database. All data is stored in `/db/*.db` files with json-like syntax.

* Drawing. You can create 8-bit pictures and set them as images for locations.

* All entities in game have their own classes and are easily customizable. For example, sword's condition is not just a number, it is a function that returns the number based on sharpness, quality, date it was created, etc.

* Convenient server logs.

# Getting Started
### Required packages
1. node.js >= 10, npm (`sudo apt-get update && sudo apt-get install nodejs`)

### Installation
1. Create an empty folder somewhere, navigate there with your terminal (`mkdir mymud && cd mymud`)
1. Clone this repository there `git clone https://github.com/ezobraz/colorful-mud-server-node.js.git .`
2. Type `npm i` to install all the dependencies
3. Type `npm run start` to run the server
4. Open another terminal window (or mud client) and type `telnet localhost 4000`

# First steps
First account you create will be the "super admin" (it will have all the permissions).
To create your first location, log into the game and type `create location town Town Name` where `town` - is the type of the location (it can be set to town, village, nature, castle, dungeon or room) and `Town Name` is the name of your location.

To see the list of all available commands type `help commands`.

# Configuration
To change the settings, copy `config/config.default.json` to `config/config.json` and make edits there.

# Modules
If you  want to create your own module, first please take a look at the modules that are already included in `modules` folder in order to get good understanging of how they work, what file structure you should follow, etc.

Copy and paste one of the modules and make some edits.

To make the server load the module you created, simply put it's folder's name in `config/config.json` file, under the `modules` category and restart the server.

# API Documentation
Run `npm run build-docs`, it will create `docs` folder with API documentation so you can see all the game etities with their methods, global events, etc.
