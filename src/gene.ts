import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import minimist from 'minimist';
// import { parse } from 'node-html-parser';

const argv = minimist(process.argv.slice(2));
 
const [referenceFile, dataFile] = argv._;

if (!referenceFile) { //  || !dataFile) {
  console.error('Missing arguments. Usage: <geneFile> <dataFile>');
  console.error('Example: npm run gene -- data/parsed/psen1.json parsed/dnadata.csv');
  console.error('NOTE: referenceFile is expected to be an HTML file with a table of headers and data');
  process.exit(1);
}

type GeneData = {
  accession: string;
  rsid: string;
  clinical_significance_and_condition: string;
  chrpos: string;
  variation_name: string;
  ref_alt: string;
  aa_chg: string;
  type: string;
  cit: string;
}

// type DnaData = array of string[];
// example dnd data = 
// [
//   ['rs123', '1', '123', 'A', 'T'],
//   ['rs456', '2', '456', 'C', 'G'],
// ]
type DnaRow = string[];


(async () => {
  try {
    // Read the content
    const dnaFile = readFileSync(dataFile);

    // Parse the CSV content
    const dna = parse(dnaFile, {bom: true, delimiter: '\t'}) as DnaRow[];

    const geneFile = readFileSync(referenceFile, 'utf8');
    const geneData = JSON.parse(geneFile) as GeneData[];

    // console.log(geneData);
    const rsids = geneData.map(gene => gene.rsid);

    const found = dna.reduce((acc, row) => {
      const [rsid] = row;
      const isRsidMatch = rsids.includes(rsid);
      const joinedAllele = row[3] + '/' + row[4];
      const isAlleleMatch = isRsidMatch ? geneData.filter(gene => gene.rsid === rsid && gene.ref_alt === joinedAllele).length > 0 : false;

      return isRsidMatch && isAlleleMatch ? [...acc, row] : acc;
    }, [] as DnaRow[]);

    // console.log(dna);
    console.log(found);

  } catch (error) {
    console.error(`Error importing gene data: ${error}`);
  }
})();
