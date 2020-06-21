/**
 * Subs Count function
 * @packageDocumentation
 * @module SubsCount
 * @category Loops
 */
import { Client } from 'discord.js';
import { YouTube } from 'popyt';

/** @desc YouTube API Access */
const yt = new YouTube(process.env.YT_TOKEN)

/**
 * Fetches the subs count.
 * If different than the value on the server, it updates the subs count
 * @param bot - Discord Client object
 */
export default async function subsCount(bot: Client) {
    let channel: any = bot.channels.cache.find(val => val.id == process.env.SUBCOUNT)
    let title = channel.name
    let newCount = title.replace(/\D/gim, '')

    await yt.getChannel('UC0QbcOX2gI5zruEvpSmnf6Q')
        .then(data => {
            if (newCount == data.subCount) return;
            let subs = data.subCount.toLocaleString()
            channel.edit({ name: `📊 ${subs} subs` })
        })
}