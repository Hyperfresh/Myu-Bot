import { Client, Message } from 'discord.js'
import { Db } from 'mongodb'

module.exports.run = async (bot:Client, msg:Message, args:string[], db:Db) => {
    if(args.length == 1) {
        var content = args[0]
        if(content.length != 14 || content.search(/\d\d\d\d-\d\d\d\d-\d\d\d\d/gi) == -1) {
            return msg.channel.send({"embed": { "title": ":x: > **Switch Friend Code format invalid! Please enter your FC without the 'SW-' at the beginning**", "color": 13632027 }});
        }

        var userDB = await db.collection('user').findOne({ '_id': { $eq: msg.author.id } });
        if(userDB.fc != null) {
            return msg.channel.send({"embed": { "title": ":x: > **Sorry, you can't change your FC!**", "description": "**Please contact <@125325519054045184> to change.**", "color": 13632027 }});
        }

        await db.collection('user').updateOne({ _id: msg.author.id }, { $set: { fc: content }});
        const embed = new Discord.MessageEmbed();
        embed.setAuthor("Your Switch FC is now set to : ", msg.author.avatarURL);
        embed.setTitle(`**${content}**`)
        embed.setColor('AQUA')
        try {
            console.log(`info: switch fc of ${msg.author.tag} set`)
            return await msg.channel.send(embed).then(() => { msg.delete() })
        } catch(err) {
            console.error(err);
        }
    }
};

module.exports.help = {
    name: 'setfc',
    usage: "?setfc (your Switch FC)",
    desc: "Register your Switch Friend Code to Q-Bot.\nPlease enter your FC without 'SW-' at the beginning"
};