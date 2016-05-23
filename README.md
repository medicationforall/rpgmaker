# rpgmaker

Created By James Adams 
You can see a working version of the app at [http://rpg.medicationforall.com/rpgmaker/](http://rpg.medicationforall.com/rpgmaker/)

This is an application for rapidly creating Non Playable Characters for Role Playing Games. The Initial version of this web application is geared towards fantasy races.
With the hope of expanding to other genres.

## Requirements
An http web server of some sort. I use Apache, but IIS would work just fine. 
It should be relatively trivial to get this working with node or python as well.

There is no server side language being used.
There is no database.

All of the data is being fed to the page via json. Which was generated using another tool I created [RPG Chart Maker](http://rpg.medicationforall.com/rpgchartmaker/).
However it's just json and you can use whatever tool suits your needs.

## Libraries
This Application uses [jQuery](https://jquery.com/), [jQuery-ui](http://jqueryui.com/), and [FileSaver.js](https://github.com/eligrey/FileSaver.js/) all of which are being called via cdn. 
If you want run this application offline you'll need to locally reference those libraries.

##License
This application is Licensed under LGPL see the license directory. 
