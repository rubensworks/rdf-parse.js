import "jest-rdf";
const stringToStream = require('streamify-string');
const arrayifyStream = require('arrayify-stream');
const quad = require('rdf-quad');
import {RdfParser} from "../lib/RdfParser";

import parser from "..";

describe('parser', () => {
  it('should be an RdfParser instance', () => {
    expect(parser).toBeInstanceOf(RdfParser);
  });

  it('should get all content types', async () => {
    expect(await parser.getContentTypes()).toEqual([
      'application/trig',
      'application/n-quads',
      'text/turtle',
      'application/n-triples',
      'text/n3',
      'application/ld+json',
      'application/json',
      'application/rdf+xml',
    ]);
  });

  it('should get all prioritized content types', async () => {
    expect(await parser.getContentTypesPrioritized()).toEqual({
      'application/json': 0.09000000000000001,
      'application/ld+json': 0.9,
      'application/n-quads': 0.7,
      'application/n-triples': 0.3,
      'application/rdf+xml': 0.85,
      'application/trig': 1,
      'text/n3': 0.2,
      'text/turtle': 0.6,
    });
  });

  it('should fail to parse without content type and path', () => {
    const stream = stringToStream(`
<http://ex.org/s> <http://ex.org/p> <http://ex.org/o1>, <http://ex.org/o2>.
`);
    return expect(() => parser.parse(stream, {}))
      .toThrow(new Error('Missing \'contentType\' or \'path\' option while parsing.'));
  });

  it('should fail to parse with path without extension', () => {
    const stream = stringToStream(`
<http://ex.org/s> <http://ex.org/p> <http://ex.org/o1>, <http://ex.org/o2>.
`);
    return expect(() => parser.parse(stream, { path: 'abc' }))
      .toThrow(new Error('No valid extension could be detected from the given \'path\' option: \'abc\''));
  });

  it('should fail to parse with path with unknown extension', () => {
    const stream = stringToStream(`
<http://ex.org/s> <http://ex.org/p> <http://ex.org/o1>, <http://ex.org/o2>.
`);
    return expect(() => parser.parse(stream, { path: 'abc.unknown' }))
      .toThrow(new Error('No valid extension could be detected from the given \'path\' option: \'abc.unknown\''));
  });

  it('should parse text/turtle without baseIRI', () => {
    const stream = stringToStream(`
<http://ex.org/s> <http://ex.org/p> <http://ex.org/o1>, <http://ex.org/o2>.
`);
    return expect(arrayifyStream(parser.parse(stream, { contentType: 'text/turtle' }))).resolves.toBeRdfIsomorphic([
      quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o1'),
      quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o2'),
    ]);
  });

  it('should parse text/turtle without baseIRI by path', () => {
    const stream = stringToStream(`
<http://ex.org/s> <http://ex.org/p> <http://ex.org/o1>, <http://ex.org/o2>.
`);
    return expect(arrayifyStream(parser.parse(stream, { path: 'myfile.ttl' }))).resolves.toBeRdfIsomorphic([
      quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o1'),
      quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o2'),
    ]);
  });

  it('should parse text/turtle with baseIRI', () => {
    const stream = stringToStream(`
<s> <p> <o1>, <o2>.
`);
    return expect(arrayifyStream(parser.parse(stream, { contentType: 'text/turtle', baseIRI: 'http://ex.org/' })))
      .resolves.toBeRdfIsomorphic([
        quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o1'),
        quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o2'),
      ]);
  });

  it('should fail to parse invalid text/turtle', () => {
    const stream = stringToStream(`
<s> <p> <o1>,
`);
    return expect(arrayifyStream(parser.parse(stream, { contentType: 'text/turtle' })))
      .rejects.toThrow(new Error('Expected entity but got eof on line 3.'));
  });

  it('should parse application/ld+json without baseIRI', () => {
    const stream = stringToStream(`
{
  "@context": "http://schema.org/",
  "@type": "Person",
  "@id": "",
  "name": "Jane Doe",
  "url": ""
}
`);
    return expect(arrayifyStream(parser.parse(stream, { contentType: 'application/ld+json' }))).resolves
      .toBeRdfIsomorphic([]);
  });

  it('should parse application/ld+json with baseIRI', () => {
    const stream = stringToStream(`
{
  "@context": "http://schema.org/",
  "@type": "Person",
  "@id": "",
  "name": "Jane Doe",
  "url": ""
}
`);
    return expect(arrayifyStream(parser
      .parse(stream, { contentType: 'application/ld+json', baseIRI: 'http://ex.org/' })))
      .resolves.toBeRdfIsomorphic([
        quad('http://ex.org/', 'http://schema.org/name', '"Jane Doe"'),
        quad('http://ex.org/', 'http://schema.org/url', 'http://ex.org/'),
        quad('http://ex.org/', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://schema.org/Person'),
      ]);
  });

  it('should parse application/ld+json with baseIRI by path', () => {
    const stream = stringToStream(`
{
  "@context": "http://schema.org/",
  "@type": "Person",
  "@id": "",
  "name": "Jane Doe",
  "url": ""
}
`);
    return expect(arrayifyStream(parser
      .parse(stream, { path: 'myfile.json', baseIRI: 'http://ex.org/' })))
      .resolves.toBeRdfIsomorphic([
        quad('http://ex.org/', 'http://schema.org/name', '"Jane Doe"'),
        quad('http://ex.org/', 'http://schema.org/url', 'http://ex.org/'),
        quad('http://ex.org/', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://schema.org/Person'),
      ]);
  });

  it('should fail to parse invalid application/ld+json', () => {
    const stream = stringToStream(`
<s> <p> <o1>,
`);
    return expect(arrayifyStream(parser.parse(stream, { contentType: 'application/ld+json' })))
      .rejects.toThrow(new Error('Unexpected "s" at position 2 in state STOP'));
  });

  it('should fail to parse an unknown content type', () => {
    const stream = stringToStream(``);
    return expect(arrayifyStream(parser.parse(stream, { contentType: 'unknown' })))
      .rejects.toBeTruthy();
  });
});
