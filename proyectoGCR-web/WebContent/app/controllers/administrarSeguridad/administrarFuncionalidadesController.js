(function () {
    angular.module('adminBusinessModule')
        .controller('administrarFuncionalidadesController', ['$rootScope', '$scope', '$location', 'businessAdminFactory', "$window", 'businessAdminServiciosComunes', 'MENSAJES', 'ngProgressFactory', 'constantes',
            function ($rootScope, $scope, $location, businessAdminFactory, $window, businessAdminServiciosComunes, MENSAJES, ngProgressFactory, constantes) {

                var vm = this;
                vm.progressbar = ngProgressFactory.createInstance();
                vm.progressbar.setHeight(constantes.progressBar.height);
                vm.progressbar.setColor(constantes.progressBar.color);
                $rootScope.$emit("alertEvent", {
                    "show": false
                });

                vm.progressbar.start();
                businessAdminFactory.getData(constantes.endpoints.funcionalidades, constantes.noCache)
                    .then(
                        function (result) {
                            vm.funcionalidades = result.data.datos;
                            vm.progressbar.complete();
                        },
                        function (error) {
                            vm.progressbar.complete();
                            businessAdminServiciosComunes.showAlert(error);
                        }
                    );

                vm.doSort = function (propName) {
                    if (propName != undefined) {
                        vm.sortBy = propName;
                        vm.reverse = !vm.reverse;
                    }
                };

                vm.guardar = function () {
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });

                    vm.progressbar.start();
                    businessAdminFactory.postData(constantes.endpoints.funcionalidades, vm.funcionalidades)
                        .then(
                            function (result) {
                                vm.funcionalidades = result.data.datos;
                                vm.progressbar.complete();
                                var alertObject= {data: {mensaje: MENSAJES.SEGURIDAD.FUNCIONALIDADES.ACTUALIZAR_EXITO}, status: MENSAJES.TIPO.SUCCESS};
                                businessAdminServiciosComunes.showAlert(alertObject);
                                $rootScope.$emit('menuEvent', true);
                            },
                            function (error) {
                                vm.progressbar.complete();
                                businessAdminServiciosComunes.showAlert(error);
                            }
                        );
                };

                vm.salir = function () {
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    $window.sessionStorage.clear();
                    $location.path(constantes.url.main);
                };

                $rootScope.$emit('menuEvent', true);

            }
        ]);

})();