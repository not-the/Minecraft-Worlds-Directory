// Components
import Icon from './components/Icon.js'
import WorldItem from './WorldItem.js'

// Data
import worlds from './data/worlds.json'
import images from './data/images.json'
// import { uuids, tags } from './data/data.json'

import { getFriendlyName, capitalizeFL } from './functions'


function WorldsList({ sort, filter }) {
    let list = Object.entries(worlds);
    let filter_count = 0;

    // Sort
    if(sort !== 'relevant') {
        list = list.filter(item => item[1] !== 0);
        const sortFunctions = {
            'chronological': (a, b) => new Date(b[1].startDate) - new Date(a[1].startDate),
            'screen_count': (a, b) => images[b?.[0]]?.length - images[a?.[0]]?.length
        }
        // new Date('December 14, 2023').valueOf()

        list = list.sort(sortFunctions[sort]);
    }

    return (
        <div className="worlds_list container">
            {/* Sort seperator */}
            {<h2 className="separator">{capitalizeFL(sort)}</h2>}

            {/* Worlds list */}
            {list.map((arr, index) => {
                let [name, data] = arr;

                // Filters
                if(
                    (
                        (filter === 'vanilla' && data.modded !== 'Vanilla') ||
                        (filter === 'modded' && data.modded === 'Vanilla') ||
                        (filter === 'singleplayer' && data.mode !== 'Singleplayer') ||
                        (filter === 'multiplayer' && data.mode !== 'Multiplayer') ||
                        (filter === 'world_download' && !data.download) ||
                        (filter === 'statistics' && !data.stats)
                    )
                    && data !== 0
                ) {
                    filter_count++;
                    return null;
                }

                return data === 0 ?
                    <h2 className="separator" key={index}>{name.substring(1)}</h2> :
                    <WorldItem name={name} data={data} animDelay={index} sort={sort} key={index}/>;
            })}

            {/* Excluded by filter */}
            {filter_count > 0 ? <p className="center alt_text">{filter_count} results didn't match your filter</p> : ''}
        </div>
    )
}

export default WorldsList;
