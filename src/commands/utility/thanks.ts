import { Client, Message } from 'discord.js'
import { Db } from 'mongodb'

module.exports.run = async (bot: Client, msg: Message, args: string[], db: Db) => {
    msg.reply({
        "embed": {
          "title": "iwa taught me to reply: you're welcome cutie c;",
          "description": "__List of contributors:__\n<@352668050111201291>",
          "footer": {
            "text": "thanks a lot for your help!💜"
          }
        }
      })
    await db.collection('user').updateOne({ '_id': { $eq: bot.user.id } }, { $inc: { thanksiwa: 1 } });
    await msg.member.roles.add(process.env.IWAFANROLE)
};

module.exports.help = {
    name: 'thanks',
    usage: "?thanks",
    desc: "Thank iwa & contributors for their work"
};