import { Group } from '@mantine/core';
import React from 'react';
import { EPaginationButtonActions } from '../louis-types';
import PaginationButton from './pagination-button';
import SelectRowsPerPage from './select-rows-per-page';

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
      <PaginationButton action={EPaginationButtonActions.first} />
      <PaginationButton action={EPaginationButtonActions.previous} />

      <PaginationButton action={EPaginationButtonActions.next} />
      <PaginationButton action={EPaginationButtonActions.last} />
    </Group>
  );
}

export default Pagination;
