import type { RdfParser } from './RdfParser';

export * from './RdfParser';
// eslint-disable-next-line ts/no-require-imports, ts/no-unsafe-assignment, ts/no-var-requires
const rdfParserFactory = require('../engine-default');

const rdfParser = <RdfParser>(typeof rdfParserFactory === 'function' ? rdfParserFactory() : undefined);
export { rdfParser };
