(function () {
    angular.module("adminBusinessModule")
        .directive("alerta", function () {
            return {
                restrict: 'E',
                templateUrl: "app/directives/alerta/alertaTmpl.html",
                scope: {},
                replace: true,
                controller: function ($element, $rootScope) {
                    var vm = this;

                    $rootScope.$on('alertEvent', function (event, args) {
                        vm.alertData = args;
                        var pos = $(window).scrollTop();
                        if (vm.alertData.show) {
                            $("body").css({
                                "margin-top": -pos + "px",
                                "overflow-y": "scroll",
                            });
                            $(window).scrollTop(0);
                            $("body").css("transition", "all 1s ease");
                            $("body").css("margin-top", "0");
                            $("body").on("webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd", function () {
                                $("body").css("transition", "none");
                            });
                        }
                    });
                },
                controllerAs: "alertCtrl"
            };
        });
})();