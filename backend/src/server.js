import express from "express"
import { ENV } from "./lib/env.js"
import path from "path"
import cors from "cors"
import { fileURLToPath } from "url"
import { connectDB } from "../src/lib/db.js";
import { functions, inngest } from "./lib/inngest.js"
import { serve } from "inngest/express";
import { clerkMiddleware } from '@clerk/express'
import { protectRoute } from "./middleware/protectRoute.js"
import chatRoutes from "./routes/chatRoutes.js"

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}));
app.use(clerkMiddleware())
app.use("/api/inngest",serve({client:inngest,functions}))
app.use("/api/chats",chatRoutes)

// API routes
app.get('/madan', (req, res) => {
  req.auth;
  res.status(200).json({ message: "omala deii" })
})

// 🔒 Protected Test Route
app.get("/me", protectRoute, (req, res) => {
  res.status(200).json({
    message: "Access granted",
    user: req.user
  });
});

// Serve frontend in production
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
  });
}

export default app; 

//start the Server

const startServer = async() => {
  if (ENV.NODE_ENV !== "production") {
    try {
      await connectDB();
      app.listen(ENV.PORT, () => {
        console.log(`http://localhost:${ENV.PORT}`)
      })
    } catch(err) {
      console.error("💀Error starting server:", err);
    }
  }
}

startServer();