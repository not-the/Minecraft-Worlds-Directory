// Shorthand
//#region 
function dom(sel) {return document.querySelector(sel);}
function store(key, value) {
    if(value) localStorage.setItem(key, value);
    else return localStorage.getItem(key);
}

// Page elements
// const galleryScrollArea = dom('#gallery_scroll_area');
const body =            dom('body');
const headerImage =     dom('#header_image');
const headerImageOffset = dom('#header_img_offset');
const smallGallery =    dom('#small_gallery');
const playerCount =     dom('#player_count');
const imageCount =      dom('#image_count');
const imageViewer =     dom('#image_viewer');
const enlarged =        dom('#enlarged');
const viewerInfo =      dom('#viewer_info');
const viewerTooltip =   dom('#viewer_tooltip');

const imageSort =       dom('#image_sort');
const listType =        dom('#list_type');  // list type
const orderSort =       dom('#list_order'); // sort by
const orderSortL =      dom('#list_order_label');
const sortBy =          dom('#list_sort');  // filter
const sortByL =          dom('#list_sort_label');

const mainList =        dom('#main_list');
const numberHidden =    dom('#number_hidden');

const bigBackground =   dom('#main_bg_img');
const overlayContainer = dom('#overlay_container');
const content =         dom('#content');
const backdrop =        dom('#backdrop');

// Buttons
const copyLinkButton =  dom('#copy_link');
const contentBack =     dom('#content_back');
const pinButton = dom('#bg_favorite');

// Info
const title =           dom('#title');
const description =     dom('#description');
const start_date =      dom('#start_date');
const end_date =        dom('#end_date');
const version =         dom('#version');
const mode =            dom('#mode');
const players =         dom('#players');
const download_button = dom('#download_button');
const download_url =    dom('#download_url');
const videos =          dom('#videos');
const notice =          dom('#notice');

// Statistics
const statsTooltip =    dom('#stats_tooltip');

const playerPopup =     dom('#player_popup');
const playerPopupBox =  dom('#player_popup_box');
const statsUsername =   dom('#stats_username');
const statsPlayerHead = dom('#stats_player_head');
const statsWorld =      dom('#stats_world');
const statsTable =      dom('#stats_table');

const stats_collapse_all = dom('#stats_collapse_all');
//#endregion


function getImageFolderName(name) {
    return name.replace(':', '');
}


// Keyboard controls
body.addEventListener('keydown', e => {
    // console.log(e.key);

    // Enter to select (For accessibility / keyboard navigation)
    if(
        e.code == 'Enter' &&
        document.activeElement.tagName != 'summary'
    )

    // Escape to go back
    if(e.code == "Escape") {
        if(statsOpen) closeStats();
        else if(viewerOpen) closeImage();
        else if(contentOpen) closeContent();
    }

    // While image viewer is open
    if(viewerOpen) {
        // Image viewer arrow keys
        if(e.code == "ArrowLeft") viewerScroll('up');
        else if(e.code == "ArrowRight") viewerScroll('down');

        // F to fullscreen
        if(e.code == 'KeyF') {
            if(!document.fullscreenElement) {
                body.requestFullscreen();
                viewerTooltip.classList.add('hidden');
                galleryTooltipComplete = true;
            } else {
                document.exitFullscreen();
            }
        }
    }

    // Left and right arrow keys to navigate between world items
    // if(contentOpen == true && viewerOpen == false) {
    //     if(e.code == 'ArrowLeft') {
    //         closeContent();
    //         setInterval(() => {
    //             openContent(selection + 1);
    //         }, 500);
    //     }
    // }

});

// Image viewer scroll to navigate
imageViewer.addEventListener('mousewheel', e => {
    direction = e.wheelDelta < 0 ? 'down' : 'up';
    galleryTooltipComplete = true;
    viewerTooltip.classList.add('hidden');
    viewerScroll(direction);
}, {passive: true});



// Main page background parallax
onscroll = () => {
    parallax();
}
content.onscroll = () => {
    contentParallax();
}
function parallax() {
    window.requestAnimationFrame(() => {
        if(store('disable_parallax') == 'true') return;
        bigBackground.style.top = '-' + window.scrollY * 0.3 + 'px';
    });
}
function contentParallax() {
    window.requestAnimationFrame(() => {
        if(content.scrollTop > 500) return;
        if(store('disable_parallax') == 'true') return;
        headerImageOffset.style.filter = `brightness(${100 - (content.scrollTop / 20)}%)`;
        headerImageOffset.style.transform = `translateY(${content.scrollTop * 0.5}px)`;
    });
}


// Mouse movement, hide info when mouse is immobile
var mouseTimer;
var mouseTimerLong;
onmousemove = e => {
    // console.log(e.movementX, e.movementY);
    // Clear any previous timers
    clearInterval(mouseTimer);
    clearInterval(mouseTimerLong);

    // Unhide
    viewerInfo.classList.remove('viewer_info_delay');
    enlarged.classList.remove('hide_mouse');

    // Fade out image info
    mouseTimer = setInterval(() => {
        viewerInfo.classList.add('viewer_info_delay');
    }, 1000);

    // Hide mouse
    mouseTimerLong = setInterval(() => {
        enlarged.classList.add('hide_mouse');
    }, 2000);
}

// List type
listType.addEventListener('change', e => { list(); });
function list() {
    // console.log(`Type: ${orderSort.value}`);
    let value = listType.value;

    if(value == 'worlds') {
        populateList();
        orderSort.disabled = false;
        orderSortL.classList.remove('disabled');
        sortBy.disabled = false;
        sortByL.classList.remove('disabled');
    }
    else {
        orderSort.disabled = true;
        orderSortL.classList.add('disabled');
        sortBy.disabled = true;
        sortByL.classList.add('disabled');
    }

    // if(value == 'screens') {
    //     populateListImages();
    // }
    if(value == 'videos') {
        populateListVideos();
    }


}
// List sort by
orderSort.addEventListener('change', e => {
    console.log(`Sorting by ${orderSort.value}`);

    if(orderSort.value != 'videos' && orderSort.value != 'screens') populateList();
    else if(orderSort.value == 'videos') populateListVideos();
    // else {populateListImages();}
    // search_raw[0] = `s=${orderSort.value}`;
    // document.location.search = search_raw.filter(Boolean).join('?');
});
// List filter event listener
sortBy.addEventListener('change', e => {
    console.log(`Filtering by ${sortBy.value}`);
    list();
    // search_raw[1] = `f=${sortBy.value}`;
    // document.location.search = search_raw.filter(Boolean).join('?');
});
// Image sorting
var imageSortValue = 'New-Old';
imageSort.addEventListener('change', e => {
    if(imageSortValue !== imageSort.value) {
        imageSortValue = imageSort.value;
        loadImages();
    }
});


// // List item template
//#region 
// `<div id="world0" class="world_item">
//     <!-- Click Detection -->
//     <div class="open_area" onclick="openContent(0)"></div>

//     <!-- Download -->
//     <a class="download_button list_dl" id="download0" target="_blank" rel="noopener noreferrer">
//         World Download
//     </a>

//     <!-- Title -->
//     <h2 class="title">
//         Title Text
//     </h2>
//     <p class="mini_info">2021 - Present</p>
// </div>`;
//#endregion


// Variables
var gallery = [];
var selection; // Number ID of current item
var statsSelection;
var allCollapsed = false;
var contentOpen = false;
var viewerOpen = false;
var statsOpen = false;
var galleryTooltipComplete = false;


// Populate world list
function populateList() {
    var listHTML = '';
    let resultCount = 0;

    for(si = 0; si < sort_order[orderSort.value].length; si++) {
        let compare = sort_order[orderSort.value]
        
        if(compare[si][0] == '#') {
            listHTML += `<h2 class="list_separator">${compare[si].substring(1)}</h2>`;
        }

        // Loop list to find next item
        for(di = 0; di < pageData.length; di++) {
            // console.log(pageData[di]);

            let world = pageData[di];

            if(world.name != compare[si] ) continue;

            // Vanilla sort: Skip modded
            if(sortBy.value == 'vanilla' && !(world.modded == 'Vanilla' || world.modded == 'Vanilla Snapshot') ) continue;
            // Modded sort: Skip vanilla
            else if(sortBy.value == 'modded' && (world.modded == 'Vanilla' || world.modded == 'Vanilla Snapshot') ) continue;
            // World download filter
            else if(sortBy.value == 'world_download' && world.download == '') continue;
            // Singleplayer filter
            else if(sortBy.value == 'singleplayer' && !(world.mode == 'Singleplayer') ) continue;
            // Multiplayer filter
            else if(sortBy.value == 'multiplayer' && !(world.mode == 'Multiplayer') ) continue;
            // Statistics filter
            else if(sortBy.value == 'statistics' && world.stats == false) continue;

            resultCount++;
            listHTML += worldHTML(world);
        }
    }

    mainList.innerHTML = listHTML;
    console.log(resultCount, pageData.length, pageData.length - resultCount);

    if(resultCount != pageData.length && orderSort.value != 'videos') {
        console.log("Some results are hidden");
        numberHidden.innerText = `${pageData.length - resultCount} items were hidden because they did not match your filter`;
    } else {
        numberHidden.innerText = '';
    }
}

// Populate list with videos
function populateListVideos() {
    var listHTML = '';

    // Loop list to find next item
    for(di = 0; di < pageData.length; di++) {
        let world = pageData[di];
        if(world.videos.length < 1) continue;

        listHTML += `<h2 class="list_separator">${world.name}</h2>`;
        listHTML += worldHTML(world);
        listHTML += '<br/>';

        // Videos loop
        for(let vi = 0; vi < world.videos.length; vi++) {
            let video = world.videos[vi];
            listHTML += videosHTML(video);
        }
    }

    mainList.innerHTML = listHTML;
}

// Populate list with images
// function populateListImages() {
//     var listHTML = '<div class="small_gallery">';

//     // Loop list to find next item
//     for(di = 0; di < 1; di++) {
//         let world = pageData[di];

//         if(world.images.length < 1) continue;

//         listHTML += `<h2 class="list_separator">${world.name}</h2><br>`;
//         // Images loop
//         for(let vi = 0; vi < world.images.length; vi++) {
//             selection = di;
//             listHTML += loadImages(mainList, true);
//         }
//     }
//     mainList.innerHTML = listHTML;
// }

/** World item HTML template */
function worldHTML(world) {
    let blurb = orderSort.value == 'screen_count' ? `${world.images.length} screenshots`
    : sortBy.value == 'modded' ? world.modded : `${world.startDate} to ${world.endDate}`;
    return `<div id="${world.name.split(' ').join('_')}" class="world_item" style="background: ${world.header_image || world.header_image == 0 ? 'linear-gradient(90deg, rgb(39, 39, 39) 20%, transparent 100%),' : ''} url('${getImageFolderName(world.name)}/${world.images[ world.header_image ]}')">
        <!-- Click Detection -->
        <div class="open_area" onclick="openContent(${di})" onmouseover="bigBackgroundSrc(${di})" tabindex=0></div>
    
        <!-- Download -->
        <a class="download_button list_dl ${world.download == '' ? 'disabled' : ''}" id="download${di}" target="_blank" rel="noopener noreferrer" ${world.download == '' ? '' : `href="${world.download}"`}>
            ${world.download == '' ? 'No Download' : `World Download`}
        </a>
    
        <!-- Title -->
        <h2 class="title">
            ${world.name}
        </h2>
        <p class="mini_info">${blurb}</p>
    </div>`;
}

// Load images
function loadImages(destination = smallGallery, only_return = false) {
    let imagesList = pageData[selection].images;
    var imgHTML = "";

    if(imagesList.length !== 0) {
        // When there are images available 'Old-New' 'New-Old'
        // for(ii = 0; ii < imagesList.length; ii++) {...}

        if(imageSortValue == 'Old-New') for(ii = 0; ii < imagesList.length; ii++) imgHTML += html(imagesList, ii);
        else for(ii = imagesList.length - 1; ii >= 0; ii--) imgHTML += html(imagesList, ii);
    } else if(only_return == false) {
        let imgHTML = '<p style="text-align: center">No images available</p>';
    }

    // To page
    if(only_return == false) {
        destination.innerHTML = imgHTML;
    }
    return imgHTML;

    function html(imagesList, ii) {
        return `<img
            src="${getImageFolderName(pageData[selection].name)}/${imagesList[ii]}"
            alt="${imagesList[ii]}"
            id="image${ii}"
            title="${imagesList[ii]}"
            onclick="viewImage(${ii})"
            loading="lazy">`;
    }
}

// Open item from list
function openContent(num) {
    contentOpen = true;

    // Accesibility: disable tab index of main list when it isn't visible
    // This doesn't work, even if it did it would do this for everything including selectable elements inside of the content viewer
    // document.querySelectorAll('div', 'a', 'select', 'button').forEach(element => {
    //     this.tabIndex = -1;
    // })

    // Avoid changing page if the same item is being reopened
    if(num !== selection) {
        fillPage(num);
    }

    selection = num;

    console.log(`Opening world ${num}`);
    // updateHash();

    // Content
    content.scrollTo(0, 0);
    content.classList.add('visible');
    content.classList.add('content_in');

    // Backdrop
    backdrop.classList.add('visible');
    // backdrop.classList.add('fade_in');

    // Disable body scroll
    body.classList.add('overflow_hidden');

    // Skip main page and focus first element in #content
    contentBack.focus();

    // Auto load images
    loadImages();

    // Hide after animation completes
    setTimeout(() => {
        content.classList.remove('content_in');
        // backdrop.classList.remove('fade_in');
    }, 300);
}

// Close Content
function closeContent() {
    contentOpen = false;
    copyLinkButton.classList.remove('copied');

    // Enable body scroll
    body.classList.remove('overflow_hidden');

    content.classList.add('content_out');
    // backdrop.classList.add('fade_out');

    backdrop.classList.remove('visible');

    download_button.removeAttribute("href");
    // videos.innerHTML = '';
    smallGallery.innerHTML =
        `<button id="load_images" onclick="loadImages()">
            Load Images
        </button>`;

    // Remove hash data
    // updateHash();
    // document.location.hash = '';

    setTimeout(() => {
        content.classList.remove('visible');
        content.classList.remove('content_out');
        // backdrop.classList.remove('visible');
        // backdrop.classList.remove('fade_out');
    }, 300);
}

// Big background on mouse over
var bigBackgroundID;
var bgURL;
function bigBackgroundSrc(num, animate, any, override=false) {
    if(store('disable_hover_bg') == 'true' && any != true) return;

    let d = pageData[num];
    let src;

    // Only change if new bg is different
    if(num !== bigBackgroundID) {
        bigBackgroundID = num;
        // Set big background
        if(!any) {
            src = `${getImageFolderName(d.name)}/${d.images[ d.header_image ]}`;
        } else {
            // Random non-header image
            let roll = Math.floor(Math.random() * d.images.length);
            src = `${getImageFolderName(d.name)}/${d.images[ roll ]}`;
        }
        if(override != false) { src = override; }
        bgURL = src;

        bigBackground.style.background =
        `linear-gradient(0deg, var(--content-bg) 0%, transparent 60%),
        linear-gradient(30deg, var(--content-bg) 40%, transparent 100%),
        url('${src}')`;

        // Animate
        if(animate != 'no') {
            bigBackground.classList.remove('big_background_animate');
            bigBackground.classList.add('big_background_animate');

            setTimeout(() => {
                bigBackground.classList.remove('big_background_animate');
            }, 500);
        }
    }

}

// Image viewer button navigation
function viewerScroll(direction) {
    if(direction == 'up') {
        if(imageID - 1 < 0) return;
        imageID -= 1;
    } else {
        if(imageID + 2 > pageData[selection].images.length) return;
        imageID += 1;
    }

    console.log(imageID);
    viewImageSrc();
}

// Enlarge image
var imageID;
function viewImage(id) {
    console.log(`Enlarging image ${id}`);
    viewerOpen = true;

    // Auto hide navigation tooltip
    if(galleryTooltipComplete == false) {
        setInterval(() => {
            viewerTooltip.classList.add('hidden');
            galleryTooltipComplete = true;
        }, 10000);
    }

    // Disable content scroll
    content.classList.add('overflow_hidden');

    imageViewer.classList.add('visible');
    imageViewer.classList.add('image_in');

    imageID = id;

    viewImageSrc(id);

    // updateHash();
}

// Set enlarged image
function viewImageSrc() {
    // enlarged.src = `./images/blank.png`;
    let d = pageData[selection];

    // File info
    viewerInfo.innerHTML = /* htmla */
    `<div>
        <p class="weight100 hover_underline pointer" onclick="copyImageURL()" id="copy_image_url">Filename: ${d.images[imageID]}</p>
        <p>${imageID + 1} / ${d.images.length} ${imageID == d.header_image ? '<img src="./images/star.png" alt="Header image" class="inline_icon" title="Header image">' : ''}</p>
    </div>
    
    <div style="text-align: right">
        ${d.image_caption[imageID + 1] == undefined ?
            `<p class="weight100 secondary_text">No caption</p>`
          : `<p class="weight100"><i>"${d.image_caption[imageID + 1]}"</i></p>`}
        <p class="weight100">Source: <b>${d.image_credit[imageID + 1] == undefined || !(d.image_credit.hasOwnProperty([imageID + 1])) ? 'NotNone' : d.image_credit[imageID + 1]}</b></p>
    </div>`;
    

    // Change image
    enlarged.src = `${getImageFolderName(d.name)}/${d.images[imageID]}`;
}
function copyImageURL() {
    // Page hash link
    // copyLink(`${ document.location.href.split('#')[0]}#${getImageFolderName(pageData[selection].name).split(' ').join('_') }/${imageID}`);
    let d = pageData[selection];
    copyLink(`${ document.location.href.split('#')[0]}/${getImageFolderName(pageData[selection].name).split(' ').join('%20')}/${d.images[imageID]}`);
    dom("#copy_image_url").classList.add('copied');
}

// Close enlarged image
function closeImage() {
    viewerOpen = false;
    try   {document.exitFullscreen();}
    catch (error) { console.warn(error); }
    

    // Enable content scroll
    content.classList.remove('overflow_hidden');

    // Animate
    imageViewer.classList.remove('image_in');
    imageViewer.classList.add('image_out');

    // updateHash();

    setTimeout(() => {
        imageViewer.classList.remove('visible');
        imageViewer.classList.remove('image_out');
    }, 200);
}

// Fill out data in content popup
function fillPage(num) {
    let d = pageData[num];
    // let playerList = d.players.toString().replace(/,/g, ', ');
    // console.log(players);

    // Header Image
    headerImage.src = d.images.length > 0 ? `/${getImageFolderName(d.name)}/${d.images[ d.header_image ]}` : `images/blank.png`;
    headerImage.title = d.images[ d.header_image ];
    title.innerText = `${d.name}`;
    description.innerText = `${d.description}`;
    start_date.innerText = `${d.startDate}`;
    end_date.innerText = `${d.endDate}`;
    version.innerText = `${d.version} / ${d.modded}`;
    mode.innerText = `${d.gamemode} ${d.mode}`;
    playerCount.innerText = d.players.length;
    imageCount.innerText = d.images.length;

    // players.innerText = playerList;
    if(d.download.length > 3) {
        download_button.classList.remove('disabled');
        download_button.innerText = "World Download";
        // download_button.addAttribute("href");
        download_button.href = `${d.download}`;
        // console.log("Yes URL");
    } else {
        download_button.classList.add('disabled');
        download_button.innerText = "No Download";
        // download_button.removeAttribute("href");
        // console.log("No URL");
    }

    // If videos are available
    if(d.videos.length > 0) {
        console.log('Yes video');
        let videoHTML = `<h2>Videos <span class="secondary_text small">(<span id="player_count">${d.videos.length}</span>)</span></h2>`;
        for(vi = 0; vi < d.videos.length; vi++) {
            let video = d.videos[vi];
            // console.log(d.videos[vi]);

            videoHTML += videosHTML(video);
        }
        videos.innerHTML = videoHTML;
    } else {
        videos.innerHTML = '';
    }

    // Players list
    let playerHTML = '<p>Player list not available</p>';
    if(d.players.length != 0) {
        playerHTML = '';
        for(let pi = 0; pi < d.players.length; pi++) {
            let username = d.players[pi];
            // let href = '';
            let onclick = '';
            let css = '';
            if(username != 'Unlisted') {
                // href = ` href="https://namemc.com/profile/${username}${username.includes('.') ? '' : '.1'}" target="_blank" rel="noopener noreferrer"`;
                onclick = `onclick="openStats('${username}', ${pi})"`;
            } else { css = 'secondary_text'; }
            
            // Namemc link version
            // playerHTML +=
            // `<a${href} class="${css}">
            //     ${username == d.owners ? '<img src="./images/crown.png" alt="Owner" class="inline_icon owner_crown" title="Server Owner">' : ''}
            //     ${username.split('.')[0]}
            // </a>, `;

            playerHTML +=
            `<span class="hover_underline pointer ${css}"${onclick} tabindex="0">
                ${username == d.owners ? '<img src="./images/crown.png" alt="Owner" class="inline_icon owner_crown" title="Server Owner">' : ''}
                ${username.split('.')[0]}</span>, `;
        }
    }
    players.innerHTML = playerHTML.substring(0, playerHTML.length - 2);
    // Player stats tooltip
    if(d.stats == true) {
        statsTooltip.classList.remove('hidden');
        statsTooltip.classList.remove('position_absolute');
    } else {
        statsTooltip.classList.add('hidden');
        statsTooltip.classList.add('position_absolute');
    }

    // Notice message
    if(d?.notice != undefined) {
        notice.classList.add('visible');
        notice.innerText = d.notice;

    } else {
        notice.classList.remove('visible');
    }
}

// Video HTML
function videosHTML(video) {
    return `
    <div class="video_item flex">
        ${video.iframe}
        <div>
            <h3>${video.title}</h3>
            <p class="secondary_text">${video.date}</p>
            <p class="secondary_text" style="font-weight: 100;">${video.desc == false ? 'No description available' : video.desc}</p>

            <div class="uploader_card flex">
                <img src="${profileData[video.uploader].pfp}" alt="" class="yt_pfp">
                <p class="yt_name">${profileData[video.uploader].name}</p>
            </div>
        </div>
    </div>`;
}

// fillPage(2);

// Copy URL Button
function copyLink(url = 'auto-page') {
    copyLinkButton.classList.add('copied');

    const copyMe = dom('#copy_me');
    if(url == 'auto-page') {
        copyMe.value = `${document.location.href.split('#')[0]}#${pageData[selection].name.split(' ').join('_')}`;
    } else {
        copyMe.value = url;
    }
    
    copyMe.focus();
    copyMe.select();
    document.execCommand("copy");
    // copyMe.value = '';
}

// Favorite background
function pinBackground() {
    let state = (store('pinned') == null || store('pinned') == 'false');
    pinHTML(state);
    store('pinned', state ? bgURL : 'false');
}
function pinHTML(state = false) {
    if(state) {
        pinButton.innerText = '★';
        pinButton.classList.add('set');
    } else {
        pinButton.innerText = '☆';
        pinButton.classList.remove('set');
    }
}

// Run when page loads -----------------------------------
// Now off because the page no longer generates html on page load, only when filters/sort is applied
populateList();

// Pick a random big background image
let randomBG;
function rollBG() {
    // Give preset image if first page visit
    if(store('first_visit') == null) {
        bigBackground.style.background =
        `linear-gradient(0deg, var(--content-bg) 0%, transparent 60%),
        linear-gradient(30deg, var(--content-bg) 40%, transparent 100%),
        url("${featuredIMG}")`;

        store('first_visit', 'false');
        return;
    }

    randomBG = Math.floor(Math.random() * pageData.length);
    if(pageData[randomBG].images.length == 0) rollBG();
    bigBackgroundSrc(randomBG, 'no', true);
}

// Set background
if(store('pinned') == null || store('pinned') == 'false') {
    // Random
    rollBG();
} else {
    // Pinned
    let fav = store('pinned');
    // console.log(fav);
    pinHTML(true);
    bigBackgroundSrc(0, false, true, fav);
}


console.log(randomBG);




// Get JSON
// https://stackoverflow.com/a/22790025/11039898
function get(url, parse = false){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET", url, false);
    Httpreq.send(null);

    if(parse == true) return JSON.parse(Httpreq.responseText);
    return Httpreq.responseText;          
}

// Statistics viewer
const stats_nav_left =  dom('#stats_nav_left');
const stats_nav_right = dom('#stats_nav_right');
function openStats(player, num) {
    statsSelection = num;
    statsOpen = true;

    let d = pageData[selection];

    playerPopup.classList.add('visible');
    playerPopupBox.scrollTo(0, 0);
    updateStatsNav(num);

    // Get and fill out info
    let raw;
    try { raw = get(`./stats/${d.name}/${mcUUID[player]}.json`, true); }
    catch (error) {
        console.warn(error);
        closeStats();
        toast();
    }
    let stats = raw.stats;
    let dver = raw.hasOwnProperty('DataVersion'); // MC has DataVersion value (if no = old)
    // console.log(raw);

    // Title
    statsUsername.innerText = player.split('.')[0];
    statsWorld.innerText = d.name;
    statsPlayerHead.src = `./images/skin/${player}.png`;


    // Raw data table
    var tableHTML = '';


    // Table Categories
    // New MC format
    if(dver == true) {
        let keys = Object.keys(stats);

        // Easy Table
        // Playtime
        let time_played = stats['minecraft:custom']['minecraft:play_one_minute'] || stats['minecraft:custom']['minecraft:play_time'];
        dom('#stats_time_played').innerText = (time_played / 144000).toFixed(1) + ' hours'; // Raw value is in ticks, there are 20 ticks in a second

        // Deaths
        try {dom('#stats_deaths').innerText = numCommas(stats['minecraft:custom']['minecraft:deaths']);}
        catch (error) {dom('#stats_deaths').innerText = '0'}

        // Stone blocks mined
        try {dom('#stats_mined_stone').innerText = numCommas(stats['minecraft:mined']['minecraft:stone']);} catch (error) {dom('#stats_mined_stone').innerText = '0';}
        


        // Raw data
        for(i = 0; i < keys.length; i++) {
            let inner = '<table>';
            let innerkeys = Object.keys(stats[keys[i]]);
            for(k = 0; k < innerkeys.length; k++) {
                // console.log(stats[keys[i]][innerkeys[k]]);
                inner += `
                <tr>
                    <th>
                        ${innerkeys[k]}
                    </th>
                    <td>
                        ${numCommas(stats[keys[i]][innerkeys[k]])}
                    </td>
                </tr>`;
            }
            inner += '</table>';
    
            
            tableHTML += `
            <details open>
                <summary>${keys[i]}</summary>
                ${inner}
            </details>`;
    
            // console.log(stats);
        }
    }
    // Old MC format
    else {
        // Easy Table
        let time_played = raw['stat.playOneMinute'];
        dom('#stats_time_played').innerText = (time_played / 144000).toFixed(1) + ' hours'; // Raw value is in ticks, there are 20 ticks in a second
        dom('#stats_deaths').innerText = numCommas(raw['stat.deaths']);
        dom('#stats_mined_stone').innerText = '---';
        

        // Raw data
        let keys = Object.keys(raw);
        tableHTML += '<table>';
        for(i = 0; i < keys.length; i++) {
            tableHTML += `
            <tr>
                <th>
                    ${keys[i]}
                </th>
                <td>
                    ${raw[keys[i]]}
                </td>
            </tr>`;
        }
        tableHTML += '</table>';
    }

    statsTable.innerHTML = tableHTML;

    if(allCollapsed == true) collapseAll(true);
}
function closeStats() {
    statsOpen = false;
    playerPopup.classList.remove('visible');
}
function statsNav(direction) {
    let d = pageData[selection];
    let num = statsSelection;

    if(direction == 'previous') {
        if(num == 0) return;
        num--;
    } else if(num != d.players.length - d.unlisted_players - 1) {
        if(num == d.players.length - d.unlisted_players - 1) return;
        num++;
    }

    openStats(d.players[num], num);
}
function updateStatsNav(num) {
    let d = pageData[selection];

    // Arrow nav
    if(num == 0) {
        stats_nav_left.classList.add('disabled');
    } else {
        stats_nav_left.classList.remove('disabled');
    }
    if(num == pageData[selection].players.length - d.unlisted_players - 1) {
        stats_nav_right.classList.add('disabled');
    } else {
        stats_nav_right.classList.remove('disabled');
    }
}
function collapseAll(override) {
    let all = document.querySelectorAll('details');

    if(allCollapsed == false || override == true) {
        allCollapsed = true;
        stats_collapse_all.innerText = "Expand all";
        all.forEach(element => {
            element.open = false;
        });
    } else {
        allCollapsed = false;
        stats_collapse_all.innerText = "Collapse all";
        all.forEach(element => {
            element.open = true;
        });
    }
}



// Toast
const mainToast = dom('#toast');
var toastTimeout;
function toast(text) {
    if(!mainToast.classList.contains('in')) {
        mainToast.classList.add('in');
    }

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        mainToast.classList.remove('in');
    }, 3000);
}


// URL Handling
//#region 




// Update hash whenever you navigate the page
// function updateHash() {
//     let hash;

//     if(contentOpen) {
//         hash += `#${ pageData[selection].name.split(' ').join('_') }`

//         if(viewerOpen) {
//             hash += `/${imageID}`;
//         }
//     } else {
//         hash = '';
//     }

//     document.location.hash = hash;
// }


// Open #Name portion of URL on load if used
if(document.location.hash) {
    let hash = document.location.hash;
    let spaced = document.location.hash.split('/')[0].split('_').join(' ').substring(1);
    console.log(`Hash in URL found, navigating to: ${spaced}`);

    // Loop through pageData to find an item with a matching name
    for(i = 0; i < pageData.length; i++) {
        if(pageData[i].name == spaced) {
            console.log(pageData[i].name);
            openContent(i);
            break;
        }
    }

    // Navigate to specific screenshot
    if(hash.includes('/')) {
        let imageID = document.location.hash.split('/')[1];

        viewImage(imageID);
    }
}


// Set filter if search parameter is used
// Sort by : list_order
// Filter  : list_sort
let search = document.location.search;
if(search) {
    search = search.substring(1);
    let terms = search.split('?');
    // console.log(terms);
    for(i in terms) {
        let term = terms[i];
        let type = term[0] == 'f' ? sortBy : term[0] == 's' ? orderSort : null;
        if(type == null) continue;
        term = term.substring(2);
        type.value = term.toLowerCase();
    }
    populateList();
}
//#endregion





// User options
// Disable parallax
const checkboxParallax = dom('#disable_parallax');
function toggleParallax() {
    let state = checkboxParallax.checked;
    store('disable_parallax', `${state}`);

    if(state == true) { bigBackground.style.top = '0px'; }
    else { parallax(); }
}
// Disable parallax
const checkboxHover = dom('#disable_hover_bg');
function toggleHoverBG() {
    let state = checkboxHover.checked;
    store('disable_hover_bg', `${state}`);
}

// Restore settings on load
if(store('disable_parallax') != null) {
    checkboxParallax.checked = store('disable_parallax') == 'true' ? true : false;
}
if(store('disable_hover_bg') != null) {
    checkboxHover.checked = store('disable_hover_bg') == 'true' ? true : false;
}

// Comma big numbers
// https://stackoverflow.com/a/2901298/11039898
function numCommas(num) {
    var parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}