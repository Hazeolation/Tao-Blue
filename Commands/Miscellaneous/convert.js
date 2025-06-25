import pkg from 'discord.js';
const { SlashCommandBuilder, EmbedBuilder, Client, Interaction } = pkg;

const convertTimeCommand = {
    data: new SlashCommandBuilder()
        .setName("convert")
        .setDescription("Converts a given time to a Unix timestamp.")
        .addNumberOption(option =>
            option.setName('year')
                .setDescription('The year of the date to convert (e.g., 2023). Leave blank for current year.'))
        .addNumberOption(option => 
            option.setName('month')
            .setDescription('The month of the date to convert (1-12). Leave blank for current month.'))
        .addNumberOption(option => 
            option.setName('day')
                .setDescription('The day of the date to convert (1-31). Leave blank for current day.'))
        .addNumberOption(option => 
            option.setName('hour')
                .setDescription('The hour of the time to convert (0-23). Leave blank for current hour.'))
        .addNumberOption(option => 
            option.setName('minute')
                .setDescription('The minute of the time to convert (0-59). Leave blank for current minute.'))
        .addNumberOption(option => 
            option.setName('second')
                .setDescription('The second of the time to convert (0-59). Leave blank for current second.')),
    /**
     * Executes the convert command.
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction) {
        // Date to adjust as needed
        let date = new Date();

        // Fetech possible user inputs
        const jahr = interaction.options.getNumber('year');
        const monat = interaction.options.getNumber('month');
        const tag = interaction.options.getNumber('day');
        const stunde = interaction.options.getNumber('hour');
        const minute = interaction.options.getNumber('minute');
        const sekunde = interaction.options.getNumber('second');

        // Adjust date with given values
        if (jahr == undefined) date.setFullYear(jahr);
        if (monat == undefined) date.setMonth(monat - 1);
        if (tag == undefined) date.setDate(tag);
        if (stunde == undefined) date.setHours(stunde);
        if (minute == undefined) date.setMinutes(minute);
        if (sekunde == undefined) date.setSeconds(sekunde);

        console.info(date.toString());
        // Get timestamp
        let timestamp = Math.floor(date.getTime() / 1000)

        // Response embed
        let embed = new EmbedBuilder()
            .setTitle("Here's your Unix timestamp!")
            .setDescription(`Converted ${date.toString('yyyy-MM-dd hh:mm:ss')} to ${timestamp}\n` +
                        	`Date  [<t:${timestamp}>]: \\<t:${timestamp}>\n` +
                            `Full date (Modifier F) [<t:${timestamp}:F>]: \\<t:${timestamp}:F>\n` +
                            `Short time format (Modifier t) [<t:${timestamp}:t>]: \\<t:${timestamp}:t>\n` +
                            `Long time format (Modifier T) [<t:${timestamp}:T>]: \\<t:${timestamp}:T>\n` +
                            `Short date (Modifier d) [<t:${timestamp}:d>]: \\<t:${timestamp}:d>\n` +
                            `Long date (Modifier D) [<t:${timestamp}:D>]: \\<t:${timestamp}:D>\n` +
                            `Relative format (Modifier R) [<t:${timestamp}:R>]: \\<t:${timestamp}:R>`)
            .setColor('Blurple');

        // Send response
        interaction.reply({ embeds: [embed] });
    }
};

export default convertTimeCommand;