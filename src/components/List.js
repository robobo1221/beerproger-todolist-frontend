import React, { Component } from 'react'
import baseAddress from '../config/api';
import ListItem from './ListItem';
import "./List.css";

class List extends Component {

    constructor(props) {
        super(props)
        this.state = {
            fetched: false,
            items: []
        }
    }

    fetchData() {
        fetch(baseAddress + "/getList")
        .then(result => result.json())
        .then((data) => {
            this.setState({
                fetched: true,
                items: data
            });
        },
        (error) => {
            this.setState({
                fetched: true,
                error
            });
        })
    }

    componentDidMount() {
        this.fetchData();
    }
    
    render() {
        if (!this.state.fetched) {
            return (
                <div>Loading...</div>
            );
        }

        return (
            <div class='List d-flex justify-content-center flex-wrap'>
                {
                    this.state.items.map((item) => (
                        <ListItem item={item}></ListItem>
                    ))
                }
            </div>
        );
    }
}
 
export default List;