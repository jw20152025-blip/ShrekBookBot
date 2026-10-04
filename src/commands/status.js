import { SlashCommandBuilder } from "discord.js";
export const data=new SlashCommandBuilder().setName("status").setDescription("Check ShrekBook bot status.");
export async function execute(interaction){const latency=Math.max(0,Date.now()-interaction.createdTimestamp);await interaction.reply(`🟢 ShrekBook Bot is online.\n🏓 Response: ${latency}ms\n💓 Discord ping: ${interaction.client.ws.ping}ms`);}
