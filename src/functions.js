import worlds from './data/worlds.json'
import images from './data/images.json'


/** Get JSON - https://stackoverflow.com/a/22790025/11039898
 * @param {string} url JSON file URL
 * @param {boolean} parse Whether or not to convert into a JS object
 * @returns 
 */
export function get(url, parse=true) {
    try {
        var rq = new XMLHttpRequest();
        rq.open("GET", url, false);
        rq.send(null);
        return parse ? JSON.parse(rq.responseText) : rq.responseText;
    } catch (error) {
        return false;
    }
}
/** Get filename friendly version of world name */
export function getFriendlyName(name) { return worlds[name]?.friendly ?? name?.replace(/[|&:;$%@"<>()+,' ]/g, ''); }
/** Returns world name given friendly name */
export function getName(friendly) { return Object.keys(worlds).find(key => worlds[key].friendly === friendly); }

/** Get header image URL from world name */
export function getHeaderURL(name) {
    let friendly = getFriendlyName(name);
    let data = worlds[name];
    let file = images?.[name]?.[data.header_image];
    return file ? `/${friendly}/${file}` : '/blank.png';
}
export function getThumbSrc(friendly, file) {
    return `/thumb/${friendly}/${file.replace(/.png$/i, '.jpg')}`;
}
/** Comma big numbers - https://stackoverflow.com/a/2901298/11039898
 * @param {number} num 
 * @returns {string}
 */
export function numCommas(num) {
    if(num === undefined) return 0;
    var parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
/** Converts minutes into string representing hours or minutes
 * @param {Number} minutes Time in minutes
 * @returns {String} String representing hours or minutes
 */
export function convertTimeStat(minutes=0) {
    return minutes = minutes < 72000 ?
        (minutes / 1200).toFixed(0) + ' minutes' : // Minutes
        (minutes / 144000).toFixed(1) + ' hours'; // Hours
}

/** Converts centimeters into readable string representing centimeteres, meters, or kilometers
 * @param {Number} cm Centimeter value to convert
 * @returns {String}
 */
export function convertDistanceStat(cm) {
    return cm >= 100000000 ?
        `${numCommas(Math.round(cm / 100000))} kilometers` : // 1k kilometers or more
        cm >= 100000 ?
            `${(cm / 100000).toFixed(1)} kilometers` : // Kilometers
            cm >= 100 ?
                `${cm / 100} meters` : // Meters
                `${cm} cm`; // Centimeters
}

export function capitalizeFL(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
