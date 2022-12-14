import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { fetchApi } from '../utils';
import { PeopleType } from '../types';
import { peoplesColumn } from '../components/data-grid';
import { takeAtom, currentPageAtom, updatePageCountAtom } from '../atoms';
import { DataGrid } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import Pagination from '../components/pagination/pagination';
import { useAtom, useSetAtom } from 'jotai';
import { ThemeProvider } from '@mui/material';

const rowsPerPage = [100, 24, 18, 12, 6];

interface HomePageProps {
  people: PeopleType[];
}

const HomePage = (props: HomePageProps) => {
  const { people } = props;
  const [rows] = useState<PeopleType[]>(people);
  const updatePageCount = useSetAtom(updatePageCountAtom);
  updatePageCount(people.length);
  const [take, setTake] = useAtom(takeAtom);
  const [pageNumber, setPageNumber] = useAtom(currentPageAtom);

  return (
    <Stack sx={{ height: '100vh', width: '100%', overflow: 'hidden' }}>
      <Pagination rowsPerPage={rowsPerPage} />
      {pageNumber}

      <DataGrid
        rowHeight={100}
        page={pageNumber}
        pageSize={take}
        onPageSizeChange={setTake}
        onPageChange={setPageNumber}
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
