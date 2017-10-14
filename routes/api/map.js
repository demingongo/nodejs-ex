var Novice = require('novice');
var Joi = require('joi');
var path = require('path');

var ValidatorJoi = Novice.require('utils/validator-joi'); //require('express-joi-validator');


//var ExpressJoi = require('express-joi-validator');

/*var Leaflet = require('leaflet-headless');
var leafletImage = require('leaflet-image');*/
//import layerProvider from '../Utils/tileLayerMapProvider'

//var = require();
//var Streamifier = require('streamifier');

Novice.route({
  path: "/map",
  method: "get"
},
ValidatorJoi({
  query: {
    lat: Joi.number()
    .description('Latitude')
    .min(-90)
    .max(90)
    .required(),
    lng: Joi.number()
    .description('Longitude')
    .min(-180)
    .max(180)
    .required(),
    zoom: Joi.number()
    .description('Zoom (be aware that certain layers cannot render at certain zoom levels)')
    .min(2)
    .max(20)
    .default(10),
    width: Joi.number()
    .description('Width (in pixels)')
    .default(800),
    height: Joi.number()
    .description('Height (in pixels)')
    .default(600),
    layer: Joi.string()
    .description('Tile layer')
    .allow('','hot', 'road','world')
    .default(''),
    marker: Joi.boolean()
    .description('Show marker')
    .default(true)
  }
}),
function(req, res, next){
  res.status(200).json(req.query);
});

module.exports = Novice.Router();
