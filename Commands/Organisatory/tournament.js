import pkg from 'discord.js';
const { SlashCommandBuilder, EmbedBuilder, Client, Interaction } = pkg;
import config from '../../config.json' with {type: 'json'};

const tournamentCommand = {
    data: new SlashCommandBuilder()
        .setName("tournament")
        .setDescription("Adds a new tournament to #lfg-tournament")
        .addStringOption(option =>
            option
                .setName("name")
                .setDescription("The name of the tournament")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("date")
                .setDescription("The date of the tournament (dd/mm/yy)")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("description")
                .setDescription("The description of the tournament")
        )
        .addStringOption(option =>
            option
                .setName("link")
                .setDescription("The link for more information on the tournament")
        ),
    
    /**
     * Executes the tournament command.
     * @param {Client} client The Discord client. 
     * @param {Interaction} interaction The interaction object.
     * @returns 
     */
    async execute(client, interaction) {
        // Check if user has member role
        if (!interaction.member.roles.cache.find(role => role.id === config.roles.team.id)) return interaction.reply(`You are not a member of ${config.teamName}, so you may not use this command!`);

        try {
            // Get parameter data
            let name = interaction.options.getString("name");
            let description = interaction.options.getString("description");
            let date = interaction.options.getString("date");
            let link = interaction.options.getString("link");

            if (link && !link.startsWith("https:") && !link.startsWith("http:")) return interaction.reply("Link must start with \"http:\" or \"https:\"");

            interaction.deferReply();

            let channelId = config.channels.teamCalendar.id;
            let channel = await interaction.guild.channels.fetch(channelId);

            const response = new EmbedBuilder()
                .setColor('Random')
                .setAuthor({ name: name, url: link })
                .setDescription(description)
                .setFooter({ text: `${date} - Added by ${interaction.user.tag}` });

            let message = await channel.send({ content: `<@&${config.roles.team.id}>`, embeds: [response] });
            await message.react('✅');
            await message.react('❔');
            await message.react('❕');
            await message.react('❌');

            interaction.editReply("Successfully added tournament!");
            console.info(`Tournament ${name} on ${date} added by ${interaction.user.tag} (${interaction.user.id})`);
        } catch (error) {
            interaction.reply(error.message ? `Command tournament ran into an error:\n${error.message}` : "An unknown error has occurred.")
            throw error; // Rethrow the error to be caught by the interactionCreate handler
        }
    }
}

export default tournamentCommand;