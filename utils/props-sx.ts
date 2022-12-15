import React from 'react';

import { CSSObject, Sx, useMantineTheme } from '@mantine/core';

const PropsSx = (sx?: Sx | (Sx | undefined)[] | undefined): CSSObject => {
  const theme = useMantineTheme();
  let newStyle;
  if (sx) {
    if (typeof sx == 'function' && theme) {
      newStyle = sx(theme);
    }
    if (Array.isArray(sx)) {
      newStyle = Object.assign({}, ...sx);
    }
    if (!newStyle) {
      newStyle = sx;
    }
  }
  return newStyle;
};

export default PropsSx;
