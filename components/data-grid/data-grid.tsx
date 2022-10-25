import * as React from 'react';
import Stack from '@mui/material/Stack';
import { DataGrid as MuiXDataGrid } from '@mui/x-data-grid';
import Pagination from '../pagination/pagination';
import { useAtom, useSetAtom } from 'jotai';
import {
  takeAtom,
  currentPageAtom,
  updatePageCountAtom
} from '../../atoms';

import type { PeopleType } from '../../types';

interface DataGridProps {
  rows: any[];
  columns: any[];
  rowsPerPage: number[];
}

const DataGrid = (props: DataGridProps) => {
  const { rows, columns, rowsPerPage } = props;

  const [take, setTake] = useAtom(takeAtom);
  const updatePageCount = useSetAtom(updatePageCountAtom);
  const [pageNumber, setPageNumber] = useAtom(currentPageAtom);

  updatePageCount(rows.length);

  return (
    <Stack sx={{ height: '100vh', width: '100%', overflow: 'hidden' }}>
      <Pagination rowsPerPage={rowsPerPage} />
      <MuiXDataGrid
        rowHeight={100}
        page={pageNumber - 1}
        pageSize={take}
        onPageSizeChange={setTake}
        onPageChange={(currentSkip) => setPageNumber(currentSkip + 1)}
        rowsPerPageOptions={rowsPerPage}
        pagination
        columns={columns}
        rows={rows}
      />
      <Pagination rowsPerPage={rowsPerPage} />
    </Stack>
  );
};

export default DataGrid;
