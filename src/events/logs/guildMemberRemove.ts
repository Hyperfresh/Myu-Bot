/**
 * Elements related to the guildMemberRemove event
 * @packageDocumentation
 * @module LogGuildMemberRemove
 * @category Events
 */
import { User, Client, TextChannel, MessageEmbed, GuildMember, PartialGuildMember } from 'discord.js';

export default async function guildMemberRemove(member: GuildMember | PartialGuildMember, bot: Client) {
	const fetchedLogs = await member.guild.fetchAuditLogs({
		limit: 1,
		type: 'MEMBER_KICK',
	});
	const kickLog = fetchedLogs.entries.first();

	if (!kickLog) return;

	const { executor, target, createdTimestamp, reason } = kickLog;

	if ((target as User).id === member.id) {
        let channel = await bot.channels.fetch(process.env.LOGTC);
        let embed = new MessageEmbed();
        embed.setTitle("Member kicked");
        embed.setDescription(`Who: <@${member.id}>\nBy: <@${executor.id}>\nReason:\`\`\`${reason} \`\`\``);
        embed.setColor(15260213);
        embed.setTimestamp(createdTimestamp);
        embed.setFooter("Date of kick:")
        embed.setAuthor(executor.username, executor.avatarURL({ format: 'png', dynamic: false, size: 128 }))
        return (channel as TextChannel).send(embed);
	}
}
