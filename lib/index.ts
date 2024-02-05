import type * as RDF from '@rdfjs/types';
import { RdfParser } from './RdfParser';

export * from "./RdfParser";

// tslint:disable:no-var-requires
export default <RdfParser<RDF.Quad>>require('../engine-default');
