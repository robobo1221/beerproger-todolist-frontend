import React, { useEffect, useState } from 'react'

import Card from 'react-bootstrap/Card';
import ImageUploader from './ImageUploader';
import apiAddress from '../config/api';

import {BiDotsHorizontalRounded, BiCheckCircle, BiTrash} from "react-icons/bi";
import {CgClose} from "react-icons/cg";
import eventBus from '../utility/EventBus';

const state = {
    id: -1,
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

        // Make sure the user always has to insert their name.
        if (props.item.name === '') {
            setEditMode(true);
        }

    }, [props.item.id, props.item.name, props.item.details, props.item.completed, props.item.image]);

    const handleCheckbox = async () => {
        // No need to wait here
        try {
            fetch(apiAddress + "/updateItem", {
                method: "POST",
                headers: {"content-type": "application/json"},
                body: JSON.stringify({ id: id, completed: !completed})
            })
            .then((response) => {
                if (!response.ok) {
                    const json = response.json();
                    eventBus.dispatch("error", {message: json.message, type:'danger'});
                    return;
                }
            });

            setItem({
                ...item,
                completed: !completed
            });
        } catch (e) {
            eventBus.dispatch("error", {message: "Failed to fetch. Is the backend server running?", type:'danger'});
        }
    }

    const deleteHandler = async () => {
        // Check if item is new item not registered in the database.

        if (id) {
            try {
                const response = await fetch(apiAddress + "/deleteItemById/" + String(id), {
                    method: "DELETE"
                });

                if (!response.ok) {
                    const data = await response.json();
                    eventBus.dispatch("error", {message: data.message, type:'danger'});
                    return;
                }
            } catch (e) {
                eventBus.dispatch("error", {message: "Failed to delete. Is the backend server running?", type:'danger'});
                return;
            }
        }
        
        props.deleteHandler(id);
    }

    const editHandler = async() => {
        if (name.trim() === '' && editMode) {
            eventBus.dispatch("error", {message: "Please fill in a name.", type:'danger'});
            return;
        }

        setEditMode(!editMode);
    }

    const uploadHandler = async(id) => {
        if (name.trim() === '') {
            eventBus.dispatch("error", {message: "Please fill in a name.", type:'danger'});
            return;
        }
        try {
            // Retrieve new Image
            const response = await fetch(apiAddress + "/getItemById/" + id);
            const data = await response.json();

            if (!response.ok) {
                eventBus.dispatch("error", {message: data.message, type:'danger'});
                return;
            }
            
            setEditMode(false);

            setItem({
                ...item,
                image: data.image
            });
        } catch (e) {
            eventBus.dispatch("error", {message: "Failed to get new image. Is the backend server running?", type:'danger'});
        }
    }

    const editTileHandler = (e) => {
        setItem({
            ...item,
            name: e.target.value
        });
    }

    const editDetailsHandler = (e) => {
        setItem({
            ...item,
            details: e.target.value
        });
    }

    const finishEdit = async () => {
        if (name === '') {
            eventBus.dispatch("error", {message: "Please fill in a name.", type:'danger'});
            return;
        }

        // Check if the the item is new.

        try {
            if (!id) {
                const response = await fetch(apiAddress + "/addItem", {
                    method: "POST",
                    headers: {"content-type": "application/json"},
                    body: JSON.stringify({ name: name, details: details, image: image})
                });
                const data = await response.json();

                if (!response.ok) {
                    eventBus.dispatch("error", {message: data.message, type:'danger'});
                    return;
                }

                setItem({
                    ...item,
                    id: data.id
                });

                props.addHandler({
                    ...item,
                    id: data.id
                }, props.listId);
            } else {
                const response = await fetch(apiAddress + "/updateItem", {
                    method: "POST",
                    headers: {"content-type": "application/json"},
                    body: JSON.stringify({ id: id, name: name, details: details})
                });

                if (!response.ok) {
                    const data = response.json();
                    eventBus.dispatch("error", {message: data.message, type:'danger'});
                    return;
                }
            }
        } catch (e) {
            eventBus.dispatch("error", {message: "Failed to fetch. Is the backend server running?", type:'danger'});
            return;
        }

        setEditMode(false);
    }

    const closeEdit = async () => {
        if (item.id) {
            try {
                const response = await fetch(apiAddress + "/getItemById/" + id);
                const data = await response.json();

                if (!response.ok) {
                    eventBus.dispatch("error", {message: data.message, type:'danger'});
                    return;
                }

                setItem(data);
            } catch (e) {
                eventBus.dispatch("error", {message: "Failed to fetch. Is the backend server running?", type:'danger'});
            }
        } else {
            deleteHandler();
        }

        setEditMode(false);
    }

    function renderImage() {
        return (editMode && id) ? 
        <ImageUploader item={item} uploadHandler={uploadHandler}></ImageUploader> :

        image ?
        <Card.Img variant="top" src={image} className="ItemImage"/> : <></>
    }

    function renderTitle() {
        return editMode ?
        <Card.Title>
            <input type="text" defaultValue={name} onChange={editTileHandler}></input>
        </Card.Title> :
        <Card.Title>{name}</Card.Title>
    }

    function renderDetails() {
        return editMode ? 
        <Card.Text>
            <textarea defaultValue={details} onChange={editDetailsHandler}></textarea>
        </Card.Text> :
        <Card.Text>{details}</Card.Text>;
    }

    function renderCheckbox() {
        return editMode ? <></> :
        <Card.Text>
        {/* <label for="completed"><b>Completed</b></label> */}
        <input type="checkbox" name="completed" className='checkboxCompleted' checked={completed} onChange={handleCheckbox}></input>
        </Card.Text>
    }

    function renderButtons() {
        return editMode ?
        <div className="ItemControl">
            <CgClose size={25} onClick={closeEdit} aria-label="Close" color="gray"></CgClose>
            <BiCheckCircle size={25} onClick={finishEdit} aria-label="Done" color="gray"></BiCheckCircle>
        </div>
        :
        <div className="ItemControl">
            <BiTrash size={25} onClick={deleteHandler} aria-label="Delete" color="gray"></BiTrash>
            <BiDotsHorizontalRounded size={25} onClick={editHandler} aria-label="Settings" color="gray"></BiDotsHorizontalRounded>
        </div>
    }

    return (
    <Card style={{ width: '18rem' }} className="m-2">
        <Card.Header className='ItemControl'>
            {renderTitle()}
            {renderCheckbox()}
        </Card.Header>
        <Card.Body>
            {renderImage()}
            {renderDetails()}
            {renderButtons()}
        </Card.Body>
    </Card>
    );
}
 
export default ListItem;