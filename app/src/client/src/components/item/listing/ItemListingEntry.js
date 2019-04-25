import React from "react";
import Price from "../../commons/Price";
import ItemImage from "../ItemImage";
import "../../../styles/item/listing/ItemListingEntry.css";
import ItemCategoryTab from "./ItemCategoryTab";

export default (props) => {
    let seller = "";
    if (props.data.outlets && props.data.outlets.length && props.data.restaurant && props.data.restaurant.name) {
        seller = <span>Sold by <b>{props.data.outlets[0].name} - {props.data.restaurant.name}</b></span>
    }
    return (
        <div className="item-list-entry-details">
            <div className="item-list-entry-image">
                <ItemImage url={`/images/${props.data.item.image}`} />
            </div>
            <div>
                <div>
                    <h2 className="item-list-entry-name">{props.data.item.name}</h2>
                    <ItemCategoryTab name={props.data.item.category.name} />
                </div>
                <p className="item-list-entry-description">{props.data.item.description}</p>
                <Price amount={props.data.item.price} type="USD" />
                <p>
                    {seller}
                </p>
            </div>
            <div className="clear-both"></div>
        </div>
    )
}



// {
//     "item": {
//         "id":5,
//         "name":"Some",
//         "description":"descript",
//         "price":3.33,
//         "category":{
//             "id":1,
//             "name":"Italian"}
//         },
//         "restaurant":{
//             "id":2,
//             "name":"Subway",
//             "contact":1234567890,
//             "email":"contact@subway.edu",
//             "website":"http://subway.com"
//         },
//         "outlets":[
//             {
//                 "id":1,
//                 "name":"Lennox Center"
//             }
//         ]
//     }
// }
