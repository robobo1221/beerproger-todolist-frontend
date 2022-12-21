import React, { useEffect, useState } from 'react'

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CloseButton from 'react-bootstrap/CloseButton';

const state = {
    name: "",
    details: "",
    completed: false,
    image: null
}

const ListItem = (props) => {
    const [item, setItem] = useState(state)
    const [editMode, setEditMode] = useState(false)
    const {name, details, completed, image} = item

    useEffect(() => {
        setItem({
            name: props.item.name,
            details: props.item.details,
            completed: props.item.completed,
            image: props.item.image
        });
    }, []);

    const handleCheckbox = () => {
        props.checkboxHandler(props.item.id, !item.completed);

        setItem({
            ...item,
            completed: !item.completed
        });
    }

    const uploadImageHandler = () => {

    }

    const deleteHandler = () => {
        props.deleteHandler(props.item.id);
    }

    const editHandler = () => {
        setEditMode(true);
    }

    function renderImage() {
        if (image === null) {
            return (
                <Button variant="secondary" onClick={uploadImageHandler}>Upload image</Button>
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