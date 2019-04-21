const ItemModel = require("../models/ItemModel");
const RestaurantItemCategoryModel = require("../models/RestaurantItemCategoryModel");
const RestaurantModel = require("../models/RestaurantModel");
const OutletModel = require("../models/OutletModel");

const DBUtil = require("../utils/DBUtil");

const OUTLET_TABLE = require("../tables/OutletTable");
const CATEGORY_TABLE = require('../tables/RestaurantItemCategoryTable');
const RESTAURANT_TABLE = require('../tables/RestaurantTable');
const ITEM_TABLE = require("../tables/ItemTable");
const ITEMOUTLET_TABLE = require("../tables/ItemOutletTable");

class ItemListingHandler {
    constructor() {
    }

    fetchAll(filter) {
        let filterQuery = this._getFilterQuery(filter);
        let offset = 0;
        let numberOfRows = 10;
        if (filter && filter.page) {
            offset = isNaN(filter.page) ? 0 : parseInt(filter.page)-1; // filter page is 1-indexed but limit query is 0-indexed
            offset = (offset < 0) ? 0 : offset;
        }
        if (filter && filter.count) {
            numberOfRows = (!filter.count || isNaN(filter.count)) ? 10 : parseInt(filter.count);
        }
        const pagingQuery = `LIMIT ${offset * numberOfRows}, ${numberOfRows}`;
        const dbUtil = new DBUtil();
        const selectQuery = `SELECT * FROM ${ITEMOUTLET_TABLE.NAME} INNER JOIN ${OUTLET_TABLE.NAME} ON ${ITEMOUTLET_TABLE.NAME}.${ITEMOUTLET_TABLE.COLUMNS.OUTLET}=${OUTLET_TABLE.NAME}.${OUTLET_TABLE.COLUMNS.ID} INNER JOIN ${ITEM_TABLE.NAME} ON ${ITEMOUTLET_TABLE.NAME}.${ITEMOUTLET_TABLE.COLUMNS.ITEM} = ${ITEM_TABLE.NAME}.${ITEM_TABLE.COLUMNS.ID} INNER JOIN ${CATEGORY_TABLE.NAME} ON ${ITEM_TABLE.NAME}.${ITEM_TABLE.COLUMNS.CATEGORY} = ${CATEGORY_TABLE.NAME}.${CATEGORY_TABLE.COLUMNS.ID} INNER JOIN ${RESTAURANT_TABLE.NAME} ON ${RESTAURANT_TABLE.NAME}.${RESTAURANT_TABLE.COLUMNS.ID} = ${OUTLET_TABLE.NAME}.${OUTLET_TABLE.COLUMNS.RESTAURANT} ${filterQuery} ${pagingQuery}`;
        return dbUtil.getConnection().then(function (connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.query(connection, selectQuery);
        }).then(function (result) {
            return result.results.map(function (item) {
                return {
                    item: new ItemModel(item[ITEM_TABLE.COLUMNS.ID], item[ITEM_TABLE.COLUMNS.NAME], item[ITEM_TABLE.COLUMNS.DESCRIPTION], item[ITEM_TABLE.COLUMNS.PRICE], new RestaurantItemCategoryModel(item[CATEGORY_TABLE.COLUMNS.ID], item[CATEGORY_TABLE.COLUMNS.NAME])),
                    restaurant: new RestaurantModel(item[RESTAURANT_TABLE.COLUMNS.ID], item[RESTAURANT_TABLE.COLUMNS.NAME], item[RESTAURANT_TABLE.COLUMNS.CONTACT], item[RESTAURANT_TABLE.COLUMNS.EMAIL], item[RESTAURANT_TABLE.COLUMNS.WEBSITE]),
                    outlets: [new OutletModel(item[OUTLET_TABLE.COLUMNS.ID], item[OUTLET_TABLE.COLUMNS.NAME], null, null, null)]
                }
            });
        });
    }

    _getFilterQuery(filter) {
        let filterQuery = "";
        if (filter) {
            if (filter.item || filter.category) {
                filterQuery = "WHERE ";
                let itemQuery = "", categoryQuery = "";
                if (filter.item) {
                    itemQuery = `${ITEM_TABLE.NAME}.${ITEM_TABLE.COLUMNS.NAME} LIKE '%${filter.item}%'`;
                }
                if (filter.category) {
                    categoryQuery = `${CATEGORY_TABLE.NAME}.${CATEGORY_TABLE.COLUMNS.ID} = ${filter.category}`;
                }
                if (filter.item && filter.category) {
                    filterQuery += `${itemQuery} AND ${categoryQuery}`;
                } else if (filter.item) {
                    filterQuery += `${itemQuery}`;
                } else if (filter.category) {
                    filterQuery += `${categoryQuery}`;
                }
            }
        }
        return filterQuery;
    }

    hasMoreItems(filter) {
        let filterQuery = this._getFilterQuery(filter);
        let offset = 1;
        let numberOfRows = 10;
        if (filter && filter.page) {
            offset = isNaN(filter.page) ? 1 : parseInt(filter.page); // filter page is 1-indexed but limit query is 0-indexed
            offset = (offset < 0) ? 0 : offset;
        }
        if (filter && filter.count) {
            numberOfRows = (!filter.count || isNaN(filter.count)) ? 10 : parseInt(filter.count);
        }
        const pagingQuery = `LIMIT ${offset * numberOfRows}, ${numberOfRows}`;
        const dbUtil = new DBUtil();
        const selectQuery = `SELECT * FROM ${ITEMOUTLET_TABLE.NAME} INNER JOIN ${OUTLET_TABLE.NAME} ON ${ITEMOUTLET_TABLE.NAME}.${ITEMOUTLET_TABLE.COLUMNS.OUTLET}=${OUTLET_TABLE.NAME}.${OUTLET_TABLE.COLUMNS.ID} INNER JOIN ${ITEM_TABLE.NAME} ON ${ITEMOUTLET_TABLE.NAME}.${ITEMOUTLET_TABLE.COLUMNS.ITEM} = ${ITEM_TABLE.NAME}.${ITEM_TABLE.COLUMNS.ID} INNER JOIN ${CATEGORY_TABLE.NAME} ON ${ITEM_TABLE.NAME}.${ITEM_TABLE.COLUMNS.CATEGORY} = ${CATEGORY_TABLE.NAME}.${CATEGORY_TABLE.COLUMNS.ID} INNER JOIN ${RESTAURANT_TABLE.NAME} ON ${RESTAURANT_TABLE.NAME}.${RESTAURANT_TABLE.COLUMNS.ID} = ${OUTLET_TABLE.NAME}.${OUTLET_TABLE.COLUMNS.RESTAURANT} ${filterQuery} ${pagingQuery}`;
        return dbUtil.getConnection().then(function (connection) {
            if (!connection) {
                throw Error('connection not available.');
            }
            return dbUtil.query(connection, selectQuery);
        }).then(function (result) {
            let pagingData = {
                hasMore : result.results.length > 0
            }
            if (pagingData.hasMore) {
                pagingData.next = offset + 1;
                pagingData.rowsPerPage = numberOfRows;
            }
            return pagingData;
        });
    }
}

module.exports = ItemListingHandler;