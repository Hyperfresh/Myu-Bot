import { Client, Message, Collection } from 'discord.js';
import { Db } from 'mongodb';
import utilities from '../../utils/utilities'
let commands: stringKeyArray = [];
let member = {};
interface stringKeyArray {
    [index: string]: any;
}

import * as fs from 'fs';

readDirs()
setTimeout(() => {
    member = {
        "embed": {
            "title": "__**Commands**__",
            "description": "Prefix : `?`\nUse `?help (command)` to have more info about a specific command",
            "color": 3852663,
            "fields": [
                {
                    "name": "**👤 Profile**",
                    "value": commands["profile"]
                },
                {
                    "name": "**💕 Actions**",
                    "value": commands["actions"]
                },
                {
                    "name": "**🕹 Games**",
                    "value": commands["games"]
                },
                {
                    "name": "**💩 Memes**",
                    "value": commands["memes"]
                },
                {
                    "name": "**🎶 Music** (only usable in #radio-lounge)",
                    "value": commands["music"]
                },
                {
                    "name": "**🛠 Utility**",
                    "value": commands["utility"]
                },
            ]
        }
    }
}, 5000)

let mod = {
    "embed": {
        "title": "**⚔️ Mods**",
        "description": "`?forceskip`\n`?bulk (amount of messages to delete)`\n`?mute (mention someone) (length, eg. '5d 1h 20m 35s')`",
        "color": 4886754
    }
}

module.exports.run = async (bot: Client, msg: Message, args: string[], db: Db, commands: Collection<any, any>) => {
    if (args.length == 1) {
        let cmd = commands.get(args[0]);
        if (!cmd || !cmd.help.usage) return;
        else {
            await msg.channel.send("`Syntax : ( ) is needed argument, [ ] is optional argument`")
            return msg.channel.send(`\`\`\`markdown\n< ${cmd.help.name} >\n\n# Usage\n${cmd.help.usage}\n\n# Description\n${cmd.help.desc}\`\`\``);
        }
    } else
        sendHelp(msg);
    console.log(`info: help sent to ${msg.author.tag}`)
}

module.exports.help = {
    name: 'help',
    usage: "?help",
    desc: "Well... Obviously it sends you the list of the commands"
};

async function sendHelp(msg: Message) {
    if (utilities.isMod(msg) == true || msg.author.id == process.env.QUMU)
        try {
            await msg.author.send(member)
            await msg.author.send(mod)
        } catch (ex) {
            return msg.channel.send(":x: > **Please open your DMs, I can't reach you** <:sad_onigiri:610476938955456532>")
        }
    else
        try {
            await msg.channel.send(member)
        } catch {
            return msg.channel.send(":x: > **Commands list loading, redo the commands in a few seconds!**")
        }
}

async function readDirs() {
    fs.readdir('./build/commands/', { withFileTypes: true }, async (error, f) => {
        if (error) return console.error(error);
        f.forEach((f) => {
            if (f.isDirectory()) {
                fs.readdir(`./build/commands/${f.name}/`, async (error, fi) => {
                    if (error) return console.error(error);
                    let string: string = "";
                    fi.forEach(async (fi) => {
                        string = `${string}\`${fi.slice(0, -3)}\` `;
                    })
                    commands[f.name] = string;
                })
            }
        });
    });
}
