const { SlashCommandBuilder, EmbedBuilder, Options, inlineCode, channelLink, Embed  } = require('discord.js');
const { Data_Process } = require('../self-modules/scraper-main-functions');
let { stores } = require('../data/stores.json')
const { region, language, channels } = require('../config.json');

// Setting Up Store List
stores = stores.slice(0,24);
var reverse_store_list = {};
for (let i = 0; i < stores.length; i++) {
    reverse_store_list[stores[i]["value"]] = stores[i]["name"];
}


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
        let gtin_translation;
        let DP;

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

        
        var data = (await response.json())['objects'];
        data = await Array.from(data).map(elm => {
            return [gtin_translation[elm['gtin']],elm['level']]
        }).sort((a, b) => a[0] - b[0])
        
        // Process Size Data And Create Embed
        
        
        const Embed = new EmbedBuilder()
        .setColor(0x307894)
        .setTitle(DP.get_title())
        .setAuthor({ name: DP.get_sku()})
        .setDescription(
            '```ansi\n'
            +DP.get_price()
            +DP.get_full_region()
            +`\n[1;2mStore:[0m ${reverse_store_list[store]}`
            +"```"
        )
        data = await data.map(elm => [elm[0],elm[1]
            .replace("LOW","[2;31mLOW[0m")
            .replace("MEDIUM","[2;33mMEDIUM[0m")
            .replace("HIGH","[2;32mHIGH[0m")
            .replace("OOS","[2;30mOOS[0m")].join(": ")
        );
        
        if (data.length > 14) {
            const dl = Math.ceil(data.length / 2);
            Embed.addFields({ name: "Sizes", value: '```ansi\n'+data.slice(0, dl).join("\n")+'```',inline:true});
            Embed.addFields({ name: "Sizes", value: '```ansi\n'+data.slice(dl,data.length).join("\n")+'```',inline:true});
        }
        else if (data.length <= 14) {
            Embed.addFields({ name: "Sizes", value: '```ansi\n'+data.join("\n")+'```',inline:true});
        }
        

        interaction.reply({ embeds: [Embed] }); 
    }
}
