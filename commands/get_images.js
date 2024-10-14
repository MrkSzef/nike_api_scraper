const { SlashCommandBuilder } = require("discord.js");
const { get_images } = require('../self-modules/image-generator');
const { skuValidation } = require('../self-modules/validators');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('get_images')
        .setDescription('Get All Images Of Product')
        .addStringOption(option => option
            .setName('sku')
            .setDescription("Provide Product SKU")
            .setRequired(true))
        .addStringOption(option => option
            .setName('photo_range')
            .setDescription("Choose Photo Range")
            .setRequired(true)
            .setChoices(
                { name: "Full", value: "abcdefghijklmnopqrstuvwxyz" },
                { name: "Limited", value: "abcdefhkpz" },
                { name: "Minimal", value: "abcd" }
            )
        ),
    async execute(interaction) {
        const sku = interaction.options.getString('sku');
        const photo_range = interaction.options.getString('photo_range');
        
        let responses = skuValidation(sku,4).map((el) => {return get_images(el,photo_range)});
        console.log(responses);
        
        responses = await Promise.all(responses).then((res) => {return res});
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