import type { NextPage } from 'next';
import { useEffect, useState, useCallback } from 'react';
import { fetchApi } from '../utils';
import { PeopleType } from '../types';
import { peoplesColumn } from '../components/data-grid';
import {
  takeAtom,
  currentPageAtom,
  updatePageCountAtom,
  dataGridMachineAtom
} from '../atoms';
import { DataGrid } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import Pagination from '../components/pagination/pagination';
import { useAtom, useSetAtom } from 'jotai';

const rowsPerPage = [100, 24, 18, 12, 6];

interface HomePageProps {
  people: PeopleType[];
}

const HomePage = (props: HomePageProps) => {
  const [state, send] = useAtom(dataGridMachineAtom);
  const { data: rows, take, currentPage } = state.context;

  const handlePageSizeChange = (take: number) => {
    send({
      type: 'SELECT_TAKE_CLICK',
      take
    });
  };

  const handlePageNumberChange = (currentPage: number) => {
    send({
      type: 'GO_TO_PAGE_NUMBER_CLICK',
      currentPage
    });
  };

  if (state.matches('loading')) return <p>Loading ...</p>;

  return (
    <Stack sx={{ height: '100vh', width: '100%', overflow: 'hidden' }}>
      <Pagination rowsPerPage={rowsPerPage} />
      {currentPage}
      <DataGrid
        rowHeight={100}
        page={currentPage}
        pageSize={take}
        onPageSizeChange={handlePageSizeChange}
        onPageChange={handlePageNumberChange}
        rowsPerPageOptions={rowsPerPage}
        pagination
        columns={peoplesColumn}
        rows={rows}
      />
      <Pagination rowsPerPage={rowsPerPage} />
    </Stack>
  );
};

export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const people = await fetchApi('peoples');

  // By returning { props: { peoples } }, the HomePage component
  // will receive `peoples` as a prop at build time
  return {
    props: {
      people
    }
  };
}

export default HomePage;
