import { Client, Message } from 'discord.js'
const music = require('../../utils/music')

module.exports.run = (bot: Client, msg: Message, args: string[]) => {
    music.remove(msg, args);
};

module.exports.help = {
    name: 'remove',
    usage: "?remove (id of the video in the queue)",
    desc: "Remove a video in the queue"
};