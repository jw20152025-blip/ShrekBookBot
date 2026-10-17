import {
    consumeVerification,
    setVerified
} from "./services/verificationStore.js";

const SHREKBOOK_URL =
    process.env.SHREKBOOK_URL ||
    "https://shrekbook.bbroot.com";

const SECRET =
    process.env.SHREKBOOK_API_SECRET;

const ROLE_ID =
    process.env.SHREKBOOK_ROLE_ID;

const POLL_INTERVAL = 5000;

let polling = false;


export function startVerificationPolling(client) {

    console.log(
        "🔄 ShrekBook verification polling started."
    );

    poll(client);

    setInterval(() => {
        poll(client);
    }, POLL_INTERVAL);
}


async function poll(client) {

    if (polling) {
        return;
    }

    polling = true;

    try {

        console.log(
            `🔎 Polling ${SHREKBOOK_URL}/api/discord/verification-pending`
        );

        const response =
            await fetch(
                `${SHREKBOOK_URL}/api/discord/verification-pending`,
                {
                    headers: {
                        "x-shrekbook-secret":
                            SECRET
                    }
                }
            );

        console.log(
            `📡 ShrekBook polling response: HTTP ${response.status}`
        );

        if (!response.ok) {

            console.error(
                `❌ ShrekBook poll failed: HTTP ${response.status}`
            );

            return;
        }

        const data =
            await response.json();

        if (
            !data.requests ||
            data.requests.length === 0
        ) {

            console.log(
                "📭 No pending verification requests."
            );

            return;
        }

        console.log(
            `📨 Found ${data.requests.length} verification request(s).`
        );

        for (
            const request
            of data.requests
        ) {

            await processVerification(
                client,
                request
            );
        }

    } catch (error) {

        console.error(
            "❌ Verification polling error:",
            error.message
        );

    } finally {

        polling = false;
    }
}


async function processVerification(
    client,
    request
) {

    try {

        console.log(
            `🔍 Processing ${request.username}...`
        );

        const verification =
            consumeVerification(
                request.code
            );

        if (!verification) {

            console.log(
                `⚠️ Code ${request.code} is invalid or expired.`
            );

            return;
        }

        const guild =
            client.guilds.cache.first();

        if (!guild) {

            console.error(
                "❌ Bot is not in a Discord server."
            );

            return;
        }

        const member =
            await guild.members.fetch(
                verification.discordId
            );

        const role =
            guild.roles.cache.get(
                ROLE_ID
            );

        if (!role) {

            console.error(
                `❌ ShrekBook User role not found: ${ROLE_ID}`
            );

            return;
        }

        const botMember =
            guild.members.me;

        if (!botMember) {

            console.error(
                "❌ Could not find the bot's guild member."
            );

            return;
        }

        if (
            role.position >=
            botMember.roles.highest.position
        ) {

            console.error(
                "❌ ShrekBook User role is above the bot's role."
            );

            return;
        }

        await member.roles.add(role);

        setVerified(
            verification.discordId,
            request.username
        );

        const completeResponse =
            await fetch(
                `${SHREKBOOK_URL}/api/discord/verification-complete`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "x-shrekbook-secret":
                            SECRET
                    },

                    body: JSON.stringify({
                        code:
                            request.code
                    })
                }
            );

        if (!completeResponse.ok) {

            console.error(
                `⚠️ Role added, but ShrekBook completion returned HTTP ${completeResponse.status}`
            );

            return;
        }

        console.log(
            `✅ Added ShrekBook User to ${member.user.tag}`
        );

        console.log(
            `✅ Verification complete: ${request.username}`
        );

    } catch (error) {

        console.error(
            "❌ Verification failed:",
            error.message
        );
    }
}