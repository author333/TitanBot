import {
    SlashCommandBuilder,
    AttachmentBuilder
} from "discord.js";

import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";

export default {
    data: new SlashCommandBuilder()
        .setName("download")
        .setDescription("Download a direct media file and upload it.")
        .addStringOption(option =>
            option
                .setName("url")
                .setDescription("Direct .mp4/.mov/.webm URL")
                .setRequired(true)
        ),

    category: "utility",

    async execute(interaction) {
        const url = interaction.options.getString("url");

        try {
            const parsed = new URL(url);

            const allowed = [".mp4", ".mov", ".webm"];

            if (!allowed.some(ext => parsed.pathname.toLowerCase().endsWith(ext))) {
                return interaction.reply({
                    content: "❌ Only direct .mp4, .mov and .webm links are supported.",
                    ephemeral: true
                });
            }

            await interaction.reply({
                content: "⬇ Downloading...",
            });

            const response = await fetch(url);

            if (!response.ok)
                throw new Error(`Download failed (${response.status})`);

            const tempFile = path.join(
                os.tmpdir(),
                crypto.randomUUID() + path.extname(parsed.pathname)
            );

            const buffer = Buffer.from(await response.arrayBuffer());

            fs.writeFileSync(tempFile, buffer);

            const attachment = new AttachmentBuilder(tempFile);

            await interaction.followUp({
                content: "✅ Download complete.",
                files: [attachment]
            });

            fs.unlinkSync(tempFile);

        } catch (err) {
            console.error(err);

            if (interaction.replied) {
                await interaction.followUp({
                    content: "❌ Failed to download that file."
                });
            } else {
                await interaction.reply({
                    content: "❌ Failed to download that file.",
                    ephemeral: true
                });
            }
        }
    }
};
