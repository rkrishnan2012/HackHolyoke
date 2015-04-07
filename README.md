Music Mask
=========
####Let us pick your next song.
#####Version 1.0

Music Mask is a web application that uses facial recognition software to determine your current mood and pick a song matching the mood.

<p align="center">
  <img src="/public/images/screenshot1.png"/>
  <img src="/public/images/screenshot2.png"/>
  <img src="/public/images/screenshot3.png"/>
</p>

<a href="http://www.youtube.com/watch?feature=player_embedded&v=_5P5A0QgCVE
" target="_blank"><img src="http://img.youtube.com/vi/_5P5A0QgCVE/0.jpg" 
alt="Happy Face" width="240" height="180" border="10" /></a>

Tech
--------------

Runaway uses a number of API's/Platforms to work properly:

- [Node.js] - Evented I/O for the backend
- [Express.js] - Framework used to build the REST-based backend
- [Meteor.js] - Build apps that use Node.js client-side and server-side
- [jQuery] - Obvious things are obvious 
- [C++] - Emotime library
- [Soundcloud] - Kickass music player


Prerequisites
--------------
* [Node.js] - Tested with version v0.10.29
* [Meteor.js] - Tested with v0.9.4


Installation
--------------

```sh
git clone https://github.com/rkrishnan2012/HackHolyoke hackholyoke
cd hackholyoke
npm install
```

Starting the server
--------------

#####The Frontendhttps://github.com/luca-m/emotime
```sh
cd hackholyoke
meteor --port 3000
```
#####Point your favorite browser to http://localhost:3000 and Runaway!


License
--------------
MIT

[C++]:https://github.com/luca-m/emotime
[Soundcloud]:http://soundcloud.com
[jQuery]:http://jquery.com
[Node.js]:http://nodejs.org
[Express.js]:http://expressjs.com
[Meteor.js]:http://meteor.com