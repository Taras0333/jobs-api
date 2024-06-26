require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

const auth = require("./middleware/authentication");
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

// security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

// swagger
const swaggerUI = require("swagger-ui-express");
const YML = require("yamljs");
const swagerDoc = YML.load("./swagger.yaml");

// connecDB
const connectDB = require("./db/connect");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    max: 100,
    windowMs: 15 * 60 * 1000,
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
// extra packages

app.get("/", (req, res) => [res.send('<a href="/api_doc">Documentation</a>')]);

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", auth, jobsRouter);
app.use("/api_doc", swaggerUI.serve, swaggerUI.setup(swagerDoc));

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5002;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
