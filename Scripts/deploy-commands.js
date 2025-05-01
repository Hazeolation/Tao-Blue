// This script deploys all application (/) commands to the bot using the Discord API.
// It reads command files from the Commands folder, prepares the commands in JSON format, and sends them to the Discord API.
import { REST, Routes } from 'discord.js';
import config from '../config.json' with { type: 'json' };
import fs from 'node:fs';

const __dirname = import.meta.dirname;
const commands = [];

// Fetch all command files located in the Commands folder
const commandFiles = fs.readdirSync(`${__dirname}/../Commands`, { recursive: true }).filter(file => file.endsWith('.js'));

// Fetch Slash commands in JSON format for each file
for (const file of commandFiles) {
    const { default: command } = await import(`file://${__dirname}/../Commands/${file}`);
    commands.push(command.data.toJSON());
    console.info(`Found command: ${command.data.name}`);
}

// Create and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(config.token);

// Deploy commands
(async () => {
    try {
        console.info(`Started refreshing ${commands.length} application (/) commands.`);

        // Use PUT method to fully refresh all commands
        const data = await rest.put(
            Routes.applicationGuildCommands(config.clientId, config.guildId),
            { body: commands },
        );

        console.info(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error('Error deploying application (/) commands:', error);
    }
})();