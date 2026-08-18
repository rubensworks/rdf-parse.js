module.exports = {
  entry: './lib/index.js',
  output: {
    filename: 'rdf-dereference-browser.js',
    path: __dirname,
    libraryTarget: 'var',
    library: 'RdfParse',
  },
  resolve: {
    // Bundle the compiled JavaScript output, and not the TypeScript sources,
    // which Webpack would otherwise prefer via its native TypeScript support.
    extensions: [ '.js', '.json', '.wasm' ],
  },
};
