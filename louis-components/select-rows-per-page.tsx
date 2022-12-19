import React from 'react';
import { useAtom } from 'jotai';
import { Select, SelectProps } from '@mantine/core';

import { propsSx } from '../utils';

import { paginationMachineAtom } from '../louis-machines';

interface SelectRowsPerPageProps extends Omit<SelectProps, 'data'> {
  data: { label: string; value: string }[];
}

function SelectRowsPerPage(props: SelectRowsPerPageProps) {
  const { data, sx, ...other } = props;

  const [state, send] = useAtom(paginationMachineAtom);

  const { RowsPerPage } = state.context;
  const strValue = RowsPerPage.toString();

  const HandleChange = (value: string) => {
    const number = parseInt(value);

    send({
      type: 'SETROWSPERPAGE',
      number
    });
  };

  return (
    <Select
      {...other}
      sx={propsSx(sx)}
      data={data}
      value={strValue ? strValue : '6'}
      onChange={HandleChange}
    />
  );
}

export default SelectRowsPerPage;
