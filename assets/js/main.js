document.addEventListener("DOMContentLoaded", function() {

    // Set theme
    setTheme();
    document.querySelector('.mode-switch .btn').addEventListener('click', (e) => {
        const theme = e.currentTarget.querySelector('i:not(.d-none)').id;
        setTheme(theme);
    });

    const api = new GhostContentAPI({
        url: 'https://elmah-io-blog.ghost.io',
        key: '1ccd929a2975dcde15e035b1b6',
        version: "v6.0"
    });

    async function fetchAllPosts() {
        let allPosts = [];
        let page = 1;
        let totalPages = 1;

        do {
            const posts = await api.posts.browse({
                fields: 'url,title,published_at,featured',
                limit: 100,
                page: page
            });

            allPosts = allPosts.concat(posts);
            totalPages = posts.meta.pagination.pages;
            page++;
        } while (page <= totalPages);

        return allPosts;
    }

    async function initSearch() {
        const posts = await fetchAllPosts();
        
        // Show 6 featured posts randomly
        showFeatured(posts.filter(post => post.featured));

        // Get latest 6 posts
        showArchive(posts.slice(0, 6));

        // Search function
        searchData(posts);

        // Show all posts on click
        const showAllPosts = document.querySelector('#show-all-posts');
        showAllPosts.addEventListener('click', function callback(event) {
            showArchive(posts);

            document.querySelector('#blog-posts').classList.remove('d-none');
            if (document.querySelector('.progress-bar')) {
                setTimeout(() => { progressObserver.trigger(); }, 1000);
            }
            showAllPosts.remove();
            this.removeEventListener('click', callback);
        });
    }

    initSearch();


    // Create TOC
    const toc = document.querySelector('.toc');
    if (toc) {
        toc.innerHTML = '';
        toc.innerHTML += '<div class="toc-header"><h2><i class="fal fa-list-alt me-1"></i> Contents</h2><button class="btn btn-outline-secondary btn-sm" id="showContents">Show contents</buttton></div>';
        toc.innerHTML += '<ul class="toc-links"></ul>';

        document.querySelectorAll('.docs-post h2, .docs-post h3').forEach((elem, index) => {
            if (elem.hasAttribute("id")) {
                const li = document.createElement('li');
                if (elem.tagName.toLowerCase() === 'h3') { li.className = 'child'; }
                const a = document.createElement('a');
                a.href = '#' + elem.id;
                a.textContent = elem.innerText;
                li.appendChild(a);
                toc.querySelector('ul.toc-links').appendChild(li);
            }
        });

        // Show TOC when done
		toc.style.display = 'block';

        // Show contents
        toc.querySelector('#showContents').addEventListener('click', function callback(event) {
            event.target.remove();
            toc.querySelector('.toc-links').style.display = 'block';
            this.removeEventListener('click', callback);
        });

        // Add scroll to section
        toc.querySelectorAll('a').forEach((elem, index) => {
            elem.addEventListener('click', (event) => {
                event.preventDefault();
                const target = document.querySelector(event.target.hash);
                const headerOffset = 85;
                const targetPosition = target.getBoundingClientRect().top;
                const offsetPosition = targetPosition + window.scrollY - headerOffset;
    
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            });
        });
    }

    initHighlight(wrapperHighlight);
    showNewsletter();
    navbarScroll();

    // Init gif player
    const gifPlayer = document.querySelectorAll('.gif');
    gifPlayer.forEach((el) => new gifsee(el));

    // Style all tables - markdown fix
    const bsTable = document.querySelectorAll('table');
    bsTable.forEach((el) => el.classList.add('table', 'table-striped', 'table-hover'));

    // Add class to iframes and then add them into div
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach((el) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'ratio ratio-16x9';

        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);
    });
});

// On window loaded
window.addEventListener('load', function() {
    if (progressBar) {
		progressObserver.trigger();
	}

    document.querySelectorAll('.docs-box.docs-post img').forEach((img) => {
        if (!img.classList.contains('no-flexbox') && !img.classList.contains('gif')) {
            const wrapper = document.createElement('a');
            wrapper.href = img.src;
            wrapper.setAttribute('data-fancybox', '');
            img.parentNode.insertBefore(wrapper, img);
            wrapper.appendChild(img);
        }
    });

    document.querySelectorAll('.language-console').forEach((codeConsole) => {
        const codeConsoleParent = codeConsole.parentElement;
        codeConsoleParent.classList.add('pre-console');
        const wrapper = document.createElement('div');
        wrapper.className = 'cmd';
        codeConsoleParent.parentNode.insertBefore(wrapper, codeConsoleParent);
        wrapper.appendChild(codeConsoleParent);
        const tempHtml = codeConsoleParent.parentNode;
        codeConsoleParent.parentNode.innerHTML = "<div class='cmd-bar'><div class='cmd-title'><div class='bottom-edges'></div><i class='fal fa-terminal'></i><span class='d-none d-md-inline-block'>Command Prompt</span><span class='d-inline-block d-md-none'>CMD</span><i class='fal fa-times ms-auto me-0' href='https://blog.elmah.io/content/images/2019/12/bsod.png' data-bsod></i></div><div class='cmd-actions' href='https://blog.elmah.io/content/images/2019/12/bsod.png' data-bsod><i class='fal fa-plus'></i><i class='fal fa-horizontal-rule'></i><i class='fal fa-chevron-down'></i></div><div class='cmd-buttons d-flex' href='https://blog.elmah.io/content/images/2019/12/bsod.png' data-bsod><i class='fal fa-window-minimize'></i><i class='fal fa-square btn-fullscreen-mode'></i><i class='fal fa-times'></i></div></div>" + tempHtml.innerHTML;
    });

    document.querySelectorAll('.cmd-title').forEach((cmdTitle) => {
        cmdTitle.addEventListener('dblclick', () => {
            Fancybox.show([{ src: "https://blog.elmah.io/content/images/2019/12/bsod.png" }], bsodFancyboxOptions);
        });
    });

    // Add fullscreen buttons event listeners
    addFullscreenMode();
});

// Set theme mode
function setTheme(mode) {
    if (mode) {
        localStorage.setItem('bs-theme', mode);
        document.documentElement.setAttribute('data-bs-theme', mode === 'light' ? 'light' : 'darkmode');
        document.querySelectorAll('button#toggle-theme i').forEach((i) => i.classList.add('d-none'));
    }
    const modeInverse = localStorage.getItem('bs-theme') === 'light' ? 'dark' : 'light';
    document.querySelector('button#toggle-theme i#' + modeInverse).classList.remove('d-none');
    document.querySelector('.mode-switch').classList.remove('d-none');
}

// On window scroll
window.addEventListener('scroll', function() {
    navbarScroll();
    showNewsletter();
});

// Initialize highlight JS
function initHighlight(wrapperHighlight) {
    hljs.configure({languages: []});
    //hljs.highlightAll();
    document.querySelectorAll('pre code').forEach((el) => {
        if (el.classList.contains('language-nohighlight')) {
            el.classList.add('hljs');
        } else if (el.classList.contains('language-stacktrace')) {
            new netStack(el, {
                prettyprint: true
            });
            el.classList.add('hljs');
        } else {
            hljs.highlightElement(el);
        }
    });

    wrapperHighlight();
    document.body.insertAdjacentHTML('beforeend', '<div class="fullscreen-code js-fullscreen-code"></div>');
}

// Wrap highlight
function wrapperHighlight() {
    const hljsElements = document.querySelectorAll('.hljs:not(.language-console), .language-nohighlight, .language-stacktrace');
    hljsElements.forEach((elem) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'hljs-wrapper';

        // No highlight, but still an hljs component
        if (elem.classList.contains('language-stacktrace')) {
            wrapper.classList.add('netstack');
        }

        elem.parentElement.parentNode.insertBefore(wrapper, elem.parentElement);
        wrapper.appendChild(elem.parentElement);
    });

    const hljsWrappers = document.querySelectorAll('.hljs-wrapper');
    hljsWrappers.forEach((elem) => {
        elem.innerHTML += '<div class="hljs-actions-panel"></div>';
    });

    const hljsActionPanels = document.querySelectorAll('.hljs-wrapper .hljs-actions-panel');
    hljsActionPanels.forEach((elem) => {
        elem.innerHTML += '<button class="btn-fullscreen-mode" title="Enter fullscreen mode"><i class="fas fa-expand"></i></button>';
    });
}

// Add fullscreen mode functionality
function addFullscreenMode() {
    var isFullScreenModeCodeOn = false;
    const fullScreenWindow = document.querySelector('.js-fullscreen-code');
    const fullscreenBtns = document.querySelectorAll('.btn-fullscreen-mode');

    fullscreenBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => openCloseCodeWindow(e));
    });

    function openCloseCodeWindow(e) {
        e.stopPropagation();
        if (isFullScreenModeCodeOn) {
            document.body.style.overflow = '';
            fullScreenWindow.classList.remove('is-open', 'is-console', 'is-netstack');
            fullScreenWindow.innerHTML = '';
            isFullScreenModeCodeOn = false;
        } else {
            document.body.style.overflow = 'hidden';
            if (e.currentTarget.parentElement.classList.contains('cmd-buttons')) {
                const codeBlock = e.currentTarget.parentNode.parentNode.parentNode.cloneNode(true);
                codeBlock.querySelector('.btn-fullscreen-mode').addEventListener('click', (e) => openCloseCodeWindow(e));
                codeBlock.querySelector('.cmd-buttons .fa-times').classList.add('btn-close-cmd');
                codeBlock.querySelector('.btn-close-cmd').addEventListener('click', function(e) {
                    e.stopPropagation();
                    if (isFullScreenModeCodeOn) {
                        document.body.style.overflow = '';
                        fullScreenWindow.classList.remove('is-open', 'is-console');
                        fullScreenWindow.innerHTML = '';
                        isFullScreenModeCodeOn = false;
                    }
                });
                fullScreenWindow.appendChild(codeBlock);
                fullScreenWindow.classList.add('is-open', 'is-console');
            } else {
                // netstack
                if (e.currentTarget.parentNode.parentNode.classList.contains('netstack')) {
                    fullScreenWindow.classList.add('is-open', 'is-netstack');
                }

                const codeBlock = e.currentTarget.parentNode.parentNode.cloneNode(true);
                codeBlock.querySelector('.btn-fullscreen-mode').addEventListener('click', (e) => openCloseCodeWindow(e));
                fullScreenWindow.appendChild(codeBlock);
                fullScreenWindow.querySelector('.btn-fullscreen-mode').title = "Leave fullscreen mode";
                fullScreenWindow.querySelector('.btn-fullscreen-mode i').classList.remove('fa-expand');
                fullScreenWindow.querySelector('.btn-fullscreen-mode i').classList.add('fa-compress');
                fullScreenWindow.classList.add('is-open');
            }
            isFullScreenModeCodeOn = true;
        }
    }

    document.addEventListener('keyup', function(e) {
        if (fullScreenWindow.classList.contains('is-open') && e.key === "Escape") {
            document.body.style.overflow = '';
            fullScreenWindow.classList.remove('is-open', 'is-console');
            fullScreenWindow.innerHTML = '';
            isFullScreenModeCodeOn = false;
        }
    });
}

// Shuffle posts
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

// Show blog archive
function showArchive(posts) {
    const container = document.querySelector('#postList');
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let currentMonth = -1;
    let currentYear = -1;

    container.innerHTML = '';
    const ul = document.createElement('ul');
    ul.className = 'main-nav';
    container.appendChild(ul);

    posts.forEach((value, index) => {
        const datePublished = new Date(value.published_at); //Convert the string to a JS Date
        const postMonth = datePublished.getMonth();  //Get the month (as an integer)
        const postYear = datePublished.getFullYear(); //Get the 4-digit year

        if (postMonth != currentMonth || postYear != currentYear) {
            // If the current post's month and year are not the current stored month and year, set them
            currentMonth = postMonth;
            currentYear = postYear;
            // Then show a month/year header
            const li = document.createElement('li');
            li.className = monthNames[currentMonth] + '-' + currentYear;
            const a = document.createElement('a');
            a.href = 'javascript:;';
            a.textContent = monthNames[currentMonth] + ' ' + currentYear;
            li.appendChild(a);
            container.querySelector('ul.main-nav').appendChild(li);
            const liUl = document.createElement('ul');
            liUl.className = 'post-links';
            li.appendChild(liUl);
        }

        // For every post, display a link.
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = value.url;
        a.textContent = value.title;
        li.appendChild(a);
        container.querySelector("ul > li." + monthNames[currentMonth] + "-" + currentYear + " > ul").appendChild(li);
    });

    if (container.querySelector('a[href="'+ window.location.pathname +'"]')) {
        container.querySelector('a[href="'+ window.location.pathname +'"]').parentElement.classList.add('active');
    }
}

// Show featured posts
function showFeatured(posts) {
    const container = document.querySelector('#featuredList');
    const sortedPosts = shuffleArray(posts);
    const displayPosts = sortedPosts.slice(0,6);

    container.innerHTML = '';
    const ul = document.createElement('ul');
    ul.className = 'post-links';
    container.appendChild(ul);

    displayPosts.forEach((value, index) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = value.url;
        a.textContent = value.title;
        li.appendChild(a);

        container.querySelector('ul.post-links').appendChild(li);
    });
}

// FadeIn animation
function fadeIn(element) {
    element.style.opacity = 0;
    element.style.display = 'block';
    element.style.transition = 'opacity 0.4s';
    requestAnimationFrame(function() {
        element.style.opacity = 1;
    });
}

// Sticky newsletter box && signup box
function showNewsletter() {
    const showAllPosts = document.querySelector('#show-all-posts');
    const stickySidebar = document.querySelector('.sticky-sidebar');

    if (showAllPosts) {
        const btnPosition = showAllPosts.getBoundingClientRect().top + window.scrollY;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        if ((scrollTop >= btnPosition) && !document.querySelector('.newsletter-sticky')) {
            const clonedNewsletter = document.querySelector('.our-newsletter').cloneNode(true);
            clonedNewsletter.classList.add('newsletter-sticky');
            clonedNewsletter.style.display = 'none';
            if (stickySidebar) {
                stickySidebar.appendChild(clonedNewsletter);
            }
            fadeIn(clonedNewsletter);

            const clonedFollowBox = document.querySelector('.follow-box').cloneNode(true);
            clonedFollowBox.classList.add('follow-sticky');
            clonedFollowBox.style.display = 'none';
            if (stickySidebar) {
                stickySidebar.appendChild(clonedFollowBox);
            }
            fadeIn(clonedFollowBox);

            const signupBox = document.querySelector('.box-signup');
            if (signupBox) {
                signupBox.classList.remove('hide');
                signupBox.style.display = 'none';
                fadeIn(signupBox);
            }
        } else if ((scrollTop < btnPosition)) {
            document.querySelector('.newsletter-sticky') && document.querySelector('.newsletter-sticky').remove();
            document.querySelector('.follow-sticky') && document.querySelector('.follow-sticky').remove();
            if (document.querySelector('.box-signup')) {
                document.querySelector('.box-signup').classList.add('hide');
            }
        }
    }
}

// Navbar scroll - change background color on scroll
function navbarScroll() {
    const navbarDark = document.querySelector('.navbar-dark');
    const scroll = window.scrollY || document.documentElement.scrollTop;

    if (scroll < 10){
        navbarDark.classList.remove('scrolling');
    } else {
        navbarDark.classList.add('scrolling');
    }
}

// Search data
function searchData(data) {
    const container = document.querySelector('#searchList');
    const options = {
        shouldSort: true,
        tokenize: true,
        threshold: 0,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        ignoreLocation: true,
        keys: ["title"]
    };
    const fuse = new Fuse(data, options);
    
    const searchInput = document.querySelector('#search');
    searchInput.addEventListener('keyup', function(e) {
        if (e.target.value) {
            let result = fuse.search(e.target.value);

            if (result.length === 0) {
                container.innerHTML = '';
            } else {
                container.innerHTML = '';
                container.innerHTML += '<ul><h3>Search results</h3></ul>';
            }

            result.forEach(function(value) {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = value.item.url;
                a.textContent = value.item.title;
                li.appendChild(a);

                container.querySelector('ul').appendChild(li);
            });
        } else {
            container.innerHTML = '';
        }
    });
}

// Init Fancybox library
Fancybox.bind("[data-fancybox]", {
    idle: false
});

// BSOD
var bsodFancyboxOptions = {
    idle: false,
    animated: false,
    backdropClick: false,
    showClass: false,
    hideClass: false,
    contentClick: false,
    dragToClose: false,
    Toolbar: {
        display: {
            right: ["close"],
        }
    },
    on: {
        reveal: (fancybox, slide) => {
            if (slide.src === "https://blog.elmah.io/content/images/2019/12/bsod.png") {
                fancybox.container.classList.add('fancybox-bsod');
            }
        }
    }
};
Fancybox.bind("[data-bsod]", bsodFancyboxOptions);

// Blog post progress
var progressBar = document.querySelector('.progress-bar');
if (progressBar) {
	var progressObserver = new ScrollProgress(function(x, y) {
        progressBar.style.width = y * 100 + '%';
	});
}

// Intercom
window.intercomSettings = {
	app_id: 'i2hhgdvj',
	system: 'elmah.io',
	background_color: '#0da58e'
};