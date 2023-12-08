import { csvToArray } from 'utils';

export const readCsv = async (path: string) => {
  try {
    const res = await fetch(path);
    const data = await res.text();
    const arr = csvToArray(data);
    return arr;
  } catch (err) {
    console.log(err);
  }
};
