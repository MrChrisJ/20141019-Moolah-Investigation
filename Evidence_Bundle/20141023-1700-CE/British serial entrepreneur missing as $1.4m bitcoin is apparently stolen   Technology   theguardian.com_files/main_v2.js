/* m-1145~/static/email-subscription/js/email-subscription.js */
(function() {
    "use strict";
    var identityDomain, identityStaticDomain;

    switch (window.location.hostname.substring(window.location.hostname.indexOf('.') + 1)) {
        case 'theguardian.com':
            identityDomain = 'id.theguardian.com';
            identityStaticDomain = 'guim.co.uk';
            break;
        case 'release.dev-theguardian.com':
            identityDomain = 'id.release.dev-theguardian.com';
            identityStaticDomain = 'gurelease.co.uk';
            break;
        case 'qa.dev-theguardian.com':
            identityDomain = 'id.qa.dev-theguardian.com';
            identityStaticDomain = 'guqa.co.uk';
            break;
        case 'code.dev-theguardian.com':
            identityDomain = 'id.code.dev-theguardian.com';
            identityStaticDomain = 'gucode.co.uk';
            break;
        case 'gulocal.co.uk':
        case 'gulocal.com':
        case 'thegulocal.com':
        case 'localhost':
            identityDomain = 'id.thegulocal.com';
            identityStaticDomain = 'gulocal.co.uk';
            break;
        default:
            identityDomain = 'id.theguardian.com';
            identityStaticDomain = 'guim.co.uk';
    }

    // Email identifiers for zones and sections
    var emailMap = {
        'comment': {
            'commentisfree': 'comment-is-free'
        },
        'culture': {
            'artanddesign': 'art-weekly',
            'books': 'book-club',
            'film': 'film-today',
            'music': 'sleeve-notes'
        },
        'environment': {
            'environment': 'green-light'
        },
        'global': {
            'crosswords': 'crossword-update'
        },
        'life-and-style': {
            'fashion': 'fashion-statement'
        },
        'money': {
            'money': 'money-talks'
        },
        'news': {
            'global-development': 'poverty-matters',
            'media': 'media-briefing',
            'society': 'society-briefing',
            'technology': 'zip-file',
            'uk': {
                'uk': 'daily-email',
                'us': 'daily-email-us',
                'au': 'daily-email-au'
            },
            'world': {
                'uk': 'daily-email',
                'us': 'daily-email-us',
                'au': 'daily-email-au'
            }
        },
        'sport': {
            'football': 'the-fiver'
        },
        'travel': {
            'travel': 'the-flyer'
        }
    },

    // Override email matches as follows if tags are found
    tagMap = {
        "Australian politics": 'australian-politics',
        "Cricket": 'the-spin',
        "Food & drink": 'observer-monthly',
        "Rugby union": 'the-breakdown'
    },

    templates = {
        'art-weekly': {
            'id': 99,
            'label': "Art Weekly",
            'title': "Get the Guardian's Art Weekly email",
            'copy': "For your art world low-down, the latest news, reviews and comment delivered straight to your inbox.",
            'link': "Sign up for the Art Weekly email"
        },
        'australian-politics': {
            'id': 1866,
            'label': "Daily email",
            'title': "Get the Australian politics email",
            'copy': "All the latest news and comment on Australian politics, delivered to you every weekday.",
            'link': "Sign up for the Australian politics email"
        },
        'book-club': {
            'id': 131,
            'label': "Guardian book club",
            'title': "Get the Guardian book club email",
            'copy': "Hosted by John Mullan, be the first to find out about forthcoming events and featured authors.",
            'link': "Sign up for the Guardian book club email"
        },
        'close-up': {
            'id': 40,
            'label': "Close up",
            'title': "Sign up for the Close up email",
            'copy': "Every Thursday, rely on Close up to bring you Guardian film news, reviews and much, much more.",
            'link': "Sign up for the Close up email"
        },
        'crossword-update': {
            'id': 101,
            'label': "Crossword editor's update",
            'title': "Get the Crossword editor's email",
            'copy': "Register to receive our monthly crossword email with the latest issues and tips.",
            'link': "Sign up for the Crossword editor's update"
        },
        'daily-email': {
            'id': 37,
            'label': "Daily email",
            'title': "Sign up for the Guardian Today",
            'copy': "Our editors' picks for the day's top news and commentary delivered to your inbox each morning.",
            'link': "Sign up for the daily email"
        },
        'daily-email-us': {
            'id': 1493,
            'label': "Daily email",
            'title': "Get the Guardian's daily US email",
            'copy': "Our editors' picks for the day's top news and commentary delivered to your inbox each morning.",
            'link': "Sign up for the daily email"
        },
        'daily-email-au': {
            'id': 1506,
            'label': "Daily email",
            'title': "Get the Guardian's daily Australia email",
            'copy': "Our editors' picks for the day's top news and commentary delivered to your inbox every weekday.",
            'link': "Sign up for the daily email"
        },
        'fashion-statement': {
            'id': 105,
            'label': "Fashion statement",
            'title': "Sign up for the Fashion statement",
            'copy': "Get the latest news, views and shoes from the style frontline every Friday.",
            'link': "Sign up for the Fashion statement email"
        },
        'film-today': {
            'id': 1950,
            'label': "Film Today",
            'title': "Sign up for the Film Today email",
            'copy': "The top headlines each weekday delivered straight to your inbox in time for your evening commute.",
            'link': "Sign up for the Film Today email"
        },
        'green-light': {
            'id': 38,
            'label': "Green light",
            'title': "Sign up for the Green light email",
            'copy': "The most important environment stories each week including data, opinion pieces and guides.",
            'link': "Sign up for the Green light email"
        },
        'media-briefing': {
            'id': 217,
            'label': "Media briefing",
            'title': "Sign up for the Media briefing email",
            'copy': "An indispensable summary of what the papers are saying about media on your desktop before 9am.",
            'link': "Sign up for the Media briefing email"
        },
        'money-talks': {
            'id': 1079,
            'label': "Money Talks",
            'title': "Get the Guardian's Money Talks email",
            'copy': "Stay on top of the best personal finance and money news of the week from the Guardian Money editors.",
            'link': "Sign up for the Money Talks email"
        },
        'observer-monthly': {
            'id': 248,
            'label': "The Observer Food Monthly",
            'title': "Get the Observer Food Monthly email",
            'copy': "Sign up to the Observer Food Monthly for food and drink news, tips, offers, recipes and competitions.",
            'link': "Sign up for the Observer Food Monthly email"
        },
        'poverty-matters': {
            'id': 113,
            'label': "Poverty matters",
            'title': "Sign up for the Poverty matters email",
            'copy': "The most important debate and discussion from around the world delivered every fortnight.",
            'link': "Sign up for the Poverty matters email"
        },
        'society-briefing': {
            'id': 208,
            'label': "Society briefing",
            'title': "Sign up for the Society briefing email",
            'copy': "Stay on top of the latest policy announcements, legislation and keep ahead of current thinking.",
            'link': "Sign up for the Society briefing email"
        },
        'sleeve-notes': {
            'id': 39,
            'label': "Sleeve notes",
            'title': "Get the Guardian's Sleeve notes email",
            'copy': "Everything you need to know from the Guardian's music site, squeezed into one handy email.",
            'link': "Sign up for the Sleeve notes email"
        },
        'comment-is-free': {
            'id': 2313,
            'label': "Comment is free",
            'title': "Get the best of Comment is free",
            'copy': "The most shared comment, analysis and editorial articles delivered every weekday lunchtime.",
            'link': "Sign up for the Comment is free email"
        },
        'the-breakdown': {
            'id': 219,
            'label': "The Breakdown",
            'title': "Sign up for The Breakdown email",
            'copy': "Every Thursday Paul Rees gives his thoughts on the big stories and reviews the latest action.",
            'link': "Sign up for The Breakdown email"
        },
        'the-fiver': {
            'id': 218,
            'label': "The Fiver",
            'title': "Sign up for The Fiver email",
            'copy': "The Guardian's free football email, delivered every weekday at around 5pm - hence the name.",
            'link': "Sign up for The Fiver email"
        },
        'the-flyer': {
            'id': 2211,
            'label': "The Flyer",
            'title': "Sign up for The Flyer email",
            'copy': "All the latest travel stories, UK hotel and restaurant reviews, insider tips and inspiring top 10s.",
            'link': "Sign up for The Flyer email"
        },
        'the-spin': {
            'id': 220,
            'label': "The Spin",
            'title': "Sign up for The Spin email",
            'copy': "All the latest comment and news, rumour and humour from the world of cricket every Tuesday.",
            'link': "Sign up for The Spin email"
        },
        'zip-file': {
            'id': 1902,
            'label': "Zip file",
            'title': "Get the Guardian's Zip file email",
            'copy': "For all you need to know about technology in the world this week, news, analysis and comment.",
            'link': "Sign up for the Zip file email"
        }
    },

    dom = {
        classes: {
            'promo': 'js-email-upsell',
            'image': 'js-email-upsell-image',
            'title': 'js-email-upsell-title',
            'copy': 'js-email-upsell-copy',
            'link': 'js-email-upsell-link',
            'close': 'js-email-upsell-close'
        },
        defaultEmail: 'daily-email',
        messages: {
            'success': "Coming to your inbox soon!",
            'fail': "Sorry, there was an error",
            'wait': "One second..."
        }
    },

    // Vars
    email,
    ichbin,
    toolkit,

    init = function(ID) {
        toolkit = ID;
        toolkit.setAjaxLib(jQ.ajax);
        jQ(function() {
            email = getEmailId();
            if (email) {
                if (toolkit.isLoggedIn()) {
                    initIchbin();
                } else {
                    bindLoggedOutClick();
                    showComponentForEmail();
                }
            }
        });
    },

    initIchbin = function() {
        require(['http://ichbin.guardian.co.uk/cs/js/ich-bin.js?clientId=email-hints'], function(ich) {
            ichbin = ich;
            bindLoggedInClick();
            var hintId = getHintId();
            ichbin.getDocumentForUser('email-signup-hints', 3600, function(hints) {
                if (!hints || !hints[hintId] || !hints[hintId].signedUp) {
                    showComponentForEmail();
                }
            });
        });
    },

    storeHideEmailHint = function() {
        var hints = {},
            hintId = getHintId();
        hints[hintId] = {signedUp: true};
        ichbin.setDocumentForUser('email-signup-hints', hints, function(hints) {});
    },

    getHintId = function() {
        return email.indexOf('daily-email') == 0 ? 'todayEmail' : email;
    },

    getEmailId = function() {
        if (guardian && guardian.page) {
            var zone = emailMap[guardian.page.zone], match;
            if (zone) {
                var section = zone[guardian.page.section],
                    typeOf = typeof section;
                if (typeOf === 'string') {
                    match = section;
                } else if (typeOf === 'object') {
                    var edition = guardian.page.edition.toLowerCase();
                    match = section[edition] || section['uk']; // Default
                }
            }
            var articleTags = getArticleTags();
            for (var tag in tagMap) {
                var tagMatch = jQ.inArray(tag, articleTags);
                if (tagMatch > -1) {
                    match = tagMap[articleTags[tagMatch]];
                    break; // First come, first served
                }
            }
            return match;
        }
    },

    getArticleTags = function() {
        return jQ('meta[property="article:tag"]').map(function() {
            return this.getAttribute('content');
        });
    },

    showComponentForEmail = function() {
        var template = templates[email],
            $promo = jQ('.' + dom.classes.promo),
            $image = $promo.find('.' + dom.classes.image),
            $title = $promo.find('.' + dom.classes.title),
            $copy = $promo.find('.' + dom.classes.copy),
            $link = $promo.find('.' + dom.classes.link);

        if (email !== dom.defaultEmail) {
            $title.text(template.title);
            $copy.text(template.copy);

            $link.text(template.link)
                 .attr('data-email-id', template.id)
                 .attr('href', 'https://' + identityDomain + '/email/subscribe?emailListId=' + template.id);

            $image.attr('src', 'http://static-serve.appspot.com/static/email-subscription/img/' + email + '.png')
                  .attr('alt', template.label);
        }

        $promo.show();
    },

    emailSignup = function(endpoint, el) {
        var emailId = el.attr('data-email-id');
        el.text(dom.messages.wait);

        toolkit.api(endpoint, 'post', { 'listId': emailId },
            function(res) {
                el.text(dom.messages.success).unbind().prop('disabled', true);
            },
            function(res) {
                el.text(dom.messages.fail);
            }
        );

        trackClick(el, "EmailUpsellClick");
    },

    bindLoggedOutClick = function() {
        jQ('.' + dom.classes.link).on('click', function(e) {
            e.preventDefault();
            var el = jQ(this);
            trackClick(el, "EmailUpsellClick", function() {
                window.location = el.prop('href');
            });
        });
    },

    bindLoggedInClick = function() {
        jQ('.' + dom.classes.link).on('click', function(e) {
            e.preventDefault();
            storeHideEmailHint();
            var el = jQ(this);
            emailSignup('useremails/me/subscriptions', el);
        });

        jQ('.' + dom.classes.close).on('click', function(e) {
            jQ('.' + dom.classes.promo).hide();
            storeHideEmailHint();
        }).show();
    },

    trackClick = function(el, event, callback) {
        var s = s_gi(s_account);
        var emailId = el.attr('data-email-id');
        s.linkTrackVars = 'eVar50';
        s.eVar50 = 'EmailUpsell:' + emailId;
        s.tl(this, 'o', event + ':' + emailId, null, callback);
    };

    require(['http://id.' + identityStaticDomain + '/static/cs/js/guardian.identity.clientside-toolkit.js'], init);
})();

/* m-1145~/static/outbrain/main_v2.js */
jQ(function(){

    var OBComponent = {

        init: function() {
            this.contentId  = jQ('meta[name="content-id"]').attr('content'),
            this.pageUrl    = 'http://www.guardian.co.uk' + this.contentId;

            // Only insert components if we're allowed to
            if (guardian.page &&
                guardian.page.showRelated === true &&
                guardian.page.showCommercialRelated === true) {
                    this.insertOBComponent();
                    this.loadOBLibrary();
            }
        },

        loadOBLibrary: function() {
            var self = this;

            if (typeof(OBR) != 'undefined') {
                // This is only temporarily, until Outbrain is removed from R2
                OBR.extern.reloadWidget();
                self.setupWidgets();
            } else {
                jQ.getScript('http://widgets.outbrain.com/outbrain.js', function() {
                    self.setupWidgets();
                });
            }
        },

        setupWidgets: function() {
            // Load the widget and setup callbacks
            this.setupCallbacks();
            this.setupExplainers();
        },

        insertOBComponent: function() {
            var obContainerNode = jQ('.outbrain-container'),
                obInternalHtml  = '<div class="OUTBRAIN first internal trackable-component" data-src="'+this.pageUrl+'" data-widget-id="AR_1" data-ob-template="guardian" data-component="comp: Outbrains: guardian links"></div>',
                obPaidHtml      = '<div class="OUTBRAIN sponsored trackable-component" data-src="'+this.pageUrl+'" data-widget-id="AR_2" data-ob-template="guardian" data-component="comp: Outbrains: sponsored links"></div>';
                containerHtml   = '<div class="outbrain-container">'+obInternalHtml+obPaidHtml+'</div>';

            //jQ('.article #box > .share-links').after(containerHtml);
            obContainerNode.parent().removeClass('six-col').addClass('eight-col');
            obContainerNode.html(obInternalHtml+obPaidHtml);
            obContainerNode.show();
        },

        fixOBComponent: function(id) {
            var node = jQ('.outbrain-container div[data-widget-id="'+id+'"]');

            node.find('.ob_box_cont').addClass('component');
            node.find('.ob_org_header').addClass('hd b1');
            node.find('.ob_org_header div').wrap('<h2></h2>');
            node.find('.hd').prepend('<a href="#" class="explainer-link">What\'s this?</a>');

            var titleNode = node.find('.hd h2 div'),
                title     = titleNode.text().replace('guardian', 'Guardian');

            titleNode.text(title);
        },

        setupCallbacks: function() {
            var self = this;
            OBR.extern.onOdbReturn("AR_1", function() {
                if (OBR.extern.getCountOfRecs("AR_1") > 0) {
                    self.fixOBComponent("AR_1");
                }
            });

            OBR.extern.onOdbReturn("AR_2", function() {
                if (OBR.extern.getCountOfRecs("AR_2") > 0) {
                    self.fixOBComponent("AR_2");
                }
            });
        },

        setupExplainers: function() {
            jQ(document).delegate('.outbrain-container .explainer-link', 'click', function(e) {
                e.preventDefault();

                var sponsoredText = "These are paid-for links provided by Outbrain, and may or may not be relevant to the other content on this page. To find out more information about driving traffic to your content or to place this widget on your site, visit outbrain.com. We welcome your feedback at <a href=\"mailto:userhelp@guardian.co.uk\" target=\"_blank\">userhelp@guardian.co.uk</a> or <a href=\"mailto:feedback@outbrain.com\" target=\"_blank\">feedback@outbrain.com</a>. You can read Outbrain's privacy and cookie policy  <a href=\"http://www.outbrain.com/legal/privacy/\" target=\"_blank\">here</a>.",
                    internalText  = "These are links to Guardian pages suggested by Outbrain, which may or may not be relevant to the other content on this page. We welcome your feedback at <a href=\"mailto:userhelp@guardian.co.uk\" target=\"_blank\">userhelp@guardian.co.uk</a> or <a href=\"mailto:feedback@outbrain.com\" target=\"_blank\">feedback@outbrain.com</a>. You can read Outbrain's privacy and cookie policy  <a href=\"http://www.outbrain.com/legal/privacy/\" target=\"_blank\">here</a>.",
                    explainerText = jQ(this).parent().parent().hasClass('AR_1') ? internalText : sponsoredText;

                var position = jQ(this).offset(),
                    overlayNode = jQ('<div class="outbrain-explainer"><a href="#" class="close"></a><p>'+explainerText+'</p></div>');

                // Listen for events to close the overlay
                overlayNode.find('.close').click(function(e) {
                    e.preventDefault();
                    overlayNode.remove();
                });

                if(jQ('.outbrain-explainer').is(":visible")) {
                    jQ('.outbrain-explainer').remove();
                }

                // Position the overlay
                overlayNode.css({'top':  position.top+20,
                                 'left': position.left-393});

                // ....and showtime
                jQ('.outbrain-container').append(overlayNode);
                overlayNode.fadeIn();

                // Close the overlay if there's clicks outside it
                jQ(document).click(function(e) {
                    overlayNode.remove();
                });
                jQ('.outbrain-explainer, .outbrain-explainer *').click(function(e) {
                  if (jQ(e.target)[0].tagName.toLowerCase() != 'a') {
                    e.stopPropagation();
                    return false;
                  }
                });
            });
        }

    };

    OBComponent.init();
});
