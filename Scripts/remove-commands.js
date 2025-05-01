// This script removes all application commands from the bot. It is useful for cleaning up commands that are no longer needed or for resetting the command list.
// It uses the Discord API to delete all commands associated with the bot's client ID.
import { REST, Routes } from 'discord.js';
import config from '../config.json' with { type: 'json' };

const commands = [];

// Create and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
    try {
        // Remove global commands
        console.info(`Started removing global application (/) commands.`);
        await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: commands },
        );
        console.info(`Successfully removed global application (/) commands.`);

        // Remove guild commands
        console.info(`Started removing guild application (/) commands.`);
        await rest.put(
            Routes.applicationGuildCommands(config.clientId, config.guildId),
            { body: commands },
        );
        console.info(`Successfully removed guild application (/) commands.`);
        
    } catch (error) {
        console.error('Error removing application (/) commands:', error);
    }
})();