class Data_Process {
    constructor(dane) {
    this.dane = dane;
		try{
			this.start_date = new Date(dane[0]["productInfo"][0]["launchView"]["startEntryDate"]);
			this.start_date.setHours(this.start_date.getHours()+1)
			console.log(this.start_date);
			this.stop_date = new Date(dane[0]["productInfo"][0]["launchView"]["stopEntryDate"]);
		}
		catch{}
	}


	add_zero(arg){
		if(arg.toString().length === 1){
			return "0".concat(arg.toString());
		}
		else{
			return arg.toString();
		}
	};

	
	
	
    get_title(){
		try{return this.dane[0]["productInfo"][0]["productContent"]["title"]+"\n"+this.dane[0]["productInfo"][0]["productContent"]["colorDescription"];}
		catch{return this.dane[0]["productInfo"][0]["merchProduct"]["styleColor"];}
	}
	get_sku(){
		try{return this.dane[0]["productInfo"][0]["merchProduct"]["styleColor"];}
		catch{return "No Data";}
	}
	get_sizes(){
		try{
			let gtins = {};
			let stock = [];
			let LEVEL = ""
			for (let index = 0; index < this.dane[0]["productInfo"][0]["availableGtins"].length; index++) {gtins[this.dane[0]["productInfo"][0]["availableGtins"][index]["gtin"]] = this.dane[0]["productInfo"][0]["availableGtins"][index]["level"];};
			for (let index = 0; index < this.dane[0]["productInfo"][0]["skus"].length; index++) {
				
				try
				{
					LEVEL = gtins[this.dane[0]["productInfo"][0]["skus"][index]["gtin"]]
					LEVEL=LEVEL
						.replace("LOW","[2;31mLOW[0m")
						.replace("MEDIUM","[2;33mMEDIUM[0m")
						.replace("HIGH","[2;32mHIGH[0m")
						.replace("OOS","[2;30mOOS[0m")
					stock[index] = ["[1;2m"+this.dane[0]["productInfo"][0]["skus"][index]["countrySpecifications"][0]["localizedSize"]+"[0m",LEVEL].join(`${" ".repeat(5-(this.dane[0]["productInfo"][0]["skus"][index]["countrySpecifications"][0]["localizedSize"]).length)} | `);
				}
				catch (error)
				{
					stock[index] = ["[1;2m"+this.dane[0]["productInfo"][0]["skus"][index]["countrySpecifications"][0]["localizedSize"]+"[0m","[2;30mOOS[0m"].join(`${" ".repeat(5-(this.dane[0]["productInfo"][0]["skus"][index]["countrySpecifications"][0]["localizedSize"]).length)} | `);
				};
			}
			if (stock.length < 10){return [stock];
			}
			else
			{
				if(stock.length%2 == 0)
				{
					return [stock.slice(0,(stock.length/2>>0)),stock.slice((stock.length/2>>0))];	
				}
				else
				{
					return [stock.slice(0,(stock.length/2>>0)+1),stock.slice((stock.length/2>>0)+1)];	
				}	
			}
		}
		catch  (error) {
			console.log(error);
		}
	}
	get_status(){
		try{return "\n[1;2mStatus:[0m "+this.dane[0]["productInfo"][0]["merchProduct"]["status"]}
		catch{return ""}
	};
	get_price(){
		try{return "\n[1;2mPrice:[0m "+this.dane[0]["productInfo"][0]["merchPrice"]["currentPrice"]+" "+this.dane[0]["productInfo"][0]["merchPrice"]["currency"]}
		catch{return ""}
	};
	get_full_region(){
		try{return "\n[1;2mRegion:[0m "+this.dane[0]["marketplace"]+"-"+this.dane[0]["language"]}
		catch{return ""}
	};
	get_IPO(){
		try{return "\n[1;2mItems Per Order:[0m "+this.dane[0]["productInfo"][0]["merchProduct"]["quantityLimit"]}
		catch{return ""}
	};
	get_promotion_status(){
		try{
		if (this.dane[0]['productInfo'][0]['merchPrice']['promoExclusions'].includes("TRUE")){
			return '\n[1;2mPromo Codes:[0m Not Working ❌'
		}
		else if (this.dane[0]['productInfo'][0]['merchPrice']['promoInclusions'].includes("EverGreen Exclusions")){
			return '\n[1;2mPromo Codes:[0m Not Working ❌'
		}
		else if (this.dane[0]['productInfo'][0]['merchPrice']['promoInclusions'].includes("AF1 AJ1 Exclusion")){
			return '\n[1;2mPromo Codes:[0m Not Working ❌'
		}
		else{
			return '\n[1;2mPromo Codes:[0m Working ✅'
		}
		}
		catch (error){
			console.log(error)
			return ''
		}
	};
	get_size_range(){
		try{return "\n[1;2mSize Range:[0m "+this.dane[0]["productInfo"][0]["skus"][0]["countrySpecifications"][0]["localizedSize"]+" - "+this.dane[0]["productInfo"][0]["skus"].reverse()[0]["countrySpecifications"][0]["localizedSize"]
	}
		catch{
			return "";
		}
	};
	get_exclusive_acces_state(){
		try{
			return "\n[1;2mEA:[0m "+this.dane[0]['productInfo'][0]['merchProduct']['exclusiveAccess'];
		}
		catch{
			return "";
		}
	};
	get_sizing_prefix(){
		try{
			return "\n[1;2mSize Prefix:[0m "+this.dane[0]["productInfo"][0]["skus"][0]["countrySpecifications"][0]["localizedSizePrefix"]
		}
		catch{
			return "";
		}
	};
	get_drop_date(){
		try{
			return "\n[1;2mDrop Date:[0m "+this.start_date.getUTCFullYear()+"-"+this.add_zero(this.start_date.getUTCMonth())+"-"+this.add_zero(this.start_date.getUTCDate())+" "+this.add_zero(this.start_date.getUTCHours())+":"+this.add_zero(this.start_date.getUTCMinutes())+":"+this.add_zero(this.start_date.getUTCSeconds())+" UTC+0";
		}
		catch {
			return "";
		}
	};
	get_drop_method(){
		try{
			
			return "\n[1;2mDrop Type:[0m "+this.dane[0]["productInfo"][0]["launchView"]["method"]
		}
		catch{
			return "";
		}
	};
}


module.exports = {Data_Process};
