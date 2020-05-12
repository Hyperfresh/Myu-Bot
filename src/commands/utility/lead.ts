import { Client, Message } from 'discord.js'
import { Db } from 'mongodb'
import utilities from '../../js/utilities'

module.exports.run = (bot:Client, msg:Message, args:string[], db:Db) => {
    utilities.leaderboard(bot, msg, args, db);
};

module.exports.help = {
    name: 'lead',
    usage: "?lead (exp | pat | hug | boop | slap)",
    desc: "Show the leaderboard of a category :\nexperience, amount of pats / hugs / boops / slaps given.\n(alias of `?leaderboard`)"
};