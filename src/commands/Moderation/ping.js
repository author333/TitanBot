import { SlashCommandBuilder } from 'discord.js';
import { successEmbed } from '../../utils/embeds.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';
import { logger } from '../../utils/logger.js';
import { handleInteractionError } from '../../utils/errorHandler.js';

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Shows the bot's latency"),

    category: "utility",

    async execute(interaction, config, client) {
        try {
            const sent = await interaction.reply({
                embeds: [
                    successEmbed(
                        "🏓 Pong!",
                        "Calculating latency..."
                    ),
                ],
                fetchReply: true,
            });

            const botLatency = sent.createdTimestamp - interaction.createdTimestamp;
            const apiLatency = Math.round(client.ws.ping);

            await InteractionHelper.universalReply(interaction, {
                embeds: [
                    successEmbed(
                        "🏓 Pong!",
                        `**Bot Response:** \`${botLatency}ms\`\n**API Latency:** \`${apiLatency}ms\``
                    ),
                ],
                edit: true,
            });

        } catch (error) {
            logger.error("Ping command error:", error);
            await handleInteractionError(interaction, error, { subtype: "ping_failed" });
        }
    },
};
