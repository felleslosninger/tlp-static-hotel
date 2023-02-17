/* MAIN MENU CLASS */
function MainMenu(name, bg, mobile) {
        
    var self = this;
    
    self.$mainmenu = $(name);
    self.$menubg = $(bg);
    self.$topLevelItems = self.$mainmenu.find('.level0 > li');
    self.$submenu1 = self.$topLevelItems.find('.level1 > li');
    self.$submenu2 = self.$submenu1.find('.level2 > li');
    self.$submenu3 = self.$submenu2.find('.level3 > li');    

    self.$currentLevel1menu = null;
    self.currentHeight = 0;
    
    self.mobile = mobile;
}

MainMenu.prototype.init = function() {
    var self = this;      
    self.adjustMenu();    
    self.events();
};

MainMenu.prototype.events = function() {
    var self = this;

    $(window).resize(function(){        
        self.mobile = $(".toggler").is(":visible");
        if (!self.mobile) {            
            self.$mainmenu.removeClass("mobile");
            self.$mainmenu.removeClass("as-mobile");
            /* Restore left positioning of sublevels  */ 
//            var leftPos = self.$topLevelItems.find('.level1').width(); 
//            self.$topLevelItems.find(".level2").css({left: leftPos+"px"});
//            self.$topLevelItems.find(".level3").css({left: leftPos+"px"});
//            self.$topLevelItems.find(".level4").css({left: leftPos+"px"});            
        }
        self.adjustMenu();
    });

    // Open
    var config = {
         over: function(){self.openMenu($(this));},
         timeout: 200,
    //     interval: 100,
         out: function(){}
    };
    self.$topLevelItems.hoverIntent(config);

    self.$submenu1.hoverIntent(function(){self.openSubmenus($(this));}, function(){});    
    self.$submenu2.hoverIntent(function(){self.openSubmenus($(this));}, function(){});
    self.$submenu3.hoverIntent(function(){self.openSubmenus($(this));}, function(){});
    
    
    // Close
    $(".row").hoverIntent(function(){}, function(){
        if (($(this).find(".menuWrapper")).length > 0) {
            self.closeMenu();
        }
    });
        
    // Open / close mobile menu
    $(".menuBtn").on("click", function(e){        
        e.preventDefault();
        self.$mainmenu.toggleClass("mobile");        
    });
    // On mobile, submenus opens on click
    self.$menuItems = self.$mainmenu.find("li");
    self.$menuItems.on("click", function(e){        
        if (!self.mobile) {
            return;
        }
        e.stopPropagation();
        var $submenu = $(this).children("ul");
        if ($submenu.length > 0) {
            e.preventDefault();
        
            var $currentMenu = $(this).parent("ul");
           
            $submenu.css({left:$currentMenu.width() +"px"});     
            $submenu.addClass("open");
            $submenu.animate({left:"0px"}, 300);
            if ($submenu.height() < $currentMenu.height()) {
                $submenu.height($currentMenu.height());
            }            
        }
    });
    // On mobile, we need extra buttons to navigate upwards
    $(".navigation .btn").on("click", function(e){
        
        if (!self.mobile) {
            return;
        }
        e.preventDefault();
        
        if ($(this).hasClass("prev")) {
            var $submenu = $(this).closest("ul");
                $submenu.animate({left:$(window).width()+"px"}, 300, function() {            
                $submenu.removeClass("open"); 
                $submenu.css({left:"0px"});
            });
        }
        else {
            var $thisSubmenu = $(this).closest("ul");
            var $submenus = $(this).parentsUntil("ul.level0", "ul");
            $thisSubmenu.animate({left:$(window).width()+"px"}, 300, function() {            
                $submenus.removeClass("open"); 
                $submenus.css({left:"0px"});
            });
        }
    });
};

MainMenu.prototype.adjustMenu = function() {
    var self = this;
    /* Set submenu positions */
    var accWidth = 0;
    self.$topLevelItems.each(function() {   
        var submenu = $(this).find("> ul");
        $(submenu).css({height:"auto"});
        $(submenu).css({left:"-"+(accWidth)+"px"});    
        var newLinkWidth = $(this).outerWidth(true);
        accWidth += newLinkWidth;
    });    
    if (accWidth > self.$mainmenu.width()) {
        /* Menu elements do not fit on a single line, we use the mobile menu */
        self.$mainmenu.addClass("as-mobile");
        $(".toggler").show();
        self.mobile = true;
    }
};

MainMenu.prototype.openMenu = function($item) {
    var self = this;
    if (self.mobile) {
        return;
    }     
    self.adjustMenu();
    var submenu;
    var $current = $item.siblings(".has-focus");
    $current.each(function(){
        $(this).find(".has-focus").removeClass("has-focus");
        $(this).removeClass("has-focus");
    });
    
    $item.addClass("has-focus");
    submenu = $item.find(" > ul");
    
    if (submenu.length > 0) {        
        self.$currentLevel1menu = submenu;
        self.$currentLevel1menu.find(".set-active").each(function(){
            $(this).removeClass("set-active").addClass("is-active");
        });

        self.$mainmenu.addClass("open");
        if (!$item.hasClass("active")) {
                $(".level0 > li.active").addClass("nofocus");
        }
        self.adjustMenuHeight();
    }
    else {
        self.closeMenu();
    }
};

MainMenu.prototype.adjustMenuHeight = function() {
    var self = this;
        
    if (self.$currentLevel1menu !== null) {
        var height = 0;
        
        var $next = self.$currentLevel1menu.parent().find("ul");
       
        $next.each(function(){
            if ($(this).height() >= height && $(this).is(":visible")) {
                height = $(this).height();
            }
        });
        self.$mainmenu.height(height-1);
        self.$menubg.height(height-1);
    }
};

MainMenu.prototype.openSubmenus = function($item) {
    var self = this;
    if (self.mobile) {
        return;
    }
    // close any open submenus on same level
    var $current = $item.siblings(".has-focus");
    $current.each(function(){
        $(this).find(".has-focus").removeClass("has-focus");
        $(this).removeClass("has-focus");
    });
    $item.siblings(".is-active").each(function(){
        $(this).find(".is-active").removeClass("is-active").addClass("set-active");
        $(this).removeClass("is-active").addClass("set-active");
    });
    if ($item.hasClass("set-active")) {
        $item.removeClass("set-active").addClass("is-active");
        $item.find(".set-active").each(function(){
            $(this).removeClass("set-active").addClass("is-active");
        });
    }    
    // open new submenu
    $item.addClass("has-focus");        
    self.adjustMenuHeight();
};

MainMenu.prototype.closeMenu = function() {
    var self = this;
    self.$mainmenu.find(".active").removeClass("nofocus");
    var $current = self.$mainmenu.find(".has-focus");
    $current.each(function(){
        $(this).removeClass("has-focus");
    });
    self.$mainmenu.removeClass("open");
    self.$mainmenu.height(0);
    self.$menubg.height(0);
    self.$currentLevel1menu = null;
};
/* END OF MAIN MENU CLASS */

$(document).ready(function() {
    if ($(".menuWrapper").hasClass("megamenu")) {    
        var mobile = $(".toggler").is(":visible");
        var mainmenu = new MainMenu(".menuWrapper", ".menuBg", mobile);
        mainmenu.init();
    }
});

