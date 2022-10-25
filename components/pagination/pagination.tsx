import Stack from '@mui/material/Stack';
import PaginationArrowButton from '../pagination-arrow-button/pagination-arrow-button';
import PaginationButtonList from './../pagination-button-list/pagination-button-list';
import SelectRowPerPage from './../select-row-per-page/select-row-per-page';

interface PaginationProps {
  rowsPerPage: number[];
}

const Pagination = (props: PaginationProps) => {
  const { rowsPerPage } = props;

  return (
    <Stack
      direction='row'
      alignItems='center'
      data-testid='pagination'
      spacing={1}
      sx={{ p: 2 }}
    >
      <SelectRowPerPage rowsPerPage={rowsPerPage} />

      <PaginationArrowButton mode='doubleLeft' />
      <PaginationArrowButton mode='left' />

      <PaginationButtonList />

      <PaginationArrowButton mode='right' />
      <PaginationArrowButton mode='doubleRight' />
    </Stack>
  );
};

export default Pagination;
