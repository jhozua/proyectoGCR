(function () {
    angular.module('adminBusinessModule')
        .controller('crearParticipanteController', ['$scope', '$rootScope', '$location', '$routeParams', 'businessAdminFactory', "$window", 'ngProgressFactory', 'businessAdminServiciosComunes', 'MENSAJES', 'constantes',
            function ($scope, $rootScope, $location, $routeParams, businessAdminFactory, $window, ngProgressFactory, businessAdminServiciosComunes, MENSAJES, constantes) {

                var vm = this;
                vm.datoComiteNuevo;
                vm.urlRetorno = $window.sessionStorage.getItem("urlRetorno");
                vm.ldap = constantes.rolLdap; 
                vm.idFunc = constantes.funcionalidades.comites;
                vm.progressbar = ngProgressFactory.createInstance();
                vm.progressbar.setHeight(constantes.progressBar.height);
                vm.progressbar.setColor(constantes.progressBar.color);

                vm.progressbar.start();

                businessAdminFactory.getData(constantes.endpoints.consultaOperacionesFuncionalidad.replace("{idMapeo}", vm.ldap), constantes.noCache)
                    .then(
                        function (result) {
                            vm.opFunc = result.data.opFuncionalidades;
                            for (var i = 0; i < vm.opFunc.length && !vm.func; i++) {
                                var obj = vm.opFunc[i];
                                if (obj.funcionalidad.idFuncionalidad == vm.idFunc) {
                                    vm.func = obj;
                                }
                            }
                            vm.inicializar();
                            vm.progressbar.complete();
                        },
                        function (error) {
                            vm.progressbar.complete();
                            vm.error = true;
                            businessAdminServiciosComunes.showAlert(error);
                        }
                    );

                vm.inicializar = function (){

                    businessAdminFactory.getData(constantes.endpoints.consultarListaProceso + constantes.parametrias.tipoParticipante, constantes.noCache)
                        .then(
                            function (result) {
                                vm.tipoParticipantes = result.data.datos;
                            },
                            function (error) {

                            }
                        );

                    businessAdminFactory.getData(constantes.endpoints.consultarListaProceso + constantes.parametrias.listaTiposDocumentoId, constantes.noCache)
                        .then(
                            function (result) {
                                vm.tipoIdentificaciones = result.data.datos;
                            },
                            function (error) {

                            }
                        );
                };


                vm.crearParticipante = function (valid) {
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    vm.formEnviado = true;
                    if (valid) {
                        vm.progressbar.start();
                        businessAdminFactory.putData(constantes.endpoints.crearParticipanteComite, vm.participanteComite)
                            .then(
                                function (result) {
                                    vm.progressbar.complete();
                                    var alertObject = {
                                        data: {
                                            mensaje: MENSAJES.COMITES.PARTICIPANTES.CREAR
                                        },
                                        status: MENSAJES.TIPO.SUCCESS
                                    };
                                    businessAdminServiciosComunes.showAlert(alertObject);
                                    vm.regresar();
                                },
                                function (error) {

                                    vm.progressbar.complete();
                                    businessAdminServiciosComunes.showAlert(error);
                                }
                            );

                    }

                };

                vm.regresar = function () {
                    $location.path(vm.urlRetorno);
                    $window.sessionStorage.removeItem("urlRetorno");
                };

                $rootScope.$emit('menuEvent', true);

            }
        ])
})();