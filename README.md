# A4 Authenticator Bot

An Authenticator Discord bot made with **Typescript** and **Discord.js**

## Features

- Allow users to verify themselves with their email
  - Emails should be of a certain domain (if set by the moderators)
    - Assign roles after being verified
- Allow moderators to view veirifed users, and their emails
- Allow mods to upload a list of confirmed emails and names \*details (csv)
  - View the verified user's details directly from discord

### Commands

| Command Name   | Command Params                 | Authorization Level | Command Description                                                                            |
| -------------- | ------------------------------ | ------------------- | ---------------------------------------------------------------------------------------------- |
| /viewverified  | `member`                       | Mod                 | View the Emails verified by the member                                                         |
| /verifyrequest | None                           | Any                 | Issue a verification request                                                                   |
| /uploadvalid   | `csv_file`                     | Mod                 | Upload confirmed info assigned to emails `name` and `email` are must and must be in that order |
| /setguildvalue | `key:enum(domain,mod)` `value` | Mod                 | Set settings for this bot                                                                      |
| /whois         | `email`                        | Mod                 | Confirmed info from verified info for that email                                               |

### Configuration

For database, firebase firestore is being used
Edit your `.env` file for configure bot token & Database url

```env

# Firebase Config
API_KEY=
AUTH_DOMAIN=
PROJECT_ID=
STORAGE_BUCKET=
MESSAGING_SENDER_ID=
APP_ID=

# Email sender config
SENDER_EMAIL=
SENDER_PASSWORD=
SENDER_USERNAME=
SMTP_HOST=
SMTP_PORT=
IS_GOOGLE=
IS_SECURE=
```

### File structure

| Path       | Description                    |
| ---------- | ------------------------------ |
| index.ts   | Where to start the application |
| ./commands | All application commands       |
| .env       | Environment Variables          |

### Base repository

This base starter project was used for this bot

`git clone https://github.com/SonMooSans/discord-bot-starter.git`

## Run the Project

### Watch Mode

`npm run dev`

### Run without watch

`npm run start`
