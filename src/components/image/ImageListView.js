import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

export default function ImageListView(props) {

    function getContentType(imageType) {
        switch (imageType) {
            case "PNG":
                return "image/png"
            //todo add other cases
            default:
                return "image/png"
        }
    }

    function getEncoding(encoding) {
        switch (encoding) {
            case "Base64":
                return "base64"
            //todo add other cases
            default:
                return "base64"
        }
    }

    function getBase64URI(image) {
        return `data:${getContentType(image.imageType)};${getEncoding(image.encoding)},${image.nodeValue}`
    }

    return (
        <ImageList sx={{ width: "100%" }} cols={3} rowHeight={164}>
            {props.images.map((image, index) => (
                <ImageListItem key={index}>
                    <img
                        src={getBase64URI(image)}
                        loading="lazy"
                        alt={image["xml:id"]}
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );
}
