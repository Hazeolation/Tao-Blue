import pkg from 'discord.js';
const { SlashCommandBuilder, EmbedBuilder, Client, Interaction } = pkg;

const convertTimeCommand = {
    data: new SlashCommandBuilder()
        .setName("convert")
        .setDescription("Converts a given time to a Unix timestamp.")
        .addIntegerOption(option =>
            option.setName('year')
                .setDescription('The year of the date to convert (e.g., 2023). Leave blank for current year.')
                .setMinValue(1970)) // Unix epoch starts from 1970
        .addIntegerOption(option => 
            option.setName('month')
                .setDescription('The month of the date to convert (1-12). Leave blank for current month.'))
                .setMinValue(1)
                .setMaxValue(12)
        .addIntegerOption(option => 
            option.setName('day')
                .setDescription('The day of the date to convert (1-31). Leave blank for current day.')
                .setMinValue(1)
                .setMaxValue(31))
        .addIntegerOption(option => 
            option.setName('hour')
                .setDescription('The hour of the time to convert (0-23). Leave blank for current hour.')
                .setMinValue(0)
                .setMaxValue(23))
        .addIntegerOption(option => 
            option.setName('minute')
                .setDescription('The minute of the time to convert (0-59). Leave blank for current minute.')
                .setMinValue(0)
                .setMaxValue(59))
        .addIntegerOption(option => 
            option.setName('second')
                .setDescription('The second of the time to convert (0-59). Leave blank for current second.')
                .setMinValue(0)
                .setMaxValue(59)),
    /**
     * Executes the convert command.
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction) {
        // Date to adjust as needed
        let date = new Date();

        // Fetech possible user inputs
        const year = interaction.options.getNumber('year');
        const month = interaction.options.getNumber('month');
        const day = interaction.options.getNumber('day');
        const hour = interaction.options.getNumber('hour');
        const minute = interaction.options.getNumber('minute');
        const second = interaction.options.getNumber('second');

        // Adjust date with given values
        if (year) date.setFullYear(year);
        if (month || month === 0) date.setMonth(month - 1);
        if (day) date.setDate(day);
        if (hour || hour === 0) date.setHours(hour);
        if (minute || minute === 0) date.setMinutes(minute);
        if (second || second === 0) date.setSeconds(second);

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