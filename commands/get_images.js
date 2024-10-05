const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const fetch  =  require("node-fetch");
const sharp = require('sharp');

async function areImagesIdentical(img1Buffer, img2Buffer) {
  try {
    const [img1, img2] = await Promise.all([
      sharp(img1Buffer).raw().toBuffer({ resolveWithObject: true }),
      sharp(img2Buffer).raw().toBuffer({ resolveWithObject: true })
    ]);

    if (
      img1.info.width !== img2.info.width ||
      img1.info.height !== img2.info.height ||
      img1.info.channels !== img2.info.channels
    ) {
      return false;
    }

    // Compare the pixel data
    const img1Data = img1.data;
    const img2Data = img2.data;

    return img1Data.equals(img2Data);
  } catch (error) {
    console.error('Error comparing images:', error);
    return false;
  }
}

async function findDuplicatesOfImage(imageBuffers) {
  const targetImageBuffer = imageBuffers[1];
  const duplicateIndices = [];

  for (let i = 0; i < imageBuffers.length; i++) {
    if (i !== 1) {
      const isDuplicate = await areImagesIdentical(targetImageBuffer, imageBuffers[i]);
      if (isDuplicate) {
        duplicateIndices.push(i);
      }
    }
  }

  return duplicateIndices;
}

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
              
            const duplicates = await findDuplicatesOfImage(imageBuffers);
            for (let i = 0; i < duplicates.length; i++) {
              imageBuffers.pop(duplicates[i]);
            }
            console.log('Duplicates of imageBuffers[1] found at indices:', duplicates);
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