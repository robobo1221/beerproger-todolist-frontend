import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import apiAddress from '../config/api';
import eventBus from '../utility/EventBus';

const ImageUploader = (props) => {
    const [image, setImage] = useState('');
    const item = props.item;

    const imageHandler = (e) => {
        const sizeInMb = e.target.files[0].size / 1024 / 1024;
        
        if (sizeInMb >= 2) {
            eventBus.dispatch("error", {message: "File can not be greater than 2mb!", type:'danger'});
            return;
        }

        setImage(e.target.files[0]);
    }

    const uploadHandler = async () => {
        if (image === '') {
            return;
        }

        const formData = new FormData();
        formData.append('image', image);
        formData.append('id', item.id);

        try {
            const response = await fetch(apiAddress + "/updateItem", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                const json = response.json();
                eventBus.dispatch("error", {message: json.message, type:'danger'});
                return;
            }
        } catch {
            eventBus.dispatch("error", {message: "Failed to upload image. Is the backend server running?", type:'danger'});
            return;
        }

        props.uploadHandler(item.id);
    }

    return ( 
        <div className="fileUploader">
            <input type="file" id="image" accept="image/*" onChange={imageHandler}></input>
            <Button variant="danger" onClick={uploadHandler} className="mt-1 mb-1">Upload image</Button>
        </div>
    );
}

export default ImageUploader;