const express = require("express");
const connectDataBase = require("./utils/database").mongooseConnect;

const PORT = process.env.PORT || 8080;

const crudRoutes = require("./routes/endpoint");

const app = express();

app.use(crudRoutes);

connectDataBase(() => {
  app.listen(PORT, console.log("Listening on :8080"));
});
