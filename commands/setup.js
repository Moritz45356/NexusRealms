import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} from 'discord.js';
import { setGuildChannel, setGuildInterval } from '../database/db.js';
import { renderInfoMessage } from '../services/renderer.js';

export default {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Story-System für diesen Server einrichten')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sub =>
      sub
        .setName('channel')
        .setDescription('Lege den Story-Kanal fest')
        .addChannelOption(opt =>
          opt
            .setName('channel')
            .setDescription('Kanal für Story-Events')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true),
        ),
    )
    .addSubcommand(sub =>
      sub
        .setName('interval')
        .setDescription('Lege das Event-Intervall in Minuten fest')
        .addIntegerOption(opt =>
          opt
            .setName('minutes')
            .setDescription('Minuten zwischen automatischen Story-Events')
            .setMinValue(5)
            .setMaxValue(1440)
            .setRequired(true),
        ),
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'channel') {
      const channel = interaction.options.getChannel('channel', true);
      setGuildChannel(interaction.guildId, channel.id);
      return interaction.reply({
        ...renderInfoMessage('✅ Setup gespeichert', [
          `Story-Kanal gesetzt auf <#${channel.id}>.`,
          'Verwende `/story start` um die Geschichte zu beginnen.',
        ]),
        ephemeral: true,
      });
    }

    if (sub === 'interval') {
      const minutes = interaction.options.getInteger('minutes', true);
      setGuildInterval(interaction.guildId, minutes);
      return interaction.reply({
        ...renderInfoMessage('✅ Intervall gespeichert', [
          `Neue Story-Events erscheinen nun alle **${minutes}** Minuten.`,
        ]),
        ephemeral: true,
      });
    }
  },
};
