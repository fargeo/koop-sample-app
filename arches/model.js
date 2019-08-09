/*
  model.js

  This file is required. It must export a class with at least one public function called `getData`

  Documentation: http://koopjs.github.io/docs/usage/provider
*/
const request = require('request').defaults({
    gzip: true,
    json: true
})
const config = require('config')

function Model(koop) {}

// Public function to return data from the
// Return: GeoJSON FeatureCollection
//
// Config parameters (config/default.json)
// req.
//
// URL path parameters:
// req.params.host (if index.js:hosts true)
// req.params.id  (if index.js:disableIdParam false)
// req.params.layer
// req.params.method
Model.prototype.getData = function(req, callback) {
    let geometryType;
    if (req.params.layer) {
        switch (req.params.layer) {
            case '1':
                geometryType = 'LineString';
                break;
            case '2':
                geometryType = 'Polygon';
                break;
            case '3':
                geometryType = 'MultiPoint';
                break;
            case '4':
                geometryType = 'MultiLineString';
                break;
            case '5':
                geometryType = 'MultiPolygon';
                break;
            default:
                geometryType = 'Point';
            
        }
    }
    
    request('http://qa.archesproject.org/search/resources?tiles=true&mobiledownload=true&resourcecount=10000&paging-filter=1', (err, res, body) => {
        if (err) return callback(err)
        
        const geojson = translate(body, geometryType)

        geojson.ttl = 30;

        geojson.metadata = {
            title: 'Koop Arches Provider',
            geometryType: geometryType,
            idField: 'id'
        }

        callback(null, geojson)
    })
}

function translate(input, geometryType) {
    var features = []
    let i = 1;
    input.results.hits.hits.forEach(function(hit) {
        hit._source.geometries.forEach(function(geometry) {
            geometry.geom.features.forEach(function(feature) {
                if (feature.geometry.type === geometryType || !geometryType) {
                    feature.id = i;
                    feature.properties.id = i;
                    feature.properties.displayname = hit._source.displayname;
                    feature.properties.displaydescription = hit._source.displaydescription;
                    feature.properties.graph_id = hit._source.graph_id;
                    feature.properties.geometryType = geometryType;
                    features.push(feature);
                    i++;
                }
            });
        })
    })
    return {
        type: 'FeatureCollection',
        features: features
    }
}

module.exports = Model
