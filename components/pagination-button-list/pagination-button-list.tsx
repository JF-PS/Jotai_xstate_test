import React from 'react';
import Stack from '@mui/material/Stack';

import { useAtom, useAtomValue } from 'jotai';
import { pageCountAtom, currentPageAtom } from '../../atoms';
import PaginationButton from './../pagination-button/pagination-button';

const PaginationButtonList = () => {
  const pageCount = useAtomValue(pageCountAtom);
  return (
    <Stack spacing={2} direction='row'>
      {[...Array(pageCount)].map((_: number, index: number) => (
        <PaginationButton key={index} pageNumber={index} />
      ))}
    </Stack>
  );
};

export default PaginationButtonList;
