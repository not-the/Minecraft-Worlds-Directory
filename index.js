// Shorthand
//#region 
function dom(sel) {return document.querySelector(sel);}

// Page elements
// const galleryScrollArea = dom('#gallery_scroll_area');
const body =            dom('body');
const headerImage =     dom('#header_image');
const smallGallery =    dom('#small_gallery');
const playerCount =     dom('#player_count');
const imageCount =      dom('#image_count');
const imageViewer =     dom('#image_viewer');
const enlarged =        dom('#enlarged');
const viewerInfo =      dom('#viewer_info');
const viewerTooltip =   dom('#viewer_tooltip');

const imageSort =       dom('#image_sort');
const sortBy =          dom('#list_sort');
const orderSort =       dom('#list_order');
const mainList =        dom('#main_list');
const numberHidden =    dom('#number_hidden');

const bigBackground =   dom('#main_bg_img');
const overlayContainer = dom('#overlay_container');
const content =         dom('#content');
const backdrop =        dom('#backdrop');

const copyLinkButton =  dom('#copy_link');

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
//#endregion

// Keyboard controls
body.addEventListener('keydown', e => {
    // console.log(e.key);

    // Enter to select (For accessibility / keyboard navigation)
    if(e.code == 'Enter') {
        document.activeElement.click();
    }

    // Escape to go back
    if(e.code == "Escape") {
        if(viewerOpen) {
            closeImage();
        } else if(contentOpen) {
            closeContent();
        }
    }

    // While image viewer is open
    if(viewerOpen) {
        // Image viewer arrow keys
        if(e.code == "ArrowLeft") { viewerScroll('up'); }
        else if(e.code == "ArrowRight") { viewerScroll('down'); }

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
    if(localStorage.getItem('disable_parallax') == 'true') return;
    parallax();
}
function parallax() { bigBackground.style.top = '-' + window.scrollY * 0.3 + 'px'; }

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

// List filter event listener
sortBy.addEventListener('change', e => {
    console.log(`Sorting by ${sortBy.value}`);
    populateList();
});
// List sort order
orderSort.addEventListener('change', e => {
    console.log(`Sorting by ${orderSort.value}`);

    if(orderSort.value != 'Videos' && orderSort.value != 'Screens') {populateList();}
    else if(orderSort.value == 'Videos') {populateListVideos();}
    // else {populateListImages();}
});
// Image sorting
var imageSortValue = 'Old-New';
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
var contentOpen = false;
var viewerOpen = false;
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
            if(sortBy.value == 'Vanilla' && !(world.modded == 'Vanilla' || world.modded == 'Vanilla Snapshot') ) continue;
            // Modded sort: Skip vanilla
            else if(sortBy.value == 'Modded' && (world.modded == 'Vanilla' || world.modded == 'Vanilla Snapshot') ) continue;
            else if(sortBy.value == 'World_download' && world.download == '') continue;
            // Singleplayer sort
            else if(sortBy.value == 'Singleplayer' && !(world.mode == 'Singleplayer') ) continue;
            // Multiplayer sort
            else if(sortBy.value == 'Multiplayer' && !(world.mode == 'Multiplayer') ) continue;


            resultCount++;

            let blurb = sortBy.value == 'Modded' ? world.modded : `${world.startDate} to ${world.endDate}`;

            listHTML +=
            `<div id="${world.name.split(' ').join('_')}" class="world_item" style="background: ${world.header_image || world.header_image == 0 ? 'linear-gradient(90deg, rgb(39, 39, 39) 20%, transparent 100%),' : ''} url('images/${world.name}/${world.images[ world.header_image ]}')">
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
    }

    mainList.innerHTML = listHTML;
    console.log(resultCount, pageData.length, pageData.length - resultCount);

    if(resultCount - pageData.length > 0) {
        console.log("Some results are hidden");
        numberHidden.innerText = `${pageData.length - resultCount} results were hidden because they did not match your filter`;
    }
}

// Populate list with videos
function populateListVideos() {
    var listHTML = '';

    // Loop list to find next item
    for(di = 0; di < pageData.length; di++) {
        let world = pageData[di];

        if(world.videos.length < 1) continue;

        listHTML += `<h2 class="list_separator">${world.name}</h2><br>`;
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
//     var listHTML = '';

//     // Loop list to find next item
//     for(di = 0; di < pageData.length; di++) {
//         let world = pageData[di];

//         if(world.images.length < 1) continue;

//         listHTML += `<h2 class="list_separator">${world.name}</h2><br>`;
//         // Images loop
//         for(let vi = 0; vi < world.images.length; vi++) {
//             selection = di;
//             listHTML += loadImages(mainList);
//         }
//     }
// }

// Load images
function loadImages(destination = smallGallery) {
    let imagesList = pageData[selection].images;
    var imgHTML = "";

    if(imagesList.length !== 0) {
        // When there are images available 'Old-New' 'New-Old'
        // for(ii = 0; ii < imagesList.length; ii++) {...}

        if(imageSortValue == 'Old-New') {
            for(ii = 0; ii < imagesList.length; ii++) {
                // console.log(imagesList[ii]);
                imgHTML += `<img
                    src="images/${pageData[selection].name}/${imagesList[ii]}"
                    alt="${imagesList[ii]}"
                    id="image${ii}"
                    title="${imagesList[ii]}"
                    onclick="viewImage(${ii})"
                    loading="lazy">`;
            }
        } else {
            for(ii = imagesList.length - 1; ii >= 0; ii--) {
                // console.log(imagesList[ii]);
                imgHTML += `<img
                    src="images/${pageData[selection].name}/${imagesList[ii]}"
                    alt="${imagesList[ii]}"
                    id="image${ii}"
                    title="${imagesList[ii]}"
                    onclick="viewImage(${ii})"
                    loading="lazy">`;
            }
        }


        destination.innerHTML = imgHTML;
        // return imgHTML;
    } else {
        destination.innerHTML = '<p style="text-align: center">No images available</p>';
        // return '<p style="text-align: center">No images available</p>';
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

    // Auto load images
    // loadImages();

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
    document.location.hash = '';

    setTimeout(() => {
        content.classList.remove('visible');
        content.classList.remove('content_out');
        // backdrop.classList.remove('visible');
        // backdrop.classList.remove('fade_out');
    }, 300);
}

// Big background on mouse over
var bigBackgroundID;
function bigBackgroundSrc(num, animate, any) {
    let d = pageData[num];

    // Only change if new bg is different
    if(bigBackgroundID !== num) {
        bigBackgroundID = num;
        // Set big background
        if(!any) {
            bigBackground.style.background =
            `linear-gradient(0deg, var(--content-bg) 0%, transparent 60%),
            linear-gradient(30deg, var(--content-bg) 40%, transparent 100%),
            url('images/${d.name}/${d.images[ d.header_image ]}')`;
        } else {
            // Random non-header image
            let roll = Math.floor(Math.random() * d.images.length);

            bigBackground.style.background =
            `linear-gradient(0deg, var(--content-bg) 0%, transparent 60%),
            linear-gradient(30deg, var(--content-bg) 40%, transparent 100%),
            url('images/${d.name}/${d.images[ roll ]}')`;
        }

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
    let d = pageData[selection];

    // File info
    viewerInfo.innerHTML = `<p class="weight100 hover_underline pointer" onclick="copyImageURL()" id="copy_image_url">Filename: ${d.images[imageID]}</p>
    <p>${imageID + 1} / ${d.images.length} ${imageID == d.header_image ? '<img src="./images/star.png" alt="Header image" class="inline_icon" title="Header image">' : ''}</p>`;

    // Change image
    enlarged.src = `images/${d.name}/${d.images[imageID]}`;
}
function copyImageURL() {
    copyLink(`${ document.location.href.split('#')[0]}#${pageData[selection].name.split(' ').join('_') }/${imageID}`);
    dom("#copy_image_url").classList.add('copied');
}

// Close enlarged image
function closeImage() {
    viewerOpen = false;

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
    headerImage.src = d.images.length > 0 ? `images/${d.name}/${d.images[ d.header_image ]}` : `images/blank.png`;
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
            let href = '';
            let css = '';
            if(username != 'Unlisted') {
                href = ` href="https://namemc.com/profile/${username}${username.includes('.') ? '' : '.1'}" target="_blank" rel="noopener noreferrer"`;
            } else { css = 'secondary_text'; }
            
            playerHTML +=
            `<a${href} class="${css}">
                ${username == d.owners ? '<img src="./images/crown.png" alt="Owner" class="inline_icon owner_crown" title="Server Owner">' : ''}
                ${username.includes('.') ? username.split('.')[0] : username}</a>, `;
        }
    }
    players.innerHTML = playerHTML.substring(0, playerHTML.length - 2);
}

// Video HTML
function videosHTML(video) {
    return `
    <div class="video_item flex">
        ${video.iframe}
        <div>
            <h3>${video.title}</h3>
            <p class="secondary_text">${video.date}</p>
            <p class="secondary_text" style="font-weight: 100;">${video.desc == false ? 'No description available' : video.titdescle}</p>

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

// Run when page loads -----------------------------------
populateList();

// Pick a random big background image
let randomBG;
function rollBG() {
    // Give preset image if first page visit
    if(localStorage.getItem('first_visit') == null) {
        bigBackground.style.background =
        `linear-gradient(0deg, var(--content-bg) 0%, transparent 60%),
        linear-gradient(30deg, var(--content-bg) 40%, transparent 100%),
        url("${featuredIMG}")`;

        localStorage.setItem('first_visit', 'false');
        return;
    }

    randomBG = Math.floor(Math.random() * pageData.length);

    if(pageData[randomBG].images.length == 0) rollBG();
    
    bigBackgroundSrc(randomBG, 'no', true);
}
rollBG();

console.log(randomBG);


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
if(document.location.search) {
    sortBy.value = document.location.search.substring(1);
    populateList();
}
//#endregion





// User options
// Disable parallax
const checkboxParallax = dom('#disable_parallax');
function toggleParallax() {
    let state = checkboxParallax.checked;
    localStorage.setItem('disable_parallax', state);

    if(state == true) {
        bigBackground.style.top = '0px';
    } else {
        parallax();
    }

}

// Restore on load
if(localStorage.getItem('disable_parallax') != null) {
    checkboxParallax.checked = localStorage.getItem('disable_parallax') == 'true' ? true : false;
}