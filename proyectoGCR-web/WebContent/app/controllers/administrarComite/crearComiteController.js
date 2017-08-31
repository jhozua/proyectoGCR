(function () {
    angular.module('adminBusinessModule')
        .controller('crearComiteController', ['$scope', '$rootScope', '$location', '$routeParams', 'businessAdminFactory', "$window", "$filter", 'businessAdminServiciosComunes', 'ngProgressFactory', 'MENSAJES', 'constantes',
            function ($scope, $rootScope, $location, $routeParams, businessAdminFactory, $window, $filter, businessAdminServiciosComunes, ngProgressFactory, MENSAJES, constantes) {

                var vm = this;

                window.sessionStorage.removeItem("pFrom");
                vm.paramSecretario = {
                    si: "S",
                    no: "N"
                };
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

                vm.inicializar = function () {
                    if ($window.sessionStorage.getItem("cTmpData") !== null) {
                        vm.datoComiteNuevo = JSON.parse($window.sessionStorage.getItem("cTmpData"));
                        $window.sessionStorage.removeItem("cTmpData");
                    } else {
                        vm.datoComiteNuevo = {};
                    }

                    businessAdminFactory.getData(constantes.endpoints.consultarListaProceso + constantes.parametrias.rolParticipanteComite)
                        .then(
                            function (result) {
                                vm.rolesParticipante = result.data.datos;
                            },
                            function (error) {

                            }
                        );
                };



                vm.eliminarSeleccion = function () {

                    if (businessAdminServiciosComunes.checkedInList(vm.datoComiteNuevo.comiteXParticipanteComites, "eliminar")) {
                        var confirmarEliminarSeleccion = function () {
                            vm.checkAllFlag = false;
                            vm.datoComiteNuevo.comiteXParticipanteComites = $filter('filter')(
                                vm.datoComiteNuevo.comiteXParticipanteComites,
                                function (item) {
                                    return !item.eliminar;
                                });
                        };

                        $rootScope.$emit("alertEvent", {
                            "show": false
                        });
                        $rootScope.$emit("gaModalEvent", {
                            "title": MENSAJES.COMITES.PARTICIPANTES.ELIMINAR.TITULO_CONFIRMAR_ELIMINAR,
                            "msg": MENSAJES.COMITES.PARTICIPANTES.ELIMINAR.CONFIRMAR_ELIMINAR,
                            "button1Action": confirmarEliminarSeleccion,
                            "button1Text": MENSAJES.BOTON_CONFIRMACION.SI,
                            "button2Text": MENSAJES.BOTON_CONFIRMACION.NO
                        });
                    } else {
                        var alertObject = {
                            data: {
                                descripcionError: MENSAJES.COMITES.PARTICIPANTES.ELIMINAR.SIN_ELEMENTOS_ELIMINAR
                            },
                            status: MENSAJES.TIPO.WARNING
                        };
                        businessAdminServiciosComunes.showAlert(alertObject);
                    }
                };

                vm.crearComite = function () {
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    vm.formEnviado = true;
                    if (vm.datoComiteNuevo.comiteXParticipanteComites && vm.datoComiteNuevo.comiteXParticipanteComites.length > 0) {
                        if (businessAdminServiciosComunes.isTrue(vm.datoComiteNuevo.fUnipersonal) && businessAdminServiciosComunes.validarComiteUnipersonal(vm.datoComiteNuevo) != 1) {
							alertObject = {
								data: {
									descripcionError: MENSAJES.COMITES.GUARDAR.MAX_PARTICIPANTES_UNIPERSONAL
								},
								status: MENSAJES.TIPO.WARNING
							};
							businessAdminServiciosComunes.showAlert(alertObject);
						} else {
                            if (vm.validarExisteSecretario()) {
                                if (vm.secretarioConUsuario) {
                                    var alertObject = {
                                        data: {
                                            descripcionError: MENSAJES.COMITES.GUARDAR.SECRETARIO_SIN_USUARIO
                                        },
                                        status: MENSAJES.TIPO.WARNING
                                    };
                                    businessAdminServiciosComunes.showAlert(alertObject);
                                    return;
                                }
                                vm.progressbar.start();
                                businessAdminFactory.putData(constantes.endpoints.crearComite, vm.datoComiteNuevo)
                                    .then(
                                        function (result) {
                                            vm.progressbar.complete();
                                            vm.irGestionComite();
                                            var alertObject = {
                                                data: {
                                                    mensaje: MENSAJES.COMITES.GUARDAR.EXITO
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
                            } else {
                                var alertObject = {
                                    data: {
                                        descripcionError: MENSAJES.COMITES.GUARDAR.SIN_SECRETARIO
                                    },
                                    status: MENSAJES.TIPO.WARNING
                                };
                                businessAdminServiciosComunes.showAlert(alertObject);
                            }
                        }
                    } else {
						alertObject = {
							data: {
								descripcionError: MENSAJES.COMITES.GUARDAR.SIN_PARTICIPANTES
							},
							status: MENSAJES.TIPO.WARNING
						};
						businessAdminServiciosComunes.showAlert(alertObject);
					}
                };

				vm.validarRolPrepUnipersonal = function () {
                /*  Descripción: Función que elimina el rolPreparación de un comité cuando se marca como Unipersonal.
					Entrada: NA
					Salida: NA  */
					vm.datoComiteNuevo.rolPreparacion = vm.datoComiteNuevo.fUnipersonal == 'S' ? null : vm.datoComiteNuevo.rolPreparacion;
				};

                vm.validarRequeridoRolPrepComite = function () {
                /*  Descripción: Función asociada al ng-required del campo rolPreparación. Este es requerido solamente si no se marca el comité como unipersonal.
					Entrada: NA
					Salida: NA  */
                    return vm.datoComiteNuevo && vm.datoComiteNuevo.fUnipersonal == 'S' ? false : true;
                };

                vm.validarCheckUnipersonal = function () {
                /*  Descripción: Función que setea a 'N' el campo Unipersonal de un comité cuando este se marca como comité Aval.
					Entrada: NA
					Salida: NA  */
					vm.datoComiteNuevo.fUnipersonal = vm.datoComiteNuevo.fComiteAval == 'S' ? 'N' : vm.datoComiteNuevo.fUnipersonal;
				};

                vm.validarDisabledUnipersonal = function () {
                /*  Descripción: Función asociada al ng-disabled del campo Unipersonal. Este es campo se deshabilita si se marca el campo comité Aval.
					Entrada: NA
					Salida: NA  */
                    return vm.datoComiteNuevo && vm.datoComiteNuevo.fComiteAval == 'S';
                };

                vm.irGestionComite = function () {
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    $window.sessionStorage.removeItem("cTmpData");
                    $rootScope.comites = [];
                    $location.path(constantes.url.gestionComite);
                };

                vm.irAgregarParticipante = function () {
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    if (businessAdminServiciosComunes.validarComiteUnipersonal(vm.datoComiteNuevo) >= 1) {
						alertObject = {
							data: {
								descripcionError: MENSAJES.COMITES.GUARDAR.MAX_PARTICIPANTES_UNIPERSONAL
							},
							status: MENSAJES.TIPO.WARNING
						};
						businessAdminServiciosComunes.showAlert(alertObject);
					} else {
                        $window.sessionStorage.setItem("cTmpData", angular.toJson(vm.datoComiteNuevo));
                        $window.sessionStorage.setItem("pFrom", "1");
                        $location.path(constantes.url.agregarParticipante);
                    }
                };


                vm.checkRadio = function (data) {
                    /*  Descripción: Función que permite setear la fila seleccionada (miembro) como Secretario.
                        Entrada: data: Información de cada fila del objeto de negocio.
                        Salida: NA  */

                    vm.datoComiteNuevo.comiteXParticipanteComites.forEach(function (item, index) {
                        if (item.participanteComite.idParticipanteComite == data.participanteComite.idParticipanteComite)
                            item.fSecretario = vm.paramSecretario.si;
                        else
                            item.fSecretario = vm.paramSecretario.no;
                    });
                };

                vm.validarExisteSecretario = function () {
                    var existeSecretario = false;
                    vm.secretarioConUsuario = false;
                    if (vm.datoComiteNuevo.comiteXParticipanteComites !== undefined) {
                        vm.datoComiteNuevo.comiteXParticipanteComites.forEach(function (item, index) {
                            if (item.fSecretario == vm.paramSecretario.si && !item.deleted) {
                                existeSecretario = true;
                                if (item.participanteComite.usuarioBpm === undefined || item.participanteComite.usuarioBpm === "" || item.participanteComite.usuarioBpm === null) {
                                    vm.secretarioConUsuario = true;
                                }
                            }
                        });
                    } else {
                        existeSecretario = true;
                    }
                    return existeSecretario;
                };

                vm.doSort = function (propName) {
                    vm.sortBy = propName;
                    vm.reverse = !vm.reverse;
                };

                vm.checkAll = function (flag, property, trueValue, falseValue) {
                    vm.datoComiteNuevo.comiteXParticipanteComites = businessAdminServiciosComunes.checkAll(vm.datoComiteNuevo.comiteXParticipanteComites, property, flag, trueValue, falseValue);
                };

                $rootScope.$emit('menuEvent', true);

            }
        ]);
})();