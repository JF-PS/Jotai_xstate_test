import { atom } from 'jotai';

export const currentPageAtom = atom(0);

export const pageCountAtom = atom(1);

export const updatePageCountAtom = atom(
  null,
  (get, set, newCount: number) => {
    set(pageCountAtom, Math.ceil(newCount / get(takeAtom)));
  }
);

export const takeAtom = atom(6);

export const skipAtom = atom((get) => {
  const pageNumber = get(currentPageAtom);
  const take = get(takeAtom);
  return Math.ceil(pageNumber * take - take);
});
