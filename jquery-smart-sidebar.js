/*
 * Smart Sidebar
 * https://github.com/yaplas/smart-sidebar
 *
 * Copyright (c) 2011 Agustin Lascialandare
 * MIT license
 */
(function($) {
    $.isSmartSidebar = function(elem) {
        return !!$(elem).data('SmartSidebar');
    };

    $.SmartSidebar = function(elem, options) {
     
        options = options || {};

        var $elem = $(elem);
        $elem.data('SmartSidebar', true);
       

        var offset = $elem.offset();
        var height = $elem.height();

        var $rail = $(
            '<div class="' + 
            (options.railClass || 'fixed-rail') + 
            '" style="overflow:hidden;position:fixed;padding:1px;"><div class="top-offset"></div></div>');

        $rail.css({left: offset.left+'px'});
        if (!isNaN(options.top)) {
            $rail.css({top: options.top +'px'});
        }
        if (!isNaN(options.bottom)) {
            $rail.css({bottom: options.bottom +'px'});
        }
        
        $elem.before($rail);
        $rail.append($elem);

        var $window = $(window);
        var lastScrollTop = $window.scrollTop();
        var topOffsetHeight = Math.max(offset.top - $rail.offset().top - lastScrollTop, 0);
        
        $rail.find('.top-offset').css({ height: topOffsetHeight + 'px' });
        
        $window.scroll(function(){
            var scrollTop = $window.scrollTop();
            var diff = scrollTop - lastScrollTop;
            var railScrollTop = $rail.scrollTop();
            var scroll = railScrollTop + diff;
            lastScrollTop = scrollTop;
            if (scroll < topOffsetHeight) {
                if (scrollTop < topOffsetHeight) {
                    scroll = scrollTop
                } else {
                    scroll = topOffsetHeight;
                }
            }
           
            $rail.scrollTop(scroll);
        });
    };

    $.fn.smartSidebar = function(options) {
        return this.each(function() {
            return $.SmartSidebar(this, options);
        });
    };
})(jQuery);