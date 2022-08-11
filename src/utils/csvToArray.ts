/**
 * Converts a CSV to an array.
 *
 * @param str - string containing entire csv content
 * @param delimiter - to split by
 * @return array
 */
export const csvToArray = (str: string, delimiter: string = ',') => {
  // Slice from start of text to the first \n index,
  // split sliced by delimiter to create array of headers
  const headers: string[] = str
    .slice(0, str.indexOf('\n'))
    .split(delimiter)
    .map((header) => header.trim());

  // Slice from \n index + 1 to the end of the text,
  // split sliced text to create an array of each csv value row
  const rows: string[] = str.slice(str.indexOf('\n') + 1).split('\n');

  // Map rows, split values from each row into an array of values,
  // reduce headers and values to create an object array
  const arr = rows.map((row) => {
    const values = row.split(delimiter);
    const el = headers.reduce((object: any, header: string, index: number) => {
      object[header] = Number(values[index]);
      return object;
    }, {});
    return el;
  });

  // Return the array
  return arr;
};
