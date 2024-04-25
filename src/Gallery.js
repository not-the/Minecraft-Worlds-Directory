// Components
import Icon from './components/Icon.js'
import Tag from './components/Tag.js'

// Data
import worlds from './data/worlds.json'
import images from './data/images.json'

import { getFriendlyName, getHeaderURL, getThumbSrc } from './functions.js'

import { viewer, setViewer } from './App.js'


export default function Gallery({ name, sort }) {
    let friendly = getFriendlyName(name);
    let imagesList = images[name];
    let list = imagesList;

    if(imagesList === undefined) return '';

    // Sort
    if(sort === 'New first') list = imagesList.slice().reverse();

    function enlarge(event) {
        const element = event.target;
        setViewer({
            world:name, index:element.dataset.index, src:element.src
        });
        // setTimeout(() => {
        //     setViewer({
        //         world:name, index:element.dataset.index, src:element.dataset.fullSrc
        //     });
        // }, 0);
    }

    return (
        <div className="gallery">
            {list.map((file, index) => {
                let thumbSRC = getThumbSrc(friendly, file);
                thumbSRC = `${thumbSRC}`; // placeholder
                let fullSrc = `/${friendly}/${file}`; // placeholder

                return <img onClick={enlarge} key={index}
                    src={thumbSRC} alt={file}
                    role="button" tabIndex="0" loading="lazy"
                    data-full-src={fullSrc}
                    data-world={name} data-index={imagesList.indexOf(file)}
                />
            })}
        </div>
    )
}
