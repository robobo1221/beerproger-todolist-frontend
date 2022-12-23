import React, { useEffect, useState } from 'react'
import apiAddress from '../config/api';
import ListItem from './ListItem';
import Button from 'react-bootstrap/Button';
import {BiMessageSquareAdd} from "react-icons/bi";
import eventBus from '../utility/EventBus';

const state = {
    fetched: false,
    items: []
}

const newItem = {
    name: "",
    details: "",
    completed: 0,
    image: null
}

const List = (props) => {
    const [list, setList] = useState(state)
    const {fetched, items} = list

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(apiAddress + "/getList");
            const data = await response.json();

            if (!response.ok) {
                eventBus.dispatch("error", {message: data.message, type:'danger'});
                return;
            }
        
            setList({
                fetched: true,
                items: data
            });
        } catch (e) {
            eventBus.dispatch("error", {message: "Failed to fetch. Is the backend server running?", type:'danger'});
        }
    }

    const deleteItem = async (id) => {
        const newItems = items.filter(listItem => listItem.id !== id);
        setList({
            ...list,
            items: newItems
        });
    }

    const addItem = (item, listId) => {
        items[listId] = item;

        setList({
            ...list,
            items: items
        })
    }

    const createItem = () => {
        items.push(newItem);

        setList({
            ...list,
            items: items
        });
    }
    
    if (!fetched) {
        return <div>Loading...</div>
    }

        return items.length !== 0 ?
        (
            <div className='List d-flex justify-content-center flex-wrap'>
            {
                items.map((item, index) => (
                    <ListItem 
                    item={item} addHandler={addItem}
                    deleteHandler={deleteItem}
                    key={index}
                    listId={index}></ListItem>
                ))
            }

            <BiMessageSquareAdd className="Buttons" size={30} onClick={createItem}></BiMessageSquareAdd>
            </div>
        )
        :
        
        <Button variant="danger" onClick={createItem}>Make first item!</Button>
}
 
export default List;