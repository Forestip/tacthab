/**
 * Created by paf on 02/11/15.
 */
var utils = require("../../js/utils.js");
utils.initIO(window.location.origin + "/m2m");

angular.module('squidrel_app', [])

    .controller('squidrelController', function ($scope) {
        var squidrelController = this;
        this.data = {};

        var getContext = utils.XHR('GET', '/getContext');

        getContext.then(function (response) {
                var json = JSON.parse(response.responseText)
                squidrelController.data = json.bricks;
                $scope.$apply();
            }
            , function (err) {
                console.error(err);
            }
        );

        // lorsqu'on lance un media server
        utils.io.on("brickAppears"
            , function (json) {

                console.log("brickAppears:", json);
                squidrelController.data[json.id] = json;
                $scope.$apply();
                console.log(squidrelController.data);

                // ajout de l'imeuble correspondant au media serveur
                //$('#wrapper').append('<div class="building" id="'+json.id+'"><p>'+json.name+'</p></div>');
                GridUI.addBuilding(json);

                // lors du clic sur le building
                $('#'+json.id+'').click(function(){
                    
                    console.log('Browsing server '+json.id);

                    // on parcoure le dossier racine du media server
                    utils.call(json.id, 'Browse', [0], function(str){
                        browse(str);
                    });

                })
            }
        );

        // lorsqu'on ferme un media server
        utils.io.on("brickDisappears"
            , function (json) {
                //TODO remove and apply scope
                console.log("brickDisappears:", json);
                GridUI.removeBuilding(json.brickId);
            }
        );



    });



/*
    parcourir un media server
 */
function browse(str) {

    var $data = $.parseXML(str);

    console.log($data);


}
