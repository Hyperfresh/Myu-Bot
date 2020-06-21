import { Client, Message } from 'discord.js'
import { Db } from 'mongodb'
const thanks = require('./thanks')

module.exports.run = async (bot: Client, msg: Message, args: string[], db: Db) => {
    await thanks.run(bot, msg, args, db);
};

module.exports.help = {
    name: 'thank',
    usage: "?thank",
    desc: "Thank iwa & contributors for their work"
};