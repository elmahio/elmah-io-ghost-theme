$(document).ready(function(){

	const api = new GhostContentAPI({
		url: 'https://elmah-io-blog.ghost.io',
		key: '1ccd929a2975dcde15e035b1b6',
		version: "v3"
	});

	// IF - In this series, remove featured
    if($("#related-posts").length !== 0) {
    	$('#featured-posts').remove();
    }

	// Populate featured posts on ready
	api.posts.browse({include: 'url,title', limit: 'all', filter: 'featured:true'}).then( function(posts) { showFeatured(posts); });

	// Populate all posts on ready
	api.posts.browse({include: 'url,title,published_at', limit: '6'}).then( function(posts) { showArchive(posts); });

	// Create TOC
	if($('.toc').length != 0) {
		var toc = $('.toc');
		toc.html('');
		toc.append('<div class="toc-header"><h2><i class="fal fa-list-alt mr-1"></i> Contents</h2><button class="btn btn-outline-secondary btn-sm" id="showContents">Show contents</buttton></div>');
		toc.append('<ul class="toc-links"></ul>');
		$('.docs-post h2, .docs-post h3').each(function(index, elem){
			if($(elem).attr('id')){
				var addClass = "";
				if($(elem).is('h3')) { addClass = ' class="child"'; }
				$(".toc > ul").append("<li"+addClass+"><a href='#" + elem.id +"'>" + elem.innerText + "</a></li>");
			}
		});

		// Show TOC when done
		$(toc).show();

		// Show contents
		$('#showContents').on('click', function(){
			$(this).remove();
			$('.toc-links').show();
		});

		// Add functionality
        $('.toc a').on('click', function(){
            var target = $(this.hash);

            // Scroll to target
            $('html, body').animate({
                scrollTop: (target.offset().top - 80)
            }, 500);
        });
	}

	// Initialize highlight JS
	function initHighlight(wrapperHighlight) {
		hljs.initHighlighting();
		wrapperHighlight();
		$('body').append('<div class="fullscreen-code js-fullscreen-code"></div>');
	}

	// Wrap highlight
	function wrapperHighlight() {
		$('.hljs:not(.language-console)').parent().wrap('<div class="hljs-wrapper"></div>');
		$('.hljs-wrapper').append('<div class="hljs-actions-panel"></div>');
		$('.hljs-wrapper .hljs-actions-panel').prepend('<button class="btn-fullscreen-mode" title="Enter fullscreen mode"><i class="fas fa-expand"></i></button>');
	}

	// Add fullscreen mode functionality
	function addFullscreenMode() {
		var isFullScreenModeCodeOn = false;
		var screenScroll = 0;
		var fullScreenWindow = $('.js-fullscreen-code')[0];

		$('body').on('click', '.btn-fullscreen-mode', function(e) {
			e.stopPropagation();

			if (isFullScreenModeCodeOn) {
				$('body').css('overflow', '');
				$(fullScreenWindow).removeClass('is-open is-console').empty();
				isFullScreenModeCodeOn = false;
			} else {
				if (e.currentTarget.parentElement.classList.contains('cmd-buttons')) {
					var codeBlock = this.parentNode.parentNode.parentNode.cloneNode(true);
					$('body').css('overflow', 'hidden');
					codeBlock.querySelector('.cmd-buttons .fa-times').classList.add('btn-close-cmd');
					$(fullScreenWindow).append(codeBlock);
					$(fullScreenWindow).addClass('is-open is-console');
					isFullScreenModeCodeOn = true;
				} else {
					var codeBlock = this.parentNode.parentNode.cloneNode(true);
					$('body').css('overflow', 'hidden');
					$(fullScreenWindow).append(codeBlock);
					$(fullScreenWindow).find('.btn-fullscreen-mode').attr('title', 'Leave fullscreen mode');
					$(fullScreenWindow).find('.btn-fullscreen-mode i').removeClass('fa-expand').addClass('fa-compress');
					$(fullScreenWindow).addClass('is-open');
					isFullScreenModeCodeOn = true;
				}
			}
		});


		$('body').on('click', '.btn-close-cmd', function(e) {
			e.stopPropagation();

			if (isFullScreenModeCodeOn) {
				$('body').css('overflow', '');
				$(fullScreenWindow).removeClass('is-open is-console').empty();
				isFullScreenModeCodeOn = false;
			}
		});

		$(document).keyup(function(e) {
			if($(fullScreenWindow).hasClass('is-open') && e.key === "Escape") {
				$('body').css('overflow', '');
				$(fullScreenWindow).removeClass('is-open is-console').empty();
				isFullScreenModeCodeOn = false;
			}
	   });
	}

	initHighlight(wrapperHighlight);
	addFullscreenMode();

	// Gif Player
	$('.gif').each(function(el){
		new gifsee(this);
	});

	// Style all tables - markdown fix
	$('table').addClass('table table-striped table-hover');

	// Add class to iframes and then add them into div
	$('iframe').addClass('embed-responsive-item').wrap('<div class="embed-responsive embed-responsive-16by9"/>');

	// Show all posts on click
    $('#show-all-posts').on('click', function(){
    	api.posts.browse({include: 'url,title,published_at', limit: 'all'}).then((posts) => { showArchive(posts); });

    	$('#blog-posts').removeClass('d-none');
    	if ($('.progress-bar').length > 0) {
    		setTimeout(function(){ progressObserver.trigger(); }, 1000);
    	}
    	$(this).remove();
    });

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

    // Search function
    if($("#search").length != 0) {
    	api.posts.browse({include: 'url,title', limit: 'all'}).then((posts) => { searchData(posts); });

    	function searchData(data) {
    		let container = $("#searchList");
    		let options = {
				shouldSort: true,
				tokenize: true,
				threshold: 0,
				location: 0,
				distance: 100,
				maxPatternLength: 32,
				minMatchCharLength: 1,
				ignoreLocation: true,
				keys: [
			    	"title"
				]
			};

			let fuse = new Fuse(data, options);

			$('#search').on('keyup', function(){
				if(this.value) {
					let result = fuse.search(this.value);

					if(result.length === 0) {
						container.html('');
					} else {
						container.html('');
		    			container.append("<ul><h3>Search results</h3></ul>");
		    		}
					result.forEach(function(value){
						$("#searchList ul").append("<li><a href='" + value.item.url +"'>" + value.item.title + "</a></li>");
					});
				} else {
					$("#searchList").empty();
				}
			});
    	}
    }

	function showArchive(posts) {
		let container = $("#postList");
	    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	    let currentMonth = -1;
	    let currentYear = -1;

	    container.html('');
	    container.append("<ul class='main-nav'></ul>");

        $(posts).each(function(index,value){ //For each post
            let datePublished = new Date(value.published_at); //Convert the string to a JS Date
            let postMonth = datePublished.getMonth();  //Get the month (as an integer)
            let postYear = datePublished.getFullYear(); //Get the 4-digit year

            if(postMonth != currentMonth || postYear != currentYear)
            { //If the current post's month and year are not the current stored month and year, set them
                currentMonth = postMonth;
                currentYear = postYear;
                //Then show a month/year header
                $("#postList > ul").append("<li class='"+monthNames[currentMonth]+"-"+currentYear+"'><a href='javascript:;'>" + monthNames[currentMonth] + " " + currentYear + "</a></li>");
            	$("#postList > ul > li."+monthNames[currentMonth]+"-"+currentYear).append("<ul class='post-links'></ul>");
            }
            //For every post, display a link.
            $("#postList > ul > li."+monthNames[currentMonth]+"-"+currentYear+" > ul").append("<li><a href='" + value.url +"'>" + value.title + "</a></li>");
        });

        $('#postList a[href="' + window.location.pathname + '"]').parent().addClass('active');
	}

	function showFeatured(posts) {
		let container = $("#featuredList");

		var sortedPosts = shuffleArray(posts);
    	var displayPosts = sortedPosts.slice(0,6);

	    container.html('');
	    container.append("<ul class='post-links'></ul>");

        $(displayPosts).each(function(index,value){
            $("#featuredList > ul").append("<li><a href='" + value.url +"'>" + value.title + "</a></li>");
        });
	}

	// Sticky newsletter box && signup box
	function showNewsletter() {
		if($('#show-all-posts').length) {
			btnPosition = $('#show-all-posts').position().top;
			scrollTop = $(window).scrollTop();
			if((scrollTop >= btnPosition) && $('.newsletter-sticky').length === 0 ) {
				$('.our-newsletter').clone().addClass('newsletter-sticky').hide().appendTo('.sticky-sidebar').fadeIn();
				$('.follow-box').clone().addClass('follow-sticky').hide().appendTo('.sticky-sidebar').fadeIn();
				$('.box-signup').removeClass('hide').hide().fadeIn();
			} else if ((scrollTop < btnPosition)) {
				$('.newsletter-sticky').remove();
				$('.follow-sticky').remove();
				$('.box-signup').addClass('hide');
			}
		}
	}
	$(window).scroll(function (event) {
	    showNewsletter();
	});
	showNewsletter();

	// Navbar scroll
	// navbar background color change on scroll
    function navbarScroll() {
        var scroll = $(window).scrollTop();
        if(scroll < 10){
            $('.navbar-dark').removeClass('dark-mode');
        } else{
            $('.navbar-dark').addClass('dark-mode');
        }
    }
    $(window).scroll(function(){
        navbarScroll();
    });
	navbarScroll();
});

$(window).on('load', function() {
	if ($('.progress-bar').length > 0) {
		progressObserver.trigger();
	}
	$(".docs-box.docs-post img").each(function() {
		if(!$(this).hasClass('no-flexbox') && !$(this).hasClass('gif')) {
			$(this).wrap(function() { return "<a href=" + this.src + " data-fancybox></a>"; });
		}
	});
	$(".language-console").each(function(){
		$(this).parent().addClass('pre-console');
		$(this).parent().wrap(function() { return $("<div class='cmd'></div>"); });
		$(this).parent().parent().prepend("<div class='cmd-bar'><div class='cmd-title'><div class='bottom-edges'></div><i class='fal fa-terminal'></i><span class='d-none d-md-inline-block'>Command Prompt</span><span class='d-inline-block d-md-none'>CMD</span><i class='fal fa-times ml-auto mr-0' href='https://blog.elmah.io/content/images/2019/12/bsod.png' data-bsod></i></div><div class='cmd-actions' href='https://blog.elmah.io/content/images/2019/12/bsod.png' data-bsod><i class='fal fa-plus'></i><i class='fal fa-horizontal-rule'></i><i class='fal fa-chevron-down'></i></div><div class='cmd-buttons d-flex' href='https://blog.elmah.io/content/images/2019/12/bsod.png' data-bsod><i class='fal fa-window-minimize'></i><i class='fal fa-square btn-fullscreen-mode'></i><i class='fal fa-times'></i></div></div>");
	});
	$('.cmd-title').dblclick(function() {
		$.fancybox.open({
			src: 'https://blog.elmah.io/content/images/2019/12/bsod.png',
			opts: {
				beforeLoad: function(instance, current) {
					$(instance.$refs.container[0]).addClass('fancybox-bsod');
				}
			}
		});
	});
});

// BSOD
$().fancybox({
    selector: '[data-bsod]',
    beforeLoad: function(instance, current) {
		if (current.src === "https://blog.elmah.io/content/images/2019/12/bsod.png") {
			$(instance.$refs.container[0]).addClass('fancybox-bsod');
		}
	}
});

// Blog post progress
if ($('.progress-bar').length > 0) {
	var progressElement = document.querySelector('.progress-bar');
	var progressObserver = new ScrollProgress(function(x, y) {
  		progressElement.style.width = y * 100 + '%';
	});
}

window.intercomSettings = {
	app_id: 'i2hhgdvj',
	system: 'elmah.io',
	background_color: '#0da58e'
};