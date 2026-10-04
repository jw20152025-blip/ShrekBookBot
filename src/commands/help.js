import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
export const data=new SlashCommandBuilder().setName("help").setDescription("Show ShrekBook bot commands.");
export async function execute(interaction){const e=new EmbedBuilder().setTitle("🟢 ShrekBook Bot").setDescription("Official ShrekBook Discord bot.").addFields({name:"/verify",value:"Start linking your ShrekBook account."},{name:"/profile",value:"View your linked account."},{name:"/unlink",value:"Unlink your ShrekBook account."},{name:"/status",value:"Check bot health."});await interaction.reply({embeds:[e]});}
