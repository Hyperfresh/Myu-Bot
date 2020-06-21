import { Client, Message, MessageEmbed, TextChannel } from 'discord.js'

module.exports.run = async (bot: Client, msg: Message, args: string[]) => {
    if (args.length < 1) return;
    let req = args.join(' ');
    let channel = await bot.channels.fetch(process.env.SUGGESTIONTC);

    let embed = new MessageEmbed();
    embed.setTitle("Suggestion: Waiting...")
    embed.setDescription(req);
    if(msg.attachments.first()) {
        embed.setImage(msg.attachments.first().proxyURL);
        embed.addField('attachment', `[link](${msg.attachments.first().proxyURL})`);
    }
    embed.setTimestamp(msg.createdTimestamp);
    embed.setAuthor(msg.author.username, msg.author.avatarURL({ format: 'png', dynamic: false, size: 128 }))

    await msg.delete();
    let sent = await (channel as TextChannel).send(embed);

    await sent.react('✅');
    return sent.react('❌');
};

module.exports.help = {
    name: 'suggest',
    usage: "?suggest (suggestion)",
    desc: "Push a suggestion into the #suggestion-box"
};