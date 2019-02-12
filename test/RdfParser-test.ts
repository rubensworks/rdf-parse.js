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
    ]);
  });

  it('should get all prioritized content types', async () => {
    expect(await parser.getContentTypesPrioritized()).toEqual({
      'application/n-quads': 0.7,
      'application/n-triples': 0.3,
      'application/trig': 1,
      'text/n3': 0.2,
      'text/turtle': 0.6,
    });
  });

  it('should fail to parse without content type', () => {
    const stream = stringToStream(`
<http://ex.org/s> <http://ex.org/p> <http://ex.org/o1>, <http://ex.org/o2>.
`);
    return expect(() => parser.parse(stream, {})).toThrow(new Error('Missing \'contentType\' option while parsing.'));
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

  it('should fail to parse an unknown content type', () => {
    const stream = stringToStream(``);
    return expect(arrayifyStream(parser.parse(stream, { contentType: 'unknown' })))
      .rejects.toBeTruthy();
  });
});
