import pkg from 'discord.js';
const { SlashCommandBuilder, EmbedBuilder, Client, Interaction } = pkg;

const pingCommand = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Displays the latency of the bot."),

    /**
     * Executes the ping command.
     * @param {Client} client The instance of the Discord bot
     * @param {Interaction} interaction The command interaction
     */
    async execute(client, interaction) {
        const sent = await interaction.reply({ content: "Pinging...", fetchResponse: true });
        const roundtripLatency = sent.createdTimestamp - interaction.createdTimestamp;
        const responseEmbed = new EmbedBuilder()
            .setColor('Green')
            .setDescription(`API latency: ${client.ws.ping}ms\nRoundtrip latency: ${roundtripLatency}ms`);

        interaction.editReply({ content: "Ping done!", embeds: [responseEmbed] });
    }
}

export default pingCommand;