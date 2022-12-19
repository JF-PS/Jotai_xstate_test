import React from 'react';
import PaginationButton from './pagination-button';

import { IconChevronRight } from '@tabler/icons';
import { useAtom } from 'jotai';
import { paginationMachineAtom } from '../../louis-machines';

function NextPageBtn() {
  const [current, send] = useAtom(paginationMachineAtom);

  const { actualPage, MaxPageNumber } = current.context;

  const handleClick = () => {
    send({
      type: 'NEXTPAGE'
    });
  };

  return (
    <PaginationButton
      disabled={actualPage >= MaxPageNumber}
      onClick={handleClick}
      Icon={IconChevronRight}
    />
  );
}

export default NextPageBtn;
