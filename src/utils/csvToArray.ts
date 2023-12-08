export const csvToArray = (str: string, delimiter: string = ',') => {
  const headers: string[] = str
    .slice(0, str.indexOf('\n'))
    .split(delimiter)
    .map((header) => header.trim());

  const rows = str.slice(str.indexOf('\n') + 1).split('\n');

  const arr = rows.map((row) => {
    const values = row.split(delimiter);
    const el = headers.reduce((object: any, header: string, index: number) => {
      object[header] = Number(values[index]);
      return object;
    }, {});
    return el;
  });

  return arr;
};
