import { Client, Message, TextChannel } from 'discord.js';

module.exports.run = async (bot: Client, msg: Message, args: string[]) => {
    if (msg.author.id != process.env.IWA) return;

    let channel = await bot.channels.fetch(process.env.SUGGESTIONTC);
    let suggestion = await (channel as TextChannel).messages.fetch(args[0])

    let embed = suggestion.embeds[0];

    embed.setTitle("Suggestion: Work in progress...")
    embed.setColor(13105811)

    await suggestion.edit(embed);
    return msg.react('✅');
};

module.exports.help = {
    name: 'wip',
    usage: "?wip",
};