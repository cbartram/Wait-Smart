import React from 'react';
import './Navbar.css';
import {BottomNavigation, BottomNavigationAction} from "@material-ui/core";
import {Favorite, Folder, Home, BarChart} from "@material-ui/icons";

/**
 * Bottom Navigation Bar for users
 * @returns {*}
 * @constructor
 */
const Navbar = () => {
    return (
        <BottomNavigation className="sticky-navbar" onChange={() =>{}} style={{ zIndex: 9999 }}>
            <BottomNavigationAction label="Recents" value="recents" icon={<Home />} />
            <BottomNavigationAction label="Favorites" value="favorites" icon={<Favorite />} />
            <BottomNavigationAction label="Nearby" value="nearby" icon={<BarChart />} />
            <BottomNavigationAction label="Folder" value="folder" icon={<Folder />} />
        </BottomNavigation>
    )
};

export default Navbar;