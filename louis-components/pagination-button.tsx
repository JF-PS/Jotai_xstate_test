import React from 'react';
import { ActionIcon, ActionIconProps } from '@mantine/core';
import {
  IconChevronLeft,
  IconChevronsLeft,
  IconChevronRight,
  IconChevronsRight
} from '@tabler/icons';
import { useAtomValue, useSetAtom } from 'jotai';

import { EPaginationButtonActions } from '../louis-types';
import { actualPage, MaxPageNumber, setActualPage } from '../louis-atoms';

const ActionIconsList = {
  [EPaginationButtonActions.first]: IconChevronsLeft,
  [EPaginationButtonActions.last]: IconChevronsRight,
  [EPaginationButtonActions.previous]: IconChevronLeft,
  [EPaginationButtonActions.next]: IconChevronRight
};

interface PaginationButtonProps extends Omit<ActionIconProps, 'disabled'> {
  action: EPaginationButtonActions;
}

function PaginationButton(props: PaginationButtonProps) {
  const { action, ...other } = props;
  const Icon = ActionIconsList[action];

  const setNewPage = useSetAtom(setActualPage);
  const handleClick = () => {
    setNewPage(action);
  };
  const actualPageNumber = useAtomValue(actualPage);
  const MaxPageNbr = useAtomValue(MaxPageNumber);

  let disable = false;

  if (
    actualPageNumber <= 0 &&
    (action === EPaginationButtonActions.first ||
      action === EPaginationButtonActions.previous)
  ) {
    disable = true;
  }

  if (
    actualPageNumber >= MaxPageNbr &&
    (action === EPaginationButtonActions.last ||
      action === EPaginationButtonActions.next)
  ) {
    disable = true;
  }

  return (
    <ActionIcon {...other} onClick={handleClick} disabled={disable}>
      <Icon />
    </ActionIcon>
  );
}

export default PaginationButton;
