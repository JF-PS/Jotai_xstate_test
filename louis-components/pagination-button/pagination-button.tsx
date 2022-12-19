import React from 'react';
import { ActionIcon, ActionIconProps } from '@mantine/core';
import { TablerIcon } from '@tabler/icons';

interface PaginationButtonProps extends Omit<ActionIconProps, 'children'> {
  Icon: TablerIcon;
  onClick: () => void;
}

function PaginationButton(props: PaginationButtonProps) {
  const { onClick, Icon, ...other } = props;

  return (
    <ActionIcon {...other} onClick={onClick}>
      <Icon />
    </ActionIcon>
  );
}

export default PaginationButton;
