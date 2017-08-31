(function () {
    angular.module('adminBusinessModule')
        .controller('administrarParticipanteController', ['$scope', '$rootScope', '$location', '$routeParams', 'businessAdminFactory', "$window", 'ngProgressFactory', 'businessAdminServiciosComunes', 'MENSAJES', 'constantes',
            function ($scope, $rootScope, $location, $routeParams, businessAdminFactory, $window, ngProgressFactory, businessAdminServiciosComunes, MENSAJES, constantes) {

                var vm = this;
                vm.hideEditarParticipante = true;
                vm.hideParticipantes = false;
                vm.checkAllFlag = false;
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
                        },
                        function (error) {
                            vm.progressbar.complete();
                            vm.error = true;
                            businessAdminServiciosComunes.showAlert(error);
                        }
                    );

                vm.inicializar = function () {
                    businessAdminFactory.getData(constantes.endpoints.consultarParticipantesSistema, constantes.noCache)
                        .then(
                            function (result) {
                                vm.participantesComite = result.data.datos;
                                vm.progressbar.complete();
                            },
                            function (error) {

                            }
                        );

                    businessAdminFactory.getData(constantes.endpoints.consultarListaProceso + constantes.parametrias.tipoParticipante, constantes.noCache)
                        .then(
                            function (result) {
                                vm.tipoParticipantes = result.data.datos;
                                vm.progressbar.complete();
                            },
                            function (error) {

                            }
                        );

                    businessAdminFactory.getData(constantes.endpoints.consultarListaProceso + constantes.parametrias.listaTiposDocumentoId, constantes.noCache)
                        .then(
                            function (result) {
                                vm.tipoIdentificaciones = result.data.datos;
                                vm.progressbar.complete();
                            },
                            function (error) {

                            }
                        );
                };



                vm.irCrearParticipante = function () {
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    $window.sessionStorage.setItem("urlRetorno", constantes.url.adminParticipante);
                    $location.path(constantes.url.crearParticipante);
                };

                vm.irGestionComite = function () {
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    $location.path(constantes.url.gestionComite);
                };

                vm.irEdicionParticipante = function (index) {
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });

                    vm.hideEditarParticipante = false;
                    vm.hideParticipantes = true;

                    vm.participanteComite = JSON.parse(JSON.stringify(vm.participantesComite[index]));
                };

                vm.irParticipantes = function () {
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    vm.hideEditarParticipante = true;
                    vm.hideParticipantes = false;
                    vm.consultarparticipantesSistema();
                };


                vm.guardarParticipante = function () {
                    vm.progressbar.start();
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });

                    businessAdminFactory.postData(constantes.endpoints.elminarParticipantes, vm.participantesComite)
                        .then(
                            function (result) {
                                vm.progressbar.complete();
                                vm.limpiarEditarParticipante();
                                vm.irParticipantes();
                                var alertObject = {
                                    data: {
                                        mensaje: MENSAJES.COMITES.PARTICIPANTES.ACTUALIZAR_TODOS
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

                vm.actualizarParticipante = function () {
                    vm.progressbar.start();
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });

                    businessAdminFactory.postData(constantes.endpoints.actualizarParticipante, vm.participanteComite)
                        .then(
                            function (result) {
                                vm.progressbar.complete();
                                var alertObject = {
                                    data: {
                                        mensaje: MENSAJES.COMITES.PARTICIPANTES.ACTUALIZAR
                                    },
                                    status: MENSAJES.TIPO.SUCCESS
                                };
                                vm.limpiarEditarParticipante();
                                vm.irParticipantes();
                                businessAdminServiciosComunes.showAlert(alertObject);
                            },
                            function (error) {
                                vm.progressbar.complete();
                                businessAdminServiciosComunes.showAlert(error);
                            }
                        );


                };

                vm.limpiarEditarParticipante = function () {
                    vm.participanteComite = null;
                };

                vm.consultarparticipantesSistema = function () {
                    vm.progressbar.start();
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    vm.participantesComite = "";
                    businessAdminFactory.getData(constantes.endpoints.consultarParticipantesSistema, constantes.noCache)
                        .then(
                            function (result) {
                                vm.progressbar.complete();
                                vm.participantesComite = result.data.datos;
                            },
                            function (error) {
                                vm.progressbar.complete();
                            }
                        );

                };

                vm.eliminarParticipantes = function () {
                    if (businessAdminServiciosComunes.checkedInList(vm.participantesComite, "selected")) {

                        var button1Fn = function () {
                            for (var i = 0; i < vm.participantesComite.length; i++) {
                                if (vm.participantesComite[i].selected) {

                                    vm.participantesComite[i].deleted = true;
                                    vm.participantesComite[i].accion = "D";

                                }
                            }
                        };
                        $rootScope.$emit("alertEvent", {
                            "show": false
                        });
                        $rootScope.$emit("gaModalEvent", {
                            "title": MENSAJES.COMITES.ADMIN_PARTICIPANTES.ELIMINAR.TITULO_CONFIRMAR_ELIMINAR,
                            "msg": MENSAJES.COMITES.ADMIN_PARTICIPANTES.ELIMINAR.CONFIRMAR_ELIMINAR,
                            "button1Action": button1Fn,
                            "button1Text": MENSAJES.BOTON_CONFIRMACION.SI,
                            "button2Text": MENSAJES.BOTON_CONFIRMACION.NO
                        });
                    } else {
                        var alertObject = {
                            data: {
                                descripcionError: MENSAJES.COMITES.ADMIN_PARTICIPANTES.ELIMINAR.SIN_ELEMENTOS_ELIMINAR
                            },
                            status: MENSAJES.TIPO.WARNING
                        };
                        businessAdminServiciosComunes.showAlert(alertObject);
                    }
                };


                vm.doSort = function (propName) {
                    vm.sortBy = propName;
                    vm.reverse = !vm.reverse;
                };

                vm.checkAll = function (flag) {
                    vm.participantesComite = businessAdminServiciosComunes.checkAll(vm.participantesComite, "selected", flag);
                };
                $rootScope.$emit('menuEvent', true);

            }
        ]);
})();