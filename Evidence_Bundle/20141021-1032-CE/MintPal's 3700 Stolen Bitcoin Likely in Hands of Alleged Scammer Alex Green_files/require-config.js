/* jshint -W079 */
/* jshint -W098 */
/* -W709 suppresses warning: Redefinition of 'require' */
/* -W098 suppresses warning: 'require' is defined but never used */
var require = {
    paths: {
        'jquery': '../bower_components/jquery/jquery',
        'editable': 'lib/editable',
        'modernizr': 'lib/modernizr-custom',
        'backbone': '../bower_components/backbone/backbone',
        'backbone-marionette': '../bower_components/marionette/lib/core/amd/backbone.marionette',
        'backbone.wreqr': '../bower_components/backbone.wreqr/lib/backbone.wreqr',
        'backbone.babysitter': '../bower_components/backbone.babysitter/lib/backbone.babysitter',
        'underscore': '../bower_components/underscore/underscore',
        'handlebars': '../bower_components/handlebars/handlebars',
        'slick': '../bower_components/slick.js/slick/slick',
        'moment': '../bower_components/moment/moment',
        'jquery.trunk8': 'vendor/jquery/jquery.trunk8',
        'jquery.fitvids': 'vendor/jquery/jquery.fitvids',

        // allows, e.g., require('bootstrap/dropdown')
        'bootstrap': '../bower_components/bootstrap/js',

        // Disqus Next-Core - shared Disqus front end js components
        'core': '../bower_components/next-core/core',
        'core/config': 'core/config',
        'core/templates': 'templates/next-core',

        // These come from external sources (cdn, disqus.com, etc)
        // By marking them as 'empty' they won't get included in the
        // requirejs optimizer.
        // For local development, these paths should be filled in
        // wherever this file is included.
        // (Should be in requirejs.handlebars)
        'disqus.sdk': 'empty:',
        'remote/config': 'empty:',

        // All modules are namespaced under 'home' for code
        // sharing purposes.
        'home': '.'
    },
    shim: {
        'editable': {
            exports: 'Editable',
            deps: ['jquery']
        },
        'modernizr': {
            exports: 'Modernizr'
        },
        'underscore': {
            exports: '_'
        },
        'handlebars': {
            exports: 'Handlebars'
        },
        'jquery.trunk8': {
            deps: ['jquery']
        },
        'jquery.fitvids': {
            deps: ['jquery']
        },
        'remote/config': {
            exports: 'DISQUS.config'
        },

        'bootstrap/dropdown': {
            deps: ['jquery']
        },

        'bootstrap/tooltip': {
            deps: ['jquery']
        },

        'bootstrap/modal': {
            deps: ['jquery']
        },

        // Deprecated
        'v1/vendor/bootstrap/dropdown': {
            deps: ['jquery']
        },
        'v1/vendor/bootstrap/modal': {
            deps: ['jquery']
        },
        'v1/vendor/bootstrap/transition': {
            deps: ['jquery']
        },
        'v1/vendor/bootstrap/tooltip': {
            deps: ['jquery']
        },
        'v1/vendor/bootstrap/alert': {
            deps: ['jquery']
        }
    }
};
