const Discord = require("discord.js");
const client = new Discord.Client();
const axios = require("axios");
require("dotenv").config();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
client.on("message", async (msg) => {
  if (msg.content.startsWith("yecta ")) {
    const command = msg.content.replace("yecta ", "");
    if (command === "ping") {
      msg.reply("Pong!");
    } else if (command === "rifas vendidas") {
      const url = `${process.env.API_URL}?spreadsheetId=${process.env.SPREADSHEET_ID}`;
      const res = await axios.get(url);
      let count = 0;
      res.data.sales.forEach((s) => (count += s.quantity));
      msg.reply(count);
    } else if (command === "rifas ranking") {
      const url = `${process.env.API_URL}?spreadsheetId=${process.env.SPREADSHEET_ID}`;
      const res = await axios.get(url);
      const vendors = {};
      res.data.sales.forEach((s) => {
        if (!vendors[s.vendor]) vendors[s.vendor] = 0;
        vendors[s.vendor] += s.quantity;
      });

      const rankingArray = Object.entries(vendors)
        .sort((a, b) => b[1] - a[1]);

      console.log(rankingArray)

      let ranking = "\n**RANKING DE VENDEDORES:**"
      rankingArray.slice(0, 10).forEach((r, i) => {
        ranking += `\n${i+1}. ${r[0]} (${r[1]})` 
      })

      msg.reply(ranking);
    } else {
      msg.reply(`Comando inválido! Intenta con alguno de los siguientes comandos:
        - yecta rifas vendidas
        - yecta rifas ranking

      Si te gustaría que existiese otro comando, háblale a <@285326725955715073>`);
    }
  }
});

client.login(process.env.BOT_TOKEN);
