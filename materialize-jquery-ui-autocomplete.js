(function($) {
    /**
     * Surchage de jquery-ui.autocomplete (http://api.jqueryui.com/autocomplete/).
     * Même si il est possible de surcharger les méthodes natives du plugin autocomplete, ce n'est pas recommandé. En effet, il est plus judicieux (pour éviter les bugs) d'utiliser les options ci-dessus.
     * Elles ont été testées et permette de faire un usage "cloisonné" du plugin jquery-ui. !!
     * 
     * options
     * 	l'ensemble des options
     *  - entree [chaine ou tableau ou fonction, obligatoire] : les données à utiliser
     *  	- chaine : dans le cas d'une chaine de caractère, la requête et la réponse sont géré de manière automatique. Dans cette configuration, le terme est envoyé par le paramètre "libelle". 
     *    	- autre (tableau ou fonction) : si le type n'est pas une chaine, on laisse jquery-ui gérer
     *  - parametres [fonction(), obligatoire]: les paramètres pour l'appel ajax (fonction pour lire ces données à un moment T, en l'occurence juste avant l'appel ajax).
     *  - afficher [fonction(ligne), obligatoire]: callback pour l'affichage des valeurs
     *  - selectionne [fonction(ligne), obligatoire] : callback après sélection d'une valeur
     *  - nombreMinimalCaracatères [entier, non obligatoire (2 par défaut)] :  le nombre minimal de caractères à saisir avant éxécution de l'autocomplétion
     *  - délai [entier, non obligatoire (100 par défaut)] : le délai avant éxécution de l'autocomplétion
     * 
     */
    // Pas de widget jqueryui car on a besoin du ramener tout le code de $.widget qui n'est pas dans le projet et pour l'usage qu'on en fait ce n'est pas nécessaire pour le moment. 
    $.fn.autocompletion = function(options) {

        return this.each(function() {
            var settings = $.extend({
                // OPTIONS POUR L'APPEL 
                source: function(requete, reponse) {
                    if (typeof options.entree === "string") {
                        // si chaine c'est qu'un appel ajax est souhaité
                        Serveur.ajaxGet(
                            options.entree,
                            $.extend({
                                    libelle: requete.term
                                },
                                options.parametres ? options.parametres() : ''
                            ),
                            function(resultat) {
                                reponse(resultat);
                            }
                        );
                    }
                },
                select: function(event, ui) {
                    var ligne = ui.item;
                    if (ligne) {
                        // une ligne a été sélectionnée
                        options.selectionne(ligne);
                    }
                    return false;
                },
                minLength: options.nombreMinimaleCaracteres ? options.nombreMinimaleCaracteres : 2,
                delay: options.delai ? options.delai : 100,
                itemRenderer: function(item) {
                    return options.afficher(item);
                },

                // STYLE MATERIALIZE
                open: function(event, ui) {
                    var menu = $(this).data('ui-autocomplete').menu.element;
                    menu.addClass('active').css({
                        display: 'block',
                        opacity: 1
                    });
                },
                close: function(event, ui) {
                    var menu = $(this).data('ui-autocomplete').menu.element;
                    menu.removeClass('active').css({
                        display: 'none',
                        opacity: 0
                    });
                },
                focus: function(event, ui) {
                    var menu = $(this).data('ui-autocomplete').menu.element;
                    menu.find('.selected').removeClass('selected');
                    menu.find('.ui-state-focus').removeClass('ui-state-focus').addClass('selected');
                }
            }, options);

            var autocompletion = $(this).autocomplete(settings).autocomplete('instance');

            // STYLE MATERIALIZE
            // Pour étendre le méthodes privés on redéfinit les méthodes par une simple assignation JS (c'est pour ça qu'on récupére l'instance du plugin ci-dessus)
            // Il n'est pas possible d'utiliser le widget factory de jquery-ui car $.widget n'est pas présent dans le projet et il n'est pas souhaité de l'ajouter pour cette unique utilisation.
            autocompletion._renderMenu = function(ul, items) {
                $(ul).removeClass().addClass('dropdown-content select-dropdown heightmax-dropdown');
                var that = this;
                $.each(items, function(index, item) {
                    that._renderItemData(ul, item);
                });
            };

            autocompletion._renderItem = function(ul, item) {
                return $('<li>').append('<span>' + (this.options.itemRenderer ? this.options.itemRenderer(item) : item.libelle || item) + '</span>').appendTo(ul);
            };
        });
    };
})(jQuery);
