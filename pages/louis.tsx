import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { fetchApi } from '../utils';
import { PeopleType } from '../types';
import { peoplesColumn } from '../components/data-grid';
import { takeAtom, currentPageAtom, updatePageCountAtom } from '../atoms';
import { DataGrid } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import { Pagination } from '../louis-components/';
import { useAtom, useSetAtom } from 'jotai';

const rowsPerPage = [100, 24, 18, 12, 6];

interface HomePageProps {
  people: PeopleType[];
}

const HomePage = (props: HomePageProps) => {
  console.log(props.people);

  return (
    <Stack sx={{ height: '100vh', width: '100%', overflow: 'hidden' }}>
      <Pagination rowsPerPage={rowsPerPage} />
      {/* <DataGrid
        rowHeight={100}
        page={}
        pageSize={}
        onPageSizeChange={}
        onPageChange={}
        rowsPerPageOptions={rowsPerPage}
        pagination
        columns={peoplesColumn}
        rows={}
      /> */}
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
