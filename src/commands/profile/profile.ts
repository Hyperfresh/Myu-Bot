import { Client, Message } from 'discord.js'
import { Db } from 'mongodb'
import * as ejs from 'ejs';
import imGenerator from '../../utils/img';
import utilities from '../../utils/utilities'
let lastComboColor:number;

module.exports.run = (bot:Client, msg:Message, args:string[], db:Db) => {
    if(args.length == 1) {
        if(msg.mentions.everyone)return;
        let mention = msg.mentions.users.first()
        if(!mention)return;
        return profileImg(bot, msg, db, mention.id);
    } else
        return profileImg(bot, msg, db, msg.author.id);
};

module.exports.help = {
    name: 'profile',
    usage: "?profile [mention someone]",
    desc: "Print your or someone's profile"
};

async function profileImg(bot:Client, msg:Message, db:Db, id:string) {
    let userDB = await db.collection('user').findOne({ '_id': { $eq: id } });

    if(!userDB)return msg.channel.send(":x: > **You aren't registered into the database. You need to talk once in a channel to have your profile created.**");

    msg.channel.startTyping();

    let userDiscord = await bot.users.fetch(id)

    let guild = bot.guilds.cache.find(val => val.id == process.env.GUILDID)
    let member = guild.members.cache.find(val => val.id == id)

    let leadXP = await db.collection('user').find({ hidden: { $ne: true } }).sort({exp:-1}).toArray();
    let leadHug = await db.collection('user').find({ hidden: { $ne: true }}).sort({hug:-1}).toArray();
    let leadPat = await db.collection('user').find({ hidden: { $ne: true } }).sort({pat:-1}).toArray();
    let leadBoop = await db.collection('user').find({ hidden: { $ne: true } }).sort({boop:-1}).toArray();
    let leadSlap = await db.collection('user').find({ hidden: { $ne: true } }).sort({slap:-1}).toArray();
    let leadHighfive = await db.collection('user').find({ hidden: { $ne: true } }).sort({highfive:-1}).toArray();

    let lvlInfo = utilities.levelInfo(userDB.exp);

    let user = {
        avatar: userDiscord.avatarURL({ format: 'png', dynamic: false, size: 512 }),
        username: userDiscord.username,
        icon: "",
        exp: userDB.exp,
        pat: userDB.pat? userDB.pat : 0,
        hug: userDB.hug? userDB.hug : 0,
        boop: userDB.boop? userDB.boop : 0,
        slap: userDB.slap? userDB.slap : 0,
        highfive: userDB.highfive? userDB.highfive : 0,
        positionXP: leadXP.findIndex(val => val._id == id),
        positionPat: leadPat.findIndex(val => val._id == id),
        positionHug: leadHug.findIndex(val => val._id == id),
        positionBoop: leadBoop.findIndex(val => val._id == id),
        positionSlap: leadSlap.findIndex(val => val._id == id),
        positionHighfive: leadHighfive.findIndex(val => val._id == id),
        birthday: userDB.birthday? userDB.birthday : "--/--",
        fc: userDB.fc? userDB.fc : "not registered yet",
        psn: userDB.psn? userDB.psn : "not registered yet",
        level: lvlInfo.level,
        current: lvlInfo.current,
        max: lvlInfo.max
    }

    if(id == process.env.QUMU)
        user.icon = '<i class="fas fa-chess-king"></i>'
    else if(member.roles.cache.find(val => val.id == process.env.MODROLE))
        user.icon = '<i class="fas fa-chess-rook"></i>'
    else if (id == bot.user.id)
        user.icon = '<i class="fas fa-chess-knight"></i>'

    let colors:string[][] = [
        ['#8BC6EC', '#9599E2'],
        ['#FFFFD5', '#86DFBC'],
        ['#FFE5E5', '#C8BDFF'],
        ['#FD9090', '#F9AEDC'],
        ['#ECE799', '#FFD3B9'],
        ['#90B1FF', '#F0A6E4']
    ]

    let whichColor;
    if(id == process.env.QUMU || id == bot.user.id || member.roles.cache.find(val => val.id == process.env.MODROLE))
        whichColor = 5
    else {
        whichColor = (utilities.randomInt(5) - 1)
        while(lastComboColor == whichColor)
            whichColor = (utilities.randomInt(5) - 1)
        lastComboColor = whichColor
    }

    let html, file;
    if(id == process.env.QUMU) {
        html = await ejs.renderFile('views/profileQumu.ejs', { user, colors, whichColor });
        file = await imGenerator(508, 288, html, userDiscord.id, 'prof')
    } else if(id == bot.user.id) {
        let thanksiwa:number = userDB.thanksiwa
        html = await ejs.renderFile('views/profileBot.ejs', { user, colors, whichColor, thanksiwa });
        file = await imGenerator(508, 358, html, userDiscord.id, 'prof')
    } else {
        html = await ejs.renderFile('views/profile.ejs', { user, colors, whichColor });
        file = await imGenerator(508, 408, html, userDiscord.id, 'prof')
    }

    try {
        console.log(`info: profile by ${msg.author.tag}`)
        return msg.channel.send('', {files: [file]})
            .then(() => { msg.channel.stopTyping(true) });
    } catch(err) {
        console.error(err)
        return msg.channel.send(":x: > An error occured. Please contact <@125325519054045184>.")
    }
}