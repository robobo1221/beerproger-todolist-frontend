import React, { Component } from 'react'
import baseAddress from '../config/api';
import ListItem from './ListItem';
class List extends Component {

    constructor(props) {
        super(props)
        this.state = {
            fetched: false,
            items: []
        }
    }

    fetchData = async () => {
        try {
            const response = await fetch(baseAddress + "/getList");
            const data = await response.json();

            console.log("done");
            
            this.setState({
                fetched: true,
                items: data
            });
        } catch (error) {
            this.setState({
                fetched: true,
                error
            });
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    checkboxHandler = async (id, completed) => {
        const response = await fetch(baseAddress + "/updateItem", {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({ id: id, completed: completed})
        });
    }
    
    render() {
        if (!this.state.fetched) {
            return (
                <div>Loading...</div>
            );
        }

        return (
            <div className='List d-flex justify-content-center flex-wrap'>
                {
                    this.state.items.map((item) => (
                        <ListItem item={item} checkboxHandler={this.checkboxHandler}></ListItem>
                    ))
                }
            </div>
        );
    }
}
 
export default List;