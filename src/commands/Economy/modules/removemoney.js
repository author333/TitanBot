import { SlashCommandBuilder } from 'discord.js';
import { successEmbed, warningEmbed } from '../../utils/embeds.js';
import { getEconomyData, setEconomyData } from '../../utils/economy.js';
import { withErrorHandling } from '../../utils/errorHandler.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

const ALLOWED_USERS = [
    '1421980002693415024'
];

export default {
    data: new SlashCommandBuilder()
        .setName('removemoney')
        .setDescription('Remove money from a user')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('User to remove money from')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('Amount of money')
                .setRequired(true)
                .setMinValue(1)
        ),

    execute: withErrorHandling(async (interaction, config, client) => {
        const deferred = await InteractionHelper.safeDefer(interaction);
        if (!deferred) return;

        if (!ALLOWED_USERS.includes(interaction.user.id)) {
            return InteractionHelper.safeEditReply(interaction, {
                embeds: [
                    warningEmbed(
                        'No Permission',
                        'You are not allowed to use this command.'
                    )
                ]
            });
        }

        const target = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        const guildId = interaction.guildId;

        let userData = await getEconomyData(client, guildId, target.id);

        userData.wallet = Math.max(0, userData.wallet - amount);

        await setEconomyData(client, guildId, target.id, userData);

        return InteractionHelper.safeEditReply(interaction, {
            embeds: [
                successEmbed(
                    'Money Removed',
                    `Successfully removed **$${amount.toLocaleString()}** from <@${target.id}>.`
                )
            ]
        });
    }, { command: 'removemoney' })
};
