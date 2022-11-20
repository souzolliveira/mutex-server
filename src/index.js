const express = require("express");
const http = require("http");
const axios = require("axios");
let cors = require("cors");

const enumeration = require("./enumeration");

const APP = express();
APP.use(express.json());

const SERVER = http.createServer(APP);

const PORT = process.env.PORT;

APP.use(cors());

SERVER.listen(PORT);

let regions = {
  A: { state: enumeration.FREE, user: null, queue: [] },
  B: { state: enumeration.FREE, user: null, queue: [] },
  C: { state: enumeration.FREE, user: null, queue: [] },
};

APP.get("/open-session/:user/:region", (req, res) => {
  const { user, region } = req.params;
  let message = "";
  if (!regions.hasOwnProperty(region)) {
    message = enumeration.FORBIDDEN;
    res.json({ message, regions });
    return;
  }
  if (regions[region].state === enumeration.BLOCKED)
    if (!regions[region].queue.includes(user)) {
      regions = {
        ...regions,
        [region]: {
          ...regions[region],
          queue: [...regions[region].queue, user],
        },
      };
      message = enumeration.ENQUEUED;
    } else message = enumeration.WAITING;
  else if (regions[region].queue.length > 0)
    if (regions[region].queue[0] === user) {
      regions = {
        ...regions,
        [region]: {
          state: enumeration.BLOCKED,
          user,
          queue: regions[region].queue.filter((u) => u !== user),
        },
      };
      message = enumeration.GRANTED;
    } else {
      regions = {
        ...regions,
        [region]: {
          ...regions[region],
          queue: [...regions[region].queue.filter((u) => u !== user), user],
        },
      };
      message = enumeration.WAITING;
    }
  else {
    regions = {
      ...regions,
      [region]: {
        ...regions[region],
        user,
        state: enumeration.BLOCKED,
      },
    };
    message = enumeration.GRANTED;
  }
  res.json({ message, regions });
});

APP.get("/close-session/:user/:region", (req, res) => {
  const { user, region } = req.params;
  if (!regions.hasOwnProperty(region) || regions[region].user !== user) {
    res.json({ message: enumeration.FORBIDDEN, regions });
    return;
  }
  regions = {
    ...regions,
    [region]: {
      ...regions[region],
      user: null,
      state: enumeration.FREE,
    },
  };
  res.json({ message: enumeration.CLOSED, regions });
});
