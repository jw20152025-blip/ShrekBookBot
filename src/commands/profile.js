import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { getVerified } from "../services/verificationStore.js";
export const data=new SlashCommandBuilder().setName("profile").setDescription("Show your linked ShrekBook account.");
export async function execute(interaction){const v=getVerified(interaction.user.id);if(!v)return interaction.reply({content:"❌ You are not linked yet. Use `/verify` first.",ephemeral:true});const embed=new EmbedBuilder().setTitle("🟢 ShrekBook Profile").addFields({name:"Username",value:v.username,inline:true},{name:"Discord",value:`<@${interaction.user.id}>`,inline:true},{name:"Verified",value:new Date(v.verifiedAt).toLocaleString()});await interaction.reply({embeds:[embed],ephemeral:true});}
