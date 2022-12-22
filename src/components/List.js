import React, { useEffect, useState } from 'react'
import apiAddress from '../config/api';
import ListItem from './ListItem';
import Button from 'react-bootstrap/Button';
import {BiMessageSquareAdd} from "react-icons/bi";

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

const List = () => {
    const [list, setList] = useState(state)
    const {fetched, items} = list

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(apiAddress + "/getList");
            const data = await response.json();
            
            setList({
                fetched: true,
                items: data
            });
        } catch (error) {
            setList({
                fetched: true,
                error
            });
        }
    }

    const changeCheckbox = async (id, completed) => {
        await fetch(apiAddress + "/updateItem", {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({ id: id, completed: completed})
        });
    }

    const deleteItem = async (id) => {
        // Check if item is new item not registered in the database.
        if (id) {
            await fetch(apiAddress + "/deleteItemById/" + String(id), {
                method: "DELETE"
            });
        }

        const newItems = items.filter(listItem => listItem.id !== id);
        setList({
            ...list,
            items: newItems
        });
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
                items.map((item) => (
                    <ListItem item={item} checkboxHandler={changeCheckbox} deleteHandler={deleteItem} key={item.id}></ListItem>
                ))
            }

            <BiMessageSquareAdd size={30} onClick={createItem}></BiMessageSquareAdd>
            </div>
        )
        :
        
        <Button variant="danger" onClick={createItem}>Make first item!</Button>
}
 
export default List;