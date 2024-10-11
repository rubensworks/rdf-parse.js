const rdfParser = require("..").rdfParser;
const { ErrorSkipped } = require('rdf-test-suite');

module.exports = {
  parse: function (data, baseIRI, options) {
    if (options.processingMode && (options.processingMode !== '1.0' && options.processingMode !== '1.1')) {
      return Promise.reject(
        new ErrorSkipped(`Test with processing mode ${options.processingMode} was skipped, only 1.0 is supported.`));
    }
    if (options.specVersion && options.specVersion !== '1.1') {
      return Promise.reject(
        new ErrorSkipped(`Test with spec version ${options.specVersion} was skipped, only 1.1 is supported.`));
    }
    return require('arrayify-stream')(rdfParser.parse(require('streamify-string')(data), Object.assign({
        baseIRI,
      }, options)));
  },
};
