import { Link } from 'react-router-dom'

// Components
import Icon from './components/Icon'
import Tag from './components/Tag'
import Tabs from './components/Tabs'
import Gallery from './Gallery'

// Data
import worlds from './data/worlds.json'
import images from './data/images.json'

import { viewer, setViewer } from './App'
import { getFriendlyName, getHeaderURL } from './functions'

import { statsMenu, setStatsMenu, set_bg_src } from './App'
import { useState } from 'react'


export default function WorldPage({ name }) {
    let data = worlds[name];
    let friendly = getFriendlyName(name);
    let imagesList = images[name];
    let headerURL = getHeaderURL(name);
    headerURL = `${headerURL}`; // placeholder

    set_bg_src(headerURL);

    const [imageSort, setImageSort] = useState("New first");

    function viewStats(world, username) {
        if(data.stats) setStatsMenu({ open:true, world, username });
    }

    // HTML
    let players = data.players.map(p => {
        return (
            p === 'Unlisted' ?

            // Unlisted
            <span className="gray" key={p}>{p}</span> :

            // Player
            <span role="button" tabIndex="0" key={p} onClick={()=>viewStats(name, p)}>
                {
                    p === data.owners ?
                    <Icon icon="crown" title="Server Owner" className="small" style={{"--fill": "gold"}}/> : ''
                } {p}
            </span>
        )
    });

    // Dropdown
    let dropdown_content = [];
    if(data.pack_download) dropdown_content.push(
        <a href={data.pack_download} target="_blank" rel="noopener noreferrer">
            <button className="button_green">
                <p><Icon icon="download" className="small"/> Modpack download</p>
                <span></span>
            </button>
        </a>
    );

    // Image viewer
    function enlarge() {
        setViewer({
            ...viewer, world:name, index:data.header_image
        });
    }

    return (
        <>
        <div id="world">
            <div className="container">
                <header>
                    <img src={headerURL} alt={headerURL} role="button" tabIndex="0" data-world={name} data-index={data.header_image} onClick={enlarge}/>
                    <Link to="/">
                        <button className="button close">
                            <p>&lt;- Back</p>
                            <span></span>
                        </button>
                    </Link>
                </header>
                <div className="banner flex media_flex">
                    <h1>{name}</h1>
                    <div className="buttons">
                        {
                            data.download ?
                            <a href={data.download} target="_blank" rel="noopener noreferrer">
                                <button className="button_blue">
                                    <p><Icon icon="download"/> Download</p>
                                    <span></span>
                                </button>
                            </a>
                            : ''
                        }
                        {
                            dropdown_content?.length !== 0 ?
                            <div className="dropdown_container">
                                <button className="dropdown">
                                    <p>▼</p>
                                    <span></span>
                                </button>
                                <div className="dropdown_content">
                                    {dropdown_content}
                                </div>
                            </div> : ''
                        }
                    </div>
                </div>

                {/* World map */}
                {data.map ?
                    <a href={data.map} target="_blank" rel="noreferrer">
                        {/* <iframe src={data.map} frameborder="0" title="World map - Finna SMP"/> */}
                        <div className="item bordered map_preview flex" style={{ "--image": `url(${data.map_preview})` }}>
                            <h4>World map -&gt;</h4>

                            <span className="fullwidth center">
                                <Icon icon="open_in_full"/> 
                            </span>
                        </div>

                        {/* <div className="map_overlay"></div> */}
                    </a> : ''
                }

                {/* Info */}
                <div className="item flex media_flex">
                    <div className="col">
                        <div className="info">
                            <Icon icon="description"/>
                            <strong>Description</strong>
                            <p className="alt_text">
                                {data.description ?? <span className="gray">No description available</span>}
                            </p>
                        </div><br/>

                        <div className="info">
                            <Icon icon="calendar"/>
                            <span>{data.startDate} - {data.endDate}</span>
                        </div>

                        <div className="info">
                            <Icon icon={data.modded === 'Vanilla' ? 'vanilla' : 'modded'}/>
                            <span>{data.modded} ({data.version})</span>
                        </div>

                        <div className="info">
                            <Icon icon={data.mode === 'Singleplayer' ? 'singleplayer' : 'multiplayer'}/>
                            <span>{data.gamemode} {data.mode}</span>
                        </div>

                    </div>

                    <hr className="vr" />

                    <div className="col">
                        <Icon icon="multiplayer"/><strong>Players <span className="weight_500 alt_text">({data.players.length})</span></strong>
                        <p>
                            {data.stats ? <div className="gray">Click a player to view their stats</div> : ''}
                            <div className="players alt_text">
                                {players}
                            </div>
                        </p><br/>

                        <Icon icon="sell"/><strong>Tags</strong>
                        <p className="tags flex">
                            {/* Gamemode */}
                            <Tag name={data.gamemode}/>

                            {/* Singleplayer/Multiplayer */}
                            <Tag name={data.mode}/>

                            {/* Vanila/Modded */}
                            <Tag name={data.modded === 'Vanilla' ? 'Vanilla' : 'Modded'}/>

                            {/* Statistics */}
                            {data.stats ? <Tag name="Statistics"/> : ''}

                            {/* Downloadable */}
                            {data.download ? <Tag name="Downloadable"/> : ''}

                        </p>
                    </div>
                </div>
            </div>

            <div className="item" id="images">
                <div className="flex media_flex" style={{paddingBottom:'9px'}}>
                    <h3 style={{paddingBottom:0}}>Gallery <span className="gray weight_500 small">({imagesList.length})</span></h3>


                    <div className="margin_left_auto">
                        {/* <h6 style={{paddingLeft:'6px'}}>Sort:</h6> */}
                        <Tabs tabs={['New first', 'Old first']} active={imageSort} setActive={setImageSort} icon="swap" />
                    </div>
                </div>
                <Gallery name={name} sort={imageSort}></Gallery>
            </div>
        </div>
        </>
    )
}
