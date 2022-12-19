import React from 'react';
import PaginationButton from './pagination-button';

import { IconChevronLeft } from '@tabler/icons';
import { useAtom } from 'jotai';
import { paginationMachineAtom } from '../../louis-machines';

function PreviousPageBtn() {
  const [current, send] = useAtom(paginationMachineAtom);

  const { actualPage } = current.context;

  const handleClick = () => {
    send({
      type: 'PREVIOUSPAGE'
    });
  };

  return (
    <PaginationButton
      disabled={actualPage <= 0}
      onClick={handleClick}
      Icon={IconChevronLeft}
    />
  );
}

export default PreviousPageBtn;
