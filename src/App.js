import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, useHistory } from 'react-router-dom';

// Assets
// import Icon from './Icon'
import './App.css'

// Components
import Home from './home/Home'
import WorldPage from './WorldPage'
import Page404 from './Page404'
import ImgEnlarged from './ImgEnlarged'
import PlayerStats from './PlayerStats'

import worlds from './data/worlds.json'
import images from './data/images.json'
import { getFriendlyName, getName, getHeaderURL, randomInt, arrayRandom } from './functions'

// Menus
let viewer, setViewer; // Image viewer
let statsMenu, setStatsMenu; // Statistics menu
let bg_src, set_bg_src; // Background image
export {
    viewer, setViewer,
    statsMenu, setStatsMenu,
    bg_src, set_bg_src
}

export default function App() {
    // Random BG image
    // let randomWorld = arrayRandom(Object.keys(images));
    let randomWorld = arrayRandom(["Terralith CO-OP", "Creative Realm"]);
    let randomHeader = `/${getFriendlyName(randomWorld)}/${arrayRandom(images[randomWorld])}`;

    // BG image state
    [bg_src, set_bg_src] = useState(randomHeader);
    let bg_image_style = { "--image": `url('${bg_src}')` };

    // Image viewer state
    [viewer, setViewer] = useState({
        world: undefined, index: 0, src:""
    });

    // Statistics menu state
    [statsMenu, setStatsMenu] = useState({
        open:false, world: undefined, username:""
    });

    return (
        <>
            <div id="bg_image" style={bg_image_style}></div>
            <BrowserRouter acrollRestoration="auto">
                <Routes>
                    <Route path="/" element={<Home/>} />
                    {Object.keys(worlds).map(name => {
                        let friendly = getFriendlyName(name);
                        return <Route path={friendly} element={<WorldPage name={name} key="name"/>}></Route>
                    })}
                </Routes>

            </BrowserRouter>

            {/* Image viewer */}
            {
                viewer.world ? <ImgEnlarged world={viewer.world} src={viewer.src} index={viewer.index} /> : ''
            }

            {/* Player stats */}
            {
                statsMenu.open ? <PlayerStats world={viewer.world} src={viewer.src} index={viewer.index} /> : ''
            }
        </>
    )
}
