import { useAtom } from 'jotai';
import { Group, Text } from '@mantine/core';
import { DataGrid } from '@mui/x-data-grid';

import { peoplesColumn } from '../components/data-grid';
import { ThemeProvider, useTheme } from '@mui/material';
import { paginationMachineAtom } from '../louis-machines';
import { ClientOnly, Pagination } from '../louis-components/';

const rowsPerPage = [100, 24, 18, 12, 6];

const HomePage = () => {
  const muitheme = useTheme();

  const [state, send] = useAtom(paginationMachineAtom);
  const {
    actualPage,
    RowsPerPage,
    MaxPageNumber,
    Data,
    DataRowsNumber,
    error
  } = state.context;

  if (state.matches('init')) {
    send({
      type: 'INIT'
    });
  }
  console.log('contexts', state.context);

  if (state.matches('fatalError')) {
    console.log('fatal from front');

    console.log(error);
  }
  if (state.matches('fetch') || !Data) {
    return <Text>Loading ...</Text>;
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
