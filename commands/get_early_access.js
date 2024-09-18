const { SlashCommandBuilder,EmbedBuilder } = require("discord.js");
const { execute } = require("./get_item");
const { channels, region, language } = require("../config.json");
const { Data_Process } = require("../self-modules/scraper-main-functions");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("get_ea")
        .setDescription("Get upcoming early access products from your region"),
    async execute(interaction){
        let items_count = 0;
        const Embed = new EmbedBuilder()
            .setColor(0x307894)
            .setTitle("Upcoming Early Access Products")
            .setTimestamp()
            .setFooter({ text: 'Made By marekszef'});
        for (let i = 0; i < channels.length; i++) {
            const data = await fetch(
                `https://api.nike.com/product_feed/threads/v3/?anchor=0&count=100
                &filter=marketplace(${region})
                &filter=language(${language})
                &filter=channelId(${channels[i]})
                &filter=exclusiveAccess(true)&filter=upcoming(true)
                &sort=effectiveStartSellDateAsc`
            ).then(res => {return res.json()})

            try {
                data = Array.from(data['objects'])
                data.forEach(element => {
                        const DP = new Data_Process(element);
                        Embed.addFields({ name: DP.get_title(), value: DP.get_sku(),inline:true});
                        items_count++;
                });
                
            } catch (error) {}
        }
        if (items_count == 0){
            Embed.setFields({ name: "No Early Access Products", value: "Try Again Later 😎🔥",inline:true});
        }
        await interaction.reply({ embeds: [Embed] });

        

    }
}
