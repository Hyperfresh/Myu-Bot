import { Client, Message, MessageReaction, User, MessageEmbed } from 'discord.js'
import { Db } from 'mongodb'
import utilities from '../../utils/utilities';
let lastGif: number = 0, count: number = 9;
let lastGifFail: number = 0, countFail: number = 5;

module.exports.run = async (bot: Client, msg: Message, args: string[], db: Db) => {

    if (msg.mentions.everyone) return;
    let mention = msg.mentions.users.first()
    if (!mention) return;

    if (mention.id == msg.author.id) // Send this reply if user mentioned is the same as user who sent message
        return msg.channel.send({ "embed": { "title": `:x: > **You can't highfive youself!**`, "color": 13632027 } });

    if (mention.id == bot.user.id) return;

    let result = await db.collection('highfive').findOne({ 'author': { $eq: msg.author.id }, 'target': { $eq: mention.id } });
    if (result)
        return msg.channel.send({ "embed": { "title": `:x: > **You already requested this user a highfive!**`, "color": 13632027 } });

    let reply = await msg.channel.send({
        "embed": {
            "title": "🙌",
            "description": `<@${msg.author.id}> wants to do a high five with you <@${mention.id}>!\nReact with ✋ to accept the highfive`,
            "color": 15916720,
            "footer": {
                "text": "(The request will fail in 30 seconds)"
            }
        }
    })

    let n = utilities.randomInt(count)
    while (lastGif == n)
        n = utilities.randomInt(count);
    lastGif = n;

    await reply.react('✋');
    await db.collection('highfive').updateOne({ _id: reply.id }, { $set: { author: msg.author.id, target: mention.id, gif: n } }, { upsert: true })

    setTimeout(async () => {
        let result = await db.collection('highfive').findOne({ '_id': { $eq: reply.id }, 'target': { $eq: mention.id } });

        if (result) {
            await reply.delete()
            await db.collection('highfive').deleteOne({ '_id': { $eq: reply.id }, 'target': { $eq: mention.id } })
            let n = utilities.randomInt(countFail)
            while (lastGifFail == n)
                n = utilities.randomInt(countFail);
            lastGifFail = n;

            const embed = new MessageEmbed();
            embed.setColor('#F2DEB0')
            embed.setDescription(`**<@${msg.author.id}>**...`)
            embed.setImage(`https://${process.env.CDN_URL}/img/highfive/fail/${n}.gif`)
            msg.channel.send(embed)
        }
    }, 30000)
};

module.exports.help = {
    name: 'highfive',
    usage: "?highfive (mention someone)",
    desc: "Highfive people by mentioning them. Requires the target to react back!"
};