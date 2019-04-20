import React from 'react';

export default (props) => {
    return (
        <img src={props.url}  width="100%" onError={(event) => {event.target.style.display = 'none';}} />
    )
}