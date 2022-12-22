import React, { useEffect, useState } from 'react'

import Card from 'react-bootstrap/Card';
import CloseButton from 'react-bootstrap/CloseButton';
import ImageUploader from './ImageUploader';
import apiAddress from '../config/api';

const state = {
    id: 0,
    name: "",
    details: "",
    completed: false,
    image: null
}

const ListItem = (props) => {
    const [item, setItem] = useState(state)
    const [editMode, setEditMode] = useState(false)
    const {id, name, details, completed, image} = item

    useEffect(() => {
        setItem({
            id: props.item.id,
            name: props.item.name,
            details: props.item.details,
            completed: props.item.completed,
            image: props.item.image
        });
    }, []);

    const handleCheckbox = () => {
        props.checkboxHandler(props.item.id, !completed);

        setItem({
            ...item,
            completed: !completed
        });
    }

    const deleteHandler = () => {
        props.deleteHandler(props.item.id);
    }

    const editHandler = () => {
        setEditMode(true);
    }

    const uploadHandler = async(id) => {
        // Retrieve new Image
        const response = await fetch(apiAddress + "/getItemById/" + id);
        const data = await response.json();

        setItem({
            ...item,
            image: data.image
        });
    }

    function renderImage() {
        if (image === null) {
            return (
                <ImageUploader item={item} uploadHandler={uploadHandler}></ImageUploader>
            );
        }

        return <Card.Img variant="top" src={image} className="ItemImage"/>
    } 

    return (
    <Card style={{ width: '18rem' }} className="m-2" onDoubleClick={editHandler}>
        <Card.Header>
            <Card.Title>{name}</Card.Title>
        </Card.Header>
        <Card.Body>
            {renderImage()}
            <Card.Text>{details}</Card.Text>
            <Card.Text>
            Done <input type="checkbox" checked={completed} onChange={handleCheckbox}></input>
            </Card.Text>
            <CloseButton className='CloseButton' onClick={deleteHandler} aria-label="close"></CloseButton>
        </Card.Body>
    </Card>
    );
}
 
export default ListItem;