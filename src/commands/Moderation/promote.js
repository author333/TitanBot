import { SlashCommandBuilder } from 'discord.js';
import { successEmbed } from '../../utils/embeds.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';
import { logger } from '../../utils/logger.js';
import { handleInteractionError } from '../../utils/errorHandler.js';

export default {
    data: new SlashCommandBuilder()
        .setName("promote")
        .setDescription("Create a staff promotion announcement")

        .addUserOption(option =>
            option
                .setName("target")
                .setDescription("The promoted staff member")
                .setRequired(true)
        )

        .addRoleOption(option =>
            option
                .setName("old_rank")
                .setDescription("The member's previous rank")
                .setRequired(true)
        )

        .addRoleOption(option =>
            option
                .setName("new_rank")
                .setDescription("The member's new rank")
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("note")
                .setDescription("Promotion note")
                .setRequired(true)
        ),

    category: "staff",

    async execute(interaction) {
        try {
            const target = interaction.options.getUser("target");
            const oldRank = interaction.options.getRole("old_rank");
            const newRank = interaction.options.getRole("new_rank");
            const note = interaction.options.getString("note");

            const staffRank = interaction.member.roles.highest;

            await InteractionHelper.universalReply(interaction, {
                embeds: [
                    successEmbed(
                        "📈 STAFF PROMOTION",
                        `**Username:** ${interaction.user}
**Rank:** ${staffRank}

**Target:** ${target}
**Old Rank:** ${oldRank}
**New Rank:** ${newRank}

**Note:**
${note}`
                    )
                ]
            });

        } catch (error) {
            logger.error("Promote command error:", error);
            await handleInteractionError(interaction, error, { subtype: "promotion_failed" });
        }
    },
};
