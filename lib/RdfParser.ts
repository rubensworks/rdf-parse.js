import {IActionRootRdfParse, IActorOutputRootRdfParse, IActorTestRootRdfParse} from "@comunica/bus-rdf-parse";
import {ActionContext, Actor, Mediator} from "@comunica/core";
import * as RDF from "rdf-js";
import {Readable} from "stream";

/**
 * An RdfParser can parse any RDF serialization, based on a given content type.
 */
export class RdfParser<Q extends RDF.BaseQuad = RDF.Quad>  {

  public readonly mediatorRdfParseMediatypes: Mediator<Actor<IActionRootRdfParse, IActorTestRootRdfParse,
    IActorOutputRootRdfParse>, IActionRootRdfParse, IActorTestRootRdfParse, IActorOutputRootRdfParse>;
  public readonly mediatorRdfParseHandle: Mediator<Actor<IActionRootRdfParse, IActorTestRootRdfParse,
    IActorOutputRootRdfParse>, IActionRootRdfParse, IActorTestRootRdfParse, IActorOutputRootRdfParse>;

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
  public parse(stream: NodeJS.ReadableStream, { contentType, baseIRI }: IParseOptions): RDF.Stream {
    if (!contentType) {
      throw new Error(`Missing 'contentType' option while parsing.`);
    }

    // Create a new readable
    const readable = new Readable({ objectMode: true });
    readable._read = () => {
      return;
    };

    // Delegate parsing to the mediator
    this.mediatorRdfParseHandle.mediate(
      { context: ActionContext({}), handle: { input: stream, baseIRI }, handleMediaType: contentType })
      .then((output) => {
        const quads: RDF.Stream = output.handle.quads;
        quads.on('error', (e) => readable.emit('error', e));
        quads.on('data', (quad) => readable.push(quad));
        quads.on('end', () => readable.push(null));
      })
      .catch((e) => readable.emit('error', e));

    return readable;
  }

}

export interface IRdfParserArgs {
  mediatorRdfParseMediatypes: Mediator<Actor<IActionRootRdfParse, IActorTestRootRdfParse,
    IActorOutputRootRdfParse>, IActionRootRdfParse, IActorTestRootRdfParse, IActorOutputRootRdfParse>;
  mediatorRdfParseHandle: Mediator<Actor<IActionRootRdfParse, IActorTestRootRdfParse,
    IActorOutputRootRdfParse>, IActionRootRdfParse, IActorTestRootRdfParse, IActorOutputRootRdfParse>;
}

export interface IParseOptions {
  /**
   * The content type of the incoming stream.
   */
  contentType: string;
  /**
   * An optional base IRI of stream's document.
   */
  baseIRI?: string;
}
