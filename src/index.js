import "dotenv/config";

import {
    Client,
    Events,
    GatewayIntentBits,
    ActivityType
} from "discord.js";

import {
    commandMap
} from "./commands.js";

import {
    startApi
} from "./api.js";

import {
    startVerificationPolling
} from "./verificationPoller.js";

for (
    const key of [
        "DISCORD_TOKEN",
        "DISCORD_CLIENT_ID",
        "DISCORD_GUILD_ID",
        "SHREKBOOK_ROLE_ID",
        "SHREKBOOK_API_SECRET"
    ]
) {
    if (!process.env[key]) {
        console.error(
            `❌ Missing ${key} in .env`
        );

        process.exit(1);
    }
}

const client =
    new Client({
        intents: [
            GatewayIntentBits.Guilds
        ]
    });

client.once(
    Events.ClientReady,
    ready => {
        console.log(
            `🟢 Logged in as ${ready.user.tag}`
        );

        ready.user.setPresence({
            activities: [
                {
                    name: "ShrekBook",
                    type: ActivityType.Watching
                }
            ],
            status: "online"
        });

        startApi(client);

        startVerificationPolling(
            client
        );
    }
);

client.on(
    Events.InteractionCreate,
    async interaction => {
        if (
            !interaction.isChatInputCommand()
        ) {
            return;
        }

        const command =
            commandMap.get(
                interaction.commandName
            );

        if (!command) {
            return;
        }

        try {
            await command.execute(
                interaction
            );

        } catch (error) {
            console.error(
                `Command /${interaction.commandName} failed:`,
                error
            );

            const response = {
                content:
                    "❌ Something went wrong while running that command.",
                ephemeral: true
            };

            if (
                interaction.replied ||
                interaction.deferred
            ) {
                await interaction.followUp(
                    response
                );
            } else {
                await interaction.reply(
                    response
                );
            }
        }
    }
);

process.on(
    "unhandledRejection",
    error => {
        console.error(
            "Unhandled promise rejection:",
            error
        );
    }
);

process.on(
    "uncaughtException",
    error => {
        console.error(
            "Uncaught exception:",
            error
        );

        process.exit(1);
    }
);

client
    .login(
        process.env.DISCORD_TOKEN
    )
    .catch(error => {
        console.error(
            "❌ Discord login failed:",
            error
        );

        process.exit(1);
    });