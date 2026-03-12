import * as fs from 'node:fs';
import * as path from 'node:path';
import rdfDereference from 'rdf-dereference';

const mediaMappings: Record<string, string> = (<any>rdfDereference.mediatorDereferenceRdf.bus).actors[0].mediaMappings;

fs.writeFileSync(
  path.join(__dirname, '..', 'lib', 'mediaMappings.ts'),
  // This json override is here for backwards compatibility and may
  // be removed in a major version bump
  // @see https://github.com/rubensworks/rdf-parse.js/pull/51#issuecomment-1439977639
  `const mediaMappings = ${JSON.stringify({ ...mediaMappings, json: 'application/ld+json' }, null, 2)};
export {mediaMappings};\n`,
);
