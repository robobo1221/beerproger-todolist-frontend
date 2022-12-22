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
        setEditMode(!editMode);
    }

    const uploadHandler = async(id) => {
        // Retrieve new Image
        const response = await fetch(apiAddress + "/getItemById/" + id);
        const data = await response.json();

        setEditMode(false);

        setItem({
            ...item,
            image: data.image
        });
    }

    function renderImage() {
        return editMode ? 
        <ImageUploader item={item} uploadHandler={uploadHandler}></ImageUploader> :

        image ?
        <Card.Img variant="top" src={image} className="ItemImage"/> : <></>
    }

    function renderTitle() {
        return editMode ?
        <Card.Title>
            <input type="text" defaultValue={name}></input>
        </Card.Title> :
        <Card.Title>{name}</Card.Title>
    }

    function renderDetails() {
        return editMode ? 
        <Card.Text>
            <textarea defaultValue={details}></textarea>
        </Card.Text> :
        <Card.Text>{details}</Card.Text>;
    }

    function renderCheckbox() {
        return (
        <Card.Text>
        <label for="completed"><b>Completed</b></label>
        <input type="checkbox" name="completed" checked={completed} onChange={handleCheckbox}></input>
        </Card.Text>
        )
    }

    return (
    <Card style={{ width: '18rem' }} className="m-2" onDoubleClick={editHandler}>
        <Card.Header>
            {renderTitle()}
        </Card.Header>
        <Card.Body>
            {renderImage()}
            {renderDetails()}
            {renderCheckbox()}
            <CloseButton className='CloseButton' onClick={deleteHandler} aria-label="close"></CloseButton>
        </Card.Body>
    </Card>
    );
}
 
export default ListItem;