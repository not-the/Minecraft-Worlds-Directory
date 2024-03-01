// Creates images.json and generates image thumbnails //

const fs = require('fs');
const imageThumbnail = require('image-thumbnail');
const path = require('path');
const worlds = Object.keys(require('./data/worlds.json'));

/** Get filename friendly version of world name */
function getFriendlyName(name) { return name.replace(/[|&:;$%@"<>()+,' ]/g, ''); }
function getSrc(friendly, file) { return `./${friendly}/${file}`; }
function getThumbSrc(friendly, file) { return `./thumb/${friendly}/${file.replace(/.png$/i, '.jpg')}`; }

// Thumbnails
async function makeThumb(src, friendly, file) {
    console.log(src, friendly, file);
    // console.log(src, getThumbSrc(friendly, file));
    imageThumbnail(src, { percentage:25, jpegOptions:{ force:true, quality:70 }})
        .then(thumbData => {
            fs.writeFileSync(getThumbSrc(friendly, file), thumbData);
        })
        .catch(err => console.error(err));
}

let output = {};
for(let w of worlds) {
    let friendly = getFriendlyName(w);
    if(w.startsWith('#')) continue;
    try {
        if(!fs.existsSync(`./${friendly}`)) continue;
        let screens = fs.readdirSync(`./${friendly}`);
        output[w] = screens;

        // Thumbnail folders
        if(!fs.existsSync(`./thumb/${friendly}`)) fs.mkdirSync(`./thumb/${friendly}`);

        // Thumbnails
        for(let file of screens) {
            if(fs.existsSync(getThumbSrc(friendly, file))) continue;

            let src = getSrc(friendly, file);
            makeThumb(src, friendly, file);
        }
    } catch (error) {
        console.warn(error);
        console.log('World: ' + w + ' does not exist');
    }

}

// fs.writeFileSync('./data/images.json', JSON.stringify(output));

