$(document).ready(function(){	
	
	var searchForm = $(".header").find("form");
	if (searchForm.length > 0) {
	
		searchForm.prepend("<button class=\"dmySearchBtn\"></button>");

		$(".dmySearchBtn").on("click", function(e){
			if ($(".dmySearchBtn").is(":visible") == true) {
				e.preventDefault();
				$(this).toggleClass("active");
				if ($(this).hasClass("active")) {
					searchForm.addClass("search-open");
					$("#logo").addClass("search-open");
					$(".header").find(".group").addClass("search-open");
					searchForm.find("input[type=text]").focus();

				}
				else {
					searchForm.removeClass("search-open");
					$("#logo").removeClass("search-open");
					$(".header").find(".group").removeClass("search-open");
				}				
			}
		});
	
	}
	
});

