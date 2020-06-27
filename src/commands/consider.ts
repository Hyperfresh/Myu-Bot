import { Client, Message, TextChannel } from 'discord.js';
import utilities from '../utils/utilities';

module.exports.run = async (bot: Client, msg: Message, args: string[]) => {
    if (!utilities.isMod(msg)) return;

    let channel = await bot.channels.fetch(process.env.SUGGESTIONTC);
    let suggestion = await (channel as TextChannel).messages.fetch(args[0])

    let embed = suggestion.embeds[0];

    embed.setTitle("Suggestion: Considered")
    embed.setColor(14598460)

    if(args.length >= 2) {
        args.shift()
        let req = args.join(' ');
        embed.addField('Reason', req)
    }

    await suggestion.edit(embed);
    return msg.react('✅');
};

module.exports.help = {
    name: 'consider',
    usage: "?consider (uid) [reason]",
};