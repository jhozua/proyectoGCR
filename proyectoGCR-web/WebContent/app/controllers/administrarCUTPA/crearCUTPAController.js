(function () {
	angular.module('adminBusinessModule')
      .controller('crearCUTPAController', ['$scope', '$rootScope', '$location', '$routeParams', 'businessAdminFactory', "$filter", "$window", "businessAdminServiciosComunes", 'ngProgressFactory', 'MENSAJES', 'constantes',
      		function($scope, $rootScope, $location, $routeParams, businessAdminFactory, $filter, $window, businessAdminServiciosComunes, ngProgressFactory, MENSAJES, constantes) {
        
                var vm = this;
                $rootScope.$emit("alertEvent", {"show": false});
                vm.selectedRow = null;
                vm.activarFiduciaria = false;
                vm.obligatoriedadNumero = true;
                vm.codigoParamEmpresa = constantes.codigoParamEmpresa;
                vm.checkAllFlag = false;

                vm.marcados = [];
                vm.adminInvolucradosCUTPA = {miembrosCUTPA: []};
                /* Variable que indica si el servicio de consulta al CRM permite la creación de un nuevo CUTPA
                    Si ya existe en el CRM o la parametría indica que el tipo de agrupamiento se puede crear, se le permite al usuario,
                    De lo contrario, se muestra el mensaje de error */
                vm.puedeCrearCRM = false;
                vm.consultoCRM = false;
                vm.puedeConsultarCRM = true;
                var flag = $window.sessionStorage.getItem("boolPuedeCrear");
                if (flag != undefined && flag != null) vm.puedeCrearCRM = (flag == "true");
                flag = $window.sessionStorage.getItem("boolPuedeConsultar");
                if (flag != undefined && flag != null) vm.puedeConsultarCRM = (flag == "true");
                flag = $window.sessionStorage.getItem("boolConsultoCRM");
                if (flag != undefined && flag != null) vm.consultoCRM = (flag == "true");
                flag = $window.sessionStorage.getItem("boolActivarFiduc");
                if (flag != undefined && flag != null) vm.activarFiduciaria = (flag == "true");

                /**Se carga la informacion de la figura de agrupamiento*/
                var objInvolucrado = JSON.parse($window.sessionStorage.getItem("involucradoPadre"));
                $window.sessionStorage.removeItem("involucradoPadre");

                vm.adminInvolucradosCUTPA.involucradoPadre = objInvolucrado === null ? {} : objInvolucrado;


                /**Se carga la informacion de los involucrados como miembros de un agrupamiento*/
                var involucrados = JSON.parse($window.sessionStorage.getItem("involucradosDataMarcados"));
                if (involucrados !== null && involucrados !== undefined) {
                    vm.adminInvolucradosCUTPA.miembrosCUTPA = involucrados;
                }
                $window.sessionStorage.removeItem("involucradosDataMarcados");

                vm.progressbar = ngProgressFactory.createInstance();
                vm.progressbar.setHeight(constantes.progressBar.height);
                vm.progressbar.setColor(constantes.progressBar.color);

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
                            vm.listaTipoAgrupamiento = result.data.datos;
                        },
                        function (error) {}
                    );

                vm.cambioTipoAgrupamiento = function () {
                    if (vm.adminInvolucradosCUTPA.involucradoPadre.tipoPersonaJuridica.codigoParametro == constantes.codParametroPatrimonio) {
                        vm.activarFiduciaria = true;
                    } else {
                        vm.activarFiduciaria = false;
                        delete vm.adminInvolucradosCUTPA.involucradoPadre.fiduciaria;
                    }
                };

                vm.cambioFiduciaria = function () {
                    if (vm.adminInvolucradosCUTPA.involucradoPadre.fiduciaria.codigoParametro == constantes.codParametroFiducTemporal) {
                        vm.obligatoriedadNumero = false;
                        vm.puedeConsultarCRM = false;
                        vm.puedeCrearCRM = true;

                    } else {
                        vm.obligatoriedadNumero = true;
                        vm.puedeConsultarCRM = true;
                        vm.puedeCrearCRM = vm.consultoCRM;
                    }
                };

                vm.consultarEnCRM = function () {
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    vm.progressbar.start();
                    var error = {};
                    if (vm.adminInvolucradosCUTPA.involucradoPadre.tipoPersonaJuridica === undefined ||
                        vm.adminInvolucradosCUTPA.involucradoPadre.tipoPersonaJuridica.idListaProceso === undefined ||
                        vm.adminInvolucradosCUTPA.involucradoPadre.tipoIdentInvlucrado == undefined ||
                        vm.adminInvolucradosCUTPA.involucradoPadre.tipoIdentInvlucrado.idListaProceso === undefined ||
                        (vm.obligatoriedadNumero && (vm.adminInvolucradosCUTPA.involucradoPadre.numIdentificInvolucrado === undefined ||
                            vm.adminInvolucradosCUTPA.involucradoPadre.numIdentificInvolucrado == ""))
                    ) {
                        error.status = MENSAJES.TIPO.PRECONDITION;
                        error.data = {};
                        error.data.descripcionError = MENSAJES.CUTPA.CONSULTAR.CAMPOS_INCOMPLETOS;
                        businessAdminServiciosComunes.showAlert(error);
                        vm.progressbar.complete();
                    } else {
                        businessAdminFactory.getData(constantes.endpoints.buscarInvolucradoCRM + vm.adminInvolucradosCUTPA.involucradoPadre.tipoIdentInvlucrado.idListaProceso +
                                constantes.separador + vm.adminInvolucradosCUTPA.involucradoPadre.numIdentificInvolucrado +
                                constantes.separador + vm.adminInvolucradosCUTPA.involucradoPadre.tipoPersonaJuridica.idListaProceso, constantes.noCache)
                            .then(
                                function (result) {
                                    vm.progressbar.complete();
                                    vm.consultoCRM = true;
                                    vm.puedeCrearCRM = true;
                                    vm.adminInvolucradosCUTPA.involucradoPadre.nombreRazonSocial = result.data.mensaje;
                                    vm.adminInvolucradosCUTPA.miembrosCUTPA = result.data.datos;
                                    result.data.mensaje = MENSAJES.CUTPA.CONSULTAR.EXITO;
                                    businessAdminServiciosComunes.showAlert(result);
                                },
                                function (error) {
                                    vm.progressbar.complete();
                                    if (error.status == MENSAJES.TIPO.INFO) {
                                        error.data.descripcionError = MENSAJES.CUTPA.CONSULTAR.PUEDE_CREAR;
                                        vm.puedeCrearCRM = true;
                                        vm.consultoCRM = true;
                                    } else {
                                        vm.puedeCrearCRM = false;
                                        vm.consultoCRM = false;
                                    }
                                    businessAdminServiciosComunes.showAlert(error);
                                }
                            );
                    }
                };

                vm.crearAgrupamientoCUTPA = function (valid) {
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    vm.formEnviado = true;
                    if (valid) {
                        if (vm.porcentajesValidos()) {
                            vm.progressbar.start();
                            businessAdminFactory.putData(constantes.endpoints.crearCUTPA, vm.adminInvolucradosCUTPA)
                                .then(
                                    function (result) {
                                        vm.progressbar.complete();
                                        vm.salir();
                                        var alertObject = {
                                            data: {
                                                mensaje: MENSAJES.CUTPA.CREAR.EXITO
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
                            var error = {};
                            error.status = MENSAJES.TIPO.PRECONDITION;
                            error.data = {};
                            error.data.descripcionError = MENSAJES.CUTPA.CREAR.ERROR_PCT_PART;
                            businessAdminServiciosComunes.showAlert(error);
                        }

                    } else {
                        var error = {};
                        error.status = MENSAJES.TIPO.PRECONDITION;
                        error.data = {};
                        error.data.descripcionError = MENSAJES.CUTPA.CREAR.ERROR;
                        businessAdminServiciosComunes.showAlert(error);
                    }
                };

                vm.porcentajesValidos = function () {
                    var faltanPorcentajes = false;
                    var suma = 0;
                    if (vm.adminInvolucradosCUTPA.miembrosCUTPA.length > 0) {
                        vm.adminInvolucradosCUTPA.miembrosCUTPA.forEach(function (item) {
                            if (!businessAdminServiciosComunes.checkUndefined(item.porcentajeParticipacion)) {
                                faltanPorcentajes = true;
                            } else {
                                suma += Number(item.porcentajeParticipacion);
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
                    $window.sessionStorage.setItem("urlRetorno", constantes.url.crearCUTPA);
                    $window.sessionStorage.setItem("boolPuedeCrear", vm.puedeCrearCRM);
                    $window.sessionStorage.setItem("boolPuedeConsultar", vm.puedeConsultarCRM);
                    $window.sessionStorage.setItem("boolConsultoCRM", vm.consultoCRM);
                    $window.sessionStorage.setItem("boolActivarFiduc", vm.activarFiduciaria);
                    $location.path(constantes.url.agregarEmpresas);
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

                var confirmarEliminarSeleccion = function () {
                    vm.adminInvolucradosCUTPA.miembrosCUTPA = $filter('filter')(
                        vm.adminInvolucradosCUTPA.miembrosCUTPA,
                        function (item) {
                            return !item.eliminar;
                        });
                    vm.checkAllFlag = false;
                };

                vm.eliminarSeleccion = function () {
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    $rootScope.$emit("gaModalEvent", {
                        "title": MENSAJES.CUTPA.ELIMINAR_MIEMBROS.TITULO,
                        "msg": MENSAJES.CUTPA.ELIMINAR_MIEMBROS.ALERT_CREAR,
                        "button1Action": confirmarEliminarSeleccion
                    });
                };

                vm.doSort = function (propName) {
                    vm.sortBy = propName;
                    vm.reverse = !vm.reverse;
                };

                vm.salir = function (flag) {
                    $window.sessionStorage.removeItem("involucradoPadre");
                    $window.sessionStorage.removeItem("boolPuedeCrear");
                    $window.sessionStorage.removeItem("boolPuedeConsultar");
                    $window.sessionStorage.removeItem("boolConsultoCRM");
                    $window.sessionStorage.removeItem("boolActivarFiduc");
                    if (flag) {
                        $rootScope.$emit("alertEvent", {
                            "show": false
                        });
                    }
                    $location.path(constantes.url.gestionCUTPA);
                };

                $rootScope.$emit('menuEvent', true);

            }
        ]);

})();