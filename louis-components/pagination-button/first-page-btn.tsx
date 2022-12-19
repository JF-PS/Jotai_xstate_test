import React from 'react';
import PaginationButton from './pagination-button';

import { IconChevronsLeft } from '@tabler/icons';
import { useAtom } from 'jotai';
import { paginationMachineAtom } from '../../louis-machines';

function FirstPageBtn() {
  const [current, send] = useAtom(paginationMachineAtom);

  const { actualPage } = current.context;

  const handleClick = () => {
    send({
      type: 'FIRSTPAGE'
    });
  };

  return (
    <PaginationButton
      disabled={actualPage <= 0}
      onClick={handleClick}
      Icon={IconChevronsLeft}
    />
  );
}

export default FirstPageBtn;
