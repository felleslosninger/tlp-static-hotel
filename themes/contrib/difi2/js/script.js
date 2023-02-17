  	(function ($) {
    $(window).load(function() {
      if(!Modernizr.smallscreen) {
        // move submenues from the nav element to the .submenues element (needed for the correct visual effects)
        $(".submenues").prepend($(".menu nav .submenu"));
      }
    });

    $(document).ready(function(){
    	var menu_open = false;
        $(".menu nav li.have_children").click(function(){
            if (menu_open) {
                menu_open = false;
                $(this).removeClass("open");
                $(".container.menu").removeClass("open");
                $(".container.menu nav li").removeClass("open");
                $(".submenu").removeClass("open");
            }
            else {
                menu_open = true;
                $(this).addClass("open");
                $(".container.menu").addClass("open");
                var classStr = $(this).attr("class");
                classList = classStr.split(" ");
                $(".submenu" + "." + classList[0]).addClass("open");
            }
        });

        $(".close_btn").click(function(event){
            menu_open = false;
            $(this).parent().removeClass("open");
            $(".container.menu").removeClass("open");
            $(".container.menu nav li").removeClass("open");
            event.stopPropagation();
        });

        $(".carousel .slides li").click(function(){
            // remove selected-class
            $(".carousel .slides .selected").removeClass("selected");
            // set selected-class
            $(this).addClass("selected");
            // update text and image
            $(".highlighted a").text( $(this).find("h1").text() );
            $(".highlighted a").attr('href', $(this).find("h1").data("href") );
            $(".highlighted p").text( $(this).find("p").text() );
            $(".highlighted img").attr("src", $(this).find("img").attr("src"));
        });

        $(".carousel .slides li:first-child").addClass('selected');
    });
    })(jQuery);