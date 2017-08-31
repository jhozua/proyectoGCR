(function () {
	angular.module('adminBusinessModule')
		.controller('edicionComiteController', ['$scope', '$rootScope', '$location', '$routeParams', 'businessAdminFactory', '$window', '$filter', 'businessAdminServiciosComunes', 'ngProgressFactory', 'MENSAJES', 'constantes',
			function ($scope, $rootScope, $location, $routeParams, businessAdminFactory, $window, $filter, businessAdminServiciosComunes, ngProgressFactory, MENSAJES, constantes) {

				var vm = this;
				vm.actualizando = false;
				vm.paramSecretario = {
					si: "S",
					no: "N"
				};


				vm.inicializarParticipantes = function () {
					vm.datoComite = JSON.parse($window.sessionStorage.getItem("cTmpData"));
					vm.from = JSON.parse($window.sessionStorage.getItem("pFrom"));

					if (vm.from === null) {
						if (vm.datoComite !== null) {
							vm.datoComite.comiteXParticipanteComites = [];
						}
						vm.actualizando = true;
						vm.consultarParticipantesComite();
					} else {
						$window.sessionStorage.removeItem("pFrom");
					}

					if (vm.datoComite === null)
						$location.path(constantes.url.gestionComite);

				};

				businessAdminFactory.getData(constantes.endpoints.consultarListaProceso + constantes.parametrias.rolParticipanteComite, constantes.noCache)
					.then(
						function (result) {
							vm.rolesParticipante = result.data.datos;
						},
						function (error) {

						}
					);

				vm.eliminarParticipante = function () {

					if (businessAdminServiciosComunes.checkedInList(vm.datoComite.comiteXParticipanteComites, "marcado")) {
						var confirmacionEliminarParticipante = function () {
							vm.checkAllFlag = false;

							for (var i = 0; i < vm.datoComite.comiteXParticipanteComites.length; i++) {
								if (vm.datoComite.comiteXParticipanteComites[i].marcado) {
									if (vm.datoComite.comiteXParticipanteComites[i].participanteComite.accion == "I") {
										vm.datoComite.comiteXParticipanteComites.splice(i, 1);
										i--;
									} else {
										vm.datoComite.comiteXParticipanteComites[i].participanteComite.accion = "D";
									}
								}
							}
						};
						$rootScope.$emit("alertEvent", {
							"show": false
						});
						$rootScope.$emit("gaModalEvent", {
							"title": MENSAJES.COMITES.PARTICIPANTES.ELIMINAR.TITULO_CONFIRMAR_ELIMINAR,
							"msg": MENSAJES.COMITES.PARTICIPANTES.ELIMINAR.CONFIRMAR_ELIMINAR,
							"button1Action": confirmacionEliminarParticipante,
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

				vm.consultarParticipantesComite = function () {
					$rootScope.$emit("alertEvent", {
						"show": false
					});
					businessAdminFactory.getData(constantes.endpoints.consultarParticipantesComite + vm.datoComite.idComite, constantes.noCache)
						.then(
							function (result) {
								vm.datoComite.comiteXParticipanteComites = result.data.datos;
								vm.actualizando = false;
								vm.progressbar.complete();
								/*if(participantesNuevos !== null){
									if ( vm.datoComite.comiteXParticipanteComites===undefined) {
										vm.datoComite.comiteXParticipanteComites=[];
									}
									var actualesMap = vm.datoComite.comiteXParticipanteComites.map(function(item){return item.participanteComite.idParticipanteComite;});
									participantesNuevos = $filter('filter')(participantesNuevos, function(item){ return (actualesMap.indexOf(item.participanteComite.idParticipanteComite) === -1); });
									vm.datoComite.comiteXParticipanteComites = vm.datoComite.comiteXParticipanteComites.concat(participantesNuevos);
								}*/
							},
							function (error) {
								vm.actualizando = false;
								vm.progressbar.complete();
								if (error.status != 404)
									businessAdminServiciosComunes.showAlert(error);

								/*if(participantesNuevos !== null){
									if ( vm.datoComite.comiteXParticipanteComites===undefined) {
										vm.datoComite.comiteXParticipanteComites=[];
									}
									var actualesMap = vm.datoComite.comiteXParticipanteComites.map(function(item){return item.participanteComite.idParticipanteComite;});
									participantesNuevos = $filter('filter')(participantesNuevos, function(item){ return (actualesMap.indexOf(item.participanteComite.idParticipanteComite) === -1); });
									vm.datoComite.comiteXParticipanteComites = vm.datoComite.comiteXParticipanteComites.concat(participantesNuevos);
								}*/
							}
						);
				};

				vm.eliminarComite = function () {

					var confirmacionEliminarComite = function () {
						businessAdminFactory.postData(constantes.endpoints.eliminarComite, vm.datoComite)
							.then(
								function (result) {
									vm.progressbar.complete();
									$window.sessionStorage.removeItem("cTmpData");
									$location.path(constantes.url.gestionComite);
									businessAdminServiciosComunes.showAlert(result);
									$rootScope.comites = [];
								},
								function (error) {
									vm.progressbar.complete();
									businessAdminServiciosComunes.showAlert(error);
								}
							);
					};

					$rootScope.$emit("gaModalEvent", {
						"title": MENSAJES.COMITES.ELIMINAR.TITULO_CONFIRMAR_ELIMINAR,
						"msg": MENSAJES.COMITES.ELIMINAR.CONFIRMAR_ELIMINAR.replace("{{nombreComite}}", vm.datoComite.codigoComite),
						"button1Action": confirmacionEliminarComite,
						"button1Text": MENSAJES.BOTON_CONFIRMACION.SI,
						"button2Text": MENSAJES.BOTON_CONFIRMACION.NO
					});
				};

				vm.guardarCambiosComite = function () {

					var alertObject;
					$rootScope.$emit("alertEvent", {
						"show": false
					});
					vm.formEnviado = true;
					if (vm.datoComite.comiteXParticipanteComites && vm.datoComite.comiteXParticipanteComites.length > 0) {
						if (businessAdminServiciosComunes.isTrue(vm.datoComite.fUnipersonal) && businessAdminServiciosComunes.validarComiteUnipersonal(vm.datoComite) != 1) {
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
									alertObject = {
										data: {
											descripcionError: MENSAJES.COMITES.GUARDAR.SECRETARIO_SIN_USUARIO
										},
										status: MENSAJES.TIPO.WARNING
									};
									businessAdminServiciosComunes.showAlert(alertObject);
									return;
								}
								vm.progressbar.start();

								businessAdminFactory.postData(constantes.endpoints.actualizarComite, vm.datoComite)
									.then(
										function (success) {
											vm.datoComite.comiteXParticipanteComites = [];
											vm.actualizando = true;
											vm.consultarParticipantesComite();
											var alertObject = {
												data: {
													mensaje: MENSAJES.COMITES.ACTUALIZAR.EXITO
												},
												status: MENSAJES.TIPO.SUCCESS
											};
											businessAdminServiciosComunes.showAlert(alertObject);
											$rootScope.comites = [];
											vm.progressbar.complete();
										},
										function (error) {
											vm.progressbar.complete();
											businessAdminServiciosComunes.showAlert(error);
										}
									);
							} else {
								alertObject = {
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

				vm.checkRadio = function (data) {
				/*  Descripción: Función que permite setear la fila seleccionada (miembro) como Secretario.
					Entrada: data: Información de cada fila del objeto de negocio.
					Salida: NA  */

					vm.datoComite.comiteXParticipanteComites.forEach(function (item, index) {
						if (item.participanteComite.idParticipanteComite == data.participanteComite.idParticipanteComite)
							item.fSecretario = vm.paramSecretario.si;
						else
							item.fSecretario = vm.paramSecretario.no;
					});
				};

				vm.validarExisteSecretario = function () {
					var existeSecretario = false;
					var itemDeleted = 0;
					vm.secretarioConUsuario = false;
					if (vm.datoComite.comiteXParticipanteComites !== undefined) {
						vm.datoComite.comiteXParticipanteComites.forEach(function (item, index) {
							if (item.participanteComite.accion != "D") {
								if (item.fSecretario == vm.paramSecretario.si) {
									existeSecretario = true;
									if (item.participanteComite.usuarioBpm === undefined || item.participanteComite.usuarioBpm === "" || item.participanteComite.usuarioBpm === null) {
										vm.secretarioConUsuario = true;
									}
								}
							} else {
								itemDeleted++;
							}
						});
						if (itemDeleted == vm.datoComite.comiteXParticipanteComites.length) {
							existeSecretario = true;
						}
					} else {
						existeSecretario = true;
					}
					return existeSecretario;
				};

				vm.irGestionComite = function () {
					$rootScope.$emit("alertEvent", {
						"show": false
					});
					$rootScope.comites = [];
					$location.path(constantes.url.gestionComite);
				};

				vm.validarRolPrepUnipersonal = function () {
				/*  Descripción: Función que elimina el rolPreparación de un comité cuando se marca como Unipersonal.
					Entrada: NA
					Salida: NA  */
					vm.datoComite.rolPreparacion = vm.datoComite.fUnipersonal == 'S' ? null : vm.datoComite.rolPreparacion;
				};

				vm.validarRequeridoRolPrepComite = function () {
				/*  Descripción: Función asociada al ng-required del campo rolPreparación. Este es requerido solamente si no se marca el comité como unipersonal.
					Entrada: NA
					Salida: Boolean resultado de la validación.  */
                    return vm.datoComite && vm.datoComite.fUnipersonal == 'S' ? false : true;
                };

				vm.validarCheckUnipersonal = function () {
                /*  Descripción: Función que setea a 'N' el campo Unipersonal de un comité cuando este se marca como comité Aval.
					Entrada: NA
					Salida: NA  */
					vm.datoComite.fUnipersonal = vm.datoComite.fComiteAval == 'S' ? 'N' : vm.datoComite.fUnipersonal;
				};

                vm.validarDisabledUnipersonal = function () {
                /*  Descripción: Función asociada al ng-disabled del campo Unipersonal. Este es campo se deshabilita si se marca el campo comité Aval.
					Entrada: NA
					Salida: Boolean resultado de la validación.  */
                    return vm.datoComite && vm.datoComite.fComiteAval == 'S';
                };

				vm.irAgregarParticipante = function () {
					$rootScope.$emit("alertEvent", {
						"show": false
					});
					if (businessAdminServiciosComunes.validarComiteUnipersonal(vm.datoComite) >= 1) {
						alertObject = {
							data: {
								descripcionError: MENSAJES.COMITES.GUARDAR.MAX_PARTICIPANTES_UNIPERSONAL
							},
							status: MENSAJES.TIPO.WARNING
						};
						businessAdminServiciosComunes.showAlert(alertObject);
					} else {
						$window.sessionStorage.setItem("cTmpData", angular.toJson(vm.datoComite));
						$window.sessionStorage.setItem("pFrom", "2");
						$location.path(constantes.url.agregarParticipante);
					}
				};

				vm.doSort = function (propName) {
					vm.sortBy = propName;
					vm.reverse = !vm.reverse;
				};

				vm.checkAll = function (flag, property, trueValue, falseValue) {
					vm.datoComite.comiteXParticipanteComites = businessAdminServiciosComunes.checkAll(vm.datoComite.comiteXParticipanteComites, property, flag, trueValue, falseValue);
				};

				/* Inicio Lógica Controlador */
				vm.ldap = constantes.rolLdap;
				vm.idFunc = constantes.funcionalidades.comites;
				vm.progressbar = ngProgressFactory.createInstance();
				vm.progressbar.setHeight(constantes.progressBar.height);
				vm.progressbar.setColor(constantes.progressBar.color);

				vm.progressbar.start();

				vm.inicializarParticipantes();

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
							vm.progressbar.complete();
						},
						function (error) {
							vm.progressbar.complete();
							vm.error = true;
							businessAdminServiciosComunes.showAlert(error);
						}
					);

					$rootScope.$emit('menuEvent', true);

				/* Fin Lógica Controlador. */

			}
		]);
})();