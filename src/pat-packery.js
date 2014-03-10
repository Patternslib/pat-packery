/**
 * Basic pattern for packery
 * Copyright 2013-2014 Simplon B.V. - Wichert Akkerman
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'pat-registry', 'pat-parser', 'imagesloaded', 'packery' ], function ($, registry, Parser, imagesLoaded, Packery) {
            return factory($, registry, Parser, imagesLoaded, Packery);
        });
    } else {
        factory(root.jQuery, root.patterns, root.patterns.parser, root.imagesLoaded, root.packery);
    }
}(this, function($, registry, Parser, imagesLoaded, Packery) {
    var parser = new Parser("packery");

    parser.add_argument("item-selector", ".item");
    parser.add_argument("column-width", 240);
    parser.add_argument("gutter-width", 20);
    parser.add_argument("transition-speed", "0.4s");

    var packery = {
        name: "packery",
        trigger: ".pat-packery",

        init: function($el, opts) {
            return $el.each(function() {
                var container = this,
                    $container = $(this),
                    options = parser.parse($container, opts),
                    pckry = new Packery(container, {
                        itemSelector: options.itemSelector,
                        columnWidth: options.columnWidth,
                        gutter: options.gutterWidth,
                        transitionDuration: options.transitionSpeed
                    }),
                    state = {
                        packery: pckry,
                        container: container,
                        gutter: options.gutterWidth,
                        columnWidth: pckry.options.columnWidth + options.gutterWidth
                    },
                    width = container.parentElement.clientWidth;

                $(document).trigger('clear-imagesloaded-cache');
                imagesLoaded(this, function() {
                    packery._layout(container, state);
                });

                $container
                    .on("patterns-injected", null, state, packery.onInjection)
                    .on("pat-update", null, state, packery.onPatternUpdate);

                var intv = setInterval(function() {
                    if (!container.parentElement) {
                        clearInterval(intv);
                        return;
                    }
                    var current_width = container.parentElement.clientWidth;
                    if (current_width!==width) {
                        width=current_width;
                        packery._layout(container, state);
                    }
                }, 200);

            });
        },

        _layout: function(container, state) {
            if (!container.parentNode) {
                return;
            }
            $(container).removeClass('packery-ready');
            var outsideSize = getSize(container.parentNode).innerWidth,
                cols = Math.max(1, Math.floor((outsideSize + state.gutter) / state.columnWidth));
            container.style.width = (cols * state.columnWidth - state.gutter) + "px";
            state.packery.layout();
            $(container).addClass('packery-ready');
        },

        onInjection: function(event) {
            var state = event.data;
            state.packery.reloadItems();
            state.packery.layout();
            if ($("img", event.target).length) {
                imagesLoaded(event.data.container, $.proxy(function() {
                    packery._layout(this, state);
                }, event.data.container));
            }
        },

        onPatternUpdate: function(event) {
            packery._layout(this, event.data);
        }
    };

    registry.register(packery);
    return packery;
}));


