import { Box } from '@mantine/core';
import React, { ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
}

function ClientOnly(props: ClientOnlyProps) {
  const { children } = props;

  const [hasMounted, setHasMounted] = React.useState(false);
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}
export default ClientOnly;
