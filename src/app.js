const { createServer } = require("http");
const express = require("express");

const app = express();
const httpServer = createServer(app);

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("./public"));

httpServer.listen(3000, () =>
  console.log("Application Running Successfully on port 3000!")
);
