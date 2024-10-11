const path = require('path');

module.exports = {
    entry: './lib/index.js',
    output: {
        filename: 'rdf-dereference-browser.js',
        path: __dirname,
        libraryTarget: 'var',
        library: 'RdfParse',
    },
};
