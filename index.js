import pkg from 'discord.js';
const { Client, GatewayIntentBits, Collection } = pkg;
import fs from 'node:fs';
import path from 'node:path';
import config from './config.json' with { type: 'json' };

// Client initialization
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions] });
const __dirname = import.meta.dirname;

// Load event files
const eventsPath = path.join(__dirname, 'Events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

// Run called commands
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const { default: event } = await import(`file:\\\\${filePath}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(client, ...args));
    }
}

client.commands = new Collection();

// Load commands from Command folder
const commandsPath = path.join(__dirname, 'Commands');
const commandFiles = fs.readdirSync(commandsPath, { recursive: true }).filter(file => file.endsWith('.js'));

// Add commands to command Collection
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const { default: command } = await import(`file:\\\\${filePath}`);

    // Set new item in command collection
    // key: name, value: exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Log in to Discord using the token
client.login(config.token);