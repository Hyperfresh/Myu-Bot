import { Client, Message } from 'discord.js'
import { Db } from 'mongodb'
const highfive = require('./highfive');

module.exports.run = async (bot: Client, msg: Message, args: string[], db: Db) => {
    highfive.run(bot, msg, args, db);
};

module.exports.help = {
    name: 'hifive',
    usage: "?hifive (mention someone)",
    desc: "Highfive people by mentioning them. Requires the target to react back!\nAlias of ?highfive"
};