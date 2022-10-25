import React from "react";
import Box from "@mui/material/Box";
import { useAtom } from "jotai";
import { editableMachineAtom } from "../../atoms";

const Toggle = () => {
  const [state, send] = useAtom(editableMachineAtom);

  return (
    <Box>
      {state.matches("reading") && (
        <strong onDoubleClick={send}>{state.context.value}</strong>
      )}
      {state.matches("editing") && (
        <input
          autoFocus
          defaultValue={state.context.value}
          onBlur={(e) => send({ type: "commit", value: e.target.value })}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              send({ type: "commit", value: e?.target?.value });
            }
            if (e.key === "Escape") {
              send("cancel");
            }
          }}
        />
      )}
      <br />
      <br />
      <Box>
        Double-click to edit. Blur the input or press <code>enter</code> to
        commit. Press <code>esc</code> to cancel.
      </Box>
    </Box>
  );
};

export default Toggle;
