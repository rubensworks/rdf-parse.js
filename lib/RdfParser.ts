import { ActionContext, Actor } from "@comunica/core";
import * as RDF from "@rdfjs/types";
import { Readable, PassThrough } from "readable-stream";
import { MediatorRdfParseHandle, MediatorRdfParseMediaTypes } from '@comunica/bus-rdf-parse';
import {mediaMappings} from "./mediaMappings";
import { DataFactory } from 'rdf-data-factory';
import { KeysInitQuery } from '@comunica/context-entries';

/**
 * An RdfParser can parse any RDF serialization, based on a given content type.
 */
export class RdfParser<Q extends RDF.BaseQuad = RDF.Quad>  {
  public static readonly CONTENT_MAPPINGS: Record<string, string> = mediaMappings;

  public readonly mediatorRdfParseMediatypes: MediatorRdfParseMediaTypes;
  public readonly mediatorRdfParseHandle: MediatorRdfParseHandle;

  constructor(args: IRdfParserArgs) {
    this.mediatorRdfParseMediatypes = args.mediatorRdfParseMediatypes;
    this.mediatorRdfParseHandle = args.mediatorRdfParseHandle;
  }

  /**
   * Get an array of all available content types for this parser.
   * @return {Promise<string[]>} A promise resolving to a string array of all content types.
   */
  public async getContentTypes(): Promise<string[]> {
    return Object.keys(await this.getContentTypesPrioritized());
  }

  /**
   * Get a hash of all available content types for this parser, mapped to a numerical priority.
   * @return {Promise<{[p: string]: number}>} A promise resolving to a hash mapping content type to a priority number.
   */
  public async getContentTypesPrioritized(): Promise<{[contentType: string]: number}> {
    return (await this.mediatorRdfParseMediatypes.mediate(
      { context: new ActionContext(), mediaTypes: true })).mediaTypes;
  }

  /**
   * Parse the given stream.
   * @param {NodeJS.ReadableStream} stream A string stream.
   * @param {IParseOptions} options Parsing options.
   * @return {Stream} An RDFJS quad stream.
   */
  public parse(stream: NodeJS.ReadableStream, options: ParseOptions): RDF.Stream & Readable {
    let contentType: string;
    if ('contentType' in options && options.contentType) {
      contentType = options.contentType;
    } else if ('path' in options && options.path) {
      contentType = this.getContentTypeFromExtension(options.path);
      if (!contentType) {
        throw new Error(`No valid extension could be detected from the given 'path' option: '${options.path}'`);
      }
    } else {
      throw new Error(`Missing 'contentType' or 'path' option while parsing.`);
    }

    // Create a new readable
    const readable = new PassThrough({ objectMode: true });

    // Delegate parsing to the mediator
    const context = new ActionContext(options)
      .setDefault(KeysInitQuery.dataFactory, options.dataFactory || new DataFactory());
    this.mediatorRdfParseHandle.mediate({
      context,
      handle: { data: stream, metadata: { baseIRI: <string> options.baseIRI }, context },
      handleMediaType: contentType,
    })
      .then((output) => {
        const quads = output.handle.data;
        quads.on('error', (e) => readable.emit('error', e));
        quads.on('prefix', (prefix, iri) => readable.emit('prefix', prefix, iri));
        quads.on('context', (ctx) => readable.emit('context', ctx));
        quads.pipe(readable);
      })
      .catch((e) => readable.emit('error', e));

    return readable as unknown as Readable & RDF.Stream;
  }

  /**
   * Get the content type based on the extension of the given path,
   * which can be an URL or file path.
   * @param {string} path A path.
   * @return {string} A content type or the empty string.
   */
  public getContentTypeFromExtension(path: string): string {
    const dotIndex = path.lastIndexOf('.');
    if (dotIndex >= 0) {
      const ext = path.substr(dotIndex);
      // ignore dot
      return RdfParser.CONTENT_MAPPINGS[ext.substring(1)] || '';
    }
    return '';
  }

}

export interface IRdfParserArgs {
  mediatorRdfParseMediatypes: MediatorRdfParseMediaTypes;
  mediatorRdfParseHandle: MediatorRdfParseHandle;
  actors: Actor<any, any, any>[];
}

export type ParseOptions = {
  /**
   * The content type of the incoming stream.
   */
  contentType: string;
  /**
   * An optional base IRI of stream's document.
   */
  baseIRI?: string;
  /**
   * An optional data factory to pass to parsers.
   */
  dataFactory?: RDF.DataFactory;
} | {
  /**
   * The file name or URL that is being parsed.
   */
  path: string;
  /**
   * An optional base IRI of stream's document.
   */
  baseIRI?: string;
  /**
   * An optional data factory to pass to parsers.
   */
  dataFactory?: RDF.DataFactory;
};
