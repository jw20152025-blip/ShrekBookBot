import "dotenv/config";
import { REST, Routes } from "discord.js";
import { commands } from "./src/commands.js";
for(const key of ["DISCORD_TOKEN","DISCORD_CLIENT_ID","DISCORD_GUILD_ID"]){if(!process.env[key]){console.error(`Missing ${key} in .env`);process.exit(1);}}
const rest=new REST({version:"10"}).setToken(process.env.DISCORD_TOKEN);
try{console.log("Registering ShrekBook slash commands...");const body=commands.map(c=>c.data.toJSON());await rest.put(Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID,process.env.DISCORD_GUILD_ID),{body});console.log(`✅ Registered ${body.length} commands.`);}catch(e){console.error("❌ Command registration failed:",e);process.exit(1);}
