import React from 'react';
import Stack from '@mui/material/Stack';

import { useAtom } from 'jotai';
import { dataGridMachineAtom } from '../../atoms';
import PaginationButton from './../pagination-button/pagination-button';

const PaginationButtonList = () => {
  const [state] = useAtom(dataGridMachineAtom);
  const { totalPage } = state.context;
  return (
    <Stack spacing={2} direction='row'>
      {[...Array(totalPage)].map((_: number, index: number) => (
        <PaginationButton key={index} pageNumber={index} />
      ))}
    </Stack>
  );
};

export default PaginationButtonList;
