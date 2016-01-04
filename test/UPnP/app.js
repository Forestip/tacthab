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

    // parsing de la reponse
    var response = $.parseXML(str);

    var $xmlResponse = $(response);

    var $result = $xmlResponse.find('Result');

    var content = $.parseXML($result.text());
    var $xmlContent = $(content);

    // pour chaqque élément
    $xmlContent.find('container').each(function(){
        console.log(this);
    });


}
