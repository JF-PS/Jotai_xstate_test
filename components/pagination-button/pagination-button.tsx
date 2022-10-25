import React from 'react';
import Button from '@mui/material/Button';
import { useAtom } from 'jotai';
import { dataGridMachineAtom } from '../../atoms';

interface PaginationButtonProps {
  pageNumber: number;
}

const PaginationButton = (props: PaginationButtonProps) => {
  const { pageNumber } = props;

  const [state, send] = useAtom(dataGridMachineAtom);
  const { currentPage } = state.context;

  return (
    <Button
      variant={pageNumber === currentPage ? 'contained' : 'outlined'}
      onClick={() =>
        send({
          type: 'GO_TO_PAGE_NUMBER_CLICK',
          currentPage: pageNumber
        })
      }
    >
      {pageNumber + 1}
    </Button>
  );
};

export default PaginationButton;
