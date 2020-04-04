import { Client, Message } from 'discord.js'
import { Db } from 'mongodb'
const profile = require('../js/profile')

module.exports.run = (bot:Client, msg:Message, args:string[], db:Db) => {
    profile.reset(bot, msg, args, db, 'birthday');
};

module.exports.help = {
    name: 'resetbd'
};