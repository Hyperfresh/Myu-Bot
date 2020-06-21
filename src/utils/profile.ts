/**
 * Profile reset function
 * @packageDocumentation
 * @module Profile
 * @category Utils
 */
import { Client, Message, MessageEmbed } from 'discord.js'
import { Db } from 'mongodb'

module.exports = class profile {

    /**
     * @param bot - Discord Client object
     * @param msg - Message object
     * @param args - Arguments in the message
     * @param db - Database connection object
     * @param type - Item to reset in the profile
     */
    static async reset(bot: Client, msg: Message, args: string[], db: Db, type: string) {
        if (msg.author.id != process.env.IWA) return;
        if (args.length == 1) {

            let id = args[0]

            let userDB = await db.collection('user').findOne({ '_id': { $eq: id } });
            if (!userDB)
                return msg.channel.send({ "embed": { "title": ":x: > **The user you entered isn't registered in the database yet!**", "color": 13632027 } });

            let user = await bot.users.fetch(userDB._id)

            await db.collection('user').updateOne({ _id: msg.author.id }, { $set: { [type]: null } });

            const embed = new MessageEmbed();
            embed.setColor('AQUA')
            embed.setTitle(`${user.tag}'s ${type} is now reset.`);

            try {
                console.log(`info: reset ${type} of ${msg.author.tag}`)
                return await msg.channel.send(embed);
            } catch (err) {
                console.error(err);
            }
        }
    }
}