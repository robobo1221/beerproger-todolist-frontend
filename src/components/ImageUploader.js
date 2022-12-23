import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import apiAddress from '../config/api';
import eventBus from '../utility/EventBus';
import { BiCloudUpload } from 'react-icons/bi'

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
            <BiCloudUpload className="Buttons mt-1 mb-3" color="gray" size={30} onClick={uploadHandler}></BiCloudUpload>
        </div>
    );
}

export default ImageUploader;