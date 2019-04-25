class OrderUtil {

    constructor() {
    }

    static calculateOrderAmount(items) {
        const sub_total = items.reduce(function(sum, item) {
            return sum + parseFloat(item.price * item.quantity)
        }, 0);
        const sales_tax = parseFloat((sub_total * (0.0825)).toFixed(2));
        return {
            sub_total : sub_total,
            sales_tax : sales_tax,
            total : (sub_total + sales_tax)
        }
    }
}

module.exports = OrderUtil;