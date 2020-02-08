import React from 'react';
import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";
import { Home, Favorite, LocationCity, Folder } from '@material-ui/icons';
import './App.css';

function App() {
  return (
    <div className="App">
      <BottomNavigation value={""} onChange={() =>{}}>
        <BottomNavigationAction label="Recents" value="recents" icon={<Home />} />
        <BottomNavigationAction label="Favorites" value="favorites" icon={<Favorite />} />
        <BottomNavigationAction label="Nearby" value="nearby" icon={<LocationCity />} />
        <BottomNavigationAction label="Folder" value="folder" icon={<Folder />} />
      </BottomNavigation>
    </div>
  );
}

export default App;
