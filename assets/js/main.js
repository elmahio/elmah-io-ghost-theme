$(document).ready(function(){

	// Populate featured posts on ready
	$.get(ghost.url.api('posts', {limit: 'all', filter: "featured: true", fields: "id,url,title"})).done(onSuccessDisplayFeatured);

	// Populate all posts on ready
	$.get(ghost.url.api('posts', {limit: '6', fields: "id,url,title,published_at"})).done(onSuccessDisplayPosts);

	// Initialize highlight JS
	hljs.initHighlightingOnLoad();

	// Style all tables - markdown fix
	$('table').addClass('table table-striped table-hover');

	// Add class to iframes and then add them into div
	$('iframe').addClass('embed-responsive-item').wrap('<div class="embed-responsive embed-responsive-16by9"/>');

	// Show all posts on click
    $('#show-all-posts').on('click', function(){
    	$.get(ghost.url.api('posts', {limit: 'all', fields: "id,url,title,published_at"})).done(onSuccessDisplayPosts);
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
    	$.get(ghost.url.api('posts', {limit: 'all', fields: "id,url,title"})).done(searchData);

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
				keys: [
			    	"title"
				]
			};

			let fuse = new Fuse(data.posts, options);

			$('#search').on('keyup', function(){
				let result = fuse.search(this.value);
				if(result.length === 0) {
					container.html('');
				} else {
					container.html('');
	    			container.append("<ul><h3>Search results</h3></ul>");
	    		}
				result.forEach(function(value){
					$("#searchList ul").append("<li><a href='" + value.url +"'>" + value.title + "</a></li>");
				});
			});
    	}
    }

    // Functions posts
    function onSuccessDisplayPosts(data) {
    	showArchive(data.posts);
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

	function onSuccessDisplayFeatured(data) {
    	showFeatured(data.posts);
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

	// Sticky newsletter box
	function showNewsletter() {
		btnPosition = $('#show-all-posts').position().top;
		scrollTop = $(window).scrollTop();
		if((scrollTop >= btnPosition) && $('.newsletter-sticky').length === 0 ) {
			$('.our-newsletter').clone().addClass('newsletter-sticky').hide().appendTo('.sticky-sidebar').fadeIn();
		} else if ((scrollTop < btnPosition)) {
			$('.newsletter-sticky').remove();
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
		if(!$(this).hasClass('no-flexbox')) {
			$(this).wrap(function() { return "<a href=" + this.src + " data-fancybox></a>"; });
		}
	});
});

// Blog post progress
if ($('.progress-bar').length > 0) {
	var progressElement = document.querySelector('.progress-bar');
	var progressObserver = new ScrollProgress(function(x, y) {
  		progressElement.style.width = y * 100 + '%';
	});
}
