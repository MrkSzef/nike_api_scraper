const { SlashCommandBuilder, EmbedBuilder, Options, inlineCode, channelLink  } = require('discord.js');
let { stores } = require('../data/stores.json');

stores = stores.slice(0,24);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('check_instore')
        .addStringOption(option => option
            .setName('sku')
            .setDescription("Provide Product SKU")
            .setRequired(true))
        .addStringOption(option => option
            .setName('store')
            .setDescription("Choose store")
            .setRequired(true)
            .setChoices(...stores))
        .setDescription('😎'),
    async execute(interaction) {
        const sku = interaction.options.getString('sku');
        const store = interaction.options.getString('store');

        const response = await fetch(
            `https://api.nike.com/deliver/available_gtins/v3?filter=styleColor(${sku})&filter=storeId(${store})&filter=method(INSTORE)`,
            {
            method: "GET"
        })
        if (response.status !== 200) {
            interaction.reply({ content: 'No Such Product in This Store', ephemeral: true });
            return;
        }
        
        let data = (await response.json())['objects'];
        data = await Array.from(data).map(elm => {
            return [elm['gtin'],elm['level']]
        })
        console.log(data);
        
        interaction.reply({ content: data.join("\n") }); 
    }
}

