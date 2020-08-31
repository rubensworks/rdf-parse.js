import {
  IActionHandleRdfParse,
  IActionMediaTypesRdfParse,
  IActorOutputHandleRdfParse,
  IActorOutputMediaTypesRdfParse,
  IActorTestHandleRdfParse,
  IActorTestMediaTypesRdfParse
} from "@comunica/bus-rdf-parse";
import {ActionContext, Actor, Mediator} from "@comunica/core";
import * as RDF from "rdf-js";
import {Readable} from "stream";

/**
 * An RdfParser can parse any RDF serialization, based on a given content type.
 */
export class RdfParser<Q extends RDF.BaseQuad = RDF.Quad>  {

  // tslint:disable:object-literal-sort-keys
  private static readonly CONTENT_MAPPINGS: { [id: string]: string } = {
    ttl      : "text/turtle",
    turtle   : "text/turtle",
    nt       : "application/n-triples",
    ntriples : "application/n-triples",
    nq       : "application/n-quads",
    nquads   : "application/n-quads",
    rdf      : "application/rdf+xml",
    rdfxml   : "application/rdf+xml",
    owl      : "application/rdf+xml",
    n3       : "text/n3",
    trig     : "application/trig",
    jsonld   : "application/ld+json",
    json     : "application/ld+json",
  };

  public readonly mediatorRdfParseMediatypes: Mediator<Actor<
    IActionMediaTypesRdfParse, IActorTestMediaTypesRdfParse, IActorOutputMediaTypesRdfParse>,
    IActionMediaTypesRdfParse, IActorTestMediaTypesRdfParse, IActorOutputMediaTypesRdfParse>;
  public readonly mediatorRdfParseHandle: Mediator<Actor<
    IActionHandleRdfParse, IActorTestHandleRdfParse, IActorOutputHandleRdfParse>,
    IActionHandleRdfParse, IActorTestHandleRdfParse, IActorOutputHandleRdfParse>;

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
  public async getContentTypesPrioritized(): Promise<{[contenType: string]: number}> {
    return (await this.mediatorRdfParseMediatypes.mediate(
      { context: ActionContext({}), mediaTypes: true })).mediaTypes;
  }

  /**
   * Parse the given stream.
   * @param {NodeJS.ReadableStream} stream A string stream.
   * @param {IParseOptions} options Parsing options.
   * @return {Stream} An RDFJS quad stream.
   */
  public parse(stream: NodeJS.ReadableStream, options: ParseOptions): RDF.Stream & Readable {
    let contentType: string;
    if ('contentType' in options) {
      contentType = options.contentType;
    } else if ('path' in options) {
      contentType = this.getContentTypeFromExtension(options.path);
      if (!contentType) {
        throw new Error(`No valid extension could be detected from the given 'path' option: '${options.path}'`);
      }
    } else {
      throw new Error(`Missing 'contentType' or 'path' option while parsing.`);
    }

    // Create a new readable
    const readable = new Readable({ objectMode: true });
    readable._read = () => {
      return;
    };

    // Delegate parsing to the mediator
    this.mediatorRdfParseHandle.mediate({
      context: ActionContext(options),
      handle: { input: stream, baseIRI: options.baseIRI },
      handleMediaType: contentType,
    })
      .then((output) => {
        const quads: RDF.Stream = output.handle.quads;
        quads.on('error', (e) => readable.emit('error', e));
        quads.on('data', (quad) => readable.push(quad));
        quads.on('end', () => readable.push(null));
      })
      .catch((e) => readable.emit('error', e));

    return readable;
  }

  /**
   * Get the content type based on the extension of the given path,
   * which can be an URL or file path.
   * @param {string} path A path.
   * @return {string} A content type or the empty string.
   */
  protected getContentTypeFromExtension(path: string): string {
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
  mediatorRdfParseMediatypes: Mediator<Actor<
    IActionMediaTypesRdfParse, IActorTestMediaTypesRdfParse, IActorOutputMediaTypesRdfParse>,
    IActionMediaTypesRdfParse, IActorTestMediaTypesRdfParse, IActorOutputMediaTypesRdfParse>;
  mediatorRdfParseHandle: Mediator<Actor<
    IActionHandleRdfParse, IActorTestHandleRdfParse, IActorOutputHandleRdfParse>,
    IActionHandleRdfParse, IActorTestHandleRdfParse, IActorOutputHandleRdfParse>;
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
} | {
  /**
   * The file name or URL that is being parsed.
   */
  path: string;
  /**
   * An optional base IRI of stream's document.
   */
  baseIRI?: string;
};
