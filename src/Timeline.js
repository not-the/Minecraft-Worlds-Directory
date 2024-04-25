import { Link } from 'react-router-dom'

// Data
import worlds from './data/worlds.json'
import { getHeaderURL, getFriendlyName } from './functions'

export default function Timeline() {
    let scale = 20;
    let width = 240;

    // Timeline start/end dates
    let tl_start = new Date("2016").valueOf();
    let tl_end = new Date().valueOf();
    // console.log(tl_end-tl_start/scale);

    // Convert ms to months
    let arr = Array(Math.ceil((tl_end-tl_start)/2629746000)).fill(scale);



    // Worlds
    let worldPositioning = Object.entries(worlds).map(([name, data], index) => {
        if(data === 0) return 0;

        if(data.startDate === 'N/A') return 0;

        // Dates
        let startMS = new Date(data.startDate).valueOf() - tl_start;
        let endMS = new Date(data.endDate).valueOf() - tl_start;
        if(data.endDate === 'Present') endMS = new Date().valueOf() - tl_start;

        let top = startMS/2629746000 * scale;
        let left = 20;
        let height = (endMS-startMS)/2629746000 * scale;
        
        let headerURL = getHeaderURL(name);

        return { name, data, headerURL, top, left, height }
    })
    let worldHTML = worldPositioning.map((props) => {
        if(props === 0) return '';
        let { name, data, headerURL, top, left, height } = props;
        
        // Fix overlap
        left += (data?.timeline_column??0)*width;
        // for(let p of worldPositioning) {
        //     if(
        //         top > p.top && top < p.top+p.height
        //     ) {
        //         left += width;
        //     }
        // }

        return (
            <Link to={`/${getFriendlyName(name)}`}>
                <div className={`timeline_item ${data.endDate === 'Present' ? 'to_present' : ''}`} style={{
                    "--image": `url('${headerURL}')`,

                    "width": `${width}px`,
                    "transform" : `translateX(${left}px)`,

                    "top": `${top}px`,
                    "height": `${height}px`,
                    "z-index": `${Math.round(top)}`
                }}>
                    <h5>{name}</h5>
                </div>
            </Link>
        )
    })


    return (
        <div id="timeline" className="container" style={{ "height": `${arr.length*scale+128}px` }}>
            <div className="line_container">
                {arr.map((entry, index) => {
                    let top = entry*index;
                    let timestamp = index*2629746000 + tl_start;
                    let year = new Date(timestamp).getFullYear();
                    return (
                        top % (scale*12) === 0 ?
                        <div className="year" style={{"top":`${top}px`}}>{year}</div> :
                        <div className="month" style={{"top":`${top}px`}}></div>
                    )
                })}
            </div>

            <div className="col col1">
                {worldHTML}
            </div>
        </div>
    )
}