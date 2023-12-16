import { Box, IconButton, InputBase, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import StopIcon from "@mui/icons-material/Stop";

import "./InputBar.css";
import { useState } from "react";
import { block } from "marked";

import CustomToolTip from "./CustomToolTip";

const InputBar = ({ onClickSend, sendIsAvailable, onClickStop }) => {
  const [value, setValue] = useState("");

  return (
    <Box
      className="input-bar"
      sx={{
        border: 1,
        borderColor: "#CCCCCC",
        padding: "5px",
        borderRadius: 3,
        marginInline: 1,
        marginBlock: 1,
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <CustomToolTip
        title="Attaching file is not available in this version"
        arrow
      >
        <div>
          <IconButton sx={{ p: "10px" }} aria-label="join-file" disabled={true}>
            <AttachFileIcon />
          </IconButton>
        </div>
      </CustomToolTip>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Message LambdaGPT..."
        inputProps={{ "aria-label": "user chat input" }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        multiline
      />
      <CustomToolTip title="Submit input" arrow>
        <div>
          {sendIsAvailable ? (
            <IconButton
              type="button"
              sx={{
                p: "10px",
                backgroundColor: "black",
                color: "white",
                borderRadius: 2,
                ":hover": { backgroundColor: "#777777" },
              }}
              aria-label="submit"
              onClick={(_) => {
                onClickSend(value);
                setValue("");
              }}
              disabled={value === ""}
            >
              <ArrowUpwardRoundedIcon />
            </IconButton>
          ) : (
            <IconButton
              type="button"
              sx={{
                p: "10px",
                ":hover": { backgroundColor: "#777777" },
              }}
              aria-label="submit"
              onClick={(_) => {
                onClickStop();
              }}
            >
              <StopIcon />
              <CircularProgress
                size={48} // Adjust the size as needed
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-24px", // Half of the size
                  marginLeft: "-24px", // Half of the size
                  color: "black"
                }}
              />
            </IconButton>
          )}
        </div>
      </CustomToolTip>
    </Box>
  );
};

export default InputBar;
