import React from 'react';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { dataGridMachineAtom } from '../../atoms';

import { useAtom } from 'jotai';

interface PaginationButtonProps {
  mode: 'left' | 'doubleLeft' | 'right' | 'doubleRight';
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactDOM;
}

const iconMode = {
  left: <KeyboardArrowLeftIcon />,
  doubleLeft: <KeyboardDoubleArrowLeftIcon />,
  right: <KeyboardArrowRightIcon />,
  doubleRight: <KeyboardDoubleArrowRightIcon />
};

const PaginationArrowButton = (props: PaginationButtonProps) => {
  const { children = null, mode, onClick = null, disabled } = props;

  const [state, send] = useAtom(dataGridMachineAtom);
  const { currentPage, totalPage: max } = state.context;
  const min = 0;

  const handleClick = () => {
    let newPage = currentPage;
    switch (mode) {
      case 'left':
        newPage = currentPage - 1;
        break;
      case 'doubleLeft':
        newPage = min;
        break;
      case 'right':
        newPage = currentPage + 1;
        break;
      case 'doubleRight':
        newPage = max;
        break;
      default:
        console.error(`No mode found !`);
    }
    send({
      type: 'GO_TO_PAGE_NUMBER_CLICK',
      currentPage: newPage
    });
  };

  const deactivator = (): boolean | undefined => {
    if (mode === 'left' || mode === 'doubleLeft') {
      return currentPage === min;
    }
    if (mode === 'right' || mode === 'doubleRight') {
      return currentPage + 1 === max;
    }
    return undefined;
  };

  return (
    <IconButton onClick={handleClick} disabled={disabled || deactivator()}>
      {children ? <>{children}</> : iconMode[mode]}
    </IconButton>
  );
};

export default PaginationArrowButton;
