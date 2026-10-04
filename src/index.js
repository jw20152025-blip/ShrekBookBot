import "dotenv/config";
import { Client, Events, GatewayIntentBits, ActivityType } from "discord.js";
import { commandMap } from "./commands.js";
import { startApi } from "./api.js";
for(const key of ["DISCORD_TOKEN","DISCORD_CLIENT_ID","DISCORD_GUILD_ID","SHREKBOOK_ROLE_ID","SHREKBOOK_API_SECRET"]){if(!process.env[key]){console.error(`❌ Missing ${key} in .env`);process.exit(1);}}
const client=new Client({intents:[GatewayIntentBits.Guilds]});
client.once(Events.ClientReady,ready=>{console.log(`🟢 Logged in as ${ready.user.tag}`);ready.user.setPresence({activities:[{name:"ShrekBook",type:ActivityType.Watching}],status:"online"});startApi(client);});
client.on(Events.InteractionCreate,async interaction=>{if(!interaction.isChatInputCommand())return;const command=commandMap.get(interaction.commandName);if(!command)return;try{await command.execute(interaction);}catch(e){console.error(`Command /${interaction.commandName} failed:`,e);const r={content:"❌ Something went wrong while running that command.",ephemeral:true};if(interaction.replied||interaction.deferred)await interaction.followUp(r);else await interaction.reply(r);}});
process.on("unhandledRejection",e=>console.error("Unhandled promise rejection:",e));
process.on("uncaughtException",e=>{console.error("Uncaught exception:",e);process.exit(1);});
client.login(process.env.DISCORD_TOKEN).catch(e=>{console.error("❌ Discord login failed:",e);process.exit(1);});
