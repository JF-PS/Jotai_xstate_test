import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { EPaginationButtonActions } from '../louis-types';

export const DataRowsNumber = atom(0);

export const RowsPerPage = atom(6);

export const skip = atom((get) => {
  const page = get(actualPage) + 1;
  const rowsperpage = get(RowsPerPage);
  return rowsperpage * (page - 1);
});

export const MaxPageNumber = atom((get) => {
  const rowsNumber = get(DataRowsNumber);
  const rowsperpage = get(RowsPerPage);
  return Math.ceil(rowsNumber / rowsperpage) - 1;
});
export const actualPage = atomWithStorage('actualPage', 0);

export const defaultValuesAtom = atom((get) => ({
  skip: get(skip),
  DataRowsNumber: get(DataRowsNumber),
  RowsPerPage: get(RowsPerPage),
  MaxPageNumber: get(MaxPageNumber),
  actualPage: get(actualPage),
  Data: null,
  error: {},
  counter: 0,
  timer: 0,
  fetchUrl: ''
}));

export const setActualPage = atom(
  null,
  (get, set, action: EPaginationButtonActions) => {
    let newPageNumber;
    switch (action) {
      case 'first':
        newPageNumber = 1;
        break;

      case 'last':
        newPageNumber = get(MaxPageNumber);
        break;

      case 'previous':
        newPageNumber = get(actualPage) - 1;
        break;

      case 'next':
        newPageNumber = get(actualPage) + 1;
        break;

      default:
        newPageNumber = get(actualPage);
        break;
    }
    set(actualPage, newPageNumber);
  }
);
