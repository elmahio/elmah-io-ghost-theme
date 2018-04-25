$(document).ready(function(){

	// Populate posts on ready
	$.get(ghost.url.api('posts', {limit: 20, fields: "url,title,published_at"})).done(onSuccess);

	// Initialize highlight JS
	hljs.initHighlightingOnLoad();

	// Style all tables - markdown fix
	$('table').addClass('table table-striped table-hover');

	// Show all posts on click
    $('#show-all-posts').on('click', function(){
    	$.get(ghost.url.api('posts', {limit: 'all', fields: "url,title,published_at"})).done(onSuccess);
    	$('.posts-wrapper').removeClass('d-none');
    	$(this).remove();
    });

    // Search function
    if($("#search").length != 0) {
    	$.get(ghost.url.api('posts', {limit: 'all', fields: "url,title"})).done(searchData);

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
    function onSuccess(data) {
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
            	$("#postList > ul > li."+monthNames[currentMonth]+"-"+currentYear).append("<ul></ul>");
            }
            //For every post, display a link.
            $("#postList > ul > li."+monthNames[currentMonth]+"-"+currentYear+" > ul").append("<li><a href='" + value.url +"'>" + value.title + "</a></li>");
        });

        $('a[href="' + window.location.pathname + '"]').parent().addClass('active');
	}

});
