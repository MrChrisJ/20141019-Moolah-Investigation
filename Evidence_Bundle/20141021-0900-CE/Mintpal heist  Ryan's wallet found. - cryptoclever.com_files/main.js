jQuery(document).ready(function($) {
"use strict";
// remove empty p
	$('p')
	.filter(function() {
	    return $.trim($(this).text()) === '' && $(this).children().length == 0
	})
	.remove();
	
	//images
	if(!( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )) {
	$('body.fade-imgs-in-appear .main-container img, body.fade-imgs-in-appear .sidebar img, body.fade-imgs-in-appear .secondary-sidebar img, body.fade-imgs-in-appear #footer img').addClass('disappear');
	$('body.fade-imgs-in-appear .main-container img, body.fade-imgs-in-appear .sidebar img, body.fade-imgs-in-appear .secondary-sidebar img, body.fade-imgs-in-appear #footer img').one('inview', function() {$(this).addClass('appear');});
	}
	
   //place holder
    $('input').each(function() {
    $(this).data('holder',$(this).attr('placeholder'));
    
    $('input').focusin(function(){
        $(this).attr('placeholder','');
    });
    $('input').focusout(function(){
        $(this).attr('placeholder',$(this).data('holder'));
    });
        });
    $('textarea').data('holder',$('textarea').attr('placeholder'));
    
    $('textarea').focusin(function(){
        $(this).attr('placeholder','');
    });
    $('textarea').focusout(function(){
        $(this).attr('placeholder',$(this).data('holder'));
    });
    
//HIDPI Images
    var hidpi = window.devicePixelRatio > 1 ? true : false;
    if (hidpi) {
    // Replace img src with data-hidpi
    $('img[data-hidpi]').each(function() {
    // If width x height hasn't been set, fill it in
    if ($(this).parents('.tab-content').length === 0) {
	/*
	if ($(this).attr('width') === undefined) {
	$(this).attr('width', $(this).width());
	}
	if ($(this).attr('height') === undefined) {
	$(this).attr('height', $(this).height());
	}
	*/
    }
    $(this).attr('src', $(this).data('hidpi'));
    });
    }    
//feature slider
var fsw = $('.def-slider').width();
if (fsw > 650) {
    $('.def-slider-wrap .def-slider-item a img').each(function() {
    $(this).attr('src', $(this).data('hidpi'));
    });
}
    
//tabbed widget
if (jQuery(".widget_momizattabber").length) {
     jQuery(".widget_momizattabber").each(function(){
        var ul = jQuery(this).find(".main_tabs ul.widget-tabbed-header");

        jQuery(this).find(".widget-tab").each(function() {
            jQuery(this).find('a.mom-tw-title').wrap('<li></li>').parent().detach().appendTo(ul);
        });
    });
}

//widgets
    $('.widget select').wrap('<div class="mom-select"></div>')
	// search
	$('.top-bar .top-search').click(function(e) {
	    $(this).toggleClass('active');
	    //$(this).next('.search-wrap').fadeToggle(250);
	    $(this).next('.search-dropdown').toggleClass('sw-show');
	    e.stopPropagation();
	
	});
	$('.search-dropdown').click(function(e) {
	    e.stopPropagation();
	});
	
	$('body').click(function(e) {
	    $('.top-bar .top-search').removeClass('active');
	    $('.search-dropdown').removeClass('sw-show');
	});
	
	
	//Mobile Menus
    if ($('.top_menu_handle').length) {
	    $('.top_menu_handle').toggle( function () {
		$(this).next('.mobile_top_nav').show();
		$(this).addClass('tmh_close');
	    }, function () {
		$(this).next('.mobile_top_nav').hide();
		$(this).removeClass('tmh_close');
	    });
	}
	//br
	$('.brmenu').click(function(e) {
	    $(this).toggleClass('active');
	    //$(this).next('.search-wrap').fadeToggle(250);
	    $(this).next('.br-right').toggleClass('sw-show');
	    e.stopPropagation();
	
	});
	$('.br-right').click(function(e) {
	    e.stopPropagation();
	});
	
	$('body').click(function(e) {
	    $('.brmenu').removeClass('active');
	    $('.br-right').removeClass('sw-show');
	});

	//Sticky navigation
	if ($('body').hasClass('sticky_navigation_on')) {
	        var aboveHeight = $('#header-wrapper').outerHeight();
		var sl = $('#navigation').data('sticky_logo');
		var slw = $('#navigation').data('sticky_logo_width');
	        $(window).scroll(function(){
		        //if scrolled down more than the headerÕs height
	                if ($(window).scrollTop() > aboveHeight){
		        // if yes, add ÒfixedÓ class to the <nav>
		        // add padding top to the #content
	            if ( $('#wpadminbar').length ) {
	                $('#navigation').addClass('sticky-nav').css('top','28px').next().css('padding-top','52px');
	             } else {
	                $('#navigation').addClass('sticky-nav').css('top','0').next().css('padding-top','52px');
	            }
			    if (sl !== '') {
				$('.sticky_logo').show();
				$('#navigation > .inner').stop().animate({
					'padding-left': (slw+15)+'px',
				    }, 300);
			    }
	                } else {
	 
		        // when scroll up or less than aboveHeight,
	                $('#navigation').removeClass('sticky-nav').css('top', 0).next().css('padding-top','0');
			    if (sl !== '') {
				$('.sticky_logo').hide();
			    $('#navigation > .inner').stop().animate({
				    'padding-left': 0,
				});
			    }
	                }
	        });	
	}
		
  //tabbed sort
  $('.tabbed-sort li').click(function() {
    var layout = $(this).attr('class');
        $('.tabbed-sort li').removeClass('active')
        $(this).addClass('active');
    if (layout === 'list') {
        $('.f-tabbed-body ul').removeClass('f-tabbed-grid');
        $('.f-tabbed-body ul').addClass('f-tabbed-list');
    } else {
        $('.f-tabbed-body ul').addClass('f-tabbed-grid');
        $('.f-tabbed-body ul').removeClass('f-tabbed-list');
    }
    return false;

    });

    //widget weather  
    $('.w-item-wrap').each( function() {
        var acc = $(this);
            acc.find('.w-item-open').addClass('active');
            acc.find('.w-item-open').next('.w-item-content').show();
            acc.find('.w-item-close').removeClass('active');
            acc.find('.w-item-close').next('.w-item-content').hide();
            
            acc.find('.w-item-title').click(function() {
            $(this).toggleClass('active');
            $(this).next('.w-item-content').slideToggle();
        });
    }); 
  
    //category count
    $('.sidebar li.cat-item, .sidebar .widget_archive li').each(function(){
       var $contents = $(this).contents();
       if ($contents.length > 1)  {
       $contents.eq(1).wrap('<div class="cat_num"></div>');

       $contents.eq(1).each(function(){
    });
              }
        }).contents();
                $('.sidebar li.cat-item .cat_num, .sidebar .widget_archive li .cat_num').each(function () {
                   $(this).html($(this).text().substring(2));
                  $(this).html( $(this).text().replace(/\)/gi, "") );
                });
    
    if ($('.sidebar li.cat-item').length) {
        $('.sidebar li.cat-item .cat_num').each( function() {
            if ($(this).is(':empty')){
                $(this).hide();
            }
            
        });
    }
    
    $(".secondary-sidebar .widget_archive li, .secondary-sidebar .widget_categories li").html( function(idx, html){
	    return html.replace(/(\d+)/g, ' $1 ')
	});
    
    //category sort
    $('.cat-sort li').click(function() {
    var layout = $(this).attr('class');
        $('.cat-sort li').removeClass('active')
        $(this).addClass('active');
    if (layout === 'list') {
        $('.cat-body ul').removeClass('cat-grid');
        $('.cat-body ul').addClass('cat-list');
    } else {
        $('.cat-body ul').addClass('cat-grid');
        $('.cat-body ul').removeClass('cat-list');
    }
    return false;

    });
    $(window).resize(function() {
	  if ($(window).width() < 568) {
	    $('.cat-body ul').removeClass('cat-grid');
        $('.cat-body ul').addClass('cat-list');
	  } 
	});
	
    if ( $(window).width() < 568) {
		$('.cat-body ul').removeClass('cat-grid');
        $('.cat-body ul').addClass('cat-list');
	}
    
    // Post share
	if ($('.mom-share-buttons').length) {
	    $('.mom-share-buttons').data('height',$('.mom-share-buttons').css('height'));
	    var curHeight = $('.mom-share-buttons').height();
	    $('.mom-share-buttons').css('height', 'auto');
	    var autoHeight = $('.mom-share-buttons').height();
	    $('.mom-share-buttons').css('height', curHeight);
	    $('.mom-share-post .sh_arrow').toggle(function () {
	    $('.mom-share-buttons').stop().animate({height: autoHeight}, 300);
	    $(this).find('i').removeClass();
	    $(this).find('i').addClass('fa-icon-double-angle-up');
	    }, function () {
	    $('.mom-share-buttons').stop().animate({height: $('.mom-share-buttons').data('height')}, 300);
	    $(this).find('i').removeClass();
	    $(this).find('i').addClass('fa-icon-double-angle-down');
	    });
	}
	
	
    // expand post image
    var imgH = $('.entry-content-data .post-thumbnail').outerHeight()+20;
    var pi_w = $('.entry-content-data .post-thumbnail').parent().parent().width()-12;
    $('.entry-content-data').css('padding-top',imgH+'px');
    $('.entry-content-data .post-thumbnail').click(function() {
        if (!$(this).hasClass('active') ) {
		$(this).animate({
		   width: pi_w+'px',
		   left:0,
		});
	        $(this).addClass('active');
	        $(this).find('desc').fadeOut();
        } else {
            $(this).removeClass('active');
            $(this).find('desc').fadeIn();
		$(this).animate({
		   width: '152px',
		});
	}
    });
       
   //widget tabs
    if ($("ul.widget-tabbed-header").length) { $("ul.widget-tabbed-header").momtabs("div.widget-tabbed-body > .widget-tab", { effect: 'fade'}); }
    
    // get current time
    var now = new Date();
    $('.t-w-title .weather-date span').text(now.getHours()+':'+now.getMinutes());
    
    // units form
    if ($('#units-form').length) {
	$('#units-form input[type="radio"]').click(function() {
	    $('#units-form').submit();
	});
    }

    // Avanced search form Validate
    $('#advanced-search [type="submit"]').click(function(e) {
	var s = $(this).parent().find('input[name="s"]');
	if (s.val() === '' ) {
	    e.preventDefault()
	    s.addClass('invalid');
	    s.attr('placeholder', s.data('nokeyword'));
	}
    });
    
    $('.media-sort-form #media-sort').change(function() {
    $('#advanced-search').submit();
    });
    
    //Fix ajax search
   $( ".ajax-search-results h4" ).prev().css( "border-bottom", "none" );
   
   //social icons
	if ($('ul.top-social-icon').length) {
	    $('ul.top-social-icon li').each(function () {
	    var dataHover = $(this).attr('data-bghover');
	    if (typeof dataHover !== 'undefined' && dataHover !== false) {
		 var origBg = $(this).css('background');
		 var hoverBg = $(this).data('bghover');
		$(this).hover(function() {
		    $(this).css('background', hoverBg)
		}, function() {
		    $(this).css('background', origBg)
		});
	    }
	    });
	}
	
	//back to top 	
	var offset = 220;
    var duration = 500;
    jQuery(window).scroll(function() {
        if (jQuery(this).scrollTop() > offset) {
            jQuery('.toup').css({
            	opacity: "1",
            	display: "block",
            });
        } else {
            jQuery('.toup').css('opacity', '0');
        }
    });
    
    jQuery('.toup').click(function(event) {
        event.preventDefault();
        jQuery('html, body').animate({scrollTop: 0}, duration);
        return false;
    })
    
    //Category Menu 
    $('.mom-megamenu ul.sub-menu li').mouseenter(function() {
	    var id = $(this).attr('id');
	    var id = id.split('-');
	    //console.log(id[2]);
	    $(this).parent().find('li').removeClass('active');
	    $(this).addClass('active');
	    $(this).parent().next('.sub-mom-megamenu, .sub-mom-megamenu2').find('.mom-cat-latest').hide();
	    $(this).parent().next('.sub-mom-megamenu, .sub-mom-megamenu2').find('#mom-mega-cat-'+id[2]).show();
	});
    
    //Submenu auto align
    $('ul.main-menu > li').each(function(e){
        var t = $(this),
            submenu = t.find('.cats-mega-wrap');
        if( submenu.length > 0 ) {
            var offset = submenu.offset(),
                w = submenu.width();
            if( offset.left + w > $(window).width() ) {
                t.addClass('sub-menu-left');
            } else {
                t.removeClass('sub-menu-left');
            }
        }
    });
        
	//post share
	$('.mom-share-buttons a').click(function(e) {e.preventDefault();})


	// scroll to links
	$('.story-highlights ul li a').click(function(){
	   $('html, body').animate({
	       scrollTop: $('[name="' + $.attr(this, 'href').substr(1) + '"]').offset().top-18
	   }, 800);
	   return false;
	});

	
	// Footer Mega Menu
	var fm_count = $('.footer_mega_menu > li').length;
	var item_width = 100/fm_count;
	$('.footer_mega_menu > li').css('width', item_width+'%');
	//alert(fm_count);
	
	//fix twitter widget 
	$('.twiter-list ul.twiter-buttons li a').click( function(e) {
    e.preventDefault();
	});

	// author timeline
	var i = 2;
	 var tl_count = $('.mom-blog-timeline .tl-month').length;
	 $('.blog-timeline-more').click(function(e) {
	    e.preventDefault();
	    if (tl_count > i) {
		$('.mom-blog-timeline .tl-month:eq('+i+')').slideDown();
	    } else {
		$(this).text(momAjaxL.nomore);
	    }
	    console.log(i);
	    i = i+1;
	});
	
    //Ads
	if ($('.mca-fixed').length) {
	    var mca_top = $('.mca-fixed').offset().top;
	    var mca = $('.mca-fixed');
	        $(window).scroll(function(){
		    if ($(window).scrollTop() > mca_top){
			if ( $('#wpadminbar').length ) {
			    mca.css({ top:'28px', position: 'fixed' });
			    mca.addClass('mca_touch_top');
			 } else {
			    mca.css({ top:'0', position: 'fixed' });
			    mca.addClass('mca_touch_top');
			} 
		    } else {
			mca.css({ top:'auto', position: 'absolute' });
			mca.removeClass('mca_touch_top');
		    }
	        });    
	}

	// Responsive menus
	$('.top-menu-holder').click(function() {
	    $('.device-top-nav').slideToggle();
	    $(this).toggleClass('active');
	});
	$('.device-menu-holder').click(function() {
	    if ($(this).hasClass('active')) {
		    $('.device-menu li').each(function() {
			if ($(this).find('.mom_mega_wrap').length !== 0) {
			} else {
			    $(this).find('.sub-menu').slideUp();
			}
		    });
		    $('.device-menu').find('.dm-active').removeClass('dm-active');
		    $('.device-menu').find('.mom_custom_mega').slideUp();
	    }
	    $('.device-menu').slideToggle();
	    $(this).toggleClass('active');
	});
	$('.responsive-caret').click(function() {
	    var li = $(this).parent();
	    if (li.hasClass('dm-active') || li.find('.dm-active').length !== 0 || li.find('.sub-menu').is(':visible') || li.find('.mom_custom_mega').is(':visible') ) {
		li.removeClass('dm-active');
		li.children('.sub-menu').slideUp();
		if (li.find('.mom_mega_wrap').length === 0) {
		    	li.find('.sub-menu').slideUp();
		}
		if (li.hasClass('mom_default_menu_item') || li.find('.cats-mega-wrap').length !== 0) {
		    li.find('.sub-menu').slideUp();
		    li.find('.mom-megamenu').slideUp();
		    li.find('.sub-mom-megamenu').slideUp();
		    li.find('.sub-mom-megamenu2').slideUp();
		}
		li.find('.dm-active').removeClass('dm-active');
		if (li.find('.mom_custom_mega').length !== 0) {
		    li.find('.mom_custom_mega').slideUp();
		}
	
	    } else {
		$('.device-menu').find('.dm-active').removeClass('dm-active');
		li.addClass('dm-active');
		li.children('.sub-menu').slideDown();
		if (li.find('.cats-mega-wrap').length !== 0) {
		    li.find('.sub-menu').slideDown();
		    li.find('.mom-megamenu').slideDown();
		    li.find('.sub-mom-megamenu').slideDown();
		    li.find('.sub-mom-megamenu2').slideDown();
		}
		if (li.find('.mom_custom_mega').length !== 0) {
		    li.find('.mom_custom_mega').slideDown();
		}
	
	    }
	})
	$('.the_menu_holder_area').html($('.device-menu').find('.current-menu-item').children('a').html());
	
}); // End Of File

// Momizat User rate
jQuery(document).ready(function(e){e(".mom_user_rate").mousemove(function(t){var r=e(this).data("style"),s=e(this).offset(),a=t.pageX-s.left;if(t.pageY-s.top,!e(this).hasClass("rated")){var o=a/parseFloat(e(this).width())*100;i=Math.round(o),i>100&&(i=100),n=(i/20).toFixed(1),"bars"===r?(e(this).find(".ub-inner").css({width:i+"%"}),e(this).find(".ub-inner").find("span").text(i+"%")):"circles"===r||e(this).children("span").css({width:i+1+"%"}),e(this).hasClass("star-rating")&&e(this).parent().find(".yr").text(n+"/5")}}),e(".mom_user_rate, .mom_user_rate_cr").hover(function(){e(this).hasClass("rated")||(e(".review-footer .mom_user_rate_title").find(".user_rate").hide(),e(".review-footer .mom_user_rate_title").find(".your_rate").show())},function(){e(this).hasClass("rated")||(e(".mom_user_rate_title").find(".user_rate").show(),e(".mom_user_rate_title").find(".your_rate").hide())}),e(".mom_user_rate").click(function(){stars=jQuery(this),post_id=stars.data("post_id"),style=stars.data("style"),score=0,"stars"===style&&(score=parseFloat(stars.children("span").width())/parseFloat(e(this).width())*100),"bars"===style&&(score=parseFloat(stars.children(".ub-inner").width())/parseFloat(e(this).width())*100),score=Math.round(score),vc=stars.data("votes_count"),e(this).hasClass("rated")||jQuery.ajax({type:"post",url:momAjaxL.url,data:"action=user-rate&nonce="+momAjaxL.nonce+"&user_rate=&post_id="+post_id+"&user_rate_score="+score,success:function(t){"already"!=t&&(stars.addClass("rated"),e(".review-footer .mom_user_rate_title").find(".user_rate").hide(),e(".review-footer .mom_user_rate_title").find(".your_rate").show(),e(".review-footer .total-votes").find(".tv-count").text(vc+1))}})}),e(".mom-reveiw-system").length&&e(".urc-value").knob({displayInput:!1,change:function(t){e(".user-rate-circle").find(".cru-num").text(t)},release:function(t){circle=jQuery(".user-rate-circle .mom_user_rate_cr"),post_id=circle.data("post_id"),style=circle.data("style"),score=t,vc=circle.data("votes_count"),jQuery.ajax({type:"post",url:momAjaxL.url,data:"action=user-rate&nonce="+momAjaxL.nonce+"&user_rate=&post_id="+post_id+"&user_rate_score="+score,success:function(t){"already"!=t&&(circle.addClass("rated"),e(".review-footer .mom_user_rate_title").find(".user_rate").hide(),e(".review-footer .mom_user_rate_title").find(".your_rate").show(),e(".review-footer .total-votes").find(".tv-count").text(vc+1))}})}})});

//ajax
jQuery(document).ready(function(){jQuery(".mom-search-form input.sf").on("keyup",function(){return sf=jQuery(this),term=sf.val(),term.length>2?setTimeout(function(){jQuery.ajax({type:"post",url:momAjaxL.url,dataType:"html",data:"action=mom_ajaxsearch&nonce="+momAjaxL.nonce+"&term="+term,beforeSend:function(){sf.parent().find(".sf-loading").fadeIn()},success:function(e){""!==sf.val()?(sf.parent().next(".ajax-search-results").html(e),""!==e?sf.parent().next(".ajax-search-results").append('<h4 class="show-all-results"><a href="'+momAjaxL.homeUrl+"/?s="+term+'">'+momAjaxL.viewAll+'<i class="fa-icon-long-arrow-right"></i></a></h4>'):(sf.parent().next(".ajax-search-results").find("show_all_results").remove(),sf.parent().next(".ajax-search-results").html('<span class="sw-not_found">'+momAjaxL.noResults+"</span>"))):sf.parent().next(".ajax-search-results").html(""),sf.parent().find(".sf-loading").fadeOut()}})},300):setTimeout(function(){jQuery.ajax({type:"post",url:momAjaxL.url,dataType:"html",data:"action=mom_ajaxsearch&nonce="+momAjaxL.nonce+"&term="+term,success:function(){""===sf.val()&&sf.parent().next(".ajax-search-results").html("")}})},300),!1})}),jQuery(document).ready(function(e){jQuery(".media-tabs li a").on("click",function(){return t=jQuery(this).parent(),type=t.data("type"),jQuery.ajax({type:"post",url:momAjaxL.url,dataType:"html",data:"action=mom_media_tab&nonce="+momAjaxL.nonce+"&type="+type,beforeSend:function(){t.parent().parent().parent().append('<i class="nb-load"></i>')},success:function(a){""!==a&&(e(".media-page-content").html(a),e(".media-tabs > li").removeClass("active"),t.addClass("active")),t.parent().parent().parent().find(".nb-load").remove()}}),!1}),jQuery("#media-sort").on("change",function(){return order=jQuery(this).val(),type=jQuery(this).parent().parent().siblings().find("li.active").data("type"),jQuery.ajax({type:"post",url:momAjaxL.url,dataType:"html",data:"action=mom_media_tab&nonce="+momAjaxL.nonce+"&type="+type+"&order="+order,beforeSend:function(){},success:function(a){""!==a&&e(".media-page-content").html(a)}}),!1})}),jQuery(document).ready(function(e){offset="",offset_rest="",offset_sec="",jQuery(".section footer.show_more_ajax a").click(function(e){e.preventDefault(),bt=jQuery(this),where=bt.parent().prev(),nbs=bt.parent().data("nbs"),nop=bt.parent().data("number_of_posts"),norder=bt.parent().data("orderby"),offset=bt.data("offset"),nb_excerpt=bt.parent().data("nb_excerpt"),("nb2"==nbs||"nb4"==nbs||"nb5"==nbs)&&(offset_rest=offset+1),"nb3"==nbs&&(offset_sec=offset+1,offset_rest=offset+2),cat=bt.parent().parent().find(".nb-tabbed-head").find("li.active a").data("cat_id"),(""===cat||void 0===cat)&&(cat=bt.parent().data("cat_id")),jQuery.ajax({type:"post",url:momAjaxL.url,dataType:"html",data:"action=nbsm&nonce="+momAjaxL.nonce+"&cat="+cat+"&nbs="+nbs+"&number_of_posts="+nop+"&orderby="+norder+"&offset="+offset+"&offset_all="+offset_rest+"&offset_second="+offset_sec+"&nb_excerpt="+nb_excerpt,beforeSend:function(){where.parent().append('<i class="nb-load"></i>')},success:function(e){""==e&&bt.parent().append('<a class="nomoreposts">'+momAjaxL.nomore+"</a>").hide().fadeIn(),""!==e&&where.html(e),where.parent().find(".nb-load").remove()},complete:function(){}}),("nb1"==nbs||"list"==nbs)&&bt.data("offset",offset+nop),"nb2"==nbs&&bt.data("offset",offset+nop+1),"nb3"==nbs&&bt.data("offset",offset+nop+2),("nb4"==nbs||"nb5"==nbs)&&bt.data("offset",offset+nop+1),"nb6"==nbs&&bt.data("offset",offset+nop),console.log(offset)}),jQuery(".nb-tabbed-head li a").click(function(a){a.preventDefault();{var t=e(this),n=(t.parent().parent(),e(this).parent().parent().parent().next()),s=t.parent().parent().data("nbs");t.parent().parent().data("number_of_posts"),t.parent().parent().data("orderby")}n.parent().find(".show-more").find(".nomoreposts").remove(),origoff=n.parent().find(".show-more").find("a").data("orig-offset"),n.parent().find(".show-more").find("a").data("offset",origoff),("nb2"==s||"nb4"==s||"nb5"==s)&&(offset_rest=n.parent().find(".show-more").find("a").data("offset")+1),"nb3"==s&&(offset_sec=n.parent().find(".show-more").find("a").data("offset")+1,offset_rest=n.parent().find(".show-more").find("a").data("offset")+2),console.log(n.parent().find(".show-more").find("a").data("offset")),console.log(offset_sec),console.log(offset_rest)})}),jQuery(document).ready(function(e){jQuery(".nb-tabbed-head li a").click(function(a){a.preventDefault();var t=e(this),n=t.parent().parent(),s=e(this).parent().parent().parent().next(),o=t.parent().parent().data("nbs"),r=t.parent().parent().data("number_of_posts"),f=t.parent().parent().data("nb_excerpt");cat=t.data("cat_id"),""===cat&&(cat=t.data("parent_cat")),s.parent().find(".show-more").find(".nomoreposts").remove(),jQuery.ajax({type:"post",url:momAjaxL.url,dataType:"html",data:"action=nbtabs&nonce="+momAjaxL.nonce+"&cat="+cat+"&nbs="+o+"&number_of_posts="+r+"&nb_excerpt="+f,cach:!1,beforeSend:function(){s.parent().append('<i class="nb-load"></i>')},success:function(e){s.hide().html(e).fadeIn("slow"),n.find("li").removeClass("active"),t.parent().addClass("active"),s.parent().find(".nb-load").remove()}})})}),jQuery(document).ready(function(e){jQuery(".mom_mailchimp_subscribe").submit(function(){return sf=jQuery(this),email=sf.find(".mms-email").val(),list=sf.data("list_id"),e(".message-box").fadeOut(),""===email?sf.before('<span class="message-box error">'+momAjaxL.error2+'<i class="brankic-icon-error"></i></span>'):mom_isValidEmailAddress(email)?jQuery.ajax({type:"post",url:momAjaxL.url,dataType:"html",data:"action=mom_mailchimp&nonce="+momAjaxL.nonce+"&email="+email+"&list_id="+list,beforeSend:function(){sf.find(".sf-loading").fadeIn()},success:function(a){"success"===a?(sf.find(".email").val(""),sf.before('<span class="message-box success">'+momAjaxL.success+'<i class="brankic-icon-error"></i></span>').hide().fadeIn()):sf.before('<span class="message-box error">'+momAjaxL.error+'<i class="brankic-icon-error"></i></span>').hide().fadeIn(),sf.find(".sf-loading").fadeOut(),e(".message-box i").on("click",function(){e(this).parent().fadeOut()})}}):sf.before('<span class="message-box error">'+momAjaxL.error2+'<i class="brankic-icon-error"></i></span>'),!1})});

function mom_isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
    return pattern.test(emailAddress);
};