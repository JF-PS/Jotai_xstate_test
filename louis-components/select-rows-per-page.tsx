import { Select } from '@mantine/core';
import { SetStateAction, useAtom } from 'jotai';
import React from 'react';
import { RowsPerPage } from '../louis-atoms';

interface SelectRowsPerPageProps {
  data: { label: string; value: string }[];
}

function SelectRowsPerPage(props: SelectRowsPerPageProps) {
  const { data } = props;

  const [rows, setrows] = useAtom(RowsPerPage);

  const strNumber = rows.toString(10);

  return (
    <Select
      data={data}
      value={strNumber ? strNumber : '4'}
      onChange={(number: SetStateAction<number>) => setrows(number)}
    />
  );
}

export default SelectRowsPerPage;
