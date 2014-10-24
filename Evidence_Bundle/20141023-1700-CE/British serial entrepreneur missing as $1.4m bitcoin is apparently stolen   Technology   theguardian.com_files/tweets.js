define(['twttr', 'jquery', 'jquery.inview'], function(twttr, jQ) {

    // workaround way to detect if the current tab has focus
    // for some reason, trying to load rich tweet embeds when the page isn't focused
    // seems to break and leave them blank. adding a 3s delay when unfocused fixes this.
    function tabIsFocused() {
        
        var hidden;

        // first we try using the new visibility API
        // https://developer.mozilla.org/en-US/docs/DOM/Using_the_Page_Visibility_API
        if (typeof document.hidden !== "undefined") {
            hidden = "hidden";
        } else if (typeof document.mozHidden !== "undefined") {
            hidden = "mozHidden";
        } else if (typeof document.msHidden !== "undefined") {
            hidden = "msHidden";
        } else if (typeof document.webkitHidden !== "undefined") {
            hidden = "webkitHidden";
        }

        // no support for visibility API in IE < 10 or Safari (any)
        // so fall back to document.hasFocus() -- which is broken in chrome!
        // https://code.google.com/p/chromium/issues/detail?id=64846
        if (!hidden) {
            // fixes opera, which doesn't have this
            if (typeof document.hasFocus === 'undefined') {
                document.hasFocus = function () {
                    return document.visibilityState === 'visible';
                };
            }
            return document.hasFocus();
        }

        var isHidden = document[hidden];
        return !isHidden;
    }

    function toggleTweets() {
        // this allows us to dynamically add embedded tweets rather than on pageload
        jQ('.flexible-content').on('inview', '.element-tweet-nonrich blockquote', function(event, isVisible) {
            var delay = 300;
            if (!tabIsFocused()) {
                // 3 seconds is somewhat arbitrary but seems to be enough to avoid race condition
                delay = 3000;
            }
            if (isVisible && twttr.widgets !== undefined) {
                var elm = jQ(this);
                elm.addClass('twitter-tweet');
                elm.parent().removeClass('element-tweet-nonrich');
                window.setTimeout(function(){
                    twttr.widgets.load();
                }, delay);
            }
        });
    }

    return {
        toggleTweets: toggleTweets
    };

});