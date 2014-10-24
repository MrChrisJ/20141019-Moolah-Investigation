define(['require', 'jquery', 'twttr'], function (require, $, twttr) {
	var css_url = require.toUrl('../../styles/js/author-twitter-handles.css');
	var baseAuthors = [

		{
			name: 'Karen McVeigh',
			twitter_handle: 'karenmcveigh1'
		},

		{
			name: 'Matt Wells',
			twitter_handle: 'MatthewWells'
		},

		{
			name: 'Richard Adams',
			twitter_handle: 'RichardA'
		},

		{
			name: 'Suzanne Goldenberg',
			twitter_handle: 'suzyji'
		},

		{
			name: 'Chris McGreal',
			twitter_handle: 'chrismcgreal'
		},

		{
			name: 'Dominic Rushe',
			twitter_handle: 'dominicru'
		},

		{
			name: 'Stuart Millar',
			twitter_handle: 'stuartmillar159'
		},

		{
			name: 'Brian Braiker',
			twitter_handle: 'slarkpope'
		},

		{
			name: 'Laurence Topham',
			twitter_handle: 'loztopham'
		},

		{
			name: 'Matt Williams',
			twitter_handle: 'mattywills'
		},

		{
			name: 'Ryan Devereaux',
			twitter_handle: 'Rdevro'
		},

		{
			name: 'Tom McCarthy',
			twitter_handle: 'TeeMcSee'
		},

		{
			name: 'Ewen MacAskill',
			twitter_handle: 'ewenmacaskill'
		},

		{
			name: 'Amanda Michel',
			twitter_handle: 'amichel'
		},

		{
			name: 'Steve Busfield',
			twitter_handle: 'Busfield'
		},

		{
			name: 'Danny Taylor',
			twitter_handle: 'DTGuardian'
		},
		{
			name: 'Donald McRae',
			twitter_handle: 'donaldgmcrae'
		},
		{
			name: 'Stuart James',
			twitter_handle: 'StuartJamesGNM'
		},
		{
			name: 'Marcus Christenson',
			twitter_handle: 'm_christenson'
		},
		{
			name: 'Sachin Nakrani',
			twitter_handle: 'SachinNakrani'
		},
		{
			name: 'Paul Wilson',
			twitter_handle: 'paulwilsongnm'
		},
		{
			name: 'Paul Doyle',
			twitter_handle: 'Paul_Doyle'
		}
	];

	function loadAuthors(data) {
		createButton(data);
	}

	function createButton(authors) {
		var author_link = $('.contributor');
		var author_count = author_link.length;
		var author_found = false;

		$('head').append('<link rel="stylesheet" href="' + css_url + '" />');

		if (author_count === 1) {
			var byline = $('.byline, .blog-byline');

			var current_author_name = $.trim(author_link.text());

			for (var i = 0, len = authors.length; i < len; i++) {
				var author = authors[i];

				if (current_author_name.toLowerCase() === author.name.toLowerCase()) {
					author_found = true;
					var twitter_follow_button = $('<a class="twitter-follow-button" data-show-count="false" data-show-screen-name="true" href="https://twitter.com/' + author.twitter_handle + '">Follow @' + author.twitter_handle + '</a>');
					var brand_follow_button = $('<a class="twitter-follow-button" data-show-count="false" data-show-screen-name="true"href=" https://twitter.com/guardian">Follow @guardian</a>');

					if (byline.hasClass('blog-byline')) {
						$('.blog-byline-kick').after(brand_follow_button).after(twitter_follow_button);
					} else {
						$(".article-attributes-social-buttons").append(twitter_follow_button).append(brand_follow_button);
					}
					break;
				}
			}
		}

		window.twitter_author_found = author_found;
		return author_found;
	}

	function lookupByline() {

		if(guardian.page.contentTypes.substring("article") < 0 && !guardian.page.livePage) {
			return;
		}

		var author_link = $('.contributor');
		var author_count = author_link.length;

		if(!author_count || author_count > 1) {
			return;
		}

		var profile_path = author_link[0].pathname;

		jQ.ajax({
			dataType: "json",
			cache: true,
			url: 'http://gu-byline-data.appspot.com/api/twitter/lookup',
			data: {
				'profile_path' : profile_path
			}
		}).done(function(data) {
				$('head').append('<link rel="stylesheet" href="' + css_url + '" />');

				var twitter_follow_button = $('<a class="twitter-follow-button" data-show-count="false" data-show-screen-name="true" href="https://twitter.com/' + data.personal + '">Follow @' + data.personal + '</a>');
				var brand_follow_button = $('<a class="twitter-follow-button" data-show-count="false" data-show-screen-name="true" href="https://twitter.com/' + data.brand + '">Follow @' + data.brand + '</a>');

				$(".social-buttons-twitter-contributor").append(twitter_follow_button);
				$(".social-buttons-twitter-brand").append(brand_follow_button);
			})
			.fail(function() {
				createButton(baseAuthors);
			});
	}

	if(jQ.support.cors) {
		lookupByline();
	} else {
		createButton(baseAuthors);
	}

	return createButton;
});
