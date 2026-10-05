import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const file = path.resolve("data/verifications.json");

function load() {
    try {
        if (!fs.existsSync(file)) {
            return {};
        }

        return JSON.parse(
            fs.readFileSync(file, "utf8")
        );
    } catch {
        return {};
    }
}

function save(data) {
    fs.mkdirSync(
        path.dirname(file),
        { recursive: true }
    );

    const temp = `${file}.tmp`;

    fs.writeFileSync(
        temp,
        JSON.stringify(data, null, 2)
    );

    fs.renameSync(temp, file);
}

export function createVerification(discordId) {
    const data = load();

    const code =
        "SB-" +
        crypto
            .randomBytes(5)
            .toString("hex")
            .toUpperCase();

    data[code] = {
        discordId,
        createdAt: Date.now()
    };

    save(data);

    return code;
}

export function consumeVerification(code) {
    const data = load();

    const cleanCode =
        String(code)
            .trim()
            .toUpperCase();

    const verification =
        data[cleanCode];

    if (!verification) {
        return null;
    }

    if (
        Date.now() -
            verification.createdAt >
        10 * 60 * 1000
    ) {
        delete data[cleanCode];
        save(data);

        return null;
    }

    return {
        code: cleanCode,
        discordId: verification.discordId
    };
}

export function setVerified(
    discordId,
    username
) {
    const data = load();

    data[`verified:${discordId}`] = {
        discordId,
        username,
        verifiedAt: Date.now()
    };

    save(data);
}

export function getVerified(discordId) {
    const data = load();

    return (
        data[`verified:${discordId}`] ||
        null
    );
}

export function removeVerified(discordId) {
    const data = load();

    delete data[`verified:${discordId}`];

    save(data);
}