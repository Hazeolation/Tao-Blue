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
                .setDescription('The month of the date to convert (1-12). Leave blank for current month.')
                .setMinValue(1)

                .setMaxValue(12))
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
                .setMaxValue(59))
        .addStringOption(option => 
            option.setName('timezone')
                .setDescription('The timezone to use for the conversion. Defaults to Europe/Berlin if not specified.')
                .addChoices(
                    { name: 'UTC / GMT / WET', value: '0' },
                    { name: 'BST / WEST / CET', value: '3600000' },
                    { name: 'CEST / EET', value: '7200000' },
                    { name: 'EEST / MSK', value: '10800000' },
                    { name: 'IST', value: '19800000' },
                    { name: 'IRST', value: '12600000' },
                    { name: 'PKT', value: '18000000' },
                    { name: 'ICT', value: '25200000' },
                    { name: 'China Standard Time (CST) / AWST', value: '28800000' },
                    { name: 'JST / KST', value: '32400000' },
                    { name: 'ACST', value: '34200000' },
                    { name: 'ACDT', value: '37800000' },
                    { name: 'AEST', value: '36000000' },
                    { name: 'AEDT', value: '39600000' },
                    { name: 'NZST', value: '43200000' },
                    { name: 'NZDT', value: '46800000' },
                    { name: 'AST / EDT', value: '-14400000' },
                    { name: 'ADT / BRT / ART', value: '-10800000' },
                    { name: 'EST / CDT', value: '-18000000' },
                    { name: 'Central Standard Time (CST) / MDT', value: '-21600000' },
                    { name: 'MST / PDT', value: '-25200000' },
                    { name: 'PST', value: '-28800000' },
                    { name: 'NST', value: '-12600000' },
                    { name: 'NDT', value: '-9000000' },
                    { name: 'HST', value: '-36000000' }
                )),
    /**
     * Executes the convert command.
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction) {
        // Date to adjust as needed
        let date = new Date(Date.now());

        // Fetech possible user inputs
        const year = interaction.options.getInteger('year');
        const month = interaction.options.getInteger('month');
        const day = interaction.options.getInteger('day');
        const hour = interaction.options.getInteger('hour');
        const minute = interaction.options.getInteger('minute');
        const second = interaction.options.getInteger('second');
        const timezoneOffset = parseInt(interaction.options.getString('timezone'));

        // Adjust date with given values
        if (year) date.setFullYear(year);
        if (month || month === 0) date.setMonth(month - 1);
        if (day) date.setDate(day);
        if (hour || hour === 0) date.setHours(hour);
        if (minute || minute === 0) date.setMinutes(minute);
        if (second || second === 0) date.setSeconds(second);

        // Adjust date for timezone offset if provided
        if (timezoneOffset) date.setTime(date.getTime() + timezoneOffset);

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