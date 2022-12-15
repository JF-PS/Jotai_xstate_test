import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { EPaginationButtonActions } from '../louis-types';

export const DataRowsNumber = atom(0);

export const RowsPerPage = atom(6);

// export const SetGetRowsPerPage = atom(
//   (get) => get(RowsPerPage),
//   (get, set, value: number) => {
//     set(RowsPerPage, value);

//     const result = Math.floor(get(skip) / get(RowsPerPage));

//     set(actualPage, result);
//     console.log('going to', result, '---', get(actualPage));
//     console.log('doing the maths : ', get(skip), ' / ', get(RowsPerPage));
//   }
// );

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
