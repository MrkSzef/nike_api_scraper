const { SlashCommandBuilder } = require("discord.js");
const { FetchError } = require("node-fetch");
const { get_images } = require('../self-modules/image-generator');
const { skuValidation } = require('../self-modules/validators');



module.exports = {
    data: new SlashCommandBuilder()
        .setName('get_images')
        .addStringOption(option => option
            .setName('sku')
            .setDescription("Provide Product SKU")
            .setRequired(true))
        .setDescription('Get All Images Of Product'),
    async execute(interaction) {
        const sku = interaction.options.getString('sku');
        const response = await get_images(skuValidation(sku,1));
        if (response !== FetchError) {
          interaction.reply({ files: [response] });
          return;
        }
        console.log(response);
        
        interaction.reply({ content: 'No Images Found', ephemeral: true });
    }
}