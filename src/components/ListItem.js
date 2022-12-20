import React, { Component } from 'react'

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

class ListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            completed: false
        }
    }

    componentDidMount() {
        this.setState({
            completed: this.props.item.completed || this.props.item.completed == 1
        })
    }

    handleCheckbox() {
        this.setState({
            completed: !this.state.completed
        })
    }

    render() { 
        return (
        <Card style={{ width: '18rem' }} className="m-2">
            <Card.Img variant="top" src={this.props.item.image} />
                <Card.Body>
                    <Card.Title>{this.props.item.name}</Card.Title>
                    <Card.Text>{this.props.item.details}</Card.Text>
                    <Card.Text>
                    Done <input type="checkbox" checked={this.state.completed} onClick={() => this.handleCheckbox()}></input>
                    </Card.Text>
                    <Button variant="primary">Edit</Button>
                </Card.Body>
            </Card>
        );
    }
}
 
export default ListItem;