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
        let responses = skuValidation(sku,4).map((el) => {return get_images(el)});
        responses = await Promise.all(responses).then((res) => {return res})
        console.log(responses);
        
        interaction.reply({ files: responses });


        return;
        if (response !== FetchError) {
          interaction.reply({ files: [responses] });
          return;
        }
        console.log(response);
        
        interaction.reply({ content: 'No Images Found', ephemeral: true });
    }
}