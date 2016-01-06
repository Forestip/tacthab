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

                // ajout de l'imeuble correspondant au media serveur
                GridUI.addBuilding(json);

                // lors du clic sur le building
                $('#'+json.id+'').click(function(){
                    
                    console.log('Browsing server '+json.id);

                    // tableau de l'arborescence 
                    // TODO ==> a convertir en json pour la treeview
                    var tree;

                    // on parcoure le dossier racine du media server
                    browse(json.id, 0, tree);

                    console.log(tree);

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



/**
 * Parcourir un dossier
 */
function browse(serverId, folderId, tree) {

    utils.call(serverId, 'Browse', [folderId], function(str){
        var folderContent = _parseXml(str);
        getTree(folderContent, tree, serverId);
    });

}

/**
 * parsing de la reponse en xml
 */
function _parseXml(str){
    var response = $.parseXML(str);

    var xmlResponse = $(response);

    var result = xmlResponse.find('Result');

    var content = $.parseXML(result.text());

    return $(content);
}

/**
 * genère l'arborescence sous forme de tableau json
 */
function getTree(xmlContent, tree, serverId){


    // pour chaque element
    xmlContent.find('container').each(function(){

        var element = $(this);

        //on récupère le titre de l'element
        var title = element.find('title').text();

        console.log(title);

        // TODO ==> ajouter le title de l'element dans le tableau tree pour l'affichage 

        // TODO ==> parcourir les sous dossier 
        // j'ai essayé en rappellant browse() mais ça fait une boucle infinie (parce que browse() rapelle getTree...)
        // par contre dans la boucle infinie on voit bien que ça affiche les sous dossier, donc on est pas loin !!!!
        // j'en peux plus
        // je vais me suicider
        // ...
        // ...
        // ...
        // en gros il faut trouver un moyen de différencier les dossiers des fichiers, pour qu'il ne browse que les dossiers
    });
}