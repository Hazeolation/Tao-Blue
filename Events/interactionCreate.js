import pkg from 'discord.js';
const { Events, Client, Interaction } = pkg;
import config from '../config.json' with { type: 'json' };

const interactionCreateHandler = {
    name: Events.InteractionCreate,
    /**
     * Executes the desired command upon interaction creation.
     * @param {Client} client The instance of the Discord bot
     * @param {Interaction} interaction The interaction that was created
     */
    async execute(client, interaction) {
        // Ignore if interaction isn't a slash command
        if (!interaction.isChatInputCommand()) return;

        // Find used command in command collection
        const command = interaction.client.commands.get(interaction.commandName);

        // Output an error if no command is found
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        // Attempt to run the used command
        try {
            console.info(`Executing command ${interaction.commandName}...`);
            await command.execute(client, interaction);
        } catch (error) {
            console.error(`Command ${interaction.commandName} ran into an error:\n${error.message}`);
            interaction.reply(error.message ? `Command ${interaction.commandName} ran into an error:\n${error.message}` : "An unknown error has occurred.")
            let user = client.users.cache.get(config.users.haze.id);
            user.send(error.message ? `Command ${interaction.commandName} ran into an error:\n${error.message}` : "An unknown error has occurred.");
        }
    }
};

export default interactionCreateHandler;