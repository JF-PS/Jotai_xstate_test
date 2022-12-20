import React, { useState } from 'react';

import { useAtom } from 'jotai';
import { DataGrid } from '@mui/x-data-grid';
import { IconAlertCircle } from '@tabler/icons';
import { ThemeProvider, useTheme } from '@mui/material';
import { Alert, Button, Group, Loader, Text } from '@mantine/core';

import { peoplesColumn } from '../components/data-grid';
import { paginationMachineAtom } from '../louis-machines';
import { ClientOnly, Pagination } from '../louis-components/';

const rowsPerPage = [100, 24, 18, 12, 6];

const HomePage = () => {
  const muitheme = useTheme();

  const [state, send] = useAtom(paginationMachineAtom);
  const { actualPage, RowsPerPage, MaxPageNumber, Data, error, counter } =
    state.context;

  if (state.matches('init')) {
    send({
      type: 'INIT',
      fetchUrl: 'peoples'
    });
  }

  if (state.matches('fatalError')) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title='Fatal Error'
        color='red'
        variant='filled'
      >
        We are sorry but an error occured in the application
      </Alert>
    );
  }

  if (state.matches('RETRY')) {
    let errorTitle = 'Error';
    let errorMessage;

    if (error === 404) {
      errorTitle = 'Fetch Error, path not found';
    }
    errorMessage = `Will try again in ${counter * 5} seconds`;

    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title={errorTitle}
        color='red'
      >
        {errorMessage}
        <Button onClick={() => send({ type: 'TRYAGAIN' })}>
          Retry now
        </Button>
      </Alert>
    );
  }
  if (state.matches('fetch') || !Data) {
    return (
      <Group>
        <Text>Loading</Text>
        <Loader color='indigo' />
      </Group>
    );
  }

  const handleChange = (pageNumber: number) => {
    send({
      type: 'SETPAGE',
      pageNumber: pageNumber
    });
  };

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
          page {actualPage} of {MaxPageNumber}
        </Text>
      </ClientOnly>
      <ThemeProvider theme={muitheme}>
        <DataGrid
          rowHeight={100}
          page={actualPage}
          pageSize={RowsPerPage}
          onPageSizeChange={(value: number) =>
            send({ type: 'SETROWSPERPAGE', number: value })
          }
          onPageChange={handleChange}
          rowsPerPageOptions={rowsPerPage}
          pagination
          columns={peoplesColumn}
          rows={Data}
          sx={{ width: '100%' }}
        />
      </ThemeProvider>
      <Pagination rowsPerPage={rowsPerPage} />
    </Group>
  );
};

export default HomePage;
