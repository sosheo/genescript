import { readFileSync } from 'fs';
import minimist from 'minimist';
import { parse } from 'node-html-parser';

const argv = minimist(process.argv.slice(2));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const [referenceFile, dataFile] = argv._;

if (!referenceFile) { //  || !dataFile) {
  console.error('Missing arguments. Usage: <referenceFile> <dataFile>');
  console.error('Example: npm run start -- src/reference.html src/data.html');
  console.error('NOTE: referenceFile is expected to be an HTML file with a table of headers and data');
  process.exit(1);
}

(async () => {
  try {
    const html = readFileSync(referenceFile, 'utf8');
    const fileName = referenceFile.split('/').pop()?.replace('.html', '');
    const root = parse(html);

    const headers = root.querySelector('thead tr')?.childNodes.filter((node) => node.rawTagName === 'th');
    if (!headers) throw new Error('Could not find headers');

    const rows = root.querySelector('tbody')?.childNodes.filter((node) => node.rawTagName === 'tr');
    if (!rows) throw new Error('Could not find rows');

    const parsedData = rows.map(row => {
      const cells = row.childNodes.filter((node) => node.rawTagName === 'td');
      return cells.reduce((acc, cell, index) => {
        const header = headers[index].text;
        
        const cleanHeader = header.replace(/\B\s+|\s+\B/g, '').replace(/ /g, "_").replace("#", "").replace(/\//g, '_').toLowerCase();
        const cleanCell = cell.text.replace(/\B\s+|\s+\B/g, '');
  
        acc[cleanHeader] = cleanCell;
        return acc;
      }, {} as Record<string, string>);
    });



    console.log(parsedData);

    // console.log(rows?.map(row => row.toString()));

  } catch (error) {
    console.error(`Error importing partner data: ${error}`);
  }
})();
