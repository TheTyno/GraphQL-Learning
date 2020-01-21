const express = require("express");
const graphqlHTTP = require("express-graphql");
const schema = require("../schema/schema.js");
const mongoose = require("mongoose");
const cors = require("cors");
const request = require("request");

const app = express();

//allow cross-origin
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://roberto:test123@gql-mongo-yvjpv.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true, dbName: "gql-mongo", useUnifiedTopology: true }
  )
  .then(() => console.log("Connected to mongo"))
  .catch(error => console.log(error.message));

const gqlObject = { schema, graphiql: true };

//how to send local files
app.get("/sendimage", (req, res) => {
  res.sendFile("/files/prueba.jpg", { root: __dirname });
});

//how to download a file from another server
app.get("/prueba", (req, res) => {
  res.setHeader("content-disposition", "attachment; filenane = cat.jpg");
  request(
    "https://metro.co.uk/wp-content/uploads/2016/09/167447202.jpg?quality=80&strip=all"
  ).pipe(res);
});

app.use("/", graphqlHTTP(gqlObject));

app.listen(4000, () => {
  console.log("listening on port 4000");
});
