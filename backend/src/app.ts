import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import sosRoutes from "./routes/sos";
import nearbyRoutes from "./routes/nearby";
import donorRoutes from "./routes/donors";
import protocolsRoutes from "./routes/protocols";
import publicNumbersRoutes from "./routes/publicNumbers";
import { errorHandler } from "./middlewares/errorHandler";
import { config } from "./config";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.json({ message: "SafeHub API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/nearby", nearbyRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/protocols", protocolsRoutes);
app.use("/api/public-numbers", publicNumbersRoutes);

app.use(errorHandler);

export default app;
