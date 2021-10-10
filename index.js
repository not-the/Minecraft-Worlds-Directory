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

const sortBy =          dom('#list_sort');
const mainList =        dom('#main_list');

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
onmousemove = e => {
    // console.log(e.movementX, e.movementY);
    viewerInfo.classList.remove('viewer_info_delay');
    mouseTimer = setInterval(() => {
        viewerInfo.classList.add('viewer_info_delay');
    }, 1000);
}

// // List item template
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


// Variables
var gallery = [];
var selection;
var contentOpen = false;
var viewerOpen = false;
var galleryTooltipComplete = false;

function populateList() {
    
    var listHTML = '';

    for(di = 0; di < pageData.length; di++) {
        // console.log(pageData[di]);

        let d = pageData[di];

        listHTML +=
        `<div id="world0" class="world_item" style="background: ${d.header_image ? 'linear-gradient(90deg, rgb(39, 39, 39) 20%, transparent 100%),' : ''} url('images/${d.name}/${d.images[ d.header_image ]}')">
            <!-- Click Detection -->
            <div class="open_area" onclick="openContent(${di})"></div>
        
            <!-- Download -->
            <a class="download_button list_dl ${d.download == '' ? 'disabled' : ''}" id="download${di}" target="_blank" rel="noopener noreferrer" ${d.download == '' ? '' : `href="${d.download}"`}>
                ${d.download == '' ? 'No Download' : `World Download`}
            </a>
        
            <!-- Title -->
            <h2 class="title">
                ${d.name}
            </h2>
            <p class="mini_info">${d.startDate} to ${d.endDate}</p>
        </div>`;
    }

    mainList.innerHTML = listHTML;
}

// Populate list on page load
populateList();

var debug;

// Load images
function loadImages() {
    let imagesList = pageData[selection].images;
    var imgHTML = "";

    if(imagesList.length !== 0) {
        // When there are images available
        for(ii = 0; ii < imagesList.length; ii++) {
            // console.log(imagesList[ii]);
            imgHTML +=
                `<img
                    src="images/${pageData[selection].name}/${imagesList[ii]}"
                    alt="${imagesList[ii]}"
                    id="image${ii}"
                    title="${imagesList[ii]}"
                    onclick="viewImage(${ii})">`
        }

        smallGallery.innerHTML = imgHTML;
    } else {
        smallGallery.innerHTML = '<p style="text-align: center">No images available</p>';
    }
    

    

}

// Open item from list
function openContent(num) {
    contentOpen = true;

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
    videos.innerHTML = null;
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
    if(d.videos.length !== 0) {
        let videoHTML = '<h2 class="content_margin">Videos</h2>';
        for(vi = 0; vi < d.videos.length; vi++) {
            // console.log(d.videos[vi]);
            videoHTML += d.videos[vi];
        }
        videos.innerHTML = videoHTML;
    }
}

fillPage(2);