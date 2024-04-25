// Components
import Icon from './components/Icon.js'

// Data
import worlds from './data/worlds.json'
import images from './data/images.json'

import { viewer, setViewer } from './App.js'
import { getFriendlyName, getThumbSrc } from './functions.js';
import { useEffect, useState } from 'react';

export default function ImgEnlarged({ world, index }) {
    let data = worlds[world];
    let friendly = getFriendlyName(world);
    let worldImages = images[world];
    index = Number(index);

    let fullSRC = `/${friendly}/${worldImages[index]}`;
    let thumbSRC = `${getThumbSrc(friendly, worldImages[index])}`;

    let src = fullSRC;

    // Caption
    let caption = data?.image_caption?.[index+1];
    caption =  caption === undefined ?
        <span className="gray">No caption</span> :
        <i>"{caption}"</i>;


    // Left/right controls
    function navigate(dir) {
        // console.log(dir);
        let to = Number(index) + dir;
        if(to < 0 || to > worldImages.length-1) return;

        setViewer({...viewer, index:to});
    }

    function keyDownHandler({ key }) {
        console.log(key);
    }

    function closeViewer() {
        setViewer({...viewer, world:undefined})
    }

    return (
        <>
            <div className="backdrop" onClick={closeViewer}/>
            <div
                autoFocus
                className="enlarged idle"
                onWheel={event => {
                    let dir = Math.sign(event.deltaY);
                    navigate(dir);
                }}
                onKeyDown={keyDownHandler}
            >
                <img
                    key={src}
                    src={src} alt={fullSRC}
                    id="image" onClick={closeViewer}
                    style={{ "--thumb": `url(${thumbSRC})` }}
                />

                <img-info className="alt_text">
                    <div className="left">
                        <p data-title="Click to copy image URL" class="title_above">
                            {fullSRC.substring(fullSRC.lastIndexOf('/') + 1)}
                        </p>
                        <strong>
                            <span>{index+1} / {worldImages.length}</span> {index === data.header_image ?
                            <Icon icon="star" className="small title_above" title="Header Image"/> : null}
                        </strong>
                    </div>
                    <div className="right">
                        <p className="alt_text">{caption}</p>
                        <p>Source: <strong>{data.image_credit?.[index+1] ?? 'NotNone'}</strong></p>
                    </div>
                </img-info>
            </div>
        </>
    )
}