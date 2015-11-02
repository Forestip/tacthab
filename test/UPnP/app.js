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
        utils.io.on("brickAppears"
            , function (json) {
                console.log("brickAppears:", json);
                squidrelController.data[json.id] = json;
                $scope.$apply();
                console.log(squidrelController.data);
            }
        );
        utils.io.on("brickDisappears"
            , function (json) {
                //TODO remove and apply scope
                console.log("brickDisappears:", json);
            }
        );
    });
