import {RdfParser} from './RdfParser';

export * from "./RdfParser";
// tslint:disable:no-var-requires
const rdfParser = <RdfParser>require('../engine-default');
export {rdfParser};
