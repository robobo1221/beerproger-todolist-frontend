import React, { Component, useState } from 'react';
import Button from 'react-bootstrap/Button';
import apiAddress from '../config/api';

const ImageUploader = (props) => {
    const [image, setImage] = useState('');
    const item = props.item;

    const imageHandler = (e) => {
        console.log(e.target.files[0]);
        setImage(e.target.files[0]);
    }

    const uploadHandler = async () => {
        if (image === '') {
            return;
        }

        const formData = new FormData();
        formData.append('image', image);
        formData.append('id', item.id);

        await fetch(apiAddress + "/updateItem", {
            method: "POST",
            body: formData
        });

        props.uploadHandler(item.id);
    }

    return ( 
        <div className="fileUploader">
            <input type="file" id="image" accept="image/*" onChange={imageHandler}></input>
            <Button variant="secondary" onClick={uploadHandler}>Upload image</Button>
        </div>
    );
}

export default ImageUploader;