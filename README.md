# RDF Parse

[![Build Status](https://travis-ci.org/rubensworks/rdf-parse.js.svg?branch=master)](https://travis-ci.org/rubensworks/rdf-parse.js)
[![Coverage Status](https://coveralls.io/repos/github/rubensworks/rdf-parse.js/badge.svg?branch=master)](https://coveralls.io/github/rubensworks/rdf-parse.js?branch=master)
[![npm version](https://badge.fury.io/js/rdf-parse.svg)](https://www.npmjs.com/package/rdf-parse)

This library parses _RDF streams_ based on _content type_ (or file name)
and outputs [RDFJS](http://rdf.js.org/)-compliant quads as a stream.

This is useful in situations where you have _RDF in some serialization_,
and you just need the _parsed triples/quads_,
without having to concern yourself with picking the correct parser.

The following RDF serializations are supported:

| **Name** | **Content type** | **Extensions** |
| -------- | ---------------- | ------------- |
| [TriG](https://www.w3.org/TR/trig/) | `application/trig` | `.trig` |
| [N-Quads](https://www.w3.org/TR/n-quads/) | `application/n-quads` | `.nq`, `.nquads` |
| [Turtle](https://www.w3.org/TR/turtle/) | `text/turtle` | `.ttl`, `.turtle` |
| [N-Triples](https://www.w3.org/TR/n-triples/) | `application/n-triples` | `.nt`, `.ntriples` |
| [Notation3](https://www.w3.org/TeamSubmission/n3/) | `text/n3` | `.n3` |
| [JSON-LD](https://json-ld.org/) | `application/ld+json`, `application/json` | `.json`, `.jsonld` |
| [RDF/XML](https://www.w3.org/TR/rdf-syntax-grammar/) | `application/rdf+xml` | `.rdf`, `.rdfxml`, `.owl` |
| [RDFa](https://www.w3.org/TR/rdfa-in-html/) and script RDF data tags [HTML](https://html.spec.whatwg.org/multipage/)/[XHTML](https://www.w3.org/TR/xhtml-rdfa/) | `text/html`, `application/xhtml+xml` | `.html`, `.htm`, `.xhtml`, `.xht` |
| [RDFa](https://www.w3.org/TR/2008/REC-SVGTiny12-20081222/metadata.html#MetadataAttributes) in [SVG](https://www.w3.org/TR/SVGTiny12/)/[XML](https://html.spec.whatwg.org/multipage/) | `image/svg+xml`,`application/xml` | `.xml`, `.svg`, `.svgz` |

Internally, this library makes use of RDF parsers from the [Comunica framework](https://github.com/comunica/comunica),
which enable streaming processing of RDF.

Internally, the following fully spec-compliant parsers are used:

* [N3.js](https://github.com/rdfjs/n3.js)
* [jsonld-streaming-parser.js](https://github.com/rubensworks/jsonld-streaming-parser.js)
* [rdfa-streaming-parser.js](https://github.com/rubensworks/rdfa-streaming-parser.js)
* [rdfxml-streaming-parser.js](https://github.com/rdfjs/rdfxml-streaming-parser.js)

## Installation

```bash
$ npm install rdf-parse
```

or

```bash
$ yarn add rdf-parse
```

This package also works out-of-the-box in browsers via tools such as [webpack](https://webpack.js.org/) and [browserify](http://browserify.org/).

## Require

```typescript
import rdfParser from "rdf-parse";
```

_or_

```javascript
const rdfParser = require("rdf-parse").default;
```

## Usage

### Parsing by content type

The `rdfParser.parse` method takes in a text stream containing RDF in any serialization,
and an options object, and outputs an [RDFJS stream](http://rdf.js.org/stream-spec/#stream-interface) that emits RDF quads.

```javascript
const textStream = require('streamify-string')(`
<http://ex.org/s> <http://ex.org/p> <http://ex.org/o1>, <http://ex.org/o2>.
`);

rdfParser.parse(textStream, { contentType: 'text/turtle', baseIRI: 'http://example.org' })
    .on('data', (quad) => console.log(quad))
    .on('error', (error) => console.error(error))
    .on('end', () => console.log('All done!'));
```

### Parsing by file name

Sometimes, the content type of an RDF document may be unknown,
for those cases, this library allows you to provide the path/URL of the RDF document,
using which the extension will be determined.

For example, Turtle documents can be detected using the `.ttl` extension.

```javascript
const textStream = require('streamify-string')(`
<http://ex.org/s> <http://ex.org/p> <http://ex.org/o1>, <http://ex.org/o2>.
`);

rdfParser.parse(textStream, { path: 'http://example.org/myfile.ttl', baseIRI: 'http://example.org' })
    .on('data', (quad) => console.log(quad))
    .on('error', (error) => console.error(error))
    .on('end', () => console.log('All done!'));
```

### Getting all known content types

With `rdfParser.getContentTypes()`, you can retrieve a list of all content types for which a parser is available.
Note that this method returns a promise that can be `await`-ed.

`rdfParser.getContentTypesPrioritized()` returns an object instead,
with content types as keys, and numerical priorities as values.

```javascript
// An array of content types
console.log(await rdfParser.getContentTypes());

// An object of prioritized content types
console.log(await rdfParser.getContentTypesPrioritized());
```

## License
This software is written by [Ruben Taelman](http://rubensworks.net/).

This code is released under the [MIT license](http://opensource.org/licenses/MIT).
