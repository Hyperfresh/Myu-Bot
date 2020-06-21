import { Client, Message, TextChannel } from 'discord.js';

module.exports.run = async (bot: Client, msg: Message, args: string[]) => {
    if (msg.author.id != process.env.IWA) return;

    let channel = await bot.channels.fetch(process.env.SUGGESTIONTC);
    let suggestion = await (channel as TextChannel).messages.fetch(args[0])

    let embed = suggestion.embeds[0];

    embed.setTitle("Suggestion: Approved")
    embed.setColor(10019146)

    if(args.length >= 2) {
        args.shift()
        let req = args.join(' ');
        embed.addField('Reason', req)
    }

    await suggestion.edit(embed);
    return msg.react('✅');
};

module.exports.help = {
    name: 'approve',
    usage: "?approve",
};