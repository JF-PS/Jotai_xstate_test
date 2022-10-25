import React from 'react';
import { Toggle } from '../components';
import { useAtom, useSetAtom } from 'jotai';
import { editableMachineAtom, defaultTextAtom } from '../atoms';
const TogglePage = () => {
  const [state, send] = useAtom(editableMachineAtom);
  const [state2, send2] = useAtom(defaultTextAtom);
  return (
    <>
      {JSON.stringify({ initializeState: state2 })}
      <br />
      <br />
      {JSON.stringify({ contextValue: state.context.value })}
      <br />
      <br />
      <Toggle />
    </>
  );
};

export default TogglePage;
