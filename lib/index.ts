import {RdfParser} from './RdfParser';

export * from "./RdfParser";
// tslint:disable:no-var-requires
const rdfParserFactory = require('../engine-default');
const rdfParser = <RdfParser>(typeof rdfParserFactory === 'function' ? rdfParserFactory() : undefined);
export {rdfParser};
