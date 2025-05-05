import pkg from 'discord.js';
const { Events, Client } = pkg;
import { CronJob } from 'cron';
import { prepareChannel } from '../Commands/Organisatory/cleanup.js';
import config from '../config.json' with { type: 'json' };

const clientReady = {
    name: Events.ClientReady,
    once: true,
    /**
     * Runs required tasks upon startup of the bot.
     * @param {Client} client The instance of the Discord bot
     */
    async execute(client) {
        // CronJob argument info: Seconds - Minutes - Hours - Day - Month - Weekday
        // Runs daily at 2pm UTC to remind users to schedule their training time
        let scheduledMessage = new CronJob('00 00 15 * * *', async () => {
            console.info("Running Cron job 'scheduledMessage'...");
            const guild = client.guilds.cache.get(config.guildId);
            const teamCalendar = guild.channels.cache.get(config.channels.teamCalendar.id);
            const teamChat = guild.channels.cache.get(config.channels.teamChat.id);

            let today = new Date();
            let dayOfWeek = today.getDay() - 1;

            let messages = Array.from((await teamCalendar.messages.fetch({ limit: 50 })).values()).reverse();
            let index = dayOfWeek;

            if (index < 0) index = 6;

            let lfgMessage = messages[index];
            let pingArray = [];

            // Get all users who reacted with ❔ or ✅
            for (let reaction of lfgMessage.reactions.cache.values()) {
                const emojiName = reaction._emoji.name;
                if (emojiName != '❔' && emojiName != '✅') continue;

                const reactionUsers = await reaction.users.fetch();

                for (let user of reactionUsers.values()) {
                    if (user.bot === true) continue;
                    pingArray.push(user);
                }
            }

            if (pingArray.length === 0) return;

            let reminderMessage = "";
            for (let member of pingArray.values()) {
                reminderMessage += `<@!${member.id}>\n`;
            }

            reminderMessage += "Reminder to schedule for today's training time!";
            teamChat.send(reminderMessage);
            console.info("Cron job 'scheduledMessage' finished!");
        });

        // Runs an automated cleanup of the team calendar channel every Sunday at 10pm UTC
        let scheduledCleanup = new CronJob('00 00 23 * * 7', async () => {
            console.info("Running Cron job 'scheduledCleanup'...");
            const guild = client.guilds.cache.get(config.guildId);
            const lfgChannel = guild.channels.cache.get(config.channels.teamCalendar.id);
            await prepareChannel(lfgChannel);
            console.info("Cron job 'scheduledCleanup' finished!");
        });

        scheduledMessage.start();
        scheduledCleanup.start();
        console.info("Cron jobs started!");

        client.user.setPresence({
            status: 'online'
        });

        console.log("Client is ready and running!");
    }
}

export default clientReady;