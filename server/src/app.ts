import cors from "cors";
import express from "express";
import db from "./models/index";

const app = express();
const hostname = "127.0.0.1";
const port = 3000;

import users from "./routes/userRoute";
import auth from "./routes/authRoute";

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/users", users);
app.use("/api/auth", auth);

//self invoked function
(async function bootstrap() {
  await db.sequelize.sync(); //sync() establishes connection to the datatbase and creates the tables if they don't exist
  app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
})();
