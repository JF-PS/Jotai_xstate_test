import { atom } from "jotai";
import { atomWithMachine } from "jotai/xstate";
import { createEditableMachine } from "../machines";

export const defaultTextAtom = atom("edit me");
export const editableMachineAtom = atomWithMachine((get) =>
  // `get` is available only for initializing a machine
  createEditableMachine(get(defaultTextAtom))
);
