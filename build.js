/** Creates images.json and generates image thumbnails
 * @file build.js 
 */


/** Tracks work done to be logged when script completes */
let performed = {
    thumbs_made: 0, // Thumbnail images generated
    thumb_worlds: {}, // Worlds thumbnails were generated for
    startTime: Date.now()
}

// Dependencies
const fs = require('fs');
const imageThumbnail = require('image-thumbnail');
const path = require('path');

// Get world folders
const dir_blacklist = [".git", "thumb", "node_modules"];
function getFolders(source="./") {
    return fs.readdirSync(source, { withFileTypes: true })
        .filter(item => item.isDirectory() && !dir_blacklist.includes(item.name))
        .map(item => item.name);
}
const worlds = getFolders('./');


/** Get filename friendly version of world name */
function getFriendlyName(name) { return name.replace(/[|&:;$%@"<>()+,' ]/g, ''); }
function getSrc(friendly, file) { return `./${friendly}/${file}`; }
function getThumbSrc(friendly, file) { return `./thumb/${friendly}/${file.replace(/.png$/i, '.jpg')}`; }

/** Thumbnails
 * @param {*} src 
 * @param {*} friendly 
 * @param {*} file 
 */
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

            // Counter
            performed.thumbs_made++;
            performed.thumb_worlds[w] = true;
        }
    } catch (error) {
        console.warn(error);
        console.log('World: ' + w + ' does not exist');
    }

}

// Output
const outputFileName = 'images.json';
fs.writeFileSync(`./${outputFileName}`, JSON.stringify(output));

// Done message
let divider = '-'.repeat(process.stdout.columns);
console.log(`
${divider}

\x1b[1mDone! (${Date.now() - performed.startTime} ms)\x1b[0m
 - Output to \x1b[36m${outputFileName}\x1b[0m
 - Generated \x1b[33m${performed.thumbs_made}\x1b[0m thumbnail(s) for \x1b[33m${Object.keys(performed.thumb_worlds).length}\x1b[0m world(s)

${divider}\x1b[0m
`);
