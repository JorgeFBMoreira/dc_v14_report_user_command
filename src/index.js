import { config } from 'dotenv'; config();
import { Client, GatewayIntentBits, InteractionType, ModalSubmitInteraction, REST, Routes, TextInputStyle } from 'discord.js';
import { ActionRowBuilder, ModalBuilder, TextInputBuilder } from '@discordjs/builders';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

const { BOT_TOKEN, CLIENT_ID, GUILD_ID } = process.env;
const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

client.on('ready', () => console.log(`${client.user.tag} has logged in.`));



const commands = [
    {
        name: 'Report',
        type: 2,
    },
];

client.on('interactionCreate', async (interaction) => {
    // There is a limit of 5 user commands
    if(interaction.isUserContextMenuCommand()) {
        //console.log(interaction);
        //console.log(`\nCommand Name: ${interaction.commandName}`);

        if(interaction.commandName === 'Report') {
            const modal = new ModalBuilder()
                .setCustomId('reportUserModal')
                .setTitle('Report a User')
                .setComponents(
                    new ActionRowBuilder().setComponents(
                        new TextInputBuilder()
                            .setCustomId('reportMessage')
                            .setLabel('Report Message')
                            .setStyle(TextInputStyle.Paragraph)
                            .setRequired(true)
                            .setMinLength(10)
                            .setMaxLength(500)
                    )
                );

            await interaction.showModal(modal);
            const modalSubmitInteraction = await interaction.awaitModalSubmit({
                filter: (i) => {
                    console.log('Await Modal Submit');
                    console.log(i.fields);
                    return true;
                },
                time: 120000, // 120 seconds = 120000 milliseconds
            });
        
            modalSubmitInteraction.reply({
                content: `Thank you for reporting ${ interaction.targetMember }. Reason: ${ modalSubmitInteraction.fields.getTextInputValue('reportMessage') }`,
                ephemeral: true,
            });
        };
    };
});





async function main() {
    try {
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
            body: commands,
        });

        client.login(BOT_TOKEN);
    } catch (error) {
        console.log(error);
    };
};

main();