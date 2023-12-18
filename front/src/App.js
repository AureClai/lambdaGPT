import { useEffect, useState, useRef, useCallback } from "react";
import {
  Typography,
  TextField,
  Button,
  Stack,
  Box,
  Avatar,
  IconButton,
  Paper,
  Grid,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import GitHubIcon from "@mui/icons-material/GitHub";
import KeyboardDoubleArrowDownRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowDownRounded";
import "./App.css";

import axios from "axios";

import InputBar from "./Components/InputBar";
import Message from "./Components/Message";
import CustomToolTip from "./Components/CustomToolTip";

import useOutsideClick from "./Hooks/useOutsideClick";

import logo from "./assets/lambda_logo.png";


const examples = {
  1: {
    main: "Tell me a fun fact",
    second: "about the Roman Empire",
  },
  2: {
    main: "Show me a code snippet",
    second: " of a factorial implementation in Go",
  },
  3: {
    main: "Come up with 5 concepts",
    second: "for a retro-style arcade game",
  },
  4: {
    main: "Recommend activities",
    second: "for a team-building day with remote employees",
  },
};

function App() {
  const [currPrompt, setCurrPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [chatWriting, setChatWriting] = useState(false);
  const [messages, setMessages] = useState([]);
  const [infoDisplay, setInfoDisplay] = useState(false);
  const [numberOfmessages, setnumerOfmessages] = useState(0);

  const infoPanelRef = useRef(null);

  const toggleButtonRef = useRef(null); // Ref for the toggle button

  const handleToggle = useCallback(() => {
    setInfoDisplay((prev) => !prev); // Toggle visibility
  }, []);

  const handleClickOutside = useCallback(
    (event) => {
      if (
        infoDisplay &&
        (!toggleButtonRef.current ||
          !toggleButtonRef.current.contains(event.target))
      ) {
        setInfoDisplay(false); // Hide the panel if click is outside and not on the toggle button
      }
    },
    [infoDisplay, toggleButtonRef]
  );

  useOutsideClick(infoPanelRef, handleClickOutside);

  useEffect(() => {
    if (chatWriting) {
      generate();
    }
  }, [chatWriting, response]);

  const generate = () => {
    // History use
    const history = messages
      .map((message) =>
        message.author === "user"
          ? `<>User:${message.text}`
          : `<>Lambda:${message.text}`
      )
      .join("");
    const data = {
      prompt: `${history}<>User: ${currPrompt}<>Lambda: ${response}`,
    };
    axios
      .post("http://localhost:5000/generate", data)
      .then((_apiResponse) => {
        setResponse(response + _apiResponse.data.response.choices[0].text); // Make sure to access the correct part of the response
        if (_apiResponse.data.response.choices[0].finish_reason === "length") {
        } else {
          if (chatWriting) {
            setChatWriting(false);
            setMessages([
              ...messages,
              {
                author: "lambda",
                text: response + _apiResponse.data.response.choices[0].text,
                id: numberOfmessages,
              },
            ]);
            setnumerOfmessages(numberOfmessages + 1);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setResponse("Failed to fetch data");
      });
  };

  const onClickEnvoyer = (value) => {
    if (!chatWriting) {
      setChatWriting(true);
      setCurrPrompt(value);
      setResponse("");
      setMessages([
        ...messages,
        { author: "user", text: value, id: numberOfmessages },
      ]);
      setnumerOfmessages(numberOfmessages + 1);
    }
  };

  const onClickStop = () => {
    if (chatWriting) {
      setChatWriting(false);
      setMessages([
        ...messages,
        {
          author: "lambda",
          text: response,
          id: numberOfmessages,
        },
      ]);
      setnumerOfmessages(numberOfmessages + 1);
    }
  };

  const onMessageEditClick = (id, text) => {
    if (!chatWriting) {
      const _messages = messages.filter((message) => {
        return message.id <= id - 1;
      });

      setChatWriting(true);
      setCurrPrompt(text);
      setResponse("");
      setMessages([..._messages, { author: "user", text: text, id: id }]);
      setnumerOfmessages(id + 1);
    }
  };

  const onMessageReloadClick = (id) => {
    const _messages = messages.filter((message) => {
      return message.id < id - 1;
    });
    const lastPrompt = messages.find((message) => {
      return message.id === id - 1;
    }).text;
    setnumerOfmessages(id - 1);
    if (true) {
      setChatWriting(true);
      setCurrPrompt(lastPrompt);
      setResponse("");
      setMessages([
        ..._messages,
        { author: "user", text: lastPrompt, id: id - 1 },
      ]);
      setnumerOfmessages(id);
    }
  };

  return (
    <div className="App">
      <div className="chat">
        <Stack direction="column" style={{ width: "100%", height: "100%" }}>
          <div
            className="chat-history"
            style={{
              flexGrow: 1,
              overflowY: "scroll",
              overflowX: "hidden",
              paddingRight: "8px",
            }}
          >
            {messages.length === 0 ? (
              <Box
                className="welcomer"
                sx={{
                  display: "flex",
                  flexDirection: "column", // Aligns children vertically
                  justifyContent: "center", // Centers children horizontally in the container
                  alignItems: "center", // Centers children vertically in the container
                  height: "100%", // Makes the box take the full height of its container
                  width: "100%", // Ensures the box takes the full width
                }}
              >
                <Stack
                  direction="column"
                  spacing={1}
                  sx={{
                    display: "flex",
                    justifyContent: "center", // Centers children vertically
                    alignItems: "center", // Centers children horizontally
                    height: "100%", // Adjust the height as needed
                    width: "100%", // Ensures the stack takes the full width
                  }}
                >
                  <Avatar
                    sx={{ width: 100, height: 100 }}
                    style={{ border: "3px solid black" }}
                    src={logo}
                  />
                  <Typography variant="h3">LambdaGPT</Typography>
                  <Typography variant="body1">
                    Start the chat with LambdaGPT in the bottom text field
                  </Typography>
                  <Typography variant="body1">or</Typography>
                  <Typography variant="body1">
                    Try an example below...
                  </Typography>
                  <KeyboardDoubleArrowDownRoundedIcon />
                </Stack>

                <Grid
                  container
                  spacing={2}
                  sx={{
                    width: "100%",
                    marginTop: "auto",
                    marginBottom: "10px",
                  }}
                >
                  {" "}
                  {/* Grid container */}
                  {[1, 2, 3, 4].map((item) => (
                    <Grid item xs={6} key={item}>
                      {" "}
                      {/* Grid items */}
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={(_) => {
                          onClickEnvoyer(
                            examples[item].main + " " + examples[item].second
                          );
                        }}
                      >
                        <Paper
                          sx={{
                            height: 50,
                            display: "flex",
                            justifyContent: "left",
                            alignItems: "center",
                            padding: 1,
                            backgroundColor: "#eee",
                            borderRadius: 2,
                          }}
                          elevation={3}
                        >
                          <Stack direction="column">
                            <Typography>{examples[item].main}</Typography>
                            <Typography>{examples[item].second}</Typography>
                          </Stack>
                        </Paper>
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : (
              [
                ...messages.map((message) => {
                  return (
                    <Message
                      key={`message${message.id}`}
                      message={message}
                      onValidEditClick={onMessageEditClick}
                      onReloadClick={onMessageReloadClick}
                    />
                  );
                }),
                chatWriting ? (
                  <Message
                    key={`message-curr`}
                    message={{ author: "lambda", text: response }}
                  />
                ) : null,
              ]
            )}
          </div>
          <InputBar
            onClickSend={(value) => onClickEnvoyer(value)}
            sendIsAvailable={!chatWriting}
            onClickStop={() => {
              onClickStop();
            }}
          />
        </Stack>
      </div>
      <div className="info">
        <CustomToolTip title="Display the info" arrow placement="left">
          <IconButton ref={toggleButtonRef} onClick={handleToggle}>
            <InfoIcon />
          </IconButton>
        </CustomToolTip>
      </div>
      <div
        ref={infoPanelRef}
        className={infoDisplay ? "info-panel show" : "info-panel"}
        aria-label="info-panel"
      >
        <Paper sx={{ padding: 1 }}>
          <Typography variant="body1">Created by Aurélien Clairais</Typography>
          <a
            href="https://github.com/AureClai/lambdaGPT"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon /> GitHub
          </a>
        </Paper>
      </div>
    </div>
  );
}

export default App;
