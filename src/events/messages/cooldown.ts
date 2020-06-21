/**
 * Elements related to the cooldowns system
 * @packageDocumentation
 * @module Cooldowns
 * @category Events
 */
import { MongoClient, Db } from 'mongodb';
import { Message } from 'discord.js';

import leveling from '../../utils/leveling';
import utils from '../../utils/utilities';
let exp: number = 1;

let cooldownMsg: Map<string, number> = new Map();
let cooldownXP: Map<string, number> = new Map();

/**
 * @classdesc Class used to gather every methods related to a cooldown system
 */
export default class cooldown {

    /**
     * Message cooldown handler (for anti-spam purpose)
     * Automatically mutes the spammer if a spam is detected
     * @param msg - Message object
     */
    static async message(msg: Message) {
        if (!cooldownMsg.has(msg.author.id)) {
            cooldownMsg.set(msg.author.id, 1);
            setTimeout(async () => { cooldownMsg.delete(msg.author.id) }, 2500)
        } else
            cooldownMsg.set(msg.author.id, (cooldownMsg.get(msg.author.id)+1));

        if (cooldownMsg.get(msg.author.id) == 4)
            return msg.reply({ "embed": { "title": "**Please calm down, or I'll mute you.**", "color": 13632027 } })
        else if (cooldownMsg.get(msg.author.id) == 6) {
            await msg.member.roles.add('636254696880734238')
            let msgReply = await msg.reply({ "embed": { "title": "**You've been muted for 20 minutes. Reason : spamming.**", "color": 13632027 } })
            setTimeout(async () => {
                await msgReply.delete()
                return msg.member.roles.remove('636254696880734238')
            }, 1200000);
        }
    }

    /**
     * - Experience cooldown (1exp earnable every 5sec)
     * - Keeps track of the number of message sent in the server with stats db
     * @param msg - Message object
     * @param mongod - MongoDB Client
     * @param db - Database connection
     * @param date - Current date (used for the stats db)
     */
    static async exp(msg: Message, mongod: MongoClient, db: Db, date: string) {
        await db.collection('stats').updateOne({ _id: date }, { $inc: { msg: 1 } }, { upsert: true })
        if (msg.channel.id == '608630294261530624') return;

        if (!cooldownXP.has(msg.author.id)) {
            await db.collection('user').updateOne({ _id: msg.author.id }, { $inc: { exp: exp } }, { upsert: true });
            let user = await db.collection('user').findOne({ '_id': { $eq: msg.author.id } });
            leveling.levelCheck(msg, (user.exp));
            cooldownXP.set(msg.author.id, 1);
            return setTimeout(async () => { cooldownXP.delete(msg.author.id) }, 5000)
        }

        mongod.close();
    }
}

setInterval(() => { exp = utils.randomInt(3) }, 300000);
