import { useEffect, useState } from 'react';
import type { NextPage } from 'next';

import { Group, Text } from '@mantine/core';
import { DataGrid } from '@mui/x-data-grid';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import { fetchApi } from '../utils';
import { PeopleType } from '../types';
import { ClientOnly, Pagination } from '../louis-components/';
import { peoplesColumn } from '../components/data-grid';
import {
  actualPage,
  DataRowsNumber,
  MaxPageNumber,
  RowsPerPage
} from '../louis-atoms';

import { ThemeProvider, useTheme } from '@mui/material';
import {
  PaginationMachine,
  paginationMachineAtom
} from '../louis-machines';

const rowsPerPage = [100, 24, 18, 12, 6];

interface HomePageProps {
  people: PeopleType[];
}

const HomePage = (props: HomePageProps) => {
  const { people } = props;
  const muitheme = useTheme();
  const [rows] = useState<PeopleType[]>(people);

  const setDataRowsNumber = useSetAtom(DataRowsNumber);
  const [actualPageNumber, setActualPageNumber] = useAtom(actualPage);
  const maxPagNumber = useAtomValue(MaxPageNumber);

  const [take, setTake] = useAtom(RowsPerPage);

  useEffect(() => {
    setDataRowsNumber(people.length);
  }, [people, setDataRowsNumber]);

  const [state, send] = useAtom(paginationMachineAtom);
  console.log(state.matches('init'));

  if (state.matches('init')) {
    send({ type: 'INIT' });
  }

  return (
    <Group
      sx={{
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        flexDirection: 'column'
      }}
    >
      <Pagination rowsPerPage={rowsPerPage} />
      <ClientOnly>
        <Text>
          page {actualPageNumber} of {maxPagNumber}
        </Text>
      </ClientOnly>
      <ThemeProvider theme={muitheme}>
        <DataGrid
          rowHeight={100}
          page={actualPageNumber}
          pageSize={take}
          onPageSizeChange={setTake}
          onPageChange={setActualPageNumber}
          rowsPerPageOptions={rowsPerPage}
          pagination
          columns={peoplesColumn}
          rows={rows}
          sx={{ width: '100%' }}
        />
      </ThemeProvider>
      <Pagination rowsPerPage={rowsPerPage} />
    </Group>
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
