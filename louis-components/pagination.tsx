import React from 'react';
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

  return <SelectRowsPerPage data={data} />;
}

export default Pagination;
