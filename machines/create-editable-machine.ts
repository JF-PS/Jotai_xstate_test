import { assign, createMachine } from "xstate";

const createEditableMachine = (value: string) =>
  createMachine<{ value: string }>({
    id: "editable",
    initial: "reading",
    context: {
      value,
    },
    states: {
      reading: {
        on: {
          dblclick: "editing",
        },
      },
      editing: {
        on: {
          cancel: "reading",
          commit: {
            target: "reading",
            actions: assign({
              value: (_, { value }) => value,
            }),
          },
        },
      },
    },
  });

export default createEditableMachine;
