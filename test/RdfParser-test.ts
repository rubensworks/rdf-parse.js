import "jest-rdf";
import {RdfParser} from "../lib/RdfParser";

import {rdfParser} from "..";

const stringToStream = require('streamify-string');
const arrayifyStream = require('arrayify-stream');
const quad = require('rdf-quad');

describe('parser', () => {
  it('should be an RdfParser instance', () => {
    expect(rdfParser).toBeInstanceOf(RdfParser);
  });

  it('should get all content types', async () => {
    expect((await rdfParser.getContentTypes()).sort()).toEqual([
      'application/ld+json',
      'application/json',
      'text/html',
      'application/xhtml+xml',
      'application/xml',
      'text/xml',
      'image/svg+xml',
      'application/rdf+xml',
      'application/n-quads',
      'application/trig',
      'application/n-triples',
      'text/turtle',
      'text/n3',
      'text/shaclc',
      'text/shaclc-ext',
    ].sort());
  });

  it('should get all prioritized content types', async () => {
    expect(await rdfParser.getContentTypesPrioritized()).toEqual({
      'application/json': 0.135,
      'application/ld+json': 0.9,
      'application/n-quads': 1,
      'application/n-triples': 0.8,
      'application/rdf+xml': 0.5,
      'application/trig': 0.95,
      'application/xhtml+xml': 0.18000000000000002,
      'application/xml': 0.3,
      'image/svg+xml': 0.3,
      'text/html': 0.2,
      'text/n3': 0.35,
      "text/shaclc": 0.1,
      "text/shaclc-ext": 0.05,
      'text/turtle': 0.6,
      'text/xml': 0.3,
    });
  });

  it('should fail to parse without content type and path', () => {
    const stream = stringToStream(`
<http://ex.org/s> <http://ex.org/p> <http://ex.org/o1>, <http://ex.org/o2>.
`);
    return expect(() => rdfParser.parse(stream, <any>{}))
      .toThrow(new Error('Missing \'contentType\' or \'path\' option while parsing.'));
  });

  it('should fail to parse with path without extension', () => {
    const stream = stringToStream(`
<http://ex.org/s> <http://ex.org/p> <http://ex.org/o1>, <http://ex.org/o2>.
`);
    return expect(() => rdfParser.parse(stream, {path: 'abc'}))
      .toThrow(new Error('No valid extension could be detected from the given \'path\' option: \'abc\''));
  });

  it('should fail to parse with path with unknown extension', () => {
    const stream = stringToStream(`
<http://ex.org/s> <http://ex.org/p> <http://ex.org/o1>, <http://ex.org/o2>.
`);
    return expect(() => rdfParser.parse(stream, {path: 'abc.unknown'}))
      .toThrow(new Error('No valid extension could be detected from the given \'path\' option: \'abc.unknown\''));
  });

  it('should parse text/turtle without baseIRI', () => {
    const stream = stringToStream(`
<http://ex.org/s> <http://ex.org/p> <http://ex.org/o1>, <http://ex.org/o2>.
`);
    return expect(arrayifyStream(rdfParser.parse(stream, {contentType: 'text/turtle'}))).resolves.toBeRdfIsomorphic([
      quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o1'),
      quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o2'),
    ]);
  });

  it('should parse text/turtle without baseIRI by path', () => {
    const stream = stringToStream(`
<http://ex.org/s> <http://ex.org/p> <http://ex.org/o1>, <http://ex.org/o2>.
`);
    return expect(arrayifyStream(rdfParser.parse(stream, {path: 'myfile.ttl'}))).resolves.toBeRdfIsomorphic([
      quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o1'),
      quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o2'),
    ]);
  });

  it('should parse text/turtle with baseIRI', () => {
    const stream = stringToStream(`
<s> <p> <o1>, <o2>.
`);
    return expect(arrayifyStream(rdfParser.parse(stream, {contentType: 'text/turtle', baseIRI: 'http://ex.org/'})))
      .resolves.toBeRdfIsomorphic([
        quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o1'),
        quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o2'),
      ]);
  });

  it('should fail to parse invalid text/turtle', () => {
    const stream = stringToStream(`
<s> <p> <o1>,
`);
    return expect(arrayifyStream(rdfParser.parse(stream, {contentType: 'text/turtle'})))
      .rejects.toThrow(new Error('Expected entity but got eof on line 3.'));
  });

  it('should parse application/ld+json and emit context', async (): Promise<void> => {
    const stream = stringToStream(`
{
  "@context": "http://schema.org/",
  "@type": "Person",
  "@id": "",
  "name": "Jane Doe",
  "url": ""
}
`);
    const contexts: string[] = [];
    const result = await arrayifyStream(rdfParser.parse(stream, {contentType: 'application/ld+json'})
      .on('context', (context => contexts.push(context))));

    expect(result).toBeRdfIsomorphic([]);
    expect(contexts).toContain('http://schema.org/');
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
    return expect(arrayifyStream(rdfParser.parse(stream, {contentType: 'application/ld+json'}))).resolves
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
    return expect(arrayifyStream(rdfParser
      .parse(stream, {contentType: 'application/ld+json', baseIRI: 'http://ex.org/'})))
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
    return expect(arrayifyStream(rdfParser
      .parse(stream, {path: 'myfile.json', baseIRI: 'http://ex.org/'})))
      .resolves.toBeRdfIsomorphic([
        quad('http://ex.org/', 'http://schema.org/name', '"Jane Doe"'),
        quad('http://ex.org/', 'http://schema.org/url', 'http://ex.org/'),
        quad('http://ex.org/', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://schema.org/Person'),
      ]);
  });

  it('should fail to parse invalid application/ld+json', () => {
    const stream = stringToStream(`
...,
`);
    return expect(arrayifyStream(rdfParser.parse(stream, {contentType: 'application/ld+json'})))
      .rejects.toThrow(new Error('Unexpected "." at position 1 in state STOP'));
  });

  it('should fail to parse an unknown content type', () => {
    const stream = stringToStream(``);
    return expect(arrayifyStream(rdfParser.parse(stream, {contentType: 'unknown'})))
      .rejects.toBeTruthy();
  });

  it('should parse text/html with baseIRI', () => {
    const stream = stringToStream(`
<html>
<head>
<title property="schema:name">Title</title>
</head>
</html>
`);
    return expect(arrayifyStream(rdfParser
      .parse(stream, {contentType: 'text/html', baseIRI: 'http://ex.org/'})))
      .resolves.toBeRdfIsomorphic([
        quad('http://ex.org/', 'http://schema.org/name', '"Title"'),
      ]);
  });

  it('should parse and emit prefixes in text/turtle', async (): Promise<void> => {
    const turtle = `
    @base <http://example.org/> .
    @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
    @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
    @prefix foaf: <http://xmlns.com/foaf/0.1/> .
    @prefix rel: <http://www.perceive.net/schemas/relationship/> .

    <#green-goblin>
        rel:enemyOf <#spiderman> ;
        a foaf:Person ;    # in the context of the Marvel universe
        foaf:name "Green Goblin" .

    <#spiderman>
        rel:enemyOf <#green-goblin> ;
        a foaf:Person ;
        foaf:name "Spiderman", "Человек-паук"@ru .`
    const stream = stringToStream(turtle);
    const prefixes: Record<string, string> = {};
    const result = await arrayifyStream(rdfParser.parse(stream, {path: 'myfile.ttl'})
      .on('prefix', (prefix, iri) => prefixes[prefix] = iri.value));
    expect(result).toBeRdfIsomorphic([
      quad('http://example.org/#green-goblin', 'http://www.perceive.net/schemas/relationship/enemyOf', 'http://example.org/#spiderman'),
      quad('http://example.org/#green-goblin', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://xmlns.com/foaf/0.1/Person'),
      quad('http://example.org/#green-goblin', 'http://xmlns.com/foaf/0.1/name', '\"Green Goblin\"'),
      quad('http://example.org/#spiderman', 'http://www.perceive.net/schemas/relationship/enemyOf', 'http://example.org/#green-goblin'),
      quad('http://example.org/#spiderman', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'http://xmlns.com/foaf/0.1/Person'),
      quad('http://example.org/#spiderman', 'http://xmlns.com/foaf/0.1/name', '\"Spiderman\"'),
      quad('http://example.org/#spiderman', 'http://xmlns.com/foaf/0.1/name', '\"Человек-паук\"@ru'),
    ]);

    expect(prefixes).toMatchObject({
      rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
      foaf: 'http://xmlns.com/foaf/0.1/',
      rel: 'http://www.perceive.net/schemas/relationship/'
    });


  });

  it('should parse text/turtle with baseIRI', () => {
    const stream = stringToStream(`
        <s> <p> <o1>, <o2>.
        `);
    return expect(arrayifyStream(rdfParser.parse(stream, {contentType: 'text/turtle', baseIRI: 'http://ex.org/'})))
      .resolves.toBeRdfIsomorphic([
        quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o1'),
        quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o2'),
      ]);
  });

  it('should parse text/shaclc with baseIRI', async () => {
    const stream = stringToStream(`
          BASE <http://localhost:3002/ContactsShape>
          PREFIX cont: <http://localhost:3002/ContactsShape#>

          shape cont:ContactsShape {}
        `);

    const prefixes: Record<string, string> = {};
    const result = arrayifyStream(rdfParser.parse(stream, {contentType: 'text/shaclc'})
      .on('prefix', (prefix: string, iri: string) => prefixes[prefix] = iri));

    await expect(result)
      .resolves.toBeRdfIsomorphic([
        quad("http://localhost:3002/ContactsShape#ContactsShape", "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", "http://www.w3.org/ns/shacl#NodeShape"),
        quad("http://localhost:3002/ContactsShape", "http://www.w3.org/1999/02/22-rdf-syntax-ns#type", "http://www.w3.org/2002/07/owl#Ontology"),
      ]);

    expect(prefixes).toMatchObject({
      cont: 'http://localhost:3002/ContactsShape#',
      rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
      sh: 'http://www.w3.org/ns/shacl#',
    });
  });
});
