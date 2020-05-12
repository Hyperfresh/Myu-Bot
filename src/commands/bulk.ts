import { Client, Message } from 'discord.js'
const staff = require('../js/staff')

module.exports.run = (bot:Client, msg:Message, args:string[]) => {
    staff.bulk(msg, args);
};

module.exports.help = {
    name: 'bulk'
};