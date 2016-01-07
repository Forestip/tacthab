/**
 * Created by paf on 02/11/15.
 */
var utils = require("../../js/utils.js");
utils.initIO(window.location.origin + "/m2m");

angular.module('squidrel_app', [])

    .controller('squidrelController', function ($scope) {
        var squidrelController = this;
        $scope.data = {};

        $scope.mediaRenderer = {};

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
                $scope.data[json.id] = json;
                $scope.$apply();

                if (json.type[2] == 'BrickUPnP_MediaRenderer') {
                    $scope.mediaRenderer[json.id] = json;
                    $scope.$apply();
                } else if (json.type[2] == 'BrickUPnP_MediaServer') {
                    // ajout de l'imeuble correspondant au media serveur
                    GridUI.addBuilding(json);
                }

                // lorsqu'on ferme un media server
                utils.io.on("brickDisappears"
                    , function (json) {
                        console.log("brickDisappears:", json);
                        GridUI.removeBuilding(json.brickId);
                        delete $scope.data[json.brickId];
                        delete $scope.mediaRenderer[json.brickId];
                        $scope.$apply();
                    }
                );
            });

        /**
         * Parcourir un dossier
         */
        $scope.browse = function (serverId, folderId) {
            utils.call(serverId, 'Browse', [folderId], function (str) {
                var folderContent = _parseXml(str);
                getTree(folderContent, serverId, folderId);
            });
        };

        $scope.load = function (mediaRendererID, serverID, itemID) {
            utils.call(mediaRendererID, 'loadMedia', [serverID, itemID], function (str) {
                var res = _parseXml(str);
            });
        };

        $scope.play = function (mediaRendererID) {
            utils.call(mediaRendererID, 'Play', [], function (str) {
                var res = _parseXml(str);
            });
        };

        $scope.pause = function (mediaRendererID) {
            utils.call(mediaRendererID, 'Pause', [], function (str) {
                var res = _parseXml(str);
            });
        };

        $scope.stop = function (mediaRendererID) {
            utils.call(mediaRendererID, 'Stop', [], function (str) {
                var res = _parseXml(str);
                console.log(res);
            });
        };

        $scope.setVolume = function (mediaRendererID, volume) {
            utils.call(mediaRendererID, 'setVolume', [volume], function (str) {
                var res = _parseXml(str);
                console.log(res);
            });
        };

        /**
         * parsing de la reponse en xml
         */
        _parseXml = function (str) {
            var response = $.parseXML(str);
            var xmlResponse = $(response);
            var result = xmlResponse.find('Result');
            var content = $.parseXML(result.text());
            return $(content);
        };

        getTree = function (xmlContent, serverId, parentFolderId) {
            // pour chaque element
            xmlContent.find('container').each(function () {
                var id = $(this)[0].id;
                var name = $(this).find('title').text();
                GridUI.setFolder(serverId, id, name, parentFolderId)
            });

            xmlContent.find('item').each(function () {
                var id = $(this)[0].id;
                var name = $(this).find('title').text();
                var thumb = 'assets/img/item_icon.png';

                //Récupération des metadat pour une image
                //var sid=$.trim(serverId)
                utils.call(serverId, 'getMetaData', [id], function (str) {
                    var metaData = _parseXml(str);
                    //TODO
                    // thumb = '';
      
                });
                //getMetadata photo: element[0].childNotes[6].innerHTML
                GridUI.setItem(serverId, id, name, thumb)
            });
        };
    });