const Command = require("../../../Structures/Command.js");
const MessageEmbed = require("../../../Structures/MessageEmbed.js");
const filterLevels = {
    DISABLED: "Off",
    MEMBERS_WITHOUT_ROLES: "No Role",
    ALL_MEMBERS: "Everyone"
};
const verificationLevels = {
    NONE: "None",
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "(╯°□°）╯︵ ┻━┻",
    VERY_HIGH: "┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻"
};
const regions = {
    brazil: "Brazil",
    europe: "Europe",
    hongkong: "Hong Kong",
    india: "India",
    japan: "Japan",
    russia: "Russia",
    singapore: "Singapore",
    southafrica: "South Africa",
    sydney: "Sydney",
    "us-central": "US Central",
    "us-east": "US East",
    "us-west": "US West",
    "us-south": "US South"
};

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["Server", "Guildinfo", "Guild", "Info"]
        });
    }

    // eslint-disable-next-line no-unused-vars
    async run(message, args = []) {
        const guild = message.guild;
        const roles = guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
        const members = guild.members.cache;
        const channels = guild.channels.cache;
        const emojis = guild.emojis.cache;

        const embed = new MessageEmbed()
            .setDescription(`**Guild information for __${guild.name}__**`)
            .setColor("BLUE")
            .setThumbnail(guild.iconURL({dynamic: true}))
            .addField("Server Generals", [
                `**❯ Name:** ${guild.name} (${guild.nameAcronym})`,
                `**❯ Description:** ${guild.description ? guild.description : "None Detected"}`,
                `**❯ ID:** ${guild.id}`,
                `**❯ Owner:** ${guild.owner.nickname} (${guild.owner.user.tag})`,
                `**❯ Application ID:** ${guild.applicationID ? `Application ${guild.applicationID}` : "None Detected"}`,
                `**❯ Current Region:** ${regions[guild.region]}`,
                `**❯ Current Shard ID:** ${guild.shardID}`,
                `**❯ Partnered?:** ${guild.partnered}`,
                `**❯ MFA Level:** ${guild.mfaLevel}`,
                `**❯ Boosts:** ${guild.premiumTier && guild.premiumSubscriptionCount ? `Tier ${guild.premiumTier} and ${guild.premiumSubscriptionCount} Boosters` : "None Detected"}`,
                `**❯ Thicc?:** ${guild.large}`,
                `**❯ Explicit Filter:** ${filterLevels[guild.explicitContentFilter]}`,
                `**❯ Verification Level:** ${verificationLevels[guild.verificationLevel]}`,
                `**❯ Time created:** ${guild.createdAt}`,
                `**❯ AFK Channel and Timeout:** ${guild.afkChannelID ? `<#${guild.afkChannelID}>` : "None Detected"}/${guild.afkTimeout ? guild.afkTimeout : "None Detected"}`,
                `**❯ Rules Channel:** ${guild.rulesChannelID ? `<#${guild.rulesChannelID}>` : "None Detected"}`,
                "\u200b"
            ])
            .addField("Server Statistics", [
                `**❯ Member Count:** ${guild.memberCount}`,
                `**❯ Humans:** ${members.filter(member => !member.user.bot).size}`,
                `**❯ Bots:** ${members.filter(member => member.user.bot).size}`,
                `**❯ Role Count:** ${roles.length}`,
                `**❯ Channels: :** ${channels.size}`,
                `**❯ Text Channels: :** ${channels.filter(channel => channel.type === "text").size}`,
                `**❯ Voice Channels: :** ${channels.filter(channel => channel.type === "voice").size}`,
                `**❯ Emoji Count:** ${emojis.size}`,
                `**❯ Regular Emoji count:** ${emojis.filter(emoji => !emoji.animated).size}`,
                `**❯ Animated Emoji count:** ${emojis.filter(emoji => emoji.animated).size}`,
                `**❯ Boosters:** ${guild.premiumSubscriptionCount || "0"}`,
                "\u200b"
            ])
            .addField("Server Presence", [
                `**❯ Total:** ${members.size}`,
                `**❯ Online:** ${members.filter(member => member.presence.status === "online").size}`,
                `**❯ Do Not Disturb:** ${members.filter(member => member.presence.status === "dnd").size}`,
                `**❯ Idle:** ${members.filter(member => member.presence.status === "idle").size}`,
                `**❯ Offline:** ${members.filter(member => member.presence.status === "offline").size}`,
                "\u200b"
            ])
            .addField("Server Roles", await this.client.utils.formatRoles(roles))
            .setTimestamp();
        message.channel.send(embed);
    }
};