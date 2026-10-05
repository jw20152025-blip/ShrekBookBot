import {
    SlashCommandBuilder,
    EmbedBuilder
} from "discord.js";

import {
    createVerification
} from "../services/verificationStore.js";

export const data =
    new SlashCommandBuilder()
        .setName("verify")
        .setDescription(
            "Start linking your ShrekBook account."
        );

export async function execute(interaction) {
    const code =
        createVerification(
            interaction.user.id
        );

    const url =
        process.env.SHREKBOOK_URL ||
        "https://shrekbook.bbroot.com";

    const embed =
        new EmbedBuilder()
            .setTitle(
                "🟢 ShrekBook Verification"
            )
            .setDescription(
                [
                    "Your one-time verification code is:",
                    "",
                    `**${code}**`,
                    "",
                    `Open ${url} while logged into ShrekBook.`,
                    "Enter this code on the Discord verification page.",
                    "",
                    "⏱️ This code expires in 10 minutes."
                ].join("\n")
            );

    await interaction.reply({
        embeds: [embed],
        ephemeral: true
    });
}