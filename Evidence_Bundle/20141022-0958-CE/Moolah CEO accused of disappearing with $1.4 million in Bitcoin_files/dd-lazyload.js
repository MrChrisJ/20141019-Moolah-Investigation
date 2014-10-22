/*
 * jQuery appear plugin
 *
 * Copyright (c) 2012 Andrey Sidorov
 * licensed under MIT license.
 *
 * https://github.com/morr/jquery.appear/
 *
 * Version: 0.3.1
 */
(function($) {
    var selectors = [];

    var check_binded = false;
    var check_lock = false;
    var defaults = {
        interval: 250,
        force_process: false
    }
    var $window = $(window);

    var $prior_appeared;

    function process() {
        check_lock = false;
        for (var index in selectors) {
            var $appeared = $(selectors[index]).filter(function() {
                return $(this).is(':appeared');
            });

            $appeared.trigger('appear', [$appeared]);

            if ($prior_appeared) {
                var $disappeared = $prior_appeared.not($appeared);
                $disappeared.trigger('disappear', [$disappeared]);
            }
            $prior_appeared = $appeared;
        }
    }

    // "appeared" custom filter
    $.expr[':']['appeared'] = function(element) {
        var $element = $(element);
        if (!$element.is(':visible')) {
            return false;
        }

        var window_left = $window.scrollLeft();
        var window_top = $window.scrollTop();
        var offset = $element.offset();
        var left = offset.left;
        var top = offset.top;

        if (top + $element.height() >= window_top &&
            top - ($element.data('appear-top-offset') || 0) <= window_top + $window.height() &&
            left + $element.width() >= window_left &&
            left - ($element.data('appear-left-offset') || 0) <= window_left + $window.width()) {
            return true;
        } else {
            return false;
        }
    }

    $.fn.extend({
        // watching for element's appearance in browser viewport
        appear: function(options) {
            var opts = $.extend({}, defaults, options || {});
            var selector = this.selector || this;
            if (!check_binded) {
                var on_check = function() {
                    if (check_lock) {
                        return;
                    }
                    check_lock = true;

                    setTimeout(process, opts.interval);
                };

                $(window).scroll(on_check).resize(on_check);
                check_binded = true;
            }

            if (opts.force_process) {
                setTimeout(process, opts.interval);
            }
            selectors.push(selector);
            return $(selector);
        }
    });

    $.extend({
        // force elements's appearance check
        force_appear: function() {
            if (check_binded) {
                process();
                return true;
            };
            return false;
        }
    });
})(jQuery);;
/*global jQuery */
/*jshint multistr:true browser:true */
/*!
* FitVids 1.0
*
* Copyright 2011, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
* Date: Thu Sept 01 18:00:00 2011 -0500
*/

(function( $ ){

  "use strict";

  $.fn.fitVids = function( options ) {
    var settings = {
      customSelector: null
    };

    var div = document.createElement('div'),
        ref = document.getElementsByTagName('base')[0] || document.getElementsByTagName('script')[0];

    div.className = 'fit-vids-style';
    div.innerHTML = '&shy;<style>         \
      .fluid-width-video-wrapper {        \
         width: 100%;                     \
         position: relative;              \
         padding: 0;                      \
      }                                   \
                                          \
      .fluid-width-video-wrapper iframe,  \
      .fluid-width-video-wrapper object,  \
      .fluid-width-video-wrapper embed {  \
         position: absolute;              \
         top: 0;                          \
         left: 0;                         \
         width: 100%;                     \
         height: 100%;                    \
      }                                   \
    </style>';

    ref.parentNode.insertBefore(div,ref);

    if ( options ) {
      $.extend( settings, options );
    }

    return this.each(function(){
      var selectors = [
        "iframe[src*='player.vimeo.com']",
        "iframe[src*='www.youtube.com']",
        "iframe[src*='www.youtube-nocookie.com']",
        "iframe[src*='www.kickstarter.com']",
        "object",
        "embed"
      ];

      if (settings.customSelector) {
        selectors.push(settings.customSelector);
      }

      var $allVideos = $(this).find(selectors.join(','));

      $allVideos.each(function(){
        var $this = $(this);
        if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return; }
        var height = ( this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10))) ) ? parseInt($this.attr('height'), 10) : $this.height(),
            width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
            aspectRatio = height / width;
        if(!$this.attr('id')){
          var videoID = 'fitvid' + Math.floor(Math.random()*999999);
          $this.attr('id', videoID);
        }
        $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100)+"%");
        $this.removeAttr('height').removeAttr('width');
      });
    });
  };
})( jQuery );;
/*!
 * jQuery Cycle Plugin (with Transition Definitions)
 * Examples and documentation at: http://jquery.malsup.com/cycle/
 * Copyright (c) 2007-2012 M. Alsup
 * Version: 2.9999.81 (15-JAN-2013)
 * Dual licensed under the MIT and GPL licenses.
 * http://jquery.malsup.com/license.html
 * Requires: jQuery v1.7.1 or later
 */
;(function($, undefined) {
"use strict";

var ver = '2.9999.81';

function debug(s) {
	if ($.fn.cycle.debug)
		log(s);
}		
function log() {
	if (window.console && console.log)
		console.log('[cycle] ' + Array.prototype.join.call(arguments,' '));
}
$.expr[':'].paused = function(el) {
	return el.cyclePause;
};


// the options arg can be...
//   a number  - indicates an immediate transition should occur to the given slide index
//   a string  - 'pause', 'resume', 'toggle', 'next', 'prev', 'stop', 'destroy' or the name of a transition effect (ie, 'fade', 'zoom', etc)
//   an object - properties to control the slideshow
//
// the arg2 arg can be...
//   the name of an fx (only used in conjunction with a numeric value for 'options')
//   the value true (only used in first arg == 'resume') and indicates
//	 that the resume should occur immediately (not wait for next timeout)

$.fn.cycle = function(options, arg2) {
	var o = { s: this.selector, c: this.context };

	// in 1.3+ we can fix mistakes with the ready state
	if (this.length === 0 && options != 'stop') {
		if (!$.isReady && o.s) {
			log('DOM not ready, queuing slideshow');
			$(function() {
				$(o.s,o.c).cycle(options,arg2);
			});
			return this;
		}
		// is your DOM ready?  http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
		log('terminating; zero elements found by selector' + ($.isReady ? '' : ' (DOM not ready)'));
		return this;
	}

	// iterate the matched nodeset
	return this.each(function() {
		var opts = handleArguments(this, options, arg2);
		if (opts === false)
			return;

		opts.updateActivePagerLink = opts.updateActivePagerLink || $.fn.cycle.updateActivePagerLink;
		
		// stop existing slideshow for this container (if there is one)
		if (this.cycleTimeout)
			clearTimeout(this.cycleTimeout);
		this.cycleTimeout = this.cyclePause = 0;
		this.cycleStop = 0; // issue #108

		var $cont = $(this);
		var $slides = opts.slideExpr ? $(opts.slideExpr, this) : $cont.children();
		var els = $slides.get();

		if (els.length < 2) {
			log('terminating; too few slides: ' + els.length);
			return;
		}

		var opts2 = buildOptions($cont, $slides, els, opts, o);
		if (opts2 === false)
			return;

		var startTime = opts2.continuous ? 10 : getTimeout(els[opts2.currSlide], els[opts2.nextSlide], opts2, !opts2.backwards);

		// if it's an auto slideshow, kick it off
		if (startTime) {
			startTime += (opts2.delay || 0);
			if (startTime < 10)
				startTime = 10;
			debug('first timeout: ' + startTime);
			this.cycleTimeout = setTimeout(function(){go(els,opts2,0,!opts.backwards);}, startTime);
		}
	});
};

function triggerPause(cont, byHover, onPager) {
	var opts = $(cont).data('cycle.opts');
	if (!opts)
		return;
	var paused = !!cont.cyclePause;
	if (paused && opts.paused)
		opts.paused(cont, opts, byHover, onPager);
	else if (!paused && opts.resumed)
		opts.resumed(cont, opts, byHover, onPager);
}

// process the args that were passed to the plugin fn
function handleArguments(cont, options, arg2) {
	if (cont.cycleStop === undefined)
		cont.cycleStop = 0;
	if (options === undefined || options === null)
		options = {};
	if (options.constructor == String) {
		switch(options) {
		case 'destroy':
		case 'stop':
			var opts = $(cont).data('cycle.opts');
			if (!opts)
				return false;
			cont.cycleStop++; // callbacks look for change
			if (cont.cycleTimeout)
				clearTimeout(cont.cycleTimeout);
			cont.cycleTimeout = 0;
			if (opts.elements)
				$(opts.elements).stop();
			$(cont).removeData('cycle.opts');
			if (options == 'destroy')
				destroy(cont, opts);
			return false;
		case 'toggle':
			cont.cyclePause = (cont.cyclePause === 1) ? 0 : 1;
			checkInstantResume(cont.cyclePause, arg2, cont);
			triggerPause(cont);
			return false;
		case 'pause':
			cont.cyclePause = 1;
			triggerPause(cont);
			return false;
		case 'resume':
			cont.cyclePause = 0;
			checkInstantResume(false, arg2, cont);
			triggerPause(cont);
			return false;
		case 'prev':
		case 'next':
			opts = $(cont).data('cycle.opts');
			if (!opts) {
				log('options not found, "prev/next" ignored');
				return false;
			}
			$.fn.cycle[options](opts);
			return false;
		default:
			options = { fx: options };
		}
		return options;
	}
	else if (options.constructor == Number) {
		// go to the requested slide
		var num = options;
		options = $(cont).data('cycle.opts');
		if (!options) {
			log('options not found, can not advance slide');
			return false;
		}
		if (num < 0 || num >= options.elements.length) {
			log('invalid slide index: ' + num);
			return false;
		}
		options.nextSlide = num;
		if (cont.cycleTimeout) {
			clearTimeout(cont.cycleTimeout);
			cont.cycleTimeout = 0;
		}
		if (typeof arg2 == 'string')
			options.oneTimeFx = arg2;
		go(options.elements, options, 1, num >= options.currSlide);
		return false;
	}
	return options;
	
	function checkInstantResume(isPaused, arg2, cont) {
		if (!isPaused && arg2 === true) { // resume now!
			var options = $(cont).data('cycle.opts');
			if (!options) {
				log('options not found, can not resume');
				return false;
			}
			if (cont.cycleTimeout) {
				clearTimeout(cont.cycleTimeout);
				cont.cycleTimeout = 0;
			}
			go(options.elements, options, 1, !options.backwards);
		}
	}
}

function removeFilter(el, opts) {
	if (!$.support.opacity && opts.cleartype && el.style.filter) {
		try { el.style.removeAttribute('filter'); }
		catch(smother) {} // handle old opera versions
	}
}

// unbind event handlers
function destroy(cont, opts) {
	if (opts.next)
		$(opts.next).unbind(opts.prevNextEvent);
	if (opts.prev)
		$(opts.prev).unbind(opts.prevNextEvent);
	
	if (opts.pager || opts.pagerAnchorBuilder)
		$.each(opts.pagerAnchors || [], function() {
			this.unbind().remove();
		});
	opts.pagerAnchors = null;
	$(cont).unbind('mouseenter.cycle mouseleave.cycle');
	if (opts.destroy) // callback
		opts.destroy(opts);
}

// one-time initialization
function buildOptions($cont, $slides, els, options, o) {
	var startingSlideSpecified;
	// support metadata plugin (v1.0 and v2.0)
	var opts = $.extend({}, $.fn.cycle.defaults, options || {}, $.metadata ? $cont.metadata() : $.meta ? $cont.data() : {});
	var meta = $.isFunction($cont.data) ? $cont.data(opts.metaAttr) : null;
	if (meta)
		opts = $.extend(opts, meta);
	if (opts.autostop)
		opts.countdown = opts.autostopCount || els.length;

	var cont = $cont[0];
	$cont.data('cycle.opts', opts);
	opts.$cont = $cont;
	opts.stopCount = cont.cycleStop;
	opts.elements = els;
	opts.before = opts.before ? [opts.before] : [];
	opts.after = opts.after ? [opts.after] : [];

	// push some after callbacks
	if (!$.support.opacity && opts.cleartype)
		opts.after.push(function() { removeFilter(this, opts); });
	if (opts.continuous)
		opts.after.push(function() { go(els,opts,0,!opts.backwards); });

	saveOriginalOpts(opts);

	// clearType corrections
	if (!$.support.opacity && opts.cleartype && !opts.cleartypeNoBg)
		clearTypeFix($slides);

	// container requires non-static position so that slides can be position within
	if ($cont.css('position') == 'static')
		$cont.css('position', 'relative');
	if (opts.width)
		$cont.width(opts.width);
	if (opts.height && opts.height != 'auto')
		$cont.height(opts.height);

	if (opts.startingSlide !== undefined) {
		opts.startingSlide = parseInt(opts.startingSlide,10);
		if (opts.startingSlide >= els.length || opts.startSlide < 0)
			opts.startingSlide = 0; // catch bogus input
		else 
			startingSlideSpecified = true;
	}
	else if (opts.backwards)
		opts.startingSlide = els.length - 1;
	else
		opts.startingSlide = 0;

	// if random, mix up the slide array
	if (opts.random) {
		opts.randomMap = [];
		for (var i = 0; i < els.length; i++)
			opts.randomMap.push(i);
		opts.randomMap.sort(function(a,b) {return Math.random() - 0.5;});
		if (startingSlideSpecified) {
			// try to find the specified starting slide and if found set start slide index in the map accordingly
			for ( var cnt = 0; cnt < els.length; cnt++ ) {
				if ( opts.startingSlide == opts.randomMap[cnt] ) {
					opts.randomIndex = cnt;
				}
			}
		}
		else {
			opts.randomIndex = 1;
			opts.startingSlide = opts.randomMap[1];
		}
	}
	else if (opts.startingSlide >= els.length)
		opts.startingSlide = 0; // catch bogus input
	opts.currSlide = opts.startingSlide || 0;
	var first = opts.startingSlide;

	// set position and zIndex on all the slides
	$slides.css({position: 'absolute', top:0, left:0}).hide().each(function(i) {
		var z;
		if (opts.backwards)
			z = first ? i <= first ? els.length + (i-first) : first-i : els.length-i;
		else
			z = first ? i >= first ? els.length - (i-first) : first-i : els.length-i;
		$(this).css('z-index', z);
	});

	// make sure first slide is visible
	$(els[first]).css('opacity',1).show(); // opacity bit needed to handle restart use case
	removeFilter(els[first], opts);

	// stretch slides
	if (opts.fit) {
		if (!opts.aspect) {
	        if (opts.width)
	            $slides.width(opts.width);
	        if (opts.height && opts.height != 'auto')
	            $slides.height(opts.height);
		} else {
			$slides.each(function(){
				var $slide = $(this);
				var ratio = (opts.aspect === true) ? $slide.width()/$slide.height() : opts.aspect;
				if( opts.width && $slide.width() != opts.width ) {
					$slide.width( opts.width );
					$slide.height( opts.width / ratio );
				}

				if( opts.height && $slide.height() < opts.height ) {
					$slide.height( opts.height );
					$slide.width( opts.height * ratio );
				}
			});
		}
	}

	if (opts.center && ((!opts.fit) || opts.aspect)) {
		$slides.each(function(){
			var $slide = $(this);
			$slide.css({
				"margin-left": opts.width ?
					((opts.width - $slide.width()) / 2) + "px" :
					0,
				"margin-top": opts.height ?
					((opts.height - $slide.height()) / 2) + "px" :
					0
			});
		});
	}

	if (opts.center && !opts.fit && !opts.slideResize) {
		$slides.each(function(){
			var $slide = $(this);
			$slide.css({
				"margin-left": opts.width ? ((opts.width - $slide.width()) / 2) + "px" : 0,
				"margin-top": opts.height ? ((opts.height - $slide.height()) / 2) + "px" : 0
			});
		});
	}
		
	// stretch container
	var reshape = (opts.containerResize || opts.containerResizeHeight) && !$cont.innerHeight();
	if (reshape) { // do this only if container has no size http://tinyurl.com/da2oa9
		var maxw = 0, maxh = 0;
		for(var j=0; j < els.length; j++) {
			var $e = $(els[j]), e = $e[0], w = $e.outerWidth(), h = $e.outerHeight();
			if (!w) w = e.offsetWidth || e.width || $e.attr('width');
			if (!h) h = e.offsetHeight || e.height || $e.attr('height');
			maxw = w > maxw ? w : maxw;
			maxh = h > maxh ? h : maxh;
		}
		if (opts.containerResize && maxw > 0 && maxh > 0)
			$cont.css({width:maxw+'px',height:maxh+'px'});
		if (opts.containerResizeHeight && maxh > 0)
			$cont.css({height:maxh+'px'});
	}

	var pauseFlag = false;  // https://github.com/malsup/cycle/issues/44
	if (opts.pause)
		$cont.bind('mouseenter.cycle', function(){
			pauseFlag = true;
			this.cyclePause++;
			triggerPause(cont, true);
		}).bind('mouseleave.cycle', function(){
				if (pauseFlag)
					this.cyclePause--;
				triggerPause(cont, true);
		});

	if (supportMultiTransitions(opts) === false)
		return false;

	// apparently a lot of people use image slideshows without height/width attributes on the images.
	// Cycle 2.50+ requires the sizing info for every slide; this block tries to deal with that.
	var requeue = false;
	options.requeueAttempts = options.requeueAttempts || 0;
	$slides.each(function() {
		// try to get height/width of each slide
		var $el = $(this);
		this.cycleH = (opts.fit && opts.height) ? opts.height : ($el.height() || this.offsetHeight || this.height || $el.attr('height') || 0);
		this.cycleW = (opts.fit && opts.width) ? opts.width : ($el.width() || this.offsetWidth || this.width || $el.attr('width') || 0);

		if ( $el.is('img') ) {
			var loading = (this.cycleH === 0 && this.cycleW === 0 && !this.complete);
			// don't requeue for images that are still loading but have a valid size
			if (loading) {
				if (o.s && opts.requeueOnImageNotLoaded && ++options.requeueAttempts < 100) { // track retry count so we don't loop forever
					log(options.requeueAttempts,' - img slide not loaded, requeuing slideshow: ', this.src, this.cycleW, this.cycleH);
					setTimeout(function() {$(o.s,o.c).cycle(options);}, opts.requeueTimeout);
					requeue = true;
					return false; // break each loop
				}
				else {
					log('could not determine size of image: '+this.src, this.cycleW, this.cycleH);
				}
			}
		}
		return true;
	});

	if (requeue)
		return false;

	opts.cssBefore = opts.cssBefore || {};
	opts.cssAfter = opts.cssAfter || {};
	opts.cssFirst = opts.cssFirst || {};
	opts.animIn = opts.animIn || {};
	opts.animOut = opts.animOut || {};

	$slides.not(':eq('+first+')').css(opts.cssBefore);
	$($slides[first]).css(opts.cssFirst);

	if (opts.timeout) {
		opts.timeout = parseInt(opts.timeout,10);
		// ensure that timeout and speed settings are sane
		if (opts.speed.constructor == String)
			opts.speed = $.fx.speeds[opts.speed] || parseInt(opts.speed,10);
		if (!opts.sync)
			opts.speed = opts.speed / 2;
		
		var buffer = opts.fx == 'none' ? 0 : opts.fx == 'shuffle' ? 500 : 250;
		while((opts.timeout - opts.speed) < buffer) // sanitize timeout
			opts.timeout += opts.speed;
	}
	if (opts.easing)
		opts.easeIn = opts.easeOut = opts.easing;
	if (!opts.speedIn)
		opts.speedIn = opts.speed;
	if (!opts.speedOut)
		opts.speedOut = opts.speed;

	opts.slideCount = els.length;
	opts.currSlide = opts.lastSlide = first;
	if (opts.random) {
		if (++opts.randomIndex == els.length)
			opts.randomIndex = 0;
		opts.nextSlide = opts.randomMap[opts.randomIndex];
	}
	else if (opts.backwards)
		opts.nextSlide = opts.startingSlide === 0 ? (els.length-1) : opts.startingSlide-1;
	else
		opts.nextSlide = opts.startingSlide >= (els.length-1) ? 0 : opts.startingSlide+1;

	// run transition init fn
	if (!opts.multiFx) {
		var init = $.fn.cycle.transitions[opts.fx];
		if ($.isFunction(init))
			init($cont, $slides, opts);
		else if (opts.fx != 'custom' && !opts.multiFx) {
			log('unknown transition: ' + opts.fx,'; slideshow terminating');
			return false;
		}
	}

	// fire artificial events
	var e0 = $slides[first];
	if (!opts.skipInitializationCallbacks) {
		if (opts.before.length)
			opts.before[0].apply(e0, [e0, e0, opts, true]);
		if (opts.after.length)
			opts.after[0].apply(e0, [e0, e0, opts, true]);
	}
	if (opts.next)
		$(opts.next).bind(opts.prevNextEvent,function(){return advance(opts,1);});
	if (opts.prev)
		$(opts.prev).bind(opts.prevNextEvent,function(){return advance(opts,0);});
	if (opts.pager || opts.pagerAnchorBuilder)
		buildPager(els,opts);

	exposeAddSlide(opts, els);

	return opts;
}

// save off original opts so we can restore after clearing state
function saveOriginalOpts(opts) {
	opts.original = { before: [], after: [] };
	opts.original.cssBefore = $.extend({}, opts.cssBefore);
	opts.original.cssAfter  = $.extend({}, opts.cssAfter);
	opts.original.animIn	= $.extend({}, opts.animIn);
	opts.original.animOut   = $.extend({}, opts.animOut);
	$.each(opts.before, function() { opts.original.before.push(this); });
	$.each(opts.after,  function() { opts.original.after.push(this); });
}

function supportMultiTransitions(opts) {
	var i, tx, txs = $.fn.cycle.transitions;
	// look for multiple effects
	if (opts.fx.indexOf(',') > 0) {
		opts.multiFx = true;
		opts.fxs = opts.fx.replace(/\s*/g,'').split(',');
		// discard any bogus effect names
		for (i=0; i < opts.fxs.length; i++) {
			var fx = opts.fxs[i];
			tx = txs[fx];
			if (!tx || !txs.hasOwnProperty(fx) || !$.isFunction(tx)) {
				log('discarding unknown transition: ',fx);
				opts.fxs.splice(i,1);
				i--;
			}
		}
		// if we have an empty list then we threw everything away!
		if (!opts.fxs.length) {
			log('No valid transitions named; slideshow terminating.');
			return false;
		}
	}
	else if (opts.fx == 'all') {  // auto-gen the list of transitions
		opts.multiFx = true;
		opts.fxs = [];
		for (var p in txs) {
			if (txs.hasOwnProperty(p)) {
				tx = txs[p];
				if (txs.hasOwnProperty(p) && $.isFunction(tx))
					opts.fxs.push(p);
			}
		}
	}
	if (opts.multiFx && opts.randomizeEffects) {
		// munge the fxs array to make effect selection random
		var r1 = Math.floor(Math.random() * 20) + 30;
		for (i = 0; i < r1; i++) {
			var r2 = Math.floor(Math.random() * opts.fxs.length);
			opts.fxs.push(opts.fxs.splice(r2,1)[0]);
		}
		debug('randomized fx sequence: ',opts.fxs);
	}
	return true;
}

// provide a mechanism for adding slides after the slideshow has started
function exposeAddSlide(opts, els) {
	opts.addSlide = function(newSlide, prepend) {
		var $s = $(newSlide), s = $s[0];
		if (!opts.autostopCount)
			opts.countdown++;
		els[prepend?'unshift':'push'](s);
		if (opts.els)
			opts.els[prepend?'unshift':'push'](s); // shuffle needs this
		opts.slideCount = els.length;

		// add the slide to the random map and resort
		if (opts.random) {
			opts.randomMap.push(opts.slideCount-1);
			opts.randomMap.sort(function(a,b) {return Math.random() - 0.5;});
		}

		$s.css('position','absolute');
		$s[prepend?'prependTo':'appendTo'](opts.$cont);

		if (prepend) {
			opts.currSlide++;
			opts.nextSlide++;
		}

		if (!$.support.opacity && opts.cleartype && !opts.cleartypeNoBg)
			clearTypeFix($s);

		if (opts.fit && opts.width)
			$s.width(opts.width);
		if (opts.fit && opts.height && opts.height != 'auto')
			$s.height(opts.height);
		s.cycleH = (opts.fit && opts.height) ? opts.height : $s.height();
		s.cycleW = (opts.fit && opts.width) ? opts.width : $s.width();

		$s.css(opts.cssBefore);

		if (opts.pager || opts.pagerAnchorBuilder)
			$.fn.cycle.createPagerAnchor(els.length-1, s, $(opts.pager), els, opts);

		if ($.isFunction(opts.onAddSlide))
			opts.onAddSlide($s);
		else
			$s.hide(); // default behavior
	};
}

// reset internal state; we do this on every pass in order to support multiple effects
$.fn.cycle.resetState = function(opts, fx) {
	fx = fx || opts.fx;
	opts.before = []; opts.after = [];
	opts.cssBefore = $.extend({}, opts.original.cssBefore);
	opts.cssAfter  = $.extend({}, opts.original.cssAfter);
	opts.animIn	= $.extend({}, opts.original.animIn);
	opts.animOut   = $.extend({}, opts.original.animOut);
	opts.fxFn = null;
	$.each(opts.original.before, function() { opts.before.push(this); });
	$.each(opts.original.after,  function() { opts.after.push(this); });

	// re-init
	var init = $.fn.cycle.transitions[fx];
	if ($.isFunction(init))
		init(opts.$cont, $(opts.elements), opts);
};

// this is the main engine fn, it handles the timeouts, callbacks and slide index mgmt
function go(els, opts, manual, fwd) {
	var p = opts.$cont[0], curr = els[opts.currSlide], next = els[opts.nextSlide];

	// opts.busy is true if we're in the middle of an animation
	if (manual && opts.busy && opts.manualTrump) {
		// let manual transitions requests trump active ones
		debug('manualTrump in go(), stopping active transition');
		$(els).stop(true,true);
		opts.busy = 0;
		clearTimeout(p.cycleTimeout);
	}

	// don't begin another timeout-based transition if there is one active
	if (opts.busy) {
		debug('transition active, ignoring new tx request');
		return;
	}


	// stop cycling if we have an outstanding stop request
	if (p.cycleStop != opts.stopCount || p.cycleTimeout === 0 && !manual)
		return;

	// check to see if we should stop cycling based on autostop options
	if (!manual && !p.cyclePause && !opts.bounce &&
		((opts.autostop && (--opts.countdown <= 0)) ||
		(opts.nowrap && !opts.random && opts.nextSlide < opts.currSlide))) {
		if (opts.end)
			opts.end(opts);
		return;
	}

	// if slideshow is paused, only transition on a manual trigger
	var changed = false;
	if ((manual || !p.cyclePause) && (opts.nextSlide != opts.currSlide)) {
		changed = true;
		var fx = opts.fx;
		// keep trying to get the slide size if we don't have it yet
		curr.cycleH = curr.cycleH || $(curr).height();
		curr.cycleW = curr.cycleW || $(curr).width();
		next.cycleH = next.cycleH || $(next).height();
		next.cycleW = next.cycleW || $(next).width();

		// support multiple transition types
		if (opts.multiFx) {
			if (fwd && (opts.lastFx === undefined || ++opts.lastFx >= opts.fxs.length))
				opts.lastFx = 0;
			else if (!fwd && (opts.lastFx === undefined || --opts.lastFx < 0))
				opts.lastFx = opts.fxs.length - 1;
			fx = opts.fxs[opts.lastFx];
		}

		// one-time fx overrides apply to:  $('div').cycle(3,'zoom');
		if (opts.oneTimeFx) {
			fx = opts.oneTimeFx;
			opts.oneTimeFx = null;
		}

		$.fn.cycle.resetState(opts, fx);

		// run the before callbacks
		if (opts.before.length)
			$.each(opts.before, function(i,o) {
				if (p.cycleStop != opts.stopCount) return;
				o.apply(next, [curr, next, opts, fwd]);
			});

		// stage the after callacks
		var after = function() {
			opts.busy = 0;
			$.each(opts.after, function(i,o) {
				if (p.cycleStop != opts.stopCount) return;
				o.apply(next, [curr, next, opts, fwd]);
			});
			if (!p.cycleStop) {
				// queue next transition
				queueNext();
			}
		};

		debug('tx firing('+fx+'); currSlide: ' + opts.currSlide + '; nextSlide: ' + opts.nextSlide);
		
		// get ready to perform the transition
		opts.busy = 1;
		if (opts.fxFn) // fx function provided?
			opts.fxFn(curr, next, opts, after, fwd, manual && opts.fastOnEvent);
		else if ($.isFunction($.fn.cycle[opts.fx])) // fx plugin ?
			$.fn.cycle[opts.fx](curr, next, opts, after, fwd, manual && opts.fastOnEvent);
		else
			$.fn.cycle.custom(curr, next, opts, after, fwd, manual && opts.fastOnEvent);
	}
	else {
		queueNext();
	}

	if (changed || opts.nextSlide == opts.currSlide) {
		// calculate the next slide
		var roll;
		opts.lastSlide = opts.currSlide;
		if (opts.random) {
			opts.currSlide = opts.nextSlide;
			if (++opts.randomIndex == els.length) {
				opts.randomIndex = 0;
				opts.randomMap.sort(function(a,b) {return Math.random() - 0.5;});
			}
			opts.nextSlide = opts.randomMap[opts.randomIndex];
			if (opts.nextSlide == opts.currSlide)
				opts.nextSlide = (opts.currSlide == opts.slideCount - 1) ? 0 : opts.currSlide + 1;
		}
		else if (opts.backwards) {
			roll = (opts.nextSlide - 1) < 0;
			if (roll && opts.bounce) {
				opts.backwards = !opts.backwards;
				opts.nextSlide = 1;
				opts.currSlide = 0;
			}
			else {
				opts.nextSlide = roll ? (els.length-1) : opts.nextSlide-1;
				opts.currSlide = roll ? 0 : opts.nextSlide+1;
			}
		}
		else { // sequence
			roll = (opts.nextSlide + 1) == els.length;
			if (roll && opts.bounce) {
				opts.backwards = !opts.backwards;
				opts.nextSlide = els.length-2;
				opts.currSlide = els.length-1;
			}
			else {
				opts.nextSlide = roll ? 0 : opts.nextSlide+1;
				opts.currSlide = roll ? els.length-1 : opts.nextSlide-1;
			}
		}
	}
	if (changed && opts.pager)
		opts.updateActivePagerLink(opts.pager, opts.currSlide, opts.activePagerClass);
	
	function queueNext() {
		// stage the next transition
		var ms = 0, timeout = opts.timeout;
		if (opts.timeout && !opts.continuous) {
			ms = getTimeout(els[opts.currSlide], els[opts.nextSlide], opts, fwd);
         if (opts.fx == 'shuffle')
            ms -= opts.speedOut;
      }
		else if (opts.continuous && p.cyclePause) // continuous shows work off an after callback, not this timer logic
			ms = 10;
		if (ms > 0)
			p.cycleTimeout = setTimeout(function(){ go(els, opts, 0, !opts.backwards); }, ms);
	}
}

// invoked after transition
$.fn.cycle.updateActivePagerLink = function(pager, currSlide, clsName) {
   $(pager).each(function() {
       $(this).children().removeClass(clsName).eq(currSlide).addClass(clsName);
   });
};

// calculate timeout value for current transition
function getTimeout(curr, next, opts, fwd) {
	if (opts.timeoutFn) {
		// call user provided calc fn
		var t = opts.timeoutFn.call(curr,curr,next,opts,fwd);
		while (opts.fx != 'none' && (t - opts.speed) < 250) // sanitize timeout
			t += opts.speed;
		debug('calculated timeout: ' + t + '; speed: ' + opts.speed);
		if (t !== false)
			return t;
	}
	return opts.timeout;
}

// expose next/prev function, caller must pass in state
$.fn.cycle.next = function(opts) { advance(opts,1); };
$.fn.cycle.prev = function(opts) { advance(opts,0);};

// advance slide forward or back
function advance(opts, moveForward) {
	var val = moveForward ? 1 : -1;
	var els = opts.elements;
	var p = opts.$cont[0], timeout = p.cycleTimeout;
	if (timeout) {
		clearTimeout(timeout);
		p.cycleTimeout = 0;
	}
	if (opts.random && val < 0) {
		// move back to the previously display slide
		opts.randomIndex--;
		if (--opts.randomIndex == -2)
			opts.randomIndex = els.length-2;
		else if (opts.randomIndex == -1)
			opts.randomIndex = els.length-1;
		opts.nextSlide = opts.randomMap[opts.randomIndex];
	}
	else if (opts.random) {
		opts.nextSlide = opts.randomMap[opts.randomIndex];
	}
	else {
		opts.nextSlide = opts.currSlide + val;
		if (opts.nextSlide < 0) {
			if (opts.nowrap) return false;
			opts.nextSlide = els.length - 1;
		}
		else if (opts.nextSlide >= els.length) {
			if (opts.nowrap) return false;
			opts.nextSlide = 0;
		}
	}

	var cb = opts.onPrevNextEvent || opts.prevNextClick; // prevNextClick is deprecated
	if ($.isFunction(cb))
		cb(val > 0, opts.nextSlide, els[opts.nextSlide]);
	go(els, opts, 1, moveForward);
	return false;
}

function buildPager(els, opts) {
	var $p = $(opts.pager);
	$.each(els, function(i,o) {
		$.fn.cycle.createPagerAnchor(i,o,$p,els,opts);
	});
	opts.updateActivePagerLink(opts.pager, opts.startingSlide, opts.activePagerClass);
}

$.fn.cycle.createPagerAnchor = function(i, el, $p, els, opts) {
	var a;
	if ($.isFunction(opts.pagerAnchorBuilder)) {
		a = opts.pagerAnchorBuilder(i,el);
		debug('pagerAnchorBuilder('+i+', el) returned: ' + a);
	}
	else
		a = '<a href="#">'+(i+1)+'</a>';
		
	if (!a)
		return;
	var $a = $(a);
	// don't reparent if anchor is in the dom
	if ($a.parents('body').length === 0) {
		var arr = [];
		if ($p.length > 1) {
			$p.each(function() {
				var $clone = $a.clone(true);
				$(this).append($clone);
				arr.push($clone[0]);
			});
			$a = $(arr);
		}
		else {
			$a.appendTo($p);
		}
	}

	opts.pagerAnchors =  opts.pagerAnchors || [];
	opts.pagerAnchors.push($a);
	
	var pagerFn = function(e) {
		e.preventDefault();
		opts.nextSlide = i;
		var p = opts.$cont[0], timeout = p.cycleTimeout;
		if (timeout) {
			clearTimeout(timeout);
			p.cycleTimeout = 0;
		}
		var cb = opts.onPagerEvent || opts.pagerClick; // pagerClick is deprecated
		if ($.isFunction(cb))
			cb(opts.nextSlide, els[opts.nextSlide]);
		go(els,opts,1,opts.currSlide < i); // trigger the trans
//		return false; // <== allow bubble
	};
	
	if ( /mouseenter|mouseover/i.test(opts.pagerEvent) ) {
		$a.hover(pagerFn, function(){/* no-op */} );
	}
	else {
		$a.bind(opts.pagerEvent, pagerFn);
	}
	
	if ( ! /^click/.test(opts.pagerEvent) && !opts.allowPagerClickBubble)
		$a.bind('click.cycle', function(){return false;}); // suppress click
	
	var cont = opts.$cont[0];
	var pauseFlag = false; // https://github.com/malsup/cycle/issues/44
	if (opts.pauseOnPagerHover) {
		$a.hover(
			function() { 
				pauseFlag = true;
				cont.cyclePause++; 
				triggerPause(cont,true,true);
			}, function() { 
				if (pauseFlag)
					cont.cyclePause--; 
				triggerPause(cont,true,true);
			} 
		);
	}
};

// helper fn to calculate the number of slides between the current and the next
$.fn.cycle.hopsFromLast = function(opts, fwd) {
	var hops, l = opts.lastSlide, c = opts.currSlide;
	if (fwd)
		hops = c > l ? c - l : opts.slideCount - l;
	else
		hops = c < l ? l - c : l + opts.slideCount - c;
	return hops;
};

// fix clearType problems in ie6 by setting an explicit bg color
// (otherwise text slides look horrible during a fade transition)
function clearTypeFix($slides) {
	debug('applying clearType background-color hack');
	function hex(s) {
		s = parseInt(s,10).toString(16);
		return s.length < 2 ? '0'+s : s;
	}
	function getBg(e) {
		for ( ; e && e.nodeName.toLowerCase() != 'html'; e = e.parentNode) {
			var v = $.css(e,'background-color');
			if (v && v.indexOf('rgb') >= 0 ) {
				var rgb = v.match(/\d+/g);
				return '#'+ hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
			}
			if (v && v != 'transparent')
				return v;
		}
		return '#ffffff';
	}
	$slides.each(function() { $(this).css('background-color', getBg(this)); });
}

// reset common props before the next transition
$.fn.cycle.commonReset = function(curr,next,opts,w,h,rev) {
	$(opts.elements).not(curr).hide();
	if (typeof opts.cssBefore.opacity == 'undefined')
		opts.cssBefore.opacity = 1;
	opts.cssBefore.display = 'block';
	if (opts.slideResize && w !== false && next.cycleW > 0)
		opts.cssBefore.width = next.cycleW;
	if (opts.slideResize && h !== false && next.cycleH > 0)
		opts.cssBefore.height = next.cycleH;
	opts.cssAfter = opts.cssAfter || {};
	opts.cssAfter.display = 'none';
	$(curr).css('zIndex',opts.slideCount + (rev === true ? 1 : 0));
	$(next).css('zIndex',opts.slideCount + (rev === true ? 0 : 1));
};

// the actual fn for effecting a transition
$.fn.cycle.custom = function(curr, next, opts, cb, fwd, speedOverride) {
	var $l = $(curr), $n = $(next);
	var speedIn = opts.speedIn, speedOut = opts.speedOut, easeIn = opts.easeIn, easeOut = opts.easeOut;
	$n.css(opts.cssBefore);
	if (speedOverride) {
		if (typeof speedOverride == 'number')
			speedIn = speedOut = speedOverride;
		else
			speedIn = speedOut = 1;
		easeIn = easeOut = null;
	}
	var fn = function() {
		$n.animate(opts.animIn, speedIn, easeIn, function() {
			cb();
		});
	};
	$l.animate(opts.animOut, speedOut, easeOut, function() {
		$l.css(opts.cssAfter);
		if (!opts.sync) 
			fn();
	});
	if (opts.sync) fn();
};

// transition definitions - only fade is defined here, transition pack defines the rest
$.fn.cycle.transitions = {
	fade: function($cont, $slides, opts) {
		$slides.not(':eq('+opts.currSlide+')').css('opacity',0);
		opts.before.push(function(curr,next,opts) {
			$.fn.cycle.commonReset(curr,next,opts);
			opts.cssBefore.opacity = 0;
		});
		opts.animIn	   = { opacity: 1 };
		opts.animOut   = { opacity: 0 };
		opts.cssBefore = { top: 0, left: 0 };
	}
};

$.fn.cycle.ver = function() { return ver; };

// override these globally if you like (they are all optional)
$.fn.cycle.defaults = {
    activePagerClass: 'activeSlide', // class name used for the active pager link
    after:            null,     // transition callback (scope set to element that was shown):  function(currSlideElement, nextSlideElement, options, forwardFlag)
    allowPagerClickBubble: false, // allows or prevents click event on pager anchors from bubbling
    animIn:           null,     // properties that define how the slide animates in
    animOut:          null,     // properties that define how the slide animates out
    aspect:           false,    // preserve aspect ratio during fit resizing, cropping if necessary (must be used with fit option)
    autostop:         0,        // true to end slideshow after X transitions (where X == slide count)
    autostopCount:    0,        // number of transitions (optionally used with autostop to define X)
    backwards:        false,    // true to start slideshow at last slide and move backwards through the stack
    before:           null,     // transition callback (scope set to element to be shown):     function(currSlideElement, nextSlideElement, options, forwardFlag)
    center:           null,     // set to true to have cycle add top/left margin to each slide (use with width and height options)
    cleartype:        !$.support.opacity,  // true if clearType corrections should be applied (for IE)
    cleartypeNoBg:    false,    // set to true to disable extra cleartype fixing (leave false to force background color setting on slides)
    containerResize:  1,        // resize container to fit largest slide
    containerResizeHeight:  0,  // resize containers height to fit the largest slide but leave the width dynamic
    continuous:       0,        // true to start next transition immediately after current one completes
    cssAfter:         null,     // properties that defined the state of the slide after transitioning out
    cssBefore:        null,     // properties that define the initial state of the slide before transitioning in
    delay:            0,        // additional delay (in ms) for first transition (hint: can be negative)
    easeIn:           null,     // easing for "in" transition
    easeOut:          null,     // easing for "out" transition
    easing:           null,     // easing method for both in and out transitions
    end:              null,     // callback invoked when the slideshow terminates (use with autostop or nowrap options): function(options)
    fastOnEvent:      0,        // force fast transitions when triggered manually (via pager or prev/next); value == time in ms
    fit:              0,        // force slides to fit container
    fx:               'fade',   // name of transition effect (or comma separated names, ex: 'fade,scrollUp,shuffle')
    fxFn:             null,     // function used to control the transition: function(currSlideElement, nextSlideElement, options, afterCalback, forwardFlag)
    height:           'auto',   // container height (if the 'fit' option is true, the slides will be set to this height as well)
    manualTrump:      true,     // causes manual transition to stop an active transition instead of being ignored
    metaAttr:         'cycle',  // data- attribute that holds the option data for the slideshow
    next:             null,     // element, jQuery object, or jQuery selector string for the element to use as event trigger for next slide
    nowrap:           0,        // true to prevent slideshow from wrapping
    onPagerEvent:     null,     // callback fn for pager events: function(zeroBasedSlideIndex, slideElement)
    onPrevNextEvent:  null,     // callback fn for prev/next events: function(isNext, zeroBasedSlideIndex, slideElement)
    pager:            null,     // element, jQuery object, or jQuery selector string for the element to use as pager container
    pagerAnchorBuilder: null,   // callback fn for building anchor links:  function(index, DOMelement)
    pagerEvent:       'click.cycle', // name of event which drives the pager navigation
    pause:            0,        // true to enable "pause on hover"
    pauseOnPagerHover: 0,       // true to pause when hovering over pager link
    prev:             null,     // element, jQuery object, or jQuery selector string for the element to use as event trigger for previous slide
    prevNextEvent:    'click.cycle',// event which drives the manual transition to the previous or next slide
    random:           0,        // true for random, false for sequence (not applicable to shuffle fx)
    randomizeEffects: 1,        // valid when multiple effects are used; true to make the effect sequence random
    requeueOnImageNotLoaded: true, // requeue the slideshow if any image slides are not yet loaded
    requeueTimeout:   250,      // ms delay for requeue
    rev:              0,        // causes animations to transition in reverse (for effects that support it such as scrollHorz/scrollVert/shuffle)
    shuffle:          null,     // coords for shuffle animation, ex: { top:15, left: 200 }
    skipInitializationCallbacks: false, // set to true to disable the first before/after callback that occurs prior to any transition
    slideExpr:        null,     // expression for selecting slides (if something other than all children is required)
    slideResize:      1,        // force slide width/height to fixed size before every transition
    speed:            1000,     // speed of the transition (any valid fx speed value)
    speedIn:          null,     // speed of the 'in' transition
    speedOut:         null,     // speed of the 'out' transition
    startingSlide:    undefined,// zero-based index of the first slide to be displayed
    sync:             1,        // true if in/out transitions should occur simultaneously
    timeout:          4000,     // milliseconds between slide transitions (0 to disable auto advance)
    timeoutFn:        null,     // callback for determining per-slide timeout value:  function(currSlideElement, nextSlideElement, options, forwardFlag)
    updateActivePagerLink: null,// callback fn invoked to update the active pager link (adds/removes activePagerClass style)
    width:            null      // container width (if the 'fit' option is true, the slides will be set to this width as well)
};

})(jQuery);


/*!
 * jQuery Cycle Plugin Transition Definitions
 * This script is a plugin for the jQuery Cycle Plugin
 * Examples and documentation at: http://malsup.com/jquery/cycle/
 * Copyright (c) 2007-2010 M. Alsup
 * Version:	 2.73
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */
(function($) {
"use strict";

//
// These functions define slide initialization and properties for the named
// transitions. To save file size feel free to remove any of these that you
// don't need.
//
$.fn.cycle.transitions.none = function($cont, $slides, opts) {
	opts.fxFn = function(curr,next,opts,after){
		$(next).show();
		$(curr).hide();
		after();
	};
};

// not a cross-fade, fadeout only fades out the top slide
$.fn.cycle.transitions.fadeout = function($cont, $slides, opts) {
	$slides.not(':eq('+opts.currSlide+')').css({ display: 'block', 'opacity': 1 });
	opts.before.push(function(curr,next,opts,w,h,rev) {
		$(curr).css('zIndex',opts.slideCount + (rev !== true ? 1 : 0));
		$(next).css('zIndex',opts.slideCount + (rev !== true ? 0 : 1));
	});
	opts.animIn.opacity = 1;
	opts.animOut.opacity = 0;
	opts.cssBefore.opacity = 1;
	opts.cssBefore.display = 'block';
	opts.cssAfter.zIndex = 0;
};

// scrollUp/Down/Left/Right
$.fn.cycle.transitions.scrollUp = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push($.fn.cycle.commonReset);
	var h = $cont.height();
	opts.cssBefore.top = h;
	opts.cssBefore.left = 0;
	opts.cssFirst.top = 0;
	opts.animIn.top = 0;
	opts.animOut.top = -h;
};
$.fn.cycle.transitions.scrollDown = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push($.fn.cycle.commonReset);
	var h = $cont.height();
	opts.cssFirst.top = 0;
	opts.cssBefore.top = -h;
	opts.cssBefore.left = 0;
	opts.animIn.top = 0;
	opts.animOut.top = h;
};
$.fn.cycle.transitions.scrollLeft = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push($.fn.cycle.commonReset);
	var w = $cont.width();
	opts.cssFirst.left = 0;
	opts.cssBefore.left = w;
	opts.cssBefore.top = 0;
	opts.animIn.left = 0;
	opts.animOut.left = 0-w;
};
$.fn.cycle.transitions.scrollRight = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push($.fn.cycle.commonReset);
	var w = $cont.width();
	opts.cssFirst.left = 0;
	opts.cssBefore.left = -w;
	opts.cssBefore.top = 0;
	opts.animIn.left = 0;
	opts.animOut.left = w;
};
$.fn.cycle.transitions.scrollHorz = function($cont, $slides, opts) {
	$cont.css('overflow','hidden').width();
	opts.before.push(function(curr, next, opts, fwd) {
		if (opts.rev)
			fwd = !fwd;
		$.fn.cycle.commonReset(curr,next,opts);
		opts.cssBefore.left = fwd ? (next.cycleW-1) : (1-next.cycleW);
		opts.animOut.left = fwd ? -curr.cycleW : curr.cycleW;
	});
	opts.cssFirst.left = 0;
	opts.cssBefore.top = 0;
	opts.animIn.left = 0;
	opts.animOut.top = 0;
};
$.fn.cycle.transitions.scrollVert = function($cont, $slides, opts) {
	$cont.css('overflow','hidden');
	opts.before.push(function(curr, next, opts, fwd) {
		if (opts.rev)
			fwd = !fwd;
		$.fn.cycle.commonReset(curr,next,opts);
		opts.cssBefore.top = fwd ? (1-next.cycleH) : (next.cycleH-1);
		opts.animOut.top = fwd ? curr.cycleH : -curr.cycleH;
	});
	opts.cssFirst.top = 0;
	opts.cssBefore.left = 0;
	opts.animIn.top = 0;
	opts.animOut.left = 0;
};

// slideX/slideY
$.fn.cycle.transitions.slideX = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$(opts.elements).not(curr).hide();
		$.fn.cycle.commonReset(curr,next,opts,false,true);
		opts.animIn.width = next.cycleW;
	});
	opts.cssBefore.left = 0;
	opts.cssBefore.top = 0;
	opts.cssBefore.width = 0;
	opts.animIn.width = 'show';
	opts.animOut.width = 0;
};
$.fn.cycle.transitions.slideY = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$(opts.elements).not(curr).hide();
		$.fn.cycle.commonReset(curr,next,opts,true,false);
		opts.animIn.height = next.cycleH;
	});
	opts.cssBefore.left = 0;
	opts.cssBefore.top = 0;
	opts.cssBefore.height = 0;
	opts.animIn.height = 'show';
	opts.animOut.height = 0;
};

// shuffle
$.fn.cycle.transitions.shuffle = function($cont, $slides, opts) {
	var i, w = $cont.css('overflow', 'visible').width();
	$slides.css({left: 0, top: 0});
	opts.before.push(function(curr,next,opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,true,true);
	});
	// only adjust speed once!
	if (!opts.speedAdjusted) {
		opts.speed = opts.speed / 2; // shuffle has 2 transitions
		opts.speedAdjusted = true;
	}
	opts.random = 0;
	opts.shuffle = opts.shuffle || {left:-w, top:15};
	opts.els = [];
	for (i=0; i < $slides.length; i++)
		opts.els.push($slides[i]);

	for (i=0; i < opts.currSlide; i++)
		opts.els.push(opts.els.shift());

	// custom transition fn (hat tip to Benjamin Sterling for this bit of sweetness!)
	opts.fxFn = function(curr, next, opts, cb, fwd) {
		if (opts.rev)
			fwd = !fwd;
		var $el = fwd ? $(curr) : $(next);
		$(next).css(opts.cssBefore);
		var count = opts.slideCount;
		$el.animate(opts.shuffle, opts.speedIn, opts.easeIn, function() {
			var hops = $.fn.cycle.hopsFromLast(opts, fwd);
			for (var k=0; k < hops; k++) {
				if (fwd)
					opts.els.push(opts.els.shift());
				else
					opts.els.unshift(opts.els.pop());
			}
			if (fwd) {
				for (var i=0, len=opts.els.length; i < len; i++)
					$(opts.els[i]).css('z-index', len-i+count);
			}
			else {
				var z = $(curr).css('z-index');
				$el.css('z-index', parseInt(z,10)+1+count);
			}
			$el.animate({left:0, top:0}, opts.speedOut, opts.easeOut, function() {
				$(fwd ? this : curr).hide();
				if (cb) cb();
			});
		});
	};
	$.extend(opts.cssBefore, { display: 'block', opacity: 1, top: 0, left: 0 });
};

// turnUp/Down/Left/Right
$.fn.cycle.transitions.turnUp = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,false);
		opts.cssBefore.top = next.cycleH;
		opts.animIn.height = next.cycleH;
		opts.animOut.width = next.cycleW;
	});
	opts.cssFirst.top = 0;
	opts.cssBefore.left = 0;
	opts.cssBefore.height = 0;
	opts.animIn.top = 0;
	opts.animOut.height = 0;
};
$.fn.cycle.transitions.turnDown = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,false);
		opts.animIn.height = next.cycleH;
		opts.animOut.top   = curr.cycleH;
	});
	opts.cssFirst.top = 0;
	opts.cssBefore.left = 0;
	opts.cssBefore.top = 0;
	opts.cssBefore.height = 0;
	opts.animOut.height = 0;
};
$.fn.cycle.transitions.turnLeft = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,true);
		opts.cssBefore.left = next.cycleW;
		opts.animIn.width = next.cycleW;
	});
	opts.cssBefore.top = 0;
	opts.cssBefore.width = 0;
	opts.animIn.left = 0;
	opts.animOut.width = 0;
};
$.fn.cycle.transitions.turnRight = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,true);
		opts.animIn.width = next.cycleW;
		opts.animOut.left = curr.cycleW;
	});
	$.extend(opts.cssBefore, { top: 0, left: 0, width: 0 });
	opts.animIn.left = 0;
	opts.animOut.width = 0;
};

// zoom
$.fn.cycle.transitions.zoom = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,false,true);
		opts.cssBefore.top = next.cycleH/2;
		opts.cssBefore.left = next.cycleW/2;
		$.extend(opts.animIn, { top: 0, left: 0, width: next.cycleW, height: next.cycleH });
		$.extend(opts.animOut, { width: 0, height: 0, top: curr.cycleH/2, left: curr.cycleW/2 });
	});
	opts.cssFirst.top = 0;
	opts.cssFirst.left = 0;
	opts.cssBefore.width = 0;
	opts.cssBefore.height = 0;
};

// fadeZoom
$.fn.cycle.transitions.fadeZoom = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,false);
		opts.cssBefore.left = next.cycleW/2;
		opts.cssBefore.top = next.cycleH/2;
		$.extend(opts.animIn, { top: 0, left: 0, width: next.cycleW, height: next.cycleH });
	});
	opts.cssBefore.width = 0;
	opts.cssBefore.height = 0;
	opts.animOut.opacity = 0;
};

// blindX
$.fn.cycle.transitions.blindX = function($cont, $slides, opts) {
	var w = $cont.css('overflow','hidden').width();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts);
		opts.animIn.width = next.cycleW;
		opts.animOut.left   = curr.cycleW;
	});
	opts.cssBefore.left = w;
	opts.cssBefore.top = 0;
	opts.animIn.left = 0;
	opts.animOut.left = w;
};
// blindY
$.fn.cycle.transitions.blindY = function($cont, $slides, opts) {
	var h = $cont.css('overflow','hidden').height();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts);
		opts.animIn.height = next.cycleH;
		opts.animOut.top   = curr.cycleH;
	});
	opts.cssBefore.top = h;
	opts.cssBefore.left = 0;
	opts.animIn.top = 0;
	opts.animOut.top = h;
};
// blindZ
$.fn.cycle.transitions.blindZ = function($cont, $slides, opts) {
	var h = $cont.css('overflow','hidden').height();
	var w = $cont.width();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts);
		opts.animIn.height = next.cycleH;
		opts.animOut.top   = curr.cycleH;
	});
	opts.cssBefore.top = h;
	opts.cssBefore.left = w;
	opts.animIn.top = 0;
	opts.animIn.left = 0;
	opts.animOut.top = h;
	opts.animOut.left = w;
};

// growX - grow horizontally from centered 0 width
$.fn.cycle.transitions.growX = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,true);
		opts.cssBefore.left = this.cycleW/2;
		opts.animIn.left = 0;
		opts.animIn.width = this.cycleW;
		opts.animOut.left = 0;
	});
	opts.cssBefore.top = 0;
	opts.cssBefore.width = 0;
};
// growY - grow vertically from centered 0 height
$.fn.cycle.transitions.growY = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,false);
		opts.cssBefore.top = this.cycleH/2;
		opts.animIn.top = 0;
		opts.animIn.height = this.cycleH;
		opts.animOut.top = 0;
	});
	opts.cssBefore.height = 0;
	opts.cssBefore.left = 0;
};

// curtainX - squeeze in both edges horizontally
$.fn.cycle.transitions.curtainX = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,false,true,true);
		opts.cssBefore.left = next.cycleW/2;
		opts.animIn.left = 0;
		opts.animIn.width = this.cycleW;
		opts.animOut.left = curr.cycleW/2;
		opts.animOut.width = 0;
	});
	opts.cssBefore.top = 0;
	opts.cssBefore.width = 0;
};
// curtainY - squeeze in both edges vertically
$.fn.cycle.transitions.curtainY = function($cont, $slides, opts) {
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,false,true);
		opts.cssBefore.top = next.cycleH/2;
		opts.animIn.top = 0;
		opts.animIn.height = next.cycleH;
		opts.animOut.top = curr.cycleH/2;
		opts.animOut.height = 0;
	});
	opts.cssBefore.height = 0;
	opts.cssBefore.left = 0;
};

// cover - curr slide covered by next slide
$.fn.cycle.transitions.cover = function($cont, $slides, opts) {
	var d = opts.direction || 'left';
	var w = $cont.css('overflow','hidden').width();
	var h = $cont.height();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts);
		opts.cssAfter.display = '';
		if (d == 'right')
			opts.cssBefore.left = -w;
		else if (d == 'up')
			opts.cssBefore.top = h;
		else if (d == 'down')
			opts.cssBefore.top = -h;
		else
			opts.cssBefore.left = w;
	});
	opts.animIn.left = 0;
	opts.animIn.top = 0;
	opts.cssBefore.top = 0;
	opts.cssBefore.left = 0;
};

// uncover - curr slide moves off next slide
$.fn.cycle.transitions.uncover = function($cont, $slides, opts) {
	var d = opts.direction || 'left';
	var w = $cont.css('overflow','hidden').width();
	var h = $cont.height();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,true,true);
		if (d == 'right')
			opts.animOut.left = w;
		else if (d == 'up')
			opts.animOut.top = -h;
		else if (d == 'down')
			opts.animOut.top = h;
		else
			opts.animOut.left = -w;
	});
	opts.animIn.left = 0;
	opts.animIn.top = 0;
	opts.cssBefore.top = 0;
	opts.cssBefore.left = 0;
};

// toss - move top slide and fade away
$.fn.cycle.transitions.toss = function($cont, $slides, opts) {
	var w = $cont.css('overflow','visible').width();
	var h = $cont.height();
	opts.before.push(function(curr, next, opts) {
		$.fn.cycle.commonReset(curr,next,opts,true,true,true);
		// provide default toss settings if animOut not provided
		if (!opts.animOut.left && !opts.animOut.top)
			$.extend(opts.animOut, { left: w*2, top: -h/2, opacity: 0 });
		else
			opts.animOut.opacity = 0;
	});
	opts.cssBefore.left = 0;
	opts.cssBefore.top = 0;
	opts.animIn.left = 0;
};

// wipe - clip animation
$.fn.cycle.transitions.wipe = function($cont, $slides, opts) {
	var w = $cont.css('overflow','hidden').width();
	var h = $cont.height();
	opts.cssBefore = opts.cssBefore || {};
	var clip;
	if (opts.clip) {
		if (/l2r/.test(opts.clip))
			clip = 'rect(0px 0px '+h+'px 0px)';
		else if (/r2l/.test(opts.clip))
			clip = 'rect(0px '+w+'px '+h+'px '+w+'px)';
		else if (/t2b/.test(opts.clip))
			clip = 'rect(0px '+w+'px 0px 0px)';
		else if (/b2t/.test(opts.clip))
			clip = 'rect('+h+'px '+w+'px '+h+'px 0px)';
		else if (/zoom/.test(opts.clip)) {
			var top = parseInt(h/2,10);
			var left = parseInt(w/2,10);
			clip = 'rect('+top+'px '+left+'px '+top+'px '+left+'px)';
		}
	}

	opts.cssBefore.clip = opts.cssBefore.clip || clip || 'rect(0px 0px 0px 0px)';

	var d = opts.cssBefore.clip.match(/(\d+)/g);
	var t = parseInt(d[0],10), r = parseInt(d[1],10), b = parseInt(d[2],10), l = parseInt(d[3],10);

	opts.before.push(function(curr, next, opts) {
		if (curr == next) return;
		var $curr = $(curr), $next = $(next);
		$.fn.cycle.commonReset(curr,next,opts,true,true,false);
		opts.cssAfter.display = 'block';

		var step = 1, count = parseInt((opts.speedIn / 13),10) - 1;
		(function f() {
			var tt = t ? t - parseInt(step * (t/count),10) : 0;
			var ll = l ? l - parseInt(step * (l/count),10) : 0;
			var bb = b < h ? b + parseInt(step * ((h-b)/count || 1),10) : h;
			var rr = r < w ? r + parseInt(step * ((w-r)/count || 1),10) : w;
			$next.css({ clip: 'rect('+tt+'px '+rr+'px '+bb+'px '+ll+'px)' });
			(step++ <= count) ? setTimeout(f, 13) : $curr.css('display', 'none');
		})();
	});
	$.extend(opts.cssBefore, { display: 'block', opacity: 1, top: 0, left: 0 });
	opts.animIn	   = { left: 0 };
	opts.animOut   = { left: 0 };
};

})(jQuery);
;
var Mustache="undefined"!==typeof module&&module.exports||{};
(function(j){function G(a){return(""+a).replace(/&(?!\w+;)|[<>"']/g,function(a){return H[a]||a})}function t(a,c,d,e){for(var e=e||"<template>",b=c.split("\n"),f=Math.max(d-3,0),g=Math.min(b.length,d+3),b=b.slice(f,g),i=0,l=b.length;i<l;++i)g=i+f+1,b[i]=(g===d?" >> ":"    ")+b[i];a.template=c;a.line=d;a.file=e;a.message=[e+":"+d,b.join("\n"),"",a.message].join("\n");return a}function u(a,c,d){if("."===a)return c[c.length-1];for(var a=a.split("."),e=a.length-1,b=a[e],f,g,i=c.length,l,j;i;){j=c.slice(0);
    g=c[--i];for(l=0;l<e;){g=g[a[l++]];if(null==g)break;j.push(g)}if(g&&"object"===typeof g&&b in g){f=g[b];break}}"function"===typeof f&&(f=f.call(j[j.length-1]));return null==f?d:f}function I(a,c,d,e){var b="",a=u(a,c);if(e){if(null==a||!1===a||q(a)&&0===a.length)b+=d()}else if(q(a))y(a,function(a){c.push(a);b+=d();c.pop()});else if("object"===typeof a)c.push(a),b+=d(),c.pop();else if("function"===typeof a)var f=c[c.length-1],b=b+(a.call(f,d(),function(a){return r(a,f)})||"");else a&&(b+=d());return b}
    function z(a,c){for(var c=c||{},d=c.tags||j.tags,e=d[0],b=d[d.length-1],f=['var buffer = "";',"\nvar line = 1;","\ntry {",'\nbuffer += "'],g=[],i=!1,l=!1,r=function(){if(i&&!l&&!c.space)for(;g.length;)f.splice(g.pop(),1);else g=[];l=i=!1},n=[],v,p,q,w=function(a){d=o(a).split(/\s+/);p=d[0];q=d[d.length-1]},x=function(a){f.push('";',v,'\nvar partial = partials["'+o(a)+'"];',"\nif (partial) {","\n  buffer += render(partial,stack[stack.length - 1],partials);","\n}",'\nbuffer += "')},u=function(b,d){var e=
        o(b);if(""===e)throw t(Error("Section name may not be empty"),a,s,c.file);n.push({name:e,inverted:d});f.push('";',v,'\nvar name = "'+e+'";',"\nvar callback = (function () {","\n  return function () {",'\n    var buffer = "";','\nbuffer += "')},y=function(a){u(a,!0)},z=function(b){var b=o(b),d=0!=n.length&&n[n.length-1].name;if(!d||b!=d)throw t(Error('Section named "'+b+'" was never opened'),a,s,c.file);b=n.pop();f.push('";',"\n    return buffer;","\n  };","\n})();");b.inverted?f.push("\nbuffer += renderSection(name,stack,callback,true);"):
        f.push("\nbuffer += renderSection(name,stack,callback);");f.push('\nbuffer += "')},A=function(a){f.push('";',v,'\nbuffer += lookup("'+o(a)+'",stack,"");','\nbuffer += "')},B=function(a){f.push('";',v,'\nbuffer += escapeHTML(lookup("'+o(a)+'",stack,""));','\nbuffer += "')},s=1,m,k,h=0,C=a.length;h<C;++h)if(a.slice(h,h+e.length)===e){h+=e.length;m=a.substr(h,1);v="\nline = "+s+";";p=e;q=b;i=!0;switch(m){case "!":h++;k=null;break;case "=":h++;b="="+b;k=w;break;case ">":h++;k=x;break;case "#":h++;k=u;
        break;case "^":h++;k=y;break;case "/":h++;k=z;break;case "{":b="}"+b;case "&":h++;l=!0;k=A;break;default:l=!0,k=B}m=a.indexOf(b,h);if(-1===m)throw t(Error('Tag "'+e+'" was not closed properly'),a,s,c.file);e=a.substring(h,m);k&&k(e);for(k=0;~(k=e.indexOf("\n",k));)s++,k++;h=m+b.length-1;e=p;b=q}else switch(m=a.substr(h,1),m){case '"':case "\\":l=!0;f.push("\\"+m);break;case "\r":break;case "\n":g.push(f.length);f.push("\\n");r();s++;break;default:D.test(m)?g.push(f.length):l=!0,f.push(m)}if(0!=n.length)throw t(Error('Section "'+
        n[n.length-1].name+'" was not closed properly'),a,s,c.file);r();f.push('";',"\nreturn buffer;","\n} catch (e) { throw {error: e, line: line}; }");b=f.join("").replace(/buffer \+= "";\n/g,"");c.debug&&("undefined"!=typeof console&&console.log?console.log(b):"function"===typeof print&&print(b));return b}function A(a,c){var d=z(a,c),e=new Function("view,partials,stack,lookup,escapeHTML,renderSection,render",d);return function(b,d){var d=d||{},g=[b];try{return e(b,d,g,u,G,I,r)}catch(i){throw t(i.error,
        a,i.line,c.file);}}}function B(a,c){c=c||{};return!1!==c.cache?(p[a]||(p[a]=A(a,c)),p[a]):A(a,c)}function r(a,c,d){return B(a)(c,d)}j.name="mustache.js";j.version="0.5.0-dev";j.tags=["[[","]]"];j.parse=z;j.compile=B;j.render=r;j.clearCache=function(){p={}};j.to_html=function(a,c,d,e){a=r(a,c,d);if("function"===typeof e)e(a);else return a};var J=Object.prototype.toString,C=Array.isArray,E=Array.prototype.forEach,F=String.prototype.trim,q;q=C?C:function(a){return"[object Array]"===J.call(a)};var y;
    y=E?function(a,c,d){return E.call(a,c,d)}:function(a,c,d){for(var e=0,b=a.length;e<b;++e)c.call(d,a[e],e,a)};var D=/^\s*$/,o;if(F)o=function(a){return null==a?"":F.call(a)};else{var w,x;D.test("\u00a0")?(w=/^\s+/,x=/\s+$/):(w=/^[\s\xA0]+/,x=/[\s\xA0]+$/);o=function(a){return a==null?"":(""+a).replace(w,"").replace(x,"")}}var H={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},p={}})(Mustache);;
//loads templates for mustache.js

var dd = dd || {}
dd.mustache = dd.mustache || {}
dd.mustache._t = {}

$('.mustache-template').each(function (){
    dd.mustache._t[this.id] = $(this).html();
});

dd.mustache.render = function(id, template_name, view){
    $('#'+id).append(
        Mustache.to_html(dd.mustache._t[template_name], view, dd.mustache._t)
    );
}

dd.mustache.render_after = function(id, template_name, view) {
    $('#'+id).after(
        Mustache.to_html(dd.mustache._t[template_name], view, dd.mustache._t)
    );
}
;
var __data = __data || {};
__data.targeting = __data.targeting || {};

var dd = dd || {};
dd.infiniteScroll = dd.infiniteScroll || {};

dd.infiniteScroll._data = {};

dd.infiniteScroll._requested = {};

dd.infiniteScroll._awaitingProcess = [];

dd.infiniteScroll.getNextIndex = function(index){
    if(index < this._index){
        return this._index;
    } else {
        if(index == this._index){
            this._index++;
            return this._index;
        } else {
            return this._index;
        }
    }
}

dd.infiniteScroll.getInitIndex = function() {
    if (typeof(this.initIndex) == "undefined") {
        this.initIndex = 0;
        return this.initIndex;
    }
    return this.initIndex;
}

dd.infiniteScroll.indexUrl = function(){
    var path = location.pathname;

    // Shameful hack so infinite can be used as linkbait on comics //
    // TODO: One api url to rule them all. - FGR //
    var url = '/infinite_scroll/'
    if (path.match("comics") == "comics"){
        var url = "/topics/lol/" + 'infinite_scroll/';
    } else if (path.match("topics") == "topics" ||
               path.match("authors") == "authors" ||
               path.match("tags") == "tags" ||
               path.match("communities") == "communities" ||
               path.match("latest") == "latest"){
        var url = path + 'infinite_scroll/';
    } else if (path.match("/search/") == "/search/") {
        // special case, search does not use infinite scroll
        return false;
    }

    if (url.slice(0, 1) !== '/') {
        url = '/' + url;
    }
    return url;
}

dd.infiniteScroll._scroll = function(){
    this.processData();
}

dd.infiniteScroll.processData = function(){
    if(dd.infiniteScroll._awaitingProcess.length > 0){
        //get next piece of data awaiting processing
        var index = dd.infiniteScroll._awaitingProcess.shift();
        var data = this._data[index];

        //display ads if necessary
        if(index % 2 == 0){
            dd.mustache.render(this._id, 'infinite_scroll_inline_ads', {index: index});
            adDiscover(document.getElementById('inline-ad-' + index.toString()));
        }

        // Display the content
        //
        // Howto: This will render the content into a template named "scroll_block" found by mustache.
        // Change the include that draws the hidden "scroll_block" template to change the layout.
        //
        // TODO:
        //  Make this smart about picking renderable blocks which match the amount of content returned.
        //   i.e. instead of just "scroll_block", these should be something like:
        //    scroll_block_3 - 3 up, one row of span4 tiles
        //    scroll_block_6 - could be a line of span2 single row, or some combo of 2x span4 & 4x span2
        //    scroll_block_7 - Pull left or right 1 x span6 & 6 x span2

        dd.mustache.render(this._id, 'scroll_block', data);
        // This searches for new tiles and adds the hover event binding for social shares.
        dd.site.dailyClip.bindNew();

        //setup the next trigger
        $('#infinite-loop-trigger-'+index).appear();
        $('#infinite-loop-trigger-'+index).on('appear', function(event, items){
            $(this).off('appear');
            dd.infiniteScroll._scroll();
        });

        var $container = $('#infinite-loop-trigger-' + index).prev()
        $container.find('img.infinite-lzy-ld').lazyload({
          threshold: 200,
          effect: "fadeIn"
        });

        //cache next set of data
        this._getData(this.getNextIndex(index), this._scroll());
    }
}

dd.infiniteScroll.init = function(id, initial_data){
    this._id = id;
    var index = initial_data.index;
    this._startIndex = index;
    this._index = index + 1;
    this._data[index] = initial_data;
    this._awaitingProcess.push(index);


    // insert after second child of #scroll if using standard infinite scroll
    if (this._indexUrl === '/infinite_scroll/') {
        var scroll_children = $("#scroll").children()
        if (scroll_children[1] === undefined) {return false;}
        var initial_inf_scroll_dom_id = scroll_children[1].id;
        dd.mustache.render_after(initial_inf_scroll_dom_id, 'inline_full_page_ad', {});
        console.log("Rendering an infinitescroll ad!!")
        console.log(__data.targeting);
        adDiscover(document.getElementById('ad-container-fullpage'));
    }

    $('#infinite-loop-end').appear();
    $('#infinite-loop-trigger-'+(index - 1)).appear();
    $('#infinite-loop-trigger-'+(index - 1)).on('appear', function(event, items){
       $(this).off('appear');
       dd.infiniteScroll._scroll();
    });
}

dd.infiniteScroll._getData = function(index, callback){
    this._requested[index] = 0;
    $.get(this._indexUrl,
        {'index': index},
        function (data){
            //store the received data
            var i = data.index;
            dd.infiniteScroll._awaitingProcess.push(i);
            dd.infiniteScroll._data[i] = data;
            if(dd.infiniteScroll._requested[i]){
                dd.infiniteScroll._requested[i] = false;
            }
            if(callback){
                callback();
            }
        },
        'json'
    );
}

dd.infiniteScroll.reboot = function(){
    if(this._awaitingProcess.length > 0){
        this.processData();
    }else{
        if(this._requested.length == 0){
            this._getData(this.getNextIndex(index), this._scroll());
        }
    }
}

// calculate and cache the indexUrl
dd.infiniteScroll._indexUrl = dd.infiniteScroll.indexUrl()

// if indexUrl() doesn't return false, do infinite scroll
if (dd.infiniteScroll._indexUrl) {
    $.get(dd.infiniteScroll._indexUrl,
        {'index': dd.infiniteScroll.getInitIndex() + 1},
        function (data){
            dd.infiniteScroll.init('scroll', data);
        },
        'json'
    );

    setInterval(function(){
        if($('#infinite-loop-end').is(':appeared')){
            dd.infiniteScroll.reboot();
        }
    }, 200);
}
;
/* =============================================================
 * bootstrap-scrollspy.js v2.2.2
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* SCROLLSPY CLASS DEFINITION
  * ========================== */

  function ScrollSpy(element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href
    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll-spy.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.$body = $('body')
    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {
        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && $href.length
              && [[ $href.position().top + self.$scrollElement.scrollTop(), href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
          , maxScroll = scrollHeight - this.$scrollElement.height()
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets.last()[0])
            && this.activate ( i )
        }

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
      }

    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        active = $(selector)
          .parent('li')
          .addClass('active')

        if (active.parent('.dropdown-menu').length)  {
          active = active.closest('li.dropdown').addClass('active')
        }

        active.trigger('activate')
      }

  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY NO CONFLICT
  * ===================== */

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


 /* SCROLLSPY DATA-API
  * ================== */

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);;
/* =============================================================
 * bootstrap-typeahead.js v2.2.2
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function($){

  "use strict"; // jshint ;_;


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.source = this.options.source
    this.$menu = $(this.options.menu)
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
    }

  , updater: function (item) {
      return item
    }

  , show: function () {
      var pos = $.extend({}, this.$element.position(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu
        .insertAfter(this.$element)
        .css({
          top: pos.top + pos.height
        , left: pos.left
        })
        .show()

      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var items

      this.query = this.$element.val()

      if (!this.query || this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this
      }

      items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source

      return items ? this.process(items) : this
    }

  , process: function (items) {
      var that = this

      items = $.grep(items, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if (this.eventSupported('keydown')) {
        this.$element.on('keydown', $.proxy(this.keydown, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
    }

  , eventSupported: function(eventName) {
      var isSupported = eventName in this.$element
      if (!isSupported) {
        this.$element.setAttribute(eventName, 'return;')
        isSupported = typeof this.$element[eventName] === 'function'
      }
      return isSupported
    }

  , move: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , keydown: function (e) {
      this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27])
      this.move(e)
    }

  , keypress: function (e) {
      if (this.suppressKeyPressRepeat) return
      this.move(e)
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
        case 16: // shift
        case 17: // ctrl
        case 18: // alt
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , blur: function (e) {
      var that = this
      setTimeout(function () { that.hide() }, 150)
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
    }

  , mouseenter: function (e) {
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  var old = $.fn.typeahead

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  , minLength: 1
  }

  $.fn.typeahead.Constructor = Typeahead


 /* TYPEAHEAD NO CONFLICT
  * =================== */

  $.fn.typeahead.noConflict = function () {
    $.fn.typeahead = old
    return this
  }


 /* TYPEAHEAD DATA-API
  * ================== */

  $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
    var $this = $(this)
    if ($this.data('typeahead')) return
    e.preventDefault()
    $this.typeahead($this.data())
  })

}(window.jQuery);
;
/* =========================================================
 * bootstrap-modal.js v2.2.2
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (element, options) {
    this.options = options
    this.$element = $(element)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
    this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        this.isShown = true

        this.escape()

        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element
            .show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element
            .addClass('in')
            .attr('aria-hidden', false)

          that.enforceFocus()

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown') }) :
            that.$element.focus().trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        this.escape()

        $(document).off('focusin.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)

        $.support.transition && this.$element.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideModal()
      }

    , enforceFocus: function () {
        var that = this
        $(document).on('focusin.modal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }

    , escape: function () {
        var that = this
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal')
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end)
              that.hideModal()
            }, 500)

        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          that.hideModal()
        })
      }

    , hideModal: function (that) {
        this.$element
          .hide()
          .trigger('hidden')

        this.backdrop()
      }

    , removeBackdrop: function () {
        this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
          var doAnimate = $.support.transition && animate

          this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
            .appendTo(document.body)

          this.$backdrop.click(
            this.options.backdrop == 'static' ?
              $.proxy(this.$element[0].focus, this.$element[0])
            : $.proxy(this.hide, this)
          )

          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

          this.$backdrop.addClass('in')

          doAnimate ?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('in')

          $.support.transition && this.$element.hasClass('fade')?
            this.$backdrop.one($.support.transition.end, $.proxy(this.removeBackdrop, this)) :
            this.removeBackdrop()

        } else if (callback) {
          callback()
        }
      }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  var old = $.fn.modal

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL NO CONFLICT
  * ================= */

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


 /* MODAL DATA-API
  * ============== */

  $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this = $(this)
      , href = $this.attr('href')
      , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
      , option = $target.data('modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option)
      .one('hide', function () {
        $this.focus()
      })
  })

}(window.jQuery);
;
/* ========================================================
 * bootstrap-tab.js v2.2.2
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active:last a')[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB NO CONFLICT
  * =============== */

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


 /* TAB DATA-API
  * ============ */

  $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(window.jQuery);;
var dd = dd || {};

dd.social = dd.social || {};

dd.social.facebook = dd.social.facebook || {};

dd.social.facebook._share = function(url){
    var _fb_child = window.open(url, 'Share on Facebook', "height=330,width=560");
}

//$('.fb-share').each(function(){
//    this.href="javascript:void(0);";
//});
//
//$('.fb-share').on('click', function(){
//    dd.social.facebook._share($(this).data('fbshareUrl'));
//})

;
var dd = dd || {};
dd.site = dd.site || {};
dd.site.satisfaction = dd.site.satisfaction || {};

dd.site.satisfaction = (function() {

    return {
        init: function(options) {
          
          $(document).ready( function(){
            // Any element with data-toggle='satisfaction' will trigger the dialog on click
            $("[data-toggle='satisfaction']").each(function (index, Element) {
              $(Element).click( function() { dd.site.satisfaction.toggleDialog(); });
            });
            dd.site.satisfaction.getVotableIssuesList();
            
            //set up tab behavior
            $('#satisfaction-tabs a').not('#satisfaction-tabs a:first').each( function(index, Element) { 
                $(Element).click( function(e) { e.preventDefault(); $(Element).tab('show'); $('#satisfaction-save').show(); });
            });
            $('#satisfaction-tabs a:first').each( function(index, Element) { 
                $(Element).click( function(e) { e.preventDefault(); $('#satisfaction-save').hide(); $('#satisfaction-tabs a:first').tab('show'); });
            });
            $('#satisfaction-save').hide();

            
            $('#satisfaction-save').click( function(e) { 
              e.preventDefault(); 
              var form = '#satisfaction-' + $('#satisfaction-tabs .active').text().toLowerCase();
              var data = {}
              data.issue_type = $('#satisfaction-tabs .active').text().toUpperCase();
              data.issue_text = $(form + ' [data-field=issue_text]').val();
              if(data.issue_type === 'PROBLEM'){
                data.issue_url = $(form + ' [data-field=issue_url]').val();
              }else{
                data.issue_url = '';
              }
              data.submitter = $(form + ' [data-field=submitter]').val();
              data.contact = $(form + ' [data-field=contact]').val();
              if(data.issue_text.length > 10){
                dd.site.satisfaction.createIssue(data);
              }else{
                $(form + ' [data-field=issue_text]').focus();
              }
            });            
          });

        },
        showToAnalytics: function(targetUrl) {
            _gaq.push(['_trackEvent', 'Satisfaction', 'show', targetUrl]);
        },
        createToAnalytics: function(targetUrl) {
            _gaq.push(['_trackEvent', 'Satisfaction', 'create', targetUrl]);

        },
        voteToAnalytics: function(targetUrl) {
            _gaq.push(['_trackEvent', 'Satisfaction', 'vote', targetUrl]);
        },
        toggleDialog: function() {
          $("#satisfaction").modal('toggle');
          dd.site.satisfaction.showToAnalytics(window.location.href);
        },
        createIssue: function(data){
            dd.site.satisfaction.createToAnalytics(window.location.href);
			/* BUG-157 - make brent rambo load only if success dialog is about to be shown. */
			$("#satisfaction-issue-created-image").attr('src', $("#satisfaction-issue-created-image").attr('lazy-src'));
            var ci = $.ajax({
              url: '/satisfaction/issue/create/',
              data: data
            }).done(function(data)    { 
                $("#satisfaction").modal('toggle');
				$("#satisfaction-issue-created").modal('toggle');
                $('textarea[data-field=issue_text]').val('');
                $('input[data-field=issue_url]').val('');
                $('input[data-field=submitter]').val('');
                $('input[data-field=contact]').val('');
                $('#satisfaction-tabs a:first').tab('show');
                $('#satisfaction-save').hide(); 
              })
              .fail(function(data)    { })
              .always(function(data)  { });
        },
        voteIssue: function(id){
            dd.site.satisfaction.voteToAnalytics(window.location.href);
            var vi = $.ajax({
              url: '/satisfaction/issue/' + id + '/vote/'
            }).done(function(data)    { 
                $('.satisfaction-vote-count[data-issue=' + data.id + ']')[0].innerHTML = data.upvotes;
              })
              .fail(function(data)    { })
              .always(function(data)  { });
        },
        getVotableIssuesList: function(){
          var gvil = $.ajax({
            url: '/satisfaction/ballot/'
          }).done(function(data)    { dd.site.satisfaction.drawBallot(data); })
            .fail(function(data)    {  })
            .always(function(data)  {  });
        },
        drawBallot: function(data){
          // mark up and inject the current ballot
          if(data.length > 0){
              for(var issue in data){
                var html = '';
                var html = html.concat('<div class="row-fluid">');
                var html = html.concat('<div class="span2"><span class="satisfaction-vote-count" data-issue="' + data[issue].id + '">' + data[issue].upvotes + '</span></div>'); 
                var html = html.concat('<div class="span2"><span class="satisfaction-upvote" data-issue="' + data[issue].id + '"><i class="icon-arrow-up"></i></span></div>');
                var html = html.concat('<div class="span8">' + data[issue].issue_text + '</div>');
                var html = html.concat('</div>');
            
                $('#satisfaction_ballot').append(html);
              }
          }else{
              var html = '';
              var html = html.concat('<div class="row-fluid">');
              var html = html.concat('<div class="span12">There are no issues currently approved for voting. Sorry!</div>');
              var html = html.concat('</div>');
              $('#satisfaction_ballot').append(html);
          }
          
          $('.satisfaction-upvote').each( function(index, Element) { 
              $(Element).click( function(e) { e.preventDefault(); dd.site.satisfaction.voteIssue($(Element).attr('data-issue')); });
          });
        }
    }
}());

(function() { dd.site.satisfaction.init(); }());
;
$(document).ready(function() {
    $('a[href*=#]:not([href=#],[href=#Carousel])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') 
            || location.hostname == this.hostname) {    
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
               if (target.length) {
                 $('body').animate({
                     /* minus 60 backs the scroll point up so you see the section title */
                     scrollTop: target.offset().top - 60
                }, 1000);
                location.hash = $(this.hash).selector;
                return false;
                }else{
                  /*  tiny hack. if there is no #trending div in the current page
                      toss the visitor to / for great justice. */
                  if(this.hash === '#trending'){ 
                    window.location = '/';
                  }else{
                    return false;
                  }
                }
        }
    });
});;
if(!window.console){window.console={}
}if(typeof window.console.log!=="function"){window.console.log=function(){}
}if(typeof window.console.warn!=="function"){window.console.warn=function(){}
}(function(){var R={"bootstrapInit":+new Date()},p=document,l=(/^https?:\/\/.*?linkedin.*?\/in\.js.*?$/),b=(/async=true/),D=(/^https:\/\//),J=(/\/\*((?:.|[\s])*?)\*\//m),F=(/\r/g),j=(/[\s]/g),g=(/^[\s]*(.*?)[\s]*:[\s]*(.*)[\s]*$/),x=(/_([a-z])/gi),A=(/^[\s]+|[\s]+$/g),u=(/^[a-z]{2}(_)[A-Z]{2}$/),C=(/suppress(Warnings|_warnings):true/gi),d=(/^api(Key|_key)$/gi),k="\n",G=",",n="",I="@",o="extensions",Y="on",w="onDOMReady",ab="onOnce",Z="script",L="https://www.linkedin.com/uas/js/userspace?v=0.0.2000-RC1.26929-1405",h="https://platform.linkedin.com/js/secureAnonymousFramework?v=0.0.2000-RC1.26929-1405",H="http://platform.linkedin.com/js/nonSecureAnonymousFramework?v=0.0.2000-RC1.26929-1405",B=p.getElementsByTagName("head")[0],t=p.getElementsByTagName(Z),W=[],a=[],O=["lang"],Q={},c=false,ac,m,V,r,K,E,aa;
if(window.IN&&IN.ENV&&IN.ENV.js){if(!IN.ENV.js.suppressWarnings){console.warn("duplicate in.js loaded, any parameters will be ignored")
}return
}window.IN=window.IN||{};
IN.ENV={};
IN.ENV.js={};
IN.ENV.js.extensions={};
statsQueue=IN.ENV.statsQueue=[];
statsQueue.push(R);
ac=IN.ENV.evtQueue=[];
IN.Event={on:function(){ac.push({type:Y,args:arguments})
},onDOMReady:function(){ac.push({type:w,args:arguments})
},onOnce:function(){ac.push({type:ab,args:arguments})
}};
IN.$extensions=function(af){var ai,i,ae,ah,ag=IN.ENV.js.extensions;
ai=af.split(G);
for(var ad=0,e=ai.length;
ad<e;
ad++){i=U(ai[ad],I,2);
ae=i[0].replace(A,n);
ah=i[1];
if(!ag[ae]){ag[ae]={src:(ah)?ah.replace(A,n):n,loaded:false}
}}};
function U(af,ad,e){var ag=af.split(ad);
if(!e){return ag
}if(ag.length<e){return ag
}var ae=ag.splice(0,e-1);
var i=ag.join(ad);
ae.push(i);
return ae
}function v(e,i){if(e==o){IN.$extensions(i);
return null
}if(d.test(e)){i=i.replace(j,n)
}if(i==""){return null
}return i
}function N(ae,af){af=v(ae,af);
if(af){ae=ae.replace(x,function(){return arguments[1].toUpperCase()
});
if(ae==="lang"&&!u.test(af)){try{var ad=af.replace("-","_").split("_");
ad=[ad[0].substr(0,2).toLowerCase(),ad[1].substr(0,2).toUpperCase()].join("_");
if(!u.test(ad)){throw new Error()
}else{af=ad
}}catch(ag){if(!(aa||IN.ENV.js.suppressWarnings)&&af){console.warn("'"+af+"' is not a supported language, defaulting to 'en_US'")
}af="en_US"
}}IN.ENV.js[ae]=af;
var ah=[encodeURIComponent(ae),encodeURIComponent(af)].join("=");
for(var i in O){if(O.hasOwnProperty(i)&&O[i]===ae){a.push(ah);
return
}}W.push(ah)
}}m="";
for(T=0,q=t.length;
T<q;
T++){var f=t[T];
if(!l.test(f.src)){continue
}if(b.test(f.src)){c=true
}try{m=f.innerHTML.replace(A,n)
}catch(z){try{m=f.text.replace(A,n)
}catch(y){}}}m=m.replace(J,"$1").replace(A,n).replace(F,n);
aa=C.test(m.replace(j,n));
for(var T=0,S=m.split(k),q=S.length;
T<q;
T++){var s=S[T];
if(!s||s.replace(j,n).length<=0){continue
}try{V=s.match(g);
r=V[1].replace(A,n);
K=V[2].replace(A,n)
}catch(X){if(!aa){console.warn("script tag contents must be key/value pairs separated by a colon. Source: "+X)
}continue
}N(r,K)
}N("secure",(D.test(document.location.href))?1:0);
function M(e,i){return e+((/\?/.test(e))?"&":"?")+i.join("&")
}IN.init=function P(e){var ad,ae;
e=e||{};
for(var i in e){if(e.hasOwnProperty(i)){N(i,e[i])
}}E=p.createElement(Z);
ae=(IN.ENV.js.apiKey)?M(L,W):(IN.ENV.js.secure)?h:H;
E.src=M(ae,a);
B.appendChild(E);
statsQueue.push({"userspaceRequested":+new Date()})
};
statsQueue.push({"bootstrapLoaded":+new Date()});
if(!c){IN.init()
}})();;
// ECMA doesn't define these. As a result, some browsers may be missing them as native functions. 
// If we're on one of those browsers, this will add them as if they were native.

//String
if (typeof String.prototype.trimLeft !== "function") {
    String.prototype.trimLeft = function() {
        return this.replace(/^\s+/, "");
    };
}
if (typeof String.prototype.trimRight !== "function") {
    String.prototype.trimRight = function() {
        return this.replace(/\s+$/, "");
    };
}

//Array
if (typeof Array.prototype.map !== "function") {
    Array.prototype.map = function(callback, thisArg) {
        for (var i = 0, n = this.length, a = []; i < n; i++) {
            if (i in this) a[i] = callback.call(thisArg, this[i]);
        }
        return a;
    };
}

;
// C is for cookie

var dd = dd || {};
dd.cookies = dd.cookies || {};

dd.cookies = (function(){
    
    return {
        get: function (name) {
          return this.gets()[name];
        },
        
        gets: function () {
          var c = document.cookie,
              v = 0,
              cookies = {};
          if (document.cookie.match(/^\s*\$Version=(?:"1"|1);\s*(.*)/)) {
              c = RegExp.$1;
              v = 1;
          }
          if (v === 0) {
              c.split(/[,;]/).map(function(cookie) {
                  var parts = cookie.split(/=/, 2),
                      name = decodeURIComponent(parts[0].trimLeft()),
                      value = parts.length > 1 ? decodeURIComponent(parts[1].trimRight()) : null;
                  cookies[name] = value;
              });
          } else {
              c.match(/(?:^|\s+)([!#$%&'*+\-.0-9A-Z^`a-z|~]+)=([!#$%&'*+\-.0-9A-Z^`a-z|~]*|"(?:[\x20-\x7E\x80\xFF]|\\[\x00-\x7F])*")(?=\s*[,;]|$)/g).map(function($0, $1) {
                  var name = $0,
                      value = $1.charAt(0) === '"' ? $1.substr(1, -1).replace(/\\(.)/g, "$1") : $1;
                  cookies[name] = value;
              });
          }
          return cookies;
        },
        
        set: function (c_name, value, exdays) {
          var exdate = new Date();
          exdate.setDate(exdate.getDate() + exdays);
          var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString()) + '; path=' + '/';
          document.cookie = c_name + "=" + c_value;
        }
    }
}());
  
;
/* Singleton to find and bind new infinite scroll tile social widgets */
var dd = dd || {};
dd.site = dd.site || {};
dd.site.dailyClip = dd.site.dailyClip || {};


function is_touch_device() {
  return !!('ontouchstart' in window) // works on most browsers
      || !!('onmsgesturechange' in window); // works on ie10
};

dd.site.dailyClip = (function () {

    return {
      bindNew: function () {
        if(is_touch_device())
          {
            //No hover on mobile.
            return;
          }
        else
          {
            $(".daily-clip").each( function () {
                  if($(this).hasClass('hover-bound')){
                    // already bound
                  }else{
                    $(this).hover( function () {
                        // This makes the social controls fadein/out on story tiles
                        $(this).find('.daily-social, .dailydot-micro').fadeToggle();
                    });
                    $(this).addClass('hover-bound');
                  };
              });
          }
      }
    }
}());
;
(function(){var aa=encodeURIComponent,ba=Infinity,ca=setTimeout,da=isNaN,m=Math,ea=decodeURIComponent;function Ie(a,b){return a.onload=b}function Je(a,b){return a.onerror=b}function ha(a,b){return a.name=b}
var p="replace",la="floor",ma="charAt",oa="match",pa="port",qa="createElement",g="getTime",u="host",v="toString",y="split",ta="stopPropagation",z="location",va="search",A="protocol",xa="href",ya="apply",n="push",ia="test",ja="slice",ka="load",na="value",q="indexOf",ra="path",r="name",w="length",x="prototype",sa="clientWidth",ua="scope",wa="clientHeight",B="substring",za="navigator",C="join",D="toLowerCase",E;function Aa(a,b){switch(b){case 0:return""+a;case 1:return 1*a;case 2:return!!a;case 3:return 1E3*a}return a}function Ba(a){return"function"==typeof a}function Ca(a){return void 0!=a&&-1<(a.constructor+"")[q]("String")}function F(a,b){return void 0==a||"-"==a&&!b||""==a}function Da(a){if(!a||""==a)return"";for(;a&&-1<" \n\r\t"[q](a[ma](0));)a=a[B](1);for(;a&&-1<" \n\r\t"[q](a[ma](a[w]-1));)a=a[B](0,a[w]-1);return a}function Ea(){return m.round(2147483647*m.random())}function Fa(){}
function G(a,b){if(aa instanceof Function)return b?encodeURI(a):aa(a);H(68);return escape(a)}function I(a){a=a[y]("+")[C](" ");if(ea instanceof Function)try{return ea(a)}catch(b){H(17)}else H(68);return unescape(a)}var Ga=function(a,b,c,d){a.addEventListener?a.addEventListener(b,c,!!d):a.attachEvent&&a.attachEvent("on"+b,c)},Ha=function(a,b,c,d){a.removeEventListener?a.removeEventListener(b,c,!!d):a.detachEvent&&a.detachEvent("on"+b,c)};
function Ia(a,b){if(a){var c=J[qa]("script");c.type="text/javascript";c.async=!0;c.src=a;c.id=b;var d=J.getElementsByTagName("script")[0];d.parentNode.insertBefore(c,d);return c}}function K(a){return a&&0<a[w]?a[0]:""}function L(a){var b=a?a[w]:0;return 0<b?a[b-1]:""}var Ja=function(){this.prefix="ga.";this.R={}};Ja[x].set=function(a,b){this.R[this.prefix+a]=b};Ja[x].get=function(a){return this.R[this.prefix+a]};Ja[x].contains=function(a){return void 0!==this.get(a)};function Ka(a){0==a[q]("www.")&&(a=a[B](4));return a[D]()}function La(a,b){var c,d={url:a,protocol:"http",host:"",path:"",d:new Ja,anchor:""};if(!a)return d;c=a[q]("://");0<=c&&(d.protocol=a[B](0,c),a=a[B](c+3));c=a[va]("/|\\?|#");if(0<=c)d.host=a[B](0,c)[D](),a=a[B](c);else return d.host=a[D](),d;c=a[q]("#");0<=c&&(d.anchor=a[B](c+1),a=a[B](0,c));c=a[q]("?");0<=c&&(Na(d.d,a[B](c+1)),a=a[B](0,c));d.anchor&&b&&Na(d.d,d.anchor);a&&"/"==a[ma](0)&&(a=a[B](1));d.path=a;return d}
function Oa(a,b){function c(a){var b=(a.hostname||"")[y](":")[0][D](),c=(a[A]||"")[D](),c=1*a[pa]||("http:"==c?80:"https:"==c?443:"");a=a.pathname||"";0==a[q]("/")||(a="/"+a);return[b,""+c,a]}var d=b||J[qa]("a");d.href=J[z][xa];var e=(d[A]||"")[D](),f=c(d),Be=d[va]||"",k=e+"//"+f[0]+(f[1]?":"+f[1]:"");0==a[q]("//")?a=e+a:0==a[q]("/")?a=k+a:a&&0!=a[q]("?")?0>a[y]("/")[0][q](":")&&(a=k+f[2][B](0,f[2].lastIndexOf("/"))+"/"+a):a=k+f[2]+(a||Be);d.href=a;e=c(d);return{protocol:(d[A]||"")[D](),host:e[0],
port:e[1],path:e[2],Oa:d[va]||"",url:a||""}}function Na(a,b){function c(b,c){a.contains(b)||a.set(b,[]);a.get(b)[n](c)}for(var d=Da(b)[y]("&"),e=0;e<d[w];e++)if(d[e]){var f=d[e][q]("=");0>f?c(d[e],"1"):c(d[e][B](0,f),d[e][B](f+1))}}function Pa(a,b){if(F(a)||"["==a[ma](0)&&"]"==a[ma](a[w]-1))return"-";var c=J.domain;return a[q](c+(b&&"/"!=b?b:""))==(0==a[q]("http://")?7:0==a[q]("https://")?8:0)?"0":a};var Qa=0;function Ra(a,b,c){1<=Qa||1<=100*m.random()||ld()||(a=["utmt=error","utmerr="+a,"utmwv=5.6.0","utmn="+Ea(),"utmsp=1"],b&&a[n]("api="+b),c&&a[n]("msg="+G(c[B](0,100))),M.w&&a[n]("aip=1"),Sa(a[C]("&")),Qa++)};var Ta=0,Ua={};function N(a){return Va("x"+Ta++,a)}function Va(a,b){Ua[a]=!!b;return a}
var Wa=N(),Xa=Va("anonymizeIp"),Ya=N(),$a=N(),ab=N(),bb=N(),O=N(),P=N(),cb=N(),db=N(),eb=N(),fb=N(),gb=N(),hb=N(),ib=N(),jb=N(),kb=N(),lb=N(),nb=N(),ob=N(),pb=N(),qb=N(),rb=N(),sb=N(),tb=N(),ub=N(),vb=N(),wb=N(),xb=N(),yb=N(),zb=N(),Ab=N(),Bb=N(),Cb=N(),Db=N(),Eb=N(),Fb=N(!0),Gb=Va("currencyCode"),Hb=Va("page"),Ib=Va("title"),Jb=N(),Kb=N(),Lb=N(),Mb=N(),Nb=N(),Ob=N(),Pb=N(),Qb=N(),Rb=N(),Q=N(!0),Sb=N(!0),Tb=N(!0),Ub=N(!0),Vb=N(!0),Wb=N(!0),Zb=N(!0),$b=N(!0),ac=N(!0),bc=N(!0),cc=N(!0),R=N(!0),dc=N(!0),
ec=N(!0),fc=N(!0),gc=N(!0),hc=N(!0),ic=N(!0),jc=N(!0),S=N(!0),kc=N(!0),lc=N(!0),mc=N(!0),nc=N(!0),oc=N(!0),pc=N(!0),qc=N(!0),rc=Va("campaignParams"),sc=N(),tc=Va("hitCallback"),uc=N();N();var vc=N(),wc=N(),xc=N(),yc=N(),zc=N(),Ac=N(),Bc=N(),Cc=N(),Dc=N(),Ec=N(),Fc=N(),Gc=N(),Hc=N(),Ic=N();N();var Mc=N(),Nc=N(),Yb=N(),Jc=N(),Kc=N(),Lc=Va("utmtCookieName"),Cd=Va("displayFeatures"),Oc=N(),of=Va("gtmid"),Oe=Va("uaName"),Pe=Va("uaDomain"),Qe=Va("uaPath");var Re=function(){function a(a,c,d){T($[x],a,c,d)}a("_createTracker",$[x].r,55);a("_getTracker",$[x].oa,0);a("_getTrackerByName",$[x].u,51);a("_getTrackers",$[x].pa,130);a("_anonymizeIp",$[x].aa,16);a("_forceSSL",$[x].la,125);a("_getPlugin",Pc,120)},Se=function(){function a(a,c,d){T(U[x],a,c,d)}Qc("_getName",$a,58);Qc("_getAccount",Wa,64);Qc("_visitCode",Q,54);Qc("_getClientInfo",ib,53,1);Qc("_getDetectTitle",lb,56,1);Qc("_getDetectFlash",jb,65,1);Qc("_getLocalGifPath",wb,57);Qc("_getServiceMode",
xb,59);V("_setClientInfo",ib,66,2);V("_setAccount",Wa,3);V("_setNamespace",Ya,48);V("_setAllowLinker",fb,11,2);V("_setDetectFlash",jb,61,2);V("_setDetectTitle",lb,62,2);V("_setLocalGifPath",wb,46,0);V("_setLocalServerMode",xb,92,void 0,0);V("_setRemoteServerMode",xb,63,void 0,1);V("_setLocalRemoteServerMode",xb,47,void 0,2);V("_setSampleRate",vb,45,1);V("_setCampaignTrack",kb,36,2);V("_setAllowAnchor",gb,7,2);V("_setCampNameKey",ob,41);V("_setCampContentKey",tb,38);V("_setCampIdKey",nb,39);V("_setCampMediumKey",
rb,40);V("_setCampNOKey",ub,42);V("_setCampSourceKey",qb,43);V("_setCampTermKey",sb,44);V("_setCampCIdKey",pb,37);V("_setCookiePath",P,9,0);V("_setMaxCustomVariables",yb,0,1);V("_setVisitorCookieTimeout",cb,28,1);V("_setSessionCookieTimeout",db,26,1);V("_setCampaignCookieTimeout",eb,29,1);V("_setReferrerOverride",Jb,49);V("_setSiteSpeedSampleRate",Dc,132);a("_trackPageview",U[x].Fa,1);a("_trackEvent",U[x].F,4);a("_trackPageLoadTime",U[x].Ea,100);a("_trackSocial",U[x].Ga,104);a("_trackTrans",U[x].Ia,
18);a("_sendXEvent",U[x].t,78);a("_createEventTracker",U[x].ia,74);a("_getVersion",U[x].qa,60);a("_setDomainName",U[x].B,6);a("_setAllowHash",U[x].va,8);a("_getLinkerUrl",U[x].na,52);a("_link",U[x].link,101);a("_linkByPost",U[x].ua,102);a("_setTrans",U[x].za,20);a("_addTrans",U[x].$,21);a("_addItem",U[x].Y,19);a("_clearTrans",U[x].ea,105);a("_setTransactionDelim",U[x].Aa,82);a("_setCustomVar",U[x].wa,10);a("_deleteCustomVar",U[x].ka,35);a("_getVisitorCustomVar",U[x].ra,50);a("_setXKey",U[x].Ca,83);
a("_setXValue",U[x].Da,84);a("_getXKey",U[x].sa,76);a("_getXValue",U[x].ta,77);a("_clearXKey",U[x].fa,72);a("_clearXValue",U[x].ga,73);a("_createXObj",U[x].ja,75);a("_addIgnoredOrganic",U[x].W,15);a("_clearIgnoredOrganic",U[x].ba,97);a("_addIgnoredRef",U[x].X,31);a("_clearIgnoredRef",U[x].ca,32);a("_addOrganic",U[x].Z,14);a("_clearOrganic",U[x].da,70);a("_cookiePathCopy",U[x].ha,30);a("_get",U[x].ma,106);a("_set",U[x].xa,107);a("_addEventListener",U[x].addEventListener,108);a("_removeEventListener",
U[x].removeEventListener,109);a("_addDevId",U[x].V);a("_getPlugin",Pc,122);a("_setPageGroup",U[x].ya,126);a("_trackTiming",U[x].Ha,124);a("_initData",U[x].v,2);a("_setVar",U[x].Ba,22);V("_setSessionTimeout",db,27,3);V("_setCookieTimeout",eb,25,3);V("_setCookiePersistence",cb,24,1);a("_setAutoTrackOutbound",Fa,79);a("_setTrackOutboundSubdomains",Fa,81);a("_setHrefExamineLimit",Fa,80)};function Pc(a){var b=this.plugins_;if(b)return b.get(a)}
var T=function(a,b,c,d){a[b]=function(){try{return void 0!=d&&H(d),c[ya](this,arguments)}catch(a){throw Ra("exc",b,a&&a[r]),a;}}},Qc=function(a,b,c,d){U[x][a]=function(){try{return H(c),Aa(this.a.get(b),d)}catch(e){throw Ra("exc",a,e&&e[r]),e;}}},V=function(a,b,c,d,e){U[x][a]=function(f){try{H(c),void 0==e?this.a.set(b,Aa(f,d)):this.a.set(b,e)}catch(Be){throw Ra("exc",a,Be&&Be[r]),Be;}}},Te=function(a,b){return{type:b,target:a,stopPropagation:function(){throw"aborted";}}};var Rc=new RegExp(/(^|\.)doubleclick\.net$/i),Sc=function(a,b){return Rc[ia](J[z].hostname)?!0:"/"!==b?!1:0!=a[q]("www.google.")&&0!=a[q](".google.")&&0!=a[q]("google.")||-1<a[q]("google.org")?!1:!0},Tc=function(a){var b=a.get(bb),c=a.c(P,"/");Sc(b,c)&&a[ta]()};var Zc=function(){var a={},b={},c=new Uc;this.g=function(a,b){c.add(a,b)};var d=new Uc;this.e=function(a,b){d.add(a,b)};var e=!1,f=!1,Be=!0;this.T=function(){e=!0};this.j=function(a){this[ka]();this.set(sc,a,!0);a=new Vc(this);e=!1;d.cb(this);e=!0;b={};this.n();a.Ja()};this.load=function(){e&&(e=!1,this.Ka(),Wc(this),f||(f=!0,c.cb(this),Xc(this),Wc(this)),e=!0)};this.n=function(){if(e)if(f)e=!1,Xc(this),e=!0;else this[ka]()};this.get=function(c){Ua[c]&&this[ka]();return void 0!==b[c]?b[c]:a[c]};this.set=
function(c,d,e){Ua[c]&&this[ka]();e?b[c]=d:a[c]=d;Ua[c]&&this.n()};this.Za=function(b){a[b]=this.b(b,0)+1};this.b=function(a,b){var c=this.get(a);return void 0==c||""===c?b:1*c};this.c=function(a,b){var c=this.get(a);return void 0==c?b:c+""};this.Ka=function(){if(Be){var b=this.c(bb,""),c=this.c(P,"/");Sc(b,c)||(a[O]=a[hb]&&""!=b?Yc(b):1,Be=!1)}}};Zc[x].stopPropagation=function(){throw"aborted";};
var Vc=function(a){var b=this;this.q=0;var c=a.get(tc);this.Ua=function(){0<b.q&&c&&(b.q--,b.q||c())};this.Ja=function(){!b.q&&c&&ca(c,10)};a.set(uc,b,!0)};function $c(a,b){b=b||[];for(var c=0;c<b[w];c++){var d=b[c];if(""+a==d||0==d[q](a+"."))return d}return"-"}
var bd=function(a,b,c){c=c?"":a.c(O,"1");b=b[y](".");if(6!==b[w]||ad(b[0],c))return!1;c=1*b[1];var d=1*b[2],e=1*b[3],f=1*b[4];b=1*b[5];if(!(0<=c&&0<d&&0<e&&0<f&&0<=b))return!1;a.set(Q,c);a.set(Vb,d);a.set(Wb,e);a.set(Zb,f);a.set($b,b);return!0},cd=function(a){var b=a.get(Q),c=a.get(Vb),d=a.get(Wb),e=a.get(Zb),f=a.b($b,1);return[a.b(O,1),void 0!=b?b:"-",c||"-",d||"-",e||"-",f][C](".")},dd=function(a){return[a.b(O,1),a.b(cc,0),a.b(R,1),a.b(dc,0)][C](".")},ed=function(a,b,c){c=c?"":a.c(O,"1");var d=
b[y](".");if(4!==d[w]||ad(d[0],c))d=null;a.set(cc,d?1*d[1]:0);a.set(R,d?1*d[2]:10);a.set(dc,d?1*d[3]:a.get(ab));return null!=d||!ad(b,c)},fd=function(a,b){var c=G(a.c(Tb,"")),d=[],e=a.get(Fb);if(!b&&e){for(var f=0;f<e[w];f++){var Be=e[f];Be&&1==Be[ua]&&d[n](f+"="+G(Be[r])+"="+G(Be[na])+"=1")}0<d[w]&&(c+="|"+d[C]("^"))}return c?a.b(O,1)+"."+c:null},gd=function(a,b,c){c=c?"":a.c(O,"1");b=b[y](".");if(2>b[w]||ad(b[0],c))return!1;b=b[ja](1)[C](".")[y]("|");0<b[w]&&a.set(Tb,I(b[0]));if(1>=b[w])return!0;
b=b[1][y](-1==b[1][q](",")?"^":",");for(c=0;c<b[w];c++){var d=b[c][y]("=");if(4==d[w]){var e={};ha(e,I(d[1]));e.value=I(d[2]);e.scope=1;a.get(Fb)[d[0]]=e}}return!0},hd=function(a,b){var c=Ue(a,b);return c?[a.b(O,1),a.b(ec,0),a.b(fc,1),a.b(gc,1),c][C]("."):""},Ue=function(a){function b(b,e){if(!F(a.get(b))){var f=a.c(b,""),f=f[y](" ")[C]("%20"),f=f[y]("+")[C]("%20");c[n](e+"="+f)}}var c=[];b(ic,"utmcid");b(nc,"utmcsr");b(S,"utmgclid");b(kc,"utmgclsrc");b(lc,"utmdclid");b(mc,"utmdsid");b(jc,"utmccn");
b(oc,"utmcmd");b(pc,"utmctr");b(qc,"utmcct");return c[C]("|")},id=function(a,b,c){c=c?"":a.c(O,"1");b=b[y](".");if(5>b[w]||ad(b[0],c))return a.set(ec,void 0),a.set(fc,void 0),a.set(gc,void 0),a.set(ic,void 0),a.set(jc,void 0),a.set(nc,void 0),a.set(oc,void 0),a.set(pc,void 0),a.set(qc,void 0),a.set(S,void 0),a.set(kc,void 0),a.set(lc,void 0),a.set(mc,void 0),!1;a.set(ec,1*b[1]);a.set(fc,1*b[2]);a.set(gc,1*b[3]);Ve(a,b[ja](4)[C]("."));return!0},Ve=function(a,b){function c(a){return(a=b[oa](a+"=(.*?)(?:\\|utm|$)"))&&
2==a[w]?a[1]:void 0}function d(b,c){c?(c=e?I(c):c[y]("%20")[C](" "),a.set(b,c)):a.set(b,void 0)}-1==b[q]("=")&&(b=I(b));var e="2"==c("utmcvr");d(ic,c("utmcid"));d(jc,c("utmccn"));d(nc,c("utmcsr"));d(oc,c("utmcmd"));d(pc,c("utmctr"));d(qc,c("utmcct"));d(S,c("utmgclid"));d(kc,c("utmgclsrc"));d(lc,c("utmdclid"));d(mc,c("utmdsid"))},ad=function(a,b){return b?a!=b:!/^\d+$/[ia](a)};var Uc=function(){this.filters=[]};Uc[x].add=function(a,b){this.filters[n]({name:a,s:b})};Uc[x].cb=function(a){try{for(var b=0;b<this.filters[w];b++)this.filters[b].s.call(W,a)}catch(c){}};function jd(a){100!=a.get(vb)&&a.get(Q)%1E4>=100*a.get(vb)&&a[ta]()}function kd(a){ld(a.get(Wa))&&a[ta]()}function md(a){"file:"==J[z][A]&&a[ta]()}function Ge(a){He()&&a[ta]()}function nd(a){a.get(Ib)||a.set(Ib,J.title,!0);a.get(Hb)||a.set(Hb,J[z].pathname+J[z][va],!0)}
function lf(a){a.get(Wa)&&"UA-XXXXX-X"!=a.get(Wa)||a[ta]()};var od=new function(){var a=[];this.set=function(b){a[b]=!0};this.Xa=function(){for(var b=[],c=0;c<a[w];c++)a[c]&&(b[m[la](c/6)]=b[m[la](c/6)]^1<<c%6);for(c=0;c<b[w];c++)b[c]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"[ma](b[c]||0);return b[C]("")+"~"}};function H(a){od.set(a)};var W=window,J=document,ld=function(a){var b=W._gaUserPrefs;if(b&&b.ioo&&b.ioo()||a&&!0===W["ga-disable-"+a])return!0;try{var c=W.external;if(c&&c._gaUserPrefs&&"oo"==c._gaUserPrefs)return!0}catch(d){}return!1},He=function(){return W[za]&&"preview"==W[za].loadPurpose},We=function(a,b){ca(a,b)},pd=function(a){var b=[],c=J.cookie[y](";");a=new RegExp("^\\s*"+a+"=\\s*(.*?)\\s*$");for(var d=0;d<c[w];d++){var e=c[d][oa](a);e&&b[n](e[1])}return b},X=function(a,b,c,d,e,f){e=ld(e)?!1:Sc(d,c)?!1:He()?!1:!0;
e&&((b=mf(b))&&2E3<b[w]&&(b=b[B](0,2E3),H(69)),a=a+"="+b+"; path="+c+"; ",f&&(a+="expires="+(new Date((new Date)[g]()+f)).toGMTString()+"; "),d&&(a+="domain="+d+";"),J.cookie=a)},mf=function(a){if(!a)return a;var b=a[q](";");-1!=b&&(a=a[B](0,b),H(141));if(!(0<=W[za].userAgent[q]("Firefox")))return a;a=a[p](/\n|\r/g," ");for(var b=0,c=a[w];b<c;++b){var d=a.charCodeAt(b)&255;if(10==d||13==d)a=a[B](0,b)+"?"+a[B](b+1)}return a};var qd,rd,sd=function(){if(!qd){var a={},b=W[za],c=W.screen;a.Q=c?c.width+"x"+c.height:"-";a.P=c?c.colorDepth+"-bit":"-";a.language=(b&&(b.language||b.browserLanguage)||"-")[D]();a.javaEnabled=b&&b.javaEnabled()?1:0;a.characterSet=J.characterSet||J.charset||"-";try{var d;var e=J.documentElement,f=J.body,Be=f&&f[sa]&&f[wa],b=[];e&&e[sa]&&e[wa]&&("CSS1Compat"===J.compatMode||!Be)?b=[e[sa],e[wa]]:Be&&(b=[f[sa],f[wa]]);d=0>=b[0]||0>=b[1]?"":b[C]("x");a.Wa=d}catch(k){H(135)}qd=a}},td=function(){sd();for(var a=
qd,b=W[za],a=b.appName+b.version+a.language+b.platform+b.userAgent+a.javaEnabled+a.Q+a.P+(J.cookie?J.cookie:"")+(J.referrer?J.referrer:""),b=a[w],c=W.history[w];0<c;)a+=c--^b++;return Yc(a)},ud=function(a){sd();var b=qd;a.set(Lb,b.Q);a.set(Mb,b.P);a.set(Pb,b.language);a.set(Qb,b.characterSet);a.set(Nb,b.javaEnabled);a.set(Rb,b.Wa);if(a.get(ib)&&a.get(jb)){if(!(b=rd)){var c,d,e;d="ShockwaveFlash";if((b=(b=W[za])?b.plugins:void 0)&&0<b[w])for(c=0;c<b[w]&&!e;c++)d=b[c],-1<d[r][q]("Shockwave Flash")&&
(e=d.description[y]("Shockwave Flash ")[1]);else{d=d+"."+d;try{c=new ActiveXObject(d+".7"),e=c.GetVariable("$version")}catch(f){}if(!e)try{c=new ActiveXObject(d+".6"),e="WIN 6,0,21,0",c.AllowScriptAccess="always",e=c.GetVariable("$version")}catch(Be){}if(!e)try{c=new ActiveXObject(d),e=c.GetVariable("$version")}catch(k){}e&&(e=e[y](" ")[1][y](","),e=e[0]+"."+e[1]+" r"+e[2])}b=e?e:"-"}rd=b;a.set(Ob,rd)}else a.set(Ob,"-")};var vd=function(a){if(Ba(a))this.s=a;else{var b=a[0],c=b.lastIndexOf(":"),d=b.lastIndexOf(".");this.h=this.i=this.l="";-1==c&&-1==d?this.h=b:-1==c&&-1!=d?(this.i=b[B](0,d),this.h=b[B](d+1)):-1!=c&&-1==d?(this.l=b[B](0,c),this.h=b[B](c+1)):c>d?(this.i=b[B](0,d),this.l=b[B](d+1,c),this.h=b[B](c+1)):(this.i=b[B](0,d),this.h=b[B](d+1));this.k=a[ja](1);this.Ma=!this.l&&"_require"==this.h;this.J=!this.i&&!this.l&&"_provide"==this.h}},Y=function(){T(Y[x],"push",Y[x][n],5);T(Y[x],"_getPlugin",Pc,121);T(Y[x],
"_createAsyncTracker",Y[x].Sa,33);T(Y[x],"_getAsyncTracker",Y[x].Ta,34);this.I=new Ja;this.p=[]};E=Y[x];E.Na=function(a,b,c){var d=this.I.get(a);if(!Ba(d))return!1;b.plugins_=b.plugins_||new Ja;b.plugins_.set(a,new d(b,c||{}));return!0};E.push=function(a){var b=Z.Va[ya](this,arguments),b=Z.p.concat(b);for(Z.p=[];0<b[w]&&!Z.O(b[0])&&!(b.shift(),0<Z.p[w]););Z.p=Z.p.concat(b);return 0};E.Va=function(a){for(var b=[],c=0;c<arguments[w];c++)try{var d=new vd(arguments[c]);d.J?this.O(d):b[n](d)}catch(e){}return b};
E.O=function(a){try{if(a.s)a.s[ya](W);else if(a.J)this.I.set(a.k[0],a.k[1]);else{var b="_gat"==a.i?M:"_gaq"==a.i?Z:M.u(a.i);if(a.Ma){if(!this.Na(a.k[0],b,a.k[2])){if(!a.Pa){var c=Oa(""+a.k[1]);var d=c[A],e=J[z][A];var f;if(f="https:"==d||d==e?!0:"http:"!=d?!1:"http:"==e)t:{var Be=Oa(J[z][xa]);if(!(c.Oa||0<=c.url[q]("?")||0<=c[ra][q]("://")||c[u]==Be[u]&&c[pa]==Be[pa]))for(var k="http:"==c[A]?80:443,s=M.S,b=0;b<s[w];b++)if(c[u]==s[b][0]&&(c[pa]||k)==(s[b][1]||k)&&0==c[ra][q](s[b][2])){f=!0;break t}f=
!1}f&&!ld()&&(a.Pa=Ia(c.url))}return!0}}else a.l&&(b=b.plugins_.get(a.l)),b[a.h][ya](b,a.k)}}catch(t){}};E.Sa=function(a,b){return M.r(a,b||"")};E.Ta=function(a){return M.u(a)};var yd=function(){function a(a,b,c,d){void 0==f[a]&&(f[a]={});void 0==f[a][b]&&(f[a][b]=[]);f[a][b][c]=d}function b(a,b,c){if(void 0!=f[a]&&void 0!=f[a][b])return f[a][b][c]}function c(a,b){if(void 0!=f[a]&&void 0!=f[a][b]){f[a][b]=void 0;var c=!0,d;for(d=0;d<Be[w];d++)if(void 0!=f[a][Be[d]]){c=!1;break}c&&(f[a]=void 0)}}function d(a){var b="",c=!1,d,e;for(d=0;d<Be[w];d++)if(e=a[Be[d]],void 0!=e){c&&(b+=Be[d]);for(var c=[],f=void 0,Bd=void 0,Bd=0;Bd<e[w];Bd++)if(void 0!=e[Bd]){f="";1!=Bd&&void 0==
e[Bd-1]&&(f+=Bd[v]()+"!");for(var fa=e[Bd],Ke="",Le=void 0,Me=void 0,ga=void 0,Le=0;Le<fa[w];Le++)Me=fa[ma](Le),ga=k[Me],Ke+=void 0!=ga?ga:Me;f+=Ke;c[n](f)}b+="("+c[C]("*")+")";c=!1}else c=!0;return b}var e=this,f=[],Be=["k","v"],k={"'":"'0",")":"'1","*":"'2","!":"'3"};e.Ra=function(a){return void 0!=f[a]};e.A=function(){for(var a="",b=0;b<f[w];b++)void 0!=f[b]&&(a+=b[v]()+d(f[b]));return a};e.Qa=function(a){if(void 0==a)return e.A();for(var b=a.A(),c=0;c<f[w];c++)void 0==f[c]||a.Ra(c)||(b+=c[v]()+
d(f[c]));return b};e.f=function(b,c,d){if(!wd(d))return!1;a(b,"k",c,d);return!0};e.o=function(b,c,d){if(!xd(d))return!1;a(b,"v",c,d[v]());return!0};e.getKey=function(a,c){return b(a,"k",c)};e.N=function(a,c){return b(a,"v",c)};e.L=function(a){c(a,"k")};e.M=function(a){c(a,"v")};T(e,"_setKey",e.f,89);T(e,"_setValue",e.o,90);T(e,"_getKey",e.getKey,87);T(e,"_getValue",e.N,88);T(e,"_clearKey",e.L,85);T(e,"_clearValue",e.M,86)};function wd(a){return"string"==typeof a}
function xd(a){return!("number"==typeof a||void 0!=Number&&a instanceof Number)||m.round(a)!=a||da(a)||a==ba?!1:!0};var zd=function(a){var b=W.gaGlobal;a&&!b&&(W.gaGlobal=b={});return b},Ad=function(){var a=zd(!0).hid;null==a&&(a=Ea(),zd(!0).hid=a);return a},Dd=function(a){a.set(Kb,Ad());var b=zd();if(b&&b.dh==a.get(O)){var c=b.sid;c&&(a.get(ac)?H(112):H(132),a.set(Zb,c),a.get(Sb)&&a.set(Wb,c));b=b.vid;a.get(Sb)&&b&&(b=b[y]("."),a.set(Q,1*b[0]),a.set(Vb,1*b[1]))}};var Ed,Fd=function(a,b,c,d){var e=a.c(bb,""),f=a.c(P,"/");d=void 0!=d?d:a.b(cb,0);a=a.c(Wa,"");X(b,c,f,e,a,d)},Xc=function(a){var b=a.c(bb,"");a.b(O,1);var c=a.c(P,"/"),d=a.c(Wa,"");X("__utma",cd(a),c,b,d,a.get(cb));X("__utmb",dd(a),c,b,d,a.get(db));X("__utmc",""+a.b(O,1),c,b,d);var e=hd(a,!0);e?X("__utmz",e,c,b,d,a.get(eb)):X("__utmz","",c,b,"",-1);(e=fd(a,!1))?X("__utmv",e,c,b,d,a.get(cb)):X("__utmv","",c,b,"",-1)},Wc=function(a){var b=a.b(O,1);if(!bd(a,$c(b,pd("__utma"))))return a.set(Ub,!0),!1;
var c=!ed(a,$c(b,pd("__utmb")));a.set(bc,c);id(a,$c(b,pd("__utmz")));gd(a,$c(b,pd("__utmv")));Ed=!c;return!0},Gd=function(a){Ed||0<pd("__utmb")[w]||(X("__utmd","1",a.c(P,"/"),a.c(bb,""),a.c(Wa,""),1E4),0==pd("__utmd")[w]&&a[ta]())};var h=0,Jd=function(a){void 0==a.get(Q)?Hd(a):a.get(Ub)&&!a.get(Mc)?Hd(a):a.get(bc)&&Id(a)},Kd=function(a){a.get(hc)&&!a.get(ac)&&(Id(a),a.set(fc,a.get($b)))},Hd=function(a){h++;1<h&&H(137);var b=a.get(ab);a.set(Sb,!0);a.set(Q,Ea()^td(a)&2147483647);a.set(Tb,"");a.set(Vb,b);a.set(Wb,b);a.set(Zb,b);a.set($b,1);a.set(ac,!0);a.set(cc,0);a.set(R,10);a.set(dc,b);a.set(Fb,[]);a.set(Ub,!1);a.set(bc,!1)},Id=function(a){h++;1<h&&H(137);a.set(Wb,a.get(Zb));a.set(Zb,a.get(ab));a.Za($b);a.set(ac,!0);a.set(cc,
0);a.set(R,10);a.set(dc,a.get(ab));a.set(bc,!1)};var Ld="daum:q eniro:search_word naver:query pchome:q images.google:q google:q yahoo:p yahoo:q msn:q bing:q aol:query aol:q lycos:q lycos:query ask:q cnn:query virgilio:qs baidu:wd baidu:word alice:qs yandex:text najdi:q seznam:q rakuten:qt biglobe:q goo.ne:MT search.smt.docomo:MT onet:qt onet:q kvasir:q terra:query rambler:query conduit:q babylon:q search-results:q avg:q comcast:q incredimail:q startsiden:q go.mail.ru:q centrum.cz:q 360.cn:q sogou:query tut.by:query globo:q ukr:q so.com:q auone:q".split(" "),
Sd=function(a){if(a.get(kb)&&!a.get(Mc)){var b;b=!F(a.get(ic))||!F(a.get(nc))||!F(a.get(S))||!F(a.get(lc));for(var c={},d=0;d<Md[w];d++){var e=Md[d];c[e]=a.get(e)}(d=a.get(rc))?(H(149),e=new Ja,Na(e,d),d=e):d=La(J[z][xa],a.get(gb)).d;if("1"!=L(d.get(a.get(ub)))||!b)if(d=Xe(a,d)||Qd(a),d||b||!a.get(ac)||(Pd(a,void 0,"(direct)",void 0,void 0,void 0,"(direct)","(none)",void 0,void 0),d=!0),d&&(a.set(hc,Rd(a,c)),b="(direct)"==a.get(nc)&&"(direct)"==a.get(jc)&&"(none)"==a.get(oc),a.get(hc)||a.get(ac)&&
!b))a.set(ec,a.get(ab)),a.set(fc,a.get($b)),a.Za(gc)}},Xe=function(a,b){function c(c,d){d=d||"-";var e=L(b.get(a.get(c)));return e&&"-"!=e?I(e):d}var d=L(b.get(a.get(nb)))||"-",e=L(b.get(a.get(qb)))||"-",f=L(b.get(a.get(pb)))||"-",Be=L(b.get("gclsrc"))||"-",k=L(b.get("dclid"))||"-",s=c(ob,"(not set)"),t=c(rb,"(not set)"),Za=c(sb),Ma=c(tb);if(F(d)&&F(f)&&F(k)&&F(e))return!1;var mb=!F(f)&&!F(Be),mb=F(e)&&(!F(k)||mb),Xb=F(Za);if(mb||Xb){var Bd=Nd(a),Bd=La(Bd,!0);(Bd=Od(a,Bd))&&!F(Bd[1]&&!Bd[2])&&(mb&&
(e=Bd[0]),Xb&&(Za=Bd[1]))}Pd(a,d,e,f,Be,k,s,t,Za,Ma);return!0},Qd=function(a){var b=Nd(a),c=La(b,!0);(b=!(void 0!=b&&null!=b&&""!=b&&"0"!=b&&"-"!=b&&0<=b[q]("://")))||(b=c&&-1<c[u][q]("google")&&c.d.contains("q")&&"cse"==c[ra]);if(b)return!1;if((b=Od(a,c))&&!b[2])return Pd(a,void 0,b[0],void 0,void 0,void 0,"(organic)","organic",b[1],void 0),!0;if(b||!a.get(ac))return!1;t:{for(var b=a.get(Bb),d=Ka(c[u]),e=0;e<b[w];++e)if(-1<d[q](b[e])){a=!1;break t}Pd(a,void 0,d,void 0,void 0,void 0,"(referral)",
"referral",void 0,"/"+c[ra]);a=!0}return a},Od=function(a,b){for(var c=a.get(zb),d=0;d<c[w];++d){var e=c[d][y](":");if(-1<b[u][q](e[0][D]())){var f=b.d.get(e[1]);if(f&&(f=K(f),!f&&-1<b[u][q]("google.")&&(f="(not provided)"),!e[3]||-1<b.url[q](e[3]))){f||H(151);t:{for(var c=f,d=a.get(Ab),c=I(c)[D](),Be=0;Be<d[w];++Be)if(c==d[Be]){c=!0;break t}c=!1}return[e[2]||e[0],f,c]}}}return null},Pd=function(a,b,c,d,e,f,Be,k,s,t){a.set(ic,b);a.set(nc,c);a.set(S,d);a.set(kc,e);a.set(lc,f);a.set(jc,Be);a.set(oc,
k);a.set(pc,s);a.set(qc,t)},Md=[jc,ic,S,lc,nc,oc,pc,qc],Rd=function(a,b){function c(a){a=(""+a)[y]("+")[C]("%20");return a=a[y](" ")[C]("%20")}function d(c){var d=""+(a.get(c)||"");c=""+(b[c]||"");return 0<d[w]&&d==c}if(d(S)||d(lc))return H(131),!1;for(var e=0;e<Md[w];e++){var f=Md[e],Be=b[f]||"-",f=a.get(f)||"-";if(c(Be)!=c(f))return!0}return!1},Td=new RegExp(/^https?:\/\/(www\.)?google(\.com?)?(\.[a-z]{2}t?)?\/?$/i),jf=/^https?:\/\/r\.search\.yahoo\.com\/[^?]*$/i,Nd=function(a){a=Pa(a.get(Jb),a.get(P));
try{if(Td[ia](a))return H(136),a+"?q=";if(jf[ia](a))return H(150),a+"?p=(not provided)"}catch(b){H(145)}return a};var Ud,Vd,Wd=function(a){Ud=a.c(S,"");Vd=a.c(kc,"")},Xd=function(a){var b=a.c(S,""),c=a.c(kc,"");b!=Ud&&(-1<c[q]("ds")?a.set(mc,void 0):!F(Ud)&&-1<Vd[q]("ds")&&a.set(mc,Ud))};var Zd=function(a){Yd(a,J[z][xa])?(a.set(Mc,!0),H(12)):a.set(Mc,!1)},Yd=function(a,b){if(!a.get(fb))return!1;var c=La(b,a.get(gb)),d=K(c.d.get("__utma")),e=K(c.d.get("__utmb")),f=K(c.d.get("__utmc")),Be=K(c.d.get("__utmx")),k=K(c.d.get("__utmz")),s=K(c.d.get("__utmv")),c=K(c.d.get("__utmk"));if(Yc(""+d+e+f+Be+k+s)!=c){d=I(d);e=I(e);f=I(f);Be=I(Be);f=$d(d+e+f+Be,k,s,c);if(!f)return!1;k=f[0];s=f[1]}if(!bd(a,d,!0))return!1;ed(a,e,!0);id(a,k,!0);gd(a,s,!0);ae(a,Be,!0);return!0},ce=function(a,b,c){var d;
d=cd(a)||"-";var e=dd(a)||"-",f=""+a.b(O,1)||"-",Be=be(a)||"-",k=hd(a,!1)||"-";a=fd(a,!1)||"-";var s=Yc(""+d+e+f+Be+k+a),t=[];t[n]("__utma="+d);t[n]("__utmb="+e);t[n]("__utmc="+f);t[n]("__utmx="+Be);t[n]("__utmz="+k);t[n]("__utmv="+a);t[n]("__utmk="+s);d=t[C]("&");if(!d)return b;e=b[q]("#");if(c)return 0>e?b+"#"+d:b+"&"+d;c="";f=b[q]("?");0<e&&(c=b[B](e),b=b[B](0,e));return 0>f?b+"?"+d+c:b+"&"+d+c},$d=function(a,b,c,d){for(var e=0;3>e;e++){for(var f=0;3>f;f++){if(d==Yc(a+b+c))return H(127),[b,c];
var Be=b[p](/ /g,"%20"),k=c[p](/ /g,"%20");if(d==Yc(a+Be+k))return H(128),[Be,k];Be=Be[p](/\+/g,"%20");k=k[p](/\+/g,"%20");if(d==Yc(a+Be+k))return H(129),[Be,k];try{var s=b[oa]("utmctr=(.*?)(?:\\|utm|$)");if(s&&2==s[w]&&(Be=b[p](s[1],G(I(s[1]))),d==Yc(a+Be+c)))return H(139),[Be,c]}catch(t){}b=I(b)}c=I(c)}};var de="|",fe=function(a,b,c,d,e,f,Be,k,s){var t=ee(a,b);t||(t={},a.get(Cb)[n](t));t.id_=b;t.affiliation_=c;t.total_=d;t.tax_=e;t.shipping_=f;t.city_=Be;t.state_=k;t.country_=s;t.items_=t.items_||[];return t},ge=function(a,b,c,d,e,f,Be){a=ee(a,b)||fe(a,b,"",0,0,0,"","","");var k;t:{if(a&&a.items_){k=a.items_;for(var s=0;s<k[w];s++)if(k[s].sku_==c){k=k[s];break t}}k=null}s=k||{};s.transId_=b;s.sku_=c;s.name_=d;s.category_=e;s.price_=f;s.quantity_=Be;k||a.items_[n](s);return s},ee=function(a,b){for(var c=
a.get(Cb),d=0;d<c[w];d++)if(c[d].id_==b)return c[d];return null};var he,ie=function(a){if(!he){var b;b=J[z].hash;var c=W[r],d=/^#?gaso=([^&]*)/;if(c=(b=(b=b&&b[oa](d)||c&&c[oa](d))?b[1]:K(pd("GASO")))&&b[oa](/^(?:!([-0-9a-z.]{1,40})!)?([-.\w]{10,1200})$/i))Fd(a,"GASO",""+b,0),M._gasoDomain=a.get(bb),M._gasoCPath=a.get(P),a=c[1],Ia("https://www.google.com/analytics/web/inpage/pub/inpage.js?"+(a?"prefix="+a+"&":"")+Ea(),"_gasojs");he=!0}};var ae=function(a,b,c){c&&(b=I(b));c=a.b(O,1);b=b[y](".");2>b[w]||!/^\d+$/[ia](b[0])||(b[0]=""+c,Fd(a,"__utmx",b[C]("."),void 0))},be=function(a,b){var c=$c(a.get(O),pd("__utmx"));"-"==c&&(c="");return b?G(c):c},Ye=function(a){try{var b=La(J[z][xa],!1),c=ea(L(b.d.get("utm_referrer")))||"";c&&a.set(Jb,c);var d=ea(K(b.d.get("utm_expid")))||"";d&&(d=d[y](".")[0],a.set(Oc,""+d))}catch(e){H(146)}},l=function(a){var b=W.gaData&&W.gaData.expId;b&&a.set(Oc,""+b)};var ke=function(a,b){var c=m.min(a.b(Dc,0),100);if(a.b(Q,0)%100>=c)return!1;c=Ze()||$e();if(void 0==c)return!1;var d=c[0];if(void 0==d||d==ba||da(d))return!1;0<d?af(c)?b(je(c)):b(je(c[ja](0,1))):Ga(W,"load",function(){ke(a,b)},!1);return!0},me=function(a,b,c,d){var e=new yd;e.f(14,90,b[B](0,500));e.f(14,91,a[B](0,150));e.f(14,92,""+le(c));void 0!=d&&e.f(14,93,d[B](0,500));e.o(14,90,c);return e},af=function(a){for(var b=1;b<a[w];b++)if(da(a[b])||a[b]==ba||0>a[b])return!1;return!0},le=function(a){return da(a)||
0>a?0:5E3>a?10*m[la](a/10):5E4>a?100*m[la](a/100):41E5>a?1E3*m[la](a/1E3):41E5},je=function(a){for(var b=new yd,c=0;c<a[w];c++)b.f(14,c+1,""+le(a[c])),b.o(14,c+1,a[c]);return b},Ze=function(){var a=W.performance||W.webkitPerformance;if(a=a&&a.timing){var b=a.navigationStart;if(0==b)H(133);else return[a.loadEventStart-b,a.domainLookupEnd-a.domainLookupStart,a.connectEnd-a.connectStart,a.responseStart-a.requestStart,a.responseEnd-a.responseStart,a.fetchStart-b,a.domInteractive-b,a.domContentLoadedEventStart-
b]}},$e=function(){if(W.top==W){var a=W.external,b=a&&a.onloadT;a&&!a.isValidLoadTime&&(b=void 0);2147483648<b&&(b=void 0);0<b&&a.setPageReadyTime();return void 0==b?void 0:[b]}};var cf=function(a){if(a.get(Sb))try{var b;t:{var c=pd(a.get(Oe)||"_ga");if(c&&!(1>c[w])){for(var d=[],e=0;e<c[w];e++){var f;var Be=c[e][y]("."),k=Be.shift();if(("GA1"==k||"1"==k)&&1<Be[w]){var s=Be.shift()[y]("-");1==s[w]&&(s[1]="1");s[0]*=1;s[1]*=1;f={Ya:s,$a:Be[C](".")}}else f=void 0;f&&d[n](f)}if(1==d[w]){b=d[0].$a;break t}if(0!=d[w]){var t=a.get(Pe)||a.get(bb),d=bf(d,(0==t[q](".")?t.substr(1):t)[y](".")[w],0);if(1==d[w]){b=d[0].$a;break t}var Za=a.get(Qe)||a.get(P);(c=Za)?(1<c[w]&&"/"==c[ma](c[w]-
1)&&(c=c.substr(0,c[w]-1)),0!=c[q]("/")&&(c="/"+c),Za=c):Za="/";d=bf(d,"/"==Za?1:Za[y]("/")[w],1);b=d[0].$a;break t}}b=void 0}if(b){var Ma=(""+b)[y](".");2==Ma[w]&&/[0-9.]/[ia](Ma)&&(H(114),a.set(Q,Ma[0]),a.set(Vb,Ma[1]),a.set(Sb,!1))}}catch(mb){H(115)}},bf=function(a,b,c){for(var d=[],e=[],f=128,Be=0;Be<a[w];Be++){var k=a[Be];if(k.Ya[c]==b)d[n](k);else if(k.Ya[c]==f)e[n](k);else k.Ya[c]<f&&(e=[k],f=k.Ya[c])}return 0<d[w]?d:e};var kf=/^gtm\d+$/,hf=function(a){var b;b=(b=a.b(Cd,1))?0==a.b(Q,1)%b:!1;b&&(H(140),"page"!=a.get(sc)?a.set(Kc,"",!0):(b=a.c(Lc,""),b||(b=(b=a.c($a,""))&&"~0"!=b?kf[ia](b)?"__utmt_"+G(a.c(Wa,"")):"__utmt_"+G(b):"__utmt"),0<pd(b)[w]?a.set(Kc,"",!0):(X(b,"1",a.c(P,"/"),a.c(bb,""),a.c(Wa,""),6E5),0<pd(b)[w]&&(a.set(Kc,Ea(),!0),a.set(Yb,1,!0),a.set(Jc,Ne()+"/r/__utm.gif?",!0)))))};var U=function(a,b,c){function d(a){return function(b){if((b=b.get(Nc)[a])&&b[w])for(var c=Te(e,a),d=0;d<b[w];d++)b[d].call(e,c)}}var e=this;this.a=new Zc;this.get=function(a){return this.a.get(a)};this.set=function(a,b,c){this.a.set(a,b,c)};this.set(Wa,b||"UA-XXXXX-X");this.set($a,a||"");this.set(Ya,c||"");this.set(ab,m.round((new Date)[g]()/1E3));this.set(P,"/");this.set(cb,63072E6);this.set(eb,15768E6);this.set(db,18E5);this.set(fb,!1);this.set(yb,50);this.set(gb,!1);this.set(hb,!0);this.set(ib,
!0);this.set(jb,!0);this.set(kb,!0);this.set(lb,!0);this.set(ob,"utm_campaign");this.set(nb,"utm_id");this.set(pb,"gclid");this.set(qb,"utm_source");this.set(rb,"utm_medium");this.set(sb,"utm_term");this.set(tb,"utm_content");this.set(ub,"utm_nooverride");this.set(vb,100);this.set(Dc,1);this.set(Ec,!1);this.set(wb,"/__utm.gif");this.set(xb,1);this.set(Cb,[]);this.set(Fb,[]);this.set(zb,Ld[ja](0));this.set(Ab,[]);this.set(Bb,[]);this.B("auto");this.set(Jb,J.referrer);Ye(this.a);this.set(Nc,{hit:[],
load:[]});this.a.g("0",Zd);this.a.g("1",Wd);this.a.g("2",Jd);this.a.g("3",cf);this.a.g("4",Sd);this.a.g("5",Xd);this.a.g("6",Kd);this.a.g("7",d("load"));this.a.g("8",ie);this.a.e("A",kd);this.a.e("B",md);this.a.e("C",Ge);this.a.e("D",Jd);this.a.e("E",jd);this.a.e("F",Tc);this.a.e("G",ne);this.a.e("H",lf);this.a.e("I",Gd);this.a.e("J",nd);this.a.e("K",ud);this.a.e("L",Dd);this.a.e("M",l);this.a.e("N",hf);this.a.e("O",d("hit"));this.a.e("P",oe);this.a.e("Q",pe);0===this.get(ab)&&H(111);this.a.T();this.H=
void 0};E=U[x];E.m=function(){var a=this.get(Db);a||(a=new yd,this.set(Db,a));return a};E.La=function(a){for(var b in a){var c=a[b];a.hasOwnProperty(b)&&this.set(b,c,!0)}};E.K=function(a){if(this.get(Ec))return!1;var b=this,c=ke(this.a,function(c){b.set(Hb,a,!0);b.t(c)});this.set(Ec,c);return c};E.Fa=function(a){a&&Ca(a)?(H(13),this.set(Hb,a,!0)):"object"===typeof a&&null!==a&&this.La(a);this.H=a=this.get(Hb);this.a.j("page");this.K(a)};
E.F=function(a,b,c,d,e){if(""==a||!wd(a)||""==b||!wd(b)||void 0!=c&&!wd(c)||void 0!=d&&!xd(d))return!1;this.set(wc,a,!0);this.set(xc,b,!0);this.set(yc,c,!0);this.set(zc,d,!0);this.set(vc,!!e,!0);this.a.j("event");return!0};E.Ha=function(a,b,c,d,e){var f=this.a.b(Dc,0);1*e===e&&(f=e);if(this.a.b(Q,0)%100>=f)return!1;c=1*(""+c);if(""==a||!wd(a)||""==b||!wd(b)||!xd(c)||da(c)||0>c||0>f||100<f||void 0!=d&&(""==d||!wd(d)))return!1;this.t(me(a,b,c,d));return!0};
E.Ga=function(a,b,c,d){if(!a||!b)return!1;this.set(Ac,a,!0);this.set(Bc,b,!0);this.set(Cc,c||J[z][xa],!0);d&&this.set(Hb,d,!0);this.a.j("social");return!0};E.Ea=function(){this.set(Dc,10);this.K(this.H)};E.Ia=function(){this.a.j("trans")};E.t=function(a){this.set(Eb,a,!0);this.a.j("event")};E.ia=function(a){this.v();var b=this;return{_trackEvent:function(c,d,e){H(91);b.F(a,c,d,e)}}};E.ma=function(a){return this.get(a)};
E.xa=function(a,b){if(a)if(Ca(a))this.set(a,b);else if("object"==typeof a)for(var c in a)a.hasOwnProperty(c)&&this.set(c,a[c])};E.addEventListener=function(a,b){var c=this.get(Nc)[a];c&&c[n](b)};E.removeEventListener=function(a,b){for(var c=this.get(Nc)[a],d=0;c&&d<c[w];d++)if(c[d]==b){c.splice(d,1);break}};E.qa=function(){return"5.6.0"};E.B=function(a){this.get(hb);a="auto"==a?Ka(J.domain):a&&"-"!=a&&"none"!=a?a[D]():"";this.set(bb,a)};E.va=function(a){this.set(hb,!!a)};
E.na=function(a,b){return ce(this.a,a,b)};E.link=function(a,b){if(this.a.get(fb)&&a){var c=ce(this.a,a,b);J[z].href=c}};E.ua=function(a,b){this.a.get(fb)&&a&&a.action&&(a.action=ce(this.a,a.action,b))};
E.za=function(){this.v();var a=this.a,b=J.getElementById?J.getElementById("utmtrans"):J.utmform&&J.utmform.utmtrans?J.utmform.utmtrans:null;if(b&&b[na]){a.set(Cb,[]);for(var b=b[na][y]("UTM:"),c=0;c<b[w];c++){b[c]=Da(b[c]);for(var d=b[c][y](de),e=0;e<d[w];e++)d[e]=Da(d[e]);"T"==d[0]?fe(a,d[1],d[2],d[3],d[4],d[5],d[6],d[7],d[8]):"I"==d[0]&&ge(a,d[1],d[2],d[3],d[4],d[5],d[6])}}};E.$=function(a,b,c,d,e,f,Be,k){return fe(this.a,a,b,c,d,e,f,Be,k)};E.Y=function(a,b,c,d,e,f){return ge(this.a,a,b,c,d,e,f)};
E.Aa=function(a){de=a||"|"};E.ea=function(){this.set(Cb,[])};E.wa=function(a,b,c,d){var e=this.a;if(0>=a||a>e.get(yb))a=!1;else if(!b||!c||128<b[w]+c[w])a=!1;else{1!=d&&2!=d&&(d=3);var f={};ha(f,b);f.value=c;f.scope=d;e.get(Fb)[a]=f;a=!0}a&&this.a.n();return a};E.ka=function(a){this.a.get(Fb)[a]=void 0;this.a.n()};E.ra=function(a){return(a=this.a.get(Fb)[a])&&1==a[ua]?a[na]:void 0};E.Ca=function(a,b,c){this.m().f(a,b,c)};E.Da=function(a,b,c){this.m().o(a,b,c)};
E.sa=function(a,b){return this.m().getKey(a,b)};E.ta=function(a,b){return this.m().N(a,b)};E.fa=function(a){this.m().L(a)};E.ga=function(a){this.m().M(a)};E.ja=function(){return new yd};E.W=function(a){a&&this.get(Ab)[n](a[D]())};E.ba=function(){this.set(Ab,[])};E.X=function(a){a&&this.get(Bb)[n](a[D]())};E.ca=function(){this.set(Bb,[])};E.Z=function(a,b,c,d,e){if(a&&b){a=[a,b[D]()][C](":");if(d||e)a=[a,d,e][C](":");d=this.get(zb);d.splice(c?0:d[w],0,a)}};E.da=function(){this.set(zb,[])};
E.ha=function(a){this.a[ka]();var b=this.get(P),c=be(this.a);this.set(P,a);this.a.n();ae(this.a,c);this.set(P,b)};E.ya=function(a,b){if(0<a&&5>=a&&Ca(b)&&""!=b){var c=this.get(Fc)||[];c[a]=b;this.set(Fc,c)}};E.V=function(a){a=""+a;if(a[oa](/^[A-Za-z0-9]{1,5}$/)){var b=this.get(Ic)||[];b[n](a);this.set(Ic,b)}};E.v=function(){this.a[ka]()};E.Ba=function(a){a&&""!=a&&(this.set(Tb,a),this.a.j("var"))};var ne=function(a){"trans"!==a.get(sc)&&500<=a.b(cc,0)&&a[ta]();if("event"===a.get(sc)){var b=(new Date)[g](),c=a.b(dc,0),d=a.b(Zb,0),c=m[la]((b-(c!=d?c:1E3*c))/1E3*1);0<c&&(a.set(dc,b),a.set(R,m.min(10,a.b(R,0)+c)));0>=a.b(R,0)&&a[ta]()}},pe=function(a){"event"===a.get(sc)&&a.set(R,m.max(0,a.b(R,10)-1))};var qe=function(){var a=[];this.add=function(b,c,d){d&&(c=G(""+c));a[n](b+"="+c)};this.toString=function(){return a[C]("&")}},re=function(a,b){(b||2!=a.get(xb))&&a.Za(cc)},se=function(a,b){b.add("utmwv","5.6.0");b.add("utms",a.get(cc));b.add("utmn",Ea());var c=J[z].hostname;F(c)||b.add("utmhn",c,!0);c=a.get(vb);100!=c&&b.add("utmsp",c,!0)},te=function(a,b){b.add("utmht",(new Date)[g]());b.add("utmac",Da(a.get(Wa)));a.get(Oc)&&b.add("utmxkey",a.get(Oc),!0);a.get(vc)&&b.add("utmni",1);a.get(of)&&b.add("utmgtm",
a.get(of),!0);var c=a.get(Ic);c&&0<c[w]&&b.add("utmdid",c[C]("."));ff(a,b);!1!==a.get(Xa)&&(a.get(Xa)||M.w)&&b.add("aip",1);void 0!==a.get(Kc)&&b.add("utmjid",a.c(Kc,""),!0);a.b(Yb,0)&&b.add("utmredir",a.b(Yb,0),!0);M.bb||(M.bb=a.get(Wa));(1<M.ab()||M.bb!=a.get(Wa))&&b.add("utmmt",1);b.add("utmu",od.Xa())},ue=function(a,b){for(var c=a.get(Fc)||[],d=[],e=1;e<c[w];e++)c[e]&&d[n](e+":"+G(c[e][p](/%/g,"%25")[p](/:/g,"%3A")[p](/,/g,"%2C")));d[w]&&b.add("utmpg",d[C](","))},ff=function(a,b){function c(a,
b){b&&d[n](a+"="+b+";")}var d=[];c("__utma",cd(a));c("__utmz",hd(a,!1));c("__utmv",fd(a,!0));c("__utmx",be(a));b.add("utmcc",d[C]("+"),!0)},ve=function(a,b){a.get(ib)&&(b.add("utmcs",a.get(Qb),!0),b.add("utmsr",a.get(Lb)),a.get(Rb)&&b.add("utmvp",a.get(Rb)),b.add("utmsc",a.get(Mb)),b.add("utmul",a.get(Pb)),b.add("utmje",a.get(Nb)),b.add("utmfl",a.get(Ob),!0))},we=function(a,b){a.get(lb)&&a.get(Ib)&&b.add("utmdt",a.get(Ib),!0);b.add("utmhid",a.get(Kb));b.add("utmr",Pa(a.get(Jb),a.get(P)),!0);b.add("utmp",
G(a.get(Hb),!0),!0)},xe=function(a,b){for(var c=a.get(Db),d=a.get(Eb),e=a.get(Fb)||[],f=0;f<e[w];f++){var Be=e[f];Be&&(c||(c=new yd),c.f(8,f,Be[r]),c.f(9,f,Be[na]),3!=Be[ua]&&c.f(11,f,""+Be[ua]))}F(a.get(wc))||F(a.get(xc),!0)||(c||(c=new yd),c.f(5,1,a.get(wc)),c.f(5,2,a.get(xc)),e=a.get(yc),void 0!=e&&c.f(5,3,e),e=a.get(zc),void 0!=e&&c.o(5,1,e));c?b.add("utme",c.Qa(d),!0):d&&b.add("utme",d.A(),!0)},ye=function(a,b,c){var d=new qe;re(a,c);se(a,d);d.add("utmt","tran");d.add("utmtid",b.id_,!0);d.add("utmtst",
b.affiliation_,!0);d.add("utmtto",b.total_,!0);d.add("utmttx",b.tax_,!0);d.add("utmtsp",b.shipping_,!0);d.add("utmtci",b.city_,!0);d.add("utmtrg",b.state_,!0);d.add("utmtco",b.country_,!0);xe(a,d);ve(a,d);we(a,d);(b=a.get(Gb))&&d.add("utmcu",b,!0);c||(ue(a,d),te(a,d));return d[v]()},ze=function(a,b,c){var d=new qe;re(a,c);se(a,d);d.add("utmt","item");d.add("utmtid",b.transId_,!0);d.add("utmipc",b.sku_,!0);d.add("utmipn",b.name_,!0);d.add("utmiva",b.category_,!0);d.add("utmipr",b.price_,!0);d.add("utmiqt",
b.quantity_,!0);xe(a,d);ve(a,d);we(a,d);(b=a.get(Gb))&&d.add("utmcu",b,!0);c||(ue(a,d),te(a,d));return d[v]()},Ae=function(a,b){var c=a.get(sc);if("page"==c)c=new qe,re(a,b),se(a,c),xe(a,c),ve(a,c),we(a,c),b||(ue(a,c),te(a,c)),c=[c[v]()];else if("event"==c)c=new qe,re(a,b),se(a,c),c.add("utmt","event"),xe(a,c),ve(a,c),we(a,c),b||(ue(a,c),te(a,c)),c=[c[v]()];else if("var"==c)c=new qe,re(a,b),se(a,c),c.add("utmt","var"),!b&&te(a,c),c=[c[v]()];else if("trans"==c)for(var c=[],d=a.get(Cb),e=0;e<d[w];++e){c[n](ye(a,
d[e],b));for(var f=d[e].items_,Be=0;Be<f[w];++Be)c[n](ze(a,f[Be],b))}else"social"==c?b?c=[]:(c=new qe,re(a,b),se(a,c),c.add("utmt","social"),c.add("utmsn",a.get(Ac),!0),c.add("utmsa",a.get(Bc),!0),c.add("utmsid",a.get(Cc),!0),xe(a,c),ve(a,c),we(a,c),ue(a,c),te(a,c),c=[c[v]()]):"feedback"==c?b?c=[]:(c=new qe,re(a,b),se(a,c),c.add("utmt","feedback"),c.add("utmfbid",a.get(Gc),!0),c.add("utmfbpr",a.get(Hc),!0),xe(a,c),ve(a,c),we(a,c),ue(a,c),te(a,c),c=[c[v]()]):c=[];return c},oe=function(a){var b,c=a.get(xb),
d=a.get(uc),e=d&&d.Ua,f=0;if(0==c||2==c){var Be=a.get(wb)+"?";b=Ae(a,!0);for(var k=0,s=b[w];k<s;k++)Sa(b[k],e,Be,!0),f++}if(1==c||2==c)for(b=Ae(a),a=a.c(Jc,""),k=0,s=b[w];k<s;k++)try{Sa(b[k],e,a),f++}catch(t){t&&Ra(t[r],void 0,t.message)}d&&(d.q=f)};var Ne=function(){return"https:"==J[z][A]||M.G?"https://ssl.google-analytics.com":"http://www.google-analytics.com"},Ce=function(a){ha(this,"len");this.message=a+"-8192"},De=function(a){ha(this,"ff2post");this.message=a+"-2036"},Sa=function(a,b,c,d){b=b||Fa;if(d||2036>=a[w])gf(a,b,c);else if(8192>=a[w]){if(0<=W[za].userAgent[q]("Firefox")&&![].reduce)throw new De(a[w]);df(a,b)||ef(a,b)||Ee(a,b)||b()}else throw new Ce(a[w]);},gf=function(a,b,c){c=c||Ne()+"/__utm.gif?";var d=new Image(1,1);d.src=c+
a;Ie(d,function(){Ie(d,null);Je(d,null);b()});Je(d,function(){Ie(d,null);Je(d,null);b()})},ef=function(a,b){var c;c=W.XDomainRequest;if(!c)return!1;c=new c;c.open("POST",Ne()+"/p/__utm.gif");Je(c,function(){b()});Ie(c,b);c.send(a);return!0},df=function(a,b){var c=W.XMLHttpRequest;if(!c)return!1;var d=new c;if(!("withCredentials"in d))return!1;d.open("POST",Ne()+"/p/__utm.gif",!0);d.withCredentials=!0;d.setRequestHeader("Content-Type","text/plain");d.onreadystatechange=function(){4==d.readyState&&
(b(),d=null)};d.send(a);return!0},Ee=function(a,b){if(!J.body)return We(function(){Ee(a,b)},100),!0;a=aa(a);try{var c=J[qa]('<iframe name="'+a+'"></iframe>')}catch(d){c=J[qa]("iframe"),ha(c,a)}c.height="0";c.width="0";c.style.display="none";c.style.visibility="hidden";var e=J[z],e=Ne()+"/u/post_iframe.html#"+aa(e[A]+"//"+e[u]+"/favicon.ico"),f=function(){c.src="";c.parentNode&&c.parentNode.removeChild(c)};Ga(W,"beforeunload",f);var Be=!1,k=0,s=function(){if(!Be){try{if(9<k||c.contentWindow[z][u]==
J[z][u]){Be=!0;f();Ha(W,"beforeunload",f);b();return}}catch(a){}k++;ca(s,200)}};Ga(c,"load",s);J.body.appendChild(c);c.src=e;return!0};var $=function(){this.G=this.w=!1;this.C={};this.D=[];this.U=0;this.S=[["www.google-analytics.com","","/plugins/"]];this._gasoCPath=this._gasoDomain=this.bb=void 0;Re();Se()};E=$[x];E.oa=function(a,b){return this.r(a,void 0,b)};E.r=function(a,b,c){b&&H(23);c&&H(67);void 0==b&&(b="~"+M.U++);a=new U(b,a,c);M.C[b]=a;M.D[n](a);return a};E.u=function(a){a=a||"";return M.C[a]||M.r(void 0,a)};E.pa=function(){return M.D[ja](0)};E.ab=function(){return M.D[w]};E.aa=function(){this.w=!0};
E.la=function(){this.G=!0};var Fe=function(a){if("prerender"==J.visibilityState)return!1;a();return!0};var M=new $;var nf=W._gat;nf&&Ba(nf._getTracker)?M=nf:W._gat=M;var Z=new Y;(function(a){if(!Fe(a)){H(123);var b=!1,c=function(){!b&&Fe(a)&&(b=!0,Ha(J,"visibilitychange",c))};Ga(J,"visibilitychange",c)}})(function(){var a=W._gaq,b=!1;if(a&&Ba(a[n])&&(b="[object Array]"==Object[x][v].call(Object(a)),!b)){Z=a;return}W._gaq=Z;b&&Z[n][ya](Z,a)});function Yc(a){var b=1,c=0,d;if(a)for(b=0,d=a[w]-1;0<=d;d--)c=a.charCodeAt(d),b=(b<<6&268435455)+c+(c<<14),c=b&266338304,b=0!=c?b^c>>21:b;return b};})();
;
/* simple lib providing a standard way to track events as a wrapper for GA */
var dd = dd || {};
dd.ga = dd.ga || {};
dd.ga.events = dd.ga.events || {};

dd.ga.events = (function () {
    var ddfirst = dd.cookies.get('ddov');
    var ddlast = dd.cookies.get('ddlv');
    var eventDate = new Date();
    var docRef = document.referrer.toString();
    var locArray = document.location.href.toString().split('/');
    
    return {
        landing: function () {
            // Fixed to stop bounce tracing from being blown away, disabled pending decision.
            return true;
            /* Check/set cookie for inbound tracking before anything else (except GA since we send events), in case we want to use this in other places */
            if (docRef === "") {
                docRef = "typein";
            } else {
                refArray = docRef.split('/');
            }
        
            if (typeof ddfirst === "undefined") {
                dd.cookies.set('ddov', eventDate, 73000);
                dd.cookies.set('ddor', docRef, 73000);
                dd.ga.events.track(['Inbound Traffic', 'First_Visit', 'Page', docRef], true);
                if (docRef !== "typein"){
                    // get raw domain as a separate tracking point for first landings
                    dd.ga.events.track(['Inbound Traffic', 'First_Visit_From_Domain', 'Page', refArray[2]], true);
                } 
            } /* if Inbound Traffic set event once for full url(specific) and once for ref domain(aggregate), else tag this as "Domestic Traffic" and only log ref url/page */
        
            if (typeof refArray !== "undefined"){ 
                if (locArray[2] !== refArray[2]) {
                    dd.ga.events.track(['Inbound Traffic', 'Origination URL', 'Page', docRef], true);
                    dd.ga.events.track(['Inbound Traffic', 'Origination Site', 'Page', refArray[2]], true);
                } else {
                    dd.ga.events.track(['Domestic Traffic', 'Origination URL', 'Page', docRef], true);
                }
            }else{
                // docRef must be "typein" by process of elimination.
                dd.ga.events.track(['Brand Traffic', 'Origination', 'Page', docRef], true);
            }
        
            dd.cookies.set('ddlv', eventDate, 73000);
            dd.cookies.set('ddlr', docRef, 73000);
        },
        track: function(data, nobouncetrack) {
            //unpack data into gaq args
            category = data[0] ? data[0] : false;
            action = data[1] ? data[1] : false;
            opt_label = data[2] ? data[2] : false;
            opt_value = data[3] ? data[3] : false;
            opt_noninteraction = nobouncetrack ? nobouncetrack : false;
            //Catch mistakes
            if(!category){
                console.log('Usage: dd.ga.events.track([category, action, opt_label, opt_value], opt_bouncetrack) -- category is required');
                return false;
            }
            if(!action){
                console.log('Usage: dd.ga.events.track([category, action, opt_label, opt_value], opt_bouncetrack) -- action is required');
                return false;
            }
            _gaq.push(['_trackEvent', category, action, opt_label, opt_value, opt_noninteraction]);
            return true;
        }
    }
}());   
;
/* Send twitter "intents" to GA */

var dd = dd || {};
dd.ga = dd.ga || {};
dd.ga.social = dd.ga.social || {};
dd.ga.social.twitter = dd.ga.social.twitter || {};

dd.ga.social.twitter = (function() {
    return {
        clickEventToAnalytics: function(intent_event) {
            if (intent_event) {
                _gaq.push(['_trackEvent', 'Twitter', intent_event.type, intent_event.region]);
                _gaq.push(['_trackSocial', 'Twitter', intent_event.type, intent_event.region]);
            };
        },

        tweetIntentToAnalytics: function(intent_event) {
            if (intent_event) {
                _gaq.push(['_trackEvent', 'Twitter', intent_event.type, "tweet"]);
                _gaq.push(['_trackSocial', 'Twitter', intent_event.type, "tweet"]);
            };
        },

        followIntentToAnalytics: function(intent_event) {
            if (intent_event) {
                _gaq.push(['_trackEvent', 'Twitter', intent_event.type, 'http://twitter.com/' + intent_event.data.user_id]);
                _gaq.push(['_trackSocial', 'Twitter', intent_event.type, 'http://twitter.com/' + intent_event.data.user_id]);
            };
        },
        
        registerCallbacks: function() {
            //Wrap event bindings - Wait for async js to load
            twttr.ready(function(twttr) {
                //event bindings
                twttr.events.bind('click', dd.ga.social.twitter.clickEventToAnalytics);
                twttr.events.bind('tweet', dd.ga.social.twitter.tweetIntentToAnalytics);
                twttr.events.bind('follow', dd.ga.social.twitter.followIntentToAnalytics);
            });
        }
    }
}());

;
/* This hooks the FB client script to send GA track events and track social logging */
// TODO: Should this load late, or wait for an FB ready event (does that exist?)

var dd = dd || {};
dd.ga = dd.ga || {};
dd.ga.social = dd.ga.social || {};
dd.ga.social.facebook = dd.ga.social.facebook || {};

dd.ga.social.facebook = (function() {

    return {
        shareIntentToAnalytics: function(targetUrl) {
            _gaq.push(['_trackEvent', 'Facebook', 'send', targetUrl]);
            _gaq.push(['_trackSocial', 'Facebook', 'send', targetUrl]);
        },

        unlikeIntentToAnalytics: function(targetUrl) {
            _gaq.push(['_trackEvent', 'Facebook', 'unlike', targetUrl]);
            _gaq.push(['_trackSocial', 'Facebook', 'unlike', targetUrl]);
        },

        likeIntentToAnalytics: function(targetUrl) {
            _gaq.push(['_trackEvent', 'Facebook', 'like', targetUrl]);
            _gaq.push(['_trackSocial', 'Facebook', 'like', targetUrl]);
        },
        
        registerCallbacks: function() {
            FB.Event.subscribe('edge.create', function(targetUrl) { dd.ga.social.facebook.likeIntentToAnalytics(targetUrl); });
            FB.Event.subscribe('edge.remove', function(targetUrl) { dd.ga.social.facebook.unlikeIntentToAnalytics(targetUrl); });
            FB.Event.subscribe('message.send', function(targetUrl) { dd.ga.social.facebook.shareIntentToAnalytics(targetUrl); });
        }
    }
}());


;
jQuery(document).ajaxSend(function(event, xhr, settings) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    function sameOrigin(url) {
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});
;
//Turn on or off email related hoo-hah and giberdyflibbitz
// leaving this becuase it also disables stuff on profile page
emailiterize = false;

// logged in state details
var login_details;

$(document).ready(function () {
    navCollapser();
    reset_signup_dialog();

    $('#sign-in-twitter').click(function (event) {
        event.stopPropagation();
        tw_one_click();
    });
    $('#sign-in-facebook').click(function (event) {
        event.stopPropagation();
        fb_one_click();
    });

    $('#fb_signin').click(function () {
        fb_signup_start();
    });
    $('#tw_signin').click(function () {
        tw_signup_start();
    });

    $('#user_btn_logout_a').click(function () {
        user_logout();
        if(typeof fyre === "object"){
          fyre.conv.logout();
        }
    });
    $('#user_btn_profile_a').click(function () {
        location.href="/accounts/profile/";
    });

});

/* Ensures mobile menus collapse appropriately
-------------------------------------------------- */
function navCollapser()
{
    $('.navbar').on('show', function () {
      var actives = $(this).find('.collapse.in')
        , hasData
      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }
    })
}


function signupDialogDraw(signup_headline_text, signup_instructional_text, signup_controls, signup_actions, callback){
    $('#signup_inner').animate({ opacity: 0.0 }, 200, function(){
      $('#signup_headline').html(signup_headline_text);
      $('#signup_instructions').html(signup_instructional_text);
      $('#signup_controls').html(signup_controls);
      $('#signup_actions').html(signup_actions);
      $('#signup_inner').animate({ opacity: 1.0 }, 200,
          function(){
            if(typeof callback == "function") { callback(); }
          });
    });
}

function user_logout(comments) {
    createCookie('logged_in', false, false);
    dd.authoritize.Auth.deAuth(function () {
        is_auth(false);
    });
    if (window.location.pathname.indexOf("/accounts/profile/") != -1) {
        window.location = '/';
    }
}

//handle the form data on the last step
function tw_post_verified_form() {
    //finish
    if($('#followRadiosYes').prop('checked')){
        dd.authoritize.Twitteritize.followUs(function(resp){ return true; });
    }
    signup_complete();
}

function fb_post_verified_form() {
        is_auth(true);
        //send choices
        if($('#dotificationsRadiosYes').prop('checked')){
            var data = {};
            data.digest = true;
            data.dotdotdot = true;
            data.replies = true;
            data.updates = true;
        } else {
            //total opt out
            var data = {};
            data.digest = false;
            data.dotdotdot = false;
            data.replies = false;
            data.updates = false;
        }
        $.ajax({
          type: 'POST',
          url: '/accounts/profile/',
          data: data,
          success: function(response) { onSuccess(response); }
        });
        function onSuccess(response){
            if(response.success){
                //throwaway
            }else{
                //throwaway
            };
        };

        signup_complete();
}

function fb_signup_start() {
    var signup_headline_text = 'Authenticating...';
    var signup_instructional_text = 'A box will pop up and ask you to approve Daily Dot.';
    var signup_controls = '';
    var signup_actions = '';
    signupDialogDraw(signup_headline_text, signup_instructional_text, signup_controls, signup_actions);
    fb_one_click();
}

function fb_one_click() {
    dd.authoritize.Auth.auth('facebook', function (response) {
        if (response.authenticated) {
            if (response.type == 'login') {
                is_auth(true);
                $('#signupModal').modal('hide');
            } else if (response.type == 'signup') {
                fb_signup_newsletter();
                $('#signupModal').modal('show');
            } else if (response.type == 'connect') {
                // This should only be called if the user is already authenticated and then adds a connection to a social account.
                // jq stuffs below are still in use on the profile page and seem fine.
                $('#fb_connect_accounts').removeClass('ua_connected_accounts_facebook_btn').addClass('ua_connected_accounts_facebook_btn_active');
                $('#fb_btn_label_text').html('Facebook connected.');
                $('#ua_connected_accounts_fb_disconnect').html('Disconnect');
                $('#fb_connect_accounts').unbind('click');
                $('#signupModal').modal('hide');
            } else {
                fb_signup_fail();
                $('#signupModal').modal('show');
            }
        } else {
            if (response.denied) {
                fb_signup_cancel();
                $('#signupModal').modal('show');
            } else {
                fb_signup_fail();
                $('#signupModal').modal('show');
            }
        }
    });
}

function tw_signup_start() {
    var signup_headline_text = 'Authenticating...';
    var signup_instructional_text = 'A box will pop up and ask you to approve Daily Dot.';
    var signup_controls = '';
    var signup_actions = '';
    signupDialogDraw(signup_headline_text, signup_instructional_text, signup_controls, signup_actions);
    tw_one_click();   // this goes here because it's the last animation to finish.
}

function reset_signup_dialog(){
  var signup_headline_text = "Creating an account doesn't get any easier.";
  var signup_instructional_text = 'Step one: Register using your Facebook or Twitter account.';
  var signup_controls = '<button type="button" class="btn btn-primary btn-block" id="sign-in-facebook-modal"><i class="icon-facebook icon-white"></i> Connect via Facebook</button> <button type="button" class="btn btn-primary btn-block" id="sign-in-twitter-modal"><i class="icon-twitter icon-white"></i> Connect via Twitter</button>';
  var signup_actions = '';
  signupDialogDraw(signup_headline_text, signup_instructional_text, signup_controls, signup_actions,
    function(){
      $('#sign-in-facebook-modal').click(function(){ fb_one_click(); });
      $('#sign-in-twitter-modal').click(function(){ tw_one_click(); });
    });
}

function tw_one_click() {
    dd.authoritize.Auth.auth('twitter', function (response) {
        if (response.authenticated) {
            if (response.type == 'login') {
                is_auth(true);
                $('#signupModal').modal('hide');
            } else if (response.type == 'signup') {
                tw_signup_newsletter();
                $('#signupModal').modal('show');
            } else if (response.type == 'connect') {
                // This should only be called if the user is already authenticated and then adds a connection to a social account.
                $('#tw_connect_accounts').removeClass('ua_connected_accounts_twitter_btn').addClass('ua_connected_accounts_twitter_btn_active');
                $('#tw_btn_label_text').html('Twitter connected.');
                $('#ua_connected_accounts_tw_disconnect').html('Disconnect');
                $('#tw_connect_accounts').unbind('click');
            } else {
                tw_signup_fail();
                $('#signupModal').modal('show');
            }
        } else {
            if (response.denied) {
                tw_signup_cancel();
                $('#signupModal').modal('show');
            } else {
                tw_signup_fail();
                $('#signupModal').modal('show');
            }
        }
    });
}

function signup_complete() {
  var signup_headline_text = 'Sweet, you\'re all good. Welcome!';
  var signup_instructional_text = 'P.s. We love you.';
  var signup_controls = '';
  var signup_actions = '';
  signupDialogDraw(signup_headline_text, signup_instructional_text, signup_controls, signup_actions);
  is_auth(true);
  //hide on delay
  var x = window.setTimeout(function(){ $('#signupModal').modal('hide'); reset_signup_dialog(); }, 1000);
}

function is_auth(state) {
    //state is true or false.
    if (state) {
        //Anything in these classes is toggled on auth state.
        $('.is_logged_out').hide();
        $('.is_logged_in').show();

        // we moved the ajax() call up, so just check the state of login_details, also, skip for pages that don't contain a LF widget
        if(typeof(fyre) == 'object' && typeof(fyre.conv.login) == 'function') {
            if(login_details) {
                fyre.conv.login(login_details.token);
            } else {
                // this is not ideal but, try calling the remote for the login details if we got
                // this far down in the if/else.
                $.post('/accounts/login_details/','', function(data){
                    if(data.profile){
                        fyre.conv.login(data.token);
                    }else{
                      $('#signupModal').modal('show');
                    }
                }, 'json');
            }
        }
    } else {
        //Anything in these classes is toggled on auth state.
        $('.is_logged_out').show();
        $('.is_logged_in').hide();
        //fyre.conv.logout(); -- FGR: this was a really bad idea. leaving it here as a reminder not to do this again.
    }
}

function fb_signup_newsletter() {
  var signup_headline_text = 'Boom. Thanks for joining us!';
  var signup_instructional_text = 'We send awesome emails, but you can always adjust what you receive.';
  var signup_controls = '<form><p class="lead">Receive Dotifications?</p>';
  signup_controls = signup_controls + '<label class="radio"><input type="radio" name="optionsRadios" id="dotificationsRadiosYes" value="1" checked>Sure! Sign me up!</label>';
  signup_controls = signup_controls + '<label class="radio"><input type="radio" name="optionsRadios" id="dotificationsNo" value="0"> No thanks. I\'d rather not.</label></form>';
  var signup_actions = '<a href="#" class="btn btn-primary" id="sign-up-fb-finish">Finish</a>';
  signupDialogDraw(signup_headline_text, signup_instructional_text, signup_controls, signup_actions,
      function(){
        $('#signupModal').modal('show');
        $('#sign-up-fb-finish').click(function(){ fb_post_verified_form(); });
      });
}

function tw_signup_newsletter() {
  var signup_headline_text = 'Boom. Thanks for joining us!';
  var signup_instructional_text = 'Follow @dailydot for news and updates?';
  var signup_controls = '<form>';
  signup_controls = signup_controls + '<label class="radio"><input type="radio" name="optionsRadios" id="followRadiosYes" value="1" checked>Follow @dailydot for news and updates.</label>';
  signup_controls = signup_controls + '<label class="radio"><input type="radio" name="optionsRadios" id="followRadiosNo" value="0"> No thanks. I\'d rather not.</label></form>';
  var signup_actions = '<a href="#" class="btn btn-primary" id="sign-up-tw-finish">Finish</a>';
  signupDialogDraw(signup_headline_text, signup_instructional_text, signup_controls, signup_actions,
        function(){
          $('#signupModal').modal('show');
          $('#sign-up-tw-finish').click(function(){ tw_post_verified_form(); });
        });
}

function fb_signup_fail() {
      var signup_headline_text = 'Facebook fail.';
      var signup_instructional_text = 'Something wen\'t wrong while authenticating with Facebook. Let\'s try that again.';
      var signup_controls = '';
      var signup_actions = '';
      signupDialogDraw(signup_headline_text, signup_instructional_text, signup_controls, signup_actions, function(){ $('#signupModal').modal('show'); });
      var x = window.setTimeout(function(){ reset_signup_dialog(); }, 2500);
}

function tw_signup_fail() {
    var signup_headline_text = 'Something wen\'t wrong. Try again?';
    var signup_instructional_text = 'Something wen\'t wrong while authenticating with Twitter. Let\'s try that again.';
    var signup_controls = '';
    var signup_actions = '';
    signupDialogDraw(signup_headline_text, signup_instructional_text, signup_controls, signup_actions, function(){ $('#signupModal').modal('show'); });
    var x = window.setTimeout(function(){ reset_signup_dialog(); }, 2500);
}

function fb_signup_cancel() {
    var signup_headline_text = 'What\'s the matter? Don\'t you love us anymore?';
    var signup_instructional_text = 'If you didn\'t mean to cancel, we understand. Try again?';
    var signup_controls = '';
    var signup_actions = '';
    signupDialogDraw(signup_headline_text, signup_instructional_text, signup_controls, signup_actions, function(){ $('#signupModal').modal('show'); });
    var x = window.setTimeout(function(){ reset_signup_dialog(); }, 2500);
}

function tw_signup_cancel() {
  var signup_headline_text = 'What\'s the matter? Don\'t you love us anymore?';
  var signup_instructional_text = 'If you didn\'t mean to cancel, we understand. Try again?';
  var signup_controls = '';
  var signup_actions = '';
  signupDialogDraw(signup_headline_text, signup_instructional_text, signup_controls, signup_actions, function(){ $('#signupModal').modal('show'); });
  var x = window.setTimeout(function(){ reset_signup_dialog(); }, 2500);
}

/* Helpers */

function tickNewsletter(button) {
    if (button.hasClass('ua_profile_checkmark_active')) {
        //mark inactive
        button.removeClass('ua_profile_checkmark_active');
        button.addClass('ua_profile_checkmark_inactive');
    } else {
        //mark active
        button.removeClass('ua_profile_checkmark_inactive');
        button.addClass('ua_profile_checkmark_active');
    }
    button.addClass('isChanged');
    activateButton($('#ua_newsletter_update_btn'));
}

function updateEmail(field1, field2, button) {
    if (isValidEmail(field1, field2, button)) {
        buttonSaving(button);
        var data = {};
        data.email = field1.val();
        $.ajax({
          type: 'POST',
          url: '/accounts/profile/',
          processData: true,
          data: data,
          success: function(response) { onSuccess(response); }
        });
    } else {
        field1.focus();
    }

    function onSuccess(response){
        if(response.success){
            buttonFinish(button);
            $('#ua_profile_current_username').html("[currently " + $('#email_address').val() + "]");
            enablePrefs();
        }else{
            alert('not saved.');
        };
    }
}

function updatePasswd(field1, field2, field3, button) {
    if(!emailiterize){  return false; }
    if (isValidPasswd(field1, field2, button) && isValidPasswd(field3, field3, button)) {
        buttonSaving(button);
        newpassword = field1.val();
        newpassword_verify = field2.val();
        currentpassword = field3.val();
        dd.authoritize.Auth.auth('email', function(response) { onSuccess(response); },
                {
                    action: 'resetPassword',
                    old_password: currentpassword,
                    new_password: newpassword,
                    confirm_new_password: newpassword_verify
                });
    } else {
        field1.focus();
    }

    function onSuccess(response){
        if(response.success){
            buttonFinish(button);
            field1.val('');
            field2.val('');
            field3.val('');
        }else{
            button.html('update');
            field1.val('');
            field2.val('');
            field3.val('');
            field3.focus();
            $('#ua_profile_form_password_error').html('Password change failed. Try again?');
            setTimeout(function(){$('#ua_profile_form_password_error').html('');}, 4000);
        };
    }
}

function updateAvatar(field1, button) {
    if (isValidUrl(field1, button)) {
        buttonSaving(button);
        var data = {};
        data.avatar = field1.val();
        $.ajax({
          type: 'POST',
          url: '/accounts/profile/',
          processData: true,
          data: data,
          success: function(response) { onSuccess(response); }
        });
    } else {
        field1.focus();
    }

    function onSuccess(response){
        if(response.success){
            $('#profile_avatar').attr("src", field1.val());
            buttonFinish(button);
        }else{
            alert('not saved.');
        };
    }
}

function updateDisplayName(field1, button) {
    if (isValidDisplayName(field1, button)) {
        buttonSaving(button);
        var data = {};
        data.displayName = field1.val();
        $.ajax({
          type: 'POST',
          url: '/accounts/profile/',
          processData: true,
          data: data,
          success: function(response) { onSuccess(response); }
        });
    } else {
        field1.focus();
    }

    function onSuccess(response){
        if(response.success){
            buttonFinish(button);
        }else{
            alert('not saved.');
        };
    }
}

function updateNewsletter(button) {
    if ($('#ua_select_daily_digest').hasClass('isChanged') || $('#ua_select_dot_dot_dot').hasClass('isChanged') || $('#ua_select_comment_replies').hasClass('isChanged') || $('#ua_select_dailydot_updates').hasClass('isChanged')) {
        buttonSaving(button);
        var data = {};
        data.digest = isChecked($('#ua_select_daily_digest'), 'ua_profile_checkmark_active');
        data.dotdotdot = isChecked($('#ua_select_dot_dot_dot'), 'ua_profile_checkmark_active');
        data.replies = isChecked($('#ua_select_comment_replies'), 'ua_profile_checkmark_active');
        data.updates = isChecked($('#ua_select_dailydot_updates'), 'ua_profile_checkmark_active');

        $.ajax({
          type: 'POST',
          url: '/accounts/profile/',
          data: data,
          success: function(response) { onSuccess(response); }
        });
    } else {
        return false; // no need to send an unchanged form
    }

    function onSuccess(response){
        if(response.success){
            buttonFinish(button);
        }else{
            alert('not saved.');
        };
    }
}

function isValidDisplayName(field1, button){
    return true;
}

function isValidUrl(field1, button) {
    var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?\.(png|gif|jpg|jpeg)$/;
	return regexp.test(field1.val());
}

function isValidEmail(field1, field2, button) {
    if (field1.val() == field2.val()) {
        if (validateEmail(field1.val())) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function isValidPasswd(field1, field2, button) {
    if (field1.val() == field2.val()) {
        if (validatePasswd(field1.val())) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function isChecked(id, testclass) {
  // use this to see if one of our snazzy image based virual checkboxes is ticked or not ticked.
  var ticked = id.hasClass(testclass);
  return ticked;
}

function activateButton(button) {
    // Animate opacity and bind click event
    if (button.prop('disabled')) {
        console.log('activateButton');
        console.log(button.prop('disabled'));
        button.prop('disabled', false);
    }
}

function deActivateButton(button) {
    // Animate opacity and remove click event
    if (!button.prop('disabled')) {
        console.log('deActivateButton');
        console.log(button.prop('disabled'));
        button.prop('disabled', true);
    }
}

function buttonDone(button){
    activateButton(button);
    button.html('done');
    setTimeout(function(){ deActivateButton(button) }, 200);
}

function buttonFinish(button){
    activateButton(button);
    button.html('Done');
    setTimeout(function(){ button.html('Update'); deActivateButton(button) }, 1000);
}

function buttonSaving(button){
    button.html('Saving');
    deActivateButton(button);
}

function buttonSending(button){
    button.html('Sending');
    deActivateButton(button);
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
    //return true;
}

function validatePasswd(password) {
    var passwd = new String(password);
    if (passwd.length >= 6) {
        return true;
    } else {
        return false;
    }
    //return true;
}

// Livefyre auth
var CustomAuthDelegate = {
    login: function(handlers) {
        $.ajax({
            type: 'POST',
            url: '/accounts/login_details/',
            success: function(data){
                if (typeof(data) == 'object' && typeof(fyre) == 'object') {
                    if (data.auth == false) {
                        reset_signup_dialog();
                        $('#signupModal').modal('show');
                    } else {
                        fyre.conv.login(data.token);
                    }
                    handlers.success();
                } else {
                    alert('Something is not right. Try again?');
                    handlers.failure();
                    return false;
                }
            },
            error: function(data, error_msg, exception) {
                console.log('/accounts/login_details/ error: ' + error_msg);
                handlers.failure();
            }
        });
    },

    logout: function(handlers) {
        // Do something when the user logs out
        user_logout();
        handlers.success();
    },

    editProfile: function(handlers, author) {
        handlers.success();
        window.location = '/accounts/profile/';
    }
};

/* from http://www.quirksmode.org/js/cookies.html */
function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}

function hasEmail(){
  var curUsername = new String($('#ua_profile_current_username').html()); //make sure this is stringified
  var matchPattern = /@/; // If it has an @, we're satisfied.
                          // More reliable than searching for not.set (not2set@yahoo.com)
  if (!curUsername.match(matchPattern)){
    //No match
    $('#email_address').focus();
    return false;
  }else{
    // Match -- has email on profile.
    return true;
  }
}

function enablePrefs(){
  if(!hasEmail()){
    // dim prefs.
    $('#ua_profile_newsletter_form').css({ "opacity": 0.4 });
  }else{
    $('#ua_profile_newsletter_form').css({ "opacity": 1 });
  }
}

;
/**
 * Copyright 2012 The Daily Dot, Inc.
 *
 * Date: 8/5/12
 * Time: 9:57 AM
 */




var dd = dd || {};
dd.authoritize = dd.authoritize|| {};
dd.authoritize.Auth = dd.authoritize.Auth || {};

dd.authoritize.Auth = (function(){

    var statusChangeHandlers_ = [];
    var tizes_ = [];
    var loggedIn_;
    var authoritizeServer_;
    var useSSL_;


    var notifyStatusHandlers = function(authResponse){
        statusChangeHandlers_.forEach(function(handler){
            handler({
                loggedIn: loggedIn_,
                authResponse: authResponse
            });
        })
    }

    return {
        init: function(initVar){
            initVar.tizes.forEach(function(option){
                tizes_[option.tizeType] = option.tize;
            })

            loggedIn_ = initVar.loggedIn;
            authoritizeServer_ = initVar.authoritizeServer;
            useSSL_ = initVar.useSSL;
        },

        auth: function(authType, callback, data){
            console.log('Auth Called!');
            console.log(data);
            var callback_function = function(authResponse){
                if(authResponse.authenticated){
                    if(!loggedIn_){
                        loggedIn_ = true;
                        callback(authResponse);
                        notifyStatusHandlers(authResponse);
                    } else {
                        callback(authResponse);
                    }
                } else {
                    if(loggedIn_){
                        loggedIn_ = false;
                        callback(authResponse);
                        notifyStatusHandlers(authResponse);
                    } else {
                        callback(authResponse);
                    }
                }
            }
            if(data == null){
                console.log('Without data')
                tizes_[authType].auth(callback_function);
            } else {
                console.log('With data')
                tizes_[authType].auth(data, callback_function);
            }

        },

        deAuth: function(callback){
            authoritizeServer_.deAuth(callback);
        },

        registerStatusChangeHandler: function(callback){
            statusChangeHandlers_.push(callback);
        },

        getUrl: function(relativeUrl){
            console.log(useSSL_)
            return 'http' + (useSSL_ ? 's' : '') + '://' + window.location.host + relativeUrl;
        }
    }

}())


dd.authoritize.AuthoritizeServer = dd.authoritize.AuthoritizeServer || {};

dd.authoritize.AuthoritizeServer = function(deAuthUrl){
    this.deAuthUrl = deAuthUrl;
}

dd.authoritize.AuthoritizeServer.prototype.deAuth = function(callback){
    $.post(dd.authoritize.Auth.getUrl(this.deAuthUrl),'', function(deAuthResponse){
        callback(deAuthResponse);
    }, 'json');
};
/**
 * Copyright 2012 The Daily Dot, Inc.
 *
 * Date: 8/6/12
 * Time: 4:00 PM
 */

var dd = dd || {};
dd.authoritize = dd.authoritize || {};
dd.authoritize.Twitteritize = dd.authoritize.Twitteritize || {};

dd.authoritize.Twitteritize = (function(){

    var twitteritizeServer_;
    var twitteritizeUrl_;
    var callback_;

    return {
        init: function(initVars){
            twitteritizeUrl_ = initVars.twitteritizeUrl;
            twitteritizeServer_ = initVars.twitteritizeServer;
        },

        auth: function(callback){
            callback_ = callback;
            if (window.showModalDialog) {
                window.showModalDialog(twitteritizeUrl_,'Authorize With Twitter!',
                    "dialogWidth:600px;dialogHeight:600px;center:yes");
            } else {
                window.open(twitteritizeUrl_,'Authorize With Twitter!',
                    'height=600,width=600,toolbar=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,modal=yes');
            }
        },

        complete: function(authMessage){
            authMessage.tizeType = 'twitter';
            callback_(authMessage);
        },

        followUs: function(callback){
            twitteritizeServer_.followUs(function (resp){
               return callback(resp);
            });
        }
    }
}())

dd.authoritize.TwitteritizeServer = dd.authoritize.TwitteritizeServer || {};

dd.authoritize.TwitteritizeServer = function(followUsUrl){
    this.followUsUrl = followUsUrl;
}

dd.authoritize.TwitteritizeServer.prototype.followUs = function(callback){
    $.post(dd.authoritize.Auth.getUrl(this.followUsUrl), {}, function(response){
        console.log(response);
        callback(response);
    }, 'json');
};
/**
 * Copyright 2012 The Daily Dot, Inc.
 *
 * Date: 8/6/12
 * Time: 5:48 PM
 */

var dd = dd || {};
dd.authoritize = dd.authoritize || {};
dd.authoritize.Facebookeritize = dd.authoritize.Facebookeritize || {};

dd.authoritize.Facebookeritize = (function(){

    var facebookeritizeServer_;
    var FB_;
    var likeId_;
    var permissions_;

    return {
        init: function(initVars){
            facebookeritizeServer_ = initVars.facebookeritizeServer;
            permissions_ = initVars.permissions;
            FB_ = initVars.FBapi;
            FB_.init({
                appId      : initVars.appId,
                channelUrl : '//'+window.location.hostname+initVars.channelPath,
                status     : true,
                cookie     : true,
                xfbml      : true
            });
        },

        auth: function(callback){
            FB_.login(function(response) {
                if (!response.authResponse) {
                    callback({
                        authenticated: false,
                        canceledOrDenied: true,
                        message: 'The user canceled or denied the authentication request.',
                        tizeType: 'facebook'
                    });
                } else {
                    FB_.api('/me', function(me) {
                        console.log(response);
                        facebookeritizeServer_.login(me.id, response.authResponse.accessToken, function(response){
                            response.tizeType = 'facebook';
                            callback(response);
                        });
                    });
                }
            }, {
                scope: permissions_
            });
        }
    }
}())

dd.authoritize.FacebookeritizeServer = dd.authoritize.FacebookeritizeServer || {};

dd.authoritize.FacebookeritizeServer = function(loginUrl){
    this.loginUrl = loginUrl;
}

dd.authoritize.FacebookeritizeServer.prototype.login = function(id, accessToken, callback){
    $.post(dd.authoritize.Auth.getUrl(this.loginUrl), {id: id, access_token: accessToken}, function(response){
        callback(response);
    }, 'json');
};
;(function(){(function(a){if(!a.map)a.map=function(a){var b=[];for(var c=0;c<this.length;c++)b.push(a(this[c]));return b;};if(!a.indexOf)a.indexOf=function(a,b){if(this===undefined||this===null)throw new TypeError('"this" is null or not defined');var c=this.length>>>0;b=+b||0;if(Math.abs(b)===Infinity)b=0;if(b<0){b+=c;if(b<0)b=0;}for(;b<c;b++)if(this[b]===a)return b;return -1;};})(Array.prototype);var a=function(){function a(a){var b,d,e=this,g=a.length,h=0,i=e.i=e.j=e.m=0;for(e.S=[],e.c=[],g||(a=[g++]);f>h;)e.S[h]=h++;for(h=0;f>h;h++)b=e.S[h],i=c(i+b+a[h%g]),d=e.S[i],e.S[h]=d,e.S[i]=b;e.g=function(a){var b=e.S,d=c(e.i+1),g=b[d],h=c(e.j+g),i=b[h];b[d]=i,b[h]=g;for(var j=b[c(g+i)];--a;)d=c(d+1),g=b[d],h=c(h+g),i=b[h],b[d]=i,b[h]=g,j=j*f+b[c(g+i)];return e.i=d,e.j=h,j;},e.g(f);}function b(a,b,d,e){for(a+="",d=0,e=0;a.length>e;e++)b[c(e)]=c((d^=19*b[c(e)])+a.charCodeAt(e));a="";for(e in b)a+=String.fromCharCode(b[e]);return a;}function c(a){return a&f-1;}var d=[],e={},f=256,g=6,h=52;e.seed=function(c){var k,l=[];return c=b(c,l),k=new a(l),b(k.S,d),e.random=function(){for(var a=k.g(g),b=i,c=0;h>a;)a=(a+c)*f,b*=f,c=k.g(1);for(;a>=j;)a/=2,b/=2,c>>>=1;return(a+c)/b;},c;};var i=Math.pow(f,g),h=Math.pow(2,h),j=2*h;return b(Math.random(),d),function(a){return e.seed(a),function(){return e.random();};};}();var b;if(!b)b={};(function(){function a(a){return a<10?"0"+a:a;}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(b){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+a(this.getUTCMonth()+1)+"-"+a(this.getUTCDate())+"T"+a(this.getUTCHours())+":"+a(this.getUTCMinutes())+":"+a(this.getUTCSeconds())+"Z":null;};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(a){return this.valueOf();};}var c=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,d=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,e,f,g={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},h;function i(a){d.lastIndex=0;return d.test(a)?'"'+a.replace(d,function(a){var b=g[a];return typeof b==="string"?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+a+'"';}function j(a,b){var c,d,g,k,l=e,m,n=b[a];if(n&&typeof n==="object"&&typeof n.toJSON==="function"&&Object.prototype.toString.call(n)!='[object Array]')n=n.toJSON(a);if(typeof h==="function")n=h.call(b,a,n);switch(typeof n){case "string":return i(n);case "number":return isFinite(n)?String(n):"null";case "boolean":case "null":return String(n);case "object":if(!n)return "null";e+=f;m=[];if(Object.prototype.toString.apply(n)==="[object Array]"){k=n.length;for(c=0;c<k;c+=1)m[c]=j(c,n)||"null";g=m.length===0?"[]":e?"[\n"+e+m.join(",\n"+e)+"\n"+l+"]":"["+m.join(",")+"]";e=l;return g;}if(h&&typeof h==="object"){k=h.length;for(c=0;c<k;c+=1)if(typeof h[c]==="string"){d=h[c];g=j(d,n);if(g)m.push(i(d)+(e?": ":":")+g);}}else for(d in n)if(Object.prototype.hasOwnProperty.call(n,d)){g=j(d,n);if(g)m.push(i(d)+(e?": ":":")+g);}g=m.length===0?"{}":e?"{\n"+e+m.join(",\n"+e)+"\n"+l+"}":"{"+m.join(",")+"}";e=l;return g;}}if(typeof b.stringify!=="function")b.stringify=function(a,b,c){var d;e="";f="";if(typeof c==="number")for(d=0;d<c;d+=1)f+=" ";else if(typeof c==="string")f=c;h=b;if(b&&typeof b!=="function"&&(typeof b!=="object"||typeof b.length!=="number"))throw new Error("JSON.stringify");return j("",{"":a});};if(typeof b.parse!=="function")b.parse=function(a,b){var d;function e(a,c){var d,f,g=a[c];if(g&&typeof g==="object")for(d in g)if(Object.prototype.hasOwnProperty.call(g,d)){f=e(g,d);if(f!==undefined)g[d]=f;else delete g[d];}return b.call(a,c,g);}a=String(a);c.lastIndex=0;if(c.test(a))a=a.replace(c,function(a){return "\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4);});if(/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){d=eval("("+a+")");return typeof b==="function"?e({"":d},""):d;}throw new SyntaxError("JSON.parse");};}());window._umbel=window._umbel||[];var c=encodeURIComponent,d=decodeURIComponent;var e=function(){};var f={build_qs:function(a){var b="";for(var d in a){var e=a[d];b+=c(d)+"="+c(e)+"&";}if(b.length>0)b=b.substring(0,b.length-1);return b;},parse_qs:function(a){var b={};if(typeof a!='string')return b;a.replace(/([^=&]+)=([^&]*)/gi,function(a,c,e){b[d(c)]=d(e);});return b;},get_get_vars:function(a){if(typeof a==='undefined')var a=window.location.href;var b=a.split(/\?(.+)/);if(b.length!=3)return{};return this.parse_qs(b[1]);},get_hash_vars:function(){return this.parse_qs(window.location.href.split(/#(.+)/)[1]);},get_referring_host:function(){return document.referrer.split('/')[2];},get_referrer_whitelist:function(){return ["google.com","facebook.com","pinterest.com","twitter.com","wikipedia.org","huffingtonpost.com","yahoo.com","reddit.com","linkedin.com","bing.com","tumblr.com","aol.com"];},get_whitelisted_referrer:function(){var a=this.get_referring_host();if(a){var b=a.toLowerCase().split('.');var c=b.slice(-3).join('.');if(this.get_referrer_whitelist().indexOf(c)>-1)return c;c=b.slice(-2).join('.');if(this.get_referrer_whitelist().indexOf(c)>-1)return c;}return false;}};var g=function(){this.queue_kv=new i('umbel1-q');this.values_kv=new i('umbel1-v');this.daily_kv=new i('umbel1-d');this.init_id();this.event_blacklist=['session.ping'];this.jsonp_whitelist=['activationapp.success'];this.unique=0;};g.prototype={api_key:'cktircwrkezvomyk',send_data:function(a,c){a.unique=++this.unique;var d=new Image();if(typeof c=='function')d.onload=c;d.style.visibility='hidden';d.style.display='none';d.src='https://cktircwrkezvomyk.capture.umbel.com/measure.gif?'+f.build_qs({'json':b.stringify(a)});},send_data_jsonp:function(a){var c,d;a.unique=++this.unique;var g=a.unique;var h=a.success||e;var i=a.error||e;var j=function(){c.parentNode.removeChild(c);window['__umbelcb'+g]=e;};var k=setTimeout(function(){j();i();},10000);window['__umbelcb'+g]=function(a){clearTimeout(k);j();if(a.success)h(a);else i(a);};var l='https://api.umbel.com/capture.js?'+f.build_qs({'json':b.stringify(a),'callback':'__umbelcb'+g});d=document.getElementsByTagName('script')[0]||document.head;c=document.createElement('script');c.src=l;d.parentNode.insertBefore(c,d);},delete_queued:function(a){var b=this.queue_kv;return function(){b.del(a,true);};},send_queued:function(){var a=this.queue_kv.get_all();for(var c in a)try{var d=b.parse(a[c]);d.timestamp=c;d.browser_id=this.browser_id;d.api_key=this.api_key;this.send_data(d,this.delete_queued(c));}catch(e){this.delete_queued(c)();}},isodate:function(a){a=a||new Date();if(a.toISOString)return a.toISOString();var b=function(a){return a<10?'0'+a:a;};var c=a.getUTCFullYear()+'-'+b(a.getUTCMonth()+1)+'-'+b(a.getUTCDate())+'T'+b(a.getUTCHours())+':'+b(a.getUTCMinutes())+':'+b(a.getUTCSeconds())+'.'+b(a.getUTCMilliseconds())+'Z';return c;},gen_id:function(){var b=a(this.isodate()+Math.random().toString()+document.cookie+navigator.userAgent);return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(a){var c=b()*16|0,d=a=='x'?c:(c&0x3|0x8);return d.toString(16);});},init_id:function(){var a=h.get('umbel_browser_id');if(!a)var a=this.gen_id();h.set('umbel_browser_id',a,365);this.browser_id=a;},valid_event:function(a){var b,f,g,h,i;var j=window._umbel_property||null;if(a instanceof Array){var k=a.length;if(k>3||k<2)return;f=a[1];b=a[0];g=(k==3)?a[2]:'';}else if(typeof a==='object'){f=a.name;if(!f)return;b=a.type||'send';g=a.value||null;h=a.success||e;i=a.error||e;}else return;if(this.event_blacklist.indexOf(f)!=-1)return;if(b=='set'){var l=this.values_kv.get(f);if(l==g)return;else this.values_kv.set(f,g,true);}else if(b=='tag'){var m=this.values_kv.get(f);if(typeof m!='undefined'){var n=m.split('|');for(var o=0;o<n.length;o++)if(d(n[o])==g)return;this.values_kv.set(f,m+'|'+c(g),true);}else this.values_kv.set(f,c(g),true);}else if(b=='daily'){var p=f;var q=new Date();var r=q.getFullYear()+'-'+q.getMonth()+'-'+q.getDate();if(j)f+='.'+j;var s=this.daily_kv.get(f);if(s==r)return;else{this.daily_kv.set(f,r,true);f=p;}}else if(b!='send')return;var t=this.isodate();var u={name:f,value:g,timestamp:t,browser_id:this.browser_id,api_key:this.api_key,success:h,error:i};if(window._umbel_test_mode)u.testing=true;if(j)u.property_slug=j;return u;},send_event:function(a){var c=this.valid_event(a);if(c==undefined)return;var d=this;if(this.jsonp_whitelist.indexOf(c.name)!=-1){this.send_data_jsonp(c);return;}var e=function(a){var e={'name':c.name,'value':a};if(c.property_slug)e.property_slug=c.property_slug;d.queue_kv.set(c.timestamp,b.stringify(e),true);c.value=a;d.send_data(c,d.delete_queued(c.timestamp,c.callback));};if(typeof c.value=='function')c.value(e);else e(c.value);},patch_push:function(){for(var a=0;a<_umbel.length;a++)this.send_event(_umbel[a]);_umbel.length=0;var b=this;_umbel.push=function(a){b.send_event(a);};},send_builtin_events:function(){_umbel.push({'type':'daily','name':'daily.unique'});_umbel.push({'type':'set','name':'app.user_agent','value':navigator.userAgent});var a=f.get_whitelisted_referrer();if(a)_umbel.push({'type':'tag','name':'action.referrer','value':a});}};var h={set:function(a,b,c,d,e){if(typeof d==='undefined')d='/';if(typeof e==='undefined'){var f=document.domain.split('.');e='.'+f[f.length-2]+'.'+f[f.length-1];}var g=new Date();g.setDate(g.getDate()+c);var h=escape(b)+((c==undefined)?"":"; expires="+g.toUTCString())+((d===null)?'':'; path='+d)+((e===null)?'':'; domain='+e);var i=a+"="+h;document.cookie=i;},get:function(a){var b=this.get_match(function(b){return(a===b);});if(b.length)return b[0][1];},get_match:function(a){var b,c,d,e=[],f=document.cookie.split(";");for(b=0;b<f.length;b++){c=f[b].substr(0,f[b].indexOf("="));d=f[b].substr(f[b].indexOf("=")+1);c=c.replace(/^\s+|\s+$/g,"");if(a(c))e.push([c,unescape(d)]);}return e;},del:function(a,b,c){this.set(a,'',-1,b,c);this.set(a,'',-1,b,null);}};var i=function(a){this.namespace=a||'umbel1-v';this.cache=this.get_all();};i.prototype={get_all:function(){var a=this.namespace;var b=h.get_match(function(b){return b.slice(0,a.length)==a;});this.cc=b.length;var c={};b.map(function(a){var b=f.parse_qs(a[1]);for(var d in b)c[d]=b[d];});return c;},get:function(a){return this.cache[a];},set:function(a,b,c){this.cache[a]=b;if(c)this.commit();},del:function(a,b){delete this.cache[a];if(b)this.commit();},commit:function(){var a=[];for(var b in this.cache){var c={};c[b]=this.cache[b];a.push(f.build_qs(c));}var d=[];var e='';for(var g=0;g<a.length;g++){if(a[g].length+e.length>4000){d.push(e);e='';}if(e==='')e=a[g];else e+='&'+a[g];}if(e)d.push(e);this.cc=Math.max(this.cc,d.length);for(var g=0;g<this.cc;g++)if(g<d.length)h.set(this.namespace+g,d[g]);else h.del(this.namespace+g);}};var j=function(){var a=new g();a.patch_push();a.send_queued();a.send_builtin_events();};try{j();}catch(k){}})();;
/* Copyright (c) 2008-2013, Quantcast Corp. */
if(!__qc){var __qc={qs:'quantserve.com',ql:'quantcount.com',pixelcalls:[],pmto:null,pmc:undefined,qcdst:function(){if(__qc.qctzoff(0)!=__qc.qctzoff(6))return 1;return 0;},qctzoff:function(m){var d1=new Date(2000,m,1,0,0,0,0);var t=d1.toGMTString();var d3=new Date(t.substring(0,t.lastIndexOf(" ")-1));return d1-d3;},qceuc:function(s){if(typeof(encodeURIComponent)=='function'){return encodeURIComponent(s);}
else{return escape(s);}},qcrnd:function(){return Math.round(Math.random()*2147483647);},qcgc:function(n){var v='';var c=document.cookie;if(!c)return v;var i=c.indexOf(n+"=");var len=i+n.length+1;if(i>-1){var end=c.indexOf(";",len);if(end<0)end=c.length;v=c.substring(len,end);}
return v;},qcdomain:function(){var d=document.domain;if(d.substring(0,4)=="www.")d=d.substring(4,d.length);var a=d.split(".");var len=a.length;if(len<3)return d;var e=a[len-1];if(e.length<3)return d;d=a[len-2]+"."+a[len-1];return d;},qhash2:function(h,s){for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h+=(h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24);}
return h;},qhash:function(s){var h1=0x811c9dc5,h2=0xc9dc5118;var hash1=__qc.qhash2(h1,s);var hash2=__qc.qhash2(h2,s);return(Math.round(Math.abs(hash1*hash2)/65536)).toString(16);},sd:["4dcfa7079941","127fdf7967f31","588ab9292a3f","32f92b0727e5","22f9aa38dfd3","a4abfe8f3e04","18b66bc1325c","958e70ea2f28","bdbf0cb4bbb","65118a0d557","40a1d9db1864","18ae3d985046","3b26460f55d"],qcsc:function(){var s="";var d=__qc.qcdomain();if(__qc.qad==1)return";fpan=u;fpa=";var qh=__qc.qhash(d);for(var i=0;i<__qc.sd.length;i++){if(__qc.sd[i]==qh)return";fpan=u;fpa=";}
var u=document;var a=__qc.qcgc("__qca");if(a.length>0){s+=";fpan=0;fpa="+a;}
else{var da=new Date();var db=new Date(da.getTime()+47335389000);a='P0-'+__qc.qcrnd()+'-'+da.getTime();u.cookie="__qca="+a+"; expires="+db.toGMTString()+"; path=/; domain="+d;a=__qc.qcgc("__qca");if(a.length>0){s+=";fpan=1;fpa="+a;}
else{s+=";fpan=u;fpa=";}}
return s;},qcdc:function(n){document.cookie=n+"=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; domain="+__qc.qcdomain();},qpxload:function(img){if(img&&typeof(img.width)=="number"&&img.width==3){__qc.qcdc("__qca");}},qcdnt:function(){var ipf=false;if(typeof(window.external)!=='undefined'&&window.external!==null){var we=window.external;ipf=(typeof we.InPrivateFilteringEnabled==='function'&&we.InPrivateFilteringEnabled()===true);}
return(ipf||navigator.doNotTrack==="1"||navigator.doNotTrack==="yes"||navigator.msDoNotTrack==="1");},qcp:function(p,myqo){var s='',a=null;uh=null;var media='webpage',event='load';if(myqo!=null){for(var k in myqo){if(typeof(k)!='string'){continue;}
if(typeof(myqo[k])!='string'){continue;}
if(k=='uid'||k=='uh'){if(__qc.qcdnt()===false){uh=__qc.qhash(myqo[k]);}
delete myqo[k];continue;}
if(k=='qacct'){a=myqo[k];continue;}
s+=';'+k+p+'='+__qc.qceuc(myqo[k]);if(k=='media'){media=myqo[k];}
if(k=='event'){event=myqo[k];}}}
if(typeof a!="string"){if((typeof _qacct=="undefined")||(_qacct.length==0))return'';a=_qacct;}
if(typeof uh==='string'){myqo['uh']=uh;s+=';uh'+p+'='+__qc.qceuc(uh);}
if(media=='webpage'&&event=='load'){for(var i=0;i<__qc.qpixelsent.length;i++){if(__qc.qpixelsent[i]==a)return'';}
__qc.qpixelsent.push(a);}
if(media=='ad'){__qc.qad=1;}
s=';a'+p+'='+a+s;return s;},qcesc:function(s){return s.replace(/\./g,'%2E').replace(/,/g,'%2C');},qcd:function(o){return(typeof(o)!="undefined"&&o!=null);},qcogl:function(){var m=document.getElementsByTagName('meta');var o='';for(var i=0;i<m.length;i++){if(o.length>=1000)return o;if(__qc.qcd(m[i])&&__qc.qcd(m[i].attributes)&&__qc.qcd(m[i].attributes.property)&&__qc.qcd(m[i].attributes.property.value)&&__qc.qcd(m[i].content)){var p=m[i].attributes.property.value;var c=m[i].content;if(p.length>3&&p.substring(0,3)=='og:'){if(o.length>0)o+=',';var l=(c.length>80)?80:c.length;o+=__qc.qcesc(p.substring(3,p.length))+'.'+__qc.qcesc(c.substring(0,l));}}}
return __qc.qceuc(o);},qchcr:function(e){if(e.source!==window.top){return;}
var params=null;try{params=(typeof JSON==='object')&&JSON.parse(e.data);}catch(e){}
if(params&&typeof params.PrivacyManagerAPI==='object'){clearTimeout(__qc.pmto);if(window.removeEventListener){window.removeEventListener('message',__qc.qchcr,false);}
else if(window.detachEvent){window.detachEvent('onmessage',__qc.qchcr);}
__qc.pmc=params.PrivacyManagerAPI;__qc.firepixels();}},qccfp:function(action,type){__qc.pmc=PrivacyManagerAPI.callApi(action,__qc.qs,__qc.qcdomain(),"truste.com",type);__qc.firepixels();},qcctp:function(action,type){var params={PrivacyManagerAPI:{timestamp:new Date().getTime(),action:action,self:__qc.qs,domain:__qc.qcdomain(),authority:"truste.com",type:type}};if(window.addEventListener){window.addEventListener('message',__qc.qchcr,false);}
else if(window.attachEvent){window.attachEvent('onmessage',__qc.qchcr);}
else{__qc.pmc=true;__qc.firepixels();return;}
try{window.top.postMessage(JSON.stringify(params),"*");}
catch(e){}
__qc.pmto=setTimeout(function(){if(__qc.pmc===undefined){__qc.pmc=true;__qc.firepixels();}},25);},qc_consent:function(action,type){if(__qc.pmc===undefined){if(window.top===window.self){if(typeof PrivacyManagerAPI==='object'&&typeof PrivacyManagerAPI.callApi==='function'){__qc.qccfp(action,type);return;}}
else if(!!window.postMessage&&typeof JSON==='object'){__qc.qcctp(action,type);return;}
__qc.pmc=true;}
__qc.firepixels();},qctv:function(cm_consent){var cmv='';if(typeof cm_consent==='object'){cmv='p';cmv+=cm_consent.consent==='approved'?'a':'d';cmv+=cm_consent.source==='asserted'?'e':'i';}
return cmv;},qcenqp:function(qoptions){var e=(typeof(encodeURIComponent)=='function')?"n":"s";var r=__qc.qcrnd();var sr='',qo='',qm='',url='',ref='',je='u',ns='1';var qocount=0;__qc.qad=0;if(typeof __qc.qpixelsent=="undefined"){__qc.qpixelsent=new Array();}
if(typeof qoptions!="undefined"&&qoptions!=null){__qc.qopts=qoptions;for(var k in __qc.qopts){if(typeof(__qc.qopts[k])=='string'){qo=__qc.qcp("",__qc.qopts);break;}else if(typeof(__qc.qopts[k])=='object'&&__qc.qopts[k]!=null){++qocount;qo+=__qc.qcp("."+qocount,__qc.qopts[k]);}}}else if(typeof _qacct=="string"){qo=__qc.qcp("",null);}
if(qo.length==0)return;var ce=(navigator.cookieEnabled)?"1":"0";if(typeof navigator.javaEnabled!='undefined')je=(navigator.javaEnabled())?"1":"0";if(typeof _qmeta!="undefined"&&_qmeta!=null){qm=';m='+__qc.qceuc(_qmeta);_qmeta=null;}
if(self.screen){sr=screen.width+"x"+screen.height+"x"+screen.colorDepth;}
var d=new Date();var dst=__qc.qcdst();var fp=__qc.qcsc();if(window.location&&window.location.href)url=__qc.qceuc(window.location.href);if(window.document&&window.document.referrer)ref=__qc.qceuc(window.document.referrer);if(self==top)ns='0';var ogl=__qc.qcogl();var p1='/pixel;r='+r+qo+fp+';ns='+ns+';ce='+ce;var p2=';je='+je+';sr='+sr+';enc='+e+';dst='+dst+';et='+d.getTime()+';tzo='+d.getTimezoneOffset()+qm+';ref='+ref+';url='+url+';ogl='+ogl;__qc.pixelcalls.push({p1:p1,p2:p2});__qc.firepixels();},fire:function(o){var src='http';if(window.location.protocol=='https:'){src+='s';}
src+='://pixel.';src+=(__qc.pmc===true||__qc.pmc.consent==='approved')?__qc.qs:__qc.ql;src+=o.p1;src+=';cm='+__qc.qctv(__qc.pmc);src+=o.p2;var img=new Image();img.alt='';img.src=src;img.onload=function(){__qc.qpxload(img);};},firepixels:function(){if(__qc.pmc){while(__qc.pixelcalls.length){__qc.fire(__qc.pixelcalls.shift());}}else{__qc.qc_consent('getConsent','advertising');}},quantserve:function(){if(typeof _qevents=='undefined'){_qevents=[];}
if(typeof _qoptions!="undefined"&&_qoptions!=null){__qc.qcenqp(_qoptions);_qoptions=null;}else if(!_qevents.length&&typeof _qacct!="undefined"){__qc.qcenqp(null);}
if(!__qc.evts){for(var k in _qevents){__qc.qcenqp(_qevents[k]);}
_qevents={push:function(){var a=arguments;for(var i=0;i<a.length;i++){__qc.qcenqp(a[i]);}}};__qc.evts=1;}}};}
function quantserve(){__qc.quantserve();}
quantserve();
;
/*
 * Google Analytics push
 */
var _gaq = _gaq || [];
_gaq.push(['_setAccount', data.ga.id]);
_gaq.push(['_setDomainName', 'none']);
_gaq.push(['_setAllowLinker', true]);
//add custom variables
for(var i = 0; i < data.ga.cv.length; i++){
    _gaq.push(data.ga.cv[i]);
}
_gaq.push(['_trackPageview']);

/* track twitter social intents */
dd.ga.social.twitter.registerCallbacks();

/* track facebook social intents */
var fbAsyncInit = function() {
    dd.ga.social.facebook.registerCallbacks();
};

/*
 * Umbel integration
 */

// setup global container
window._umbel = window._umbel || [];

// make sure data structures exist before referencing them
data = data || {}
data.umbel = data.umbel || []
data.quantcast = data.quantcast || {}

// push data to umbel
data.umbel.forEach(_umbel.push);

// Push to quantcast 
_qevents.push(data.quantcast);

function login_init(){
    /*
     * This function must be called from the body, otherwise certain elements will not be appropriately loaded. This
     * will be fixed in the future.
     */

    /*
     * NOTE: Default logged in/out state is logged out
     *
     * If this is not our first page load, we might have had the opportunity
     * to check login status already and save a cookie showing the state. This
     * could allow us to show the logged in state sooner. If not, we wait for
     * the ajax call below and then set the cookie appropriately.
     */

    var logged_in = readCookie('logged_in');
    if (logged_in == 'true') {
        is_auth(true);
    }

    /* at any rate, do an ajax request to get the login details
     *
     * On success:
     *   if the user is logged in:
     *     - stash a `logged_in` cookie
     *     - save the `login_details` data (used later)
     *     - tell the page to show logged in status
     *   if the user is not logged in:
     *     - set `login_details` to false
     *     - tell the page to show logged out status
     *     - erase any `logged_in` cookies
     */

    $.ajax({
        type: 'POST',
        url: '/accounts/login_details/',
        success: function(data) {

            // We are expecting JSON
            if (typeof(data) == 'object') {
                if (data.auth == false) {
                    login_details = false;
                    is_auth(false);
                    eraseCookie('logged_in');
                } else {
                    login_details = data;
                    is_auth(true);
                    createCookie('logged_in', true, false);
                }
            } else {
                alert('Something is not right. Try again?');
                return false;
            }
        }
    });
}

;
window.OBR = window.OBR||{};(function(OBR){window.OB_releaseVer="195008";window.OBR=window.OBR||{};OBR.j=OBR.j||[];OBR.ra=OBR.ra||{};window.OBR$=function(d){return document.getElementById(d)};OBR.d=OBR.d||function(){var d={},a={u:function(){return d},h:function(a){d.aa=a;d.Ga=[];d.startTime=(new Date).getTime()},startTime:function(){return d.startTime},log:function(a){var f=((new Date).getTime()-d.startTime)/1E3;1E3>d.Ga.length&&d.Ga.push(f+" >"+a)},printLog:function(){if(d.aa.b.Gg)window.console.log(d.Ga.join("\n"));else{var a=d.aa.a.Da();a&&(a.innerHTML=d.Ga.join("<br>"),a.style.display="block")}return d.Ga.join("\n")}};a.h(OBR);return a}();OBR.printLog=OBR.d.printLog;OBR.A=function(){this.P=[]};OBR.A.prototype.add=function(d,a){var c;"string"===typeof d&&"function"===typeof a&&(c={},c.name=d,c.Qf=a,this.P.push(c))};OBR.A.prototype.mc=function(d){var a,c;OBR.d.log("remove event :"+d);a=0;for(c=this.P.length;a<c;a+=1)if(this.P[a]&&this.P[a].name&&this.P[a].name===d)try{this.P.splice(a,1)}catch(f){OBR.d.log("rm evnt err: "+f)}};
OBR.A.prototype.l=function(d,a,c){var f,b,e,g;a=a||[];c=!!c;OBR.d.log("event fire:"+d);f=0;for(b=this.P.length;f<b;f+=1)if(e=this.P[f].name||"",g=this.P[f].Qf,e===d)try{g.apply(this,a)}catch(h){OBR.d.log("fire evnt *"+d+"* error: "+h)}!0===c&&this.mc(d)};OBR.A.prototype.ba=function(){this.P=[]};OBR.a=OBR.a||function(){var d={},a={},c=document,f=OBR;a.u=function(){d.aa=f;return d};a.h=function(b){f=b};a.na=function(){return function(){}};a.tg=function(){var b=window.jQuery;return void 0!==b?!(/1\.(0|1|2|3|4)\.(0|1)/.test(b.fn.jquery)||/^1\.1/.test(b.fn.jquery)||/^1\.2/.test(b.fn.jquery)||/^1\.3/.test(b.fn.jquery)):!1};a.q=function(b){return null===b||isNaN(b)?null:f.p("outbrain_widget_"+b)};a.Da=function(){return f.p("ob_holder")};a.Vb=function(){if(!f.p(f.b.cb)){var b=f.a.createElement("iframe",
f.b.cb),e=b.style;e.display="none";e.width="1px";e.height="1px";b.src="about:blank";(e=a.Da())||(e=a.Mb());f.a.R(b,e)}};a.Mb=function(){if(c.body)return c.body;var b;b=f.a.B("","","body",!0);return 0>=b.length?c.lastChild:b[0]};a.createElement=function(b,e,g,a){var f;b=c.createElement(b);"string"===typeof e&&b.setAttribute("id",e);"string"===typeof g&&(b.style.cssText=g);for(f in a)a.hasOwnProperty(f)&&b.setAttribute(f,a[f]);return b};a.J=function(b){if(f.b.Hc===f.b.Bc)try{c.createStyleSheet().cssText=
b}catch(e){OBR.d.log(e)}else{var g=c.createElement("style"),a=c.body?"string"===typeof c.body.style.WebkitAppearance:!1;g.type="text/css";c.getElementsByTagName("head")[0].appendChild(g);g[a?"innerText":"innerHTML"]=b}};a.I=function(b,e){var g=c.createElement("script");g.type=f.b.Yg;g.src=b;g.charset="UTF-8";g.async=!!e;g.defer=!1;return g};a.Yi=function(b,e){var g=f.a.createElement("link",b);g.setAttribute("rel","stylesheet");g.setAttribute("type",f.b.vf);e&&g.setAttribute("href",e);return g};a.jf=
function(b){var e=f.p("ob_iframe");e&&(e.src=b)};a.Vd=function(){var b;b=isNaN(b)?1E5:b;return Math.floor(Math.random()*b)};a.Rh=function(b,e,g){return b.replace(e,g)};a.eg=function(b,e){var g=[];g.push('<body onload="');g.push("var js = document.createElement('script');");g.push("js.src = '"+b+"';");"number"===typeof e&&g.push("js.onerror = function(){ top.OBR.extern.errorInjectionHandler("+e+") };");g.push("var d = document;d.getElementsByTagName('head')[0].appendChild(js);\">");g.push("<script type='text/javascript'>");
g.push("window.OBR={extern:{}};");g.push("OBR.extern.returnedHtmlData=function(json,idx){(top.OBR.extern.returnedHtmlData)&& top.OBR.extern.returnedHtmlData(json,idx); };");g.push("OBR.extern.returnedIrdData=function(json,idx){(top.OBR.extern.returnedIrdData)&& top.OBR.extern.returnedIrdData (json,idx);};");g.push("OBR.extern.returnedJsonData=function(json,idx){(top.OBR.extern.returnedJsonData)&& top.OBR.extern.returnedJsonData(json,idx);};");g.push("OBR.extern.returnedError=function(json){(top.OBR.extern.returnedError)&& top.OBR.extern.returnedError(json);};");
g.push("window.outbrain={};");g.push("outbrain.returnedIrdJsonData=function(json,idx){(top.outbrain.returnedIrdJsonData) && top.outbrain.returnedIrdJsonData(json,idx);  };");g.push("outbrain.returnedJsonData =function(json,idx){(top.outbrain.returnedJsonData) && top.outbrain.returnedJsonData(json,idx); };");g.push("outbrain.returnedError=function(json){(top.outbrain.returnedError) && top.outbrain.returnedError(json);};");g.push("\x3c/script>");g.push("</body>");return g.join("")};a.dg=function(){var b;
if(b=OBR.p("objsonpp"))if(a.Mg())a.fa(b.parentNode)&&b.parentNode.removeChild(b);else return OBR.p("objsonpp");b=c.createElement("iframe");b.id="objsonpp";b.Yh&&(b.Yh="seamless");(b.frameElement||b).style.cssText="width: 0; height: 0; border: 0";b.src="";c.body.appendChild(b);return b};a.Bg=function(b){var e=a.dg(),e=e.contentWindow||e.contentDocument;e.document&&(e=e.document);e.open().write(b);e.close()};a.N=function(b){var e,g;g=c.getElementsByTagName("head");try{g&&0<g.length?g[0].insertBefore(b,
g[0].firstChild):(e=c.getElementsByTagName("script"),e[0].insertBefore(b,e[0].firstChild))}catch(a){f.d.log("Err insertToHead:"+a)}};a.Fg=function(b,e){var g=a.eg(e,b);a.Ed(g)||a.Bg(g)};a.cj=function(b){b=b||OBR;return"function"!==typeof b.A?(OBR.d.log("namespace.EventManager not function"),null):new b.A};a.F=function(b){return encodeURIComponent(b)};a.fa=function(b){return null!==b};a.Tg=function(b){var e,g=!1;if(a.gb(b))return!1;e=b.Qb().recMode||"";b=b.Qb().dynamicWidgetLayout||"";"2"===(f.b.le[e]||
"")&&"1"===(f.b.Xh[b]||"")&&(g=!0);g||"1"!==(f.b.le[e]||"")||(g=!0);return g};a.gb=function(b){return void 0===b||null===b};a.Ed=function(b){return a.gb(b)||""===b};a.getElementsByClassName=function(b,e){e||(e=document);return e.getElementsByClassName?e.getElementsByClassName(b):a.B("class",b,"*",!0,!0,e)};a.B=function(b,e,g,f,d,l){var m,n,p;m=[];g=g||"*";f=!!f;d=a.Ed(d)?!0:!1;g=l?l.getElementsByTagName(g):c.getElementsByTagName(g);l=0;for(n=g.length;l<n;l+=1)p="class"===b?g[l].className:g[l].getAttribute(b),
null!==p&&(!1===d&&(p=p.toLowerCase(),e=e.toLowerCase()),(p=""===b?!0:f?-1<p.indexOf(e):p===e)&&m.push(g[l]));return m};a.ce=function(b){var e=window;e.detachEvent?e.detachEvent("onscroll",b):e.removeEventListener&&e.removeEventListener("scroll",b,!1)};a.n=function(b,e,g){b.attachEvent?b.attachEvent("on"+e,function(){g.call(b)}):b.addEventListener&&b.addEventListener(e,g,!1)};a.R=function(b,e){try{e.appendChild(b)}catch(g){f.d.log("fail insert into Dom:"+g)}};a.lb=function(b){b=f.p(b);!a.gb(b)&&a.fa(b.parentNode)&&
b.parentNode.removeChild(b)};a.insertBefore=function(b,e){return e.parentNode.insertBefore(b,e)};a.isArray=function(b){return b instanceof Array?!0:"[object Array]"===Object.prototype.toString.call(b)};a.nb=function(b,e){var g=/htt(p|ps)?:\/\/127\.0\.0\.1(:\d\d\d\d)?/i;return/htt(p|ps)?:\/\/([\w\-]*|[\w\-]*\.[\w\-]*)\.outbrain\.com(:\d\d\d\d)?/i.test(b)||g.test(b)?b:e};a.Hi=function(b){b=b.replace(/^(\s*)/g,"");var e=c.createElement("div");e.innerHTML=b;return e.childNodes};a.M=function(b,e){return b?
b.getAttribute(e):null};a.w=function(b,e,g){b&&b.setAttribute(e,g)};a.ya=function(b,e){var g=RegExp("[ '\"|]"+e+"[ '\"|]");b&&!g.test("|"+b.className+"|")&&(b.className+=" "+e)};a.U=function(b,e){b=b.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var g,a;try{return g=RegExp("[\\?&]"+b+"=([^&#]*)","i"),a=g.exec(decodeURIComponent(window.location.href.replace(/\+/g," "))),null===a?e:a[1]}catch(c){return e}};a.pf=function(b){"string"===typeof b&&0<b.indexOf("#")&&(b=b.substr(0,b.lastIndexOf("#")));return b};
a.Pc=function(b){var e=f.b.K+"/strip_default.png";b.src!==e&&(b.alt="",b.title="",b.src=e)};a.Ff=function(){var b=null,e,g,a=null;if("string"===typeof window.OB_MP_feed)b=window.OB_MP_feed;else if((e=c.getElementsByTagName("head"))&&0<e.length)for(g=e[0].getElementsByTagName("link"),e=0;e<g.length;e+=1)if(a=g[e],null!==a.type&&("application/rss+xml"===a.type||"application/atom+xml"===a.type)&&null!==a.href&&""!==a.href){b=a.href;break}return b};a.Q=function(b,e){var g=null;b.currentStyle?g=b.currentStyle[e]:
window.getComputedStyle&&(g=document.defaultView.getComputedStyle(b,null).getPropertyValue(e));return g};a.fi=function(){var b=a.Da(),e,g;a.fa(b)&&(e=f.a.createElement("span","ob_a"),a.insertBefore(e,b),e.innerHTML=".",g=a.Q(e,"color"),a.lb("ob_a"),e=f.a.createElement("a","ob_a"),e.setAttribute("href","void(0)"),e.innerHTML=".",a.insertBefore(e,b),b=a.Q(e,"color"),a.lb("ob_a"),g="rgb(0, 0, 0)"===g||"#000000"===g?"#555":g,a.J(".ob-tcolor{color:"+g+"} .ob-lcolor{color:"+b+"} .ob-bgtcolor{background-color:"+
g+"} .item-link-container:hover .ob-tcolor{border-color:"+g+"}"))};a.pd=function(b){var e=a.od("property","og:url","meta","content");null===e&&(e=a.od("rel","canonical","link","href"));null!==e||b||(e=window.location.href);null===e&&(e="");return e};a.od=function(b,e,g,c){var f=null;b=a.B(b,e,g,!1);null!==b&&0<b.length&&(f=b[0].getAttribute(c));return f};a.kf=function(b){var e,g,c;g=f.j[b].k("tracking",!1);e=f.b.Fa;b=f.j[b].k("comScoreEnabled",!0);c=f.b.Qc;!1===g&&(!1===e&&!0===b&&!1===c)&&(a.Vb(),
e=f.p(f.b.cb))&&(e.src=f.b.K+"/"+f.b.jb+"3rd/comScore/comScore.htm",f.b.Qc=!0)};a.qg=function(){var b=a.Ob(8);"string"===typeof window.name&&(""===window.name||-1<window.name.indexOf("frame"))?(window.name=b,b=window.name):"string"===typeof window.name&&""!==window.name&&(b=window.name);return b=f.a.F(b.substring(0,9))};a.Ob=function(b){var e,g;e=[];b="number"===typeof b?b:8;for(g=0;g<b;g+=1)e.push("0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".charAt(Math.floor(61*Math.random())));
return e.join("")};a.Wa=function(b){for(var e in f.ra)if(f.ra.hasOwnProperty(e)&&f.ra[e].g===b)return f.ra[e];return null};a.sd=function(b){var e,g;g=f.j;for(e=0;e<g.length;e+=1)if(g[e].Ca()===b)return g[e];return null};a.Qg=function(b){for(var e in b)if(b.hasOwnProperty(e))return!1;return!0};a.oa=function(b,e){return"function"!==typeof b?null:void 0===e?b():b(e)};a.Mg=function(){return"Microsoft Internet Explorer"===navigator.appName};a.wf=function(b,e){return b*e};a.md=function(b){if(!b||""===b)return[];
b=b.replace("","").replace("http://","").replace("https://","").replace("www.","").replace("www2.","").split("/");b.pop();return 0<b.length?b:[]};a.Xf=function(b,e){var g=a.md(b),c=[],f="";if(e>=g.length)f=g.join(".");else{c[0]=g[0];for(f=1;f<=e;f+=1)c[f]=g[f];f=c.join(".")}return f};a.hg=function(){return"http"+("https:"===c.location.protocol?"s":"")};a.gg=function(){var b,e;b=c.getElementById("widgetVersionSync");null===b&&(b=a.createElement("iframe","widgetVersionSync"),e=a.createElement("div",
null,"display:none; height:0px; width:0px; border:none;"),e.appendChild(b),a.Mb().appendChild(e));return b};a.Oi=function(b){var e;e=window.OB_releaseVer;isNaN(e)||(isNaN(b)||e>=b)||(b=a.hg()+"://widgets.outbrain.com/external/sync/outbrainjs.html?needToBeVer="+b.toString(),e=a.gg(),e.src=b)};a.Xe=function(b){b=b.k("widgetVersionSync",1);isNaN(b)||""===b||(b=parseInt(b,10)||1,a.Oi(b))};a.vi=function(b){window.localStorage&&window.localStorage.setItem("OB-USER-TOKEN",b)};a.og=function(){return window.localStorage&&
window.localStorage["OB-USER-TOKEN"]?window.localStorage["OB-USER-TOKEN"]:null};a.xf=function(){window.localStorage&&window.localStorage["OB-USER-TOKEN"]&&window.localStorage.removeItem("OB-USER-TOKEN")};a.h(OBR);return a}();
OBR.$=function(d,a,c,f,b,e,g,h,k){var l,m;l=this;m=0;k="function"===typeof k?k:OBR.a.wf;l.start=function(){var n;m+=1;OBR.a.oa(d,m)?OBR.a.oa(a,m):(n=OBR.a.oa(h,m))?OBR.a.oa(f,m):(n=m===e&&1E3!==e)?OBR.a.oa(f,m):(OBR.a.oa(c,m),n=g?k(m,b):b,setTimeout(function(){l.start()},n))};l.start()};OBR.Wc=OBR.Wc||{Ig:function(){return"complete"===document.readyState}};
OBR.bd=function(){var d={},a=[];d.add=function(c){a.push(c)};d.remove=function(c){a.splice(c,1)};d.top=function(){return 0<a.length?a.shift():null};d.Lg=function(){return 0>=a.length};d.bj=function(){return a};d.of=function(){a=[]};return d};
OBR.xa=function(){function d(f,b){a.La="resolve"===f?function(g){g&&g(b)}:function(g,e){e&&e(b)};a.ua=a.Nh=function(){throw Error("Promise already completed.");};for(var e,g=0;e=c[g++];)e[f]&&e[f](b);delete c}var a={},c=[];a.La=function(a,b){c.push({resolve:a,reject:b})};a.ua=function(a){d("resolve",a)};a.Nh=function(a){d("reject",a)};return a};OBR.b=OBR.b||function(){var d={},a={},c=OBR,f;a.Me="opera";a.Bc="msie";a.Je="firefox";a.Ie="chrome";a.Oe="safari";a.Le="mozilla";a.Xi="boolean";a.pj="string";a.ij="object";a.rj="undefined";a.cb="ob_iframe";a.wd=!0;a.Td=0;a.pb="outbrain_widget_";a.Yg="text/javascript";a.vf="text/css";a.$i=document;a.Bd=void 0!==document.createElement("script").async;a.He=c.a.qg();a.Kh=document.referrer;a.Jh=c.a.F(document.referrer);a.ah=document.location.href;a.gj=c.a.F(a.ah);a.Qa=!1;a.tc="";a.Eb=navigator.userAgent.toLowerCase();
a.xh=navigator.platform.toLowerCase();f=a.Eb;a.Hc=/opera/.test(f)?a.Me:/msie/.test(f)?a.Bc:/firefox/.test(f)?a.Je:/chrome/.test(f)?a.Ie:/safari/.test(f)?a.Oe:a.Le;a.Fa=!!/(iphone|ipod|symbian|android|windows ce|blackberry|palm|ipad)/.test(f);a.Og=0;a.zd=a.Eb.match(/msie 8/)||a.Eb.match(/msie 7/);a.Ng=function(){return void 0===window.XMLHttpRequest&&void 0!==ActiveXObject};a.Dh=window.OB_platformType||null;a.hb="number"===typeof a.Dh;a.me=null;a.ad=null;a.Gi=function(){a.hb&&(a.me&&a.ad)&&(a.me(),
a.ad())};a.va="string"===typeof window.OB_releaseVer?window.OB_releaseVer:"0";a.jh=!0===window.OB_disable_odbl;f=("https:"===document.location.protocol?"https":"http")+"://";a.ff="/blogutils/ExcludeRec.action?bocr=";a.jj="html";a.wg=c.a.nb(c.a.U("wiodb",f+"hpr.outbrain.com"),f+"hpr.outbrain.com");a.ec=c.a.nb(c.a.U("wiodb",f+"odb.outbrain.com"),f+"odb.outbrain.com");a.gf=f+"storage.outbrain.com/";a.K=c.a.nb(c.a.U("wihost",f+"widgets.outbrain.com"),f+"widgets.outbrain.com");a.yh=c.a.nb(c.a.U("wiout",
f+"outbrain.com"),f+"outbrain.com");a.$c=c.a.U("wixp",null);a.hc=f+"log.outbrain.com/";a.jb="nanoWidget/";a.zh=a.hb?"NANOWDGTLT13":"NANOWDGT01";a.gh=a.K+"/"+a.jb+a.va+(a.hb?"/moduleLT":"/module");a.fh=a.K+"/"+a.jb+"3rd";a.Gg="object"===typeof window.console;a.ye=c.a.pf(c.a.Ff());a.xe=null===a.ye?"":c.a.F(a.ye);a.Qc=!1;a.kh="true"===c.a.U("obdraft",!1)?"&obDraft=true":"";a.Qe=!1!==c.a.U("obAbtest",!1)?"&obAbtest="+c.a.U("obAbtest",""):"";a.qe=function(b){a.eb=a.eb||b;return a.eb};a.eb=a.qe("true"===
c.a.U("advanceLoader","false").toLowerCase());a.Jd=0;a.Ha=null;a.Wh="data-obscrollable";a.le={touch_strip:"1",odb_dynamic:"2"};a.Xh={"touch-strip":"1"};a.u=function(){d.aa=c;return d};return a}();OBR.c=OBR.c||function(){var d={},a,c={};d.h=function(c,b){a=c;d.Hh(b)};d.e={ub:"POPUPDESCRIPTION",Oa:"WIDGETSTATISTICS",Cb:"STATISTICS",Na:"WHATIS",sb:"FLYTHROUGH",Db:"VIDEOPLUGIN",ma:"POSCUL",zb:"SCROLL",Ab:"SCROLLEXTERNAL",wb:"RECINIFRAME",yb:"REGISTER",xb:"REFRESHWIDGET",Bb:"SKYLANDER",Ma:"LOADMORE",Si:"DYNAMICTEXTTRUNCATION"};d.Ne=function(a,b){var e={Zi:a,url:b,version:-1,state:0,Fb:null,Rc:this,Gc:null,nf:function(){if(2===e.state)e.Hd();else if(0===e.state){var b=OBR.a.I(e.url,!0);e.state=
1;OBR.a.N(b)}},Hd:function(){e.state=2;"function"===typeof e.Fb&&e.Fb.call(e.Rc,e.Gc)}};return e};d.Hh=function(c){function b(b){return a.b.gh+"/"+b}function e(b,e){c[b]||(c[b]=new d.Ne(b,e))}e(d.e.ub,b("popupDescription.js"));e(d.e.Oa,b("widgetStatistics.js"));e(d.e.Cb,b("statistics.js"));e(d.e.Na,b("whatis.js"));e(d.e.sb,b("flyThrough.js"));e(d.e.Db,b("videoPlugin.js"));e(d.e.ma,b("positionCalculation.js"));e(d.e.wb,b("recInIframe.js"));e(d.e.yb,b("registration.js"));e(d.e.xb,b("refreshWidget.js"));
e(d.e.Bb,b("skyLander.js"));e(d.e.Ma,b("loadMore.js"));e(d.e.zb,b("scroll.js"));e(d.e.Ab,a.b.fh+"/scroll/scrollExternal.js")};d.bg=function(a){return c[a]};d.r=function(a,b,e,g){if(a=d.bg(a))a.Fb=b||OBR.a.na(),a.Rc=e,a.Gc=g,a.nf()};d.Xa=function(a){return c[a].state};d.C=function(f){"-1"!==a.b.va&&c[f].Hd()};d.h(OBR,c);return d}();OBR.h=OBR.h||void 0;OBR.p=function(d){return document.getElementById(d)};OBR.S=OBR.S||function(){var d={},a={},c,f;a.h=function(b){c=b=b||OBR;d.Ia=new c.A;f=!1};a.u=function(){return d};d.Eg=function(){var b,a;b=c.a.createElement("iframe","ob_ping");b.setAttribute("id","ob_ping");b.style.border="0px";b.style.width="0px";b.style.height="0px";b.setAttribute("src",c.b.ec+"/utils/ping.html?r="+c.a.Vd());c.a.n(b,"load",function(){c.d.log("ping returned");c.b.Td=2;d.Ia.l("success");c.S.ee()});a=c.a.Da();null!==a&&(c.d.log("ping inserted"),c.a.R(b,a))};d.Ch=function(){c.d.log("ping Wait");
new c.$(function(){return 2===c.b.Td},function(){},c.a.na(),function(){d.Ia.l("fail");c.S.ee()},50,200,!1)};a.ee=function(){c.a.lb("ob_ping")};a.th=function(b){d.Ia.add("success",b)};a.sh=function(b){d.Ia.add("fail",b)};a.Rg=function(){return f};a.ue=function(){f=!0};a.Bh=function(){d.Eg();d.Ch()};a.L=function(){d.Ia.ba()};a.h(OBR);return a}();OBR.pa=OBR.pa||function(){var d,a={},c={},f;a.h=function(b){d=b=b||OBR;f=new d.A};a.u=function(){return c};c.Jb=function(b){var a,g;a=0;for(g=b.length;a<g;a+=1)d.a.w(b[a],"data-ob-mark","true"),d.a.w(b[a],"data-browser",d.b.Hc),d.a.w(b[a],"data-os",d.b.xh),f.l("find",[b[a]])};c.jd=function(){return d.a.B("class","OUTBRAIN","div",!0)};c.Wf=function(b){var a,g,c=[],f=[];a=0;for(g=b.length;a<g;a+=1)if("string"===typeof b[a].containerId)if(d.p(b[a].containerId)){var l=d.p(b[a].containerId);"string"===
typeof b[a].widgetId&&d.a.w(l,"data-widget-id",b[a].widgetId);"string"===typeof b[a].permalink&&d.a.w(l,"data-src",b[a].permalink);"string"===typeof b[a].srcUrl&&d.a.w(l,"data-ob-srcUrl",b[a].srcUrl);"boolean"===typeof b[a].advanceLoader&&d.a.w(l,"data-advance-loader",b[a].advanceLoader);"boolean"===typeof b[a].dynLoad&&d.a.w(l,"data-dynLoad",b[a].dynLoad);"string"===typeof b[a].widgetType&&d.a.w(l,"data-widget-type",b[a].widgetType);"string"===typeof b[a].timeout&&d.a.w(l,"data-timeout",b[a].timeout);
"string"===typeof b[a].fbk&&d.a.w(l,"data-fbk",b[a].fbk);f.push(l)}else c.push(b[a]);window.OB_elements=c;return f};c.fg=function(){var b=[];"object"===typeof window.OB_elements&&0<window.OB_elements.length&&(b=window.OB_elements);return b};c.cg=function(){var b=[],a=c.jd(),g,f;g=0;for(f=a.length;g<f;g+=1){var k=d.a.M(a[g],"data-ob-mark");null!==k&&"true"===k||!a[g]||b.push(a[g])}g=c.fg();if(0<g.length)for(d.d.log("Array of elements found!"),a=c.Wf(g),g=0,f=a.length;g<f;g+=1)b.push(a[g]);return b};
a.Vi=function(b){c.dd(b)};c.dd=function(b){if(void 0===b){var a=!1;d.d.log("searching for containers");new d.$(function(){return a},d.a.na(),function(){a=d.Wc.Ig();var b=c.cg();a&&d.d.log("checking:("+a+")");0<b.length&&c.Jb(b)},f.l("stopSearch"),50,1E3,!1)}else 0<(b.length||0)&&c.Jb(b)};a.ej=function(){return 0<c.jd().length};a.mh=function(b){f.add("find",b)};a.lj=function(b){f.add("stopSearch",b)};a.cd=function(){c.dd()};a.Lf=function(b){var a=[],g,f;d.v.zg();g=0;for(f=d.j.length;g<f;g+=1){var k=
d.a.q(g);null!==k&&("string"===typeof b&&d.a.w(k,"data-src",b),d.a.w(k,"data-ob-mark","false"),a.push(k))}0<a.length&&(d.j=[],c.Jb(a))};a.L=function(){f.ba();d.j=[]};a.h(OBR);return a}();OBR.v=OBR.v||function(){var d={},a={},c;a.h=function(a){c=a=a||OBR;d.gc=new c.bd;d.dc=new c.A;d.fb=!1};d.Sf=function(a){var b;b=a.pg();var e,g=c.a.Rh,h=c.a.og();b=b&&"hp"===b?c.b.wg+"/utils/get?url=$LNK$SRC&settings=$SET&recs=$REC&widgetJSId=$WID&key=$KEY&idx=$IDX&version=$VER&ref=$REF&apv=$APV&sig=$SIG&format=$FRT&rand=$RND$LSD$DRFT$ABTEST$XP$TOKEN":c.b.ec+"/utils/get?url=$LNK$SRC&settings=$SET&recs=$REC&widgetJSId=$WID&key=$KEY&idx=$IDX&version=$VER&ref=$REF&apv=$APV&sig=$SIG&format=$FRT&rand=$RND$LSD$DRFT$ABTEST$XP$TOKEN";
e=a.Ca();b=g(b+(""!==e&&null!==e?"&fbk="+e:""),"$LNK",c.a.F(a.da()));b=g(b,"$SRC",d.mg(a));b=g(b,"$IDX",a.$f());b=g(b,"$SET",!0);b=g(b,"$REC",!0);b=g(b,"$KEY",c.b.zh);b=g(b,"$WID",a.G());b=g(b,"$VER",c.b.va);b=g(b,"$REF",c.b.Jh);b=g(b,"$SIG",c.b.He);b=g(b,"$APV",c.b.Qa);b=g(b,"$FRT",a.Zf());b=g(b,"$RND",c.a.Vd());b=g(b,"$DRFT",c.b.kh);b=g(b,"$ABTEST",c.b.Qe);b=g(b,"$XP",c.b.$c?"&xp="+c.a.F(c.b.$c):"");b=g(b,"$LSD",h?"&lsd="+c.a.F(h):"");return b=g(b,"$TOKEN",""!==c.b.tc?"&t="+c.b.tc:"")};d.mg=function(a){var b=
"&srcUrl=";a=a.ng();return b=null!==a&&"string"===typeof a&&0<a.length?b+c.a.F(a):0<c.b.xe.length?b+c.b.xe:""};d.Tb=function(a,b,e){e=c.b.eb&&e;var g=b.g;b.H.qi();e?c.a.Fg(g,a):(e=c.a.I(a,!0),""!==b.Ca()&&c.a.n(e,"error",function(){OBR.extern.errorInjectionHandler(g)}),c.a.N(e));d.dc.l("onOdbFire_"+g+"_"+b.G(),[b],!0);c.d.log("fire this src "+a)};d.ri=function(a){c.b.Bd&&setTimeout(function(){d.de(a.g,a.G())},1E4)};d.de=function(a,b){c.a.lb("ob_odbCall_"+a+b)};a.l=function(){if(!0!==d.fb&&!0===c.S.Rg()){d.fb=
!0;var a=d.gc.top(),b;a?(c.d.log("fire odb for "+a.da()),b=d.Sf(a),d.Tb(b,a,!0),d.ri(a)):d.fb=!1}};a.qh=function(a,b){d.dc.add("onOdbFire_"+a.g+"_"+a.G(),b)};a.vc=function(a,b){d.fb=!1;d.de(a,b)};a.ei=function(a){!0===a&&(OBR.b.Qa=a)};a.rc=function(a){c.b.tc=a};a.zg=function(){c.b.Qa=!1};a.kc=function(f){d.gc.add(f);c.d.log("register odb for "+f.da());a.l()};a.$e=function(c){a.vc(c.g,c.G());a.l()};a.L=function(){d.gc.of();d.dc.ba()};a.u=function(){d.aa=c;return d};a.h(OBR);return a}();OBR.i=OBR.i||function(){function d(){c.d.log("ping fail")}function a(){c.d.log("ping success");c.S.ue();c.display.kb(b.za);c.v.l()}var c,f={},b={},e;b.ac="manualDataReady";b.$b="manualClickReady";f.h=function(a){c=a=a||OBR;e=new c.A;f.ae(b.$g)};f.u=function(){return b};f.ae=function(b){e.add("onHtmlReturn",b)};f.Mh=function(b){e.add("noRecs",b)};b.za=function(a){c.d.log("rec "+a+" was rendered");var e=c.j[a];e.Z(!0);e.H.si();0===a&&c.a.fi();b.bf(e);c.a.Xe(e);c.display.Cg(e)};b.ig=function(b){return Math.floor(Math.random()*
b)+1};b.bf=function(a){var e=a.k("widgetStatistics",!1),f=c.b.Fa,d=a.k("tracking",!1);a.k("globalWidgetStatistics",!1)&&!d?b.bi():!e||(f||d)||(e=a.k("wsSampling",0),0!==e&&b.ig(e)!==e||b.di(a))};b.di=function(b){2===c.c.Xa(c.c.e.Oa)&&2===c.c.Xa(c.c.e.ma)?c.D.Jc(b.g):c.c.r(c.c.e.ma,function(){c.c.r(c.c.e.Oa,function(){c.D.Jc(b.g)},this)},this)};b.bi=function(){2===c.c.Xa(c.c.e.Cb)&&2===c.c.Xa(c.c.e.ma)&&c.Ec.start()};b.Ni=function(a){c.d.log("widget was found");a=c.qb.Ve(a);0===a.g&&b.af();!0===a.Jg()?
c.d.log("Dynamic loader - stop odb!"):c.v.kc(a)};f.Od=function(a,d){var k="NA",l=a&&a.response?a.response:null,m;if(m=c.a.Wa(d))if(e.l("onmManualOdbReturned_"+d,[l,d]),m.W())return;l&&(l.request&&l.request.widgetJsId)&&(k=l.request.widgetJsId);c.v.vc(d,k);m&&(l&&l.documents)&&(m.Z(!0),f.gd(b.ac,d,k,a));c.v.l()};f.rh=function(b,a){e.add("onmManualOdbReturned_"+b,a)};f.gd=function(b,a,c,f){b=b+a+c;e.l(b,[f.response.documents,a]);e.mc(b)};f.Kd=function(a,d){if(null!==a){var k=0,l=a.permalink,m=a.srcUrl,
n=a.widgetId,p=a.widgetType,q=a.fbk,r=a.timeout;l&&"string"===typeof l&&(n&&"string"===typeof n)&&(c.d.log("manual Odb call"),k=f.dh(l),f.ib(b.ac+k+n,d),l=c.qb.Sc(k,l,n,!1,p,q,r,m,!0),l.li(),c.ra[k]=l,e.l("onmManualOdbCall",[l,b.ac]),c.S.ue(),c.v.kc(l))}};f.ib=function(b,a){e.add(b,a)};f.vh=function(b){e.add("onmManualOdbCall",b)};f.dh=function(b){var a=0,e=c.b;null===e.Ha&&(e.Ha=0<c.j.length?c.j[0].da():null);e.Ha===b?a=e.Jd+1:e.Ha=b;return e.Jd=a};f.Zb=function(a,f){var d=OBR.p(c.b.cb);c.a.fa(d)&&
c.a.fa(d.parentNode)&&d.parentNode.removeChild(d);c.a.Vb();"function"===typeof f&&e.add(b.$b,f);if(null!==a&&(d=a.link)&&"string"===typeof d){c.d.log("manual Click");if(null!==d.match(/http:\/\/.+outbrain.com/i))c.a.jf(d+"&noRedirect=true");else throw"Wrong redirect link: "+d;e.l(b.$b);e.mc(b.$b)}};b.Vg=function(a){return b.Ad(a)||a.k("stopWidget",!1)};b.Ad=function(b){return b.k("stopRater",!1)};b.af=function(){c.S.th(a);c.S.sh(d);c.b.jh||c.b.Bd?(c.d.log("async - no ping"),a()):c.S.Bh()};b.rc=function(b){b.response&&
(b.response.request&&b.response.request.t)&&c.v.rc(b.response.request.t)};b.ni=function(b){b.response&&(b.response.request&&b.response.request.readerPlatform)&&(c.b.Fa="mobile"===b.response.request.readerPlatform)};f.fc=function(a,d){var k,l;OBR.d.log("HTML returned");d=b.Nd(d);k=c.j[d];b.rc(a);b.ni(a);k?(0>=k.kg(a)&&e.l("noRecs",[k]),k.H.pi(),k.W()?f.hd(k):(k.setData(a),l=k.G(),b.Vg(k)||b.Xg(k.Va())||(c.v.ei(a.response.settings.apv),f.Sg(k)?f.ta(d):f.sg(k),l&&e.l("odbRtn_"+l,[k]),e.l("onHtmlReturn",
[k])),f.hd(k),b.mf(k))):c.d.log("odbHtmlReturned : Widget not found")};b.Nd=function(b){return 1E3>b?b:b%1E3};b.$g=function(b){!0===b.k("isRegistrationEnabled",!1)&&c.c.r(c.c.e.yb,function(){c.be.Ph(b)},this)};b.Xg=function(b){var a=!1;null!==b.match(/(<\/?met|<\/?scr)/i)&&(a=!0,c.d.log("SECURITY"));return a};f.hd=function(a){b.Ad(a)||(c.v.vc(a.g,a.G()),c.v.l())};b.mf=function(b){!c.b.Fa&&(b.Wg()&&b.Ug())&&c.c.r(c.c.e.Bb,function(){c.we.h(b)},this)};f.Sg=function(b){var a=!0;if(b.Fd()||b.xd())a=!1;
return a};f.sg=function(b){var a=b.g;b.Fd()?c.c.r(c.c.e.Db,function(){c.ob.uf(a)},this):b.xd()&&c.display.Ag(b)};f.ta=function(b){c.display.ta(c.j[b]);c.d.log("HTML - Render");f.Eh(b)};f.Eh=function(b){c.a.kf(b);c.Yc.rg(b)};f.Wd=function(b,a){c.a.ya(a,"ob_clicked");var e=c.a.M(a,"data-redirect");null!==e&&(a.href=e);return!0};f.sa=function(b){c.D&&c.D.Sd();c.pa.Lf(b);return!0};f.L=function(){e.ba()};f.ie=function(){c.pa.mh(b.Ni);c.b.hb?c.b.Gi():c.pa.cd()};f.ef=function(b,a,e){if(window.confirm("Removing this recommendation will remove it permanently for this section and will refresh the recommendations.\n Are you sure you want to remove this recommendation?")){var d=
"https://my.outbrain.com/manage/",d=!1===e?d+("add-zapped-document?publisherId="+a+"&docUrl="+c.a.F(b)):d+("add-rule?publisherId="+a+"&ruleValue="+c.a.F(b)+"&ruleType="+e);b=c.a.I(d,!0);c.a.N(b)}};f.df=function(b){window.confirm("Removing this recommendation will remove it permanently for this section and will refresh the recommendations.\n Are you sure you want to remove this recommendation?")&&(b=c.a.I(c.b.ec+c.b.ff+b+"&index=1&templateIndex=1&sig="+c.b.He,!0),c.a.N(b))};f.Uh=function(b){b&&(b.ob_exclude_resp&&
b.ob_exclude_resp.code&&1!==b.ob_exclude_resp.code)&&f.sa()};f.$d=function(b,a){if(a&&"function"===typeof a){var d="odbRtn_"+b;e.add(d,a);var f=c.rb.Rb(b);f&&f.Hg()&&e.l(d,[f])}};f.Tf=function(b){return(b=c.rb.Rb(b))?b.o("tcr",-1):null};f.nc=function(){c.pa.cd()};f.ba=function(){c.D&&c.D.Sd();c.display.L();c.v.L();c.S.L();this.L();c.pa.L();c.Aa&&c.Aa.L();c.b.Qa=!1};f.Oh=function(){this.ba();this.ie()};f.Yd=function(a,e){a=b.Nd(a);var d=c.j[a];d.Lh(e);OBR.sa&&OBR.sa.qc(d);c.v.kc(d)};f.h(OBR);return f}();OBR.display=OBR.display||function(){var d,a={},c;a.h=function(a){d=a=a||OBR;c=new d.A};a.td=function(c,b){var e=d.a.Hi(c),g=d.a.q(b.g);g&&(e&&0<e.length)&&(0<b.Pb()?a.Hf(g,e[0],b.g):a.se(e[0],g,b.g),d.d.log("element inserted"))};a.Hf=function(c,b,e){function g(){a.ug(c).La(function(c){a.oi(c,b,e).La(function(b){a.Gf(b)})})}var h=new d.xa;h.La(function(){a.If(c).La(g)});h.ua()};a.If=function(a){var b=new d.xa,e=1,c=setInterval(function(){0.1>=e?(clearInterval(c),b.ua(a)):(a.style.opacity=e,d.b.zd?
e=0:(a.style.filter="alpha(opacity="+100*e+")",e-=0.1*e))},10);return b};a.ug=function(a){var b=new d.xa;a.style.opacity=0;setTimeout(function(){b.ua(a)},0);return b};a.oi=function(c,b,e){var g=new d.xa;a.se(b,c,e);setTimeout(function(){g.ua(c)},0);return g};a.se=function(a,b,e){b.innerHTML="";d.a.R(a,b);c.l("afterRender",[e])};a.Gf=function(a){var b=new d.xa,e=0.1,c=setInterval(function(){1<=e?(clearInterval(c),a.removeAttribute("style"),b.ua(a)):(a.style.opacity=e,d.b.zd?e=1:(a.style.filter="alpha(opacity="+
100*e+")",e+=1.6*e))},50)};a.kj=function(a){c.add("beforeRender",a)};a.kb=function(a){c.add("afterRender",a)};a.Cg=function(a){d.a.Tg(a)&&OBR.c.r(OBR.c.e.zb,function(b){OBR.scroll.eh(b)},this,a)};a.Ag=function(c){OBR.c.r(OBR.c.e.ma,d.a.na(),this);OBR.c.r(OBR.c.e.sb,function(){a.Pf(c)},this)};a.Pf=function(d){a.td(OBR.Sa.xg(d),d);OBR.Sa.h();c.l("afterRender",[d.g])};a.ta=function(c){d.d.log("HTML - render widget with "+c.Va());a.td(c.Va(),c);c.Z(!0)};a.L=function(){c.ba()};a.h(OBR);return a}();OBR.Ee=OBR.Ee||function(d){var a={},c=OBR,f={},b={},e="",g=null,h=null,k=null,l=!1,m=0,n="html",p=!1,q=4E3,r="nano",s=!1,u=!1,v={},t=0,w=new OBR.A;a.Ui=0;a.Ti=1E3;a.Ri=2;a.g=d;a.Ra="";a.ji=function(b,a){w.add("onInjectError_"+b.g,a)};a.Nf=function(b){w.l("onInjectError_"+b,[b],!0)};a.H={Qd:-1,Pd:-1,he:-1,Za:function(){var b=[];b.push(a.H.Qd);b.push(a.H.Pd);b.push(a.H.he);return b},qi:function(){a.H.Qd=(new Date).getTime()},pi:function(){a.H.Pd=(new Date).getTime()},si:function(){a.H.he=(new Date).getTime()}};
a.Kf={slow:7E3,normal:5E3,fast:3E3,qa:5};a.setData=function(c){c&&c.response&&(c=c.response,c.request&&(b=c.request),c.settings&&(f=c.settings),c.html&&(e=c.html),p=!0);a.We()};a.Qb=function(){return f};a.k=function(b,a){var e;e=f[b];return"undefined"!==typeof e&&null!==e?e:a};a.We=function(){a.wi()};a.kg=function(b){var a={};return b&&(b.response&&b.response.request)&&(a=b.response.request,b=a.tcr)?b:-1};a.o=function(a,e){var c=b[a];return c?c:e};a.Va=function(){return e};a.G=function(){return g};
a.Ai=function(b){g="string"===typeof b?b:"NA"};a.li=function(){n="japi"};a.Zf=function(){return n};a.mj=function(b){m=b};a.aj=function(){return m};a.da=function(){return h};a.te=function(b){h=b};a.ui=function(b){k=b};a.ng=function(){return k};a.Jg=function(){return l};a.hi=function(b){l="true"===b||!0===b};a.xd=function(){return"flyThrough"===a.k("displayMode","")};a.Fd=function(){return"video"===a.k("displayMode","")};a.fj=function(){return"recInIframe"===a.k("displayMode","")};a.Hg=function(){return p};
a.Ug=function(){return!0===a.k("isSkylandersInjectionEnabled",!1)};a.Wg=function(){return!0===a.k("isUIExperimentsEnabled",!1)};a.pg=function(){return r};a.Bi=function(b){"string"===typeof b&&(r=b.toLowerCase())};a.yi=function(b){"string"===typeof b&&""!==b&&(a.Ra=b)};a.Kg=function(){return!isNaN(parseInt(a.Ra,10))};a.Ca=function(){var b;b=parseInt(a.Ra,10);return a.Kg()&&"number"===typeof b&&0<=b&&10>b?OBR.a.Xf(h,b):a.Ra};a.W=function(){return s};a.Z=function(b){"boolean"===typeof b&&(s=b)};a.dj=
function(){return"hp"===r};a.s=function(){return v};a.ii=function(){var b={timeout:0,Ja:null,Hb:0,Mc:!1,lh:!1,ib:"",bb:!1,sc:!1,ic:!1,Pa:!1,Ge:"NA",reason:0,Wb:!0};"object"===typeof b&&(v=b)};a.Pg=function(){return u};a.nd=function(){return q};a.ki=function(b){q=a.Kf[b]||6E3};a.mi=function(b){"boolean"===typeof b&&(u=b)};a.wi=function(){var b=a.o("lsd",null),e=!0===a.o("oo",!1),g="string"===typeof b&&0<b.length,d=!0===a.k("isUseLocalStorageForUUID",!1);d&&!e&&g?c.a.vi(b):d||c.a.xf()};a.$f=function(){return 0===
t?a.g:1E3*t+a.g};a.Lh=function(b){"string"===typeof b?(OBR.a.w(OBR.a.q(a.g),"data-src",b),a.te(b),t=0):t+=1;a.Z(!1)};a.Pb=function(){return t};return a};
OBR.qb=OBR.qb||function(){var d=OBR,a={},c=new d.A;a.Sc=function(a,b,e,c,h,k,l,m,n){a=new d.Ee(a);a.te(b);a.Ai(e);a.hi(c);a.Bi(h);a.yi(k);a.ki(l);a.ui(m);"boolean"===typeof n&&a.mi(n);return a};a.Ve=function(f){var b=d.a.M(f,"data-src"),e=d.a.M(f,"data-widget-id"),g=d.a.M(f,"data-widget-type"),h=d.a.M(f,"data-timeout"),k=d.a.M(f,"data-fbk"),l=d.a.M(f,"data-ob-srcUrl"),m=d.a.M(f,"data-advance-loader"),n=d.a.M(f,"data-dynLoad");d.a.w(f,"data-dynLoad","");d.b.qe("true"===(m||"").toLowerCase());if("string"!==
typeof b)b=d.a.pd(!1);else if(0===b.length||0===b.indexOf("DROP")||0===b.indexOf("INSERT"))b=d.a.pd(!0);m=0===d.j.length&&d.b.Ha===b?1:d.j.length;b=a.Sc(m,b,e,n,g,k,h,l,!1);d.j[m]=b;0===m&&(e=d.a.createElement("div","ob_holder"),e.style.display="none",d.a.insertBefore(e,f),d.a.Vb());f.id=d.b.pb+m;c.l("onWidgetCreate",[b]);return b};a.uh=function(a){c.add("onWidgetCreate",a)};return a}();
OBR.rb=OBR.rb||function(){var d=OBR;return{Rb:function(a){var c,f,b;if(d.j)for(f=d.j.length,c=0;c<f;c+=1)if((b=d.j[c])&&b.G()===a)return b;return null}}}();OBR.Aa=OBR.Aa||function(){var d={},a=OBR,c={},f=new a.A;c.Bf=function(b){b.ii();""!==b.Ca()&&(b.ji(b,function(){d.vg(b.g)}),OBR.v.qh(b,function(){c.zi(b)}),OBR.i.$d(b.G(),d.ph))};c.zi=function(b){var a;a=b.s();a.timeout=b.nd();a.bb||(a.Ja=setTimeout(function(){c.hf(b)},a.timeout))};d.ph=function(b){var a=b.s();a.lh=!0;b.k("ispartialrecs",!1)&&(clearTimeout(a.Ja),a.reason=3,a.ic=!0,c.Nb(b))};d.nh=function(b,e){var g;b&&(b.settings&&!0===b.settings.ispartialrecs)&&(g=a.a.Wa(e),clearTimeout(g.s().Ja),
c.ge(g))};c.oh=function(b,e){b.s().ib=e;a.i.rh(b.g,d.nh)};a.qb.uh(c.Bf);a.i.vh(c.oh);d.Lc=function(b,e){var g,d,f;b&&b.response&&(g=b.response,OBR.d.log("Cdn response returned"),(d=c.rd(e))?(a.v.$e(d),f=d.s(),f.Xb=b,g.request&&(f.Ge=g.request.widgetJsId||"NA"),f.Mc=(new Date).getTime(),f.bb&&!f.Pa?(f.bb=!1,c.Sb(d)):f.sc&&!f.Pa?(f.sc=!1,c.Sb(d)):f.ic&&!f.Pa&&(f.ic=!1,c.Sb(d))):a.d.log("Editorial Widget : Widget not found"))};c.Sb=function(b){var a=b.s();a.Pa=!0;c.ge(b);d.Ke(b);clearTimeout(b.s().Ja);
a.reason=0;a.Wb=!0};c.rd=function(b){var e=a.j[b];return e?e:a.a.Wa(b)};c.sd=function(b){return(b=a.a.sd(b))?b:a.a.Wa("fbk")};c.hf=function(b){var a=b.s();b.W()||(a.reason=1,a.sc=!0,c.Nb(b))};c.ge=function(b){var e=b.s();b.W()&&!b.k("ispartialrecs",!1)?e.Wb=!1:(b.Pg()?a.i.gd(e.ib,b.g,e.Ge,e.Xb):(b.setData(e.Xb),OBR.i.ta(b.g)),b.Z(!0))};d.Ke=function(b){var e,c,d;c=b.s();a.a.Qg(b.Qb())&&b.setData(c.Xb);d=""!==b.da()?a.a.F(b.da()):window.location.href;e=b.k("irdfb","");""!==e&&(e+="&reason="+c.reason||
"",e=e+("&url="+d||"")+("&at="+(b.s().Mc-b.s().Hb)||""),e+="&to="+b.nd()||"",e+="&ir="+(c.Wb?1:0)||"",b=OBR.a.I(e,!1),OBR.a.N(b))};c.Nb=function(b){if(0===b.s().Hb){var e=c.Rf(b);c.Tb(e,b);a.d.log("CDN call: cdnCall")}};c.Rf=function(b){var e;e=a.b.gf;b=b.Ca()+"_"+b.G()+"_"+b.g;return e+b};d.vg=function(b){b=c.rd(b);var a;b&&(a=b.s(),clearTimeout(a.Ja),a.bb=!0,a.reason=2,c.Nb(b))};c.Tb=function(b,e){var c=a.a.I(b,!1);e.s().Hb=(new Date).getTime();a.a.N(c);a.d.log("fire this src "+b)};d.L=function(){f.ba()};
d.u=function(){return c};return d}();OBR.m=OBR.m||function(){var d={},a=OBR,c={height:0,width:0},f=300;d.Y=function(b){a=b};d.u=function(){var b={};b.aa=a;return b};d.qd=function(){return new OBR.vb({})};d.ve=function(){var b,a,g;g={height:0,width:0};b=void 0!==window.innerWidth;a=void 0!==document.documentElement&&void 0!==document.documentElement.clientWidth&&0!==document.documentElement.clientWidth;b?(g.height=window.innerHeight,g.width=window.innerWidth):a?(g.height=document.documentElement.clientHeight,g.width=document.documentElement.clientWidth):
!1===b&&!1===a&&(g.height=document.getElementsByTagName("body")[0].clientHeight,g.width=document.getElementsByTagName("body")[0].clientWidth);c=g};d.ia=function(){return c};d.re=function(){document&&document.body&&(f=Math.max(Math.max(document.body.scrollHeight,document.documentElement.scrollHeight),Math.max(document.body.offsetHeight,document.documentElement.offsetHeight),Math.max(document.body.clientHeight,document.documentElement.clientHeight)))};d.ld=function(){return f};d.Ua=function(b){var a=
0;if(!b)return d.X.yc;try{if(b.offsetParent)for(;;){a+=b.offsetTop;if(!b.offsetParent)break;b=b.offsetParent}else b.y&&(a+=b.y)}catch(c){return d.X.yc}return parseInt(a,10)};d.Ea=function(){return document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop};d.yd=function(){return OBR.m.ia().height+10>=OBR.m.ld()};OBR.a.n(window,"resize",function(){d.ve();d.re()});d.ve();d.re();return d}();
OBR.vb=OBR.vb||function(d){var a,c={X:{Fc:3,xc:5,tb:60,yc:1E4},O:{Dc:0,wa:1,Ac:2,Cc:3}};if(d)for(a in d)d.hasOwnProperty(a)&&(c.X[a]=d[a]);c.Ib=function(a){function b(b,a){return e.top-b<=g.height&&0<=e.bottom+a}var e=a.getBoundingClientRect(),g=OBR.m.ia(),d=c.X.Fc,k=c.X.xc,l=c.X.tb;a=a.clientHeight;var m=c.O.Dc;b(0,0)?m=c.O.wa:b(d+a/2,k+a/2)?m=c.O.Ac:b(l,l)&&(m=c.O.Cc);return m};c.Oc=function(a){var b,e,g,d,k;b=a.getBoundingClientRect();e=OBR.m.Ua(a);k=OBR.m.ia();g=k.height+OBR.m.Ea();d=c.O.Dc;b=
0<=b.top&&0<=b.left&&b.bottom<=k.height&&b.right<=k.width;a=e-c.X.Fc<=g&&e+a.clientHeight-c.X.xc>=g;e=e-c.X.tb<=g&&e>g;b?d=c.O.wa:a?d=c.O.Ac:e&&(d=c.O.Cc);return d};return c};OBR.c.C(OBR.c.e.ma);OBR.Ec=OBR.Ec||function(){var d={},a={},c,f=(new Date).getTime(),b,e;a.h=function(g){c=g;d.jc=!1;d.la=[];d.ka=new c.vb({tb:0});d.V=!1;d.Gb=new c.bd;d.vd=!1;a.Zc={Ih:0,Df:3};e=d.ka.O.wa;b=c.b.hc+"loggerServices/widgetEvent?"};a.start=function(){c.i.ae(d.Uc);d.Kb();d.Uc();c.a.n(window,"scroll",d.Gd)};d.Uc=function(){var b=0,a,e=!1;b;for(a=c.j.length;b<a;b+=1)void 0===d.la[b]&&c.j[b].W()&&(d.la[b]={ca:c.a.q(b),pe:!1},e=!0);d.Of();e&&d.Gd()};d.Of=function(){var b=0,a;b;for(a=c.j.length;b<a;b+=1)void 0!==
d.la[b]&&(d.la[b]&&!1===d.la[b].pe&&c.j[b].W())&&(d.ai(b),d.la[b].pe=!0)};a.Zh=function(){var b,c,f=d.la,l=f.length||0;for(b=0;b<l;b+=1)if(void 0!==f[b]&&(f[b]&&f[b].ca)&&(c=d.ka.Ib(f[b].ca),c===e)){c=d.Tc(b,a.Zc.Df,e);d.ke(c);f[b]=null;break}};d.ai=function(b){var e=d.ka.Ib(c.a.q(b));b=d.Tc(b,a.Zc.Ih,e);d.ke(b)};d.ke=function(b){d.Gb.add(b);d.vd&&d.ed()};d.ed=function(){var b=c.a.Da(),a;for(b||(b=c.a.Mb());!d.Gb.Lg();)a=d.Gb.top(),a+="&ab="+d.V,a=c.a.I(a,!0),c.a.R(a,b)};d.Tc=function(a,e,d){var l=
c.j[a],m=[];m.push(b);m.push("tm=");m.push((new Date).getTime()-f);m.push("&eT="+e);m.push("&eVP="+d);m.push("&did="+l.o("did",-1));m.push("&rId="+l.o("req_id",-1));m.push("&sid="+l.o("sid",-1));m.push("&wnid="+l.o("wnid",-1));m.push("&pid="+l.o("pid",-1));m.push("&wId="+l.o("widgetJsId","null"));m.push("&wRV="+c.b.va);m.push("&eY="+c.m.Ua(c.a.q(a)));m.push("&ty="+Math.floor(c.m.Ea()));m.push("&viH="+c.m.ia().height);return m.join("")};d.Kb=function(){var b,a;!0!==d.V&&(b=c.a.createElement("IFRAME",
"ob_ad","height:1px;width:-1px;left:-1000px;top:-1000px;display:block;border:none"),a=c.a.createElement("IMG","ob_ads","height:1px;width:-1px;left:-1000px;top:-1000px;display:block;border:none"),a.src=c.b.K+"/nanoWidget/images/adImages/ads-check.gif",b.className="item-container-ad",document.body.appendChild(b),document.body.appendChild(a),setTimeout(function(){if(a&&-1<a.style.display.indexOf("none")||b&&("hidden"===b.style.visibility||0===b.clientHeight))d.V=!0;b&&b.parentNode&&b.parentNode.removeChild(b);
a&&a.parentNode&&a.parentNode.removeChild(a);d.vd=!0;d.ed()},300))};d.Gd=function(){!0!==d.jc&&(a.Zh(),setTimeout(function(){d.jc=!1},150),d.jc=!0)};a.h(OBR);return a}();OBR.c.C(OBR.c.e.Cb);OBR.Yc=OBR.Yc||function(){var d={},a={},c=OBR;d.Y=function(a){c=a};a.bh=function(c,b){var e=c.style;e.fontSize=a.Q(b,"font-size");e.fontWeight=a.Q(b,"font-weight");e.fontFamily=a.Q(b,"font-family");e.lineHeight=a.Q(b,"line-height");var d=a.Q(b,"padding-right").replace("px",""),h=a.Q(b,"padding-left").replace("px","");e.display="block";e.visibility="hidden";e.width=b.clientWidth-h-d+"px"};a.Ta=function(a){return a.innerText||a.textContent};a.Ce=function(c,b){for(var e=a.Ta(c),d=!1;0<b&&c.offsetHeight>
b&&0<e.length;)e=e.substring(0,e.length-1),c.innerHTML=e,d=!0;a.Qh(c,d);c.offsetHeight>b&&a.Ce(c,b)};a.indexOf=function(a,b){a.indexOf||"indexOf"in Array.prototype||(Array.prototype.indexOf=function(b,a){void 0===a&&(a=0);0>a&&(a+=this.length);0>a&&(a=0);for(var c=this.length;a<c;a++)if(a in this&&this[a]===b)return a;return-1});return a.indexOf(b)};a.Cf=function(c){var b=!1;-1<a.indexOf(".,-_' ".split(""),c.substring(c.length-1,c.length))&&(b=!0);return b};a.Q=function(a,b){var e="";document.defaultView&&
document.defaultView.getComputedStyle?e=document.defaultView.getComputedStyle(a,"").getPropertyValue(b):a.currentStyle&&(b=b.replace(/\-(\w)/g,function(b,a){return a.toUpperCase()}),e=a.currentStyle[b]);return e};a.Qh=function(c,b){if(b){var e=a.Ta(c),e=0<e.lastIndexOf(" ")?e.substring(0,e.lastIndexOf(" ")):e.substring(0,e.length-3);a.Cf(e)&&(e=e.substring(0,e.length-1));c.innerHTML=e+"&hellip;"}};a.sf=function(){var a=document.createElement("div");a.style.position="absolute";a.style.top="-1000px";
a.style.left="-1000px";document.body.appendChild(a);return a};a.Li=function(d){function b(){for(var b=0;b<e.length;b++){var c=e[b];c.title=a.Ta(c);var d=c.clientHeight,f=parseInt(a.Q(c,"max-height").replace("px",""));if(!(d<f)){var d=c.cloneNode(!0),m=a.sf();a.bh(d,c);m.appendChild(d);a.Ce(d,f);c.innerHTML=a.Ta(d);m.parentNode.removeChild(m)}}}var e=c.a.getElementsByClassName("ob-rec-text",d);0===c.a.getElementsByClassName("ob-touch-strip-layout",d).length?b():setTimeout(b,1E3)};a.zf=function(a){var b=
!1;a=c.a.getElementsByClassName("ob-widget",a);0<a.length&&(a=a[0],a.attributes["data-dynamic-truncate"]&&"true"===a.attributes["data-dynamic-truncate"].value&&(b=!0));return b};d.rg=function(d){(d=c.a.q(d))&&a.zf(d)&&a.Li(d)};return d}();OBR.extern=OBR.extern||function(){var d=OBR;return{getStat:function(){d.D.je()},showDescription:function(a,c){d.c.r(OBR.c.e.ub,function(){OBR.Ud.Zg(a,c)},this)},returnedHtmlData:function(a,c){d.i.fc(a,c)},returnedIrdData:function(a,c){d.Aa.Lc(a,c)},returnedJsonData:function(a,c){d.i.Od(a,c)},returnedError:function(a){OBR.d.log("Call made using extern class");d.d.log("Callback error"+a)},callRecs:function(a,c){OBR.d.log("Call made using extern class");d.i.Kd(a,c)},callClick:function(a,c){OBR.d.log("Call made using extern class");
d.i.Zb(a,c)},callWhatIs:function(a,c,d,b,e,g){OBR.c.r(OBR.c.e.Na,function(){OBR.wc.Kc(a,c,d,b,e,g)},this);return!1},recClicked:function(a,c){OBR.d.log("Call made using extern class");d.i.Wd(a,c)},imageError:function(a){OBR.d.log("Call made using extern class");d.a.Pc(a)},showRecInIframe:function(a,c,f,b,e){d.c.r(d.c.e.wb,function(){d.Xd.Ci(a,c,f,b,e)},this)},errorInjectionHandler:function(a){OBR.j[a].Nf(a)},reloadWidget:function(){OBR.d.log("reload widget");d.i.Oh()},researchWidget:function(){OBR.d.log("research widget");
d.i.nc()},cancelRecommendation:function(a){OBR.d.log("cancel recommendation with bocr "+a);d.i.df(a)},cancelRecs:function(a,c,f){OBR.d.log("cancel recommendation by doc url "+a+" publisher id = "+c+" isAd = "+f);d.i.ef(a,c,f)},refreshWidget:function(a){OBR.d.log("refresh widget");d.i.sa(a)},refreshSpecificWidget:function(a,c){OBR.d.log("refresh SPECIFIC widget");"string"!=typeof c?d.c.r(d.c.e.xb,function(){OBR.i.Yd(a,c)},this):OBR.i.Yd(a,c)},getCountOfRecs:function(a){return d.i.Tf(a)},onOdbReturn:function(a,
c){d.i.$d(a,c)},closeCard:function(){d.Sa.qf()},closeModal:function(){try{d.modal.hideModal()}catch(a){}},scrollLoad:function(){try{OBR.c.C(OBR.c.e.Ab)}catch(a){}},callLoadMore:function(a){OBR.c.r(OBR.c.e.Ma,function(){OBR.Yb.Ub(a)},this)}}}();window.outbrain=window.outbrain||{};window.outbrain.returnedHtmlData=function(d,a){OBR.i.fc(d,a)};window.outbrain.returnedIrdJsonData=function(d,a){OBR.Aa.Lc(d,a)};window.outbrain.returnedJsonData=function(d,a){OBR.i.Od(d,a)};
window.outbrain.returnedError=function(d){OBR.d.log("Callback error"+d)};window.outbrain.callRecs=function(d,a){OBR.i.Kd(d,a)};window.outbrain.callClick=function(d,a){OBR.i.Zb(d,a)};window.outbrain.callWhatIs=function(d,a,c,f,b,e){OBR.c.r(OBR.c.e.Na,function(){OBR.wc.Kc(d,a,c,f,b,e)},this)};window.outbrain.callLoadMore=function(d){OBR.c.r(OBR.c.e.Ma,function(){OBR.Yb.Ub(d)},this)};window.outbrain.recClicked=function(d,a){OBR.i.Wd(d,a)};window.outbrain.imageError=function(d){OBR.a.Pc(d)};
window.outbrain.closeModal=function(){try{OBR.modal.hideModal()}catch(d){}};window.outbrain_rater=window.outbrain_rater||{};window.outbrain_rater.returnedHtmlData=function(d,a){OBR.i.fc(d,a)};window.outbrain_rater.returnedCancelOdbData=function(d){OBR.i.Uh(d)};!0===OBR.b.wd&&(OBR.d.log("Widget Start!"),OBR.b.wd=!1,"boolean"===typeof window.OB_PASSIVE_MODE&&!0===window.OB_PASSIVE_MODE?OBR.d.log("passive"):OBR.i.ie());})(window.OBR);
;
/*1413086564,,JIT Construction: v1450716,en_US*/

/**
 * Copyright Facebook Inc.
 *
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 */
try {window.FB || (function(window) {
var self = window, document = window.document;
var setTimeout = window.setTimeout, setInterval = window.setInterval,clearTimeout = window.clearTimeout,clearInterval = window.clearInterval;var __DEV__ = 0;
function emptyFunction() {};
var __w, __t;
__t=function(a){return a[0];};__w=function(a){return a;};
var require,__d;(function(a){var b={},c={},d=['global','require','requireDynamic','requireLazy','module','exports'];require=function(e,f){if(c.hasOwnProperty(e))return c[e];if(!b.hasOwnProperty(e)){if(f)return null;throw new Error('Module '+e+' has not been defined');}var g=b[e],h=g.deps,i=g.factory.length,j,k=[];for(var l=0;l<i;l++){switch(h[l]){case 'module':j=g;break;case 'exports':j=g.exports;break;case 'global':j=a;break;case 'require':j=require;break;case 'requireDynamic':j=require;break;case 'requireLazy':j=null;break;default:j=require.call(null,h[l]);}k.push(j);}g.factory.apply(a,k);c[e]=g.exports;return g.exports;};__d=function(e,f,g,h){if(typeof g=='function'){b[e]={factory:g,deps:d.concat(f),exports:{}};if(h===3)require.call(null,e);}else c[e]=g;};})(this);
__d("ES5ArrayPrototype",[],function(a,b,c,d,e,f){var g={};g.map=function(h,i){if(typeof h!='function')throw new TypeError();var j,k=this.length,l=new Array(k);for(j=0;j<k;++j)if(j in this)l[j]=h.call(i,this[j],j,this);return l;};g.forEach=function(h,i){g.map.call(this,h,i);};g.filter=function(h,i){if(typeof h!='function')throw new TypeError();var j,k,l=this.length,m=[];for(j=0;j<l;++j)if(j in this){k=this[j];if(h.call(i,k,j,this))m.push(k);}return m;};g.every=function(h,i){if(typeof h!='function')throw new TypeError();var j=new Object(this),k=j.length;for(var l=0;l<k;l++)if(l in j)if(!h.call(i,j[l],l,j))return false;return true;};g.some=function(h,i){if(typeof h!='function')throw new TypeError();var j=new Object(this),k=j.length;for(var l=0;l<k;l++)if(l in j)if(h.call(i,j[l],l,j))return true;return false;};g.indexOf=function(h,i){var j=this.length;i|=0;if(i<0)i+=j;for(;i<j;i++)if(i in this&&this[i]===h)return i;return -1;};e.exports=g;},null);
__d("ES5FunctionPrototype",[],function(a,b,c,d,e,f){var g={};g.bind=function(h){if(typeof this!='function')throw new TypeError('Bind must be called on a function');var i=this,j=Array.prototype.slice.call(arguments,1);function k(){return i.apply(h,j.concat(Array.prototype.slice.call(arguments)));}k.displayName='bound:'+(i.displayName||i.name||'(?)');k.toString=function l(){return 'bound: '+i;};return k;};e.exports=g;},null);
__d("ES5StringPrototype",[],function(a,b,c,d,e,f){var g={};g.trim=function(){if(this==null)throw new TypeError('String.prototype.trim called on null or undefined');return String.prototype.replace.call(this,/^\s+|\s+$/g,'');};g.startsWith=function(h){var i=String(this);if(this==null)throw new TypeError('String.prototype.startsWith called on null or undefined');var j=arguments.length>1?Number(arguments[1]):0;if(isNaN(j))j=0;var k=Math.min(Math.max(j,0),i.length);return i.indexOf(String(h),j)==k;};g.endsWith=function(h){var i=String(this);if(this==null)throw new TypeError('String.prototype.endsWith called on null or undefined');var j=i.length,k=String(h),l=arguments.length>1?Number(arguments[1]):j;if(isNaN(l))l=0;var m=Math.min(Math.max(l,0),j),n=m-k.length;if(n<0)return false;return i.lastIndexOf(k,n)==n;};g.contains=function(h){if(this==null)throw new TypeError('String.prototype.contains called on null or undefined');var i=String(this),j=arguments.length>1?Number(arguments[1]):0;if(isNaN(j))j=0;return i.indexOf(String(h),j)!=-1;};g.repeat=function(h){if(this==null)throw new TypeError('String.prototype.repeat called on null or undefined');var i=String(this),j=h?Number(h):0;if(isNaN(j))j=0;if(j<0||j===Infinity)throw RangeError();if(j===1)return i;if(j===0)return '';var k='';while(j){if(j&1)k+=i;if((j>>=1))i+=i;}return k;};e.exports=g;},null);
__d("ES5Array",[],function(a,b,c,d,e,f){var g={};g.isArray=function(h){return Object.prototype.toString.call(h)=='[object Array]';};e.exports=g;},null);
__d("ie8DontEnum",[],function(a,b,c,d,e,f){var g=['toString','toLocaleString','valueOf','hasOwnProperty','isPrototypeOf','prototypeIsEnumerable','constructor'],h=({}).hasOwnProperty,i=function(){};if(({toString:true}).propertyIsEnumerable('toString'))i=function(j,k){for(var l=0;l<g.length;l++){var m=g[l];if(h.call(j,m))k(m);}};e.exports=i;},null);
__d("ES5Object",["ie8DontEnum"],function(a,b,c,d,e,f,g){var h=({}).hasOwnProperty,i={};function j(){}i.create=function(k){var l=typeof k;if(l!='object'&&l!='function')throw new TypeError('Object prototype may only be a Object or null');j.prototype=k;return new j();};i.keys=function(k){var l=typeof k;if(l!='object'&&l!='function'||k===null)throw new TypeError('Object.keys called on non-object');var m=[];for(var n in k)if(h.call(k,n))m.push(n);g(k,function(o){return m.push(o);});return m;};e.exports=i;},null);
__d("ES5Date",[],function(a,b,c,d,e,f){var g={};g.now=function(){return new Date().getTime();};e.exports=g;},null);
/**
 * @providesModule JSON3
 * @preserve-header
 *
 *! JSON v3.2.3 | http://bestiejs.github.com/json3 | Copyright 2012, Kit Cambridge | http://kit.mit-license.org
 */__d("JSON3",[],function(a,b,c,d,e,f){(function(){var g={}.toString,h,i,j,k=e.exports={},l='{"A":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}',m,n,o,p,q,r,s,t,u,v,w,x,y,z,aa,ba=new Date(-3509827334573292),ca,da,ea;try{ba=ba.getUTCFullYear()==-109252&&ba.getUTCMonth()===0&&ba.getUTCDate()==1&&ba.getUTCHours()==10&&ba.getUTCMinutes()==37&&ba.getUTCSeconds()==6&&ba.getUTCMilliseconds()==708;}catch(fa){}if(!ba){ca=Math.floor;da=[0,31,59,90,120,151,181,212,243,273,304,334];ea=function(ga,ha){return da[ha]+365*(ga-1970)+ca((ga-1969+(ha=+(ha>1)))/4)-ca((ga-1901+ha)/100)+ca((ga-1601+ha)/400);};}if(typeof JSON=="object"&&JSON){k.stringify=JSON.stringify;k.parse=JSON.parse;}if((m=typeof k.stringify=="function"&&!ea)){(ba=function(){return 1;}).toJSON=ba;try{m=k.stringify(0)==="0"&&k.stringify(new Number())==="0"&&k.stringify(new String())=='""'&&k.stringify(g)===j&&k.stringify(j)===j&&k.stringify()===j&&k.stringify(ba)==="1"&&k.stringify([ba])=="[1]"&&k.stringify([j])=="[null]"&&k.stringify(null)=="null"&&k.stringify([j,g,null])=="[null,null,null]"&&k.stringify({result:[ba,true,false,null,"\0\b\n\f\r\t"]})==l&&k.stringify(null,ba)==="1"&&k.stringify([1,2],null,1)=="[\n 1,\n 2\n]"&&k.stringify(new Date(-8.64e+15))=='"-271821-04-20T00:00:00.000Z"'&&k.stringify(new Date(8.64e+15))=='"+275760-09-13T00:00:00.000Z"'&&k.stringify(new Date(-62198755200000))=='"-000001-01-01T00:00:00.000Z"'&&k.stringify(new Date(-1))=='"1969-12-31T23:59:59.999Z"';}catch(fa){m=false;}}if(typeof k.parse=="function")try{if(k.parse("0")===0&&!k.parse(false)){ba=k.parse(l);if((r=ba.A.length==5&&ba.A[0]==1)){try{r=!k.parse('"\t"');}catch(fa){}if(r)try{r=k.parse("01")!=1;}catch(fa){}}}}catch(fa){r=false;}ba=l=null;if(!m||!r){if(!(h={}.hasOwnProperty))h=function(ga){var ha={},ia;if((ha.__proto__=null,ha.__proto__={toString:1},ha).toString!=g){h=function(ja){var ka=this.__proto__,la=ja in (this.__proto__=null,this);this.__proto__=ka;return la;};}else{ia=ha.constructor;h=function(ja){var ka=(this.constructor||ia).prototype;return ja in this&&!(ja in ka&&this[ja]===ka[ja]);};}ha=null;return h.call(this,ga);};i=function(ga,ha){var ia=0,ja,ka,la,ma;(ja=function(){this.valueOf=0;}).prototype.valueOf=0;ka=new ja();for(la in ka)if(h.call(ka,la))ia++;ja=ka=null;if(!ia){ka=["valueOf","toString","toLocaleString","propertyIsEnumerable","isPrototypeOf","hasOwnProperty","constructor"];ma=function(na,oa){var pa=g.call(na)=="[object Function]",qa,ra;for(qa in na)if(!(pa&&qa=="prototype")&&h.call(na,qa))oa(qa);for(ra=ka.length;qa=ka[--ra];h.call(na,qa)&&oa(qa));};}else if(ia==2){ma=function(na,oa){var pa={},qa=g.call(na)=="[object Function]",ra;for(ra in na)if(!(qa&&ra=="prototype")&&!h.call(pa,ra)&&(pa[ra]=1)&&h.call(na,ra))oa(ra);};}else ma=function(na,oa){var pa=g.call(na)=="[object Function]",qa,ra;for(qa in na)if(!(pa&&qa=="prototype")&&h.call(na,qa)&&!(ra=qa==="constructor"))oa(qa);if(ra||h.call(na,(qa="constructor")))oa(qa);};return ma(ga,ha);};if(!m){n={"\\":"\\\\",'"':'\\"',"\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};o=function(ga,ha){return ("000000"+(ha||0)).slice(-ga);};p=function(ga){var ha='"',ia=0,ja;for(;ja=ga.charAt(ia);ia++)ha+='\\"\b\f\n\r\t'.indexOf(ja)>-1?n[ja]:ja<" "?"\\u00"+o(2,ja.charCodeAt(0).toString(16)):ja;return ha+'"';};q=function(ga,ha,ia,ja,ka,la,ma){var na=ha[ga],oa,pa,qa,ra,sa,ta,ua,va,wa,xa,ya,za,ab,bb,cb;if(typeof na=="object"&&na){oa=g.call(na);if(oa=="[object Date]"&&!h.call(na,"toJSON")){if(na>-1/0&&na<1/0){if(ea){ra=ca(na/86400000);for(pa=ca(ra/365.2425)+1970-1;ea(pa+1,0)<=ra;pa++);for(qa=ca((ra-ea(pa,0))/30.42);ea(pa,qa+1)<=ra;qa++);ra=1+ra-ea(pa,qa);sa=(na%86400000+86400000)%86400000;ta=ca(sa/3600000)%24;ua=ca(sa/60000)%60;va=ca(sa/1000)%60;wa=sa%1000;}else{pa=na.getUTCFullYear();qa=na.getUTCMonth();ra=na.getUTCDate();ta=na.getUTCHours();ua=na.getUTCMinutes();va=na.getUTCSeconds();wa=na.getUTCMilliseconds();}na=(pa<=0||pa>=10000?(pa<0?"-":"+")+o(6,pa<0?-pa:pa):o(4,pa))+"-"+o(2,qa+1)+"-"+o(2,ra)+"T"+o(2,ta)+":"+o(2,ua)+":"+o(2,va)+"."+o(3,wa)+"Z";}else na=null;}else if(typeof na.toJSON=="function"&&((oa!="[object Number]"&&oa!="[object String]"&&oa!="[object Array]")||h.call(na,"toJSON")))na=na.toJSON(ga);}if(ia)na=ia.call(ha,ga,na);if(na===null)return "null";oa=g.call(na);if(oa=="[object Boolean]"){return ""+na;}else if(oa=="[object Number]"){return na>-1/0&&na<1/0?""+na:"null";}else if(oa=="[object String]")return p(na);if(typeof na=="object"){for(ab=ma.length;ab--;)if(ma[ab]===na)throw TypeError();ma.push(na);xa=[];bb=la;la+=ka;if(oa=="[object Array]"){for(za=0,ab=na.length;za<ab;cb||(cb=true),za++){ya=q(za,na,ia,ja,ka,la,ma);xa.push(ya===j?"null":ya);}return cb?(ka?"[\n"+la+xa.join(",\n"+la)+"\n"+bb+"]":("["+xa.join(",")+"]")):"[]";}else{i(ja||na,function(db){var eb=q(db,na,ia,ja,ka,la,ma);if(eb!==j)xa.push(p(db)+":"+(ka?" ":"")+eb);cb||(cb=true);});return cb?(ka?"{\n"+la+xa.join(",\n"+la)+"\n"+bb+"}":("{"+xa.join(",")+"}")):"{}";}ma.pop();}};k.stringify=function(ga,ha,ia){var ja,ka,la,ma,na,oa;if(typeof ha=="function"||typeof ha=="object"&&ha)if(g.call(ha)=="[object Function]"){ka=ha;}else if(g.call(ha)=="[object Array]"){la={};for(ma=0,na=ha.length;ma<na;oa=ha[ma++],((g.call(oa)=="[object String]"||g.call(oa)=="[object Number]")&&(la[oa]=1)));}if(ia)if(g.call(ia)=="[object Number]"){if((ia-=ia%1)>0)for(ja="",ia>10&&(ia=10);ja.length<ia;ja+=" ");}else if(g.call(ia)=="[object String]")ja=ia.length<=10?ia:ia.slice(0,10);return q("",(oa={},oa[""]=ga,oa),ka,la,ja,"",[]);};}if(!r){s=String.fromCharCode;t={"\\":"\\",'"':'"',"/":"/",b:"\b",t:"\t",n:"\n",f:"\f",r:"\r"};u=function(){z=aa=null;throw SyntaxError();};v=function(){var ga=aa,ha=ga.length,ia,ja,ka,la,ma;while(z<ha){ia=ga.charAt(z);if("\t\r\n ".indexOf(ia)>-1){z++;}else if("{}[]:,".indexOf(ia)>-1){z++;return ia;}else if(ia=='"'){for(ja="@",z++;z<ha;){ia=ga.charAt(z);if(ia<" "){u();}else if(ia=="\\"){ia=ga.charAt(++z);if('\\"/btnfr'.indexOf(ia)>-1){ja+=t[ia];z++;}else if(ia=="u"){ka=++z;for(la=z+4;z<la;z++){ia=ga.charAt(z);if(!(ia>="0"&&ia<="9"||ia>="a"&&ia<="f"||ia>="A"&&ia<="F"))u();}ja+=s("0x"+ga.slice(ka,z));}else u();}else{if(ia=='"')break;ja+=ia;z++;}}if(ga.charAt(z)=='"'){z++;return ja;}u();}else{ka=z;if(ia=="-"){ma=true;ia=ga.charAt(++z);}if(ia>="0"&&ia<="9"){if(ia=="0"&&(ia=ga.charAt(z+1),ia>="0"&&ia<="9"))u();ma=false;for(;z<ha&&(ia=ga.charAt(z),ia>="0"&&ia<="9");z++);if(ga.charAt(z)=="."){la=++z;for(;la<ha&&(ia=ga.charAt(la),ia>="0"&&ia<="9");la++);if(la==z)u();z=la;}ia=ga.charAt(z);if(ia=="e"||ia=="E"){ia=ga.charAt(++z);if(ia=="+"||ia=="-")z++;for(la=z;la<ha&&(ia=ga.charAt(la),ia>="0"&&ia<="9");la++);if(la==z)u();z=la;}return +ga.slice(ka,z);}if(ma)u();if(ga.slice(z,z+4)=="true"){z+=4;return true;}else if(ga.slice(z,z+5)=="false"){z+=5;return false;}else if(ga.slice(z,z+4)=="null"){z+=4;return null;}u();}}return "$";};w=function(ga){var ha,ia,ja;if(ga=="$")u();if(typeof ga=="string"){if(ga.charAt(0)=="@")return ga.slice(1);if(ga=="["){ha=[];for(;;ia||(ia=true)){ga=v();if(ga=="]")break;if(ia)if(ga==","){ga=v();if(ga=="]")u();}else u();if(ga==",")u();ha.push(w(ga));}return ha;}else if(ga=="{"){ha={};for(;;ia||(ia=true)){ga=v();if(ga=="}")break;if(ia)if(ga==","){ga=v();if(ga=="}")u();}else u();if(ga==","||typeof ga!="string"||ga.charAt(0)!="@"||v()!=":")u();ha[ga.slice(1)]=w(v());}return ha;}u();}return ga;};y=function(ga,ha,ia){var ja=x(ga,ha,ia);if(ja===j){delete ga[ha];}else ga[ha]=ja;};x=function(ga,ha,ia){var ja=ga[ha],ka;if(typeof ja=="object"&&ja)if(g.call(ja)=="[object Array]"){for(ka=ja.length;ka--;)y(ja,ka,ia);}else i(ja,function(la){y(ja,la,ia);});return ia.call(ga,ha,ja);};k.parse=function(ga,ha){z=0;aa=ga;var ia=w(v());if(v()!="$")u();z=aa=null;return ha&&g.call(ha)=="[object Function]"?x((ba={},ba[""]=ia,ba),"",ha):ia;};}}}).call(this);},null);
__d("ES6Object",["ie8DontEnum"],function(a,b,c,d,e,f,g){var h=({}).hasOwnProperty,i={assign:function(j){var k=Array.prototype.slice.call(arguments,1);if(j==null)throw new TypeError('Object.assign target cannot be null or undefined');j=Object(j);for(var l=0;l<k.length;l++){var m=k[l];if(m==null)continue;m=Object(m);for(var n in m)if(h.call(m,n))j[n]=m[n];g(m,function(o){return j[o]=m[o];});}return j;}};e.exports=i;},null);
__d("ES6ArrayPrototype",[],function(a,b,c,d,e,f){var g={find:function(h,i){if(this==null)throw new TypeError('Array.prototype.find called on null or undefined');if(typeof h!=='function')throw new TypeError('predicate must be a function');var j=g.findIndex.call(this,h,i);return j===-1?void 0:this[j];},findIndex:function(h,i){if(this==null)throw new TypeError('Array.prototype.findIndex called on null or undefined');if(typeof h!=='function')throw new TypeError('predicate must be a function');var j=Object(this),k=j.length>>>0;for(var l=0;l<k;l++)if(l in j)if(h.call(i,j[l],l,j))return l;return -1;}};e.exports=g;},null);
__d("ES6DatePrototype",[],function(a,b,c,d,e,f){function g(i){return (i<10?'0':'')+i;}var h={toISOString:function(){if(!isFinite(this))throw new Error('Invalid time value');var i=this.getUTCFullYear();i=(i<0?'-':(i>9999?'+':''))+('00000'+Math.abs(i)).slice(0<=i&&i<=9999?-4:-6);return i+'-'+g(this.getUTCMonth()+1)+'-'+g(this.getUTCDate())+'T'+g(this.getUTCHours())+':'+g(this.getUTCMinutes())+':'+g(this.getUTCSeconds())+'.'+(this.getUTCMilliseconds()/1000).toFixed(3).slice(2,5)+'Z';}};e.exports=h;},null);
__d("ES6Number",[],function(a,b,c,d,e,f){var g={isFinite:function(h){return (typeof h=='number')&&isFinite(h);},isNaN:function(h){return (typeof h=='number')&&isNaN(h);}};e.exports=g;},null);
__d("ES",["ES5ArrayPrototype","ES5FunctionPrototype","ES5StringPrototype","ES5Array","ES5Object","ES5Date","JSON3","ES6Object","ES6ArrayPrototype","ES6DatePrototype","ES6Number"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q){var r=({}).toString,s={'JSON.stringify':m.stringify,'JSON.parse':m.parse},t={'Array.prototype':g,'Function.prototype':h,'String.prototype':i,Object:k,Array:j,Date:l},u={Object:n,'Array.prototype':o,'Date.prototype':p,Number:q};function v(x){for(var y in x){if(!x.hasOwnProperty(y))continue;var z=x[y],aa=y.split('.'),ba=aa.length==2?window[aa[0]][aa[1]]:window[y];for(var ca in z){if(!z.hasOwnProperty(ca))continue;var da=ba[ca];s[y+'.'+ca]=da&&/\{\s+\[native code\]\s\}/.test(da)?da:z[ca];}}}v(t);v(u);function w(x,y,z){var aa=Array.prototype.slice.call(arguments,3),ba=z?r.call(x).slice(8,-1)+'.prototype':x,ca=s[ba+'.'+y]||x[y];if(typeof ca==='function')return ca.apply(x,aa);}e.exports=w;},null);
var ES = require('ES');
__d("JSSDKRuntimeConfig",[],{"locale":"en_US","rtl":false,"revision":"1450716"});__d("JSSDKConfig",[],{"bustCache":true,"tagCountLogRate":0.01,"errorHandling":{"rate":4},"usePluginPipe":true,"features":{"allow_non_canvas_app_events":false,"event_subscriptions_log":{"rate":0.01,"value":10000},"kill_fragment":true,"xfbml_profile_pic_server":true,"error_handling":{"rate":4},"e2e_ping_tracking":{"rate":1.0e-6},"xd_timeout":{"rate":4,"value":30000},"use_bundle":true,"launch_payment_dialog_via_pac":{"rate":100}},"api":{"mode":"warn","whitelist":["Canvas","Canvas.Prefetcher","Canvas.Prefetcher.addStaticResource","Canvas.Prefetcher.setCollectionMode","Canvas.getPageInfo","Canvas.hideFlashElement","Canvas.scrollTo","Canvas.setAutoGrow","Canvas.setDoneLoading","Canvas.setSize","Canvas.setUrlHandler","Canvas.showFlashElement","Canvas.startTimer","Canvas.stopTimer","Data","Data.process","Data.query","Data.query:wait","Data.waitOn","Data.waitOn:wait","Event","Event.subscribe","Event.unsubscribe","Music.flashCallback","Music.init","Music.send","Payment","Payment.cancelFlow","Payment.continueFlow","Payment.init","Payment.lockForProcessing","Payment.unlockForProcessing","Payment.parse","Payment.setSize","ThirdPartyProvider","ThirdPartyProvider.init","ThirdPartyProvider.sendData","UA","UA.nativeApp","XFBML","XFBML.RecommendationsBar","XFBML.RecommendationsBar.markRead","XFBML.parse","addFriend","api","getAccessToken","getAuthResponse","getLoginStatus","getUserID","init","login","logout","publish","share","ui","ui:subscribe","AppEvents","AppEvents.activateApp","AppEvents.logEvent","AppEvents.logPurchase","AppEvents.EventNames","AppEvents.ParameterNames"]},"initSitevars":{"enableMobileComments":1,"iframePermissions":{"read_stream":false,"manage_mailbox":false,"manage_friendlists":false,"read_mailbox":false,"publish_checkins":true,"status_update":true,"photo_upload":true,"video_upload":true,"sms":false,"create_event":true,"rsvp_event":true,"offline_access":true,"email":true,"xmpp_login":false,"create_note":true,"share_item":true,"export_stream":false,"publish_stream":true,"publish_likes":true,"ads_management":false,"contact_email":true,"access_private_data":false,"read_insights":false,"read_requests":false,"read_friendlists":true,"manage_pages":false,"physical_login":false,"manage_groups":false,"read_deals":false}}});__d("UrlMapConfig",[],{"www":"www.facebook.com","m":"m.facebook.com","connect":"connect.facebook.net","business":"business.facebook.com","api_https":"api.facebook.com","api_read_https":"api-read.facebook.com","graph_https":"graph.facebook.com","fbcdn_http":"static.ak.fbcdn.net","fbcdn_https":"fbstatic-a.akamaihd.net","cdn_http":"static.ak.facebook.com","cdn_https":"s-static.ak.facebook.com"});__d("JSSDKXDConfig",[],{"XdUrl":"\/connect\/xd_arbiter.php?version=41","XdBundleUrl":"\/connect\/xd_arbiter\/KFZn1BJ0LYk.js?version=41","Flash":{"path":"https:\/\/connect.facebook.net\/rsrc.php\/v1\/yR\/r\/ks_9ZXiQ0GL.swf"},"useCdn":true});__d("JSSDKCssConfig",[],{"rules":".fb_hidden{position:absolute;top:-10000px;z-index:10001}.fb_invisible{display:none}.fb_reset{background:none;border:0;border-spacing:0;color:#000;cursor:auto;direction:ltr;font-family:\"lucida grande\", tahoma, verdana, arial, sans-serif;font-size:11px;font-style:normal;font-variant:normal;font-weight:normal;letter-spacing:normal;line-height:1;margin:0;overflow:visible;padding:0;text-align:left;text-decoration:none;text-indent:0;text-shadow:none;text-transform:none;visibility:visible;white-space:normal;word-spacing:normal}.fb_reset>div{overflow:hidden}.fb_link img{border:none}\n.fb_dialog{background:rgba(82, 82, 82, .7);position:absolute;top:-10000px;z-index:10001}.fb_reset .fb_dialog_legacy{overflow:visible}.fb_dialog_advanced{padding:10px;-moz-border-radius:8px;-webkit-border-radius:8px;border-radius:8px}.fb_dialog_content{background:#fff;color:#333}.fb_dialog_close_icon{background:url(http:\/\/static.ak.fbcdn.net\/rsrc.php\/v2\/yq\/r\/IE9JII6Z1Ys.png) no-repeat scroll 0 0 transparent;_background-image:url(http:\/\/static.ak.fbcdn.net\/rsrc.php\/v2\/yL\/r\/s816eWC-2sl.gif);cursor:pointer;display:block;height:15px;position:absolute;right:18px;top:17px;width:15px}.fb_dialog_mobile .fb_dialog_close_icon{top:5px;left:5px;right:auto}.fb_dialog_padding{background-color:transparent;position:absolute;width:1px;z-index:-1}.fb_dialog_close_icon:hover{background:url(http:\/\/static.ak.fbcdn.net\/rsrc.php\/v2\/yq\/r\/IE9JII6Z1Ys.png) no-repeat scroll 0 -15px transparent;_background-image:url(http:\/\/static.ak.fbcdn.net\/rsrc.php\/v2\/yL\/r\/s816eWC-2sl.gif)}.fb_dialog_close_icon:active{background:url(http:\/\/static.ak.fbcdn.net\/rsrc.php\/v2\/yq\/r\/IE9JII6Z1Ys.png) no-repeat scroll 0 -30px transparent;_background-image:url(http:\/\/static.ak.fbcdn.net\/rsrc.php\/v2\/yL\/r\/s816eWC-2sl.gif)}.fb_dialog_loader{background-color:#f2f2f2;border:1px solid #606060;font-size:24px;padding:20px}.fb_dialog_top_left,.fb_dialog_top_right,.fb_dialog_bottom_left,.fb_dialog_bottom_right{height:10px;width:10px;overflow:hidden;position:absolute}.fb_dialog_top_left{background:url(http:\/\/static.ak.fbcdn.net\/rsrc.php\/v2\/ye\/r\/8YeTNIlTZjm.png) no-repeat 0 0;left:-10px;top:-10px}.fb_dialog_top_right{background:url(http:\/\/static.ak.fbcdn.net\/rsrc.php\/v2\/ye\/r\/8YeTNIlTZjm.png) no-repeat 0 -10px;right:-10px;top:-10px}.fb_dialog_bottom_left{background:url(http:\/\/static.ak.fbcdn.net\/rsrc.php\/v2\/ye\/r\/8YeTNIlTZjm.png) no-repeat 0 -20px;bottom:-10px;left:-10px}.fb_dialog_bottom_right{background:url(http:\/\/static.ak.fbcdn.net\/rsrc.php\/v2\/ye\/r\/8YeTNIlTZjm.png) no-repeat 0 -30px;right:-10px;bottom:-10px}.fb_dialog_vert_left,.fb_dialog_vert_right,.fb_dialog_horiz_top,.fb_dialog_horiz_bottom{position:absolute;background:#525252;filter:alpha(opacity=70);opacity:.7}.fb_dialog_vert_left,.fb_dialog_vert_right{width:10px;height:100\u0025}.fb_dialog_vert_left{margin-left:-10px}.fb_dialog_vert_right{right:0;margin-right:-10px}.fb_dialog_horiz_top,.fb_dialog_horiz_bottom{width:100\u0025;height:10px}.fb_dialog_horiz_top{margin-top:-10px}.fb_dialog_horiz_bottom{bottom:0;margin-bottom:-10px}.fb_dialog_iframe{line-height:0}.fb_dialog_content .dialog_title{background:#6d84b4;border:1px solid #3b5998;color:#fff;font-size:14px;font-weight:bold;margin:0}.fb_dialog_content .dialog_title>span{background:url(http:\/\/static.ak.fbcdn.net\/rsrc.php\/v2\/yd\/r\/Cou7n-nqK52.gif) no-repeat 5px 50\u0025;float:left;padding:5px 0 7px 26px}body.fb_hidden{-webkit-transform:none;height:100\u0025;margin:0;overflow:visible;position:absolute;top:-10000px;left:0;width:100\u0025}.fb_dialog.fb_dialog_mobile.loading{background:url(http:\/\/static.ak.fbcdn.net\/rsrc.php\/v2\/ya\/r\/3rhSv5V8j3o.gif) white no-repeat 50\u0025 50\u0025;min-height:100\u0025;min-width:100\u0025;overflow:hidden;position:absolute;top:0;z-index:10001}.fb_dialog.fb_dialog_mobile.loading.centered{max-height:590px;min-height:590px;max-width:500px;min-width:500px}#fb-root #fb_dialog_ipad_overlay{background:rgba(0, 0, 0, .45);position:absolute;left:0;top:0;width:100\u0025;min-height:100\u0025;z-index:10000}#fb-root #fb_dialog_ipad_overlay.hidden{display:none}.fb_dialog.fb_dialog_mobile.loading iframe{visibility:hidden}.fb_dialog_content .dialog_header{-webkit-box-shadow:white 0 1px 1px -1px inset;background:-webkit-gradient(linear, 0\u0025 0\u0025, 0\u0025 100\u0025, from(#738ABA), to(#2C4987));border-bottom:1px solid;border-color:#1d4088;color:#fff;font:14px Helvetica, sans-serif;font-weight:bold;text-overflow:ellipsis;text-shadow:rgba(0, 30, 84, .296875) 0 -1px 0;vertical-align:middle;white-space:nowrap}.fb_dialog_content .dialog_header table{-webkit-font-smoothing:subpixel-antialiased;height:43px;width:100\u0025}.fb_dialog_content .dialog_header td.header_left{font-size:12px;padding-left:5px;vertical-align:middle;width:60px}.fb_dialog_content .dialog_header td.header_right{font-size:12px;padding-right:5px;vertical-align:middle;width:60px}.fb_dialog_content .touchable_button{background:-webkit-gradient(linear, 0\u0025 0\u0025, 0\u0025 100\u0025, from(#4966A6), color-stop(.5, #355492), to(#2A4887));border:1px solid #29447e;-webkit-background-clip:padding-box;-webkit-border-radius:3px;-webkit-box-shadow:rgba(0, 0, 0, .117188) 0 1px 1px inset, rgba(255, 255, 255, .167969) 0 1px 0;display:inline-block;margin-top:3px;max-width:85px;line-height:18px;padding:4px 12px;position:relative}.fb_dialog_content .dialog_header .touchable_button input{border:none;background:none;color:#fff;font:12px Helvetica, sans-serif;font-weight:bold;margin:2px -12px;padding:2px 6px 3px 6px;text-shadow:rgba(0, 30, 84, .296875) 0 -1px 0}.fb_dialog_content .dialog_header .header_center{color:#fff;font-size:16px;font-weight:bold;line-height:18px;text-align:center;vertical-align:middle}.fb_dialog_content .dialog_content{background:url(http:\/\/static.ak.fbcdn.net\/rsrc.php\/v2\/y9\/r\/jKEcVPZFk-2.gif) no-repeat 50\u0025 50\u0025;border:1px solid #555;border-bottom:0;border-top:0;height:150px}.fb_dialog_content .dialog_footer{background:#f2f2f2;border:1px solid #555;border-top-color:#ccc;height:40px}#fb_dialog_loader_close{float:left}.fb_dialog.fb_dialog_mobile .fb_dialog_close_button{text-shadow:rgba(0, 30, 84, .296875) 0 -1px 0}.fb_dialog.fb_dialog_mobile .fb_dialog_close_icon{visibility:hidden}\n.fb_iframe_widget{display:inline-block;position:relative}.fb_iframe_widget span{display:inline-block;position:relative;text-align:justify}.fb_iframe_widget iframe{position:absolute}.fb_iframe_widget_lift{z-index:1}.fb_hide_iframes iframe{position:relative;left:-10000px}.fb_iframe_widget_loader{position:relative;display:inline-block}.fb_iframe_widget_fluid{display:inline}.fb_iframe_widget_fluid span{width:100\u0025}.fb_iframe_widget_loader iframe{min-height:32px;z-index:2;zoom:1}.fb_iframe_widget_loader .FB_Loader{background:url(http:\/\/static.ak.fbcdn.net\/rsrc.php\/v2\/y9\/r\/jKEcVPZFk-2.gif) no-repeat;height:32px;width:32px;margin-left:-16px;position:absolute;left:50\u0025;z-index:4}\n.fbpluginrecommendationsbarleft,.fbpluginrecommendationsbarright{position:fixed !important;bottom:0;z-index:999}.fbpluginrecommendationsbarleft{left:10px}.fbpluginrecommendationsbarright{right:10px}","components":["css:fb.css.base","css:fb.css.dialog","css:fb.css.iframewidget","css:fb.css.plugin.recommendationsbar"]});__d("ApiClientConfig",[],{"FlashRequest":{"swfUrl":"https:\/\/connect.facebook.net\/rsrc.php\/v1\/yW\/r\/PvklbuW2Ycn.swf"}});__d("JSSDKCanvasPrefetcherConfig",[],{"blacklist":[144959615576466],"sampleRate":500});__d("JSSDKPluginPipeConfig",[],{"threshold":0,"enabledApps":{"209753825810663":1,"187288694643718":1}});
__d("QueryString",[],function(a,b,c,d,e,f){function g(k){var l=[];ES(ES('Object','keys',false,k).sort(),'forEach',true,function(m){var n=k[m];if(typeof n==='undefined')return;if(n===null){l.push(m);return;}l.push(encodeURIComponent(m)+'='+encodeURIComponent(n));});return l.join('&');}function h(k,l){var m={};if(k==='')return m;var n=k.split('&');for(var o=0;o<n.length;o++){var p=n[o].split('=',2),q=decodeURIComponent(p[0]);if(l&&m.hasOwnProperty(q))throw new URIError('Duplicate key: '+q);m[q]=p.length===2?decodeURIComponent(p[1]):null;}return m;}function i(k,l){return k+(~ES(k,'indexOf',true,'?')?'&':'?')+(typeof l==='string'?l:j.encode(l));}var j={encode:g,decode:h,appendToUrl:i};e.exports=j;},null);
__d("ManagedError",[],function(a,b,c,d,e,f){function g(h,i){Error.prototype.constructor.call(this,h);this.message=h;this.innerError=i;}g.prototype=new Error();g.prototype.constructor=g;e.exports=g;},null);
__d("AssertionError",["ManagedError"],function(a,b,c,d,e,f,g){function h(i){g.prototype.constructor.apply(this,arguments);}h.prototype=new g();h.prototype.constructor=h;e.exports=h;},null);
__d("sprintf",[],function(a,b,c,d,e,f){function g(h){var i=Array.prototype.slice.call(arguments,1),j=0;return h.replace(/%s/g,function(k){return i[j++];});}e.exports=g;},null);
__d("Assert",["AssertionError","sprintf"],function(a,b,c,d,e,f,g,h){function i(n,o){if(typeof n!=='boolean'||!n)throw new g(o);return n;}function j(n,o,p){var q;if(o===undefined){q='undefined';}else if(o===null){q='null';}else{var r=Object.prototype.toString.call(o);q=/\s(\w*)/.exec(r)[1].toLowerCase();}i(ES(n,'indexOf',true,q)!==-1,p||h('Expression is of type %s, not %s',q,n));return o;}function k(n,o,p){i(o instanceof n,p||'Expression not instance of type');return o;}function l(n,o){m['is'+n]=o;m['maybe'+n]=function(p,q){if(p!=null)o(p,q);};}var m={isInstanceOf:k,isTrue:i,isTruthy:function(n,o){return i(!!n,o);},type:j,define:function(n,o){n=n.substring(0,1).toUpperCase()+n.substring(1).toLowerCase();l(n,function(p,q){i(o(p),q);});}};ES(['Array','Boolean','Date','Function','Null','Number','Object','Regexp','String','Undefined'],'forEach',true,function(n){l(n,ES(j,'bind',true,null,n.toLowerCase()));});e.exports=m;},null);
__d("Type",["Assert"],function(a,b,c,d,e,f,g){function h(){var l=this.__mixins;if(l)for(var m=0;m<l.length;m++)l[m].apply(this,arguments);}function i(l,m){if(m instanceof l)return true;if(m instanceof h)for(var n=0;n<m.__mixins.length;n++)if(m.__mixins[n]==l)return true;return false;}function j(l,m){var n=l.prototype;if(!ES('Array','isArray',false,m))m=[m];for(var o=0;o<m.length;o++){var p=m[o];if(typeof p=='function'){n.__mixins.push(p);p=p.prototype;}ES(ES('Object','keys',false,p),'forEach',true,function(q){n[q]=p[q];});}}function k(l,m,n){var o=m&&m.hasOwnProperty('constructor')?m.constructor:function(){this.parent.apply(this,arguments);};g.isFunction(o);if(l&&l.prototype instanceof h===false)throw new Error('parent type does not inherit from Type');l=l||h;var p=new Function();p.prototype=l.prototype;o.prototype=new p();if(m)ES('Object','assign',false,o.prototype,m);o.prototype.constructor=o;o.parent=l;o.prototype.__mixins=l.prototype.__mixins?Array.prototype.slice.call(l.prototype.__mixins):[];if(n)j(o,n);o.prototype.parent=function(){this.parent=l.prototype.parent;l.apply(this,arguments);};o.prototype.parentCall=function(q){return l.prototype[q].apply(this,Array.prototype.slice.call(arguments,1));};o.extend=function(q,r){return k(this,q,r);};return o;}ES('Object','assign',false,h.prototype,{instanceOf:function(l){return i(l,this);}});ES('Object','assign',false,h,{extend:function(l,m){return typeof l==='function'?k.apply(null,arguments):k(null,l,m);},instanceOf:i});e.exports=h;},null);
__d("ObservableMixin",[],function(a,b,c,d,e,f){function g(){this.__observableEvents={};}g.prototype={inform:function(h){var i=Array.prototype.slice.call(arguments,1),j=Array.prototype.slice.call(this.getSubscribers(h));for(var k=0;k<j.length;k++){if(j[k]===null)continue;try{j[k].apply(this,i);}catch(l){setTimeout(function(){throw l;},0);}}return this;},getSubscribers:function(h){return this.__observableEvents[h]||(this.__observableEvents[h]=[]);},clearSubscribers:function(h){if(h)this.__observableEvents[h]=[];return this;},clearAllSubscribers:function(){this.__observableEvents={};return this;},subscribe:function(h,i){var j=this.getSubscribers(h);j.push(i);return this;},unsubscribe:function(h,i){var j=this.getSubscribers(h);for(var k=0;k<j.length;k++)if(j[k]===i){j.splice(k,1);break;}return this;},monitor:function(h,i){if(!i()){var j=ES(function(k){if(i.apply(i,arguments))this.unsubscribe(h,j);},'bind',true,this);this.subscribe(h,j);}return this;}};e.exports=g;},null);
__d("sdk.Model",["Type","ObservableMixin"],function(a,b,c,d,e,f,g,h){var i=g.extend({constructor:function(j){this.parent();var k={},l=this;ES(ES('Object','keys',false,j),'forEach',true,function(m){k[m]=j[m];l['set'+m]=function(n){if(n===k[m])return this;k[m]=n;l.inform(m+'.change',n);return l;};l['get'+m]=function(){return k[m];};});}},h);e.exports=i;},null);
__d("sdk.Runtime",["sdk.Model","JSSDKRuntimeConfig"],function(a,b,c,d,e,f,g,h){var i={UNKNOWN:0,PAGETAB:1,CANVAS:2,PLATFORM:4},j=new g({AccessToken:'',ClientID:'',CookieUserID:'',Environment:i.UNKNOWN,Initialized:false,IsVersioned:false,KidDirectedSite:undefined,Locale:h.locale,LoginStatus:undefined,Revision:h.revision,Rtl:h.rtl,Scope:undefined,Secure:undefined,UseCookie:false,UserID:'',Version:undefined});ES('Object','assign',false,j,{ENVIRONMENTS:i,isEnvironment:function(k){var l=this.getEnvironment();return (k|l)===l;},isCanvasEnvironment:function(){return this.isEnvironment(i.CANVAS)||this.isEnvironment(i.PAGETAB);}});(function(){var k=/app_runner/.test(window.name)?i.PAGETAB:/iframe_canvas/.test(window.name)?i.CANVAS:i.UNKNOWN;if((k|i.PAGETAB)===k)k=k|i.CANVAS;j.setEnvironment(k);})();e.exports=j;},null);
__d("sdk.Cookie",["QueryString","sdk.Runtime"],function(a,b,c,d,e,f,g,h){var i=null;function j(m,n,o){m=m+h.getClientID();var p=i&&i!=='.';if(p){document.cookie=m+'=; expires=Wed, 04 Feb 2004 08:00:00 GMT;';document.cookie=m+'=; expires=Wed, 04 Feb 2004 08:00:00 GMT;'+'domain='+location.hostname+';';}var q=new Date(o).toGMTString();document.cookie=m+'='+n+(n&&o===0?'':'; expires='+q)+'; path=/'+(p?'; domain='+i:'');}function k(m){m=m+h.getClientID();var n=new RegExp('\\b'+m+'=([^;]*)\\b');return n.test(document.cookie)?RegExp.$1:null;}var l={setDomain:function(m){i=m;var n=g.encode({base_domain:i&&i!=='.'?i:''}),o=new Date();o.setFullYear(o.getFullYear()+1);j('fbm_',n,o.getTime());},getDomain:function(){return i;},loadMeta:function(){var m=k('fbm_');if(m){var n=g.decode(m);if(!i)i=n.base_domain;return n;}},loadSignedRequest:function(){return k('fbsr_');},setSignedRequestCookie:function(m,n){if(!m)throw new Error('Value passed to Cookie.setSignedRequestCookie '+'was empty.');j('fbsr_',m,n);},clearSignedRequestCookie:function(){j('fbsr_','',0);},setRaw:j};e.exports=l;},null);
__d("guid",[],function(a,b,c,d,e,f){function g(){return 'f'+(Math.random()*(1<<30)).toString(16).replace('.','');}e.exports=g;},null);
__d("UserAgent_DEPRECATED",[],function(a,b,c,d,e,f){var g=false,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v;function w(){if(g)return;g=true;var y=navigator.userAgent,z=/(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel).(\d+\.\d+))|(?:Opera(?:.+Version.|.)(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))|(?:Trident\/\d+\.\d+.*rv:(\d+\.\d+))/.exec(y),aa=/(Mac OS X)|(Windows)|(Linux)/.exec(y);s=/\b(iPhone|iP[ao]d)/.exec(y);t=/\b(iP[ao]d)/.exec(y);q=/Android/i.exec(y);u=/FBAN\/\w+;/i.exec(y);v=/Mobile/i.exec(y);r=!!(/Win64/.exec(y));if(z){h=z[1]?parseFloat(z[1]):(z[5]?parseFloat(z[5]):NaN);if(h&&document&&document.documentMode)h=document.documentMode;var ba=/(?:Trident\/(\d+.\d+))/.exec(y);m=ba?parseFloat(ba[1])+4:h;i=z[2]?parseFloat(z[2]):NaN;j=z[3]?parseFloat(z[3]):NaN;k=z[4]?parseFloat(z[4]):NaN;if(k){z=/(?:Chrome\/(\d+\.\d+))/.exec(y);l=z&&z[1]?parseFloat(z[1]):NaN;}else l=NaN;}else h=i=j=l=k=NaN;if(aa){if(aa[1]){var ca=/(?:Mac OS X (\d+(?:[._]\d+)?))/.exec(y);n=ca?parseFloat(ca[1].replace('_','.')):true;}else n=false;o=!!aa[2];p=!!aa[3];}else n=o=p=false;}var x={ie:function(){return w()||h;},ieCompatibilityMode:function(){return w()||(m>h);},ie64:function(){return x.ie()&&r;},firefox:function(){return w()||i;},opera:function(){return w()||j;},webkit:function(){return w()||k;},safari:function(){return x.webkit();},chrome:function(){return w()||l;},windows:function(){return w()||o;},osx:function(){return w()||n;},linux:function(){return w()||p;},iphone:function(){return w()||s;},mobile:function(){return w()||(s||t||q||v);},nativeApp:function(){return w()||u;},android:function(){return w()||q;},ipad:function(){return w()||t;}};e.exports=x;},null);
__d("hasNamePropertyBug",["guid","UserAgent_DEPRECATED"],function(a,b,c,d,e,f,g,h){var i=h.ie()?undefined:false;function j(){var l=document.createElement("form"),m=l.appendChild(document.createElement("input"));m.name=g();i=m!==l.elements[m.name];l=m=null;return i;}function k(){return typeof i==='undefined'?j():i;}e.exports=k;},null);
__d("wrapFunction",[],function(a,b,c,d,e,f){var g={};function h(i,j,k){j=j||'default';return function(){var l=j in g?g[j](i,k):i;return l.apply(this,arguments);};}h.setWrapper=function(i,j){j=j||'default';g[j]=i;};e.exports=h;},null);
__d("DOMEventListener",["wrapFunction"],function(a,b,c,d,e,f,g){var h,i;if(window.addEventListener){h=function(k,l,m){m.wrapper=g(m,'entry','DOMEventListener.add '+l);k.addEventListener(l,m.wrapper,false);};i=function(k,l,m){k.removeEventListener(l,m.wrapper,false);};}else if(window.attachEvent){h=function(k,l,m){m.wrapper=g(m,'entry','DOMEventListener.add '+l);k.attachEvent('on'+l,m.wrapper);};i=function(k,l,m){k.detachEvent('on'+l,m.wrapper);};}else i=h=function(){};var j={add:function(k,l,m){h(k,l,m);return {remove:function(){i(k,l,m);k=null;}};},remove:i};e.exports=j;},null);
__d("sdk.createIframe",["guid","hasNamePropertyBug","DOMEventListener"],function(a,b,c,d,e,f,g,h,i){function j(k){k=ES('Object','assign',false,{},k);var l,m=k.name||g(),n=k.root,o=k.style||{border:'none'},p=k.url,q=k.onload,r=k.onerror;if(h()){l=document.createElement('<iframe name="'+m+'"/>');}else{l=document.createElement("iframe");l.name=m;}delete k.style;delete k.name;delete k.url;delete k.root;delete k.onload;delete k.onerror;var s=ES('Object','assign',false,{frameBorder:0,allowTransparency:true,scrolling:'no'},k);if(s.width)l.width=s.width+'px';if(s.height)l.height=s.height+'px';delete s.height;delete s.width;for(var t in s)if(s.hasOwnProperty(t))l.setAttribute(t,s[t]);ES('Object','assign',false,l.style,o);l.src="javascript:false";n.appendChild(l);if(q)var u=i.add(l,'load',function(){u.remove();q();});if(r)var v=i.add(l,'error',function(){v.remove();r();});l.src=p;return l;}e.exports=j;},null);
__d("DOMWrapper",[],function(a,b,c,d,e,f){var g,h,i={setRoot:function(j){g=j;},getRoot:function(){return g||document.body;},setWindow:function(j){h=j;},getWindow:function(){return h||self;}};e.exports=i;},null);
__d("sdk.feature",["JSSDKConfig"],function(a,b,c,d,e,f,g){function h(i,j){if(g.features&&i in g.features){var k=g.features[i];if(typeof k==='object'&&typeof k.rate==='number'){if(k.rate&&Math.random()*100<=k.rate){return k.value||true;}else return k.value?null:false;}else return k;}return typeof j!=='undefined'?j:null;}e.exports=h;},null);
__d("sdk.getContextType",["UserAgent_DEPRECATED","sdk.Runtime"],function(a,b,c,d,e,f,g,h){function i(){if(g.nativeApp())return 3;if(g.mobile())return 2;if(h.isEnvironment(h.ENVIRONMENTS.CANVAS))return 5;return 1;}e.exports=i;},null);
__d("sdk.domReady",[],function(a,b,c,d,e,f){var g,h="readyState" in document?/loaded|complete/.test(document.readyState):!!document.body;function i(){if(!g)return;var l;while(l=g.shift())l();g=null;}function j(l){if(g){g.push(l);return;}else l();}if(!h){g=[];if(document.addEventListener){document.addEventListener('DOMContentLoaded',i,false);window.addEventListener('load',i,false);}else if(document.attachEvent){document.attachEvent('onreadystatechange',i);window.attachEvent('onload',i);}if(document.documentElement.doScroll&&window==window.top){var k=function(){try{document.documentElement.doScroll('left');}catch(l){setTimeout(k,0);return;}i();};k();}}e.exports=j;},3);
__d("Log",["sprintf"],function(a,b,c,d,e,f,g){var h={DEBUG:3,INFO:2,WARNING:1,ERROR:0};function i(k,l){var m=Array.prototype.slice.call(arguments,2),n=g.apply(null,m),o=window.console;if(o&&j.level>=l)o[k in o?k:'log'](n);}var j={level:-1,Level:h,debug:ES(i,'bind',true,null,'debug',h.DEBUG),info:ES(i,'bind',true,null,'info',h.INFO),warn:ES(i,'bind',true,null,'warn',h.WARNING),error:ES(i,'bind',true,null,'error',h.ERROR)};e.exports=j;},null);
__d("sdk.Content",["sdk.domReady","Log","UserAgent_DEPRECATED"],function(a,b,c,d,e,f,g,h,i){var j,k,l={append:function(m,n){if(!n)if(!j){j=n=document.getElementById('fb-root');if(!n){h.warn('The "fb-root" div has not been created, auto-creating');j=n=document.createElement('div');n.id='fb-root';if(i.ie()||!document.body){g(function(){document.body.appendChild(n);});}else document.body.appendChild(n);}n.className+=' fb_reset';}else n=j;if(typeof m=='string'){var o=document.createElement('div');n.appendChild(o).innerHTML=m;return o;}else return n.appendChild(m);},appendHidden:function(m){if(!n){var n=document.createElement('div'),o=n.style;o.position='absolute';o.top='-10000px';o.width=o.height=0;n=l.append(n);}return l.append(m,n);},submitToTarget:function(m,n){var o=document.createElement('form');o.action=m.url;o.target=m.target;o.method=(n)?'GET':'POST';l.appendHidden(o);for(var p in m.params)if(m.params.hasOwnProperty(p)){var q=m.params[p];if(q!==null&&q!==undefined){var r=document.createElement('input');r.name=p;r.value=q;o.appendChild(r);}}o.submit();o.parentNode.removeChild(o);}};e.exports=l;},null);
__d("dotAccess",[],function(a,b,c,d,e,f){function g(h,i,j){var k=i.split('.');do{var l=k.shift();h=h[l]||j&&(h[l]={});}while(k.length&&h);return h;}e.exports=g;},null);
__d("GlobalCallback",["DOMWrapper","dotAccess","guid","wrapFunction"],function(a,b,c,d,e,f,g,h,i,j){var k,l,m={setPrefix:function(n){k=h(g.getWindow(),n,true);l=n;},create:function(n,o){if(!k)this.setPrefix('__globalCallbacks');var p=i();k[p]=j(n,'entry',o||'GlobalCallback');return l+'.'+p;},remove:function(n){var o=n.substring(l.length+1);delete k[o];}};e.exports=m;},null);
__d("insertIframe",["guid","GlobalCallback"],function(a,b,c,d,e,f,g,h){function i(j){j.id=j.id||g();j.name=j.name||g();var k=false,l=false,m=function(){if(k&&!l){l=true;j.onload&&j.onload(j.root.firstChild);}},n=h.create(m);if(document.attachEvent){var o=('<iframe'+' id="'+j.id+'"'+' name="'+j.name+'"'+(j.title?' title="'+j.title+'"':'')+(j.className?' class="'+j.className+'"':'')+' style="border:none;'+(j.width?'width:'+j.width+'px;':'')+(j.height?'height:'+j.height+'px;':'')+'"'+' src="javascript:false;"'+' frameborder="0"'+' scrolling="no"'+' allowtransparency="true"'+' onload="'+n+'()"'+'></iframe>');j.root.innerHTML=('<iframe src="javascript:false"'+' frameborder="0"'+' scrolling="no"'+' style="height:1px"></iframe>');k=true;setTimeout(function(){j.root.innerHTML=o;j.root.firstChild.src=j.url;j.onInsert&&j.onInsert(j.root.firstChild);},0);}else{var p=document.createElement('iframe');p.id=j.id;p.name=j.name;p.onload=m;p.scrolling='no';p.style.border='none';p.style.overflow='hidden';if(j.title)p.title=j.title;if(j.className)p.className=j.className;if(j.height!==undefined)p.style.height=j.height+'px';if(j.width!==undefined)if(j.width=='100%'){p.style.width=j.width;}else p.style.width=j.width+'px';j.root.appendChild(p);k=true;p.src=j.url;j.onInsert&&j.onInsert(p);}}e.exports=i;},null);
__d("Miny",[],function(a,b,c,d,e,f){var g='Miny1',h={encode:[],decode:{}},i='wxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'.split('');function j(n){for(var o=h.encode.length;o<n;o++){var p=o.toString(32).split('');p[p.length-1]=i[parseInt(p[p.length-1],32)];p=p.join('');h.encode[o]=p;h.decode[p]=o;}return h;}function k(n){if(/^$|[~\\]|__proto__/.test(n))return n;var o=n.match(/\w+|\W+/g),p={};for(var q=0;q<o.length;q++)p[o[q]]=(p[o[q]]||0)+1;var r=ES('Object','keys',false,p);r.sort(function(u,v){return p[u]<p[v]?1:(p[v]<p[u]?-1:0);});var s=j(r.length).encode;for(q=0;q<r.length;q++)p[r[q]]=s[q];var t=[];for(q=0;q<o.length;q++)t[q]=p[o[q]];return [g,r.length].concat(r).concat(t.join('')).join('~');}function l(n){var o=n.split('~');if(o.shift()!=g)return n;var p=parseInt(o.shift(),10),q=o.pop();q=q.match(/[0-9a-v]*[\-w-zA-Z_]/g);var r=o,s=j(p).decode,t=[];for(var u=0;u<q.length;u++)t[u]=r[s[q[u]]];return t.join('');}var m={encode:k,decode:l};e.exports=m;},null);
__d("UrlMap",["UrlMapConfig"],function(a,b,c,d,e,f,g){var h={resolve:function(i,j){var k=typeof j=='undefined'?location.protocol.replace(':',''):j?'https':'http';if(i in g)return k+'://'+g[i];if(typeof j=='undefined'&&i+'_'+k in g)return k+'://'+g[i+'_'+k];if(j!==true&&i+'_http' in g)return 'http://'+g[i+'_http'];if(j!==false&&i+'_https' in g)return 'https://'+g[i+'_https'];}};e.exports=h;},null);
__d("sdk.Impressions",["sdk.Content","guid","insertIframe","Miny","QueryString","sdk.Runtime","UrlMap"],function(a,b,c,d,e,f,g,h,i,j,k,l,m){function n(p){var q=l.getClientID();if(!p.api_key&&q)p.api_key=q;p.kid_directed_site=l.getKidDirectedSite();var r=m.resolve('www',true)+'/impression.php/'+h()+'/',s=k.appendToUrl(r,p);if(s.length>2000)if(p.payload&&typeof p.payload==='string'){var t=j.encode(p.payload);if(t&&t.length<p.payload.length){p.payload=t;s=k.appendToUrl(r,p);}}if(s.length<=2000){var u=new Image();u.src=s;}else{var v=h(),w=g.appendHidden('');i({url:'javascript:false',root:w,name:v,className:'fb_hidden fb_invisible',onload:function(){w.parentNode.removeChild(w);}});g.submitToTarget({url:r,target:v,params:p});}}var o={log:function(p,q){if(!q.source)q.source='jssdk';n({lid:p,payload:ES('JSON','stringify',false,q)});},impression:n};e.exports=o;},null);
__d("Base64",[],function(a,b,c,d,e,f){var g='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';function h(l){l=(l.charCodeAt(0)<<16)|(l.charCodeAt(1)<<8)|l.charCodeAt(2);return String.fromCharCode(g.charCodeAt(l>>>18),g.charCodeAt((l>>>12)&63),g.charCodeAt((l>>>6)&63),g.charCodeAt(l&63));}var i='>___?456789:;<=_______'+'\0\1\2\3\4\5\6\7\b\t\n\13\f\r\16\17\20\21\22\23\24\25\26\27\30\31'+'______\32\33\34\35\36\37 !"#$%&\'()*+,-./0123';function j(l){l=(i.charCodeAt(l.charCodeAt(0)-43)<<18)|(i.charCodeAt(l.charCodeAt(1)-43)<<12)|(i.charCodeAt(l.charCodeAt(2)-43)<<6)|i.charCodeAt(l.charCodeAt(3)-43);return String.fromCharCode(l>>>16,(l>>>8)&255,l&255);}var k={encode:function(l){l=unescape(encodeURI(l));var m=(l.length+2)%3;l=(l+'\0\0'.slice(m)).replace(/[\s\S]{3}/g,h);return l.slice(0,l.length+m-2)+'=='.slice(m);},decode:function(l){l=l.replace(/[^A-Za-z0-9+\/]/g,'');var m=(l.length+3)&3;l=(l+'AAA'.slice(m)).replace(/..../g,j);l=l.slice(0,l.length+m-3);try{return decodeURIComponent(escape(l));}catch(n){throw new Error('Not valid UTF-8');}},encodeObject:function(l){return k.encode(ES('JSON','stringify',false,l));},decodeObject:function(l){return ES('JSON','parse',false,k.decode(l));},encodeNums:function(l){return String.fromCharCode.apply(String,ES(l,'map',true,function(m){return g.charCodeAt((m|-(m>63))&-(m>0)&63);}));}};e.exports=k;},null);
__d("sdk.SignedRequest",["Base64"],function(a,b,c,d,e,f,g){function h(j){if(!j)return null;var k=j.split('.',2)[1].replace(/\-/g,'+').replace(/\_/g,'/');return g.decodeObject(k);}var i={parse:h};e.exports=i;},null);
__d("URIRFC3986",[],function(a,b,c,d,e,f){var g=new RegExp('^'+'([^:/?#]+:)?'+'(//'+'([^\\\\/?#@]*@)?'+'('+'\\[[A-Fa-f0-9:.]+\\]|'+'[^\\/?#:]*'+')'+'(:[0-9]*)?'+')?'+'([^?#]*)'+'(\\?[^#]*)?'+'(#.*)?'),h={parse:function(i){if(ES(i,'trim',true)==='')return null;var j=i.match(g),k={};k.uri=j[0]?j[0]:null;k.scheme=j[1]?j[1].substr(0,j[1].length-1):null;k.authority=j[2]?j[2].substr(2):null;k.userinfo=j[3]?j[3].substr(0,j[3].length-1):null;k.host=j[2]?j[4]:null;k.port=j[5]?(j[5].substr(1)?parseInt(j[5].substr(1),10):null):null;k.path=j[6]?j[6]:null;k.query=j[7]?j[7].substr(1):null;k.fragment=j[8]?j[8].substr(1):null;k.isGenericURI=k.authority===null&&!!k.scheme;return k;}};e.exports=h;},null);
__d("createObjectFrom",[],function(a,b,c,d,e,f){function g(h,i){var j={},k=ES('Array','isArray',false,i);if(typeof i=='undefined')i=true;for(var l=h.length;l--;)j[h[l]]=k?i[l]:i;return j;}e.exports=g;},null);
__d("URISchemes",["createObjectFrom"],function(a,b,c,d,e,f,g){var h=g(['fb','fbcf','fbconnect','fb-messenger','fbrpc','file','ftp','http','https','mailto','ms-app','itms','itms-apps','itms-services','market','svn+ssh','fbstaging','tel','sms','pebblejs']),i={isAllowed:function(j){if(!j)return true;return h.hasOwnProperty(j.toLowerCase());}};e.exports=i;},null);
__d("copyProperties",[],function(a,b,c,d,e,f){function g(h,i,j,k,l,m,n){h=h||{};var o=[i,j,k,l,m],p=0,q;while(o[p]){q=o[p++];for(var r in q)h[r]=q[r];if(q.hasOwnProperty&&q.hasOwnProperty('toString')&&(typeof q.toString!='undefined')&&(h.toString!==q.toString))h.toString=q.toString;}return h;}e.exports=g;},null);
__d("eprintf",[],function(a,b,c,d,e,f){var g=function(h){var i=ES(Array.prototype.slice.call(arguments),'map',true,function(l){return String(l);}),j=h.split('%s').length-1;if(j!==i.length-1)return g('eprintf args number mismatch: %s',ES('JSON','stringify',false,i));var k=1;return h.replace(/%s/g,function(l){return String(i[k++]);});};e.exports=g;},null);
__d("ex",["eprintf"],function(a,b,c,d,e,f,g){var h=function(){var i=Array.prototype.slice.call(arguments,0);i=ES(i,'map',true,function(j){return String(j);});if(i[0].split('%s').length!==i.length)return h('ex args number mismatch: %s',ES('JSON','stringify',false,i));return h._prefix+ES('JSON','stringify',false,i)+h._suffix;};h._prefix='<![EX[';h._suffix=']]>';e.exports=h;},null);
__d("invariant",[],function(a,b,c,d,e,f){"use strict";var g=function(h,i,j,k,l,m,n,o){if(!h){var p;if(i===undefined){p=new Error('Minified exception occurred; use the non-minified dev environment '+'for the full error message and additional helpful warnings.');}else{var q=[j,k,l,m,n,o],r=0;p=new Error('Invariant Violation: '+i.replace(/%s/g,function(){return q[r++];}));}p.framesToPop=1;throw p;}};e.exports=g;},null);
__d("URIBase",["URIRFC3986","URISchemes","copyProperties","ex","invariant"],function(a,b,c,d,e,f,g,h,i,j,k){var l=new RegExp('[\\x00-\\x2c\\x2f\\x3b-\\x40\\x5c\\x5e\\x60\\x7b-\\x7f'+'\\uFDD0-\\uFDEF\\uFFF0-\\uFFFF'+'\\u2047\\u2048\\uFE56\\uFE5F\\uFF03\\uFF0F\\uFF1F]'),m=new RegExp('^(?:[^/]*:|'+'[\\x00-\\x1f]*/[\\x00-\\x1f]*/)');function n(p,q,r,s){if(!q)return true;if(q instanceof o){p.setProtocol(q.getProtocol());p.setDomain(q.getDomain());p.setPort(q.getPort());p.setPath(q.getPath());p.setQueryData(s.deserialize(s.serialize(q.getQueryData())));p.setFragment(q.getFragment());p.setForceFragmentSeparator(q.getForceFragmentSeparator());return true;}q=ES(q.toString(),'trim',true);var t=g.parse(q)||{};if(!r&&!h.isAllowed(t.scheme))return false;p.setProtocol(t.scheme||'');if(!r&&l.test(t.host))return false;p.setDomain(t.host||'');p.setPort(t.port||'');p.setPath(t.path||'');if(r){p.setQueryData(s.deserialize(t.query)||{});}else try{p.setQueryData(s.deserialize(t.query)||{});}catch(u){return false;}p.setFragment(t.fragment||'');if(t.fragment==='')p.setForceFragmentSeparator(true);if(t.userinfo!==null)if(r){throw new Error(j('URI.parse: invalid URI (userinfo is not allowed in a URI): %s',p.toString()));}else return false;if(!p.getDomain()&&ES(p.getPath(),'indexOf',true,'\\')!==-1)if(r){throw new Error(j('URI.parse: invalid URI (no domain but multiple back-slashes): %s',p.toString()));}else return false;if(!p.getProtocol()&&m.test(q))if(r){throw new Error(j('URI.parse: invalid URI (unsafe protocol-relative URLs): %s',p.toString()));}else return false;return true;}function o(p,q){"use strict";k(q);this.$URIBase0=q;this.$URIBase1='';this.$URIBase2='';this.$URIBase3='';this.$URIBase4='';this.$URIBase5='';this.$URIBase6={};this.$URIBase7=false;n(this,p,true,q);}o.prototype.setProtocol=function(p){"use strict";k(h.isAllowed(p));this.$URIBase1=p;return this;};o.prototype.getProtocol=function(p){"use strict";return this.$URIBase1;};o.prototype.setSecure=function(p){"use strict";return this.setProtocol(p?'https':'http');};o.prototype.isSecure=function(){"use strict";return this.getProtocol()==='https';};o.prototype.setDomain=function(p){"use strict";if(l.test(p))throw new Error(j('URI.setDomain: unsafe domain specified: %s for url %s',p,this.toString()));this.$URIBase2=p;return this;};o.prototype.getDomain=function(){"use strict";return this.$URIBase2;};o.prototype.setPort=function(p){"use strict";this.$URIBase3=p;return this;};o.prototype.getPort=function(){"use strict";return this.$URIBase3;};o.prototype.setPath=function(p){"use strict";this.$URIBase4=p;return this;};o.prototype.getPath=function(){"use strict";return this.$URIBase4;};o.prototype.addQueryData=function(p,q){"use strict";if(Object.prototype.toString.call(p)==='[object Object]'){i(this.$URIBase6,p);}else this.$URIBase6[p]=q;return this;};o.prototype.setQueryData=function(p){"use strict";this.$URIBase6=p;return this;};o.prototype.getQueryData=function(){"use strict";return this.$URIBase6;};o.prototype.removeQueryData=function(p){"use strict";if(!ES('Array','isArray',false,p))p=[p];for(var q=0,r=p.length;q<r;++q)delete this.$URIBase6[p[q]];return this;};o.prototype.setFragment=function(p){"use strict";this.$URIBase5=p;this.setForceFragmentSeparator(false);return this;};o.prototype.getFragment=function(){"use strict";return this.$URIBase5;};o.prototype.setForceFragmentSeparator=function(p){"use strict";this.$URIBase7=p;return this;};o.prototype.getForceFragmentSeparator=function(){"use strict";return this.$URIBase7;};o.prototype.isEmpty=function(){"use strict";return !(this.getPath()||this.getProtocol()||this.getDomain()||this.getPort()||ES('Object','keys',false,this.getQueryData()).length>0||this.getFragment());};o.prototype.toString=function(){"use strict";var p='',q=this.getProtocol();if(q)p+=q+'://';var r=this.getDomain();if(r)p+=r;var s=this.getPort();if(s)p+=':'+s;var t=this.getPath();if(t){p+=t;}else if(p)p+='/';var u=this.$URIBase0.serialize(this.getQueryData());if(u)p+='?'+u;var v=this.getFragment();if(v){p+='#'+v;}else if(this.getForceFragmentSeparator())p+='#';return p;};o.prototype.getOrigin=function(){"use strict";var p=this.getPort();return this.getProtocol()+'://'+this.getDomain()+(p?':'+p:'');};o.isValidURI=function(p,q){return n(new o(null,q),p,false,q);};e.exports=o;},null);
__d("sdk.URI",["Assert","QueryString","URIBase"],function(a,b,c,d,e,f,g,h,i){var j=/\.facebook\.com$/,k={serialize:function(o){return o?h.encode(o):'';},deserialize:function(o){return o?h.decode(o):{};}};for(var l in i)if(i.hasOwnProperty(l))n[l]=i[l];var m=i===null?null:i.prototype;n.prototype=ES('Object','create',false,m);n.prototype.constructor=n;n.__superConstructor__=i;function n(o){"use strict";g.isString(o,'The passed argument was of invalid type.');if(!(this instanceof n))return new n(o);i.call(this,o,k);}n.prototype.isFacebookURI=function(){"use strict";return j.test(this.getDomain());};n.prototype.valueOf=function(){"use strict";return this.toString();};e.exports=n;},null);
__d("sdk.Event",[],function(a,b,c,d,e,f){var g={SUBSCRIBE:'event.subscribe',UNSUBSCRIBE:'event.unsubscribe',subscribers:function(){if(!this._subscribersMap)this._subscribersMap={};return this._subscribersMap;},subscribe:function(h,i){var j=this.subscribers();if(!j[h]){j[h]=[i];}else if(ES(j[h],'indexOf',true,i)==-1)j[h].push(i);if(h!=this.SUBSCRIBE&&h!=this.UNSUBSCRIBE)this.fire(this.SUBSCRIBE,h,j[h]);},unsubscribe:function(h,i){var j=this.subscribers()[h];if(j)ES(j,'forEach',true,function(k,l){if(k==i)j.splice(l,1);});if(h!=this.SUBSCRIBE&&h!=this.UNSUBSCRIBE)this.fire(this.UNSUBSCRIBE,h,j);},monitor:function(h,i){if(!i()){var j=this,k=function(){if(i.apply(i,arguments))j.unsubscribe(h,k);};this.subscribe(h,k);}},clear:function(h){delete this.subscribers()[h];},fire:function(h){var i=Array.prototype.slice.call(arguments,1),j=this.subscribers()[h];if(j)ES(j,'forEach',true,function(k){if(k)k.apply(this,i);});}};e.exports=g;},null);
__d("Queue",["copyProperties"],function(a,b,c,d,e,f,g){var h={};function i(j){"use strict";this._opts=g({interval:0,processor:null},j);this._queue=[];this._stopped=true;}i.prototype._dispatch=function(j){"use strict";if(this._stopped||this._queue.length===0)return;if(!this._opts.processor){this._stopped=true;throw new Error('No processor available');}if(this._opts.interval){this._opts.processor.call(this,this._queue.shift());this._timeout=setTimeout(ES(this._dispatch,'bind',true,this),this._opts.interval);}else while(this._queue.length)this._opts.processor.call(this,this._queue.shift());};i.prototype.enqueue=function(j){"use strict";if(this._opts.processor&&!this._stopped){this._opts.processor.call(this,j);}else this._queue.push(j);return this;};i.prototype.start=function(j){"use strict";if(j)this._opts.processor=j;this._stopped=false;this._dispatch();return this;};i.prototype.isStarted=function(){"use strict";return !this._stopped;};i.prototype.dispatch=function(){"use strict";this._dispatch(true);};i.prototype.stop=function(j){"use strict";this._stopped=true;if(j)clearTimeout(this._timeout);return this;};i.prototype.merge=function(j,k){"use strict";this._queue[k?'unshift':'push'].apply(this._queue,j._queue);j._queue=[];this._dispatch();return this;};i.prototype.getLength=function(){"use strict";return this._queue.length;};i.get=function(j,k){"use strict";var l;if(j in h){l=h[j];}else l=h[j]=new i(k);return l;};i.exists=function(j){"use strict";return j in h;};i.remove=function(j){"use strict";return delete h[j];};e.exports=i;},null);
__d("JSONRPC",["Log"],function(a,b,c,d,e,f,g){function h(i){"use strict";this.$JSONRPC0=0;this.$JSONRPC1={};this.remote=ES(function(j){this.$JSONRPC2=j;return this.remote;},'bind',true,this);this.local={};this.$JSONRPC3=i;}h.prototype.stub=function(i){"use strict";this.remote[i]=ES(function(){var j=Array.prototype.slice.call(arguments,0),k={jsonrpc:'2.0',method:i};if(typeof j[j.length-1]=='function'){k.id=++this.$JSONRPC0;this.$JSONRPC1[k.id]=j.pop();}k.params=j;this.$JSONRPC3(ES('JSON','stringify',false,k),this.$JSONRPC2||{method:i});},'bind',true,this);};h.prototype.read=function(i,j){"use strict";var k=ES('JSON','parse',false,i),l=k.id;if(!k.method){if(!this.$JSONRPC1[l]){g.warn('Could not find callback %s',l);return;}var m=this.$JSONRPC1[l];delete this.$JSONRPC1[l];delete k.id;delete k.jsonrpc;m(k);return;}var n=this,o=this.local[k.method],p;if(l){p=function(s,t){var u={jsonrpc:'2.0',id:l};u[s]=t;setTimeout(function(){n.$JSONRPC3(ES('JSON','stringify',false,u),j);},0);};}else p=function(){};if(!o){g.error('Method "%s" has not been defined',k.method);p('error',{code:-32601,message:'Method not found',data:k.method});return;}k.params.push(ES(p,'bind',true,null,'result'));k.params.push(ES(p,'bind',true,null,'error'));try{var r=o.apply(j||null,k.params);if(typeof r!=='undefined')p('result',r);}catch(q){g.error('Invokation of RPC method %s resulted in the error: %s',k.method,q.message);p('error',{code:-32603,message:'Internal error',data:q.message});}};e.exports=h;},null);
__d("sdk.RPC",["Assert","JSONRPC","Queue"],function(a,b,c,d,e,f,g,h,i){var j=new i(),k=new h(function(m){j.enqueue(m);}),l={local:k.local,remote:k.remote,stub:ES(k.stub,'bind',true,k),setInQueue:function(m){g.isInstanceOf(i,m);m.start(function(n){k.read(n);});},getOutQueue:function(){return j;}};e.exports=l;},null);
__d("sdk.Scribe",["QueryString","sdk.Runtime","UrlMap"],function(a,b,c,d,e,f,g,h,i){function j(l,m){if(typeof m.extra=='object')m.extra.revision=h.getRevision();(new Image()).src=g.appendToUrl(i.resolve('www',true)+'/common/scribe_endpoint.php',{c:l,m:ES('JSON','stringify',false,m)});}var k={log:j};e.exports=k;},null);
__d("emptyFunction",["copyProperties"],function(a,b,c,d,e,f,g){function h(j){return function(){return j;};}function i(){}g(i,{thatReturns:h,thatReturnsFalse:h(false),thatReturnsTrue:h(true),thatReturnsNull:h(null),thatReturnsThis:function(){return this;},thatReturnsArgument:function(j){return j;}});e.exports=i;},null);
__d("htmlSpecialChars",[],function(a,b,c,d,e,f){var g=/&/g,h=/</g,i=/>/g,j=/"/g,k=/'/g;function l(m){if(typeof m=='undefined'||m===null||!m.toString)return '';if(m===false){return '0';}else if(m===true)return '1';return m.toString().replace(g,'&amp;').replace(j,'&quot;').replace(k,'&#039;').replace(h,'&lt;').replace(i,'&gt;');}e.exports=l;},null);
__d("Flash",["DOMEventListener","DOMWrapper","QueryString","UserAgent_DEPRECATED","copyProperties","guid","htmlSpecialChars"],function(a,b,c,d,e,f,g,h,i,j,k,l,m){var n={},o,p=h.getWindow().document;function q(v){var w=p.getElementById(v);if(w)w.parentNode.removeChild(w);delete n[v];}function r(){for(var v in n)if(n.hasOwnProperty(v))q(v);}function s(v){return v.replace(/\d+/g,function(w){return '000'.substring(w.length)+w;});}function t(v){if(!o){if(j.ie()>=9)g.add(window,'unload',r);o=true;}n[v]=v;}var u={embed:function(v,w,x,y){var z=l();v=m(v).replace(/&amp;/g,'&');x=k({allowscriptaccess:'always',flashvars:y,movie:v},x||{});if(typeof x.flashvars=='object')x.flashvars=i.encode(x.flashvars);var aa=[];for(var ba in x)if(x.hasOwnProperty(ba)&&x[ba])aa.push('<param name="'+m(ba)+'" value="'+m(x[ba])+'">');var ca=w.appendChild(p.createElement('span')),da='<object '+(j.ie()?'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ':'type="application/x-shockwave-flash"')+'data="'+v+'" '+(x.height?'height="'+x.height+'" ':'')+(x.width?'width="'+x.width+'" ':'')+'id="'+z+'">'+aa.join('')+'</object>';ca.innerHTML=da;var ea=ca.firstChild;t(z);return ea;},remove:q,getVersion:function(){var v='Shockwave Flash',w='application/x-shockwave-flash',x='ShockwaveFlash.ShockwaveFlash',y;if(navigator.plugins&&typeof navigator.plugins[v]=='object'){var z=navigator.plugins[v].description;if(z&&navigator.mimeTypes&&navigator.mimeTypes[w]&&navigator.mimeTypes[w].enabledPlugin)y=z.match(/\d+/g);}if(!y)try{y=(new ActiveXObject(x)).GetVariable('$version').match(/(\d+),(\d+),(\d+),(\d+)/);y=Array.prototype.slice.call(y,1);}catch(aa){}return y;},checkMinVersion:function(v){var w=u.getVersion();if(!w)return false;return s(w.join('.'))>=s(v);},isAvailable:function(){return !!u.getVersion();}};e.exports=u;},null);
__d("XDM",["DOMEventListener","DOMWrapper","emptyFunction","Flash","GlobalCallback","guid","Log","UserAgent_DEPRECATED","wrapFunction"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){var p={},q={transports:[]},r=h.getWindow();function s(u){var v={},w=u.length,x=q.transports;while(w--)v[u[w]]=1;w=x.length;while(w--){var y=x[w],z=p[y];if(!v[y]&&z.isAvailable())return y;}}var t={register:function(u,v){m.debug('Registering %s as XDM provider',u);q.transports.push(u);p[u]=v;},create:function(u){if(!u.whenReady&&!u.onMessage){m.error('An instance without whenReady or onMessage makes no sense');throw new Error('An instance without whenReady or '+'onMessage makes no sense');}if(!u.channel){m.warn('Missing channel name, selecting at random');u.channel=l();}if(!u.whenReady)u.whenReady=i;if(!u.onMessage)u.onMessage=i;var v=u.transport||s(u.blacklist||[]),w=p[v];if(w&&w.isAvailable()){m.debug('%s is available',v);w.init(u);return v;}}};t.register('flash',(function(){var u=false,v,w=false,x=15000,y;return {isAvailable:function(){return j.checkMinVersion('8.0.24');},init:function(z){m.debug('init flash: '+z.channel);var aa={send:function(da,ea,fa,ga){m.debug('sending to: %s (%s)',ea,ga);v.postMessage(da,ea,ga);}};if(u){z.whenReady(aa);return;}var ba=z.root.appendChild(r.document.createElement('div')),ca=k.create(function(){k.remove(ca);clearTimeout(y);m.info('xdm.swf called the callback');var da=k.create(function(ea,fa){ea=decodeURIComponent(ea);fa=decodeURIComponent(fa);m.debug('received message %s from %s',ea,fa);z.onMessage(ea,fa);},'xdm.swf:onMessage');v.init(z.channel,da);z.whenReady(aa);},'xdm.swf:load');v=j.embed(z.flashUrl,ba,null,{protocol:location.protocol.replace(':',''),host:location.host,callback:ca,log:w});y=setTimeout(function(){m.warn('The Flash component did not load within %s ms - '+'verify that the container is not set to hidden or invisible '+'using CSS as this will cause some browsers to not load '+'the components',x);},x);u=true;}};})());t.register('postmessage',(function(){var u=false;return {isAvailable:function(){return !!r.postMessage;},init:function(v){m.debug('init postMessage: '+v.channel);var w='_FB_'+v.channel,x={send:function(y,z,aa,ba){if(r===aa){m.error('Invalid windowref, equal to window (self)');throw new Error();}m.debug('sending to: %s (%s)',z,ba);var ca=function(){aa.postMessage('_FB_'+ba+y,z);};if(n.ie()==8||n.ieCompatibilityMode()){setTimeout(ca,0);}else ca();}};if(u){v.whenReady(x);return;}g.add(r,'message',o(function(event){var y=event.data,z=event.origin||'native';if(!/^(https?:\/\/|native$)/.test(z)){m.debug('Received message from invalid origin type: %s',z);return;}if(typeof y!='string'){m.warn('Received message of type %s from %s, expected a string',typeof y,z);return;}m.debug('received message %s from %s',y,z);if(y.substring(0,w.length)==w)y=y.substring(w.length);v.onMessage(y,z);},'entry','onMessage'));v.whenReady(x);u=true;}};})());e.exports=t;},null);
__d("isFacebookURI",[],function(a,b,c,d,e,f){var g=null,h=['http','https'];function i(j){if(!g)g=new RegExp('(^|\\.)facebook\\.com$','i');if(j.isEmpty())return false;if(!j.getDomain()&&!j.getProtocol())return true;return (ES(h,'indexOf',true,j.getProtocol())!==-1&&g.test(j.getDomain()));}e.exports=i;},null);
__d("sdk.XD",["sdk.Content","sdk.Event","Log","QueryString","Queue","sdk.RPC","sdk.Runtime","sdk.Scribe","sdk.URI","UrlMap","JSSDKXDConfig","XDM","isFacebookURI","sdk.createIframe","sdk.feature","guid"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v){var w=new k(),x=new k(),y=new k(),z,aa,ba=v(),ca=q.useCdn?'cdn':'www',da=u('use_bundle')?q.XdBundleUrl:q.XdUrl,ea=p.resolve(ca,false)+da,fa=p.resolve(ca,true)+da,ga=v(),ha=location.protocol+'//'+location.host,ia,ja=false,ka='Facebook Cross Domain Communication Frame',la={},ma=new k();l.setInQueue(ma);function na(ta){i.info('Remote XD can talk to facebook.com (%s)',ta);m.setEnvironment(ta==='canvas'?m.ENVIRONMENTS.CANVAS:m.ENVIRONMENTS.PAGETAB);}function oa(ta,ua){if(!ua){i.error('No senderOrigin');throw new Error();}var va=/^https?/.exec(ua)[0];switch(ta.xd_action){case 'proxy_ready':var wa,xa;if(va=='https'){wa=y;xa=aa;}else{wa=x;xa=z;}if(ta.registered){na(ta.registered);w=wa.merge(w);}i.info('Proxy ready, starting queue %s containing %s messages',va+'ProxyQueue',wa.getLength());wa.start(function(za){ia.send(typeof za==='string'?za:j.encode(za),ua,xa.contentWindow,ga+'_'+va);});break;case 'plugin_ready':i.info('Plugin %s ready, protocol: %s',ta.name,va);la[ta.name]={protocol:va};if(k.exists(ta.name)){var ya=k.get(ta.name);i.debug('Enqueuing %s messages for %s in %s',ya.getLength(),ta.name,va+'ProxyQueue');(va=='https'?y:x).merge(ya);}break;}if(ta.data)pa(ta.data,ua);}function pa(ta,ua){if(ua&&ua!=='native'&&!s(o(ua)))return;if(typeof ta=='string'){if(/^FB_RPC:/.test(ta)){ma.enqueue(ta.substring(7));return;}if(ta.substring(0,1)=='{'){try{ta=ES('JSON','parse',false,ta);}catch(va){i.warn('Failed to decode %s as JSON',ta);return;}}else ta=j.decode(ta);}if(!ua)if(ta.xd_sig==ba)ua=ta.xd_origin;if(ta.xd_action){oa(ta,ua);return;}if(ta.access_token)m.setSecure(/^https/.test(ha));if(ta.cb){var wa=sa._callbacks[ta.cb];if(!sa._forever[ta.cb])delete sa._callbacks[ta.cb];if(wa)wa(ta);}}function qa(ta,ua){if(ta=='facebook'){ua.relation='parent.parent';w.enqueue(ua);}else{ua.relation='parent.frames["'+ta+'"]';var va=la[ta];if(va){i.debug('Enqueuing message for plugin %s in %s',ta,va.protocol+'ProxyQueue');(va.protocol=='https'?y:x).enqueue(ua);}else{i.debug('Buffering message for plugin %s',ta);k.get(ta).enqueue(ua);}}}l.getOutQueue().start(function(ta){qa('facebook','FB_RPC:'+ta);});function ra(ta){if(ja)return;var ua=g.appendHidden(document.createElement('div')),va=r.create({blacklist:null,root:ua,channel:ga,flashUrl:q.Flash.path,whenReady:function(wa){ia=wa;var xa={channel:ga,origin:location.protocol+'//'+location.host,transport:va,xd_name:ta},ya='#'+j.encode(xa);if(m.getSecure()!==true)z=t({url:ea+ya,name:'fb_xdm_frame_http',id:'fb_xdm_frame_http',root:ua,'aria-hidden':true,title:ka,tabindex:-1});aa=t({url:fa+ya,name:'fb_xdm_frame_https',id:'fb_xdm_frame_https',root:ua,'aria-hidden':true,title:ka,tabindex:-1});},onMessage:pa});if(!va)n.log('jssdk_error',{appId:m.getClientID(),error:'XD_TRANSPORT',extra:{message:'Failed to create a valid transport'}});ja=true;}var sa={rpc:l,_callbacks:{},_forever:{},_channel:ga,_origin:ha,onMessage:pa,recv:pa,init:ra,sendToFacebook:qa,inform:function(ta,ua,va,wa){qa('facebook',{method:ta,params:ES('JSON','stringify',false,ua||{}),behavior:wa||'p',relation:va});},handler:function(ta,ua,va,wa){var xa='#'+j.encode({cb:this.registerCallback(ta,va,wa),origin:ha+'/'+ga,domain:location.hostname,relation:ua||'opener'});return (location.protocol=='https:'?fa:ea)+xa;},registerCallback:function(ta,ua,va){va=va||v();if(ua)sa._forever[va]=true;sa._callbacks[va]=ta;return va;}};h.subscribe('init:post',function(ta){ra(ta.xdProxyName);var ua=u('xd_timeout');if(ua)setTimeout(function(){var va=aa&&(!!z==x.isStarted()&&!!aa==y.isStarted());if(!va)n.log('jssdk_error',{appId:m.getClientID(),error:'XD_INITIALIZATION',extra:{message:'Failed to initialize in '+ua+'ms'}});},ua);});e.exports=sa;},null);
__d("sdk.Auth",["sdk.Cookie","sdk.createIframe","DOMWrapper","sdk.feature","sdk.getContextType","guid","sdk.Impressions","Log","ObservableMixin","sdk.Runtime","sdk.SignedRequest","UrlMap","sdk.URI","sdk.XD"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t){var u,v,w=new o();function x(da,ea){var fa=p.getUserID(),ga='';if(da)if(da.userID){ga=da.userID;}else if(da.signedRequest){var ha=q.parse(da.signedRequest);if(ha&&ha.user_id)ga=ha.user_id;}var ia=p.getLoginStatus(),ja=(ia==='unknown'&&da)||(p.getUseCookie()&&p.getCookieUserID()!==ga),ka=fa&&!da,la=da&&fa&&fa!=ga,ma=da!=u,na=ea!=(ia||'unknown');p.setLoginStatus(ea);p.setAccessToken(da&&da.accessToken||null);p.setUserID(ga);u=da;var oa={authResponse:da,status:ea};if(ka||la)w.inform('logout',oa);if(ja||la)w.inform('login',oa);if(ma)w.inform('authresponse.change',oa);if(na)w.inform('status.change',oa);return oa;}function y(){return u;}function z(da,ea,fa){return function(ga){var ha;if(ga&&ga.access_token){var ia=q.parse(ga.signed_request);ea={accessToken:ga.access_token,userID:ia.user_id,expiresIn:parseInt(ga.expires_in,10),signedRequest:ga.signed_request};if(ga.granted_scopes)ea.grantedScopes=ga.granted_scopes;if(p.getUseCookie()){var ja=ea.expiresIn===0?0:ES('Date','now',false)+ea.expiresIn*1000,ka=g.getDomain();if(!ka&&ga.base_domain)g.setDomain('.'+ga.base_domain);g.setSignedRequestCookie(ga.signed_request,ja);}ha='connected';x(ea,ha);}else if(fa==='logout'||fa==='login_status'){if(ga.error&&ga.error==='not_authorized'){ha='not_authorized';}else ha='unknown';x(null,ha);if(p.getUseCookie())g.clearSignedRequestCookie();}if(ga&&ga.https==1)p.setSecure(true);if(da)da({authResponse:ea,status:p.getLoginStatus()});return ea;};}function aa(da){var ea,fa=ES('Date','now',false);if(v){clearTimeout(v);v=null;}var ga=z(da,u,'login_status'),ha=s(r.resolve('www',true)+'/connect/ping').setQueryData({client_id:p.getClientID(),response_type:'token,signed_request,code',domain:location.hostname,origin:k(),redirect_uri:t.handler(function(ia){if(j('e2e_ping_tracking',true)){var ja={init:fa,close:ES('Date','now',false),method:'ping'};n.debug('e2e: %s',ES('JSON','stringify',false,ja));m.log(114,{payload:ja});}ea.parentNode.removeChild(ea);if(ga(ia))v=setTimeout(function(){aa(function(){});},1200000);},'parent'),sdk:'joey',kid_directed_site:p.getKidDirectedSite()});ea=h({root:i.getRoot(),name:l(),url:ha.toString(),style:{display:'none'}});}var ba;function ca(da,ea){if(!p.getClientID()){n.warn('FB.getLoginStatus() called before calling FB.init().');return;}if(da)if(!ea&&ba=='loaded'){da({status:p.getLoginStatus(),authResponse:y()});return;}else w.subscribe('FB.loginStatus',da);if(!ea&&ba=='loading')return;ba='loading';var fa=function(ga){ba='loaded';w.inform('FB.loginStatus',ga);w.clearSubscribers('FB.loginStatus');};aa(fa);}ES('Object','assign',false,w,{getLoginStatus:ca,fetchLoginStatus:aa,setAuthResponse:x,getAuthResponse:y,parseSignedRequest:q.parse,xdResponseWrapper:z});e.exports=w;},null);
__d("toArray",["invariant"],function(a,b,c,d,e,f,g){function h(i){var j=i.length;g(!ES('Array','isArray',false,i)&&(typeof i==='object'||typeof i==='function'));g(typeof j==='number');g(j===0||(j-1) in i);if(i.hasOwnProperty)try{return Array.prototype.slice.call(i);}catch(k){}var l=Array(j);for(var m=0;m<j;m++)l[m]=i[m];return l;}e.exports=h;},null);
__d("createArrayFrom",["toArray"],function(a,b,c,d,e,f,g){function h(j){return (!!j&&(typeof j=='object'||typeof j=='function')&&('length' in j)&&!('setInterval' in j)&&(typeof j.nodeType!='number')&&(ES('Array','isArray',false,j)||('callee' in j)||('item' in j)));}function i(j){if(!h(j)){return [j];}else if(ES('Array','isArray',false,j)){return j.slice();}else return g(j);}e.exports=i;},null);
__d("sdk.DOM",["Assert","createArrayFrom","sdk.domReady","UserAgent_DEPRECATED"],function(a,b,c,d,e,f,g,h,i,j){var k={};function l(z,aa){var ba=(z.getAttribute(aa)||z.getAttribute(aa.replace(/_/g,'-'))||z.getAttribute(aa.replace(/-/g,'_'))||z.getAttribute(aa.replace(/-/g,''))||z.getAttribute(aa.replace(/_/g,''))||z.getAttribute('data-'+aa)||z.getAttribute('data-'+aa.replace(/_/g,'-'))||z.getAttribute('data-'+aa.replace(/-/g,'_'))||z.getAttribute('data-'+aa.replace(/-/g,''))||z.getAttribute('data-'+aa.replace(/_/g,'')));return ba?String(ba):null;}function m(z,aa){var ba=l(z,aa);return ba?/^(true|1|yes|on)$/.test(ba):null;}function n(z,aa){g.isTruthy(z,'element not specified');g.isString(aa);try{return String(z[aa]);}catch(ba){throw new Error('Could not read property '+aa+' : '+ba.message);}}function o(z,aa){g.isTruthy(z,'element not specified');g.isString(aa);try{z.innerHTML=aa;}catch(ba){throw new Error('Could not set innerHTML : '+ba.message);}}function p(z,aa){g.isTruthy(z,'element not specified');g.isString(aa);var ba=' '+n(z,'className')+' ';return ES(ba,'indexOf',true,' '+aa+' ')>=0;}function q(z,aa){g.isTruthy(z,'element not specified');g.isString(aa);if(!p(z,aa))z.className=n(z,'className')+' '+aa;}function r(z,aa){g.isTruthy(z,'element not specified');g.isString(aa);var ba=new RegExp('\\s*'+aa,'g');z.className=ES(n(z,'className').replace(ba,''),'trim',true);}function s(z,aa,ba){g.isString(z);aa=aa||document.body;ba=ba||'*';if(aa.querySelectorAll)return h(aa.querySelectorAll(ba+'.'+z));var ca=aa.getElementsByTagName(ba),da=[];for(var ea=0,fa=ca.length;ea<fa;ea++)if(p(ca[ea],z))da[da.length]=ca[ea];return da;}function t(z,aa){g.isTruthy(z,'element not specified');g.isString(aa);aa=aa.replace(/-(\w)/g,function(da,ea){return ea.toUpperCase();});var ba=z.currentStyle||document.defaultView.getComputedStyle(z,null),ca=ba[aa];if(/backgroundPosition?/.test(aa)&&/top|left/.test(ca))ca='0%';return ca;}function u(z,aa,ba){g.isTruthy(z,'element not specified');g.isString(aa);aa=aa.replace(/-(\w)/g,function(ca,da){return da.toUpperCase();});z.style[aa]=ba;}function v(z,aa){var ba=true;for(var ca=0,da;da=aa[ca++];)if(!(da in k)){ba=false;k[da]=true;}if(ba)return;if(j.ie()<11){try{document.createStyleSheet().cssText=z;}catch(ea){if(document.styleSheets[0])document.styleSheets[0].cssText+=z;}}else{var fa=document.createElement('style');fa.type='text/css';fa.textContent=z;document.getElementsByTagName('head')[0].appendChild(fa);}}function w(){var z=(document.documentElement&&document.compatMode=='CSS1Compat')?document.documentElement:document.body;return {scrollTop:z.scrollTop||document.body.scrollTop,scrollLeft:z.scrollLeft||document.body.scrollLeft,width:window.innerWidth?window.innerWidth:z.clientWidth,height:window.innerHeight?window.innerHeight:z.clientHeight};}function x(z){g.isTruthy(z,'element not specified');var aa=0,ba=0;do{aa+=z.offsetLeft;ba+=z.offsetTop;}while(z=z.offsetParent);return {x:aa,y:ba};}var y={containsCss:p,addCss:q,removeCss:r,getByClass:s,getStyle:t,setStyle:u,getAttr:l,getBoolAttr:m,getProp:n,html:o,addCssRules:v,getViewportInfo:w,getPosition:x,ready:i};e.exports=y;},null);
__d("sdk.ErrorHandling",["sdk.feature","ManagedError","sdk.Runtime","sdk.Scribe","UserAgent_DEPRECATED","wrapFunction"],function(a,b,c,d,e,f,g,h,i,j,k,l){var m=g('error_handling',false),n='';function o(u){var v=u._originalError;delete u._originalError;j.log('jssdk_error',{appId:i.getClientID(),error:u.name||u.message,extra:u});throw v;}function p(u){var v={line:u.lineNumber||u.line,message:u.message,name:u.name,script:u.fileName||u.sourceURL||u.script,stack:u.stackTrace||u.stack};v._originalError=u;if(k.chrome()&&/([\w:\.\/]+\.js):(\d+)/.test(u.stack)){v.script=RegExp.$1;v.line=parseInt(RegExp.$2,10);}for(var w in v)(v[w]==null&&delete v[w]);return v;}function q(u,v){return function(){if(!m)return u.apply(this,arguments);try{n=v;return u.apply(this,arguments);}catch(w){if(w instanceof h)throw w;var x=p(w);x.entry=v;var y=ES(Array.prototype.slice.call(arguments),'map',true,function(z){var aa=Object.prototype.toString.call(z);return (/^\[object (String|Number|Boolean|Object|Date)\]$/).test(aa)?z:z.toString();});x.args=ES('JSON','stringify',false,y).substring(0,200);o(x);}finally{n='';}};}function r(u){if(!u.__wrapper)u.__wrapper=function(){try{return u.apply(this,arguments);}catch(v){window.setTimeout(function(){throw v;},0);return false;}};return u.__wrapper;}function s(u,v){return function(w,x){var y=v+':'+(n||'[global]')+':'+(w.name||'[anonymous]'+(arguments.callee.caller.name?'('+arguments.callee.caller.name+')':''));return u(l(w,'entry',y),x);};}if(m){setTimeout=s(setTimeout,'setTimeout');setInterval=s(setInterval,'setInterval');l.setWrapper(q,'entry');}var t={guard:q,unguard:r};e.exports=t;},null);
__d("sdk.Insights",["sdk.Impressions"],function(a,b,c,d,e,f,g){var h={TYPE:{NOTICE:'notice',WARNING:'warn',ERROR:'error'},CATEGORY:{DEPRECATED:'deprecated',APIERROR:'apierror'},log:function(i,j,k){var l={source:'jssdk',type:i,category:j,payload:k};g.log(113,l);},impression:g.impression};e.exports=h;},null);
__d("FB",["sdk.Auth","JSSDKCssConfig","dotAccess","sdk.domReady","sdk.DOM","sdk.ErrorHandling","sdk.Content","DOMWrapper","GlobalCallback","sdk.Insights","Log","sdk.Runtime","sdk.Scribe","JSSDKConfig"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t){var u,v,w=i(t,'api.mode'),x={};u=window.FB={};var y={};q.level=1;o.setPrefix('FB.__globalCallbacks');var z=document.createElement('div');n.setRoot(z);j(function(){q.info('domReady');m.appendHidden(z);if(h.rules)k.addCssRules(h.rules,h.components);});r.subscribe('AccessToken.change',function(ca){if(!ca&&r.getLoginStatus()==='connected')g.getLoginStatus(null,true);});if(i(t,'api.whitelist.length')){v={};ES(t.api.whitelist,'forEach',true,function(ca){v[ca]=1;});}function aa(ca,da,ea,fa){var ga;if(/^_/.test(ea)){ga='hide';}else if(v&&!v[da])ga=w;switch(ga){case 'hide':return;case 'stub':return function(){q.warn('The method FB.%s has been removed from the JS SDK.',da);};break;default:return l.guard(function(){if(ga==='warn'){q.warn('The method FB.%s is not officially supported by '+'Facebook and access to it will soon be removed.',da);if(!x.hasOwnProperty(da)){p.log(p.TYPE.WARNING,p.CATEGORY.DEPRECATED,'FB.'+da);s.log('jssdk_error',{appId:r.getClientID(),error:'Private method used',extra:{args:da}});x[da]=true;}}function ha(pa){if(ES('Array','isArray',false,pa))return ES(pa,'map',true,ha);if(pa&&typeof pa==='object'&&pa.__wrapped)return pa.__wrapped;return typeof pa==='function'&&/^function/.test(pa.toString())?l.unguard(pa):pa;}var ia=ES(Array.prototype.slice.call(arguments),'map',true,ha),ja=ca.apply(fa,ia),ka,la=true;if(ja&&typeof ja==='object'){var ma=Function();ma.prototype=ja;ka=new ma();ka.__wrapped=ja;for(var na in ja){var oa=ja[na];if(typeof oa!=='function'||na==='constructor')continue;la=false;ka[na]=aa(oa,da+':'+na,na,ja);}}if(!la)return ka;return la?ja:ka;},da);}}function ba(ca,da){var ea=ca?i(u,ca,true):u;ES(ES('Object','keys',false,da),'forEach',true,function(fa){var ga=da[fa];if(typeof ga==='function'){var ha=(ca?ca+'.':'')+fa,ia=aa(ga,ha,fa,da);if(ia)ea[fa]=ia;}else if(typeof ga==='object'){ha=(ca?ca+'.':'')+fa;if(v&&v[ha])ea[fa]=ga;}});}r.setSecure((function(){var ca=/iframe_canvas|app_runner/.test(window.name),da=/dialog/.test(window.name);if(location.protocol=='https:'&&(window==top||!(ca||da)))return true;if(/_fb_https?/.test(window.name))return ES(window.name,'indexOf',true,'_fb_https')!=-1;})());ES('Object','assign',false,y,{provide:ba});e.exports=y;},null);
__d("ArgumentError",["ManagedError"],function(a,b,c,d,e,f,g){function h(i,j){g.prototype.constructor.apply(this,arguments);}h.prototype=new g();h.prototype.constructor=h;e.exports=h;},null);
__d("CORSRequest",["wrapFunction","QueryString"],function(a,b,c,d,e,f,g,h){function i(l,m){if(!self.XMLHttpRequest)return null;var n=new XMLHttpRequest(),o=function(){};if('withCredentials' in n){n.open(l,m,true);n.setRequestHeader('Content-type','application/x-www-form-urlencoded');}else if(self.XDomainRequest){n=new XDomainRequest();try{n.open(l,m);n.onprogress=n.ontimeout=o;}catch(p){return null;}}else return null;var q={send:function(t){n.send(t);}},r=g(function(){r=o;if('onload' in q)q.onload(n);},'entry','XMLHttpRequest:load'),s=g(function(){s=o;if('onerror' in q)q.onerror(n);},'entry','XMLHttpRequest:error');n.onload=function(){r();};n.onerror=function(){s();};n.onreadystatechange=function(){if(n.readyState==4)if(n.status==200){r();}else s();};return q;}function j(l,m,n,o){n.suppress_http_code=1;var p=h.encode(n);if(m!='post'){l=h.appendToUrl(l,p);p='';}var q=i(m,l);if(!q)return false;q.onload=function(r){o(ES('JSON','parse',false,r.responseText));};q.onerror=function(r){if(r.responseText){o(ES('JSON','parse',false,r.responseText));}else o({error:{type:'http',message:'unknown error',status:r.status}});};q.send(p);return true;}var k={execute:j};e.exports=k;},null);
__d("FlashRequest",["DOMWrapper","Flash","GlobalCallback","QueryString","Queue"],function(a,b,c,d,e,f,g,h,i,j,k){var l,m={},n,o;function p(){if(!n)throw new Error('swfUrl has not been set');var s=i.create(function(){l.start(function(u){var v=o.execute(u.method,u.url,u.body);if(!v)throw new Error('Could create request');m[v]=u.callback;});}),t=i.create(function(u,v,w){var x;try{x=ES('JSON','parse',false,decodeURIComponent(w));}catch(y){x={error:{type:'SyntaxError',message:y.message,status:v,raw:w}};}m[u](x);delete m[u];});o=h.embed(n,g.getRoot(),null,{log:false,initCallback:s,requestCallback:t});}function q(s,t,u,v){u.suppress_http_code=1;if(!u.method)u.method=t;var w=j.encode(u);if(t==='get'&&s.length+w.length<2000){s=j.appendToUrl(s,w);w='';}else t='post';if(!l){if(!h.isAvailable())return false;l=new k();p();}l.enqueue({method:t,url:s,body:w,callback:v});return true;}var r={setSwfUrl:function(s){n=s;},execute:q};e.exports=r;},null);
__d("flattenObject",[],function(a,b,c,d,e,f){function g(h){var i={};for(var j in h)if(h.hasOwnProperty(j)){var k=h[j];if(null===k||undefined===k){continue;}else if(typeof k=='string'){i[j]=k;}else i[j]=ES('JSON','stringify',false,k);}return i;}e.exports=g;},null);
__d("JSONPRequest",["DOMWrapper","GlobalCallback","QueryString"],function(a,b,c,d,e,f,g,h,i){function j(l,m,n,o){var p=document.createElement('script'),q=function(s){q=function(){};h.remove(n.callback);o(s);p.parentNode.removeChild(p);};n.callback=h.create(q);if(!n.method)n.method=m;l=i.appendToUrl(l,n);if(l.length>2000){h.remove(n.callback);return false;}p.onerror=function(){q({error:{type:'http',message:'unknown error'}});};var r=function(){setTimeout(function(){q({error:{type:'http',message:'unknown error'}});},0);};if(p.addEventListener){p.addEventListener('load',r,false);}else p.onreadystatechange=function(){if(/loaded|complete/.test(this.readyState))r();};p.src=l;g.getRoot().appendChild(p);return true;}var k={execute:j};e.exports=k;},null);
__d("ApiClient",["ArgumentError","Assert","CORSRequest","FlashRequest","flattenObject","JSONPRequest","Log","ObservableMixin","sprintf","sdk.URI","UrlMap","ApiClientConfig","invariant"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s){var t,u,v,w={get:true,post:true,'delete':true,put:true},x={fql_query:true,fql_multiquery:true,friends_get:true,notifications_get:true,stream_get:true,users_getinfo:true},y=[],z=[],aa=null,ba=50,ca=105440539523;function da(la,ma,na,oa){if(v)na=ES('Object','assign',false,{},v,na);na.access_token=na.access_token||t;na.pretty=na.pretty||0;na=k(na);var pa={jsonp:l,cors:i,flash:j},qa;if(na.transport){qa=[na.transport];delete na.transport;}else qa=['jsonp','cors','flash'];for(var ra=0;ra<qa.length;ra++){var sa=pa[qa[ra]],ta=ES('Object','assign',false,{},na);if(sa.execute(la,ma,ta,oa))return;}oa({error:{type:'no-transport',message:'Could not find a usable transport for request'}});}function ea(la,ma,na,oa,pa){ka.inform('request.complete',ma,na,oa,pa);if(la)la(pa);}function fa(la){var ma=la.shift();h.isString(ma,'Invalid path');if(!/^https?/.test(ma)&&ma.charAt(0)!=='/')ma='/'+ma;var na,oa={};try{na=new p(ma);}catch(pa){throw new g(pa.message,pa);}ES(la,'forEach',true,function(ta){return oa[typeof ta]=ta;});var qa=(oa.string||'get').toLowerCase();h.isTrue(w.hasOwnProperty(qa),o('Invalid method passed to ApiClient: %s',qa));var ra=oa['function'];if(!ra)m.warn('No callback passed to the ApiClient');if(oa.object)na.addQueryData(oa.object);var sa=na.getQueryData();sa.method=qa;return {uri:na,callback:ra,params:sa};}function ga(){var la=Array.prototype.slice.call(arguments,0),ma=fa(la),na=ma.uri,oa=ma.callback,pa=ma.params,qa=pa.method,ra=na.getProtocol()&&na.getDomain()?na.setQueryData({}).toString():q.resolve('graph')+na.getPath();da(ra,qa=='get'?'get':'post',pa,ES(ea,'bind',true,null,oa,na.getPath(),qa,pa));}function ha(){var la=Array.prototype.slice.call(arguments,0),ma=fa(la),na=ma.uri,oa=ma.callback,pa=ma.params,qa=pa.method,ra={method:qa,relative_url:na.removeQueryData('method').toString()};if(qa.toLowerCase()=='post'){ra.body=na.getQueryData();ra.relative_url=na.setQueryData({}).toString();}y.push(ra);z.push(oa);if(y.length==ba){ia();}else if(!aa)aa=setTimeout(ia,0);}function ia(){s(y.length>0);var la=y,ma=z;y=[];z=[];aa=null;ga('/','POST',{batch:ES('JSON','stringify',false,la),include_headers:false,batch_app_id:u||ca},function(na){if(ES('Array','isArray',false,na)){ES(na,'forEach',true,function(oa,pa){ma[pa](ES('JSON','parse',false,oa.body));});}else ES(ma,'forEach',true,function(oa){return oa({error:{message:'Fatal: batch call failed.'}});});});}function ja(la,ma){h.isObject(la);h.isString(la.method,'method missing');if(!ma)m.warn('No callback passed to the ApiClient');var na=la.method.toLowerCase().replace('.','_');la.format='json-strings';la.api_key=u;var oa=na in x?'api_read':'api',pa=q.resolve(oa)+'/restserver.php',qa=ES(ea,'bind',true,null,ma,'/restserver.php','get',la);da(pa,'get',la,qa);}var ka=ES('Object','assign',false,new n(),{setAccessToken:function(la){t=la;},setClientID:function(la){u=la;},setDefaultParams:function(la){v=la;},rest:ja,graph:ga,scheduleBatchCall:ha});j.setSwfUrl(r.FlashRequest.swfUrl);e.exports=ka;},null);
__d("sdk.PlatformVersioning",["sdk.Runtime","ManagedError"],function(a,b,c,d,e,f,g,h){var i=/^v\d+\.\d\d?$/,j={REGEX:i,assertVersionIsSet:function(){if(!g.getVersion())throw new h('init not called with valid version');},assertValidVersion:function(k){if(!i.test(k))throw new h('invalid version specified');}};e.exports=j;},null);
__d("sdk.api",["ApiClient","sdk.PlatformVersioning","sdk.Runtime","sdk.URI"],function(a,b,c,d,e,f,g,h,i,j){var k;i.subscribe('ClientID.change',function(m){g.setClientID(m);});i.subscribe('AccessToken.change',function(m){k=m;g.setAccessToken(m);});g.setDefaultParams({sdk:'joey'});g.subscribe('request.complete',function(m,n,o,p){var q=false;if(p&&typeof p=='object')if(p.error){if(p.error=='invalid_token'||(p.error.type=='OAuthException'&&p.error.code==190))q=true;}else if(p.error_code)if(p.error_code=='190')q=true;if(q&&k===i.getAccessToken())i.setAccessToken(null);});g.subscribe('request.complete',function(m,n,o,p){if(((m=='/me/permissions'&&n==='delete')||(m=='/restserver.php'&&o.method=='Auth.revokeAuthorization'))&&p===true)i.setAccessToken(null);});function l(m){if(typeof m==='string'){if(i.getIsVersioned()){h.assertVersionIsSet();if(!/https?/.test(m)&&m.charAt(0)!=='/')m='/'+m;m=j(m).setDomain(null).setProtocol(null).toString();if(!h.REGEX.test(m.substring(1,ES(m,'indexOf',true,'/',1))))m='/'+i.getVersion()+m;var n=[m].concat(Array.prototype.slice.call(arguments,1));g.graph.apply(g,n);}else g.graph.apply(g,arguments);}else g.rest.apply(g,arguments);}e.exports=l;},null);
__d("legacy:fb.api",["FB","sdk.api"],function(a,b,c,d,e,f,g,h){g.provide('',{api:h});},3);
__d("sdk.Canvas.Environment",["sdk.RPC"],function(a,b,c,d,e,f,g){function h(k){g.remote.getPageInfo(function(l){k(l.result);});}function i(k,l){g.remote.scrollTo({x:k||0,y:l||0});}g.stub('getPageInfo');g.stub('scrollTo');var j={getPageInfo:h,scrollTo:i};e.exports=j;},null);
__d("sdk.Intl",["Log"],function(a,b,c,d,e,f,g){var h=('['+'.!?'+'\u3002'+'\uFF01'+'\uFF1F'+'\u0964'+'\u2026'+'\u0EAF'+'\u1801'+'\u0E2F'+'\uFF0E'+']');function i(l){if(typeof l!='string')return false;return !!l.match(new RegExp(h+'['+')"'+"'"+'\u00BB'+'\u0F3B'+'\u0F3D'+'\u2019'+'\u201D'+'\u203A'+'\u3009'+'\u300B'+'\u300D'+'\u300F'+'\u3011'+'\u3015'+'\u3017'+'\u3019'+'\u301B'+'\u301E'+'\u301F'+'\uFD3F'+'\uFF07'+'\uFF09'+'\uFF3D'+'\\s'+']*$'));}function j(l,m){if(m!==undefined)if(typeof m!='object'){g.error('The second arg to FB.Intl.tx() must be an Object for '+'FB.Intl.tx('+l+', ...)');}else{var n;for(var o in m)if(m.hasOwnProperty(o)){if(i(m[o])){n=new RegExp('\\{'+o+'\\}'+h+'*','g');}else n=new RegExp('\\{'+o+'\\}','g');l=l.replace(n,m[o]);}}return l;}function k(){throw new Error('Placeholder function');}k._=j;e.exports={tx:k};},null);
__d("sdk.Dialog",["sdk.Canvas.Environment","sdk.Content","sdk.DOM","DOMEventListener","sdk.Intl","ObservableMixin","sdk.Runtime","Type","UserAgent_DEPRECATED","sdk.feature"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p){var q=590,r=500,s=240,t=575,u=function(){var y;if(p('dialog_resize_refactor')){var z=v();y=z&&(z.height>=q||z.width>=r);}else y=!!o.ipad();u=function(){return y;};return y;};function v(){if(p('dialog_resize_refactor')){var y=i.getViewportInfo();if(y.height&&y.width)return {width:Math.min(y.width,q),height:Math.min(y.height,r)};}return null;}var w=n.extend({constructor:function y(z,aa){this.parent();this.id=z;this.display=aa;this._e2e={};if(!x._dialogs){x._dialogs={};x._addOrientationHandler();}x._dialogs[z]=this;this.trackEvent('init');},trackEvent:function(y,z){if(this._e2e[y])return this;this._e2e[y]=z||ES('Date','now',false);if(y=='close')this.inform('e2e:end',this._e2e);return this;},trackEvents:function(y){if(typeof y==='string')y=ES('JSON','parse',false,y);for(var z in y)if(y.hasOwnProperty(z))this.trackEvent(z,y[z]);return this;}},l),x={newInstance:function(y,z){return new w(y,z);},_dialogs:null,_lastYOffset:0,_loaderEl:null,_overlayEl:null,_stack:[],_active:null,get:function(y){return x._dialogs[y];},_findRoot:function(y){while(y){if(i.containsCss(y,'fb_dialog'))return y;y=y.parentNode;}},_createWWWLoader:function(y){y=y?y:460;return x.create({content:('<div class="dialog_title">'+'  <a id="fb_dialog_loader_close">'+'    <div class="fb_dialog_close_icon"></div>'+'  </a>'+'  <span>Facebook</span>'+'  <div style="clear:both;"></div>'+'</div>'+'<div class="dialog_content"></div>'+'<div class="dialog_footer"></div>'),width:y});},_createMobileLoader:function(){var y=o.nativeApp()?'':('<table>'+'  <tbody>'+'    <tr>'+'      <td class="header_left">'+'        <label class="touchable_button">'+'          <input type="submit" value="'+k.tx._("Cancel")+'"'+'            id="fb_dialog_loader_close"/>'+'        </label>'+'      </td>'+'      <td class="header_center">'+'        <div>'+k.tx._("Loading...")+'</div>'+'      </td>'+'      <td class="header_right">'+'      </td>'+'    </tr>'+'  </tbody>'+'</table>');return x.create({classes:'loading'+(u()?' centered':''),content:('<div class="dialog_header">'+y+'</div>')});},_restoreBodyPosition:function(){if(!u()){var y=document.getElementsByTagName('body')[0];i.removeCss(y,'fb_hidden');}},_showTabletOverlay:function(){if(!u())return;if(!x._overlayEl){x._overlayEl=document.createElement('div');x._overlayEl.setAttribute('id','fb_dialog_ipad_overlay');h.append(x._overlayEl,null);}x._overlayEl.className='';},_hideTabletOverlay:function(){if(u())x._overlayEl.className='hidden';},showLoader:function(y,z){x._showTabletOverlay();if(!x._loaderEl)x._loaderEl=x._findRoot(o.mobile()?x._createMobileLoader():x._createWWWLoader(z));if(!y)y=function(){};var aa=document.getElementById('fb_dialog_loader_close');i.removeCss(aa,'fb_hidden');aa.onclick=function(){x._hideLoader();x._restoreBodyPosition();x._hideTabletOverlay();y();};var ba=document.getElementById('fb_dialog_ipad_overlay');if(ba)ba.ontouchstart=aa.onclick;x._makeActive(x._loaderEl);},_hideLoader:function(){if(x._loaderEl&&x._loaderEl==x._active)x._loaderEl.style.top='-10000px';},_makeActive:function(y){x._setDialogSizes();x._lowerActive();x._active=y;if(m.isEnvironment(m.ENVIRONMENTS.CANVAS))g.getPageInfo(function(z){x._centerActive(z);});x._centerActive();},_lowerActive:function(){if(!x._active)return;x._active.style.top='-10000px';x._active=null;},_removeStacked:function(y){x._stack=ES(x._stack,'filter',true,function(z){return z!=y;});},_centerActive:function(y){var z=x._active;if(!z)return;var aa=i.getViewportInfo(),ba=parseInt(z.offsetWidth,10),ca=parseInt(z.offsetHeight,10),da=aa.scrollLeft+(aa.width-ba)/2,ea=(aa.height-ca)/2.5;if(da<ea)ea=da;var fa=aa.height-ca-ea,ga=(aa.height-ca)/2;if(y)ga=y.scrollTop-y.offsetTop+(y.clientHeight-ca)/2;if(ga<ea){ga=ea;}else if(ga>fa)ga=fa;ga+=aa.scrollTop;if(o.mobile()){var ha=100;if(u()){ha+=(aa.height-ca)/2;}else{var ia=document.getElementsByTagName('body')[0];i.addCss(ia,'fb_hidden');if(p('dialog_resize_refactor'))ia.style.width='auto';ga=10000;}var ja=i.getByClass('fb_dialog_padding',z);if(ja.length)ja[0].style.height=ha+'px';}z.style.left=(da>0?da:0)+'px';z.style.top=(ga>0?ga:0)+'px';},_setDialogSizes:function(){if(!o.mobile()||u())return;for(var y in x._dialogs)if(x._dialogs.hasOwnProperty(y)){var z=document.getElementById(y);if(z){z.style.width=x.getDefaultSize().width+'px';z.style.height=x.getDefaultSize().height+'px';}}},getDefaultSize:function(){if(o.mobile()){var y=v();if(y)return y;if(o.ipad())return {width:r,height:q};if(o.android()){return {width:screen.availWidth,height:screen.availHeight};}else{var z=window.innerWidth,aa=window.innerHeight,ba=z/aa>1.2;return {width:z,height:Math.max(aa,(ba?screen.width:screen.height))};}}return {width:t,height:s};},_handleOrientationChange:function(y){var z=p('dialog_resize_refactor',false)?i.getViewportInfo().width:screen.availWidth;if(o.android()&&z==x._availScreenWidth){setTimeout(x._handleOrientationChange,50);return;}x._availScreenWidth=z;if(u()){x._centerActive();}else{var aa=x.getDefaultSize().width;for(var ba in x._dialogs)if(x._dialogs.hasOwnProperty(ba)){var ca=document.getElementById(ba);if(ca)ca.style.width=aa+'px';}}},_addOrientationHandler:function(){if(!o.mobile())return;var y="onorientationchange" in window?'orientationchange':'resize';x._availScreenWidth=p('dialog_resize_refactor',false)?i.getViewportInfo().width:screen.availWidth;j.add(window,y,x._handleOrientationChange);},create:function(y){y=y||{};var z=document.createElement('div'),aa=document.createElement('div'),ba='fb_dialog';if(y.closeIcon&&y.onClose){var ca=document.createElement('a');ca.className='fb_dialog_close_icon';ca.onclick=y.onClose;z.appendChild(ca);}ba+=' '+(y.classes||'');if(o.ie()){ba+=' fb_dialog_legacy';ES(['vert_left','vert_right','horiz_top','horiz_bottom','top_left','top_right','bottom_left','bottom_right'],'forEach',true,function(fa){var ga=document.createElement('span');ga.className='fb_dialog_'+fa;z.appendChild(ga);});}else ba+=o.mobile()?' fb_dialog_mobile':' fb_dialog_advanced';if(y.content)h.append(y.content,aa);z.className=ba;var da=parseInt(y.width,10);if(!isNaN(da))z.style.width=da+'px';aa.className='fb_dialog_content';z.appendChild(aa);if(o.mobile()){var ea=document.createElement('div');ea.className='fb_dialog_padding';z.appendChild(ea);}h.append(z);if(y.visible)x.show(z);return aa;},show:function(y){var z=x._findRoot(y);if(z){x._removeStacked(z);x._hideLoader();x._makeActive(z);x._stack.push(z);if('fbCallID' in y)x.get(y.fbCallID).inform('iframe_show').trackEvent('show');}},hide:function(y){var z=x._findRoot(y);x._hideLoader();if(z==x._active){x._lowerActive();x._restoreBodyPosition();x._hideTabletOverlay();if('fbCallID' in y)x.get(y.fbCallID).inform('iframe_hide').trackEvent('hide');}},remove:function(y){y=x._findRoot(y);if(y){var z=x._active==y;x._removeStacked(y);if(z){x._hideLoader();if(x._stack.length>0){x.show(x._stack.pop());}else{x._lowerActive();x._restoreBodyPosition();x._hideTabletOverlay();}}else if(x._active===null&&x._stack.length>0)x.show(x._stack.pop());setTimeout(function(){y.parentNode.removeChild(y);},3000);}},isActive:function(y){var z=x._findRoot(y);return z&&z===x._active;}};e.exports=x;},null);
__d("sdk.Frictionless",["sdk.Auth","sdk.api","sdk.Event","sdk.Dialog"],function(a,b,c,d,e,f,g,h,i,j){var k={_allowedRecipients:{},_useFrictionless:false,_updateRecipients:function(){k._allowedRecipients={};h('/me/apprequestformerrecipients',function(l){if(!l||l.error)return;ES(l.data,'forEach',true,function(m){k._allowedRecipients[m.recipient_id]=true;});});},init:function(){k._useFrictionless=true;g.getLoginStatus(function(l){if(l.status=='connected')k._updateRecipients();});i.subscribe('auth.login',function(l){if(l.authResponse)k._updateRecipients();});},_processRequestResponse:function(l,m){return function(n){var o=n&&n.updated_frictionless;if(k._useFrictionless&&o)k._updateRecipients();if(n){if(!m&&n.frictionless){j._hideLoader();j._restoreBodyPosition();j._hideIPadOverlay();}delete n.frictionless;delete n.updated_frictionless;}l&&l(n);};},isAllowed:function(l){if(!l)return false;if(typeof l==='number')return l in k._allowedRecipients;if(typeof l==='string')l=l.split(',');l=ES(l,'map',true,function(o){return ES(String(o),'trim',true);});var m=true,n=false;ES(l,'forEach',true,function(o){m=m&&o in k._allowedRecipients;n=true;});return m&&n;}};i.subscribe('init:post',function(l){if(l.frictionlessRequests)k.init();});e.exports=k;},null);
__d("sdk.Native",["Log","UserAgent_DEPRECATED"],function(a,b,c,d,e,f,g,h){var i='fbNativeReady',j={onready:function(k){if(!h.nativeApp()){g.error('FB.Native.onready only works when the page is rendered '+'in a WebView of the native Facebook app. Test if this is the '+'case calling FB.UA.nativeApp()');return;}if(window.__fbNative&&!this.nativeReady)ES('Object','assign',false,this,window.__fbNative);if(this.nativeReady){k();}else{var l=function(m){window.removeEventListener(i,l);this.onready(k);};window.addEventListener(i,l,false);}}};e.exports=j;},null);
__d("resolveURI",[],function(a,b,c,d,e,f){function g(h){if(!h)return window.location.href;h=h.replace(/&/g,'&amp;').replace(/"/g,'&quot;');var i=document.createElement('div');i.innerHTML='<a href="'+h+'"></a>';return i.firstChild.href;}e.exports=g;},null);
__d("sdk.UIServer",["sdk.Auth","sdk.Content","createObjectFrom","sdk.Dialog","sdk.DOM","sdk.Event","flattenObject","sdk.Frictionless","sdk.getContextType","guid","insertIframe","Log","sdk.Native","QueryString","resolveURI","sdk.RPC","sdk.Runtime","JSSDKConfig","UrlMap","UserAgent_DEPRECATED","sdk.XD"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,aa){var ba={transform:function(ea){if(ea.params.display==='touch'&&ea.params.access_token&&window.postMessage){ea.params.channel=da._xdChannelHandler(ea.id,'parent');if(!z.nativeApp())ea.params.in_iframe=1;return ea;}else return da.genericTransform(ea);},getXdRelation:function(ea){var fa=ea.display;if(fa==='touch'&&window.postMessage&&ea.in_iframe)return 'parent';return da.getXdRelation(ea);}},ca={'stream.share':{size:{width:670,height:340},url:'sharer.php',transform:function(ea){if(!ea.params.u)ea.params.u=window.location.toString();ea.params.display='popup';return ea;}},apprequests:{transform:function(ea){ea=ba.transform(ea);ea.params.frictionless=n&&n._useFrictionless;if(ea.params.frictionless){if(n.isAllowed(ea.params.to)){ea.params.display='iframe';ea.params.in_iframe=true;ea.hideLoader=true;}ea.cb=n._processRequestResponse(ea.cb,ea.hideLoader);}ea.closeIcon=false;return ea;},getXdRelation:ba.getXdRelation},feed:ba,'permissions.oauth':{url:'dialog/oauth',size:{width:(z.mobile()?null:475),height:(z.mobile()?null:183)},transform:function(ea){if(!w.getClientID()){r.error('FB.login() called before FB.init().');return;}if(g.getAuthResponse()&&!ea.params.scope&&!ea.params.auth_type){r.error('FB.login() called when user is already connected.');ea.cb&&ea.cb({status:w.getLoginStatus(),authResponse:g.getAuthResponse()});return;}var fa=ea.cb,ga=ea.id;delete ea.cb;var ha=ES('Object','keys',false,ES('Object','assign',false,ea.params.response_type?i(ea.params.response_type.split(',')):{},{token:true,signed_request:true})).join(',');if(ea.params.display==='async'){ES('Object','assign',false,ea.params,{client_id:w.getClientID(),origin:o(),response_type:ha,domain:location.hostname});ea.cb=g.xdResponseWrapper(fa,g.getAuthResponse(),'permissions.oauth');}else ES('Object','assign',false,ea.params,{client_id:w.getClientID(),redirect_uri:u(da.xdHandler(fa,ga,'opener',g.getAuthResponse(),'permissions.oauth')),origin:o(),response_type:ha,domain:location.hostname});return ea;}},'auth.logout':{url:'logout.php',transform:function(ea){if(!w.getClientID()){r.error('FB.logout() called before calling FB.init().');}else if(!g.getAuthResponse()){r.error('FB.logout() called without an access token.');}else{ea.params.next=da.xdHandler(ea.cb,ea.id,'parent',g.getAuthResponse(),'logout');return ea;}}},'login.status':{url:'dialog/oauth',transform:function(ea){var fa=ea.cb,ga=ea.id;delete ea.cb;ES('Object','assign',false,ea.params,{client_id:w.getClientID(),redirect_uri:da.xdHandler(fa,ga,'parent',g.getAuthResponse(),'login_status'),origin:o(),response_type:'token,signed_request,code',domain:location.hostname});return ea;}}},da={Methods:ca,_loadedNodes:{},_defaultCb:{},_resultToken:'"xxRESULTTOKENxx"',genericTransform:function(ea){if(ea.params.display=='dialog'||ea.params.display=='iframe')ES('Object','assign',false,ea.params,{display:'iframe',channel:da._xdChannelHandler(ea.id,'parent.parent')},true);return ea;},checkOauthDisplay:function(ea){var fa=ea.scope||ea.perms||w.getScope();if(!fa)return ea.display;var ga=fa.split(/\s|,/g);for(var ha=0;ha<ga.length;ha++)if(!x.initSitevars.iframePermissions[ES(ga[ha],'trim',true)])return 'popup';return ea.display;},prepareCall:function(ea,fa){var ga=ea.method.toLowerCase(),ha=da.Methods.hasOwnProperty(ga)?ES('Object','assign',false,{},da.Methods[ga]):{},ia=p(),ja=w.getSecure()||(ga!=='auth.status'&&ga!='login.status');ES('Object','assign',false,ea,{app_id:w.getClientID(),locale:w.getLocale(),sdk:'joey',access_token:ja&&w.getAccessToken()||undefined});ea.display=da.getDisplayMode(ha,ea);if(!ha.url)ha.url='dialog/'+ga;if((ha.url=='dialog/oauth'||ha.url=='dialog/permissions.request')&&(ea.display=='iframe'||(ea.display=='touch'&&ea.in_iframe)))ea.display=da.checkOauthDisplay(ea);if(w.getIsVersioned()&&ha.url.substring(0,7)==='dialog/')ha.url=ea.version+'/'+ha.url;var ka={cb:fa,id:ia,size:ha.size||da.getDefaultSize(),url:y.resolve(ea.display=='touch'?'m':'www',ja)+'/'+ha.url,params:ea,name:ga,dialog:j.newInstance(ia,ea.display)},la=ha.transform?ha.transform:da.genericTransform;if(la){ka=la(ka);if(!ka)return;}var ma=ha.getXdRelation||da.getXdRelation,na=ma(ka.params);if(!(ka.id in da._defaultCb)&&!('next' in ka.params)&&!('redirect_uri' in ka.params))ka.params.next=da._xdResult(ka.cb,ka.id,na,true);if(na==='parent')ES('Object','assign',false,ka.params,{channel_url:da._xdChannelHandler(ia,'parent.parent')},true);ka=da.prepareParams(ka);return ka;},prepareParams:function(ea){var fa=ea.params.method;if(ea.params.display!=='async')delete ea.params.method;ea.params=m(ea.params);var ga=t.encode(ea.params);if(!z.nativeApp()&&da.urlTooLongForIE(ea.url+'?'+ga)){ea.post=true;}else if(ga)ea.url+='?'+ga;return ea;},urlTooLongForIE:function(ea){return ea.length>2000;},getDisplayMode:function(ea,fa){if(fa.display==='hidden'||fa.display==='none')return fa.display;var ga=w.isEnvironment(w.ENVIRONMENTS.CANVAS)||w.isEnvironment(w.ENVIRONMENTS.PAGETAB);if(ga&&!fa.display)return 'async';if(z.mobile()||fa.display==='touch')return 'touch';if(!w.getAccessToken()&&(fa.display=='iframe'||fa.display=='dialog')&&!ea.loggedOutIframe){r.error('"dialog" mode can only be used when the user is connected.');return 'popup';}if(ea.connectDisplay&&!ga)return ea.connectDisplay;return fa.display||(w.getAccessToken()?'dialog':'popup');},getXdRelation:function(ea){var fa=ea.display;if(fa==='popup'||fa==='touch')return 'opener';if(fa==='dialog'||fa==='iframe'||fa==='hidden'||fa==='none')return 'parent';if(fa==='async')return 'parent.frames['+window.name+']';},popup:function(ea){var fa=typeof window.screenX!='undefined'?window.screenX:window.screenLeft,ga=typeof window.screenY!='undefined'?window.screenY:window.screenTop,ha=typeof window.outerWidth!='undefined'?window.outerWidth:document.documentElement.clientWidth,ia=typeof window.outerHeight!='undefined'?window.outerHeight:(document.documentElement.clientHeight-22),ja=z.mobile()?null:ea.size.width,ka=z.mobile()?null:ea.size.height,la=(fa<0)?window.screen.width+fa:fa,ma=parseInt(la+((ha-ja)/2),10),na=parseInt(ga+((ia-ka)/2.5),10),oa=[];if(ja!==null)oa.push('width='+ja);if(ka!==null)oa.push('height='+ka);oa.push('left='+ma);oa.push('top='+na);oa.push('scrollbars=1');if(ea.name=='permissions.request'||ea.name=='permissions.oauth')oa.push('location=1,toolbar=0');oa=oa.join(',');var pa;if(ea.post){pa=window.open('about:blank',ea.id,oa);if(pa){da.setLoadedNode(ea,pa,'popup');h.submitToTarget({url:ea.url,target:ea.id,params:ea.params});}}else{pa=window.open(ea.url,ea.id,oa);if(pa)da.setLoadedNode(ea,pa,'popup');}if(!pa)return;if(ea.id in da._defaultCb)da._popupMonitor();},setLoadedNode:function(ea,fa,ga){if(ea.params&&ea.params.display!='popup')fa.fbCallID=ea.id;fa={node:fa,type:ga,fbCallID:ea.id};da._loadedNodes[ea.id]=fa;},getLoadedNode:function(ea){var fa=typeof ea=='object'?ea.id:ea,ga=da._loadedNodes[fa];return ga?ga.node:null;},hidden:function(ea){ea.className='FB_UI_Hidden';ea.root=h.appendHidden('');da._insertIframe(ea);},iframe:function(ea){ea.className='FB_UI_Dialog';var fa=function(){da._triggerDefault(ea.id);};ea.root=j.create({onClose:fa,closeIcon:ea.closeIcon===undefined?true:ea.closeIcon,classes:(z.ipad()?'centered':'')});if(!ea.hideLoader)j.showLoader(fa,ea.size.width);k.addCss(ea.root,'fb_dialog_iframe');da._insertIframe(ea);},touch:function(ea){if(ea.params&&ea.params.in_iframe){if(ea.ui_created){j.showLoader(function(){da._triggerDefault(ea.id);},0);}else da.iframe(ea);}else if(z.nativeApp()&&!ea.ui_created){ea.frame=ea.id;s.onready(function(){da.setLoadedNode(ea,s.open(ea.url+'#cb='+ea.frameName),'native');});da._popupMonitor();}else if(!ea.ui_created)da.popup(ea);},async:function(ea){ea.params.redirect_uri=location.protocol+'//'+location.host+location.pathname;delete ea.params.access_token;v.remote.showDialog(ea.params,function(fa){var ga=fa.result;if(ga&&ga.e2e){var ha=j.get(ea.id);ha.trackEvents(ga.e2e);ha.trackEvent('close');delete ga.e2e;}ea.cb(ga);});},getDefaultSize:function(){return j.getDefaultSize();},_insertIframe:function(ea){da._loadedNodes[ea.id]=false;var fa=function(ga){if(ea.id in da._loadedNodes)da.setLoadedNode(ea,ga,'iframe');};if(ea.post){q({url:'about:blank',root:ea.root,className:ea.className,width:ea.size.width,height:ea.size.height,id:ea.id,onInsert:fa,onload:function(ga){h.submitToTarget({url:ea.url,target:ga.name,params:ea.params});}});}else q({url:ea.url,root:ea.root,className:ea.className,width:ea.size.width,height:ea.size.height,id:ea.id,name:ea.frameName,onInsert:fa});},_handleResizeMessage:function(ea,fa){var ga=da.getLoadedNode(ea);if(!ga)return;if(fa.height)ga.style.height=fa.height+'px';if(fa.width)ga.style.width=fa.width+'px';aa.inform('resize.ack',fa||{},'parent.frames['+ga.name+']');if(!j.isActive(ga))j.show(ga);},_triggerDefault:function(ea){da._xdRecv({frame:ea},da._defaultCb[ea]||function(){});},_popupMonitor:function(){var ea;for(var fa in da._loadedNodes)if(da._loadedNodes.hasOwnProperty(fa)&&fa in da._defaultCb){var ga=da._loadedNodes[fa];if(ga.type!='popup'&&ga.type!='native')continue;var ha=ga.node;try{if(ha.closed){da._triggerDefault(fa);}else ea=true;}catch(ia){}}if(ea&&!da._popupInterval){da._popupInterval=setInterval(da._popupMonitor,100);}else if(!ea&&da._popupInterval){clearInterval(da._popupInterval);da._popupInterval=null;}},_xdChannelHandler:function(ea,fa){return aa.handler(function(ga){var ha=da.getLoadedNode(ea);if(!ha)return;if(ga.type=='resize'){da._handleResizeMessage(ea,ga);}else if(ga.type=='hide'){j.hide(ha);}else if(ga.type=='rendered'){var ia=j._findRoot(ha);j.show(ia);}else if(ga.type=='fireevent')l.fire(ga.event);},fa,true,null);},_xdNextHandler:function(ea,fa,ga,ha){if(ha)da._defaultCb[fa]=ea;return aa.handler(function(ia){da._xdRecv(ia,ea);},ga)+'&frame='+fa;},_xdRecv:function(ea,fa){var ga=da.getLoadedNode(ea.frame);if(ga)if(ga.close){try{ga.close();if(/iPhone.*Version\/(5|6)/.test(navigator.userAgent)&&RegExp.$1!=='5')window.focus();da._popupCount--;}catch(ha){}}else if(k.containsCss(ga,'FB_UI_Hidden')){setTimeout(function(){ga.parentNode.parentNode.removeChild(ga.parentNode);},3000);}else if(k.containsCss(ga,'FB_UI_Dialog'))j.remove(ga);delete da._loadedNodes[ea.frame];delete da._defaultCb[ea.frame];if(ea.e2e){var ia=j.get(ea.frame);ia.trackEvents(ea.e2e);ia.trackEvent('close');delete ea.e2e;}fa(ea);},_xdResult:function(ea,fa,ga,ha){return (da._xdNextHandler(function(ia){ea&&ea(ia.result&&ia.result!=da._resultToken&&ES('JSON','parse',false,ia.result));},fa,ga,ha)+'&result='+encodeURIComponent(da._resultToken));},xdHandler:function(ea,fa,ga,ha,ia){return da._xdNextHandler(g.xdResponseWrapper(ea,ha,ia),fa,ga,true);}};v.stub('showDialog');e.exports=da;},null);
__d("sdk.ui",["Assert","sdk.Impressions","Log","sdk.PlatformVersioning","sdk.Runtime","sdk.UIServer","sdk.feature"],function(a,b,c,d,e,f,g,h,i,j,k,l,m){function n(o,p){g.isObject(o);g.maybeFunction(p);if(k.getIsVersioned()){j.assertVersionIsSet();if(o.version){j.assertValidVersion(o.version);}else o.version=k.getVersion();}o=ES('Object','assign',false,{},o);if(!o.method){i.error('"method" is a required parameter for FB.ui().');return null;}if(o.method=='pay.prompt')o.method='pay';var q=o.method;if(o.redirect_uri){i.warn('When using FB.ui, you should not specify a redirect_uri.');delete o.redirect_uri;}if((q=='permissions.request'||q=='permissions.oauth')&&(o.display=='iframe'||o.display=='dialog'))o.display=l.checkOauthDisplay(o);var r=m('e2e_tracking',true);if(r)o.e2e={};var s=l.prepareCall(o,p||function(){});if(!s)return null;var t=s.params.display;if(t==='dialog'){t='iframe';}else if(t==='none')t='hidden';var u=l[t];if(!u){i.error('"display" must be one of "popup", '+'"dialog", "iframe", "touch", "async", "hidden", or "none"');return null;}if(r)s.dialog.subscribe('e2e:end',function(v){v.method=q;v.display=t;i.debug('e2e: %s',ES('JSON','stringify',false,v));h.log(114,{payload:v});});u(s);return s.dialog;}e.exports=n;},null);
__d("legacy:fb.auth",["sdk.Auth","sdk.Cookie","copyProperties","sdk.Event","FB","Log","sdk.Runtime","sdk.SignedRequest","sdk.ui"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){k.provide('',{getLoginStatus:function(){return g.getLoginStatus.apply(g,arguments);},getAuthResponse:function(){return g.getAuthResponse();},getAccessToken:function(){return m.getAccessToken()||null;},getUserID:function(){return m.getUserID()||m.getCookieUserID();},login:function(p,q){if(q&&q.perms&&!q.scope){q.scope=q.perms;delete q.perms;l.warn('OAuth2 specification states that \'perms\' '+'should now be called \'scope\'.  Please update.');}var r=m.isEnvironment(m.ENVIRONMENTS.CANVAS)||m.isEnvironment(m.ENVIRONMENTS.PAGETAB);o(i({method:'permissions.oauth',display:r?'async':'popup',domain:location.hostname},q||{}),p);},logout:function(p){o({method:'auth.logout',display:'hidden'},p);}});g.subscribe('logout',ES(j.fire,'bind',true,j,'auth.logout'));g.subscribe('login',ES(j.fire,'bind',true,j,'auth.login'));g.subscribe('authresponse.change',ES(j.fire,'bind',true,j,'auth.authResponseChange'));g.subscribe('status.change',ES(j.fire,'bind',true,j,'auth.statusChange'));j.subscribe('init:post',function(p){if(p.status)g.getLoginStatus();if(m.getClientID())if(p.authResponse){g.setAuthResponse(p.authResponse,'connected');}else if(m.getUseCookie()){var q=h.loadSignedRequest(),r;if(q){try{r=n.parse(q);}catch(s){h.clearSignedRequestCookie();}if(r&&r.user_id)m.setCookieUserID(r.user_id);}h.loadMeta();}});},3);
__d("sdk.Canvas.IframeHandling",["DOMWrapper","sdk.RPC"],function(a,b,c,d,e,f,g,h){var i=null,j;function k(){var o=g.getWindow().document,p=o.body,q=o.documentElement,r=Math.max(p.offsetTop,0),s=Math.max(q.offsetTop,0),t=p.scrollHeight+r,u=p.offsetHeight+r,v=q.scrollHeight+s,w=q.offsetHeight+s;return Math.max(t,u,v,w);}function l(o){if(typeof o!='object')o={};var p=0,q=0;if(!o.height){o.height=k();p=16;q=4;}if(!o.frame)o.frame=window.name||'iframe_canvas';if(j){var r=j.height,s=o.height-r;if(s<=q&&s>=-p)return false;}j=o;h.remote.setSize(o);return true;}function m(o,p){if(p===undefined&&typeof o==='number'){p=o;o=true;}if(o||o===undefined){if(i===null)i=setInterval(function(){l();},p||100);l();}else if(i!==null){clearInterval(i);i=null;}}h.stub('setSize');var n={setSize:l,setAutoGrow:m};e.exports=n;},null);
__d("sdk.Canvas.Navigation",["sdk.RPC"],function(a,b,c,d,e,f,g){function h(j){g.local.navigate=function(k){j({path:k});};g.remote.setNavigationEnabled(true);}g.stub('setNavigationEnabled');var i={setUrlHandler:h};e.exports=i;},null);
__d("sdk.Canvas.Plugin",["sdk.api","sdk.RPC","Log","UserAgent_DEPRECATED","sdk.Runtime","createArrayFrom"],function(a,b,c,d,e,f,g,h,i,j,k,l){var m='CLSID:D27CDB6E-AE6D-11CF-96B8-444553540000',n='CLSID:444785F1-DE89-4295-863A-D46C3A781394',o=null,p=!(j.osx()>=10.9&&(j.chrome()>=31||j.webkit()>=537.71||j.firefox()>=25));function q(aa){aa._hideunity_savedstyle={};aa._hideunity_savedstyle.left=aa.style.left;aa._hideunity_savedstyle.position=aa.style.position;aa._hideunity_savedstyle.width=aa.style.width;aa._hideunity_savedstyle.height=aa.style.height;aa.style.left='-10000px';aa.style.position='absolute';aa.style.width='1px';aa.style.height='1px';}function r(aa){if(aa._hideunity_savedstyle){aa.style.left=aa._hideunity_savedstyle.left;aa.style.position=aa._hideunity_savedstyle.position;aa.style.width=aa._hideunity_savedstyle.width;aa.style.height=aa._hideunity_savedstyle.height;}}function s(aa){aa._old_visibility=aa.style.visibility;aa.style.visibility='hidden';}function t(aa){aa.style.visibility=aa._old_visibility||'';delete aa._old_visibility;}function u(aa){var ba=aa.type?aa.type.toLowerCase():null,ca=ba==='application/x-shockwave-flash'||(aa.classid&&aa.classid.toUpperCase()==m);if(!ca)return false;var da=/opaque|transparent/i;if(da.test(aa.getAttribute('wmode')))return false;for(var ea=0;ea<aa.childNodes.length;ea++){var fa=aa.childNodes[ea];if(/param/i.test(fa.nodeName)&&/wmode/i.test(fa.name)&&da.test(fa.value))return false;}return true;}function v(aa){var ba=aa.type?aa.type.toLowerCase():null;return ba==='application/vnd.unity'||(aa.classid&&aa.classid.toUpperCase()==n);}function w(aa){var ba=l(window.document.getElementsByTagName('object'));ba=ba.concat(l(window.document.getElementsByTagName('embed')));var ca=false,da=false;ES(ba,'forEach',true,function(fa){var ga=u(fa),ha=p&&v(fa);if(!ga&&!ha)return;ca=ca||ga;da=da||ha;var ia=function(){if(aa.state==='opened'){if(ga){s(fa);}else q(fa);}else if(ga){t(fa);}else r(fa);};if(o){i.info('Calling developer specified callback');var ja={state:aa.state,elem:fa};o(ja);setTimeout(ia,200);}else ia();});if(Math.random()<=1/1000){var ea={unity:da,flash:ca};g(k.getClientID()+'/occludespopups','post',ea);}}h.local.hidePluginObjects=function(){i.info('hidePluginObjects called');w({state:'opened'});};h.local.showPluginObjects=function(){i.info('showPluginObjects called');w({state:'closed'});};h.local.showFlashObjects=h.local.showPluginObjects;h.local.hideFlashObjects=h.local.hidePluginObjects;function x(){s();q();}function y(){t();r();}var z={_setHidePluginCallback:function(aa){o=aa;},hidePluginElement:x,showPluginElement:y};e.exports=z;},null);
__d("sdk.Canvas.Tti",["sdk.RPC","sdk.Runtime"],function(a,b,c,d,e,f,g,h){function i(n,o){var p={appId:h.getClientID(),time:ES('Date','now',false),name:o},q=[p];if(n)q.push(function(r){n(r.result);});g.remote.logTtiMessage.apply(null,q);}function j(){i(null,'StartIframeAppTtiTimer');}function k(n){i(n,'StopIframeAppTtiTimer');}function l(n){i(n,'RecordIframeAppTti');}g.stub('logTtiMessage');var m={setDoneLoading:l,startTimer:j,stopTimer:k};e.exports=m;},null);
__d("legacy:fb.canvas",["Assert","sdk.Canvas.Environment","sdk.Event","FB","sdk.Canvas.IframeHandling","sdk.Canvas.Navigation","sdk.Canvas.Plugin","sdk.RPC","sdk.Runtime","sdk.Canvas.Tti"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p){j.provide('Canvas',{setSize:function(q){g.maybeObject(q,'Invalid argument');return k.setSize.apply(null,arguments);},setAutoGrow:function(){return k.setAutoGrow.apply(null,arguments);},getPageInfo:function(q){g.isFunction(q,'Invalid argument');return h.getPageInfo.apply(null,arguments);},scrollTo:function(q,r){g.maybeNumber(q,'Invalid argument');g.maybeNumber(r,'Invalid argument');return h.scrollTo.apply(null,arguments);},setDoneLoading:function(q){g.maybeFunction(q,'Invalid argument');return p.setDoneLoading.apply(null,arguments);},startTimer:function(){return p.startTimer.apply(null,arguments);},stopTimer:function(q){g.maybeFunction(q,'Invalid argument');return p.stopTimer.apply(null,arguments);},getHash:function(q){g.isFunction(q,'Invalid argument');return l.getHash.apply(null,arguments);},setHash:function(q){g.isString(q,'Invalid argument');return l.setHash.apply(null,arguments);},setUrlHandler:function(q){g.isFunction(q,'Invalid argument');return l.setUrlHandler.apply(null,arguments);}});n.local.fireEvent=ES(i.fire,'bind',true,i);i.subscribe('init:post',function(q){if(o.isEnvironment(o.ENVIRONMENTS.CANVAS)){g.isTrue(!q.hideFlashCallback||!q.hidePluginCallback,'cannot specify deprecated hideFlashCallback and new hidePluginCallback');m._setHidePluginCallback(q.hidePluginCallback||q.hideFlashCallback);}});},3);
__d("legacy:fb.canvas-legacy",["Assert","FB","Log","sdk.Canvas.Tti"],function(a,b,c,d,e,f,g,h,i,j){h.provide('CanvasInsights',{setDoneLoading:function(k){i.warn('Deprecated: use FB.Canvas.setDoneLoading');g.maybeFunction(k,'Invalid argument');return j.setDoneLoading.apply(null,arguments);}});},3);
__d("sdk.Canvas.Prefetcher",["sdk.api","createArrayFrom","JSSDKCanvasPrefetcherConfig","sdk.Runtime"],function(a,b,c,d,e,f,g,h,i,j){var k={AUTOMATIC:0,MANUAL:1},l=i.sampleRate,m=i.blacklist,n=k.AUTOMATIC,o=[];function p(){var u={object:'data',link:'href',script:'src'};if(n==k.AUTOMATIC)ES(ES('Object','keys',false,u),'forEach',true,function(v){var w=u[v];ES(h(document.getElementsByTagName(v)),'forEach',true,function(x){if(x[w])o.push(x[w]);});});if(o.length===0)return;g(j.getClientID()+'/staticresources','post',{urls:ES('JSON','stringify',false,o),is_https:location.protocol==='https:'});o=[];}function q(){if(!j.isEnvironment(j.ENVIRONMENTS.CANVAS)||!j.getClientID()||!l)return;if(Math.random()>1/l||m=='*'||~ES(m,'indexOf',true,j.getClientID()))return;setTimeout(p,30000);}function r(u){n=u;}function s(u){o.push(u);}var t={COLLECT_AUTOMATIC:k.AUTOMATIC,COLLECT_MANUAL:k.MANUAL,addStaticResource:s,setCollectionMode:r,_maybeSample:q};e.exports=t;},null);
__d("legacy:fb.canvas.prefetcher",["FB","sdk.Canvas.Prefetcher","sdk.Event","sdk.Runtime"],function(a,b,c,d,e,f,g,h,i,j){g.provide('Canvas.Prefetcher',h);i.subscribe('init:post',function(k){if(j.isEnvironment(j.ENVIRONMENTS.CANVAS))h._maybeSample();});},3);
__d("legacy:fb.compat.ui",["copyProperties","FB","Log","sdk.ui","sdk.UIServer"],function(a,b,c,d,e,f,g,h,i,j,k){h.provide('',{share:function(l){i.error('share() has been deprecated. Please use FB.ui() instead.');j({display:'popup',method:'stream.share',u:l});},publish:function(l,m){i.error('publish() has been deprecated. Please use FB.ui() instead.');l=l||{};j(g({display:'popup',method:'stream.publish',preview:1},l||{}),m);},addFriend:function(l,m){i.error('addFriend() has been deprecated. Please use FB.ui() instead.');j({display:'popup',id:l,method:'friend.add'},m);}});k.Methods['auth.login']=k.Methods['permissions.request'];},3);
__d("mergeArrays",[],function(a,b,c,d,e,f){function g(h,i){for(var j=0;j<i.length;j++)if(ES(h,'indexOf',true,i[j])<0)h.push(i[j]);return h;}e.exports=g;},null);
__d("format",[],function(a,b,c,d,e,f){function g(h,i){i=Array.prototype.slice.call(arguments,1);return h.replace(/\{(\d+)\}/g,function(j,k){var l=i[Number(k)];return (l===null||l===undefined)?'':l.toString();});}e.exports=g;},null);
__d("safeEval",[],function(a,b,c,d,e,f){function g(h,i){if(h===null||typeof h==='undefined')return;if(typeof h!=='string')return h;if(/^\w+$/.test(h)&&typeof window[h]==='function')return window[h].apply(null,i||[]);return Function('return eval("'+h.replace(/"/g,'\\"')+'");').apply(null,i||[]);}e.exports=g;},null);
__d("sdk.Waitable",["sdk.Model"],function(a,b,c,d,e,f,g){var h=g.extend({constructor:function(){this.parent({Value:undefined});},error:function(i){this.inform("error",i);},wait:function(i,j){if(j)this.subscribe('error',j);this.monitor('Value.change',ES(function(){var k=this.getValue();if(k!==undefined){this.value=k;i(k);return true;}},'bind',true,this));}});e.exports=h;},null);
__d("sdk.Query",["format","safeEval","Type","sdk.Waitable"],function(a,b,c,d,e,f,g,h,i,j){function k(p){return ES(p.split(','),'map',true,function(q){return ES(q,'trim',true);});}function l(p){var q=(/^\s*(\w+)\s*=\s*(.*)\s*$/i).exec(p),r,s,t='unknown';if(q){s=q[2];if(/^(["'])(?:\\?.)*?\1$/.test(s)){s=h(s);t='index';}else if(/^\d+\.?\d*$/.test(s))t='index';}if(t=='index'){r={type:'index',key:q[1],value:s};}else r={type:'unknown',value:p};return r;}function m(p){return typeof p==='string'?ES('JSON','stringify',false,p):p;}var n=1,o=j.extend({constructor:function(){this.parent();this.name='v_'+n++;},hasDependency:function(p){if(arguments.length)this._hasDependency=p;return !!this._hasDependency;},parse:function(p){var q=g.apply(null,p),r=(/^select (.*?) from (\w+)\s+where (.*)$/i).exec(q);this.fields=k(r[1]);this.table=r[2];this.where=l(r[3]);for(var s=1;s<p.length;s++)if(i.instanceOf(o,p[s]))p[s].hasDependency(true);return this;},toFql:function(){var p='select '+this.fields.join(',')+' from '+this.table+' where ';switch(this.where.type){case 'unknown':p+=this.where.value;break;case 'index':p+=this.where.key+'='+m(this.where.value);break;case 'in':if(this.where.value.length==1){p+=this.where.key+'='+m(this.where.value[0]);}else p+=this.where.key+' in ('+ES(this.where.value,'map',true,m).join(',')+')';break;}return p;},toString:function(){return '#'+this.name;}});e.exports=o;},null);
__d("sdk.Data",["sdk.api","sdk.ErrorHandling","mergeArrays","sdk.Query","safeEval","sdk.Waitable"],function(a,b,c,d,e,f,g,h,i,j,k,l){var m={query:function(n,o){var p=new j().parse(Array.prototype.slice.call(arguments));m.queue.push(p);m._waitToProcess();return p;},waitOn:function(n,o){var p=new l(),q=n.length;if(typeof(o)=='string'){var r=o;o=h.unguard(function(){return k(r);});}ES(n,'forEach',true,function(s){s.monitor('Value.change',function(){var t=false;if(m._getValue(s)!==undefined){s.value=s.getValue();q--;t=true;}if(q===0){var u=o(ES(n,'map',true,m._getValue));p.setValue(u!==undefined?u:true);}return t;});});return p;},process:function(n){m._process(n);},_getValue:function(n){return n instanceof l?n.getValue():n;},_selectByIndex:function(n,o,p,q){var r=new j();r.fields=n;r.table=o;r.where={type:'index',key:p,value:q};m.queue.push(r);m._waitToProcess();return r;},_waitToProcess:function(){if(m.timer<0)m.timer=setTimeout(function(){m._process();},10);},_process:function(n){m.timer=-1;var o={},p=m.queue;if(!p.length)return;m.queue=[];for(var q=0;q<p.length;q++){var r=p[q];if(r.where.type=='index'&&!r.hasDependency()){m._mergeIndexQuery(r,o);}else o[r.name]=r;}var s={q:{}};for(var t in o)if(o.hasOwnProperty(t))s.q[t]=o[t].toFql();if(n)s.access_token=n;g('/fql','GET',s,function(u){if(u.error){ES(ES('Object','keys',false,o),'forEach',true,function(v){o[v].error(new Error(u.error.message));});}else ES(u.data,'forEach',true,function(v){o[v.name].setValue(v.fql_result_set);});});},_mergeIndexQuery:function(n,o){var p=n.where.key,q=n.where.value,r='index_'+n.table+'_'+p,s=o[r];if(!s){s=o[r]=new j();s.fields=[p];s.table=n.table;s.where={type:'in',key:p,value:[]};}i(s.fields,n.fields);i(s.where.value,[q]);s.wait(function(t){n.setValue(ES(t,'filter',true,function(u){return u[p]==q;}));});},timer:-1,queue:[]};e.exports=m;},null);
__d("legacy:fb.data",["FB","sdk.Data"],function(a,b,c,d,e,f,g,h){g.provide('Data',h);},3);
__d("legacy:fb.event",["FB","sdk.Event","sdk.Runtime","sdk.Scribe","sdk.feature"],function(a,b,c,d,e,f,g,h,i,j,k){var l=[],m=null,n=k('event_subscriptions_log',false);g.provide('Event',{subscribe:function(o,p){if(n){l.push(o);if(!m)m=setTimeout(function(){j.log('jssdk_error',{appId:i.getClientID(),error:'EVENT_SUBSCRIPTIONS_LOG',extra:{line:0,name:'EVENT_SUBSCRIPTIONS_LOG',script:'N/A',stack:'N/A',message:l.sort().join(',')}});l.length=0;m=null;},n);}return h.subscribe(o,p);},unsubscribe:ES(h.unsubscribe,'bind',true,h)});},3);
__d("legacy:fb.event-legacy",["FB","sdk.Event"],function(a,b,c,d,e,f,g,h){g.provide('Event',{clear:ES(h.clear,'bind',true,h),fire:ES(h.fire,'bind',true,h),monitor:ES(h.monitor,'bind',true,h)});g.provide('EventProvider',h);},3);
__d("legacy:fb.frictionless",["FB","sdk.Frictionless"],function(a,b,c,d,e,f,g,h){g.provide('Frictionless',h);},3);
__d("sdk.init",["sdk.Cookie","sdk.ErrorHandling","sdk.Event","Log","ManagedError","sdk.PlatformVersioning","QueryString","sdk.Runtime","sdk.URI","createArrayFrom"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p){function q(s){var t=(typeof s=='number'&&s>0)||(typeof s=='string'&&/^[0-9a-f]{21,}$|^[0-9]{1,21}$/.test(s));if(t)return s.toString();j.warn('Invalid App Id: Must be a number or numeric string representing '+'the application id.');return null;}function r(s){if(n.getInitialized())j.warn('FB.init has already been called - this could indicate a problem');if(n.getIsVersioned()){if(Object.prototype.toString.call(s)!=='[object Object]')throw new k('Invalid argument');if(s.authResponse)j.warn('Setting authResponse is not supported');if(!s.version)s.version=o(location.href).getQueryData().sdk_version;l.assertValidVersion(s.version);n.setVersion(s.version);}else{if(/number|string/.test(typeof s)){j.warn('FB.init called with invalid parameters');s={apiKey:s};}s=ES('Object','assign',false,{status:true},s||{});}var t=q(s.appId||s.apiKey);if(t!==null)n.setClientID(t);if('scope' in s)n.setScope(s.scope);if(s.cookie){n.setUseCookie(true);if(typeof s.cookie==='string')g.setDomain(s.cookie);}if(s.kidDirectedSite)n.setKidDirectedSite(true);n.setInitialized(true);i.fire('init:post',s);}setTimeout(function(){var s=/(connect\.facebook\.net|\.facebook\.com\/assets.php).*?#(.*)/;ES(p(document.getElementsByTagName('script')),'forEach',true,function(t){if(t.src){var u=s.exec(t.src);if(u){var v=m.decode(u[2]);for(var w in v)if(v.hasOwnProperty(w)){var x=v[w];if(x=='0')v[w]=0;}r(v);}}});if(window.fbAsyncInit&&!window.fbAsyncInit.hasRun){window.fbAsyncInit.hasRun=true;h.unguard(window.fbAsyncInit)();}},0);e.exports=r;},null);
__d("legacy:fb.init",["FB","sdk.init"],function(a,b,c,d,e,f,g,h){g.provide('',{init:h});},3);
__d("legacy:fb.json",["FB","ManagedError"],function(a,b,c,d,e,f,g,h){g.provide('JSON',{stringify:function(i){try{return ES('JSON','stringify',false,i);}catch(j){throw new h(j.message,j);}},parse:function(i){try{return ES('JSON','parse',false,i);}catch(j){throw new h(j.message,j);}}});},3);
__d("legacy:fb.pay",["copyProperties","sdk.Runtime","sdk.UIServer","sdk.XD","sdk.feature","FB"],function(a,b,c,d,e,f,g,h,i,j,k){b('FB');var l={error_code:1383001,error_message:'An unknown error caused the dialog to be closed'},m=function(n){return function(o){if(o&&typeof o.response==='string'){n(ES('JSON','parse',false,o.response));}else if(typeof o==='object'){n(o);}else n(l);};};g(i.Methods,{pay:{size:{width:555,height:120},connectDisplay:'popup',transform:function(n){if(k('launch_payment_dialog_via_pac')){n.cb=m(n.cb);return n;}else{n.cb=m(n.cb);if(!h.isEnvironment(h.ENVIRONMENTS.CANVAS)){n.params.order_info=ES('JSON','stringify',false,n.params.order_info);return n;}var o=j.handler(n.cb,'parent.frames['+(window.name||'iframe_canvas')+']');n.params.channel=o;n.params.uiserver=true;j.inform('Pay.Prompt',n.params);}}}});},3);
__d("legacy:fb.ua",["FB","UserAgent_DEPRECATED"],function(a,b,c,d,e,f,g,h){g.provide('UA',{nativeApp:h.nativeApp});},3);
__d("legacy:fb.ui",["FB","sdk.ui"],function(a,b,c,d,e,f,g,h){g.provide('',{ui:h});},3);
__d("runOnce",[],function(a,b,c,d,e,f){function g(h){var i,j;return function(){if(!i){i=true;j=h();}return j;};}e.exports=g;},null);
__d("XFBML",["Assert","createArrayFrom","sdk.DOM","sdk.feature","sdk.Impressions","Log","ObservableMixin","runOnce","UserAgent_DEPRECATED"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){var p={},q={},r=0,s=new m();function t(ba,ca){return ba[ca]+'';}function u(ba){return ba.scopeName?(ba.scopeName+':'+ba.nodeName):'';}function v(ba){return p[t(ba,'nodeName').toLowerCase()]||p[u(ba).toLowerCase()];}function w(ba){var ca=ES(ES(t(ba,'className'),'trim',true).split(/\s+/),'filter',true,function(da){return q.hasOwnProperty(da);});if(ca.length===0)return undefined;if(ba.getAttribute('fb-xfbml-state')||!ba.childNodes||ba.childNodes.length===0||(ba.childNodes.length===1&&ba.childNodes[0].nodeType===3)||(ba.children.length===1&&t(ba.children[0],'className')==='fb-xfbml-parse-ignore'))return q[ca[0]];}function x(ba){var ca={};ES(h(ba.attributes),'forEach',true,function(da){ca[t(da,'name')]=t(da,'value');});return ca;}function y(ba,ca,da){var ea=document.createElement('div');i.addCss(ba,ca+'-'+da);ES(h(ba.childNodes),'forEach',true,function(fa){ea.appendChild(fa);});ES(h(ba.attributes),'forEach',true,function(fa){ea.setAttribute(fa.name,fa.value);});ba.parentNode.replaceChild(ea,ba);return ea;}function z(ba,ca,da){g.isTrue(ba&&ba.nodeType&&ba.nodeType===1&&!!ba.getElementsByTagName,'Invalid DOM node passed to FB.XFBML.parse()');g.isFunction(ca,'Invalid callback passed to FB.XFBML.parse()');var ea=++r;l.info('XFBML Parsing Start %s',ea);var fa=1,ga=0,ha=function(){fa--;if(fa===0){l.info('XFBML Parsing Finish %s, %s tags found',ea,ga);ca();s.inform('render',ea,ga);}g.isTrue(fa>=0,'onrender() has been called too many times');};ES(h(ba.getElementsByTagName('*')),'forEach',true,function(ja){if(!da&&ja.getAttribute('fb-xfbml-state'))return;if(ja.nodeType!==1)return;var ka=v(ja)||w(ja);if(!ka)return;if(o.ie()<9&&ja.scopeName)ja=y(ja,ka.xmlns,ka.localName);fa++;ga++;var la=new ka.ctor(ja,ka.xmlns,ka.localName,x(ja));la.subscribe('render',n(function(){ja.setAttribute('fb-xfbml-state','rendered');ha();}));var ma=function(){if(ja.getAttribute('fb-xfbml-state')=='parsed'){s.subscribe('render.queue',ma);}else{ja.setAttribute('fb-xfbml-state','parsed');la.process();}};ma();});s.inform('parse',ea,ga);var ia=30000;setTimeout(function(){if(fa>0)l.warn('%s tags failed to render in %s ms',fa,ia);},ia);ha();}s.subscribe('render',function(){var ba=s.getSubscribers('render.queue');s.clearSubscribers('render.queue');ES(ba,'forEach',true,function(ca){ca();});});ES('Object','assign',false,s,{registerTag:function(ba){var ca=ba.xmlns+':'+ba.localName;g.isUndefined(p[ca],ca+' already registered');p[ca]=ba;q[ba.xmlns+'-'+ba.localName]=ba;},parse:function(ba,ca){z(ba||document.body,ca||function(){},true);},parseNew:function(){z(document.body,function(){},false);}});if(j('log_tag_count')){var aa=function(ba,ca){s.unsubscribe('parse',aa);setTimeout(ES(k.log,'bind',true,null,102,{tag_count:ca}),5000);};s.subscribe('parse',aa);}e.exports=s;},null);
__d("PluginPipe",["sdk.Content","sdk.feature","guid","insertIframe","Miny","ObservableMixin","JSSDKPluginPipeConfig","sdk.Runtime","UrlMap","UserAgent_DEPRECATED","XFBML"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q){var r=new l(),s=m.threshold,t=[];function u(){return !!(h('plugin_pipe')&&n.getSecure()!==undefined&&(p.chrome()||p.firefox())&&m.enabledApps[n.getClientID()]);}function v(){var x=t;t=[];if(x.length<=s){ES(x,'forEach',true,function(aa){j(aa.config);});return;}var y=x.length+1;function z(){y--;if(y===0)w(x);}ES(x,'forEach',true,function(aa){var ba={};for(var ca in aa.config)ba[ca]=aa.config[ca];ba.url=o.resolve('www',n.getSecure())+'/plugins/plugin_pipe_shell.php';ba.onload=z;j(ba);});z();}q.subscribe('parse',v);function w(x){var y=document.createElement('span');g.appendHidden(y);var z={};ES(x,'forEach',true,function(ea){z[ea.config.name]={plugin:ea.tag,params:ea.params};});var aa=ES('JSON','stringify',false,z),ba=k.encode(aa);ES(x,'forEach',true,function(ea){var fa=document.getElementsByName(ea.config.name)[0];fa.onload=ea.config.onload;});var ca=o.resolve('www',n.getSecure())+'/plugins/pipe.php',da=i();j({url:'about:blank',root:y,name:da,className:'fb_hidden fb_invisible',onload:function(){g.submitToTarget({url:ca,target:da,params:{plugins:ba.length<aa.length?ba:aa}});}});}ES('Object','assign',false,r,{add:function(x){var y=u();y&&t.push({config:x._config,tag:x._tag,params:x._params});return y;}});e.exports=r;},null);
__d("IframePlugin",["sdk.Auth","sdk.DOM","sdk.Event","Log","ObservableMixin","sdk.PlatformVersioning","PluginPipe","QueryString","sdk.Runtime","Type","sdk.URI","UrlMap","UserAgent_DEPRECATED","sdk.XD","sdk.createIframe","guid","resolveURI"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w){var x={skin:'string',font:'string',width:'px',height:'px',ref:'string',color_scheme:'string'};function y(ga,ha,ia){if(ha||ha===0)ga.style.width=ha+'px';if(ia||ia===0)ga.style.height=ia+'px';}function z(ga){return function(ha){var ia={width:ha.width,height:ha.height,pluginID:ga};i.fire('xfbml.resize',ia);};}var aa={string:function(ga){return ga;},bool:function(ga){return ga?(/^(?:true|1|yes|on)$/i).test(ga):undefined;},url:function(ga){return w(ga);},url_maybe:function(ga){return ga?w(ga):ga;},hostname:function(ga){return ga||window.location.hostname;},px:function(ga){return (/^(\d+)(?:px)?$/).test(ga)?parseInt(RegExp.$1,10):undefined;},text:function(ga){return ga;}};function ba(ga,ha){var ia=ga[ha]||ga[ha.replace(/_/g,'-')]||ga[ha.replace(/_/g,'')]||ga['data-'+ha]||ga['data-'+ha.replace(/_/g,'-')]||ga['data-'+ha.replace(/_/g,'')]||undefined;return ia;}function ca(ga,ha,ia,ja){ES(ES('Object','keys',false,ga),'forEach',true,function(ka){if(ga[ka]=='text'&&!ia[ka]){ia[ka]=ha.textContent||ha.innerText||'';ha.setAttribute(ka,ia[ka]);}ja[ka]=aa[ga[ka]](ba(ia,ka));});}function da(ga){return ga||ga==='0'||ga===0?parseInt(ga,10):undefined;}function ea(ga){if(ga)y(ga,0,0);}var fa=p.extend({constructor:function(ga,ha,ia,ja){this.parent();ia=ia.replace(/-/g,'_');var ka=ba(ja,'plugin_id');this.subscribe('xd.resize',z(ka));this.subscribe('xd.resize.flow',z(ka));this.subscribe('xd.resize.flow',ES(function(qa){ES('Object','assign',false,this._config.root.style,{verticalAlign:'bottom',overflow:''});y(this._config.root,da(qa.width),da(qa.height));this.updateLift();clearTimeout(this._timeoutID);},'bind',true,this));this.subscribe('xd.resize',ES(function(qa){ES('Object','assign',false,this._config.root.style,{verticalAlign:'bottom',overflow:''});y(this._config.root,da(qa.width),da(qa.height));y(this._iframe,da(qa.width),da(qa.height));this._isIframeResized=true;this.updateLift();clearTimeout(this._timeoutID);},'bind',true,this));this.subscribe('xd.resize.iframe',ES(function(qa){y(this._iframe,da(qa.width),da(qa.height));this._isIframeResized=true;this.updateLift();clearTimeout(this._timeoutID);},'bind',true,this));this.subscribe('xd.sdk_event',function(qa){var ra=ES('JSON','parse',false,qa.data);ra.pluginID=ka;i.fire(qa.event,ra,ga);});var la=o.getSecure()||window.location.protocol=='https:',ma=r.resolve('www',la)+'/plugins/'+ia+'.php?',na={};ca(this.getParams(),ga,ja,na);ca(x,ga,ja,na);ES('Object','assign',false,na,{app_id:o.getClientID(),locale:o.getLocale(),sdk:'joey',kid_directed_site:o.getKidDirectedSite(),channel:t.handler(ES(function(qa){return this.inform('xd.'+qa.type,qa);},'bind',true,this),'parent.parent',true)});h.addCss(ga,'fb_iframe_widget');var oa=v();this.subscribe('xd.verify',function(qa){t.sendToFacebook(oa,{method:'xd/verify',params:ES('JSON','stringify',false,qa.token)});});this.subscribe('xd.refreshLoginStatus',ES(g.getLoginStatus,'bind',true,g,ES(this.inform,'bind',true,this,'login.status'),true));var pa=document.createElement('span');ES('Object','assign',false,pa.style,{verticalAlign:'top',width:'0px',height:'0px',overflow:'hidden'});this._element=ga;this._ns=ha;this._tag=ia;this._params=na;this._config={root:pa,url:ma+n.encode(na),name:oa,width:(s.mobile()?(void 0):(na.width||1000)),height:na.height||1000,style:{border:'none',visibility:'hidden'},title:this._ns+':'+this._tag+' Facebook Social Plugin',onload:ES(function(){return this.inform('render');},'bind',true,this),onerror:ES(function(){return ea(this._iframe);},'bind',true,this)};},process:function(){if(o.getIsVersioned()){l.assertVersionIsSet();var ga=q(this._config.url);this._config.url=ga.setPath('/'+o.getVersion()+ga.getPath()).toString();}var ha=ES('Object','assign',false,{},this._params);delete ha.channel;var ia=n.encode(ha);if(this._element.getAttribute('fb-iframe-plugin-query')==ia){j.info('Skipping render: %s:%s %s',this._ns,this._tag,ia);this.inform('render');return;}this._element.setAttribute('fb-iframe-plugin-query',ia);this.subscribe('render',ES(function(){this._iframe.style.visibility='visible';if(!this._isIframeResized)ea(this._iframe);},'bind',true,this));while(this._element.firstChild)this._element.removeChild(this._element.firstChild);this._element.appendChild(this._config.root);var ja=s.mobile()?120:45;this._timeoutID=setTimeout(ES(function(){ea(this._iframe);j.warn('%s:%s failed to resize in %ss',this._ns,this._tag,ja);},'bind',true,this),ja*1000);if(!m.add(this))this._iframe=u(this._config);if(s.mobile()){h.addCss(this._element,'fb_iframe_widget_fluid');ES('Object','assign',false,this._element.style,{display:'block',width:'100%',height:'auto'});ES('Object','assign',false,this._config.root.style,{width:'100%',height:'auto'});ES('Object','assign',false,this._iframe.style,{width:'100%',height:'auto',position:'static'});}},updateLift:function(){var ga=this._iframe.style.width===this._config.root.style.width&&this._iframe.style.height===this._config.root.style.height;h[ga?'removeCss':'addCss'](this._iframe,'fb_iframe_widget_lift');}},k);fa.getVal=ba;fa.withParams=function(ga){return fa.extend({getParams:function(){return ga;}});};e.exports=fa;},null);
__d("PluginTags",[],function(a,b,c,d,e,f){var g={activity:{filter:'string',action:'string',max_age:'string',linktarget:'string',header:'bool',recommendations:'bool',site:'hostname'},composer:{action_type:'string',action_properties:'string'},create_event_button:{},degrees:{href:'url'},facepile:{href:'string',action:'string',size:'string',max_rows:'string',show_count:'bool'},follow:{href:'url',layout:'string',show_faces:'bool'},like:{href:'url',layout:'string',show_faces:'bool',share:'bool',action:'string',send:'bool'},like_box:{href:'string',show_faces:'bool',header:'bool',stream:'bool',force_wall:'bool',show_border:'bool',id:'string',connections:'string',profile_id:'string',name:'string'},open_graph:{href:'url',layout:'string',show_faces:'bool',action_type:'string',action_properties:'string'},open_graph_preview:{action_type:'string',action_properties:'string'},page_events:{href:'url'},post:{href:'url',show_border:'bool'},privacy_selector:{},profile_pic:{uid:'string',linked:'bool',href:'string',size:'string',facebook_logo:'bool'},recommendations:{filter:'string',action:'string',max_age:'string',linktarget:'string',header:'bool',site:'hostname'},share_button:{href:'url',layout:'string',type:'string'},shared_activity:{header:'bool'},send:{href:'url'},send_to_mobile:{max_rows:'string',show_faces:'bool',size:'string'},story:{href:'url',show_border:'bool'},topic:{topic_name:'string',topic_id:'string'},want:{href:'url',layout:'string',show_faces:'bool'}},h={subscribe:'follow',fan:'like_box',likebox:'like_box',friendpile:'facepile'};ES(ES('Object','keys',false,h),'forEach',true,function(i){g[i]=g[h[i]];});e.exports=g;},null);
__d("sdk.Arbiter",[],function(a,b,c,d,e,f){var g={BEHAVIOR_EVENT:'e',BEHAVIOR_PERSISTENT:'p',BEHAVIOR_STATE:'s'};e.exports=g;},null);
__d("sdk.XFBML.Element",["sdk.DOM","Type","ObservableMixin"],function(a,b,c,d,e,f,g,h,i){var j=h.extend({constructor:function(k){this.parent();this.dom=k;},fire:function(){this.inform.apply(this,arguments);},getAttribute:function(k,l,m){var n=g.getAttr(this.dom,k);return n?m?m(n):n:l;},_getBoolAttribute:function(k,l){var m=g.getBoolAttr(this.dom,k);return m===null?l:m;},_getPxAttribute:function(k,l){return this.getAttribute(k,l,function(m){var n=parseInt(m,10);return isNaN(n)?l:n;});},_getLengthAttribute:function(k,l){return this.getAttribute(k,l,function(m){if(m==='100%')return m;var n=parseInt(m,10);return isNaN(n)?l:n;});},_getAttributeFromList:function(k,l,m){return this.getAttribute(k,l,function(n){n=n.toLowerCase();return (ES(m,'indexOf',true,n)>-1)?n:l;});},isValid:function(){for(var k=this.dom;k;k=k.parentNode)if(k==document.body)return true;},clear:function(){g.html(this.dom,'');}},i);e.exports=j;},null);
__d("sdk.XFBML.IframeWidget",["sdk.Arbiter","sdk.Auth","sdk.Content","sdk.DOM","sdk.Event","sdk.XFBML.Element","guid","insertIframe","QueryString","sdk.Runtime","sdk.ui","UrlMap","sdk.XD"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s){var t=l.extend({_iframeName:null,_showLoader:true,_refreshOnAuthChange:false,_allowReProcess:false,_fetchPreCachedLoader:false,_visibleAfter:'load',_widgetPipeEnabled:false,_borderReset:false,_repositioned:false,getUrlBits:function(){throw new Error('Inheriting class needs to implement getUrlBits().');},setupAndValidate:function(){return true;},oneTimeSetup:function(){},getSize:function(){},getIframeName:function(){return this._iframeName;},getIframeTitle:function(){return 'Facebook Social Plugin';},getChannelUrl:function(){if(!this._channelUrl){var x=this;this._channelUrl=s.handler(function(y){x.fire('xd.'+y.type,y);},'parent.parent',true);}return this._channelUrl;},getIframeNode:function(){return this.dom.getElementsByTagName('iframe')[0];},arbiterInform:function(event,x,y){s.sendToFacebook(this.getIframeName(),{method:event,params:ES('JSON','stringify',false,x||{}),behavior:y||g.BEHAVIOR_PERSISTENT});},_arbiterInform:function(event,x,y){var z='parent.frames["'+this.getIframeNode().name+'"]';s.inform(event,x,z,y);},getDefaultWebDomain:function(){return r.resolve('www');},process:function(x){if(this._done){if(!this._allowReProcess&&!x)return;this.clear();}else this._oneTimeSetup();this._done=true;this._iframeName=this.getIframeName()||this._iframeName||m();if(!this.setupAndValidate()){this.fire('render');return;}if(this._showLoader)this._addLoader();j.addCss(this.dom,'fb_iframe_widget');if(this._visibleAfter!='immediate'){j.addCss(this.dom,'fb_hide_iframes');}else this.subscribe('iframe.onload',ES(this.fire,'bind',true,this,'render'));var y=this.getSize()||{},z=this.getFullyQualifiedURL();if(y.width=='100%')j.addCss(this.dom,'fb_iframe_widget_fluid');this.clear();n({url:z,root:this.dom.appendChild(document.createElement('span')),name:this._iframeName,title:this.getIframeTitle(),className:p.getRtl()?'fb_rtl':'fb_ltr',height:y.height,width:y.width,onload:ES(this.fire,'bind',true,this,'iframe.onload')});this._resizeFlow(y);this.loaded=false;this.subscribe('iframe.onload',ES(function(){this.loaded=true;if(!this._isResizeHandled)j.addCss(this.dom,'fb_hide_iframes');},'bind',true,this));},generateWidgetPipeIframeName:function(){u++;return 'fb_iframe_'+u;},getFullyQualifiedURL:function(){var x=this._getURL();x+='?'+o.encode(this._getQS());if(x.length>2000){x='about:blank';var y=ES(function(){this._postRequest();this.unsubscribe('iframe.onload',y);},'bind',true,this);this.subscribe('iframe.onload',y);}return x;},_getWidgetPipeShell:function(){return r.resolve('www')+'/common/widget_pipe_shell.php';},_oneTimeSetup:function(){this.subscribe('xd.resize',ES(this._handleResizeMsg,'bind',true,this));this.subscribe('xd.resize',ES(this._bubbleResizeEvent,'bind',true,this));this.subscribe('xd.resize.iframe',ES(this._resizeIframe,'bind',true,this));this.subscribe('xd.resize.flow',ES(this._resizeFlow,'bind',true,this));this.subscribe('xd.resize.flow',ES(this._bubbleResizeEvent,'bind',true,this));this.subscribe('xd.refreshLoginStatus',function(){h.getLoginStatus(function(){},true);});this.subscribe('xd.logout',function(){q({method:'auth.logout',display:'hidden'},function(){});});if(this._refreshOnAuthChange)this._setupAuthRefresh();if(this._visibleAfter=='load')this.subscribe('iframe.onload',ES(this._makeVisible,'bind',true,this));this.subscribe('xd.verify',ES(function(x){this.arbiterInform('xd/verify',x.token);},'bind',true,this));this.oneTimeSetup();},_makeVisible:function(){this._removeLoader();j.removeCss(this.dom,'fb_hide_iframes');this.fire('render');},_setupAuthRefresh:function(){h.getLoginStatus(ES(function(x){var y=x.status;k.subscribe('auth.statusChange',ES(function(z){if(!this.isValid())return;if(y=='unknown'||z.status=='unknown')this.process(true);y=z.status;},'bind',true,this));},'bind',true,this));},_handleResizeMsg:function(x){if(!this.isValid())return;this._resizeIframe(x);this._resizeFlow(x);if(!this._borderReset){this.getIframeNode().style.border='none';this._borderReset=true;}this._isResizeHandled=true;this._makeVisible();},_bubbleResizeEvent:function(x){var y={height:x.height,width:x.width,pluginID:this.getAttribute('plugin-id')};k.fire('xfbml.resize',y);},_resizeIframe:function(x){var y=this.getIframeNode();if(x.reposition==="true")this._repositionIframe(x);x.height&&(y.style.height=x.height+'px');x.width&&(y.style.width=x.width+'px');this._updateIframeZIndex();},_resizeFlow:function(x){var y=this.dom.getElementsByTagName('span')[0];x.height&&(y.style.height=x.height+'px');x.width&&(y.style.width=x.width+'px');this._updateIframeZIndex();},_updateIframeZIndex:function(){var x=this.dom.getElementsByTagName('span')[0],y=this.getIframeNode(),z=y.style.height===x.style.height&&y.style.width===x.style.width,aa=z?'removeCss':'addCss';j[aa](y,'fb_iframe_widget_lift');},_repositionIframe:function(x){var y=this.getIframeNode(),z=parseInt(j.getStyle(y,'width'),10),aa=j.getPosition(y).x,ba=j.getViewportInfo().width,ca=parseInt(x.width,10);if(aa+ca>ba&&aa>ca){y.style.left=z-ca+'px';this.arbiterInform('xd/reposition',{type:'horizontal'});this._repositioned=true;}else if(this._repositioned){y.style.left='0px';this.arbiterInform('xd/reposition',{type:'restore'});this._repositioned=false;}},_addLoader:function(){if(!this._loaderDiv){j.addCss(this.dom,'fb_iframe_widget_loader');this._loaderDiv=document.createElement('div');this._loaderDiv.className='FB_Loader';this.dom.appendChild(this._loaderDiv);}},_removeLoader:function(){if(this._loaderDiv){j.removeCss(this.dom,'fb_iframe_widget_loader');if(this._loaderDiv.parentNode)this._loaderDiv.parentNode.removeChild(this._loaderDiv);this._loaderDiv=null;}},_getQS:function(){return ES('Object','assign',false,{api_key:p.getClientID(),locale:p.getLocale(),sdk:'joey',kid_directed_site:p.getKidDirectedSite(),ref:this.getAttribute('ref')},this.getUrlBits().params);},_getURL:function(){var x=this.getDefaultWebDomain(),y='';return x+'/plugins/'+y+this.getUrlBits().name+'.php';},_postRequest:function(){i.submitToTarget({url:this._getURL(),target:this.getIframeNode().name,params:this._getQS()});}}),u=0,v={};function w(){var x={};for(var y in v){var z=v[y];x[y]={widget:z.getUrlBits().name,params:z._getQS()};}return x;}e.exports=t;},null);
__d("sdk.XFBML.Comments",["sdk.Event","sdk.XFBML.IframeWidget","QueryString","sdk.Runtime","JSSDKConfig","UrlMap","UserAgent_DEPRECATED"],function(a,b,c,d,e,f,g,h,i,j,k,l,m){var n=h.extend({_visibleAfter:'immediate',_refreshOnAuthChange:true,setupAndValidate:function(){var o={channel_url:this.getChannelUrl(),colorscheme:this.getAttribute('colorscheme'),skin:this.getAttribute('skin'),numposts:this.getAttribute('num-posts',10),width:this._getLengthAttribute('width'),href:this.getAttribute('href'),permalink:this.getAttribute('permalink'),publish_feed:this.getAttribute('publish_feed'),order_by:this.getAttribute('order_by'),mobile:this._getBoolAttribute('mobile')};if(!o.width&&!o.permalink)o.width=550;if(k.initSitevars.enableMobileComments&&m.mobile()&&o.mobile!==false){o.mobile=true;delete o.width;}if(!o.skin)o.skin=o.colorscheme;if(!o.href){o.migrated=this.getAttribute('migrated');o.xid=this.getAttribute('xid');o.title=this.getAttribute('title',document.title);o.url=this.getAttribute('url',document.URL);o.quiet=this.getAttribute('quiet');o.reverse=this.getAttribute('reverse');o.simple=this.getAttribute('simple');o.css=this.getAttribute('css');o.notify=this.getAttribute('notify');if(!o.xid){var p=ES(document.URL,'indexOf',true,'#');if(p>0){o.xid=encodeURIComponent(document.URL.substring(0,p));}else o.xid=encodeURIComponent(document.URL);}if(o.migrated)o.href=l.resolve('www')+'/plugins/comments_v1.php?'+'app_id='+j.getClientID()+'&xid='+encodeURIComponent(o.xid)+'&url='+encodeURIComponent(o.url);}else{var q=this.getAttribute('fb_comment_id');if(!q){q=i.decode(document.URL.substring(ES(document.URL,'indexOf',true,'?')+1)).fb_comment_id;if(q&&ES(q,'indexOf',true,'#')>0)q=q.substring(0,ES(q,'indexOf',true,'#'));}if(q){o.fb_comment_id=q;this.subscribe('render',ES(function(){if(!window.location.hash)window.location.hash=this.getIframeNode().id;},'bind',true,this));}}this._attr=o;return true;},oneTimeSetup:function(){this.subscribe('xd.addComment',ES(this._handleCommentMsg,'bind',true,this));this.subscribe('xd.commentCreated',ES(this._handleCommentCreatedMsg,'bind',true,this));this.subscribe('xd.commentRemoved',ES(this._handleCommentRemovedMsg,'bind',true,this));},getSize:function(){if(!this._attr.permalink)return {width:this._attr.mobile?'100%':this._attr.width,height:160};},getUrlBits:function(){return {name:'comments',params:this._attr};},getDefaultWebDomain:function(){return l.resolve(this._attr.mobile?'m':'www',true);},_handleCommentMsg:function(o){if(!this.isValid())return;g.fire('comments.add',{post:o.post,user:o.user,widget:this});},_handleCommentCreatedMsg:function(o){if(!this.isValid())return;var p={href:o.href,commentID:o.commentID,parentCommentID:o.parentCommentID,message:o.message};g.fire('comment.create',p);},_handleCommentRemovedMsg:function(o){if(!this.isValid())return;var p={href:o.href,commentID:o.commentID};g.fire('comment.remove',p);}});e.exports=n;},null);
__d("sdk.XFBML.CommentsCount",["ApiClient","sdk.DOM","sdk.XFBML.Element","sprintf"],function(a,b,c,d,e,f,g,h,i,j){var k=i.extend({process:function(){h.addCss(this.dom,'fb_comments_count_zero');var l=this.getAttribute('href',window.location.href);g.scheduleBatchCall('/v2.1/'+encodeURIComponent(l),{fields:'share'},ES(function(m){var n=(m.share&&m.share.comment_count)||0;h.html(this.dom,j('<span class="fb_comments_count">%s</span>',n));if(n>0)h.removeCss(this.dom,'fb_comments_count_zero');this.fire('render');},'bind',true,this));}});e.exports=k;},null);
__d("sdk.Helper",["sdk.ErrorHandling","sdk.Event","UrlMap","safeEval","sprintf"],function(a,b,c,d,e,f,g,h,i,j,k){var l={isUser:function(m){return m<2.2e+09||(m>=1e+14&&m<=100099999989999)||(m>=8.9e+13&&m<=89999999999999);},upperCaseFirstChar:function(m){if(m.length>0){return m.substr(0,1).toUpperCase()+m.substr(1);}else return m;},getProfileLink:function(m,n,o){if(!o&&m)o=k('%s/profile.php?id=%s',i.resolve('www'),m.uid||m.id);if(o)n=k('<a class="fb_link" href="%s">%s</a>',o,n);return n;},invokeHandler:function(m,n,o){if(m)if(typeof m==='string'){g.unguard(j)(m,o);}else if(m.apply)g.unguard(m).apply(n,o||[]);},fireEvent:function(m,n){var o=n._attr.href;n.fire(m,o);h.fire(m,o,n);},executeFunctionByName:function(m){var n=Array.prototype.slice.call(arguments,1),o=m.split("."),p=o.pop(),q=window;for(var r=0;r<o.length;r++)q=q[o[r]];return q[p].apply(this,n);}};e.exports=l;},null);
__d("sdk.XFBML.LoginButton",["sdk.Helper","IframePlugin"],function(a,b,c,d,e,f,g,h){var i=h.extend({constructor:function(j,k,l,m){this.parent(j,k,l,m);var n=h.getVal(m,'on_login');if(n)this.subscribe('login.status',function(o){g.invokeHandler(n,null,[o]);});},getParams:function(){return {scope:'string',perms:'string',size:'string',login_text:'text',show_faces:'bool',max_rows:'string',show_login_face:'bool',registration_url:'url_maybe',auto_logout_link:'bool',one_click:'bool',show_banner:'bool',auth_type:'string',default_audience:'string'};}});e.exports=i;},null);
__d("escapeHTML",[],function(a,b,c,d,e,f){var g=/[&<>"'\/]/g,h={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;','/':'&#x2F;'};function i(j){return j.replace(g,function(k){return h[k];});}e.exports=i;},null);
__d("sdk.XFBML.Name",["ApiClient","escapeHTML","sdk.Event","sdk.XFBML.Element","sdk.Helper","Log","sdk.Runtime"],function(a,b,c,d,e,f,g,h,i,j,k,l,m){var n=({}).hasOwnProperty,o=j.extend({process:function(){ES('Object','assign',false,this,{_uid:this.getAttribute('uid'),_firstnameonly:this._getBoolAttribute('first-name-only'),_lastnameonly:this._getBoolAttribute('last-name-only'),_possessive:this._getBoolAttribute('possessive'),_reflexive:this._getBoolAttribute('reflexive'),_objective:this._getBoolAttribute('objective'),_linked:this._getBoolAttribute('linked',true),_subjectId:this.getAttribute('subject-id')});if(!this._uid){l.error('"uid" is a required attribute for <fb:name>');this.fire('render');return;}var p=[];if(this._firstnameonly){p.push('first_name');}else if(this._lastnameonly){p.push('last_name');}else p.push('name');if(this._subjectId){p.push('gender');if(this._subjectId==m.getUserID())this._reflexive=true;}i.monitor('auth.statusChange',ES(function(){if(!this.isValid()){this.fire('render');return true;}if(!this._uid||this._uid=='loggedinuser')this._uid=m.getUserID();if(!this._uid)return;g.scheduleBatchCall('/v1.0/'+this._uid,{fields:p.join(',')},ES(function(q){if(n.call(q,'error')){l.warn('The name is not found for ID: '+this._uid);return;}if(this._subjectId==this._uid){this._renderPronoun(q);}else this._renderOther(q);this.fire('render');},'bind',true,this));},'bind',true,this));},_renderPronoun:function(p){var q='',r=this._objective;if(this._subjectId){r=true;if(this._subjectId===this._uid)this._reflexive=true;}if(this._uid==m.getUserID()&&this._getBoolAttribute('use-you',true)){if(this._possessive){if(this._reflexive){q='your own';}else q='your';}else if(this._reflexive){q='yourself';}else q='you';}else switch(p.gender){case 'male':if(this._possessive){q=this._reflexive?'his own':'his';}else if(this._reflexive){q='himself';}else if(r){q='him';}else q='he';break;case 'female':if(this._possessive){q=this._reflexive?'her own':'her';}else if(this._reflexive){q='herself';}else if(r){q='her';}else q='she';break;default:if(this._getBoolAttribute('use-they',true)){if(this._possessive){if(this._reflexive){q='their own';}else q='their';}else if(this._reflexive){q='themselves';}else if(r){q='them';}else q='they';}else if(this._possessive){if(this._reflexive){q='his/her own';}else q='his/her';}else if(this._reflexive){q='himself/herself';}else if(r){q='him/her';}else q='he/she';break;}if(this._getBoolAttribute('capitalize',false))q=k.upperCaseFirstChar(q);this.dom.innerHTML=q;},_renderOther:function(p){var q='',r='';if(this._uid==m.getUserID()&&this._getBoolAttribute('use-you',true)){if(this._reflexive){if(this._possessive){q='your own';}else q='yourself';}else if(this._possessive){q='your';}else q='you';}else if(p){if(null===p.first_name)p.first_name='';if(null===p.last_name)p.last_name='';if(this._firstnameonly&&p.first_name!==undefined){q=h(p.first_name);}else if(this._lastnameonly&&p.last_name!==undefined)q=h(p.last_name);if(!q)q=h(p.name);if(q!==''&&this._possessive)q+='\'s';}if(!q)q=h(this.getAttribute('if-cant-see','Facebook User'));if(q){if(this._getBoolAttribute('capitalize',false))q=k.upperCaseFirstChar(q);if(p&&this._linked){r=k.getProfileLink(p,q,this.getAttribute('href',null));}else r=q;}this.dom.innerHTML=r;}});e.exports=o;},null);
__d("sdk.XFBML.RecommendationsBar",["sdk.Arbiter","DOMEventListener","sdk.Event","sdk.XFBML.IframeWidget","resolveURI","sdk.Runtime"],function(a,b,c,d,e,f,g,h,i,j,k,l){var m=j.extend({getUrlBits:function(){return {name:'recommendations_bar',params:this._attr};},setupAndValidate:function(){function n(w,x){var y=0,z=null;function aa(){x();z=null;y=ES('Date','now',false);}return function(){if(!z){var ba=ES('Date','now',false);if(ba-y<w){z=setTimeout(aa,w-(ba-y));}else aa();}return true;};}function o(w){if(w.match(/^\d+(?:\.\d+)?%$/)){var x=Math.min(Math.max(parseInt(w,10),0),100);w=x/100;}else if(w!='manual'&&w!='onvisible')w='onvisible';return w;}function p(w){return Math.max(parseInt(w,10)||30,10);}function q(w){if(w=='left'||w=='right')return w;return l.getRtl()?'left':'right';}this._attr={channel:this.getChannelUrl(),api_key:l.getClientID(),font:this.getAttribute('font'),colorscheme:this.getAttribute('colorscheme'),href:k(this.getAttribute('href')),side:q(this.getAttribute('side')),site:this.getAttribute('site'),action:this.getAttribute('action'),ref:this.getAttribute('ref'),max_age:this.getAttribute('max_age'),trigger:o(this.getAttribute('trigger','')),read_time:p(this.getAttribute('read_time')),num_recommendations:parseInt(this.getAttribute('num_recommendations'),10)||2};this._showLoader=false;this.subscribe('iframe.onload',ES(function(){var w=this.dom.children[0];w.className='fbpluginrecommendationsbar'+this._attr.side;},'bind',true,this));var r=ES(function(){h.remove(window,'scroll',r);h.remove(document.documentElement,'click',r);h.remove(document.documentElement,'mousemove',r);setTimeout(ES(this.arbiterInform,'bind',true,this,'platform/plugins/recommendations_bar/action',null,g.BEHAVIOR_STATE),this._attr.read_time*1000);return true;},'bind',true,this);h.add(window,'scroll',r);h.add(document.documentElement,'click',r);h.add(document.documentElement,'mousemove',r);if(this._attr.trigger=="manual"){var s=ES(function(w){if(w==this._attr.href){i.unsubscribe('xfbml.recommendationsbar.read',s);this.arbiterInform('platform/plugins/recommendations_bar/trigger',null,g.BEHAVIOR_STATE);}return true;},'bind',true,this);i.subscribe('xfbml.recommendationsbar.read',s);}else{var t=n(500,ES(function(){if(this.calculateVisibility()){h.remove(window,'scroll',t);h.remove(window,'resize',t);this.arbiterInform('platform/plugins/recommendations_bar/trigger',null,g.BEHAVIOR_STATE);}return true;},'bind',true,this));h.add(window,'scroll',t);h.add(window,'resize',t);t();}this.visible=false;var u=n(500,ES(function(){if(!this.visible&&this.calculateVisibility()){this.visible=true;this.arbiterInform('platform/plugins/recommendations_bar/visible');}else if(this.visible&&!this.calculateVisibility()){this.visible=false;this.arbiterInform('platform/plugins/recommendations_bar/invisible');}return true;},'bind',true,this));h.add(window,'scroll',u);h.add(window,'resize',u);u();this.focused=true;var v=ES(function(){this.focused=!this.focused;return true;},'bind',true,this);h.add(window,'blur',v);h.add(window,'focus',v);this.resize_running=false;this.animate=false;this.subscribe('xd.signal_animation',ES(function(){this.animate=true;},'bind',true,this));return true;},getSize:function(){return {height:25,width:(this._attr.action=='recommend'?140:96)};},calculateVisibility:function(){var n=document.documentElement.clientHeight;if(!this.focused&&window.console&&window.console.firebug)return this.visible;switch(this._attr.trigger){case "manual":return false;case "onvisible":var o=this.dom.getBoundingClientRect().top;return o<=n;default:var p=window.pageYOffset||document.body.scrollTop,q=document.documentElement.scrollHeight;return (p+n)/q>=this._attr.trigger;}}});e.exports=m;},null);
__d("sdk.XFBML.Registration",["sdk.Auth","sdk.Helper","sdk.XFBML.IframeWidget","sdk.Runtime","UrlMap"],function(a,b,c,d,e,f,g,h,i,j,k){var l=i.extend({_visibleAfter:'immediate',_baseHeight:167,_fieldHeight:28,_skinnyWidth:520,_skinnyBaseHeight:173,_skinnyFieldHeight:52,setupAndValidate:function(){this._attr={action:this.getAttribute('action'),border_color:this.getAttribute('border-color'),channel_url:this.getChannelUrl(),client_id:j.getClientID(),fb_only:this._getBoolAttribute('fb-only',false),fb_register:this._getBoolAttribute('fb-register',false),fields:this.getAttribute('fields'),height:this._getPxAttribute('height'),redirect_uri:this.getAttribute('redirect-uri',window.location.href),no_footer:this._getBoolAttribute('no-footer'),no_header:this._getBoolAttribute('no-header'),onvalidate:this.getAttribute('onvalidate'),width:this._getPxAttribute('width',600),target:this.getAttribute('target')};if(this._attr.onvalidate)this.subscribe('xd.validate',ES(function(m){var n=ES('JSON','parse',false,m.value),o=ES(function(q){this.arbiterInform('Registration.Validation',{errors:q,id:m.id});},'bind',true,this),p=h.executeFunctionByName(this._attr.onvalidate,n,o);if(p)o(p);},'bind',true,this));this.subscribe('xd.authLogin',ES(this._onAuthLogin,'bind',true,this));this.subscribe('xd.authLogout',ES(this._onAuthLogout,'bind',true,this));return true;},getSize:function(){return {width:this._attr.width,height:this._getHeight()};},_getHeight:function(){if(this._attr.height)return this._attr.height;var m;if(!this._attr.fields){m=['name'];}else try{m=ES('JSON','parse',false,this._attr.fields);}catch(n){m=this._attr.fields.split(/,/);}if(this._attr.width<this._skinnyWidth){return this._skinnyBaseHeight+m.length*this._skinnyFieldHeight;}else return this._baseHeight+m.length*this._fieldHeight;},getUrlBits:function(){return {name:'registration',params:this._attr};},getDefaultWebDomain:function(){return k.resolve('www',true);},_onAuthLogin:function(){if(!g.getAuthResponse())g.getLoginStatus();h.fireEvent('auth.login',this);},_onAuthLogout:function(){if(!g.getAuthResponse())g.getLoginStatus();h.fireEvent('auth.logout',this);}});e.exports=l;},null);
__d("legacy:fb.xfbml",["Assert","sdk.domReady","sdk.Event","FB","IframePlugin","PluginTags","wrapFunction","XFBML","sdk.XFBML.Comments","sdk.XFBML.CommentsCount","sdk.XFBML.LoginButton","sdk.XFBML.Name","sdk.XFBML.RecommendationsBar","sdk.XFBML.Registration"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n){var o={comments:b('sdk.XFBML.Comments'),comments_count:b('sdk.XFBML.CommentsCount'),login_button:b('sdk.XFBML.LoginButton'),name:b('sdk.XFBML.Name'),recommendations_bar:b('sdk.XFBML.RecommendationsBar'),registration:b('sdk.XFBML.Registration')};ES(ES('Object','keys',false,l),'forEach',true,function(q){n.registerTag({xmlns:'fb',localName:q.replace(/_/g,'-'),ctor:k.withParams(l[q])});});ES(ES('Object','keys',false,o),'forEach',true,function(q){n.registerTag({xmlns:'fb',localName:q.replace(/_/g,'-'),ctor:o[q]});});j.provide('XFBML',{parse:function(q){g.maybeXfbml(q,'Invalid argument');if(q&&q.nodeType===9)q=q.body;return n.parse.apply(null,arguments);}});n.subscribe('parse',ES(i.fire,'bind',true,i,'xfbml.parse'));n.subscribe('render',ES(i.fire,'bind',true,i,'xfbml.render'));i.subscribe('init:post',function(q){if(q.xfbml)setTimeout(m(ES(h,'bind',true,null,n.parse),'entry','init:post:xfbml.parse'),0);});g.define('Xfbml',function(q){return (q.nodeType===1||q.nodeType===9)&&typeof q.nodeName==='string';});try{if(document.namespaces&&!document.namespaces.item.fb)document.namespaces.add('fb');}catch(p){}},3);
__d("legacy:fb.xfbml-legacy",["FB","sdk.Event"],function(a,b,c,d,e,f,g,h){g.provide('XFBML.RecommendationsBar',{markRead:function(i){h.fire('xfbml.recommendationsbar.read',i||window.location.href);}});},3);

}).call({}, window.inDapIF ? parent.window : window);
} catch (e) {new Image().src="http:\/\/www.facebook.com\/" + 'common/scribe_endpoint.php?c=jssdk_error&m='+encodeURIComponent('{"error":"LOAD", "extra": {"name":"'+e.name+'","line":"'+(e.lineNumber||e.line)+'","script":"'+(e.fileName||e.sourceURL||e.script)+'","stack":"'+(e.stackTrace||e.stack)+'","revision":"1450716","message":"'+e.message+'"}}');};
/**
 * StumbleUpon - http://www.stumbleupon.com
 * Copyright (c) 2011 StumbleUpon
 * Author: Stefan De Clercq
 *
 *
 *
 */

 /**
  * @namespace STMBLPN public namespace for StumbleUpon widgets and badges
  */

STMBLPN = window.STMBLPN || {};

(function() {
  if (STMBLPN && STMBLPN.hasHelperFunctions)
    return;

  if (STMBLPN instanceof Array)
  {
      var list = STMBLPN;
      STMBLPN = {};
      STMBLPN.list = list;
  }

  STMBLPN.browser = function() {
    var ua = navigator.userAgent;
    return { ie: ua.match(/MSIE\s([^;]*)/) };
  }();

  STMBLPN.trim = function(str) {
    return str.replace(/^\s+|\s+$/g, '');
  };
  STMBLPN.byId = function(id) {
    if (typeof id == 'string') {
      return document.getElementById(id);
    }
    return id;
  };
  STMBLPN.loadStyleSheet = function(url, Namespace, widgetEl) {
    if (!STMBLPN.Namespace.loadingStyleSheet) {
      STMBLPN.Namespace.loadingStyleSheet = true;
      var linkElement = document.createElement('link');
      linkElement.href = url;
      linkElement.rel = 'stylesheet';
      linkElement.type = 'text/css';
      document.getElementsByTagName('head')[0].appendChild(linkElement);
      var timer = setInterval(function() {
        var style = getStyle(widgetEl, 'position');
        if (style == 'relative') {
          clearInterval(timer);
          timer = null;
          STMBLPN.Namespace.hasLoadedStyleSheet = true;
        }
      }, 50);
    }
  };
  STMBLPN.jsonP = function(url, callback) {
    var script = document.createElement('script');
    var head = document.getElementsByTagName('head')[0];
    script.type = 'text/javascript';
    script.src = url;
    head.insertBefore(script, head.firstChild);
    callback(script);
    return script;
  };
  /**
    * classes object
    * -has - add - remove
    */
  STMBLPN.classes = {
    has: function(el, c) {
      return new RegExp("(^|\\s)" + c + "(\\s|$)").test(STMBLPN.byId(el).className);
    },
    add: function(el, c) {
      if (!this.has(el, c)) {
        STMBLPN.byId(el).className = STMBLPN.trim(STMBLPN.byId(el).className) + ' ' + c;
      }
    },
    remove: function(el, c) {
      if (this.has(el, c)) {
        STMBLPN.byId(el).className = STMBLPN.byId(el).className.replace(new RegExp("(^|\\s)" + c + "(\\s|$)", "g"), "");
      }
    }
  };
  /**
    * x-browser event listener
    * eg: STMBLPN.events.add(element, 'click', fn);
    */
  STMBLPN.events = {
    add: function(el, type, fn) {
      if (el.addEventListener) {
        el.addEventListener(type, fn, false);
      }
      else {
        el.attachEvent('on' + type, function() {
          fn.call(el, window.event);
        });
      }
    },
    remove: function (el, type, fn) {
      if (el.removeEventListener) {
        el.removeEventListener(type, fn, false);
      }
      else {
        el.detachEvent('on' + type, fn);
      }
    },
    // domready function from dustin diaz http://dustindiaz.com/smallest-domready-ever
    ready: function(f) {
      /in/.test(document.readyState)?setTimeout('STMBLPN.events.ready('+f+')',9):f();
    }
  };
  STMBLPN.wasBadgeDataColleted = false;
  STMBLPN.collectBadgeData = function() {
    try {
      if (!window._gat)
        return;
      var account = window._gat._getTrackerByName()._getAccount();
      if (account.indexOf('UA-XXXX') == 0)
        account = window.pageTracker._getAccount();
      var params = {
        'utmn': (new Date()).getTime(), //cachebuster
        'utmhn': document.location.hostname,
        'utmt': 'event',
        'utmr': 'http://www.stumbleupon.com/refer.php',
        'utmp': document.location.pathname,
        'utmac': account,
        'url': document.URL,
        'utmcc': ''
      };
      var ga_cookies = {'__utma': true, '__utmb': true, '__utmc': true, '__utmz': true };
      var cookies = document.cookie.split(';');
      for(var i=0; i < cookies.length; i++) {
        var pos = cookies[i].indexOf('=');
        if (pos == -1) continue;
        var cookie_name = cookies[i].substring(0, pos);
        var cookie_value = cookies[i].substring(pos);
        if(ga_cookies[cookie_name] === true)
          params['utmcc'] += (params['utmcc'] ? ';' : '') + cookie_name + "=" + cookie_value;
      }
      var data = [];
      for (var param in params)
        data.push("\"" + param + "\": \"" + String(params[param]).replace("\"", "\\\"") + "\"");
      return "{\"type\": \"SU_BADGEMESSAGE\", \"params\": {" + data.join(', ') + "}}";

    } catch (e) {}
  };

  STMBLPN.createIframe = function (src, width, height) {
    var e = document.createElement('iframe');
    e.scrolling = 'no';
    e.frameBorder = '0';
    e.setAttribute('allowTransparency', 'true');
    e.style.overflow = 'hidden';
    e.style.margin = 0;
    e.style.padding = 0;
    e.style.border = 0;

    e.src = src;
    if (width)
      e.width = width;
    if (height)
      e.height = height;
    return e;
  };

  STMBLPN.isNode = function (o) {
    return (
      typeof Node === "object" ? o instanceof Node :
      typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
    );
  };

  STMBLPN.wasProcessLoaded = false;

  STMBLPN.processWidgets = function() {
    STMBLPN.wasProcessLoaded  = true;

    var els = document.getElementsByTagName('su:badge');
    if(els) {
      var attributes = ['layout', 'location', 'id', 'domain'];
      var widgets = [];
      for(var i = 0; i < els.length; i++) {
        var w = els[i];
        var opts = {'container': w, 'type': 'badge'};
        for (var j = 0; j < attributes.length; j++) {
          var a = w.getAttribute(attributes[j]);
          if (a)
            opts[attributes[j]] = a;
        }
        widgets.push(new STMBLPN.Widget(opts));
      }
      for (var i = 0; i < widgets.length; i++)
         widgets[i].render();
      STMBLPN.Widget.sendBadgeData();
    }

    els = document.getElementsByTagName('su:follow');
    if (els) {
      var widgets = [];
      for(var i = 0; i < els.length; i++) {
        var w = els[i];
        var opts = {'container': w, 'type': 'follow'};
        opts['ref'] = w.getAttribute('ref');
        if (!opts['ref'])
          continue;

        var attributes = ['layout', 'id', 'domain'];
        for (var j = 0; j < attributes.length; j++) {
          var a = w.getAttribute(attributes[j]);
          if (a)
            opts[attributes[j]] = a;
        }
        widgets.push(new STMBLPN.Widget(opts));
      }
      for (var i = 0; i < widgets.length; i++)
         widgets[i].render();
    }
  };

  STMBLPN.hasHelperFunction = true;

  return true;
})();

(function() {
  if (STMBLPN && STMBLPN.Widget) {
    // this is most likely happens when people try to embed multiple
    // badges/widgets on the same page and include this script again
    return;
  }

  /**
    * @constructor
    * Badge Base for new instances of the StumbleUpon badge widget
    * @param {Object} opts the configuration options for the widget
    */
  STMBLPN.Widget = function(opts) {
    this.init(opts);
  };

  (function() {
      isHttps = window.location.protocol.match(/https/);

      STMBLPN.Widget.sendBadgeData = function() {
        try {
          if (STMBLPN.wasBadgeDataColleted)
            return;
          STMBLPN.wasBadgeDataColleted = true;
          var data = STMBLPN.collectBadgeData();
          if (!data)
            return;
          top.postMessage(data, 'http://www.stumbleupon.com');
        } catch (e){ }
      };

      // STMBLPN.Widget.isLoaded = false;
      // STMBLPN.Widget.loadingStyleSheet = false;
      // STMBLPN.Widget.hasLoadedStyleSheet = false;
      STMBLPN.Widget.NUMBER = 0;

      STMBLPN.Widget.prototype = function() {
        var scheme = (isHttps? 'https:' : 'http:') + '//';

        var badgeBase = '/badge/embed/';
        var followBase = '/widgets/follow_badge.php';
        var bestofBase = '/widgets/get.php';

        return {
	        init: function(opts) {
            var that = this;
            this._badgeNumber = ++STMBLPN.Widget.NUMBER;
            this.selfContainer = false;
            this.domain = opts.domain ? opts.domain.replace(/^\.+/g, '') : 'stumbleupon.com';
            this.type = opts.type || 'badge';
            this.layout = opts.layout? parseInt(opts.layout) : 1;
            this.layout = this.layout || 1;
            this.id = opts.id || 'stmblpn-widget-' + this._badgeNumber;
            this.container = opts.container;

            if (opts.id) {
              var e = STMBLPN.byId(opts.id);
              // check if e is node as well / html5 and some browsers return HTMLUnknownElement for not found
              // && STMBLPN.isNode(e) && !e instanceof HTMLUnknownElement
              if (e) {
                this.selfContainer = true;
              }
            }

            if (!this.container && !this.selfContainer) {
              document.write('<div id="' + this.id + '"></div>');
              this.container = STMBLPN.byId(this.id);
            }

            // set widget specific data
            switch(this.type) {
              case 'badge':
                this.location = opts.location || document.URL;
                break;
              case 'follow':
                this.ref = opts.ref;
                break;
              case 'bestof':
                this.title = opts.title || '';
                this.request = [];
                var params = ['usernames', 'channels', 'topics', 'sites'];

                for (var k = 0; k < params.length; k++) {
                  var key = params[k];
                  if (! opts[key])
                    continue;
                  var r = opts[key];
                  if (typeof r == 'object' && r instanceof Array) {
                    for (var i = 0; i < r.length; i++)
                      this.request.push(key + '[]=' + encodeURIComponent(r[i]));
                  } else this.request.push(key + '=' + encodeURIComponent(r));
                }
                break;
            }

            return this;
          },

          /**
            * @public
            * @return self
            * renders the widget onto an HTML page
            */
          render: function() {
            var that = this;
            var src = this._getIframeSrc();
            var dimensions = this._getIframeDimensions();

            var parent = null;
            var iframe = STMBLPN.createIframe(src, dimensions['width'], dimensions['height']);
            iframe.id = 'iframe-' + this.id;

            if (this.container && STMBLPN.isNode(this.container)) {
              parent = this.container.parentNode;
            }

            if (this.selfContainer) {
              STMBLPN.byId(this.id).appendChild(iframe);
            } else {
              if (parent)
                parent.insertBefore(iframe, this.container);
            }
            // check if container again, may have been removed by other call
            if (this.container && STMBLPN.isNode(this.container)) {
              parent.removeChild(this.container);
              delete this.container;
            }

            return this;
          },

          /**
            * @private
            * gets type specific iframe src
            */
          _getIframeSrc: function() {
            if (this.type == 'badge') {
              var sub = (isHttps ? "www." : "badge.");
              return scheme + sub + this.domain + badgeBase + this.layout + '/?url=' + encodeURIComponent(this.location);
            } else if (this.type == 'follow')
              return scheme + 'www.' + this.domain + followBase + '?id=' + this.ref + '&l=' + this.layout;
            else if (this.type == 'bestof')
              return scheme + 'www.' + this.domain + bestofBase + '?' + this.request.join('&')  + '&l=' + this.layout + '&title=' + encodeURIComponent(this.title);
          },

          /**
            * @private
            * gets type specific iframe dimensions
            */
          _getIframeDimensions: function() {
            var dimensions;
            if (this.type == 'badge') {
              dimensions = {
                1:    {'width': 74, 'height': 18},
                2:    {'width': 65, 'height': 18},
                4:    {'width': 18, 'height': 18},
                5:    {'width': 50, 'height': 60},
                6:    {'width': 30, 'height': 31},
                200:  {'width': 108, 'height': 22},
                310:  {'width': 128, 'height': 22}
              };
              dimensions[3] = dimensions[2];
              dimensions[210] = dimensions[200];
              dimensions[300] = dimensions[200];
              dimensions[this.layout] = dimensions[this.layout] || dimensions[1];
              return dimensions[this.layout];
            } else if (this.type == 'follow') {
              dimensions = {
                1: {'width': 154, 'height': 21},
                2: {'width': 210, 'height': 28},
                3: {'width': 160, 'height': 105}
              };

              dimensions[this.layout] = dimensions[this.layout] || dimensions[1];
              return dimensions[this.layout];
            } else if (this.type == 'bestof') {
              dimensions = {
                1: {'width': 300, 'height': 250},
                2: {'width': 600, 'height': 250},
                3: {'width': 160, 'height': 600}
              };
              dimensions[this.layout] = dimensions[this.layout] || dimensions[1];
              return dimensions[this.layout];
            }

            return {'width': null, 'height': null};
          }
        };
      }();
  })();
})();

(function() {
  if (STMBLPN.wasProcessLoaded == false) {
    STMBLPN.wasProcessLoaded = true;
    STMBLPN.events.ready(STMBLPN.processWidgets);
  }

  if (STMBLPN.list) {
     while(STMBLPN.list.length)
       new STMBLPN.Widget(STMBLPN.list.shift()).render();
  }
})();
;
var Tumblr=window.Tumblr||{};(function(){Tumblr.share_on_tumblr=function(anchor){var advanced=anchor.href.match(/(www.)?tumblr(\.com)?(\:\d{2,4})?\/share(.+)?/i);advanced=(advanced[4]!==undefined&&advanced[4].length>1);var d=document,w=window,e=w.getSelection,k=d.getSelection,x=d.selection,s=(e?e():(k)?k():(x?x.createRange().text:0)),f="http://www.tumblr.com/share",l=d.location,e=encodeURIComponent,p="?v=3&u="+e(l.href)+"&t="+e(d.title)+"&s="+e(s),u=f+p;if(advanced){u=anchor.href}try{if(!/^(.*\.)?tumblr[^.]*$/.test(l.host)){throw (0)}tstbklt()}catch(z){a=function(){if(!w.open(u,"t","toolbar=0,resizable=0,status=1,width=450,height=430")){l.href=u}};if(/Firefox/.test(navigator.userAgent)){setTimeout(a,0)}else{a()}}void (0)};Tumblr.activate_share_on_tumblr_buttons=function(){var anchors=document.getElementsByTagName("a"),anchors_length=anchors.length,match=false,old_onclick;for(var i=0;i<anchors_length;i++){match=anchors[i].href.match(/(www.)?tumblr(\.com)?(\:\d{2,4})?\/share(.+)?/i);if(match){old_onclick=anchors[i].onclick;anchors[i].onclick=function(e){Tumblr.share_on_tumblr(this);if(old_onclick){old_onclick()}old_onclick=false;e.preventDefault()}}}};(function(i){var u=navigator.userAgent;var e=
/*@cc_on!@*/
false;var st=setTimeout;if(/webkit/i.test(u)){st(function(){var dr=document.readyState;if(dr=="loaded"||dr=="complete"){i()}else{st(arguments.callee,10)}},10)}else{if((/mozilla/i.test(u)&&!/(compati)/.test(u))||(/opera/i.test(u))){document.addEventListener("DOMContentLoaded",i,false)}else{if(e){(function(){var t=document.createElement("doc:rdy");try{t.doScroll("left");i();t=null}catch(e){st(arguments.callee,0)}})()}else{window.onload=i}}}})(Tumblr.activate_share_on_tumblr_buttons)}());;
$.ajax({
  url: document.location.protocol + '//munchkin.marketo.net/munchkin.js',
  dataType: 'script',
  cache: true,
  success: function() {
    Munchkin.init('189-VNG-478');
  }
});;
adroll_adv_id = "MUMVFSAHW5E3HPPU4GASIX";
adroll_pix_id = "HDNOFOB2LFBVNP2EWAKBJO";
(function () {
var oldonload = window.onload;
window.onload = function(){
   __adroll_loaded=true;
   var scr = document.createElement("script");
   var host = (("https:" == document.location.protocol) ? "https://s.adroll.com" : "http://a.adroll.com");
   scr.setAttribute('async', 'true');
   scr.type = "text/javascript";
   scr.src = host + "/j/roundtrip.js";
   ((document.getElementsByTagName('head') || [null])[0] ||
    document.getElementsByTagName('script')[0].parentNode).appendChild(scr);
   if(oldonload){oldonload()}};
}());;
/* Establish namespaces
-------------------------------------------------- */
var dd = dd || {};
dd.social = dd.social || {};
dd.social.subscription_modal = dd.social.subscription_modal || {};
dd.social.subscription_modal.subscriptionModalShowing = false;
/* Sets event handlers for the modal
-------------------------------------------------- */
dd.social.subscription_modal.setEventHandlers = function() {
    $('#subscriptionModal #close').click(function(e) {
        dd.social.subscription_modal.hideModal('once');
    });
    $('#subscriptionModal #donotshow').click(function(e) {
        dd.social.subscription_modal.hideModal('forever');
    });
    $(window).on('unload', function() {
        if (dd.social.subscription_modal.subscriptionModalShowing === true) {
            dd.ga.events.track(['Subscription Modal', 'Window Close While Visible', 'Page URL', document.location.href], true);
        }
    });
};

/* Verifies the user meets requirements to be
   shown the modal
-------------------------------------------------- */
dd.social.subscription_modal.checkVisitor = function() {
    //cast to int to make sure we can count.
    var visits = parseInt(dd.cookies.get('modalPageview') ? dd.cookies.get('modalPageview') : 0);
    //if visits is -1, we already got a "do not show" click on a previous visit
    if (visits != -1) {
        // increment the count and save the visit
        visits++;
        dd.cookies.set('modalPageview', visits, 999);
        
        // if this is the second time we've seen this user, lets be friends!
        if (visits > 1) {
            //let's make a friend
              dd.social.subscription_modal.showModal();
        }
    }
};

/* Shows the modal
-------------------------------------------------- */
dd.social.subscription_modal.showModal = function() {
    $('#modal-page').show();
    dd.social.subscription_modal.subscriptionModalShowing = true;
    dd.ga.events.track(['Subscription Modal', 'Show', 'Page URL', document.location.href], true);
};

/* Hides the modal, forever (999 days) or 1 day
-------------------------------------------------- */
dd.social.subscription_modal.hideModal = function(hideTimes) {
    hideTimes = typeof hideTimes !== undefined ? hideTimes : 'once'; // default value
    if (hideTimes == 'once') {
        // Sets to -1 for never show, but sets cookie expiration to 1 day. 
        dd.cookies.set('modalPageview', parseInt('-1'), 1);
        dd.ga.events.track(['Subscription Modal', 'Hide Today', 'Page URL', document.location.href], true);
    } else if (hideTimes == 'forever') {
        // Sets to -1 for never show, and sets cookie expiration to 999 days.
        dd.cookies.set('modalPageview', parseInt('-1'), 999);
        dd.ga.events.track(['Subscription Modal', 'Hide Forever', 'Page URL', document.location.href], true);
    }
    $('#modal-page').hide();
    dd.social.subscription_modal.subscriptionModalShowing = false;
};

/* Let's get this party started, right? 
-------------------------------------------------- */
//  Never show on "/"
/*
# Disabled in XCPANTS-1557. 
# If dd.social.subscription_modal.checkVisitor() is never called, nothing happens. 
#

if(window.location.pathname !== "/"){
    $(document).ready(function() {
			dd.social.subscription_modal.setEventHandlers();
            //wait 2.3 seconds for a little more impact and cleaner loading. 
            var x = setTimeout(function(){ dd.social.subscription_modal.checkVisitor(); }, 2300);
    });
}
*/



;
