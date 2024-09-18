const { SlashCommandBuilder, EmbedBuilder, Options, inlineCode, channelLink  } = require('discord.js');
const { Data_Process } = require('../self-modules/scraper-main-functions');
const fetch  =  require("node-fetch");
const { region, language, channels } = require('../config.json');



module.exports = {
	data: new SlashCommandBuilder()
		.setName('check')
		.addStringOption(option => option
			.setName('sku')
			.setDescription("Provide Product SKU")
			.setRequired(true))
		.setDescription('😎'),
	async execute(interaction) {
		let number_of_requests = 0;
		const sku = interaction.options.getString('sku');//16134d36-74f2-11ea-bc55-00242ac13000  d9a5bc42-4b9c-4976-858a-f159cf99c647
		var link = "";
		var response = "";
		for(let index = 0; index < channels.length; index++){
			link = `https://api.nike.com/product_feed/threads/v3/?filter=language(${language})&filter=marketplace(${region})&filter=channelId(${channels[index]})&filter=productInfo.merchProduct.styleColor(${sku})`
			response = await fetch(link,{method: 'GET', headers:{'authority': 'api.nike.com','accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9','accept-language': 'pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7','cache-control': 'max-age=0','sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"','sec-ch-ua-mobile': '?0','sec-ch-ua-platform': '"Windows"','sec-fetch-dest': 'document','sec-fetch-mode': 'navigate','sec-fetch-site': 'none','sec-fetch-user': '?1','upgrade-insecure-requests': '1','user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36'}});
			response = await response.json();
			if(response['pages']['totalResources']>0){
				number_of_requests = index;
				break;
			};
		};
		let DP = new Data_Process(response["objects"][0]);
		let Sizes = DP.get_sizes()

		const Embed = new EmbedBuilder()
		.setColor(0x307894)
		.setTitle(DP.get_title())
		.setAuthor({ name: DP.get_sku()})
		.setDescription(
			'```ansi\n'
			+DP.get_status()
			+DP.get_price()
			+DP.get_full_region()
			+"\n\n[1;2m---- Other Info ----[0m"
			+DP.get_exclusive_acces_state()
			+DP.get_drop_date()
			+DP.get_drop_method()
			+DP.get_IPO()
			+DP.get_promotion_status()
			+DP.get_size_range()
			+DP.get_sizing_prefix()
			+'```'
		)
		.setThumbnail('https://images.nike.com/is/image/DotCom/'+sku.replace('-','_')+'_A_PREM?fmt=png-alpha')
		.setTimestamp()
		.setFooter({ text: 'Made By marekszef'});
		for(let i = 0; i < Sizes.length; i++){
			Embed.addFields({ name: 'Sizes:', value: "```ansi\n"+Sizes[i].join("\n")+"```",inline:true});
		};
		if (toString(response["objects"][0]['publishedContent']['properties']['seo']['slug']).endsWith(response["objects"][0]['productInfo'][0]['merchProduct']['productRollup']['key'])){
			Embed.addFields({name:"Links: ", value: `| [NIKE WEB](https://www.nike.com/${language}/t/sperka/${sku}) |`})
		}
		else{
			Embed.addFields({name:"Links: ", value: `| [SNKRS WEB](https://www.nike.com/${language}/launch/r/${sku}) |`})
		};
		await interaction.reply({embeds: [Embed]});
	},
};


