const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const fetch  =  require("node-fetch");
const sharp = require('sharp');


const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
var IMAGE_API_URLS = [];
for (let index = 0; index < alphabet.length; index++) {
    IMAGE_API_URLS.push((sku)=>{return`https://images.nike.com/is/image/DotCom/${sku.replace("-","_")}_${alphabet[index].toUpperCase()}_PREM?fmt=png-alpha`});
}

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
        try {
            // Fetch images from the URLs
            const imageBuffers = await Promise.all(IMAGE_API_URLS.map(async (url) => {
                const response = await fetch(url(sku));
                if (!response.ok) throw new Error(`Failed to fetch image from ${url}`);
                const arrayBuffer = await response.arrayBuffer();
                return Buffer.from(arrayBuffer);
              }));
      
            const combinedImage = await sharp({
              create: {
                width: 400*7,
                height: 400*4,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 0 }
              }
            })
            .composite(imageBuffers.map((buffer, index) => ({
                input: buffer,
                left: Math.floor(index/4) * 400,
                top: 400 * (index%4),
              })))
              .png()
              .toBuffer();
        
              const attachment = new AttachmentBuilder(combinedImage, { name: 'image.png' });
        
              // Reply to the interaction with the combined image
              await interaction.reply({ files: [attachment] });
            } catch (error) {
              console.error('Error fetching images');
              await interaction.reply({ ephemeral: true });
            }
    }
}