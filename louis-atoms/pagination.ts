import { atom } from 'jotai';
import { EPaginationButtonActions } from '../louis-types';

export const DataRowsNumber = atom(0);

export const RowsPerPage = atom(4);

export const skip = atom(
  (get) => get(actualPage) * (get(RowsPerPage) - 1)
);

export const MaxPageNumber = atom((get) => {
  const rowsNumber = get(DataRowsNumber);
  const rowsperpage = get(RowsPerPage);
  return Math.ceil(rowsNumber / rowsperpage);
});

export const actualPage = atom(1);

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
