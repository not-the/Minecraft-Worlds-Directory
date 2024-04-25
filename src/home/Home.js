import React, { useState, useEffect } from 'react';

// Components
import WorldsList from '../WorldsList'
import Timeline from '../Timeline'
import Tabs from '../components/Tabs'

// import worlds from './data/worlds.json'
// import images from './data/images.json'
// import { uuids, tags } from './data/data.json'

/** Home page */
function Home() {
    const [filter, setFilter] = useState('All');
    const [sort, setSort] = useState('relevant');

    const [homeTab, setHomeTab] = useState('Worlds');

    return (
        <>
        {/* <!-- Nav --> */}
        <header className="main_header container">
            <h1>Minecraft Worlds</h1>
        </header>

        <nav className="main_nav flex media_flex container">
            <Tabs tabs={['Worlds', 'Timeline (WIP)']} active={homeTab} setActive={setHomeTab} />
            {homeTab === 'Worlds' ?
                <div className="buttons flex">
                    <label for="sort" value={sort} onChange={event => setSort(event.target.value)}>
                        <p>Sort:</p>
                        <select name="sort" id="sort">
                            <option value="relevant">Relevant</option>
                            <option value="chronological">Chronological</option>
                            <option value="screen_count">Screenshots</option>
                        </select>
                    </label>
                    <label for="filter">
                        <p>Filter:</p>
                        <select name="sort" id="sort" value={filter} onChange={event => setFilter(event.target.value)}>
                            <option value="all">All</option>
                            <option value="world_download">World Download</option>
                            <option value="statistics">Statistics</option>
                            <option value="" disabled>----------</option>
                            <option value="vanilla">Vanilla</option>
                            <option value="modded">Modded</option>
                            <option value="" disabled>----------</option>
                            <option value="singleplayer">Singleplayer</option>
                            <option value="multiplayer">Multiplayer</option>
                        </select>
                    </label>
                </div>
                :
                ''
                }
        </nav>

        {/* <!-- List --> */}
        {homeTab === 'Worlds' ?
            <WorldsList sort={sort} filter={filter}/> :
            <Timeline/>
        }

        {/* <!-- Footer --> */}
        <footer id="footer">
            <div className="inner container">
                <p className="alt_text">© notkal.com</p>
            </div>
        </footer>
        </>
    );
}

export default Home;
