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
                .setDescription('The timezone to use for the conversion. Defaults to server timezone (Europe/Berlin) if not specified.')
                .addChoices(
                    { name: 'Coordinated Universal Time (UTC)', value: '0' },
                    { name: 'Greenwich Mean Time (GMT)', value: '0' },
                    { name: 'British Summer Time (BST)', value: '3600000' },
                    { name: 'Western European Time (WET)', value: '0' },
                    { name: 'Western European Summer Time (WEST)', value: '3600000' },
                    { name: 'Central European Time (CET)', value: '3600000' },
                    { name: 'Central European Summer Time (CEST)', value: '7200000' },
                    { name: 'Eastern European Time (EET)', value: '7200000' },
                    { name: 'Eastern European Summer Time (EEST)', value: '10800000' },
                    { name: 'Moscow Standard Time (MSK)', value: '10800000' },
                    { name: 'India Standard Time (IST)', value: '19800000' },
                    { name: 'Iran Standard Time (IRST)', value: '12600000' },
                    { name: 'Pakistan Standard Time (PKT)', value: '18000000' },
                    { name: 'Indochina Standard Time (ICT)', value: '25200000' },
                    { name: 'China Standard Time (CST)', value: '28800000' },
                    { name: 'Japan Standard Time (JST)', value: '32400000' },
                    { name: 'Korea Standard Time (KST)', value: '32400000' },
                    { name: 'Australian Western Standard Time (AWST)', value: '28800000' },
                    { name: 'Australian Central Standard Time (ACST)', value: '34200000' },
                    { name: 'Australian Central Daylight Time (ACDT)', value: '37800000' },
                    { name: 'Australian Eastern Standard Time (AEST)', value: '36000000' },
                    { name: 'Australian Eastern Daylight Time (AEDT)', value: '39600000' },
                    { name: 'New Zealand Standard Time (NZST)', value: '43200000' },
                    { name: 'New Zealand Daylight Time (NZDT)', value: '46800000' },
                    { name: 'Atlantic Standard Time (AST)', value: '-14400000' },
                    { name: 'Atlantic Daylight Time (ADT)', value: '-10800000' },
                    { name: 'Eastern Standard Time (EST)', value: '-18000000' },
                    { name: 'Eastern Daylight Time (EDT)', value: '-14400000' },
                    { name: 'Central Standard Time (CST)', value: '-21600000' },
                    { name: 'Central Daylight Time (CDT)', value: '-18000000' },
                    { name: 'Mountain Standard Time (MST)', value: '-25200000' },
                    { name: 'Mountain Daylight Time (MDT)', value: '-21600000' },
                    { name: 'Pacific Standard Time (PST)', value: '-28800000' },
                    { name: 'Pacific Daylight Time (PDT)', value: '-25200000' },
                    { name: 'Brasilia Time (BRT)', value: '-10800000' },
                    { name: 'Newfoundland Standard Time (NST)', value: '-12600000' },
                    { name: 'Newfoundland Daylight Time (NDT)', value: '-9000000' },
                    { name: 'Argentina Time (ART)', value: '-10800000' },
                    { name: 'Hawaii-Aleutian Standard Time (HAST)', value: '-36000000' }
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