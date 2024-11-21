const accessKey = 'EPBFFfv7NVx5MaimLEMC4c76Ph_CTMd_mLnPdMM6CPM';
const searchForm = document.querySelector('form');
const searchInput = document.getElementById('search-input');
const imagesContainer = document.querySelector('.images-container');
const loadMoreBtn = document.querySelector('.loadMoreBtn');
const categoryButtons = document.querySelectorAll('.category-btn');

let page = 1;

// Function to fetch images using Unsplash API
const fetchImages = async (query, pageNo) => {
    try {
        if (pageNo === 1) {
            imagesContainer.innerHTML = '';
        }
        const url = `https://api.unsplash.com/search/photos?page=${pageNo}&query=${query}&client_id=${accessKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.results.length > 0) {
            data.results.forEach(photo => {
                // Creating image div
                const imageElement = document.createElement('div');
                imageElement.classList.add('imageDiv');
                imageElement.innerHTML = `<img src="${photo.urls.regular}" alt="${photo.alt_description}">`;

                // Creating overlay
                const overlayElement = document.createElement('div');
                overlayElement.classList.add('overlay');

                // Creating overlay text
                const overlayText = document.createElement('h3');
                overlayText.innerHTML = `${photo.alt_description}`;

                overlayElement.appendChild(overlayText);
                imageElement.appendChild(overlayElement);
                imagesContainer.appendChild(imageElement);
            });

            if (data.total_pages === pageNo) {
                loadMoreBtn.style.display = "none";
            } else {
                loadMoreBtn.style.display = "block";
            }
        } else {
            imagesContainer.innerHTML = `<h2>No images found.</h2>`;
        }
    } catch (error) {
        imagesContainer.innerHTML = `<h2>Failed to fetch images. Please try again later.</h2>`;
    }
}

// Adding Event Listener to search form
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputText = searchInput.value.trim();
    if (inputText !== '') {
        page = 1;
        fetchImages(inputText, page);
    } else {
        imagesContainer.innerHTML = `<h2>Please enter a search query.</h2>`;
        if (loadMoreBtn.style.display === "block") {
            loadMoreBtn.style.display = "none";
        }
    }
});

// Adding Event Listener to Load More button
loadMoreBtn.addEventListener('click', () => {
    fetchImages(searchInput.value.trim(), ++page);
});

// Adding Event Listeners to Category buttons
categoryButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const category = e.target.getAttribute('data-category');
        searchInput.value = category;
        page = 1;
        fetchImages(category, page);
    });
});
