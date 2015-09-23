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

    init(50);

    $window.on('scroll', scrollHandler);
    $window.on('resize', debounce(function(){
      unmount();
      init(1)
    }, 500));

    function setTopGap() {
      topOffsetHeight = $topOffset.height();
      topGapHeight = Math.max(offset.top - topOffsetHeight,  0);
      $topGap.css({ height: topGapHeight + 'px' });
    }

    function setBottomGap() {
      bottomOffsetHeight = $bottomOffset.height();
      railHeight = $rail.height();
      elementHeight = $elem.outerHeight(true);
      bottomGapHeight = Math.max(railHeight - elementHeight - bottomOffsetHeight, 0);
      $bottomGap.height(bottomGapHeight);
    }

    function init(times) {
      setTimeout(function(){
        mount();
        waitForContent(times);
      }, 10);
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

      setTopGap();
      setBottomGap();

      $rail.append($topGap);
      $rail.append($topOffset);
      $rail.append($elem);
      $rail.append($bottomOffset);
      $rail.append($bottomGap);
    }

    function unmount() {
      $rail.replaceWith($elem);
    }

    function scrollHandler(){
      if (!$rail) {
        return;
      }
      if (!exists()) {
        return $window.off('scroll', scrollHandler);
      }

      lastScrollTop = lastScrollTop || 0;
      var scrollTop = $window.scrollTop();
      var diff = scrollTop - lastScrollTop;
      var scroll = $rail.scrollTop() + diff;
      lastScrollTop = scrollTop;

      setTopGap();
      setBottomGap();

      var topHeight = topOffsetHeight + topGapHeight;
      var remainingScroll = topHeight && $body.height() - $window.height() - scrollTop;

      // stop scrolling up leaving header space
      if (scrollTop > topHeight && scroll < topGapHeight) {
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