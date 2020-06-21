/**
 * Boost Color Check function
 * @packageDocumentation
 * @module BoostColorCheck
 * @category Loops
 */
import { Client } from 'discord.js';

/**
 * Checks if some people are no longer boosters but still wear the booster color.
 * If so, the color role is removed from those users.
 * @param bot - Discord Client object
 */
export default async function boostColorCheck(bot: Client) {
    let guild = bot.guilds.cache.find(val => val.id == process.env.GUILDID)

    guild.members.cache.forEach(async elem => {
        if (elem.roles.cache.find(val => val.id == process.env.BOOSTCOLOR) && !(elem.roles.cache.find(val => val.id == process.env.BOOSTROLE))) {
            await elem.roles.remove(process.env.BOOSTCOLOR);
        }
    });
}