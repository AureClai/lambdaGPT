import { Avatar, Box, Stack, TextField, Typography } from "@mui/material";
import { marked, use } from "marked";
import ReplayIcon from "@mui/icons-material/Replay";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";

import logo from "../assets/lambda_logo.png";
import "./Message.css";

import CustomToolTip from "./CustomToolTip";
import { useState } from "react";

const Message = ({ message, onValidEditClick, onReloadClick }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(message.text);

  const avatar = () => {
    if (message.author === "user") {
      return (
        <Avatar
          sx={{ mr: 1 }}
          style={{
            border: "1px solid lightgrey",
          }}
        >
          U
        </Avatar>
      );
    } else {
      return (
        <Avatar
          sx={{ mr: 1 }}
          style={{
            border: "1px solid lightgrey",
          }}
          src={logo}
        />
      );
    }
  };

  const name = () => {
    if (message.author === "user") {
      return (
        <Typography sx={{ flex: 1 }} variant="h6">
          You
        </Typography>
      );
    } else {
      return (
        <Typography sx={{ flex: 1 }} variant="h6">
          LambdaGPT
        </Typography>
      );
    }
  };

  const text = () => {
    if (message.author === "user") {
      if (!editing) {
        return (
          <Typography sx={{ flex: 1 }} variant="body1">
            <div dangerouslySetInnerHTML={{ __html: marked.parse(message.text) }} style={{paddingRight: "5px"}}/>
          </Typography>
        );
      } else {
        return (
          <TextField
            sx={{ flex: 1, width: "100%" }}
            value={value}
            multiline
            onChange={(e) => setValue(e.target.value)}
          />
        );
      }
    } else {
      return (
        <div dangerouslySetInnerHTML={{ __html: marked.parse(message.text) }} />
      );
    }
  };

  const bottomTools = () => {
    if (message.author === "user") {
      if (!editing) {
        return (
          <Stack direction="row">
            <div
              onClick={(_) => {
                if (!editing) setEditing(true);
              }}
            >
              <CustomToolTip title="Edit this message" arrow placement="bottom">
                <EditIcon className="message-tool" />
              </CustomToolTip>
            </div>
          </Stack>
        );
      } else {
        return (
          <Stack direction="row">
            <div
              onClick={(_) => {
                setEditing(false);
                onValidEditClick(message.id, value);
              }}
            >
              <CustomToolTip
                title="Submit the new message"
                arrow
                placement="bottom"
              >
                <CheckIcon className="message-tool" />
              </CustomToolTip>
            </div>
            <div
              onClick={(_) => {
                setEditing(false);
                setValue(message.text);
              }}
            >
              <CustomToolTip title="Cancel" arrow placement="bottom">
                <CancelIcon className="message-tool" />
              </CustomToolTip>
            </div>
          </Stack>
        );
      }
    } else {
      if (typeof onReloadClick === "function") {
        return (
          <Stack direction="row">
            <div onClick={(_) => onReloadClick(message.id)}>
              <CustomToolTip
                title="Reload that response"
                arrow
                placement="bottom"
              >
                <ReplayIcon className="message-tool" />
              </CustomToolTip>
            </div>
          </Stack>
        );
      }
      return <Stack></Stack>;
    }
  };

  return (
    <Box
      className="message"
      sx={{
        padding: "5px",
        marginInline: 1,
        marginBottom: 3,
        display: "flex",
        alignItems: "flex-top",
        width: "100%",
      }}
    >
      {avatar()}
      <Stack direction="column" sx={{display: "flex", flex: 1, paddingRight:"5px"}}>
        <Box>{name()}</Box>
        {text()}
        {bottomTools()}
      </Stack>
    </Box>
  );
};

export default Message;
