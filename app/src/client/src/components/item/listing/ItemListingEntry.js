import React from "react";
import Price from "./Price";
import ItemImage from "../ItemImage";
import "../../../styles/item/listing/ItemListingEntry.css";
import ItemCategoryTab from "./ItemCategoryTab";

export default (props) => {
    return (
        <li className="item-list-entry-container">
            <div className="item-list-entry-details">
                <div className="item-list-entry-image">
                    <ItemImage url={`/images/${props.data.item.id}.png`} />
                </div>
                <div>
                    <div>
                        <h2 className="item-list-entry-name">{props.data.item.name}</h2>
                        <ItemCategoryTab name={props.data.item.category.name} />
                    </div>
                    <p className="item-list-entry-description">{props.data.item.description}</p>
                    <Price amount={props.data.item.price} type="USD" />
                    <p>
                        Sold by <b>{props.data.outlets[0].name} - {props.data.restaurant.name}</b>
                    </p>
                </div>
                <div className="clear-both"></div>
            </div>
            <div className="item-operation-bar">
                <button className="item-operation-btn">Add to Cart</button>
            </div>
        </li>
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
