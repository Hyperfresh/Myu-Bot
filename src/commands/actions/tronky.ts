import { Client, Message, MessageEmbed } from 'discord.js'

module.exports.run = async (bot:Client, msg:Message, args:string[]) => {
    if(args.length <= 2) {
        if(msg.mentions.everyone)return;
        let mentionFirst = msg.mentions.users.first()
        let mentionSecond = msg.mentions.users.last()

        if(!mentionFirst || !mentionSecond)return;
        if(mentionFirst.id == msg.author.id || mentionSecond.id == msg.author.id)
            return msg.channel.send({"embed": { "title": `:x: > **You can't give yourself a tronky!**`, "color": 13632027 }});

        if((mentionFirst.id == bot.user.id || mentionSecond.id == bot.user.id))
            setTimeout(() => {
                msg.reply('<:tronkyForYou:712980723258097664>');
            }, 2000)

        const embed = new MessageEmbed();
        embed.setColor('#F2DEB0')
        if(msg.mentions.members.size == 2)
            embed.setTitle(`**${msg.author.username}** gave tronkys to **${mentionFirst.username}** & **${mentionSecond.username}** !`)
	    else
            embed.setTitle(`**${msg.author.username}** gave a tronky to **${mentionFirst.username}** !`)

        return msg.channel.send(embed)
        .then(() => {
            console.log(`info: tronky sent by ${msg.author.tag}`);
        })
        .catch(console.error);
    } else if(args.length > 2)
        msg.reply("Only two tronkys at a time! :(")
};

module.exports.help = {
    name: 'tronky',
    usage: "?tronky (mention someone) [someone else]",
    desc: "Give people tronkys"
};