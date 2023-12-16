import { Avatar, Box, Stack, Typography } from "@mui/material";
import { marked } from "marked";

import logo from "../assets/lambda_logo.png";

const Message = ({ message }) => {
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
      return (
        <Typography sx={{ flex: 1 }} variant="body1">
          {message.text}
        </Typography>
      );
    } else {
      return (
        <div dangerouslySetInnerHTML={{ __html: marked.parse(message.text) }} />
      );
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
      <Stack direction="column">
        <Box>{name()}</Box>
        {text()}
      </Stack>
    </Box>
    
  );
};

export default Message;
