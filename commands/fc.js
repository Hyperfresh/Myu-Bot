module.exports.run = async (bot, msg, args, db) => {
    var user = await db.collection('user').findOne({ '_id': { $eq: msg.author.id } });
    var avatar = await msg.author.avatarURL({ format: 'png', dynamic: false, size: 128 })
    if(!user.fc)
        return msg.channel.send({
            "embed": {
              "title": "Do `?setfc 1234-4567-7890` to register it.",
              "color": 15802940,
              "author": {
                "name": "It looks like you haven't yet registered your Switch FC!",
                "icon_url": avatar
              }
            }
          })
    else
        return msg.channel.send({
        "embed": {
          "title": `**SW-${user.fc}**`,
          "color": 15802940,
          "author": {
            "name": `${msg.author.username}'s Switch FC`,
            "icon_url": avatar
          }
        }
      })
};

module.exports.help = {
    name: 'fc',
    usage: "?fc",
    desc: "Print your Switch Friend Code in the channel you sent the command."
};