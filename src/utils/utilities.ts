/**
 * Group of utilities functions
 * @packageDocumentation
 * @module Utilities
 * @category Utils
 */
import * as Discord from "discord.js";
import { Db } from 'mongodb';

/** @desc Object containing infos about levels (ids, exp amounts, ...) */
let levels = require('../../lib/levels.json')
/** @desc Importing package.json to fetch the version tag */
let packageJson = require('../../package.json')

export default class utilities {

    /**
     * Sends a little message containing useful infos about the bot
     * @param msg - Message object
     * @param iwaUrl - iwa's Discord pfp url (fetched before the exec of the method)
     */
    public static async info(msg: Discord.Message, iwaUrl: string): Promise<Discord.Message> {
        let embed = {
            "embed": {
                "title": "**Bot Infos**",
                "description": "Q-Bot is mainly developed and handled by <@125325519054045184>.\nYou can help contribute to Q-Bot's code [here!](https://github.com/iwa/Q-Bot)\n\nLanguage : `TypeScript` using NodeJS\nAPI Access : `discord.js` package on npm\n\nYou can access to the index of commands by typing `?help`\n\nAll my work is done for free, but you can still financially support me [here](https://www.patreon.com/iwaQwQ)",
                "color": 13002714,
                "footer": {
                    "text": `Created with ♥ by iwa & contributors | Copyright © iwa, v${packageJson.version}`
                },
                "thumbnail": {
                    "url": iwaUrl
                }
            }
        }

        try {
            console.log(`info: info: ${msg.author.tag}`)
            await msg.author.send(embed)
        } catch (ex) {
            return msg.channel.send("**:x: > Please open your DMs!**")
        }

    }

    /**
     * Parses the request and sends the right leaderboard
     * @param bot - Discord Client object
     * @param msg - Message object
     * @param args - Arguments in the message
     * @param db - Database connection object
     */
    static leaderboard(bot: Discord.Client, msg: Discord.Message, args: string[], db: Db): Promise<void> {
        if (args.length > 1) return;

        switch (args[0]) {
            case "xp":
            case "exp":
                return leaderboard(bot, msg, db, 'exp')

            case "pat":
            case "pats":
            case "patpat":
            case "patpats":
                return leaderboard(bot, msg, db, 'pat')

            case "hug":
            case "hugs":
                return leaderboard(bot, msg, db, 'hug')

            case "boop":
            case "boops":
                return leaderboard(bot, msg, db, 'boop')

            case "slap":
            case "slaps":
                return leaderboard(bot, msg, db, 'slap')

            case "highfive":
            case "highfives":
            case "high-five":
            case "high-fives":
                return leaderboard(bot, msg, db, 'highfive')

            default:
                msg.channel.send({ "embed": { "title": "`exp | pat | hug | boop | slap | highfive`", "color": 3396531 } });
                break;
        }
    }

    /**
     * Generates a random number between 1 and 'max'
     * @param max - Maximum value
     */
    static randomInt(max: number): number {
        return Math.floor(Math.random() * Math.floor(max) + 1);
    }

    /**
     * Creates an object containing infos about user's level
     * @param xp - Total amount of exp points of the user
     */
    static levelInfo(xp: number): { 'level': number, 'current': number, 'max': number } {
        if (xp < levels[1].amount) {
            return { 'level': 0, 'current': xp, 'max': levels[1].amount }
        }
        for (let i = 1; i < 20; i++) {
            if (xp >= levels[i].amount && xp < levels[i + 1].amount) {
                return { 'level': i, 'current': (xp - levels[i].amount), 'max': (levels[i + 1].amount - levels[i].amount) }
            }
        }
        return { 'level': 20, 'current': xp, 'max': levels[20].amount }
    }

    /**
     * Checks if the author of the message object is a mod
     * @param msg - Message object in which the author is checked
     */
    static isMod(msg: Discord.Message): boolean {
        if (msg.member.roles.cache.find(val => val.id == process.env.MODROLE)) { return true }
        else { return false }
    }
}

/**
 * Calculates the leaderboard of the requested type
 * @param bot - Discord Client object
 * @param msg - Message object
 * @param db - Database connection object
 * @param type - Type of leaderboard to calculate (exp, pat, ...)
 */
async function leaderboard(bot: Discord.Client, msg: Discord.Message, db: Db, type: string) {
    let leaderboard = await db.collection('user').find({ hidden: false }).sort({ [type]: -1 }).limit(10).toArray();
    let n = 0;

    msg.channel.startTyping()
    let title = `${type.charAt(0).toUpperCase()}${type.slice(1)}`

    const embed = new Discord.MessageEmbed();
    embed.setColor(16114507)
    embed.setTitle(`:trophy: **${title} Leaderboard**`)

    leaderboard.forEach(async elem => {
        let user = await bot.users.fetch(elem._id)
        n++;
        embed.addField(`**${n}. ${user.username}**`, `${elem[type]} ${type}s`)
    })

    setTimeout(() => {
        msg.channel.send(embed)
            .then(() => {
                console.log(`info: ${type} leaderboard: ${msg.author.tag}`);
                msg.channel.stopTyping()
            }).catch(console.error)
    }, 1500)
}