// Components
import { Link } from 'react-router-dom';
import Icon from './components/Icon'
import Tag from './components/Tag';

// Data
import images from './data/images.json'
// import { uuids, tags } from './data/data.json'

import { getHeaderURL, getFriendlyName } from './functions'


export default function WorldItem({ name, data, animDelay, sort }) {
    let friendly = getFriendlyName(name);
    let headerURL = getHeaderURL(name);
    headerURL = `${headerURL}`; // placeholder

    return (
            <world-item
                style={{
                    "--image": `url('${headerURL}')`,
                    "--anim-delay": `${animDelay*30}ms`,
                    "--anim-distance": `${animDelay*20}px`
                }}>

                <Link to={`/${friendly}`}><div className="link_area"></div></Link>

                <div className="col">
                    <h3>{name}</h3>
                    <p className="alt_text">
                        {sort !== 'screen_count' ?
                            <><Icon icon="calendar"/><span>{data.startDate} - {data.endDate}</span></> :
                            <span>{images[name]?.length ?? 0} screenshots</span>
                        }
                    </p>
                </div>
                <div className="col right">
                    <a href={data?.download ?? ''} target="_blank" rel="noopener noreferrer">
                        <button
                            className={data.download ? 'button_blue' : ''}
                            disabled={!data.download}
                            tabIndex="-1"
                        >
                            <p>{data.download ? 'Download' : 'No download'}</p>
                            <span></span>
                        </button>
                    </a>
                    <div className="icons flex">
                        <Icon icon={data.mode.toLowerCase()} title={data.mode}/>
                        {data.gamemode === 'Survival' ?
                            <Icon icon="heart" title="Survival"/> :
                            data.gamemode === 'Creative' ?
                                <Icon icon="cube" title="Creative"/> :
                                <Icon icon="heart_monitor" title={data.gamemode}/>
                        }
                        {data.modded !== 'Vanilla' ?
                            <Icon icon="modded" title="Modded"/> :
                            <Icon icon="vanilla" title="Vanilla"/>}
                        {data.stats ? <Icon icon="chart" title="Statistics"/> : ''}
                    </div>
                </div>
            </world-item>
    )
}
