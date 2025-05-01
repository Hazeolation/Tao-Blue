import pkg from 'discord.js';
const { SlashCommandBuilder, Channel, Client, Interaction } = pkg;
import config from '../../config.json' with { type: 'json' };
import moment from 'moment';

const cleanupCommand = {
    data: new SlashCommandBuilder()
        .setName("cleanup")
        .setDescription("Cleans up #oo-calendar and posts new time messages."),

    /**
     * Executes the cleanup command.
     * @param {Client} client The instance of the Discord Bot
     * @param {Interaction} interaction The command interaction
     * @returns 
     */
    async execute(client, interaction) {
        // Check if user has member role
        if (!interaction.member.roles.cache.find(role => role.id === config.roles.team.id)) return interaction.reply(`You are not a member of ${config.teamName}, so you may not use this command!`);

        await interaction.deferReply();

        let channelId = config.channels.teamCalendar.id;
        let channel = await interaction.guild.channels.fetch(channelId);

        await prepareChannel(channel);
        
        interaction.editReply(`Cleaned up #${config.channels.teamCalendar.name}!`);
    }
}

/**
 * Cleans up the specified channel and posts new time messages with pre-appended reactions for easy availability checking.
 * @param {Channel} channel The channel to prepare
 */
const prepareChannel = async (channel) => {
    console.info(`Cleaning up channel #${channel.name}...`);
    await channel.bulkDelete(50, false);

    // Get the following Monday's date in UTC and set the time to 00:00:00, then convert to Unix timestamp
    let unix = moment().utc().isoWeekday(8).startOf('day').unix()
    let message = await channel.send(`Monday, <t:${unix}:D>`);
    await message.react('✅');
    await message.react('❔');
    await message.react('❕');
    await message.react('❌');

    unix += 86400;
    let message2 = await channel.send(`Tuesday, <t:${unix}:D>`);
    await message2.react('✅');
    await message2.react('❔');
    await message2.react('❕');
    await message2.react('❌');

    unix += 86400;
    let message3 = await channel.send(`Wednesday, <t:${unix}:D>`);
    await message3.react('✅');
    await message3.react('❔');
    await message3.react('❕');
    await message3.react('❌');
    
    unix += 86400;
    let message4 = await channel.send(`Thursday, <t:${unix}:D>`);
    await message4.react('✅');
    await message4.react('❔');
    await message4.react('❕');
    await message4.react('❌');
    
    unix += 86400;
    let message5 = await channel.send(`Friday, <t:${unix}:D>`);
    await message5.react('✅');
    await message5.react('❔');
    await message5.react('❕');
    await message5.react('❌');

    unix += 86400;
    let message6 = await channel.send(`Saturday, <t:${unix}:D>`);
    await message6.react('✅');
    await message6.react('❔');
    await message6.react('❕');
    await message6.react('❌');
    
    unix += 86400;
    let message7 = await channel.send(`Sunday, <t:${unix}:D>`);
    await message7.react('✅');
    await message7.react('❔');
    await message7.react('❕');
    await message7.react('❌');

    await channel.send(`<@&${config.roles.team.id}> Please check your availability for the next week!\n**__Legend__**:\n✅ Available\n❔ Maybe\n❕ Can play as a substitution\n❌ Not available`);
    console.info(`Finished cleaning up channel #${channel.name}!`);
}

export default cleanupCommand;

export { prepareChannel };