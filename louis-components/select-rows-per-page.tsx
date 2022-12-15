import React from 'react';
import { useAtom } from 'jotai';
import { Select, SelectProps } from '@mantine/core';

import { propsSx } from '../utils';
import { RowsPerPage } from '../louis-atoms';

interface SelectRowsPerPageProps extends Omit<SelectProps, 'data'> {
  data: { label: string; value: string }[];
}

function SelectRowsPerPage(props: SelectRowsPerPageProps) {
  const { data, sx, ...other } = props;

  const [rows, setrows] = useAtom(RowsPerPage);

  const strNumber = rows.toString();

  const HandleChange = (value: string) => {
    const number = parseInt(value);
    setrows(number);
  };

  return (
    <Select
      {...other}
      sx={propsSx(sx)}
      data={data}
      value={strNumber ? strNumber : '6'}
      onChange={HandleChange}
    />
  );
}

export default SelectRowsPerPage;
