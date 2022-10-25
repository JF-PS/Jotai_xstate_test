import React from 'react';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { pageCountAtom, currentPageAtom } from '../../atoms';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';

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

  const [pageNumber, setPageNumber] = useAtom(currentPageAtom);
  const pageCount = useAtomValue(pageCountAtom);
  const min = 0;
  const max = useAtomValue(pageCountAtom);

  const handleClick = () => {
    switch (mode) {
      case 'left':
        setPageNumber(pageNumber - 1);
        break;
      case 'doubleLeft':
        setPageNumber(min);
        break;
      case 'right':
        setPageNumber(pageNumber + 1);
        break;
      case 'doubleRight':
        setPageNumber(max);
        break;
      default:
        console.error(`No mode found !`);
    }
  };

  const deactivator = (): boolean | undefined => {
    if (mode === 'left' || mode === 'doubleLeft') {
      return pageNumber === 0;
    }
    if (mode === 'right' || mode === 'doubleRight') {
      return pageNumber + 1 === pageCount;
    }
    return undefined;
  };

  return (
    <IconButton
      onClick={onClick || handleClick}
      disabled={disabled || deactivator()}
    >
      {children ? <>{children}</> : iconMode[mode]}
    </IconButton>
  );
};

export default PaginationArrowButton;
