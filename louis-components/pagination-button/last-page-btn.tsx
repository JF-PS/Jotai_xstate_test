import React from 'react';
import PaginationButton from './pagination-button';

import { IconChevronsRight } from '@tabler/icons';
import { useAtom } from 'jotai';
import { paginationMachineAtom } from '../../louis-machines';

function LastPageBtn() {
  const [current, send] = useAtom(paginationMachineAtom);

  const { actualPage, MaxPageNumber } = current.context;

  const handleClick = () => {
    send({
      type: 'LASTPAGE'
    });
  };

  return (
    <PaginationButton
      disabled={actualPage >= MaxPageNumber}
      onClick={handleClick}
      Icon={IconChevronsRight}
    />
  );
}

export default LastPageBtn;
