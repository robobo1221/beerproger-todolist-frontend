import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css'

import ListItem from './components/ListItem';
import List from './components/List';

function App() {
  return (
    <div className="App">
        <h1>Todo-list</h1>
        <List></List>
    </div>
  );
}

export default App;
