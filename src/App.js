import 'bootstrap/dist/css/bootstrap.css';
import './App.css'

import List from './components/List';
import Popup from './components/Popup';

function App() {
    return (
    <div className="App">
        <Popup></Popup>
        <h1>Todo-list</h1>
        <List></List>
    </div>
    );
}

export default App;
