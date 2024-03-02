/** Get JSON - https://stackoverflow.com/a/22790025/11039898
 * @param {string} url JSON file URL
 * @param {boolean} parse Whether or not to convert into a JS object
 * @returns 
 */
function get(url, parse=true) {
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
function getFriendlyName(name) { return worlds[name]?.friendly ?? name.replace(/[|&:;$%@"<>()+,' ]/g, ''); }
/** Returns world name given friendly name */
function getName(friendly) { return Object.keys(worlds).find(key => worlds[key].friendly === friendly); }

/** Get header image URL from world name */
function getHeaderURL(name) {
    let friendly = getFriendlyName(name);
    let data = worlds[name];
    let file = images?.[name]?.[data.header_image];
    return file ? `/${friendly}/${file}` : '/blank.png';
}
function getThumbSrc(friendly, file) {
    return `/thumb/${friendly}/${file.replace(/.png$/i, '.jpg')}`;
}
/** Comma big numbers - https://stackoverflow.com/a/2901298/11039898
 * @param {number} num 
 * @returns {string}
 */
function numCommas(num) {
    if(num === undefined) return 0;
    var parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}



// DOM
const body = document.body;

// Data
const worlds = get('/data/worlds.json');
const images = get('/data/images.json');
const { uuids, icons, tags } = get('/data/data.json');


// ----------- Elements ----------- //
// Icon
class GIcon extends HTMLElement {
    connectedCallback() {
        this.innerHTML = icons[this.dataset.icon];
    }
}
customElements.define("g-icon", GIcon);


// Main
class MainPage extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div id="bg_image" style="--image: url('/FinnaSMP/2021-07-12_19.18.25.png');"></div>

        <!-- Nav -->
        <header class="main_header container">
            <h1>Minecraft Worlds</h1>
        </header>
        
        <nav class="main_nav flex container">
            <div class="tabs flex">
                <p class="item active" role="button" tabindex="0">Worlds</p>
                <p class="item" role="button" tabindex="0">Timeline</p>
            </div>
            <div class="buttons flex">
                <label for="sort">
                    <p>Sort:</p>
                    <select name="sort" id="sort">
                        <option value="relevant">Relevant</option>
                        <option value="chronological">Chronological</option>
                        <option value="screen_count">Screenshots</option>
                    </select>
                </label>
                <label for="filter">
                    <p>Filter:</p>
                    <select name="sort" id="sort">
                        <option value="all">All</option>
                        <option value="vanilla">Vanilla</option>
                        <option value="modded">Modded</option>
                        <option value="singleplayer">Singleplayer</option>
                        <option value="multiplayer">Multiplayer</option>
                        <option value="world_download">World Download</option>
                        <option value="statistics">Statistics</option>
                    </select>
                </label>
            </div>
        </nav>

        <!-- List -->
        <worlds-list class="container"></worlds-list>

        <!-- Footer -->
        <footer id="footer">
            <div class="inner container">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deserunt, incidunt? Atque beatae tempora velit, quam illo fugiat reprehenderit molestias voluptas nisi nam quisquam vero a error fuga nulla. Sed, facilis.
            </div>
        </footer>`;
    }
}
customElements.define("main-page", MainPage);
class WorldsList extends HTMLElement {
    connectedCallback() {
        let html = '';
        let count = 0;
        for(let [name, data] of Object.entries(worlds)) {
            // Separator 
            if(data === 0) {
                html += `<h2 class="separator">${name.substring(1)}</h2>`;
                continue;
            }

            let headerURL = getHeaderURL(name);

            html += `
            <world-item
                data-name="${name}"
                role="button" tabindex="0"
                style="
                    --image: url('${headerURL}');
                    --anim-delay: ${count*30}ms;
                    --anim-distance: ${count*20}px;
            ">
            </world-item>`;
            count++;
        };
        this.innerHTML = html;
    }
}
customElements.define("worlds-list", WorldsList);
class WorldItem extends HTMLElement {
    connectedCallback() {
        let name = this.dataset.name;
        let data = worlds[name];

        this.innerHTML = `
        <div class="col">
            <h3>${name}</h3>
            <p class="alt_text"><g-icon data-icon="calendar"></g-icon><span>${data.startDate} - ${data.endDate}<span></p>
        </div>
        <div class="col right">
            <a href="${data?.download ?? ''}" target="_blank" rel="noopener noreferrer">
                <button${data.download ? ' class="button_blue"' : ' disabled'}>
                    <p>${data.download ? 'Download' : 'No download'}</p>
                    <span></span>
                </button>
            </a>
            <div class="icons flex">
                <g-icon data-icon="${data.mode.toLowerCase()}" data-title="${data.mode}"></g-icon>
                ${data.modded !== 'Vanilla' ? '<g-icon data-icon="modded" data-title="Modded"></g-icon>' : ''}
                ${data.stats ? '<g-icon data-icon="chart" data-title="Statistics"></g-icon>' : ''}
            </div>
        </div>
        `;

        // Click
        this.addEventListener('click', event => {
            openWorld(this.dataset.name);
        });
    }
}
customElements.define("world-item", WorldItem);

function tagHTML(id) {
    let td = tags[id];
    if(td === undefined) td = tags['und'];
    let {label, icon, color} = td;
    return `
    <div class="tag" style="--color: ${color}">
        <g-icon data-icon="${icon}"></g-icon>
        <span>${label}</span>
    </div>`;
}


// World page
class WorldPage extends HTMLElement {
    connectedCallback() {
        let name = this.dataset.world;
        // console.log(name);
        let friendly = getFriendlyName(name);
        let data = worlds[name];
        let header_image = getHeaderURL(name);
        console.log(header_image);


        let players = '';
        for(let p of data.players) {
            // Unlisted
            if(p === 'Unlisted') players += `
            <span class="gray">${p}</span>\n
            `;

            // Player
            else players += `
            <span role="button" tabindex="0" onclick="viewStats('${name}', '${p}')">
                ${p === data.owners ? '<g-icon data-icon="crown" data-title="Server Owner" class="small" style="--fill: gold;"></g-icon>' : ''}
                ${p}
            </span>\n`;
        }

        let tagsHTML = ''
        tagsHTML += tagHTML(data.mode);
        tagsHTML += tagHTML(data.modded === 'Vanilla' ? 'Vanilla' : 'Modded');


        this.innerHTML = `
        <div id="bg_image" style="--image: url('${getHeaderURL(name)}');"></div>

        <div id="world">
            <div class="container">
                <header>
                    <img src="${header_image}" alt="${header_image}" role="button" tabindex="0" data-world="${name}" data-index="${data.header_image}" onclick="enlarge(this)">
                    <button class="close" onclick="goBack()">
                        <p><- Back</p>
                        <span></span>
                    </button>
                </header>
                <div class="banner flex media_flex">
                    <h1>${name}</h1>
                    <div class="buttons">
                        ${
                            data.download ?
                            `<a href="${data.download}" target="_blank" rel="noopener noreferrer">
                                <button class="button_blue">
                                    <p><g-icon data-icon="download"></g-icon> Download</p>
                                    <span></span>
                                </button>
                            </a>`
                            : ''
                        }
                        <button class="dropdown">
                            <p>▼</p>
                            <span></span>
                        </button>
                    </div>
                </div>
    
                <!-- <div class="item nopad">
                    <iframe src="https://notkal.com/minecraft-map/" frameborder="0"></iframe>
                </div> -->
        
                <div class="item flex media_flex">
                    <div class="col">
                        <div class="info">
                            <g-icon data-icon="description"></g-icon>
                            <strong>Description</strong>
                            <p class="alt_text">
                                ${data.description}
                            </p>
                        </div><br/>
        
                        <div class="info">
                            <g-icon data-icon="calendar"></g-icon>
                            <span>${data.startDate} - ${data.endDate}</span>
                        </div>
        
                        <div class="info">
                            <g-icon data-icon="${data.modded === 'Vanilla' ? 'vanilla' : 'modded'}"></g-icon>
                            <span>${data.modded} (${data.version})</span>
                        </div>

                        <div class="info">
                            <g-icon data-icon="${data.mode === 'Singleplayer' ? 'singleplayer' : 'multiplayer'}"></g-icon>
                            <span>${data.gamemode} ${data.mode}</span>
                        </div>
                    </div>
        
                    <div class="col">
                        <g-icon data-icon="multiplayer"></g-icon><strong>Players <span class="weight_500 alt_text">(16)</span></strong>
                        <p>
                            ${data.stats ? '<div class="gray">Click a player to view their stats</div>' : ''}
                            <div class="players alt_text">
                                ${players}
                            </div>
                        </p><br/>
        
                        <div class="tags flex">
                            ${tagsHTML}
                        </div>
                    </div>
                </div>
            </div>
    
            <div class="item" id="images">
                <h3>Gallery</h3>
                <w-gallery data-name="${name}"></w-gallery>
            </div>
        </div>`;
    }
}
customElements.define("world-page", WorldPage);

class WGallery extends HTMLElement {
    connectedCallback() {
        let name = this.dataset.name;
        // let data = worlds[name];
        let friendly = getFriendlyName(name);
        let imagesList = images[name];
        let html = '';

        for(let i in imagesList) {
            let file = imagesList[i];
            html += `<img src="${getThumbSrc(friendly, file)}" alt="${file}" role="button" tabindex="0" loading="lazy" data-world="${name}" data-index="${i}">`;
        };

        this.innerHTML = html;

        // Click
        this.querySelectorAll('img').forEach(element => element.addEventListener('click', event => {
            enlarge(event.target);
        }));
    }
}
customElements.define("w-gallery", WGallery);


class PlayerStats extends HTMLElement {
    static observedAttributes = ["data-world", "data-player", "data-stat"];

    connectedCallback() {
        this.populate();
    }

    close() {
        this.remove();
        document.querySelector('.backdrop').remove();
    }

    populate() {
        let {world, username} = this.dataset;
        let data = worlds[world];
        let uuid = uuids[username];

        // Fetch data
        let {stats, dataVersion} = get(`/data/stats/${world}/${uuid}.json`);
        let time_played =
            stats?.['minecraft:custom']?.['minecraft:play_one_minute'] ??
            stats['minecraft:custom']?.['minecraft:play_time'];
        time_played = time_played < 72000 ?
            (time_played/1200).toFixed(0) + ' minutes' : // Minutes
            (time_played / 144000).toFixed(1) + ' hours'; // Hours

        // Player list
        let playersList = '';
        for(let p of data.players) {
            if(p === 'Unlisted') continue;
            playersList += `
            <div
                class="player${username === p ? ' active' : ''}"
                role="button" tabindex="0"
                ${data.stats ? ` onclick="viewStats(undefined, '${p}')` : ''}"
            >
                <img src="https://mc-heads.net/avatar/${uuids[p]}">
                <span>${p}</span>
            </div>`;
        }

        // Raw
        let rawHTML = '';
        for(let [category, catData] of Object.entries(stats)) {
            let inner = '<table>'
            for(let [key, value] of Object.entries(catData)) {
                inner += `
                <tr role="button" tabindex="0">
                    <th>${key}</th>
                    <td>${numCommas(value)}</td>
                    <td class="compare"><g-icon data-icon="compare"></g-icon></td>
                </tr>`
            }
            inner += '</table>';
            rawHTML += `
            <details open>
                <summary>${category}</summary>
                ${inner}
            </details>`;
        }

        // HTML
        let html = `
        <div class="col left">
            <button class="close" onclick="goBack()">
                <p><- Back</p>
                <span></span>
            </button>
            ${playersList}
        </div>
        <div class="col right">
            <h3>${username}</h3>
            <p class="alt_text">Statistics for <b>${world}</b></p>
            <br/>
            <h5>Stats</h5>
            <table>
                <tr role="button" tabindex="0" onclick="viewStats(undefined, undefined, 'time_played')">
                    <th>Time Played</th>
                    <td>${time_played}</td>
                    <td class="compare"><g-icon data-icon="compare"></g-icon></td>
                </tr>
                <tr role="button" tabindex="0">
                    <th>Deaths</th>
                    <td>${numCommas(stats?.['minecraft:custom']?.['minecraft:deaths'])}</td>
                    <td class="compare"><g-icon data-icon="compare"></g-icon></td>
                </tr>
                <tr role="button" tabindex="0">
                    <th>Stone blocks mined</th>
                    <td>${numCommas(stats?.['minecraft:mined']?.['minecraft:stone'])}</td>
                    <td class="compare"><g-icon data-icon="compare"></g-icon></td>
                </tr>
            </table>
            <br/>
            <div class="flex">
                <h5>Raw Data</h5>
                <!-- <span class="auto_collapse hover_underline" role="button" tabindex="0">Expand all</span> -->
            </div>            
            ${rawHTML}
        </div>
        `;

        this.innerHTML = html;
    }

    attributeChangedCallback(attribute, old, value) {
        this.populate();
    }
}
customElements.define("player-stats", PlayerStats);


class ImgEnlarged extends HTMLElement {
    static observedAttributes = ["data-index"];

    // Left/right controls
    navigate(dir) {
        let worldImages = images[this.dataset.world];
        let to = Number(this.dataset.index) + dir;
        if(to < 0 || to > worldImages.length-1) return;
        this.dataset.index = Number(this.dataset.index) + dir;
    }

    close() {
        this.remove();
        document.querySelector('.backdrop').remove();
    }

    connectedCallback() {
        let data = worlds[this.dataset.world];
        let src = this.dataset.src;
        this.innerHTML = `
        <img src="${src}" alt="${src}" id="image"></img>
        <img-info class="alt_text" data-world="${this.dataset.world}" data-src="${src}" data-index="${this.dataset.index}"></img-info>
        `;
        this.classList.add('idle');

        // Click
        this.addEventListener('click', event => {
            this.close();
        });

        // Wheel
        this.addEventListener('wheel', event => {
            let dir = -Math.sign(event.wheelDelta);
            this.navigate(dir);
        });

        // Idle mouse
        let timer;
        let ready = true;
        let lastPos = {};
        this.addEventListener('mousemove', event => {
            if(ready === false) return;

            let distance = Math.sqrt(Math.pow(lastPos.y - event.clientY, 2) + Math.pow(lastPos.x - event.clientX, 2));
            lastPos.x = event.clientX;
            lastPos.y = event.clientY;
            if(distance < 2) return;

            this.classList.remove('idle');
            void this.offsetWidth;
            this.classList.add('idle');

            ready = false;
            timer = setTimeout(() => {
                ready = true;
                clearTimeout(timer);
            }, 1500);
        })
    }
    attributeChangedCallback(attribute, old, value) {
        // Update image
        let name = this.dataset.world;
        let friendly = getFriendlyName(name);
        this.dataset.src = `/${friendly}/${images[name][this.dataset.index]}`;

        let src = this.dataset.src;
        let img = this.querySelector('#image');
        if(img) {
            img.src = getThumbSrc(friendly, src.split('/')[2]);
            img.src = src;
        }

        // Update info
        let info = this.querySelector('img-info');
        if(info) info.connectedCallback();
    }
}
customElements.define("img-enlarged", ImgEnlarged);

class ImgInfo extends HTMLElement {
    static observedAttributes = ["data-index"];

    connectedCallback() {
        let enlarged = document.querySelector('img-enlarged');
        let name = enlarged.dataset.world;
        let data = worlds[name];
        let worldImages = images[name];
        let src = enlarged.dataset.src;
        let index = Number(enlarged.dataset.index);

        let caption = data?.image_caption?.[index+1];
        console.log(data);
        caption =  caption === undefined ?
            `<span class="gray">No caption</span>` :
            `<i>"${caption}"</i>`;

        this.innerHTML = `
        <div class="left">
            <p>${src.substring(src.lastIndexOf('/') + 1)}</p>
            <strong><span>${index+1} / ${worldImages.length}</span> <g-icon data-icon="star" class="small title_above" data-title="Header Image"></g-icon></strong>
        </div>
        <div class="right">
            <p class="alt_text">${caption}</p>
            <p>Source: <strong>${data.image_credit?.[index+1] ?? 'NotNone'}</strong></p>
        </div>
        `;
    }
}
customElements.define("img-info", ImgInfo);


// Enlarge image
function enlarge(element) {
    // Image SRC
    let friendly = getFriendlyName(element.dataset.world);
    let src = `/${friendly}/${images[element.dataset.world][Number(element.dataset.index)]}`;

    // Animation
    let rect = element.getBoundingClientRect();
    let anim = document.createElement('img');
    anim.style.width = `${rect.width}px`;
    anim.style.transform = `translate(${rect.left}px, ${rect.top-400}px)`;
    anim.src = element.src;
    // anim.src = src;
    anim.classList.add('img_anim');
    body.appendChild(anim);

    // Move anim
    setTimeout(() => {
        anim.style.width = '100vw';
        anim.style.height = '100vh';
        anim.style.transform = 'none';
    }, 1);

    createBackdrop();

    // Image viewer
    setTimeout(() => {
        // Create popup
        let enlarged = document.createElement('img-enlarged');
        enlarged.dataset.src = anim.src;
        enlarged.dataset.src = src;
        enlarged.dataset.world = element.dataset.world;
        enlarged.dataset.index = element.dataset.index;
        body.appendChild(enlarged);

        enlarged.querySelector('#image').onload = () => {
            anim.remove();
        }
    }, 350);
}

function viewStats(world, username, statistic='none') {
    let existing = document.querySelector('player-stats');
    let element = existing ?? document.createElement('player-stats');
    element.dataset.world    = world    ?? element.dataset.world;
    if(username) element.dataset.username = username;
    element.dataset.username = username;
    if(existing) return existing.populate();
    createBackdrop();
    body.appendChild(element);
}

function createBackdrop() {
    // Backdrop
    let backdrop = document.createElement('div');
    backdrop.classList.add('backdrop');
    body.appendChild(backdrop);
}


// ----------- Router ----------- //
function processAjaxData(response, urlPath, method='pushState'){
    body.innerHTML = response.html;
    document.title = response.pageTitle;
    history[method]({"html":response.html,"pageTitle":response.pageTitle},"", location.pathname/*urlPath*/);
    window.scrollTo(...response.scroll);
}

let first_load = true;

// Main page
if(location.pathname === '/' || location.pathname === '/404.html') processAjaxData(
    {
        html: '<main-page></main-page>',
        pageTitle: "Minecraft Worlds",
        scroll: [window.scrollX, window.scrollY]
    },
    location.pathname,
    first_load ? 'replaceState' : undefined
);
first_load = false


// World
function openWorld(name) {
    processAjaxData({
        html: `<world-page data-world="${name}"></world-page>`,
        pageTitle: "Finna SMP",
        scroll: [window.scrollX, window.scrollY]
    },
    `${getFriendlyName(name)}`,
    first_load ? 'replaceState' : undefined
    );
}

// DEBUG
// openWorld('Vanilla servor');
// viewStats('Vanilla servor', 'NotNone');

if(location.pathname !== '/' && location.pathname !== '/404.html') {
    let friendly = location.pathname.split('/')[1];
    let name = getName(friendly);
    openWorld(name);
}


window.addEventListener("popstate", (e) => {
    if(e.state) {
        body.innerHTML = e.state.html;
        document.title = e.state.pageTitle;
        // window.scrollTo(0, 0);
    }
});


function goBack() {
    let enlarged = document.querySelector('img-enlarged');
    let world_page = document.querySelector('world-page');
    let player_stats = document.querySelector('player-stats');

    if(enlarged) enlarged.close();
    else if(player_stats) player_stats.close();
    else if(world_page) history.back(); // temporary
}



// Event listeners
document.addEventListener('keydown', event => {
    const key = event.key.toLowerCase();

    let enlarged = document.querySelector('img-enlarged');

    // Escape
    if(key === 'escape') {
        goBack();
    }
    // Arrow keys
    else if(key.startsWith('arrow')) {
        let dir = key === 'arrowleft' || key === 'arrowup' ? -1 : 1;
        if(enlarged) enlarged.navigate(dir);
    }
    // Fullscreen
    else if(key === 'f') {
        document.fullscreenElement ? document.exitFullscreen() : body.requestFullscreen();
    }
})

document.addEventListener('scroll', event => {
    requestAnimationFrame(() => {
        document.getElementById("bg_image").style.transform = `translateY(${window.scrollY*0.6}px)`;

        let headerImg = document.querySelector("#world header > img");
        if(headerImg) {
            headerImg.style.transform = `translateY(${window.scrollY*0.4}px)`;
            headerImg.style.filter = `brightness(${100 - (window.scrollY / 20)}%)`;
        }
    })
})
