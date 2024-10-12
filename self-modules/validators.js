function skuValidation(sku,limit = 5) {
    const regexResult = sku.match(/[^0-9]{2}\d{4}-\d{3}/g) ?? [];
    if (regexResult.length > 0 && regexResult.length <= limit) {
        return regexResult.map((el) => {return el.toUpperCase()});
    }
    return [];
}




module.exports = {skuValidation};
