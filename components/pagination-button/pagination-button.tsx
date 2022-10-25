import React from 'react';
import Button from '@mui/material/Button';
import { useAtom } from 'jotai';
import { currentPageAtom } from '../../atoms';

interface PaginationButtonProps {
  pageNumber: number;
}

const PaginationButton = (props: PaginationButtonProps) => {
  const { pageNumber: currentPage } = props;
  const [pageNumber, setPageNumber] = useAtom(currentPageAtom);

  return (
    <Button
      variant={pageNumber === currentPage ? 'contained' : 'outlined'}
      onClick={() => setPageNumber(currentPage)}
    >
      {currentPage + 1}
    </Button>
  );
};

export default PaginationButton;
