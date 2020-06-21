/**
 * Letmein function
 * @packageDocumentation
 * @module Letmein
 * @category Utils
 */
import utilities from './utilities'
import { Message } from 'discord.js';
import { Db } from 'mongodb';

/**
 * @param msg - Message object
 * @param levels - Levels list object
 * @param db - Database connection object
 */
export default async function letmein(msg: Message, levels: any, db: Db) {
    if (msg.channel.id != process.env.LOBBY) return;

    let user: any = await db.collection('user').findOne({ '_id': { $eq: msg.author.id } });
    if (user) {
        let lvl = await utilities.levelInfo(user.exp);
        if (lvl.level != 0) await msg.member.roles.add(levels[lvl.level].id);
        await db.collection('user').updateOne({ _id: msg.author.id }, { $set: { hidden: false } });
    }

    let date: string = new Date().toISOString().slice(0, 10)
    await db.collection('stats').updateOne({ _id: date }, { $inc: { letmein: 1 } }, { upsert: true })

    return msg.member.roles.add('606862164392673290').then(() => {
        msg.delete().catch(console.error)
        try {
            msg.member.send({ "embed": { "description": "I'm Q-Bot, a unique bot created for this server.\n\nYou can use me with the prefix `?`\nand see all my commands by doing `?help`", "color": 2543500, "author": { "name": `Welcome to Qumu's Discord Server, ${msg.author.username} !`, "icon_url": msg.author.avatarURL({ format: 'png', dynamic: false, size: 128 }) } } });
        } catch (err) {
            console.error(err)
        }
    }).catch(console.error)
}