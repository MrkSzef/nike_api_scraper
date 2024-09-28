const { SlashCommandBuilder, EmbedBuilder, Options, inlineCode, channelLink  } = require('discord.js');
const { Data_Process } = require('../self-modules/scraper-main-functions');
let { stores } = require('../data/stores.json')
const { region, language, channels } = require('../config.json');


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
        let gtin_translation

        const response = await fetch(
            `https://api.nike.com/deliver/available_gtins/v3?filter=styleColor(${sku})&filter=storeId(${store})&filter=method(INSTORE)`,
            {
            method: "GET"
        })
        if (response.status !== 200) {
            interaction.reply({ content: 'No Such Product in This Store', ephemeral: true });
            return;
        }

        
        for (let i = 0; i < channels.length; i++) {
            const response = await fetch(
                `https://api.nike.com/product_feed/threads/v3/?filter=language(${language})&filter=marketplace(${region})&filter=channelId(${channels[i]})&filter=productInfo.merchProduct.styleColor(${sku})`,
                {method: "GET"}
            )
            const data = await response.json();
            //console.log(Array.from(data['objects']).length);
            data['objects'].length
            
            
            if (data['objects'].length > 0) {
                DP  = new Data_Process(data['objects'][0]);
                gtin_translation = DP.get_gtin_translation();
                break;
            }
            if (i == channels.length) {
                interaction.reply({ content: 'No Such Product in Nike Backend', ephemeral: true });
                return;
            }
        }

        
        let data = (await response.json())['objects'];
        data = await Array.from(data).map(elm => {
            return [gtin_translation[elm['gtin']],elm['level']]
        })
        
        interaction.reply({ content: data.sort((a, b) => a[0] - b[0]).join("\n") }); 
    }
}
