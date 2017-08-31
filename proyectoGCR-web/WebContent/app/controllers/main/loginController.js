(function () {
    angular.module('adminBusinessModule')
        .controller('loginController', ['$rootScope', '$scope', '$location', 'businessAdminFactory', "$window", 'businessAdminServiciosComunes', 'MENSAJES', 'ngProgressFactory', 'constantes',
            function ($rootScope, $scope, $location, businessAdminFactory, $window, businessAdminServiciosComunes, MENSAJES, ngProgressFactory, constantes) {

                var vm = this;

                vm.iniciarSesion = function () {
                    $location.path(constantes.url.main);
                };
                $rootScope.$emit('menuEvent', false);
            }
        ]);

})();