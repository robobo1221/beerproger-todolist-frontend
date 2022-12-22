import React, { Component, useEffect, useState } from 'react'
import apiAddress from '../config/api';
import ListItem from './ListItem';

const state = {
    fetched: false,
    items: []
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
        await fetch(apiAddress + "/deleteItemById/" + String(id), {
            method: "DELETE"
        });

        const newItems = list.items.filter(listItem => listItem.id != id);
        setList({
            ...list,
            items: newItems
        });
    }
    
    if (!list.fetched) {
        return (
            <div>Loading...</div>
        );
    }

    return (
        <div className='List d-flex justify-content-center flex-wrap'>
            {
                list.items.map((item) => (
                    <ListItem item={item} checkboxHandler={changeCheckbox} deleteHandler={deleteItem} key={item.id}></ListItem>
                ))
            }
        </div>
    );
}
 
export default List;