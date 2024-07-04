import rdfDereference from 'rdf-dereference';
import * as fs from 'fs';
import * as path from 'path';

const mediaMappings: Record<string, string> = (<any>rdfDereference.mediatorDereferenceRdf.bus).actors[0].mediaMappings;

fs.writeFileSync(
  path.join(__dirname, '..', 'lib', 'mediaMappings.ts'),
  // This json override is here for backwards compatibility and may
  // be removed in a major version bump
  // @see https://github.com/rubensworks/rdf-parse.js/pull/51#issuecomment-1439977639
  `const mediaMappings = ${JSON.stringify({...mediaMappings, json: "application/ld+json"}, null, 2)};
export {mediaMappings};\n`
);
