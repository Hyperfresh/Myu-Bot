import { Client, Message, MessageEmbed } from 'discord.js'

module.exports.run = async (bot: Client, msg: Message, args: string[]) => {
    if (args.length <= 12 && args.length >= 2) {
        if (msg.mentions.everyone) return;
        if (!msg.mentions.members) return;

        let type = args.shift().toLowerCase();
        let flavour: string;
        switch (type) {
            case 'tronky':
                flavour = 'hazelnut'
                if (args.includes('cocoa')) flavour = 'cocoa'
                if (args.includes('milk')) flavour = 'milk'
                if (args.includes('cereal')) flavour = 'cereal'
                if (args.includes('pistacio')) flavour = 'pistacio'
            break;

            case 'popcorn':
                flavour = 'sweet'
                if (args.includes('salty') || args.includes('salted')) flavour = 'salty'
            break;

            case 'snickers':
                flavour = 'orignal'
                if (args.includes('almond')) flavour = 'almond'
                if (args.includes('crisper')) flavour = 'crisper'
                if (args.includes('peanut') || args.includes('butter')) flavour = 'peanut butter'
                if (args.includes('hazelnut')) flavour = 'hazelnut'
            break;

            case 'cookie':
            case 'cookies':
                flavour = 'chocolate'
                if (args.includes('white')) flavour = 'white chocolate'
            break;

            default:
                return msg.channel.send(":x: > **This treat doesn't exist! Type `?help treat` to see every existing treats and flavours.**");
        }

        if (msg.mentions.members.has(msg.author.id))
            return msg.channel.send({ "embed": { "title": `:x: > **You can't give yourself a ${type}!**`, "color": 13632027 } });

        const embed = new MessageEmbed();
        embed.setColor('#F2DEB0')

        if (msg.mentions.members.size >= 2) {
            let users = msg.mentions.members.array()
            let title: string = `**<@${msg.author.id}>** gave **${flavour}** ${type}s to **<@${users[0].id}>**`;
            for (let i = 1; i < (msg.mentions.members.size - 1); i++)
                title = `${title}, **<@${users[i].id}>**`
            title = `${title} & **<@${(msg.mentions.members.last()).id}>**!`
            embed.setDescription(title);
        } else
            embed.setDescription(`**<@${msg.author.id}>** gave a **${flavour}** ${type} to **<@${(msg.mentions.members.first()).id}>**!`)

        return msg.channel.send(embed)
            .then(() => { console.log(`info: treat: ${type} sent by ${msg.author.tag}`); })
            .catch(console.error);
    }
};

module.exports.help = {
    name: 'treat',
    usage: "?treat (type of treat) [flavour] (mention...)",
    desc:
`Give people treats.
Available treats:

- Tronkys
Flavours: hazelnut, cocoa, milk, cereal, pistacio

- Popcorn
Flavours: sweet, salty

- Snickers
Flavours: orignal, almond, crisper, peanut butter, hazelnut

- Cookie
Flavours: chocolate, white chocolate`
};