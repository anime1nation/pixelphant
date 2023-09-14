import { Client, GatewayIntentBits } from "discord.js";
import { token } from "./config.js";
import fetch from "node-fetch";
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

async function apiCall({ path, body, method }) {
  return fetch(`http://localhost:3000/discord/${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.error(error);
      return "Something went Wrong Try again";
    });
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  message.reply({ content: "Hey!! from bot!" });
});

client.on("interactionCreate", async (interaction) => {
  try {
    const { commandName, options, user } = interaction;
    console.log(user.username);
    if (!interaction.isCommand()) return;
    if (commandName === "ppcreateuser") {
      const username = options.getString("discordusername");
      const email = options.getString("email");
      const password = options.getString("password");

      const body = {
        username: username,
        email: email,
        password: password,
      };
      const res = await apiCall({ path: "signup", method: "POST", body: body });
      await interaction.reply(res.message);
    }
    if (commandName === "ppcreateservice") {
      const serviceName = options.getString("servicename");
      const serviceLink = options.getString("servicelink");
      const monthlyFee = options.getString("monthlyfee");

      const body = {
        username: user.username,
        serviceName: serviceName,
        serviceLink: serviceLink,
        monthlyFee: monthlyFee,
      };
      const res = await apiCall({
        path: "subscriptions",
        method: "POST",
        body: body,
      });
      await interaction.reply(res.message);
    }
    if (commandName === "ppgetuser") {
      const userName = options.getString("username");
      const res = await apiCall({ path: `users/${userName}`, method: "GET" });
      await interaction.reply(res.message);
    }
  } catch (error) {
    await interaction.reply("Something went wrong!! Try again")
  }
});

client.login(token);
