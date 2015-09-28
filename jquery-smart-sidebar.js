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
    options.railClass = (options.railClass ? options.railClass + ' ' : '') + 'sidebar-rail';

    var $window = $(window);
    var $body = $(window.document.body);
    var $elem = $(elem);
    $elem.data('SmartSidebar', true).css({'pointer-events':'all'});
    var railId = 'ssr' + (++count);

    var offset, lastScrollTop, elementHeight,
        $rail, railHeight,
        $topOffset, $topGap, topOffsetHeight, topGapHeight,
        $bottomOffset, $bottomGap, bottomOffsetHeight, bottomGapHeight;


    var resizeHandler = debounce(function(){
      if (!$rail || !exists()) {
        return;
      }

      unmount();
      setTimeout(function(){
        mount();
        scrollHandler();
      }, 10);
    }, 500);

    var scrollHandler = function(){
      if (!$rail || !exists()) {
        return;
      }

      lastScrollTop = lastScrollTop || 0;
      var scrollTop = $window.scrollTop();
      var diff = scrollTop - lastScrollTop;
      var scroll = $rail.scrollTop() + diff;
      lastScrollTop = scrollTop;

      setGaps();

      var topHeight = topOffsetHeight + topGapHeight;

      if (scrollTop < topHeight) {
        $rail.scrollTop(scrollTop);
        return;
      }

      var remainingScroll = topHeight && $body.height() - $window.height() - scrollTop;

      // stop scrolling up leaving header space
      if (scrollTop > topGapHeight && scroll < topGapHeight) {
        scroll = topGapHeight;
      }

      // stop scrolling down when element is on top of the page
      if (scrollTop > topHeight && scroll > topHeight && remainingScroll > bottomOffsetHeight && elementHeight < railHeight) {
        scroll = topHeight;
      }

      // stop scrolling down waiting for footer
      if (scroll > topHeight && remainingScroll > bottomOffsetHeight) {
        var max = topGapHeight + topOffsetHeight + elementHeight - railHeight;
        if (scroll > max) {
          scroll = max;
        }
      }

      // stop scrolling down after footer
      if (remainingScroll < bottomOffsetHeight) {
        var max = topGapHeight + topOffsetHeight + elementHeight + bottomOffsetHeight + bottomGapHeight - railHeight;
        if (scroll > max) {
          scroll = max;
        }
      }

      $rail.scrollTop(scroll);
    };

    setTimeout(function(){
      mount();
      scrollHandler();
      $window.on('scroll', scrollHandler);
      $window.on('resize', resizeHandler);
    }, 10);

    // functions

    function setGaps() {
      //top
      topOffsetHeight = $topOffset.height();
      topGapHeight = Math.max(offset.top - topOffsetHeight,  0);
      $topGap.height(topGapHeight);

      //bottom
      bottomOffsetHeight = $bottomOffset.height();
      railHeight = $rail.height();
      $bottomGap.height(railHeight);
      elementHeight = $elem.outerHeight(true);
      bottomGapHeight = Math.max(railHeight - elementHeight - bottomOffsetHeight, 0);
    }

    function mount() {
      offset = $elem.offset();

      $rail = $(
          '<div id="' + railId +
          '" class="' + options.railClass +
          '" style="overflow:hidden;position:fixed;padding:1px;top:0;bottom:0;pointer-events:none;"></div>');

      $topGap = $('<div class="top-gap" style="margin:0;padding:0;pointer-events:none;"></div>');
      $topOffset = $('<div class="top-offset" style="margin:0;padding:0;pointer-events:none;"></div>');
      $bottomOffset = $('<div class="bottom-offset" style="margin:0;padding:0;pointer-events:none;"></div>');
      $bottomGap = $('<div class="bottom-gap" style="margin:0;padding:0;pointer-events:none;"></div>');

      $rail.css({left: offset.left+'px'});

      $elem.before($rail);

      setGaps();

      $rail.append($topGap);
      $rail.append($topOffset);
      $rail.append($elem);
      $rail.append($bottomOffset);
      $rail.append($bottomGap);
    }

    function unmount() {
      $rail.replaceWith($elem);
    }

    function exists() {
      if ($('#'+railId).length) {
        return true;
      }
      $window.off('scroll', scrollHandler);
      $window.off('resize', resizeHandler);
      return false;
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