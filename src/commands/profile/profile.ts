import { Client, Message } from 'discord.js'
import { Db } from 'mongodb'
import * as ejs from 'ejs';
import imGenerator from '../../utils/img';
import utilities from '../../utils/utilities'
let lastComboColor: number;

module.exports.run = (bot: Client, msg: Message, args: string[], db: Db) => {
    if (args.length == 1) {
        if (msg.mentions.everyone) return;
        let mention = msg.mentions.users.first()
        if (!mention) return;
        return profileImg(bot, msg, db, mention.id);
    } else
        return profileImg(bot, msg, db, msg.author.id);
};

module.exports.help = {
    name: 'profile',
    usage: "?profile [mention someone]",
    desc: "Print your or someone's profile"
};

async function profileImg(bot: Client, msg: Message, db: Db, id: string) {
    let userDB = await db.collection('user').findOne({ '_id': { $eq: id } });

    if (!userDB) return msg.channel.send(":x: > **You aren't registered into the database. You need to talk once in a channel to have your profile created.**");

    msg.channel.startTyping();

    let userDiscord = await bot.users.fetch(id)

    let guild = bot.guilds.cache.find(val => val.id == process.env.GUILDID)
    let member = guild.members.cache.find(val => val.id == id)

    let leadXP = await db.collection('user').find({ hidden: { $ne: true } }).sort({ exp: -1 }).toArray();
    let leadHug = await db.collection('user').find({ hidden: { $ne: true } }).sort({ hug: -1 }).toArray();
    let leadPat = await db.collection('user').find({ hidden: { $ne: true } }).sort({ pat: -1 }).toArray();
    let leadBoop = await db.collection('user').find({ hidden: { $ne: true } }).sort({ boop: -1 }).toArray();
    let leadSlap = await db.collection('user').find({ hidden: { $ne: true } }).sort({ slap: -1 }).toArray();
    let leadHighfive = await db.collection('user').find({ hidden: { $ne: true } }).sort({ highfive: -1 }).toArray();

    let lvlInfo = utilities.levelInfo(userDB.exp);

    let user = {
        avatar: userDiscord.avatarURL({ format: 'png', dynamic: false, size: 512 }),
        username: userDiscord.username,
        icon: "",
        exp: userDB.exp,
        pat: userDB.pat ? userDB.pat : 0,
        hug: userDB.hug ? userDB.hug : 0,
        boop: userDB.boop ? userDB.boop : 0,
        slap: userDB.slap ? userDB.slap : 0,
        highfive: userDB.highfive ? userDB.highfive : 0,
        positionXP: leadXP.findIndex(val => val._id == id),
        positionPat: leadPat.findIndex(val => val._id == id),
        positionHug: leadHug.findIndex(val => val._id == id),
        positionBoop: leadBoop.findIndex(val => val._id == id),
        positionSlap: leadSlap.findIndex(val => val._id == id),
        positionHighfive: leadHighfive.findIndex(val => val._id == id),
        birthday: userDB.birthday ? userDB.birthday : "--/--",
        fc: userDB.fc ? userDB.fc : "not registered yet",
        psn: userDB.psn ? userDB.psn : "not registered yet",
        level: lvlInfo.level,
        current: lvlInfo.current,
        max: lvlInfo.max
    }

    if (id == process.env.QUMU)
        user.icon = '<i class="fas fa-chess-king"></i>'
    else if (member.roles.cache.find(val => val.id == process.env.MODROLE))
        user.icon = '<i class="fas fa-chess-rook"></i>'
    else if (id == bot.user.id)
        user.icon = '<i class="fas fa-chess-knight"></i>'

    let colors: Map<string, string> = new Map();
    colors.set('#bbcbff', '#969AE6');
    colors.set('#f0cbcb', '#f9d6d6');
    colors.set('#eea3f0', '#ea93ec');
    colors.set('#70e6b5', '#70e6db');
    colors.set('#b3e296', '#6fca82');
    colors.set('#e14182', '#e86499');
    colors.set('#ae85eb', '#ba8dd9');
    colors.set('#d5474a', '#ec7275');
    colors.set('#9458f3', '#ad8ae6');
    colors.set('#81d14d', '#a7ea7b');
    colors.set('#f5bc31', '#f4da9b');

    let userColor = member.displayHexColor, firstColor, secondColor;
    if (id == process.env.QUMU || id == bot.user.id || member.roles.cache.find(val => val.id == process.env.MODROLE)) {
        firstColor = '#90B1FF'; secondColor = '#F0A6E4';
    } else {
        firstColor = colors.get(userColor); secondColor = userColor;
    }

    let html, file;
    if (id == process.env.QUMU) {
        html = await ejs.renderFile('views/profileQumu.ejs', { user, firstColor, secondColor });
        file = await imGenerator(508, 288, html, userDiscord.id, 'prof')
    } else if (id == bot.user.id) {
        let thanksiwa: number = userDB.thanksiwa
        html = await ejs.renderFile('views/profileBot.ejs', { user, firstColor, secondColor, thanksiwa });
        file = await imGenerator(508, 358, html, userDiscord.id, 'prof')
    } else {
        html = await ejs.renderFile('views/profile.ejs', { user, firstColor, secondColor });
        file = await imGenerator(508, 408, html, userDiscord.id, 'prof')
    }

    try {
        console.log(`info: profile by ${msg.author.tag}`)
        return msg.channel.send('', { files: [file] })
            .then(() => { msg.channel.stopTyping(true) });
    } catch (err) {
        console.error(err)
        return msg.channel.send(":x: > An error occured. Please contact <@125325519054045184>.")
    }
}