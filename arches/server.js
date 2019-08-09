// clean shutdown on `cntrl + c`
process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

// Initialize Koop
const Koop = require('koop')
const koop = new Koop()
const tile = require('@koopjs/output-vector-tiles')
const geojson = require("koop-output-geojson");
const sheets = require('@koopjs/provider-google-sheets')
const github = require('@koopjs/provider-github')
let auth = require('@koopjs/auth-direct-file')('koop-hack-trip-testing', `${__dirname}/user-store.json`)
const provider = require('./')

koop.register(auth)

// outputs
koop.register(geojson);
koop.register(tile);

// providers
koop.register(provider);
koop.register(github);
koop.register(sheets);

if (process.env.DEPLOY === 'export') {
    module.exports = koop.server
} else {
    // Start listening for HTTP traffic
    const config = require('config')
    // Set port for configuration or fall back to default
    const port = process.env.PORT || config.port || 8080
    koop.server.listen(port)

    const message = `

  Koop Arches Provider listening on ${port}
  For more docs visit: https://koopjs.github.io/docs/usage/provider
  To find providers visit: https://www.npmjs.com/search?q=koop+provider

  Try it out in your browser: http://localhost:${port}/${provider.name}/FeatureServer/0/query
  Or on the command line: curl --silent http://localhost:${port}/${provider.name}/FeatureServer/0/query?returnCountOnly=true

  Press control + c to exit
  `
    console.log(message)
}