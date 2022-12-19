import React from 'react';
import { Group } from '@mantine/core';

import PaginationButton from './pagination-button/pagination-button';
import SelectRowsPerPage from './select-rows-per-page';
import { EPaginationButtonActions } from '../louis-types';
import ClientOnly from './client-only';
import {
  FirstPageBtn,
  LastPageBtn,
  NextPageBtn,
  PreviousPageBtn
} from './pagination-button';

interface PaginationProps {
  rowsPerPage: number[];
}

function Pagination(props: PaginationProps) {
  const { rowsPerPage } = props;
  const data = rowsPerPage.map((number) => ({
    label: number.toString(10),
    value: number.toString(10)
  }));

  return (
    <Group>
      <SelectRowsPerPage data={data} />
      <ClientOnly>
        <FirstPageBtn />
        <PreviousPageBtn />
        <NextPageBtn />
        <LastPageBtn />
      </ClientOnly>
    </Group>
  );
}

export default Pagination;
