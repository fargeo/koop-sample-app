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
    
    request('https://arcade.lincoln.gov.uk/search/resources?tiles=true&typeFilter=%5B%7B"graphid"%3A"1c86516e-2c5a-11e8-89e4-0242ac120005"%2C"name"%3A"Heritage%20Areas"%2C"inverted"%3Afalse%7D%5D&no_filters=false&limit=1000&page=1', (err, res, body) => {
        if (err) return callback(err)
        
        const geojson = translate(body, geometryType)

        geojson.ttl = 10000;

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
        let areaType;
        hit._source.tiles.forEach(function(tile) {
            if (tile.data['9a6ec902-3480-11e8-951e-dca90488358a'])
                areaType = tile.data['9a6ec902-3480-11e8-951e-dca90488358a'];
        });

        hit._source.geometries.forEach(function(geometry) {
            geometry.geom.features.forEach(function(feature) {
                if (feature.geometry.type === geometryType || !geometryType) {
                    feature.id = i;
                    feature.properties.id = i;
                    feature.properties.displayname = hit._source.displayname;
                    feature.properties.displaydescription = hit._source.displaydescription;
                    feature.properties._featureid = hit._source.resourceinstanceid;
                    feature.properties.feature_info_content = `
                        <h3>${feature.properties.displayname}</h3>
                        <div>${feature.properties.displaydescription}</div>
                    `
                    feature.properties.graph_id = hit._source.graph_id;
                    feature.properties.geometryType = geometryType;
                    feature.properties.areaType = areaType;
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
