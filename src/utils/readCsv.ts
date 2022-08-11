import { csvToArray } from 'utils';

/**
 * Read data from a CSV
 *
 * @param path - file path
 */
export const readCsv = async (path: string) => {
  try {
    const res = await fetch(path);
    const data = await res.text();
    const arr = await csvToArray(data);
    return arr;
  } catch (err) {
    console.log(err);
  }
};
