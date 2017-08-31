(function () {
    'use strict';
    angular.module('adminBusinessModule')
        .directive('ggtAllowPattern', function ($document) {
            /* Directiva para manejar los patrones permitidos en los inputs de texto. */
            return {
                restrict: "A",
                compile: function (tElement, tAttrs) {
                    return function (scope, element, attrs) {
                        element.bind("keypress", function (event) {
                            var keyCode = event.which || event.keyCode;
                            var keyCodeChar = String.fromCharCode(keyCode);
                            if (!keyCodeChar.match(new RegExp(attrs.ggtAllowPattern, "i")) &&
                                keyCode != 37 && keyCode != 38 && keyCode != 39 &&
                                keyCode != 40 && keyCode != 46 && keyCode != 8 && keyCode != 17) {
                                //37-40: arrow keys, 46: delete key, 8: backspace, 17:ctrl
                                event.preventDefault();
                                return false;
                            }

                        });
                    };
                }
            };

        })
        .directive('consecutivo', function () {
            return {
                require: 'ngModel',
                link: function (scope, elem, attrs, ngModel) {
                    var toView = function (data) {
                        if (data && data != '') {
                            var consecStr = data.toString();
                            var zeroStr = "0".repeat(11 - consecStr.length);
                            zeroStr += consecStr;
                            return zeroStr;
                        }
                    };

                    var toModel = function (data) {
                        //convert data from model format to view format
                        if (data && data != '') {
                            return Number.parseInt(data);
                        }
                    };

                    ngModel.$formatters.unshift(toView);
                    ngModel.$parsers.unshift(toModel);
                }
            };
        });
}());