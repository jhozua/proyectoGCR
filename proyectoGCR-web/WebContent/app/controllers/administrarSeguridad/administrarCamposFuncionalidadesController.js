(function () {
    angular.module('adminBusinessModule')
        .controller('administrarCamposFuncionalidadesController', ['$rootScope', '$scope', '$location', 'businessAdminFactory', "$window", 'businessAdminServiciosComunes', 'MENSAJES', 'ngProgressFactory', 'constantes',
            function ($rootScope, $scope, $location, businessAdminFactory, $window, businessAdminServiciosComunes, MENSAJES, ngProgressFactory, constantes) {

                var vm = this;
                vm.selectedFunc = {};
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

                vm.cargarPantallasFunc = function () {
                    vm.progressbar.start();
                    vm.idPantSelect = undefined;
                    vm.campos = [];
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    businessAdminFactory.getData(constantes.endpoints.consultarPantallasFuncionalidad.replace("{idFunc}", vm.selectedFunc.idFuncionalidad), constantes.noCache)
                        .then(
                            function (result) {
                                vm.pantallas = result.data.datos;
                                vm.progressbar.complete();
                            },
                            function (error) {
                                vm.progressbar.complete();
                                vm.pantallas = [];
                                businessAdminServiciosComunes.showAlert(error);
                            }
                        );
                }

                vm.cargarCamposFunc = function (idPant, index) {
                    vm.progressbar.start();
                    vm.idPantSelect = index;
                    businessAdminFactory.getData(constantes.endpoints.pantallasCampos.replace("{idPantalla}", idPant), constantes.noCache)
                        .then(
                            function (result) {
                                vm.campos = result.data.datos;
                                vm.progressbar.complete();
                                $rootScope.$emit("alertEvent", {
                                    "show": false
                                });
                            },
                            function (error) {
                                vm.progressbar.complete();
                                businessAdminServiciosComunes.showAlert(error);
                            }
                        );
                }

                vm.guardar = function () {
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    vm.progressbar.start();
                    businessAdminFactory.postData(constantes.endpoints.pantallasCampos.replace("{idPantalla}", vm.idPantSelect), vm.campos)
                        .then(
                            function (result) {
                                vm.campos = result.data.datos;
                                vm.progressbar.complete();
                                var alertObject = {
                                    data: {
                                        mensaje: MENSAJES.SEGURIDAD.FUNCIONALIDADES.ACTUALIZAR_EXITO
                                    },
                                    status: MENSAJES.TIPO.SUCCESS
                                };
                                businessAdminServiciosComunes.showAlert(alertObject);
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