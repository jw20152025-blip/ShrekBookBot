# ShrekBook Discord Bot

Official ShrekBook Discord bot with slash commands, verification codes, and automatic `ShrekBook User` role assignment.

## Requirements
- Node.js 24.17.0+
- Discord bot/application
- ShrekBook Discord server
- Manually-created `ShrekBook User` role
- Bot's managed role above `ShrekBook User`

## Setup
1. Copy `.env.example` to `.env`.
2. Fill in the values.
3. Run `npm install`.
4. Run `npm run deploy`.
5. Run `npm start`.

## Bot permissions
- View Channels
- Send Messages
- Embed Links
- Manage Roles

Do not give the bot Administrator.

## Slash commands
- `/verify`
- `/profile`
- `/unlink`
- `/status`
- `/help`

## ShrekBook verification API
Your ShrekBook backend must POST to `/api/verification/complete` with:

Header: `x-shrekbook-secret: YOUR_SECRET`

JSON:
```json
{"code":"SB-XXXXXXXXXX","shrekbookUsername":"username"}
```

The bot consumes the one-time code, stores the Discord/ShrekBook link, and assigns `ShrekBook User`.

## Security
Never commit `.env` or your Discord bot token. The API listens on localhost by default; expose it through your secure HTTPS reverse proxy/host when connecting ShrekBook remotely.
