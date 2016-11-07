/**
 * Extension du date picker materialize pour que la date soit saisissable.
 */
$.fn.calendrier = function(options) {
    return this.each(function() {
        var $input = $(this);

        // Options du datepicker
        var settings = $.extend({
                // Les paramètres par défaut
                // on change le container de place sinon les messages d'erreurs ne s'affichent pas (caché par le widget)
                container: 'body',
                // le champ est éditable
                editable: true,
                format: 'dd/mm/yyyy',
                selectMonths: true,
                // Il faut pouvoir sélectionner jusqu'à la date du jour -110 ans
                selectYears: 220,
                // Année minimum = année courante moins 110 ans de 365 jours = 40150 jours
                min: -40150,
                // Année maximum = année courante plus 50 ans de 365 jours = 18250 jours
                max: 18250,
                // pour fermer le datepicker quand on sélectionne une date
                onSet: function(context) {
                    if (context.select) {
                        this.close();
                    }
                },
                // FIX bug "Picker opening when leaving / coming back to browser window"
                // TODO à virer quand ce sera corrigé dans une prochaine version : https://github.com/amsul/pickadate.js/issues/160
                onClose: function() {
                    this.$root.blur();
                }
            },
            options
        );

        $input.pickadate(settings);
        var picker = $input.pickadate('picker');
        // désactiver le focus sur le champ caché (on ouvre le picker avec l'icone).
        picker.$root.off('focus').attr('tabindex', -1);

        // création de l'icone permettant d'ouvrir le widget picker
        // Besoin de spécifier le type pour ne pas avoir le comportement par défaut des boutons (type="submit")
        var $iconeDeclencheur = $('<button type="button" class="btn-floating prefix prefixe_icone_declencheur"><i class="material-icons">event</i></button>');

        // si l'input est désactivé, l'icone déclencheur doit l'être aussi
        if ($input.prop('disabled')) {
            $iconeDeclencheur.disable();
            // on rappelle le disable sur l'input pour désactiver toutes les dates non-autorisées
            $input.disable();
        }

        $iconeDeclencheur.click(function(event) {
            event.stopPropagation();
            event.preventDefault();
            picker.open();
        });

        $input.change(function() {
                // formatage auto
                var dateFormatee = Outils.normaliserDate($(this).val());
                if ($(this).val() !== dateFormatee) {
                    $(this).val(dateFormatee);
                }
            })
            // pas sur le onchange sinon ça fait une boucle infinie
            .blur(function() {
                // si la date est valide on a la renseigne pour le datepicker
                if (moment($input.val(), "DD/MM/YYYY", true).isValid()) {
                    picker.set('select', $input.val());
                }
            })
            // double clic sur le champ, la date du jour est automatiquement renseignée
            .dblclick(function() {
                picker.set('select', moment.now());
            })
            // permettre le focus sur le champ
            .removeAttr('tabindex')
            // ajout de l'icone declencher
            .before($iconeDeclencheur);
    });
};
