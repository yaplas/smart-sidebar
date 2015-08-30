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

    var $window = $(window);
    var $body = $(window.document.body);
    var $elem = $(elem);
    $elem.data('SmartSidebar', true);
    var railId = 'ssr' + (++count);

    var offset, $rail, $topOffset, $bottomOffset, $bottomGap, topOffsetHeight;

    mount();

    waitForContent(200);

    $window.on('scroll', scrollHandler);
    $window.on('resize', debounce(function(){
      unmount();
      mount();
      waitForContent(1);
    }, 500));

    function mount() {
      offset = $elem.offset();

      $rail = $(
        '<div id="' + railId +
        '" class="' + options.railClass + '" style="overflow:hidden;position:fixed;padding:1px;bottom:0;"></div>');

      $topOffset = $('<div class="top-offset" style="margin:0;padding:0;"></div>');
      $bottomOffset = $('<div class="bottom-offset" style="margin:0;padding:0;"></div>');
      $bottomGap = $('<div class="bottom-gap" style="margin:0;padding:0;"></div>');

      $rail.css({left: offset.left+'px'});

      $elem.before($rail);

      topOffsetHeight = Math.max(offset.top - parseInt($rail.css('top')), 0);
      $topOffset.css({ height: topOffsetHeight + 'px' });

      $rail.append($topOffset);
      $rail.append($elem);
      $rail.append($bottomOffset);
      $rail.append($bottomGap);
    }

    function unmount() {
      $rail.replaceWith($elem);
    }

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
        $bottomGap.css({ height: ($rail.height() - $elem.outerHeight(true)) + 'px' });
      } else {
        $bottomOffset.show();
        $bottomGap.css({ height: ($rail.height() - $elem.outerHeight(true) - bottomOffsetHeight) + 'px' });
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

    function debounce(func, milliseconds) {
      var args, self, debouncing=0;
      return function() {
        debouncing++;
        args = Array.prototype.slice.call(arguments);
        self = this;
        if (debouncing===1) {
          executeFunc(0);
        }
      };
      function executeFunc(current) {
        if(current===debouncing) {
          func.apply(self, args);
          debouncing=0;
        } else {
          setTimeout(function(){ executeFunc(debouncing); }, milliseconds);
        }
      }
    }
  };

  $.fn.smartSidebar = function(options) {
    return this.each(function() {
      return $.SmartSidebar(this, options);
    });
  };
})(jQuery);