define(['tweets', 'videos', 'fence', 'enhancer', 'jquery', 'require'],
       function(tweets, Videos, fence, enhancer, jQ, require) {

    // Annoyingly, wait for document-ready else Omniture might not be loaded...
    jQ('document').ready(function() {
        // Render all tweets in the view
        tweets.toggleTweets();

        // Instrument all Guardian videos already in the page
        jQ('#content .gu-video').each(function(i, el) {
            Videos.render(el);
        });

        // Render all sandboxed embeds
        jQ('#content .fenced').each(function(i, el) {
            fence.render(el);
        });

        // Render all sandboxed embeds
        jQ('#content figure.interactive').each(function(i, el) {
            // Silly fake mediator as we don't really support this in
            // R2 frontend...
            var mediator = {on: function(){}};
            enhancer.render(el, document.body, {}, mediator);
        });

        // Technical hint; there might be code snippets ahead!
        var displayHint = jQ('.flexible-content-body').data('display-hint');
        if (displayHint === 'technical') {
            require(['google-code-prettify'], function(prettify) {
                var content = document.getElementById('content');
                prettify.prettyPrint(null, content);
            });
        }
    });
});
