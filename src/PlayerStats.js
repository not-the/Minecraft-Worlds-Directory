// Components
import Statistic from './components/Statistic.js'
import Icon from './components/Icon.js'

// Data
import worlds from './data/worlds.json'
import images from './data/images.json'
import data from './data/data.json'


// Variables
import { statsMenu, setStatsMenu } from './App.js'
import { capitalizeFL, get, getFriendlyName, getThumbSrc, numCommas, convertTimeStat } from './functions.js'
const { uuids } = data;


// Temporary
const allStats = {
    "Create-ish": {
        "2b9a7c17-b212-45f7-852f-224fa17f886c": require("./data/stats/Create-ish/2b9a7c17-b212-45f7-852f-224fa17f886c.json"),
        "2cdcaf76-2fb8-46f7-8cef-2bfaf6d4bf5b": require("./data/stats/Create-ish/2cdcaf76-2fb8-46f7-8cef-2bfaf6d4bf5b.json"),
        "46fcef72-b0f1-4200-8ee8-d732e57eb664": require("./data/stats/Create-ish/46fcef72-b0f1-4200-8ee8-d732e57eb664.json"),
        "b159daa8-e70c-4414-86c6-82ee4e789847": require("./data/stats/Create-ish/b159daa8-e70c-4414-86c6-82ee4e789847.json"),
        "d12d0ce7-2152-454e-93ee-beffe332d2c8": require("./data/stats/Create-ish/d12d0ce7-2152-454e-93ee-beffe332d2c8.json"),
        "d138c874-b450-46bd-bbfe-7e7ab99d651f": require("./data/stats/Create-ish/d138c874-b450-46bd-bbfe-7e7ab99d651f.json"),
    },
    "Stone Tool Survival": {
        "2cdcaf76-2fb8-46f7-8cef-2bfaf6d4bf5b": require("./data/stats/Stone Tool Survival/2cdcaf76-2fb8-46f7-8cef-2bfaf6d4bf5b.json"),
    },
    "Vanilla servor": {
        "187eb794-a14d-4e3b-927a-3c133459811c": require("./data/stats/Vanilla servor/187eb794-a14d-4e3b-927a-3c133459811c.json"),
        "2b9a7c17-b212-45f7-852f-224fa17f886c": require("./data/stats/Vanilla servor/2b9a7c17-b212-45f7-852f-224fa17f886c.json"),
        "2cdcaf76-2fb8-46f7-8cef-2bfaf6d4bf5b": require("./data/stats/Vanilla servor/2cdcaf76-2fb8-46f7-8cef-2bfaf6d4bf5b.json"),
        "3bff3256-a045-4b98-b182-42fd2e591bb6": require("./data/stats/Vanilla servor/3bff3256-a045-4b98-b182-42fd2e591bb6.json"),
        "3c43c357-fe51-4c54-8a5b-f6be2f454207": require("./data/stats/Vanilla servor/3c43c357-fe51-4c54-8a5b-f6be2f454207.json"),
        "429cde12-2099-4a32-8f00-51dc74d8e9cd": require("./data/stats/Vanilla servor/429cde12-2099-4a32-8f00-51dc74d8e9cd.json"),
        "46fcef72-b0f1-4200-8ee8-d732e57eb664": require("./data/stats/Vanilla servor/46fcef72-b0f1-4200-8ee8-d732e57eb664.json"),
        "6dd9186a-15ae-40c2-a5bb-51dae8f65210": require("./data/stats/Vanilla servor/6dd9186a-15ae-40c2-a5bb-51dae8f65210.json"),
        "744eb916-56c5-4c21-964e-7636891a64a4": require("./data/stats/Vanilla servor/744eb916-56c5-4c21-964e-7636891a64a4.json"),
        "75f2cf46-a778-4c64-9347-b972df873bc5": require("./data/stats/Vanilla servor/75f2cf46-a778-4c64-9347-b972df873bc5.json"),
        "ad9175ad-b607-4106-b167-634ecfef33d6": require("./data/stats/Vanilla servor/ad9175ad-b607-4106-b167-634ecfef33d6.json"),
        "b6430c9d-15ae-4e35-8e04-2894600b7701": require("./data/stats/Vanilla servor/b6430c9d-15ae-4e35-8e04-2894600b7701.json"),
        "bbf8e0d7-69a4-4243-acd9-6269e73b7a2f": require("./data/stats/Vanilla servor/bbf8e0d7-69a4-4243-acd9-6269e73b7a2f.json"),
        "d12d0ce7-2152-454e-93ee-beffe332d2c8": require("./data/stats/Vanilla servor/d12d0ce7-2152-454e-93ee-beffe332d2c8.json"),
        "d138c874-b450-46bd-bbfe-7e7ab99d651f": require("./data/stats/Vanilla servor/d138c874-b450-46bd-bbfe-7e7ab99d651f.json"),
        "dbb3aaa3-1882-419f-9258-3316a2c7ae69": require("./data/stats/Vanilla servor/dbb3aaa3-1882-419f-9258-3316a2c7ae69.json"),
    },
    "Voxel Fields 2 Plus": {
        "2b9a7c17-b212-45f7-852f-224fa17f886c": require("./data/stats/Voxel Fields 2 Plus/2b9a7c17-b212-45f7-852f-224fa17f886c.json"),
        "2cdcaf76-2fb8-46f7-8cef-2bfaf6d4bf5b": require("./data/stats/Voxel Fields 2 Plus/2cdcaf76-2fb8-46f7-8cef-2bfaf6d4bf5b.json"),
        "3c43c357-fe51-4c54-8a5b-f6be2f454207": require("./data/stats/Voxel Fields 2 Plus/3c43c357-fe51-4c54-8a5b-f6be2f454207.json"),
        "4c72dd92-dff0-40f9-a195-454e8e1e4ffc": require("./data/stats/Voxel Fields 2 Plus/4c72dd92-dff0-40f9-a195-454e8e1e4ffc.json"),
        "6dd9186a-15ae-40c2-a5bb-51dae8f65210": require("./data/stats/Voxel Fields 2 Plus/6dd9186a-15ae-40c2-a5bb-51dae8f65210.json"),
        "b159daa8-e70c-4414-86c6-82ee4e789847": require("./data/stats/Voxel Fields 2 Plus/b159daa8-e70c-4414-86c6-82ee4e789847.json"),
        "d12d0ce7-2152-454e-93ee-beffe332d2c8": require("./data/stats/Voxel Fields 2 Plus/d12d0ce7-2152-454e-93ee-beffe332d2c8.json"),
        "d138c874-b450-46bd-bbfe-7e7ab99d651f": require("./data/stats/Voxel Fields 2 Plus/d138c874-b450-46bd-bbfe-7e7ab99d651f.json"),
    }
}




export default function PlayerStats() {
    let { world, username } = statsMenu;
    let data = worlds[world];
    let uuid = uuids[username];

    // Stats
    // let raw = get(`./data/stats/${world}/${uuid}.json`);
    let raw = allStats[world][uuid];


    let {stats, dataVersion} = raw;
    let time_played =
        stats?.['minecraft:custom']?.['minecraft:play_one_minute'] ??
        stats['minecraft:custom']?.['minecraft:play_time'];
    time_played = convertTimeStat(time_played);

    // HTML
    let playersList = data.players.map(p => {
        if(p !== 'Unlisted') return (
            <div
                className={`player${username === p && statsMenu.category === undefined ? ' active' : ''}`}
                role="button" tabindex="0"
                onClick={data.stats ? ()=>{ viewStats(p) } : undefined}
            >
                <img src={`https://mc-heads.net/avatar/${uuids[p]}`} alt=""/>
                <span>{p}</span>
            </div>
        )
    })

    /** Formalize statistic name */
    function formalize(category, key) {
        let f_key = cleanUp(key);
        let f_category = cleanUp(category);

        // Sentence rules
        if(
            f_category !== "" &&
            f_category !== "Mined" &&
            f_category !== "Dropped" &&
            f_key !== "Sheep" &&
            f_key.slice(-1) !== "s"
        ) f_key += "s"; // Plural
        if(f_key === "Endermans") f_key = "Endermen"; // Endermen
        if(f_key === "Leave game") f_key = "Left game"; // Left game
        if(f_key === "Play one minute") f_key = "Time played";
        if(f_key === "Jump") f_key = "Jumps"

        // Swap
        if(f_category === "Killed by") [f_key, f_category] = [f_category, f_key]; // Killed by


        return [f_key, f_category].join(' ').trim();

        /** Clean up string */
        function cleanUp(name) {
            let clean = capitalizeFL(name.split(':')[1].split('_').join(' '));
            if(clean === 'Custom') return '';
            return clean;
        }
    }

    /** Close menu */
    function closeStats() {
        if(statsMenu.category !== undefined) compare(undefined, undefined); // Close compare
        else setStatsMenu({ ...statsMenu, open:false }); // Close stats
    }

    /** Change player */
    function viewStats(username) { setStatsMenu({ ...statsMenu, username, category:undefined, key:undefined }) }

    /** Compare stats */
    function compare(category, key) {
        setStatsMenu({ ...statsMenu, category, key });
    }

    return (
        <>
            <div className="backdrop" onClick={closeStats}/>
            <player-stats>
                <div class="col left">
                    <button class="close" onClick={closeStats}>
                        <p>{statsMenu.category === undefined ? "Done" : `<- Go Back`}</p>
                        <span></span>
                    </button>
                    {playersList}
                </div>

                <div className={`col right ${statsMenu.category === undefined ? '' : 'compare_open'}`}>
                    <div class="inner">
                        <h3>{username}</h3>
                        <p class="alt_text">Statistics for <b>{world}</b></p>
                        <br/>
                        <h5>Stats</h5>
                        <table>
                            {/* Time played */}
                            <Statistic
                                category={"minecraft:custom"} name={"minecraft:play_one_minute"} value={time_played}
                                compare={compare}
                            />

                            {/* Deaths */}
                            <Statistic
                                category={"minecraft:custom"} name={"minecraft:deaths"} stats={stats}
                                compare={compare}
                            />

                            {/* Stone mined */}
                            <Statistic
                                label="Stone blocks mined"
                                category={"minecraft:mined"} name={"minecraft:stone"} stats={stats}
                                compare={compare}
                            />

                            {/* Fly distance */}
                            <Statistic
                                category={"minecraft:custom"} name={"minecraft:aviate_one_cm"} stats={stats}
                                compare={compare}
                            />
                        </table>
                        <br/>

                        <div class="flex">
                            <h5>All</h5>
                            {/* <span class="auto_collapse hover_underline" role="button" tabindex="0">Expand all</span> */}
                        </div>            
                        {Object.entries(stats).sort().map(s => {
                            let [category, catData] = s;
                            return (
                                <>
                                <details>
                                <summary>{category}</summary>
                                    <table>
                                        {Object.entries(catData).sort().map(d => {
                                            let [name, value] = d;
                                            return (
                                                <Statistic
                                                    category={category} name={name} value={value} stats={stats}
                                                    compare={compare}
                                                />
                                            )
                                        })}
                                    </table>
                                </details>
                                </>
                            )
                        })}
                    </div>

                    {/* Compare */}
                    <div id="compare" className="inner">
                        {statsMenu.category === undefined ? '' :
                            <div>
                                <h3>Leaderboard</h3>
                                <p class="alt_text">
                                    {world} ({statsMenu.category.split(':')[1]} -&gt; {statsMenu.key.split(':')[1]})
                                </p>
                                <br/>

                                <div class="flex">
                                    <h5>
                                        {formalize(statsMenu.category, statsMenu.key)}
                                    </h5>
                                    {/* <span class="auto_collapse hover_underline" role="button" tabindex="0">Expand all</span> */}
                                </div>
                                <table>
                                    <tr>
                                        <td></td>
                                        <th>Player</th>
                                        <th>{formalize(statsMenu.category, statsMenu.key)}</th>
                                    </tr>
                                {
                                    (() => {
                                        // Get leaderboard
                                        let leaderboard = data.players.map((p) => {
                                            let value = allStats?.[world]?.[uuids[p]]?.stats?.[statsMenu.category]?.[statsMenu.key];
                                            if(value === undefined) return null;
                                            return [ p, value ];
                                        });

                                        // Sort leaderboard
                                        leaderboard = leaderboard.filter(item => item !== null).sort((a, b) => b?.[1] - a?.[1])
                                        // console.log(leaderboard);

                                        // Create JSX
                                        return leaderboard.map((item, index) => {
                                            if(item === null) return null;

                                            let [p, value] = item;
                                            return (
                                                <tr role="button" tabIndex="0" onClick={() => { viewStats(p) }}>
                                                    <td className={`rank ${
                                                        index===0 ? 'gold' :
                                                        index===1 ? 'silver' :
                                                        index===2 ? 'bronze' : ''
                                                    }`}>
                                                        <span>#</span> {index+1}
                                                    </td>
                                                    <th><img src={`https://mc-heads.net/avatar/${uuids[p]}`} alt=""/> {p}</th>
                                                    <td>
                                                        {statsMenu.key.includes('one_minute') ? convertTimeStat(value) : numCommas(value)}
                                                    </td>
                                                </tr>
                                            )
                                        });
                                    })()
                                }
                                </table>
                            </div>
                        }
                    </div>

                </div>
            </player-stats>
        </>
    )
}