import { useAtom } from 'jotai';
import { dataGridMachineAtom } from '../../atoms';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface SelectRowPerPageProps {
  rowsPerPage: number[];
}
const SelectRowPerPage = (props: SelectRowPerPageProps) => {
  const { rowsPerPage } = props;
  const [state, send] = useAtom(dataGridMachineAtom);
  const { take } = state.context;

  const handleChange = (event: SelectChangeEvent) => {
    send({
      type: 'SELECT_TAKE_CLICK',
      take: parseInt(event.target.value, 10)
    });
  };

  return (
    <FormControl>
      <InputLabel id='demo-simple-select-label'>Rows per page</InputLabel>
      <Select
        labelId='demo-simple-select-label'
        id='demo-simple-select'
        value={`${take}`}
        label=' Rows per page'
        onChange={handleChange}
      >
        {rowsPerPage.map((value: number, index: number) => {
          return (
            <MenuItem key={index} value={value}>
              {value}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default SelectRowPerPage;
