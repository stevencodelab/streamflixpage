const movies = [
    {
        id: 1,
        title: "Extraction II",
        thumbnail: "images/movies/movie-1.jpg",
        rating: "4.5",
        year: "2024",
        duration: "2j 15m"
    },
    {
        id: 2,
        title: "Seal Team",
        thumbnail: "images/movies/movie-3.jpg",
        rating: "4.8",
        year: "2017",
        duration: "1j 55m"
    },
    {
        id: 3,
        title: "Squid Game S2",
        thumbnail: "images/movies/movie-5.jpeg",
        rating: "4.8",
        year: "2024",
        duration: "1j 55m"
    },
    {
        id: 4,
        title: "Moana 2",
        thumbnail: "images/movies/movie-4.jpeg",
        rating: "4.8",
        year: "2024",
        duration: "1j 55m"
    },
    {
        id: 5,
        title: "Extraction",
        thumbnail: "images/movies/movie-2.jpg",
        rating: "4.8",
        year: "2024",
        duration: "1j 55m"
    },
    {
        id: 6,
        title: "Kuasa Gelap",
        thumbnail: "images/movies/movie-7.jpeg",
        rating: "4.8",
        year: "2024",
        duration: "1j 55m"
    },
    {
        id: 7,
        title: "Squid Game",
        thumbnail: "images/movies/movie-6.jpg",
        rating: "4.8",
        year: "2024",
        duration: "1j 55m"
    },
    
];

function createMovieCard(movie) {
    return `
        <div class="movie-card relative w-48 rounded-lg overflow-hidden">
            <img src="${movie.thumbnail}" alt="${movie.title}" class="w-full h-72 object-cover">
            <div class="movie-info absolute inset-0 p-4 flex flex-col justify-end">
                <h4 class="text-lg font-semibold">${movie.title}</h4>
                <div class="flex items-center text-sm mt-2">
                    <span class="text-red-500 mr-2">★ ${movie.rating}</span>
                    <span class="mr-2">${movie.year}</span>
                    <span>${movie.duration}</span>
                </div>
            </div>
        </div>
    `;
}


function populateMovieSliders() {
    const sliders = document.querySelectorAll('.movie-slider');
    
    sliders.forEach(slider => {
        
        const movieCards = [...movies, ...movies].map(movie => createMovieCard(movie)).join('');
        slider.innerHTML = movieCards;
    });
}

class MovieSlider {
    constructor(slider, autoScrollInterval = 3000) {
        this.slider = slider;
        this.interval = autoScrollInterval;
        this.isDown = false;
        this.startX = null;
        this.scrollLeft = null;
        this.autoScrollInterval = null;
        this.cardWidth = 192; 
        this.gap = 16; 
        
        this.initializeSlider();
        this.setupControls();
        this.startAutoScroll();
    }

    initializeSlider() {

        const movieCards = [...movies, ...movies].map(movie => createMovieCard(movie)).join('');
        this.slider.innerHTML = movieCards;

        this.slider.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.slider.addEventListener('mouseleave', () => this.handleMouseLeave());
        this.slider.addEventListener('mouseup', () => this.handleMouseUp());
        this.slider.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
       
        this.slider.addEventListener('mouseenter', () => this.pauseAutoScroll());
        this.slider.addEventListener('mouseleave', () => this.startAutoScroll());
    }

    setupControls() {
        const section = this.slider.closest('section');
        const prevBtn = section.querySelector('.prev');
        const nextBtn = section.querySelector('.next');

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => this.scroll('prev'));
            nextBtn.addEventListener('click', () => this.scroll('next'));
        }
    }

    handleMouseDown(e) {
        this.isDown = true;
        this.slider.style.cursor = 'grabbing';
        this.startX = e.pageX - this.slider.offsetLeft;
        this.scrollLeft = this.slider.scrollLeft;
        this.pauseAutoScroll();
    }

    handleMouseLeave() {
        this.isDown = false;
        this.slider.style.cursor = 'grab';
    }

    handleMouseUp() {
        this.isDown = false;
        this.slider.style.cursor = 'grab';
        this.startAutoScroll();
    }

    handleMouseMove(e) {
        if (!this.isDown) return;
        e.preventDefault();
        const x = e.pageX - this.slider.offsetLeft;
        const walk = (x - this.startX) * 2;
        this.slider.scrollLeft = this.scrollLeft - walk;
    }

    scroll(direction) {
        const scrollAmount = this.cardWidth + this.gap;
        const currentScroll = this.slider.scrollLeft;
        const newScroll = direction === 'next' 
            ? currentScroll + scrollAmount 
            : currentScroll - scrollAmount;

        this.slider.scrollTo({
            left: newScroll,
            behavior: 'smooth'
        });

    
        setTimeout(() => {
            if (newScroll >= this.slider.scrollWidth - this.slider.clientWidth) {
                this.slider.scrollTo({ left: 0, behavior: 'auto' });
            } else if (newScroll <= 0) {
                this.slider.scrollTo({ 
                    left: this.slider.scrollWidth - this.slider.clientWidth,
                    behavior: 'auto'
                });
            }
        }, 500);
    }

    startAutoScroll() {
        if (this.autoScrollInterval) return;
        this.autoScrollInterval = setInterval(() => {
            this.scroll('next');
        }, this.interval);
    }

    pauseAutoScroll() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
            this.autoScrollInterval = null;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.movie-slider');
    sliders.forEach(slider => new MovieSlider(slider));
    
    initializeSearch();
    lazyLoadImages();
    
});


function initializeSearch() {
    const searchInput = document.querySelector('input[type="search"]');
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredMovies = movies.filter(movie => 
            movie.title.toLowerCase().includes(searchTerm)
        );
    
    });
}

function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}


document.addEventListener('DOMContentLoaded', () => {
    populateMovieSliders();
    initializeSliders();
    initializeSearch();
    lazyLoadImages();
});


window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('bg-gray-900');
        nav.classList.remove('bg-gradient-to-b');
    } else {
        nav.classList.remove('bg-gray-900');
        nav.classList.add('bg-gradient-to-b');
    }
});