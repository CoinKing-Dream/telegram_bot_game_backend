import express, { Express } from "express";
import cors from "cors";

import wallet from "./routes/api/wallet"
import connectDB from "./lib/dbConnect";
import dotenv from "dotenv";
const TelegramBot = require('node-telegram-bot-api');
const { TOKEN } = require('./config/index');
const { handleUsername } = require('./game.js');
const http = require('http');

const bot = new TelegramBot(TOKEN, { polling: true });

dotenv.config();
const app: Express = express();
const port: Number = process.env.PORT ? Number(process.env.PORT) : 5000;

const path = require("path");

connectDB();
app.set("trust proxy", true);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/static", express.static(__dirname + "/public"));

app.use("/api/wallet", wallet);
app.get("/api/get-suv-version", (req, res) => {
  res.send(
    JSON.stringify({
      version: "1.0.0",
      file: "suv-1.0.0.zip",
      update_at: "2023-06-14",
    })
  );
});

if (process.env.ENVIRONMENT === "PRODUCTION") {
  console.log("Production requested");
  app.use(express.static(path.join(__dirname, "build", "index.html")));

  app.get("/*", async (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});

bot.on('message', async msg => {
  try {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    const { text } = msg;
    const COMMANDS = text.toUpperCase();
    
    if (!text) return;

    switch (COMMANDS) {
      case '/START':
        bot.sendMessage(
          chatId,
          `Let's get started!\n\nWhat is your XATOMS username?`,
          {
            parse_mode: 'HTML',
          }
        );
        break;
      default:
        handleUsername(bot, chatId, userId, text);
    }
  } catch (err) {
    console.error(err);
  }
})
