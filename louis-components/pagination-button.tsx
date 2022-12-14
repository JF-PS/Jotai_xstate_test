import React from 'react';
import { ActionIcon } from '@mantine/core';
import {
  IconChevronLeft,
  IconChevronsLeft,
  IconChevronRight,
  IconChevronsRight
} from '@tabler/icons';
import { EPaginationButtonActions } from '../louis-types';
import { useAtomValue, useSetAtom } from 'jotai';
import { actualPage, MaxPageNumber, setActualPage } from '../louis-atoms';

const ActionIconsList = {
  [EPaginationButtonActions.first]: IconChevronsLeft,
  [EPaginationButtonActions.last]: IconChevronsRight,
  [EPaginationButtonActions.previous]: IconChevronLeft,
  [EPaginationButtonActions.next]: IconChevronRight
};

interface PaginationButtonProps {
  action: EPaginationButtonActions;
}

function PaginationButton(props: PaginationButtonProps) {
  const { action } = props;
  const Icon = ActionIconsList[action];

  const setNewPage = useSetAtom(setActualPage);
  const handleClick = () => {
    setNewPage(action);
  };
  const actualPageNumber = useAtomValue(actualPage);
  const MaxPageNbr = useAtomValue(MaxPageNumber);

  let disable = false;

  if (
    actualPageNumber <= 1 &&
    (action === 'first' || action === 'previous')
  ) {
    disable = true;
  }

  if (
    actualPageNumber >= MaxPageNbr &&
    (action === 'last' || action === 'next')
  ) {
    disable = true;
  }

  return (
    <ActionIcon onClick={handleClick} disabled={disable}>
      <Icon />
    </ActionIcon>
  );
}

export default PaginationButton;
