define(['player-r2', 'jquery'],
       function(jwplayerR2, jQ) {

    function renderFrontendVideo(element) {
        var container     = jQ(element).parent();
        var showAds       = container.data('show-ads');
        var videoId       = container.data('video-id');
        var videoName     = container.data('video-name');
        var videoProvider = container.data('video-provider');
        var image         = container.data('video-poster');

        // TODO: remove this (and data-video-poster attr) once the
        // Content API sets the poster themselves
        var options = {image: image};

        // Force height for wider videos (e.g. main video)
        if (container.width() === 620) {
            // Approximation of height to get a 16:9 video
            options.height = 390;
        }

        var omnitureName = videoName || '';
        if (videoId) {
            // Append id for tracking, somewhat emulating what R2 does
            var identifier = ':Video:' + videoId;

            // There seems to be some odd cropping to 86-char long
            // happening, which we don't understand, but emulate.
            omnitureName = omnitureName.slice(0, 86 - identifier.length) + identifier;
        }

        return jwplayerR2.render(element, options, {
            videoName:     omnitureName,
            videoProvider: videoProvider,
            showAds:       showAds
        });
    }

    return {
        render: renderFrontendVideo
    };
});
