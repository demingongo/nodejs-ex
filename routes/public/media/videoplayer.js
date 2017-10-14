var Novice = require('novice');
var Joi = require('joi');
var ValidatorJoi = Novice.require('utils/validator-joi');

var url = require('url');

Novice.route({
	path: '/media/videoplayer'
},
ValidatorJoi({
  query: {
		v: Joi.string()
    .description('video url')
    .default("https://scontent-bru2-1.cdninstagram.com/t50.2886-16/22309529_2021577694738894_8680661914952400896_n.mp4"),
		p: Joi.string()
    .description('poster')
		.default('http://2b0wpkmru4s14hvp7xrlrqxp.wpengine.netdna-cdn.com/wp-content/uploads/2015/10/17tips_cover.png')
  }
}),
function(req, res, next) {

  /** handler to get the non decoded url query
  *
  * PROBLEM: the query values were always url decoded ('%2' => '+')
  * and in this case, it should not be because the query represent an url used to
  * get the remote file and that url should not be changed
  *
  * TODO: not yet optimised for many url queries
  *
  */
  function getNoNDecodedQueryValue(key){
    // get the non parsed query string
    var query = url.parse(req.url).query

    var nonDecodedQueryValue;

		if(query && query.indexOf(key+"=") > -1)
			nonDecodedQueryValue = query.substring(query.indexOf(key+"=") + 2)
		else {
			nonDecodedQueryValue = req.query[key]
		}

		//Novice.logger.debug(query)
    //Novice.logger.debug(req.query[key])

    return nonDecodedQueryValue;
  }

	var html = `
  <!doctype html>
  <html lang="en">
   <head>
    <meta charset="UTF-8">
    <meta name="Generator" content="EditPlus®">
    <meta name="Author" content="">
    <meta name="Keywords" content="">
    <meta name="Description" content="">
    <link rel="stylesheet" href="/assets/css/embednwvp.css" type="text/css">
    <script src="https://code.jquery.com/jquery-3.1.0.min.js"></script>
    <script src="/assets/js/embednwvp.js"  type="text/javascript"></script>
    <title>Novice Web Video Player</title>
   </head>
   <body>
  <div class="caption">
  		<a id="novice-logo" href="https://www.youtube.com/watch?v=OXewKWKvva8" target="_blank">
  			<img
        src="https://www.designfreelogoonline.com/wp-content/uploads/2016/03/00167-Abstract-spiral-globe-logo-design-free-online-logomaker-01.png"
        alt="Novice" width="20" />
  		</a><span class="title" >Novice Web Video Player</span>
  	</div>

  <div class="videoContainer">

      <video id="myVideo" controls preload="auto" width="854"
  	poster="${getNoNDecodedQueryValue("p")}">
        <source src="${getNoNDecodedQueryValue("v")}" />
  		  <p>Your browser does not support the video tag.</p>
  	</video>
  	<button class="btnVideoFocus"></button>
  </div>

  <div class="control">
  		<div class="btmControl">
  			<div class="btnPlay btn" title="Play/Pause video"><span class="icon-play"></span></div>
  			<div class="progress-bar">
  				<div class="progress">
  					<span class="bufferBar"></span>
  					<span class="timeBar"></span>
  				</div>
  			</div>
  			<div class="current hiddenSmall"></div>
  			<div class="sound sound2 btn" title="Mute/Unmute sound"><span class="icon-sound"></span></div>
  			<div class="volume-bar hiddenSmall" title="Set volume">
  				<div class="volume">
  					<span class="bufferBar"></span>
  					<span class="volumeBar"></span>
  				</div>
  			</div>
  			<div class="btnFS btn" title="Switch to full screen"><span class="icon-fullscreen"></span></div>
  		</div>
  </div>

   </body>
  </html>
  `;

  return res.status(200).send(html);
});
