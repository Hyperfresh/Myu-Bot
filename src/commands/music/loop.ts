import { Client, Message } from 'discord.js'

const music = require('../../utils/music')

module.exports.run = (bot: Client, msg: Message) => {
    music.loop(msg);
};

module.exports.help = {
    name: 'loop',
    usage: "?loop",
    desc: "Enable / Disable loop for the current song."
};