import React, { useEffect, useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import eventBus from '../utility/EventBus';

const Popup = (props) => {
    const [show, setShow] = useState(false)
    const [data, setData] = useState({message: "", type: ""})
    const {type, message} = data

    useEffect(() => {
        eventBus.on("error", (data) => {
            setData(data);
            setShow(true);
            }
        );

        return () => {
            eventBus.remove("error");
        }
    }, []);

    return (
        <div className='Popup'>
            <Toast bg={type} show={show} onClose={() => setShow(false)}>
                <Toast.Header>
                    <strong className="me-auto">Message</strong>
                </Toast.Header>
                <Toast.Body>
                    {message}
                </Toast.Body>
            </Toast>
        </div>
    );
}

export default Popup;