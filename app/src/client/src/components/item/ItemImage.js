import React from 'react';
import "../../styles/item/ItemImage.css";

class ItemImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isImageAvailable : true
        }
    }
    
    render() {
        const self = this;
        if (this.state.isImageAvailable) {
            return (       
                <img alt={this.props.url} src={this.props.url} width="100%" onError={(event) => {self.setState({isImageAvailable : false})}} />
            )
        } else {
            return <div className="image-unavailable">Image Unavailable </div>
        }
    }
}
export default ItemImage;