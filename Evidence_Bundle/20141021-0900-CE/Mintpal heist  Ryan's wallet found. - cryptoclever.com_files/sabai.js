var SABAI = SABAI || {};

(function($) {
    SABAI.console = window.console || {'log': function (msg) {
        alert(msg);
    }};
    SABAI.isRTL = false;
    SABAI.init = (function () {
        var _initFadeout = function (context) {
                SABAI.fadeout($('.sabai-fadeout', context));   
            },
            _initCheckall = function (context) {
                // Highlight related table rows when a checkall checkbox is checked
                $('input.sabai-form-check-trigger', context).show().click(function() {
                    var $this = $(this);
                    $this.closest('table').find('input.sabai-form-check-target, input.sabai-form-check-trigger').not(':disabled')
                        .prop('checked', $this.prop('checked'));
                });
            },
            _initFormCollapsible = function (context) {
                // Collapse collapsible form elements
                $('fieldset.sabai-form-collapsible', context).not('.sabai-form-collapsible-processed').each(function () {
                    var $this = $(this);
                    $this.find('> legend span:first').prepend('<i class="sabai-icon-caret-down"></i> ').wrap('<a class="sabai-form-collapsible" href="#"></a>').end()
                        .find('a.sabai-form-collapsible:first').click(function () {
                            $(this).toggleClass('sabai-form-collapsed')
                                .find('i').toggleClass('sabai-icon-caret-down').toggleClass(SABAI.isRTL ? 'sabai-icon-caret-left' : 'sabai-icon-caret-right').end()
                                .closest('.sabai-form-collapsible-processed').toggleClass('sabai-form-collapsed')
                                .find('.sabai-form-fields:first').slideToggle('fast', function() {
                                    $(this).find('textarea:visible').autosize();
                                });
                            return false;
                        }).end()
                        .addClass('sabai-form-collapsible-processed');
                    if ($this.hasClass('sabai-form-collapsed')) {
                        if ($this.hasClass('sabai-form-field-error')) {
                            // Do not collapse elements with error
                            $this.removeClass('sabai-form-collapsed');
                        } else {
                            $this.find('.sabai-form-fields:first').css({display:'none'}).end()
                                .find('a.sabai-form-collapsible:first').addClass('sabai-form-collapsed')
                                .find('i').removeClass('sabai-icon-caret-down').addClass(SABAI.isRTL ? 'sabai-icon-caret-left' : 'sabai-icon-caret-right');
                        }
                    }
                });
            },
            _initElasticTextarea = function (context) {
                $('textarea:visible', context).autosize();
            },
            _initTooltip = function(context) {
                if ('ontouchstart' in document.documentElement) return;
                
                $('[rel="sabaitooltip"]', context).each(function(){
                    var $this = $(this),
                        container = context.attr('id') === 'sabai-content' && $this.closest('#sabai-inline-content').length
                            ? $this.closest('#sabai-inline-content')
                            : $this.data('container') || context;
                    $this.sabaitooltip({container: container});
                });
                $('a[data-popover-url]', context).bind('click', function(e) {
                    var $this = $(this).unbind('hover'), content = $this.attr('data-content'), cached, container;
                    e.preventDefault();
                    container = context.attr('id') === 'sabai-content' && $this.closest('#sabai-inline-content').length
                        ? $this.closest('#sabai-inline-content')
                        : $this.data('container') || context;
                    if (typeof content === 'undefined' || content === false) {
                        cached = SABAI.cache($this.data('popover-url'));
                        if (!cached) {
                            $.get($this.data('popover-url'), {'__ajax': 1}, function(data) {
                                SABAI.popover($this.attr('data-content', data), {html: true, container: container});
                                SABAI.cache($this.data('popover-url'), data);
                            });
                        } else {
                            SABAI.popover($this.attr('data-content', cached), {html: true, container: container});
                        }
                    }
                });
            };
            
        return function (context) {
            if (context.attr('id') === 'sabai-content') {
                if (!$('#sabai-flash').length) {
                    $('body').prepend('<div class="sabai" id="sabai-flash"></div>');
                }
                $('#sabai-flash').on('click', '.sabai-close', function(){$(this).closest('div').remove();});
                SABAI.fadeout($('#sabai-flash .sabai-fadeout')); 
            }
            _initFadeout(context);
            _initCheckall(context);
            _initFormCollapsible(context);
            _initElasticTextarea(context);
            _initTooltip(context);
            // Init prettyPrint
            if (typeof prettyPrint === 'function') {
                prettyPrint();
            }
            // Init prettyPhoto
            if (typeof $.fn.prettyPhoto === 'function') {
                $('a[rel^="prettyPhoto"]', context).prettyPhoto();
            }
            // Init bootstrap dropdown
            $('.sabai-dropdown-toggle', context).sabaidropdown();
            
            $(SABAI).trigger('sabai.init', {context: context});
        };
    }());
    
    SABAI.fadeout = function (selector, timer) {
        timer = timer || 6000;
        // Apply fadeout effect but cancel the effect when hovered
        $(selector).animate({opacity: '+=0'}, timer, function () {
            $(this).fadeOut('fast', function () {
                $(this).remove();
            });
        });
    };
    
    SABAI.cache = (function () {
        var _cache = {};
        return function (id, data, lifetime) {
            if (arguments.length == 1) {
                if (!_cache[id]) {
                    return false;
                }
                if (_cache[id]['expires'] < new Date().getTime()) {
                    return false;
                }
                return _cache[id]['data'];
            }
            lifetime = lifetime || 600;
            _cache[id] = {
                data: data,
                expires: new Date().getTime() + lifetime * 1000
            };
        };
    }());
    
    SABAI.flash = function (message, flashType, fadeout) {
        if (message === undefined || message === null) {
            return;
        }
        if (typeof(message) == 'string') {
            if (flashType !== 'success') {
                flashType = 'error';
            }
            var $flash = $('<div class="sabai-' + flashType + '"><span class="sabai-close"><i class="sabai-icon-remove"></i></span>' + message + '</div>').appendTo($('#sabai-flash'));
            if (fadeout && flashType !== 'error') {
                SABAI.fadeout($flash);
            } else {
                SABAI.fadeout($flash, 30000); // fadeout automatically after 30 seconds
            }
        } else {
            for (var i = 0; i < message.length; i++) {
                SABAI.flash(message[i].msg, message[i].level, fadeout);
            }
        }
    };
    
    SABAI.load = function (selector, url, complete) {
        var $target = $(selector);
        $target.load(url, {'__ajax': selector}, function (response, status, xhr) {
            SABAI.init($target);
            if (complete) {
                complete.call($target, response, status, xhr);
            }
        });
        return $target;
    };
    
    SABAI.replace = function (selector, url, complete) {
        var $target;
        $.get(url, {'__ajax': selector}, function (response, status, xhr) {
            $(selector).replaceWith(response);
            // Reload with selector since replaceWith returns the removed DOM
            $target = $(selector);
            SABAI.init($target);
            if (complete) {
                complete.call($target, response, status, xhr);
            }
        });
        return $target;
    };
    
    SABAI.popover = function (target, options) {
        target = target instanceof jQuery ? target : $(target);
        options = options || {};
        options.template = '<div class="sabai-popover"><div class="sabai-arrow"></div><div class="sabai-popover-inner"><div class="sabai-close"><i class="sabai-icon-remove"></i></div><div class="sabai-popover-title"></div><div class="sabai-popover-content"></div></div></div>';
        target.sabaipopover(options)
            .sabaipopover('show')
            .data('sabaipopover')
            .tip()
            .find('.sabai-close')
            .on('click', function(){target.data('sabaipopover').hide();});
    }
    
    SABAI.modal = (function () {
        var _modal,
            _createModal = function () {
                var modal = $('<div class="sabai" id="sabai-modal" style="display:none;"><div id="sabai-modal-container">'
					+ '<div id="sabai-modal-title"><span></span><span class="sabai-close"><i class="sabai-icon-remove"></i></span></div>'
                    + '<div id="sabai-modal-content"></div>'
                    + '<div id="sabai-modal-footer"></div>'
                    + '</div></div>').prependTo('body')
                    //.draggable({handle: '#sabai-modal-title', cursor: 'move'})
                    .find('.sabai-close').mousedown(function () {
                        $('#sabai-modal').fadeOut('fast', function () {
                            $(this).remove();
                        });
                    }).end()
                    //.find('#sabai-modal-title').css('cursor', 'move').end()
                    .find('#sabai-modal-content').css({overflow: 'auto', 'overflow-x': 'hidden'}).end();
                // Close modal if ESC is pressed
                $(document).keyup(function (e) {
                    if (e.keyCode == 27) {
                        $('#sabai-modal').find('.sabai-close').mousedown();
                    }
                });
                return modal;
            },
            _resizeModal = function(modal, width) {
                var modal_max_height,
                    modal_footer_height,
                    modalPercentage = document.documentElement.clientWidth <= 768 ? 0.95 : 0.8;
                if (width === null || width > document.documentElement.clientWidth * modalPercentage) {
                    width = document.documentElement.clientWidth * modalPercentage;
                }
                modal.css({
                    width: width + 'px',
                    left: document.documentElement.clientWidth/2 - width/2, // position at the center
                    top: document.documentElement.clientHeight * 0.05
                });
                if (modal.find('.sabai-form-buttons').length) {
                    modal_footer_height = modal.find('.sabai-form-buttons').outerHeight() + 10;
                    modal.find('.sabai-form-buttons').css({position: 'absolute', bottom: '5px', right: SABAI.isRTL ? 'auto' : '10px', left: SABAI.isRTL ? '10px' : 'auto', margin: 0});
                } else {
                    modal_footer_height = 0;
                }
                modal.find('#sabai-modal-footer').css('height', modal_footer_height + 'px');
                // Set the maximum height of modal content
                modal_max_height = document.documentElement.clientHeight * 0.8
                    - modal.find('#sabai-modal-title').outerHeight()
                    - modal_footer_height;
                modal.find('#sabai-modal-content').css('max-height', modal_max_height + 'px');
                // Set the height to maximum height if larger than the client height
                if (modal.get(0).scrollHeight > document.documentElement.clientHeight) {
                    modal.find('#sabai-modal-content').css('height', modal_max_height + 'px');
                }
            }; 
        
        return function (html, title, width) {
            if ($('body').has('#sabai-modal').length) {
                _modal = $('#sabai-modal').hide();
                if (!width) {
                    width = _modal.css('width');
                }
            } else {
                _modal = _createModal();
            }
            // Hide all flash messages before showing modal window
            $('#sabai-flash > div').each(function(){
                $(this).fadeOut('fast', function () {
                    $(this).remove();
                });
            });
            // Show modal
            if (title) {
                _modal.find('#sabai-modal-title > span:first').text(title);
            }
            _modal.find('#sabai-modal-content').html(html).end().show();
            _resizeModal(_modal, width);
            return _modal;
        };
    }());
    
    SABAI.ajax = function (options) {
        var o = $.extend({
                trigger: null,
                async: true,
                type: 'get',
                url: '',
                data: {},
                processData: true,
                target: '#sabai-content',
                modalWidth: null,
                cache: false,
                cacheLifetime: 600,
                onSendData: null,
                onSuccess: null,
                onError: null,
                onErrorFlash: true,
                onErrorDisableTrigger: false,
                onContent: null,
                onSuccessFlash: true,
                effect: null,
                scrollTo: null,
                replace: false,
                highlight: false,
                callback: false,
                loadingImage: true,
                position: false
            }, options),
            _handleSuccess = function (response) {
                try {
                    var result = JSON.parse(response);
                    if (o.onSuccess) {
                        if (!o.onSuccess(result, $(o.target), o.trigger)) {
                            if (o.onSuccessFlash && result.messages) {
                                SABAI.flash(result.messages, 'success', true);
                            }
                            return; // returning null or false means not to load content from URL or redirect
                        }
                    }
                    if (result.url) {
                        if (o.target === '#sabai-modal') {
                            $('#sabai-modal').hide();
                        }
                        window.location = result.url;
                    }                        
                } catch (e) {
                    SABAI.console.log('Failed parsing response:<p>' + response.toString().replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</p>' + '<p>' + e.toString() + '</p>');
                }
            },
            _handleContent = function (response) {
                var target;
                if (o.target === '#sabai-modal') {
                    var modalTitle = o.trigger.attr('data-modal-title') || o.trigger.attr('title') || o.trigger.attr('data-original-title') || '';
                    if (o.trigger) {
                        target = SABAI.modal(response, modalTitle, o.modalWidth);
                        o.trigger.blur(); // remove focus
                    } else {
                        target = SABAI.modal(response, '', o.modalWidth);
                    }
                    if (!o.onContent) {
                        o.onContent = function(response, target, trigger){target.focusFirstInput();};
                    }
                } else {
                    target = $(o.target);
                    
                    if (o.replace) {
                        // Scroll to the updated content? We need to scroll before replace otherwise scroll target will not exist. 
                        if (o.scrollTo) {
                            SABAI.scrollTo(o.scrollTo);
                        }
                        // For now, no effect when replacing
                        target = target.hide().after(response).remove().next();
                    } else {
                        if (!o.callback && target.attr('id') != 'sabai-content' && target.attr('id') != 'sabai-inline-content') {
                            target.addClass('sabai-ajax');
                        }
                
                        // Effect
                        switch (o.effect) {
                            case 'slide':
                                target.hide().html(response).slideDown("fast");
                                break;
                            default:
                                target.html(response).show();
                        }
                        
                        // Scroll to the updated content?
                        if (o.scrollTo) {
                            SABAI.scrollTo(o.scrollTo, 1000, -50);
                        }
                    }
                    if (o.highlight) {
                        target.effect('highlight', {}, 1500);
                    } 
                }

                if (o.onContent) {
                    o.onContent(response, target, o.trigger);
                }
            
                SABAI.init(target);
            },
            _handleError = function (response) {
                try {
                    var error = JSON.parse(response);
                    if (o.onError) { 
                        if (!o.onError(error, $(o.target), o.trigger)) {
                            if (o.onErrorFlash && error.messages) {
                                SABAI.flash(error.messages, 'error', false);
                            }
                            if (o.trigger && o.onErrorDisableTrigger) {
                                o.trigger.addClass("sabai-disabled");
                            }
                            return; // returning null or false means not to load content from URL or redirect
                        }
                    } else if (error.url) {
                        window.location = error.url;
                        return;
                    }
                    if (o.trigger && o.onErrorDisableTrigger) {
                        o.trigger.addClass('sabai-disabled').attr('onclick', 'return false;');
                    }
                    if (o.onErrorFlash && error.messages) {
                        if (o.trigger) {
                            SABAI.popover(o.trigger, {
                                content: error.messages[0],
                                html: true,
                                container: o.trigger.closest('.sabai'),
                                title: o.trigger.attr('data-sabaipopover-title') || ''
                            });
                        } else {
                            SABAI.flash(error.messages, 'error', false);
                        }
                    }
                } catch (e) {
                    SABAI.console.log('Failed parsing response:<p>' + response.toString().replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</p>' + '<p>' + e.toString() + '</p>');
                }
            };
        if (o.trigger && o.trigger.hasClass("sabai-disabled")) {
            return;
        }
        if (o.cache && o.type === 'get') {
            var cached = SABAI.cache(o.url);
            if (cached) {
                _handleContent(cached);
                return;
            }
        }
        if (o.onSendData) { 
            o.onSendData(o.data, o.trigger);
        }
        if (typeof o.data === 'object') {
            if (!o.data.hasOwnProperty('__ajax')) {
                o.data['__ajax'] = o.target;
            }
        } else if (typeof o.data === 'string' && o.data) {
            o.data += '&__ajax=' + encodeURIComponent(o.target);
        } else {
            o.data = '__ajax=' + encodeURIComponent(o.target);
        }
        $.ajax({
            global: true,
            async: o.async,
            type: o.type,
            dataType: 'html',
            url: o.url,
            data: o.data,
            processData: o.processData,
            cache: false,
            beforeSend: function (xhr) {                
                // Disable the element that triggered the ajax request
                if (o.trigger) {
                    if (o.loadingImage) {
                        if (o.trigger.is('a') && !o.trigger.hasClass('sabai-btn')) {
                            if (!o.trigger.has('img').length) {
                                o.trigger.addClass('sabai-ajax-loading');
                            }
                        }
                    }
                    o.trigger.prop('disabled', true);
                }                
            },
            complete: function (xhr, textStatus) {
                if (o.trigger) {
                    if (o.loadingImage) {
                        if (o.trigger.is('a') && !o.trigger.hasClass('sabai-btn')) {
                            if (!o.trigger.has('img').length) {
                                o.trigger.removeClass('sabai-ajax-loading');
                            }
                        }
                    }
                    o.trigger.prop('disabled', false);
                }
                switch (textStatus) {
                    case 'success':
                        if (xhr.status == 278 || xhr.getResponseHeader('content-type').indexOf('json') > -1) {
                            // Sabai response was success
                            _handleSuccess(xhr.responseText);
                        } else {
                            // Sabai response was HTML content
                            _handleContent(xhr.responseText);
                            if (o.type == 'get') {
                                if (o.cache) {
                                    SABAI.cache(o.url, xhr.responseText, o.cacheLifetime);
                                }
                            }
                        }
                        break;
                    case 'error':
                        _handleError(xhr.responseText);
                        break;
                }
            }
        });
    };
    
    SABAI.scrollTo = function (target, duration, offset) {
        target = target instanceof jQuery ? target : $(target);
        duration = typeof duration !== 'undefined' && duration !== null ? duration : 1000;
        offset = typeof offset !== 'undefined' && offset !== null ? offset : 0;
        $.scrollTo(target, duration, {offset: {top: offset}});
    };
    
    SABAI.states = function (states) {
        var initial_triggers = {},
            inverted_actions = {
                'enabled': 'disabled',
                'optional': 'required',
                'visible': 'invisible',
                'unchecked': 'checked',
                'expanded': 'collapsed'
            },
            _addRule = function(selector, action, type, conditions) {
                var $dependent = $(selector);
                if (!$dependent.length) {
                    alert('Invalid selector: ' + selector);
                    return;
                }
                var dependee, $dependee, condition, events, event_data;
                for (dependee in conditions) {
                    $dependee = $(dependee);
                    if (!$dependee.length) {
                        alert('Invalid dependee selector: ' + dependee);
                        continue;
                    }
            
                    condition = conditions[dependee];
                    events = [];
                    switch (condition['type']) {
                        case 'value':
                        case 'values':
                            events.push('keyup', 'change');
                            break;
                        case 'checked':
                        case 'unchecked':
                            events.push('change');
                            break;
                        case 'filled':
                        case 'empty':
                            events.push('keyup');
                            break;
                        default:
                            alert('Invalid condition type: ' + condition['type']);
                            continue;
                    }
                    initial_triggers[dependee] = {};
                    for (var i = 0; i < events.length; i++) {
                        event_data = {selector: selector, action: action};
                        event_data['conditions'] = conditions;
                        $dependee.bind(events[i], event_data, function (e, isInit) {
                            _applyRule(e.data.selector, e.data.action, e.data.conditions, isInit);
                        });
                        initial_triggers[dependee][events[i]] = true;
                    }
                }
            },
            _applyRule = function (dependent, action, conditions, isInit) {
                var flag = true, dependee, $dependee, condition;
                for (dependee in conditions) {
                    $dependee = $(dependee);
                    if (!$dependee.length) {
                        // Invalid dependee selector
                        flag = false;
                        break;
                    }
            
                    condition = conditions[dependee];
                    if (!_isConditionMet($dependee, condition['type'], condition['value'])) {
                        flag = false;
                        break;
                    }
                }
                if (action in inverted_actions) {
                    action = inverted_actions[action];
                    flag = !flag;
                }
                _doAction(dependent, action, flag, isInit);
            },
            _isConditionMet = function (dependee, type, value) {
                switch (type) {
                    case 'value':
                        if (typeof value !== 'object') {
                            // convert to an array
                            value = [value];
                        }
                        var dependee_val = dependee.length > 1 ? dependee.filter(':checked').val() : dependee.val();
                        for (var i = 0; i < value.length; i++) {
                            if (value[i] == dependee_val) {
                                return true;
                            }
                        }
                        return false;
                    case 'values':
                        var dependee_val = dependee.length > 1 ? dependee.filter(':checked').val() : dependee.val();
                        for (var i = 0; i < value.length; i++) {
                            if (value[i] != dependee_val) {
                                return false;
                            }
                        }
                        return true;
                    case 'checked':
                    case 'unchecked':
                        var result = false;
                        dependee.each(function(){
                            if ($(this).prop('checked') === Boolean(value)) {
                                result = true;
                                return false;
                            }
                        });
                        return type === 'checked' ? result : !result;
                    case 'empty':
                    case 'filled':
                        var result = false;
                        dependee.each(function(){
                            if (($.trim(dependee.val()) === '') === Boolean(value)) {
                                result = true;
                                return false;
                            }
                        });
                        return type === 'empty' ? result : !result;
                    case 'collapsed':
                    case 'expanded':
                        var result = false;
                        dependee.each(function(){
                            if ((dependee.hasClass('sabai-form-collapsible') && dependee.hasClass('sabai-form-collapsed')) === Boolean(value)) {
                                result = true;
                                return false;
                            }
                        });
                        return type === 'collapsed' ? result : !result;
                    default:
                        alert('Invalid condition type: ' + type);
                        return false;
                }
            },
            _doAction = function(dependent, action, flag, isInit) {
                var $dependent = $(dependent);
                switch (action) {
                    case 'disabled':
                        $dependent.find(':input').prop('disabled', flag);
                        break;
                    case 'required':
                        $dependent.toggleClass('sabai-form-field-required', flag);
                        break;
                    case 'invisible':
                        if (flag) {
                            $dependent.hide();
                        } else if ($dependent.is(':hidden')) {
                            $dependent.css('opacity', 0)
                                .slideDown('medium')
                                .animate(
                                    {opacity: 1},
                                    {queue: false, duration: 'slow'}
                                );
                        }
                        break;
                    case 'checked':
                        $dependent.find(':checkbox').prop('checked', flag);
                        break;
                    case 'collapsed':
                        if (!$dependent.hasClass('sabai-form-collapsible')) {
                            return; // not collapsible
                        }
                        if (flag && !$dependent.hasClass('sabai-form-collapsed')
                            || !flag && $dependent.hasClass('sabai-form-collapsed')
                        ) {
                            $dependent.find('a.sabai-form-collapsible:first').click();
                        }
                        break;
                    default:
                        alert('Invalid action: ' + action);
                }
            },
            selector,
            state,
            dependee,
            event;

        for (selector in states) {
            state = states[selector];
            _addRule(selector, state['action'], state['type'], state['conditions']);
        }
        for (dependee in initial_triggers) {
            for (event in initial_triggers[dependee]) {
                $(dependee).trigger(event, [true]);
            }
        }
    };
    
    SABAI.cloneField = function (container, fieldName, callback) {
        var fields = $(container).find('.sabai-entity-field'),
            field = fields.first().clone().find(':input')
                .each(function(){
                    var $this = jQuery(this);
                    if (!$this.attr('name')) return;
                    $this.attr('name', $this.attr('name').replace(fieldName + '[0]', fieldName + '[' + fields.length + ']'));
                    if ($.fn.uniform && $this.parent().is(".selector")) {
                        $this.prev("span").remove().end().unwrap().uniform().parent(".selector").show();
                    }
                }).end()
                .clearInput()
                .removeClass('sabai-form-field-error')
                .find('span.sabai-form-field-error').remove().end()
                .hide()
                .insertAfter(fields.last());
            if (callback) {
                callback.call(field);
            }
            field.slideDown('fast').focusFirstInput();
        return false;
    };
    
    SABAI.addOption = function (container, fieldName, trigger, isCheckbox, callback) {
        var $container = $(container),
            $original = $(trigger).closest('.sabai-form-field-option'),
            options = $container.find("> .sabai-form-field-option"),
            choiceName = isCheckbox ? fieldName + "[default][]" : fieldName + "[default]",
            i = $original.find("input[name='" + choiceName + "']").val(),
            option = $original.clone().find(':text').each(function(){
                var $this = jQuery(this);
                if (!$this.attr('name')) return;
                $this.attr('name', $this.attr('name').replace(fieldName + '[options][' + i + ']', fieldName + '[options][' + options.length + ']'));
            }).end()
                .clearInput()
                .find("input[name='" + choiceName + "']").val(options.length).end()
                .hide()
                .insertAfter($original);
            if (callback) {
                callback.call(option);
            }
            option.slideDown('fast').focusFirstInput();
        return false;
    };
    
    SABAI.removeOption = function (container, trigger, confirmMsg) {
        var options_non_disabled = $(container).find("> .sabai-form-field-option:not(.sabai-form-field-option-disabled)");
        if (options_non_disabled.length === 1) {
            // There must be at least one non-disabled optoin, so just clear it instead of removing
            options_non_disabled.clearInput();
            return;
        }
        // Confirm deletion
        if (!confirm(confirmMsg)) return false;
        $(trigger).closest('.sabai-form-field-option').slideUp('fast', function() {$(this).remove();});
    };
    
    $.fn.sabai = function () {
        SABAI.init(this);
    }
    
    $.fn.focusTextRange = function(start, end) {
        if (this.is('input[type="text"]') || this.is('textarea')) {
            var domEl = this.get(0);
            if (domEl.setSelectionRange) {
                domEl.focus();
                domEl.setSelectionRange(start, end);
            } else if (domEl.createTextRange) {
                var range = domEl.createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', start);
                range.select();
            }
        }
        return this;
    };
    $.fn.focusFirstInput = function() {
        var target = this.find('input[type="text"],input[type="password"],textarea').filter(':visible:first');
        if (!target.length) {
            return this;
        }
        var len = target.val().length;
        return target.focusTextRange(len, len);
    };
    $.fn.clearInput = function() {
        return this.each(function() {
            var $this = $(this), tag = $this.get(0).tagName.toLowerCase();
            if (tag === 'input') {
                var type = $this.attr('type')
                if (type === 'text' || type === 'password') {
                    $this.val('');
                } else if (type === 'checkbox' || type === 'radio') {
                    $this.prop('checked', false);
                }
            } else if (tag === 'textarea') {
                $this.val('');
            } else if (tag === 'select') {
                $this.prop('selectedIndex', -1);
            } else {
                return $this.find(':input').clearInput();
            }
        });
    };
})(jQuery);
