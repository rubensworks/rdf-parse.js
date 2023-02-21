import rdfDereference from 'rdf-dereference';
import * as fs from 'fs';
import * as path from 'path';

const mediaMappings: Record<string, string> = (<any> rdfDereference.mediatorDereferenceRdf.bus).actors[0].mediaMappings;

fs.writeFileSync(
  path.join(__dirname, '..', 'lib', 'mediaMappings.ts'),
  `export default ${JSON.stringify(mediaMappings, null, 2)};\n`
);
