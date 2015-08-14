/*
 * Smart Sidebar
 * https://github.com/yaplas/smart-sidebar
 *
 * Copyright (c) 2015 Agustin Lascialandare
 * MIT license
 */
(function($) {
  var count=0;

  $.isSmartSidebar = function(elem) {
    return !!$(elem).data('SmartSidebar');
  };

  $.SmartSidebar = function(elem, options) {

    options = options || {};
    options.railClass = options.railClass || 'sidebar-rail';
    options.saveBottomOffset = !!options.saveBottomOffset;

    var $elem = $(elem);
    $elem.data('SmartSidebar', true);

    var offset = $elem.offset();

    var railId = 'ssr' + (++count);

    var $rail = $(
      '<div id="' + railId +
      '" class="' + options.railClass + '" style="overflow:hidden;position:fixed;padding:1px;bottom:0;">' +
      '<div class="top-offset"></div>' +
      '</div>');

    var $bottomOffset = $('<div class="bottom-offset" style="margin:0;padding:0;"></div>');
    var $bottomGap = $('<div class="bottom-gap" style="margin:0;padding:0;"></div>');

    $rail.css({left: offset.left+'px'});

    $elem.before($rail);
    $rail.append($elem);
    $rail.append($bottomOffset);
    $rail.append($bottomGap);

    var $window = $(window);
    var $body = $(window.document.body);
    var topOffsetHeight = Math.max(offset.top - $rail.offset().top - $window.scrollTop(), 0);
    $rail.find('.top-offset').css({ height: topOffsetHeight + 'px' });


    $window.on('scroll', scrollHandler);

    waitForContent(200);

    function scrollHandler(){
      if (!exists()) {
        return $window.off('scroll', scrollHandler);
      }
      scrollHandler.lastScrollTop = scrollHandler.lastScrollTop || 0;
      var bottomOffsetHeight = $bottomOffset.height();
      var scrollTop = $window.scrollTop();
      var diff = scrollTop - scrollHandler.lastScrollTop;
      var scroll = $rail.scrollTop() + diff;
      scrollHandler.lastScrollTop = scrollTop;

      if (scroll < topOffsetHeight) {
        if (scrollTop < topOffsetHeight) {
          scroll = scrollTop
        } else {
          scroll = topOffsetHeight;
        }
      }

      var mustBottomOffsetBeHidden = !options.saveBottomOffset &&
        $body.height() - $window.height() - scrollTop > bottomOffsetHeight;

      if (mustBottomOffsetBeHidden) {
        $bottomOffset.hide();
        $bottomGap.css({ height: ($rail.height() - $elem.height()) + 'px' });
      } else {
        $bottomOffset.show();
        $bottomGap.css({ height: ($rail.height() - $elem.height() - bottomOffsetHeight) + 'px' });
      }

      $rail.scrollTop(scroll);
    }

    function waitForContent(times) {
      times = times || 0;
      if (times>=0 && exists()) {
        scrollHandler();
        setTimeout(function() { waitForContent(times-1); }, 100);
      }
    }

    function exists() {
      return $('#'+railId).length;
    }
  };

  $.fn.smartSidebar = function(options) {
    return this.each(function() {
      return $.SmartSidebar(this, options);
    });
  };
})(jQuery);