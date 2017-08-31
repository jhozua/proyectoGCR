(function () {
    angular.module('adminBusinessModule')
        .controller('consultarEditarCUTPAController', ['$scope', '$rootScope', '$location', '$routeParams', 'businessAdminFactory', "$filter", "$window", "businessAdminServiciosComunes", 'ngProgressFactory', 'MENSAJES', 'constantes',
            function ($scope, $rootScope, $location, $routeParams, businessAdminFactory, $filter, $window, businessAdminServiciosComunes, ngProgressFactory, MENSAJES, constantes) {

                var vm = this;
                $rootScope.$emit("alertEvent", {
                    "show": false
                });
                vm.selectedRow = null;
                vm.rolPermiteEditar = constantes.rolPermiteEditar;
                vm.activarFiduciaria = false;
                vm.obligatoriedadNumero = true;
                vm.codigoParamEmpresa = constantes.codigoParamEmpresa;
                vm.checkAllFlag = false;

                vm.marcados = [];
                var marcadosObjs = [];
                vm.adminInvolucradosCUTPA = {
                    involucradoPadre: {},
                    miembrosCUTPA: []
                };


                vm.progressbar = ngProgressFactory.createInstance();
                vm.progressbar.setHeight(constantes.progressBar.height);
                vm.progressbar.setColor(constantes.progressBar.color);

                vm.progressbar.start();

                businessAdminFactory.getData(constantes.endpoints.consultarListaProceso + constantes.parametrias.listaTiposDocumentoId, constantes.noCache)
                    .then(
                        function (result) {
                            vm.listaTipoDocumento = result.data.datos;
                        },
                        function (error) {}
                    );
                businessAdminFactory.getData(constantes.endpoints.consultarListaNegocio + constantes.parametrias.listaFiduciarias, constantes.noCache)
                    .then(
                        function (result) {
                            vm.listaFiduciarias = result.data.datos;
                        },
                        function (error) {}
                    );
                businessAdminFactory.getData(constantes.endpoints.consultarFigurasAgrupamiento, constantes.noCache)
                    .then(
                        function (result) {
                            vm.progressbar.complete();
                            vm.listaTipoAgrupamiento = result.data.datos;
                        },
                        function (error) {
                            vm.progressbar.complete();
                        }
                    );

                vm.cambioTipoAgrupamiento = function () {
                    if (vm.adminInvolucradosCUTPA.involucradoPadre.tipoPersonaJuridica.codigoParametro == constantes.codParametroPatrimonio) {
                        vm.activarFiduciaria = true;
                    } else {
                        vm.activarFiduciaria = false;
                        vm.adminInvolucradosCUTPA.involucradoPadre.fiduciaria = undefined;
                    }
                };

                vm.cambioFiduciaria = function () {
                    if (!vm.adminInvolucradosCUTPA.involucradoPadre.fiduciaria || vm.adminInvolucradosCUTPA.involucradoPadre.fiduciaria.codigoParametro != constantes.codParametroFiducTemporal) {
                        vm.obligatoriedadNumero = true;
                    } else {
                        vm.obligatoriedadNumero = false;
                    }
                };

                var iniPaginas = function (cantidad) {
                    vm.paginas = new Array(cantidad);
                };


                vm.consultarEnCRM = function (page) {

                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    if (page === undefined || (page >= 1 && page <= vm.datosTabla.totalPaginas)) {
                        vm.progressbar.start();
                        businessAdminFactory.getData(constantes.endpoints.consultarEmpresasFiltro.replace("{tipoidenti}", vm.filtroTipodoc || "").replace("{numidenti}", vm.filtroNumdoc || "").replace("{nombre}", vm.filtroNombre || ""), constantes.noCache, page)
                            .then(
                                function (result) {
                                    vm.progressbar.complete();
                                    vm.datosTabla = result.data;
                                    if (vm.marcados.length) {
                                        for (var i in vm.datosTabla.datos) {
                                            if (vm.marcados.indexOf(vm.datosTabla.datos[i].idGrupoRiesgo) !== -1)
                                                vm.datosTabla.datos[i].marcado = true;
                                        }
                                    }
                                    iniPaginas(vm.datosTabla.totalPaginas);

                                },
                                function (error) {
                                    vm.progressbar.complete();
                                    vm.datosTabla = {};
                                    businessAdminServiciosComunes.showAlert(error);
                                }
                            );
                    }
                };

                vm.actualizarAgrupamientoCUTPA = function (valid) {
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    vm.formEnviado = true;
                    if (valid) {
                        if (vm.porcentajesValidos()) {
                            vm.progressbar.start();
                            businessAdminFactory.postData(constantes.endpoints.actualizarCUTPA, vm.adminInvolucradosCUTPA)
                                .then(
                                    function (result) {
                                        involucrados = {};
                                        vm.progressbar.complete();
                                        vm.consultarMiembros();
                                        var alertObject = {
                                            data: {
                                                mensaje: MENSAJES.CUTPA.ACTUALIZAR.EXITO
                                            },
                                            status: MENSAJES.TIPO.SUCCESS
                                        };
                                        businessAdminServiciosComunes.showAlert(alertObject);
                                        $window.sessionStorage.setItem("involucradoPadre", angular.toJson(vm.adminInvolucradosCUTPA.involucradoPadre));
                                        $window.sessionStorage.setItem("involucradosDataMarcados", angular.toJson(vm.adminInvolucradosCUTPA.miembrosCUTPA));
                                    },
                                    function (error) {
                                        vm.progressbar.complete();
                                        businessAdminServiciosComunes.showAlert(error);
                                    }
                                );
                        } else {
                            var error = {};
                            error.data = {};
                            error.status = MENSAJES.TIPO.PRECONDITION;
                            error.data.descripcionError = MENSAJES.CUTPA.CREAR.ERROR_PCT_PART;
                            businessAdminServiciosComunes.showAlert(error);
                        }

                    } else {
                        var error = {};
                        error.data = {};
                        error.status = MENSAJES.TIPO.PRECONDITION;
                        error.data.descripcionError = MENSAJES.CUTPA.ACTUALIZAR.ERROR;
                        businessAdminServiciosComunes.showAlert(error);
                    }
                };
                
                vm.porcentajesValidos = function () {
                    var faltanPorcentajes = false;
                    var suma = 0;
                    if (vm.adminInvolucradosCUTPA.miembrosCUTPA.length > 0) {
                        vm.adminInvolucradosCUTPA.miembrosCUTPA.forEach(function(item) {
                            if (item.accion != constantes.accionServiciosRest.eliminar) {
                                if (!businessAdminServiciosComunes.checkUndefined(item.porcentajeParticipacion)) {
                                    faltanPorcentajes = true;
                                } else{
                                    suma += Number(item.porcentajeParticipacion);
                                }
                            }
                        });
                        return !(faltanPorcentajes || suma > 100);
                    } else {
                        return true;
                    }
                };

                vm.irAgregarEmpresa = function () {
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    $window.sessionStorage.setItem("involucradoPadre", angular.toJson(vm.adminInvolucradosCUTPA.involucradoPadre));
                    $window.sessionStorage.setItem("involucradosDataMarcados", angular.toJson(vm.adminInvolucradosCUTPA.miembrosCUTPA));
                    $window.sessionStorage.setItem("urlRetorno", constantes.url.editarCUTPA);
                    $location.path(constantes.url.agregarEmpresas);
                };

                vm.marcarDesmarcar = function (i) {
                    var indice = vm.marcados.indexOf(vm.datosTabla.datos[i].idGrupoRiesgo);
                    if (indice === -1) {
                        vm.marcados.push(vm.datosTabla.datos[i].idGrupoRiesgo);
                        marcadosObjs.push(vm.datosTabla.datos[i]);
                    } else {
                        vm.marcados.splice(indice, 1);
                        marcadosObjs.splice(indice, 1);
                    }
                };

                vm.checkAll = function (flag) {
                    /*  Descripción: Función que controla el flag que permite marcar o desmarcar todas las filas de la tabla presentada en el html.
                        Entrada: flag: parámetro que indica si se va a marcar o desmarcar.
                        Salida: NA  */
                    vm.adminInvolucradosCUTPA.miembrosCUTPA.forEach(function (item, index) {
                        if (flag)
                            item.eliminar = true;
                        else
                            item.eliminar = false;
                    });
                };

                vm.eliminarSeleccion = function () {

                    var confirmarEliminarSeleccion = function () {

                        var seleccionado = false;
                        $rootScope.$emit("alertEvent", {
                            "show": false
                        });
                        for (var i = 0; i < vm.adminInvolucradosCUTPA.miembrosCUTPA.length; i++) {
                            if (vm.adminInvolucradosCUTPA.miembrosCUTPA[i].eliminar) {
                                seleccionado = true;
                                break;
                            }
                        }
                        if (seleccionado) {
                            for (var i = 0; i < vm.adminInvolucradosCUTPA.miembrosCUTPA.length; i++) {
                                if (vm.adminInvolucradosCUTPA.miembrosCUTPA[i].eliminar) {
                                    if (vm.adminInvolucradosCUTPA.miembrosCUTPA[i].accion == "I") {
                                        vm.adminInvolucradosCUTPA.miembrosCUTPA.splice(i, 1);
                                        i--;
                                    } else {
                                        vm.adminInvolucradosCUTPA.miembrosCUTPA[i].accion = "D";
                                    }
                                }
                            }
                            vm.checkAllFlag = false;
                        } else {
                            var result = {
                                status: MENSAJES.TIPO.WARNING,
                                data: {
                                    descripcionError: MENSAJES.CUTPA.ELIMINAR_MIEMBROS.NO_SELECCION
                                }
                            };
                            businessAdminServiciosComunes.showAlert(result);
                        }
                    };

                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    $rootScope.$emit("gaModalEvent", {
                        "title": MENSAJES.CUTPA.ELIMINAR_MIEMBROS.TITULO,
                        "msg": MENSAJES.CUTPA.ELIMINAR_MIEMBROS.ALERT,
                        "button1Action": confirmarEliminarSeleccion
                    });
                };




                vm.eliminarCUTPA = function () {
                    var confirmacionEliminarCUTPA = function () {
                        $rootScope.$emit("alertEvent", {
                            "show": false
                        });
                        vm.progressbar.start();
                        businessAdminFactory.postData(constantes.endpoints.eliminarCUTPA, vm.adminInvolucradosCUTPA)
                            .then(
                                function (result) {
                                    vm.progressbar.complete();
                                    $window.sessionStorage.removeItem("involucradoPadre")
                                    vm.adminInvolucradosCUTPA = {
                                        involucradoPadre: {},
                                        miembrosCUTPA: []
                                    };
                                    $location.path("/gestionCUTPA/");
                                },
                                function (error) {
                                    vm.progressbar.complete();
                                    businessAdminServiciosComunes.showAlert(error);
                                }
                            );
                    };

            		$rootScope.$emit("gaModalEvent", {
                        "title": MENSAJES.CUTPA.ELIMINAR.TITULO,
                        "msg": MENSAJES.CUTPA.ELIMINAR.MENSAJE.replace("{{nombreFig}}", vm.adminInvolucradosCUTPA.involucradoPadre.nombreRazonSocial),
                        "button1Action": confirmacionEliminarCUTPA
                    });
                };

                vm.consultarMiembros = function () {
                    businessAdminFactory.getData(constantes.endpoints.buscarMiembrosCUTPA + vm.adminInvolucradosCUTPA.involucradoPadre.idInvolucrado, constantes.noCache)
                        .then(
                            function (result) {
                                vm.adminInvolucradosCUTPA.miembrosCUTPA = result.data.datos;
                                if (involucrados !== null) {
                                    for (var i in involucrados) {
                                        vm.adminInvolucradosCUTPA.miembrosCUTPA.push({
                                            involucrado: involucrados[i],
                                            accion: "I"
                                        });
                                    }
                                }
                            },
                            function (error) {
                                vm.adminInvolucradosCUTPA.miembrosCUTPA = [];
                            }
                        );

                }
                vm.doSort = function (propName) {
                    vm.sortBy = propName;
                    vm.reverse = !vm.reverse;
                };

                vm.setClickedRow = function (index) {
                    vm.selectedRow = index;
                }

                vm.setClickedRow = function (index) {
                    vm.selectedRow = index;
                }

                vm.salir = function(flag){
                    $window.sessionStorage.removeItem("involucradoPadre");
                    $window.sessionStorage.removeItem("involucradosDataMarcados");
                    if (flag) {
                        $rootScope.$emit("alertEvent", {"show": false});
                    }
                    $location.path(constantes.url.gestionCUTPA);
                };

                vm.cargarFiguraConsultada = function () {
                    /**Se carga la informacion de la figura de agrupamiento*/
                    vm.adminInvolucradosCUTPA.involucradoPadre = JSON.parse($window.sessionStorage.getItem("involucradoPadre"));

                    $window.sessionStorage.removeItem("involucradoPadre");

                    if (vm.adminInvolucradosCUTPA.involucradoPadre) {
                        /**Se carga la informacion de los involucrados como miembros de un agrupamiento*/
                        var involucrados = JSON.parse($window.sessionStorage.getItem("involucradosDataMarcados"));
                        if (involucrados !== null && involucrados !== undefined) {
                            vm.adminInvolucradosCUTPA.miembrosCUTPA = involucrados;
                        }
                        $window.sessionStorage.removeItem("involucradosDataMarcados");
                        vm.cambioTipoAgrupamiento();
                        vm.cambioFiduciaria();

                        if (vm.adminInvolucradosCUTPA.involucradoPadre != null && vm.adminInvolucradosCUTPA.involucradoPadre.idInvolucrado !== null &&
                            vm.adminInvolucradosCUTPA.miembrosCUTPA.length == 0) {
                            businessAdminFactory.getData(constantes.endpoints.buscarMiembrosCUTPA + vm.adminInvolucradosCUTPA.involucradoPadre.idInvolucrado, constantes.noCache)
                                .then(
                                    function (result) {
                                        vm.adminInvolucradosCUTPA.miembrosCUTPA = result.data.datos;

                                    },
                                    function (error) {}
                                );
                        }
                    }
                };

                vm.validarBtnActualizarDatosPA = function () {
                /*  Descripción: Función asociada al ng-show del botón actualizarDatosPA. Este se presenta solamente cuando el tipo de agrupamiento es PA, el número de identificación es vacío y la fiduciaría es temporal.
                    Entrada: NA
                    Salida: Boolean resultado de la validación.  */
                    var respuesta = false;
                    if (vm.adminInvolucradosCUTPA && vm.adminInvolucradosCUTPA.involucradoPadre && vm.adminInvolucradosCUTPA.involucradoPadre.tipoPersonaJuridica) {
                        if (vm.adminInvolucradosCUTPA.involucradoPadre.tipoPersonaJuridica.codigoParametro == constantes.codParametroPatrimonio && vm.adminInvolucradosCUTPA.involucradoPadre.fiduciaria.codigoParametro == constantes.codParametroFiducTemporal && (vm.adminInvolucradosCUTPA.involucradoPadre.numIdentificInvolucrado == null || vm.adminInvolucradosCUTPA.involucradoPadre.numIdentificInvolucrado == "")) {
                            respuesta = true;
                        }
                    }
                    return respuesta; 
                };

                vm.actualizarDatosPA = function () {
                /*  Descripción: Función asociada al ng-click del botón actualizarDatosPA. Se ocultan mensajes de error si los hay.
                    Entrada: NA
                    Salida: NA.  */
                    $rootScope.$emit("alertEvent", {
                            "show": false
                        });
                    vm.showModalError = false;
                    vm.showModalInfo = false;
                    vm.actualizarBtn = true;
                    vm.modalTipoIdentificacion = vm.adminInvolucradosCUTPA.involucradoPadre.tipoIdentInvlucrado;
                    vm.modalNumIdentificacion = vm.adminInvolucradosCUTPA.involucradoPadre.numIdentificInvolucrado;
                    vm.modalFiduciaria = vm.adminInvolucradosCUTPA.involucradoPadre.fiduciaria;
                };

                var aplicarCambiosActualizarDatosPA = function (object) {
                /*  Descripción: Función que actualiza los datos de la figura de agrupamiento con la información dada por el CRM.
                    Entrada: object: Objeto con la información de la composición accionaria de CRM.
                    Salida: NA.  */
                    if (object.mensaje) {
                        vm.adminInvolucradosCUTPA.involucradoPadre.nombreRazonSocial = object.mensaje;
                    } 
                    vm.adminInvolucradosCUTPA.involucradoPadre.tipoIdentInvlucrado = vm.modalTipoIdentificacion;
                    vm.adminInvolucradosCUTPA.involucradoPadre.numIdentificInvolucrado = vm.modalNumIdentificacion;
                    vm.adminInvolucradosCUTPA.involucradoPadre.fiduciaria = vm.modalFiduciaria;
                    if (vm.adminInvolucradosCUTPA.miembrosCUTPA && vm.adminInvolucradosCUTPA.miembrosCUTPA.length > 0) {
                        vm.adminInvolucradosCUTPA.miembrosCUTPA.forEach(function(item){
                            item.accion = constantes.accionServiciosRest.eliminar;
                        });
                    } else {
                        vm.adminInvolucradosCUTPA.miembrosCUTPA = [];
                    }
                    vm.adminInvolucradosCUTPA.miembrosCUTPA = vm.adminInvolucradosCUTPA.miembrosCUTPA.concat(object.datos);
                    $('#myModal').modal('hide');
                };

                vm.validarCambiosActualizarDatosPA = function () {
                /*  Descripción: Función asociada al ng-click del botón Actualizar de la funcionalidad actualizarDatosPA. Si las validaciones pasan, se presenta confirmación al usuario.
                    Entrada: NA
                    Salida: NA.  */
                    vm.showModalError = false;
                    if (vm.modalFiduciaria.codigoParametro == constantes.codParametroFiducTemporal) {
                        vm.showModalError = true;
                        vm.mensajeModalError = MENSAJES.CUTPA.ACTUALIZAR_PA.VALIDACION.FIDUCIARIA_TEMP.replace("{pa_temporal}", vm.adminInvolucradosCUTPA.involucradoPadre.fiduciaria.descripcion);
                    } else {
                        vm.actualizarBtn = false;
                        vm.showModalInfo = true;
                        vm.mensajeModalInfo = MENSAJES.CUTPA.ACTUALIZAR_PA.VALIDACION.CONFIRMACION;
                    }

                };

                vm.aceptarCambiosActualizarDatosPA = function () {
                /*  Descripción: Función asociada al ng-click del botón Aceptar de la funcionalidad actualizarDatosPA. Se actualizan los datos del modal sobre el modelo de negocio.
                    Entrada: NA
                    Salida: NA.  */
                    vm.showModalError = false;
                    vm.showModalInfo = false;
                    if (!vm.modalLoading) {
                        vm.modalLoading = true;
                        businessAdminFactory.getData(constantes.endpoints.validacionFiguraAgrup + vm.adminInvolucradosCUTPA.involucradoPadre.tipoPersonaJuridica.idLista + constantes.separador + vm.modalTipoIdentificacion.idLista + constantes.separador + vm.modalNumIdentificacion, constantes.noCache)
                        .then(
                            function (result) {
                                aplicarCambiosActualizarDatosPA(result.data);
                                vm.modalLoading = false;
                            },
                            function (error) {
                                vm.modalLoading = false;
                                vm.mensajeModalError = error.data.descripcionError;
                                vm.showModalError = true;
                                vm.actualizarBtn = true;
                            }
                        );
                    }
                };

                vm.cancelarActualizarDatosPA = function () {
                /*  Descripción: Función asociada al ng-click del botón Cancelar de la funcionalidad actualizarDatosPA. Se activa el botón actualizar.
                    Entrada: NA
                    Salida: NA.  */
                    vm.actualizarBtn = true;
                    vm.showModalError = false;
                    vm.showModalInfo = false;
                };

                $rootScope.$emit('menuEvent', true);

                vm.cargarFiguraConsultada();
            }
        ]);

})();