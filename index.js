// Shorthand
//#region 
function dom(sel) {return document.querySelector(sel);}

// Page elements
// const galleryScrollArea = dom('#gallery_scroll_area');
const body =            dom('body');
const headerImage =     dom('#header_image');
const smallGallery =    dom('#small_gallery');
const imageViewer =     dom('#image_viewer');
const enlarged =        dom('#enlarged');
const viewerInfo =      dom('#viewer_info');
const viewerTooltip =   dom('#viewer_tooltip');

const imageSort =       dom('#image_sort');
const sortBy =          dom('#list_sort');
const mainList =        dom('#main_list');
const numberHidden =    dom('#number_hidden');

const bigBackground =   dom('#main_bg_img');
const overlayContainer = dom('#overlay_container');
const content =         dom('#content');
const backdrop =        dom('#backdrop');

// Info
const title =           dom('#title');
const description =     dom('#description');
const start_date =      dom('#start_date');
const end_date =        dom('#end_date');
const version =         dom('#version');
const players =         dom('#players');
const download_button = dom('#download_button');
const download_url =    dom('#download_url');
const videos =          dom('#videos');
//#endregion

// Keyboard controls
body.addEventListener('keydown', e => {
    // Escape to go back
    if(e.code == "Escape") {
        if(viewerOpen) {
            closeImage();
        } else if(contentOpen) {
            closeContent();
        }
    }

    // Image viewer arrow keys
    if(viewerOpen) {
        if(e.code == "ArrowLeft") { viewerScroll('up'); }
        else if(e.code == "ArrowRight") { viewerScroll('down'); }
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
});

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

// List sort event listener
sortBy.addEventListener('change', e => {
    console.log(`Sorting by ${sortBy.value}`);
    populateList();
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

    for(di = 0; di < pageData.length; di++) {
        // console.log(pageData[di]);

        let d = pageData[di];

        // Vanilla sort: Skip modded
        if(sortBy.value == 'Vanilla' && !(d.modded == 'Vanilla' || d.modded == 'Vanilla Snapshot') ) {
            continue;
        }
        
        // Modded sort: Skip vanilla
        else if(sortBy.value == 'Modded' && (d.modded == 'Vanilla' || d.modded == 'Vanilla Snapshot') ) {
            continue;
        } else if(sortBy.value == 'World_download' && d.download == '') {
            continue;
        }
        resultCount++;

        listHTML +=
        `<div id="${d.name.split(' ').join('_')}" class="world_item" style="background: ${d.header_image ? 'linear-gradient(90deg, rgb(39, 39, 39) 20%, transparent 100%),' : ''} url('images/${d.name}/${d.images[ d.header_image ]}')">
            <!-- Click Detection -->
            <div class="open_area" onclick="openContent(${di})" onmouseover="bigBackgroundSrc(${di})"></div>
        
            <!-- Download -->
            <a class="download_button list_dl ${d.download == '' ? 'disabled' : ''}" id="download${di}" target="_blank" rel="noopener noreferrer" ${d.download == '' ? '' : `href="${d.download}"`}>
                ${d.download == '' ? 'No Download' : `World Download`}
            </a>
        
            <!-- Title -->
            <h2 class="title">
                ${d.name}
            </h2>
            <p class="mini_info">${sortBy.value == 'Modded' ? d.modded : `${d.startDate} to ${d.endDate}`}</p>
        </div>`;
    }

    mainList.innerHTML = listHTML;
    console.log(resultCount, pageData.length, pageData.length - resultCount);

    if(resultCount - pageData.length > 0) {
        console.log("Some results are hidden");
        numberHidden.innerText = `${pageData.length - resultCount} results were hidden because they did not match your filter`;
    }
}

// Load images
function loadImages() {
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
                    onclick="viewImage(${ii})">`;
            }
        } else {
            for(ii = imagesList.length - 1; ii >= 0; ii--) {
                // console.log(imagesList[ii]);
                imgHTML += `<img
                    src="images/${pageData[selection].name}/${imagesList[ii]}"
                    alt="${imagesList[ii]}"
                    id="image${ii}"
                    title="${imagesList[ii]}"
                    onclick="viewImage(${ii})">`;
            }
        }


        smallGallery.innerHTML = imgHTML;
    } else {
        smallGallery.innerHTML = '<p style="text-align: center">No images available</p>';
    }
    
}

// Open item from list
function openContent(num) {
    contentOpen = true;

    // Avoid changing page if the same item is being reopened
    if(num !== selection) {
        fillPage(num);
    }

    selection = num;

    console.log(`Opening world ${num}`);

    // Content
    content.classList.add('visible');
    content.classList.add('content_in');

    // Backdrop
    backdrop.classList.add('visible');
    // backdrop.classList.add('fade_in');

    // Disable body scroll
    body.classList.add('overflow_hidden');

    // Hide after animation completes
    setTimeout(() => {
        content.classList.remove('content_in');
        // backdrop.classList.remove('fade_in');
    }, 300);
}

// Close Content
function closeContent() {
    contentOpen = false;

    // Enable body scroll
    body.classList.remove('overflow_hidden');

    content.classList.add('content_out');
    // backdrop.classList.add('fade_out');

    backdrop.classList.remove('visible');

    download_button.removeAttribute("href");
    videos.innerHTML = '';
    smallGallery.innerHTML =
        `<button id="load_images" onclick="loadImages()">
            Load Images
        </button>`;

    setTimeout(() => {
        content.classList.remove('visible');
        content.classList.remove('content_out');
        // backdrop.classList.remove('visible');
        // backdrop.classList.remove('fade_out');
    }, 300);
}

// Big background on mouse over
var bigBackgroundID;
function bigBackgroundSrc(num, animate) {
    let d = pageData[num];

    // Only change if new bg is different
    if(bigBackgroundID !== num) {
        bigBackgroundID = num;
        // Set big background
        bigBackground.style.background =
        `linear-gradient(0deg, var(--content-bg) 0%, transparent 60%),
        linear-gradient(30deg, var(--content-bg) 40%, transparent 100%),
        url('images/${d.name}/${d.images[ d.header_image ]}')`;

        // Animate
        if(animate !== 'no') {
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
        }, 5000);
    }

    // Disable content scroll
    content.classList.add('overflow_hidden');

    imageViewer.classList.add('visible');
    imageViewer.classList.add('image_in');

    imageID = id;

    viewImageSrc(id);
}

// Set enlarged image
function viewImageSrc() {
    let d = pageData[selection];

    // File info
    viewerInfo.innerText = `Filename: ${d.images[imageID]}\n
    ${imageID + 1} / ${d.images.length}`;

    // Change image
    enlarged.src = `images/${d.name}/${d.images[imageID]}`;
}

// Close enlarged image
function closeImage() {
    viewerOpen = false;

    // Enable content scroll
    content.classList.remove('overflow_hidden');

    // Animate
    imageViewer.classList.remove('image_in');
    imageViewer.classList.add('image_out');

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
    // players.innerText = playerList;
    if(d.download.length > 3) {
        download_button.classList.remove('disabled');
        download_button.innerText = "World Download";
        // download_button.addAttribute("href");
        download_button.href = `${d.download}`;
        console.log("Yes URL");
    } else {
        download_button.classList.add('disabled');
        download_button.innerText = "No Download";
        // download_button.removeAttribute("href");
        console.log("No URL");
    }

    // If videos are available
    if(d.videos.length > 0) {
        console.log('Yes video');
        let videoHTML = '<h2 class="content_margin">Videos</h2>';
        for(vi = 0; vi < d.videos.length; vi++) {
            // console.log(d.videos[vi]);
            videoHTML += d.videos[vi];
        }
        videos.innerHTML = videoHTML;
    }
}

// fillPage(2);

// Run when page loads -----------------------------------
populateList();

// Pick a random big background image
let randomBG = Math.floor(Math.random() * pageData.length);
console.log(randomBG);
bigBackgroundSrc(randomBG, 'no');

// URL Handling
//#region 
// Open #Name portion of URL if used
if(document.location.hash) {
    let spaced = document.location.hash.split('_').join(' ').substring(1);
    console.log(`Hash in URL found, navigating to: ${spaced}`);

    // Loop through pageData to find an item with a matching name
    for(i = 0; i < pageData.length; i++) {
        if(pageData[i].name == spaced) {
            console.log(pageData[i].name);
            openContent(i);
            break;
        }
    }
}

// Set filter if search parameter is used
if(document.location.search) {
    sortBy.value = document.location.search.substring(1);
    populateList();
}
//#endregion