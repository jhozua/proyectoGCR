(function () {
    angular.module('adminBusinessModule')
        .controller('administrarCUTPAController', ['$rootScope', '$scope', '$location', 'businessAdminFactory', "$window", "businessAdminServiciosComunes", 'ngProgressFactory', 'constantes',
            function ($rootScope, $scope, $location, businessAdminFactory, $window, businessAdminServiciosComunes, ngProgressFactory, constantes) {

                var vm = this;
                vm.tableColumns = {
                    involucrado: [{
                            label: "Tipo agrupamiento",
                            property: "tipoPersonaJuridica",
                            subProperty: "descripcion"
                        },
                        {
                            label: "Tipo identificación",
                            property: "tipoIdentInvlucrado",
                            subProperty: "descripcion"
                        },
                        {
                            label: "No. identificación",
                            property: "numIdentificInvolucrado"
                        },
                        {
                            label: "Dígito ver.",
                            property: "digitoVerificacionInvolucr"
                        },
                        {
                            label: "Fiduciaria",
                            property: "fiduciaria",
                            subProperty: "descripcion"
                        },
                        {
                            label: "Consecutivo",
                            property: "consecutivoPatrimonioAut",
                            consecutivo : true
                        },
                        {
                            label: "Nombre",
                            property: "nombreRazonSocial"
                        },
                        {
                            label: "Editar"
                        }
                    ]
                };
                vm.paginasInvolucrados = {};
                vm.tipoPatrimonio = constantes.codParametroPatrimonio;
                vm.filtroTipoAgrup = '';
                vm.codigoParamEmpresa = constantes.codigoParamEmpresa;

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
                            vm.listaTiposAgrupamientos = result.data.datos;
                            vm.progressbar.complete();
                        },
                        function (error) {
                            vm.progressbar.complete();
                        }
                    );

                vm.consultarInvolucradoFiltro = function (pagina) {
                    if (pagina === undefined) {
                        if (vm.paginasInvolucrados.paginaActual !== undefined || vm.paginasInvolucrados.paginaActual !== null)
                            pagina = vm.paginasInvolucrados.paginaActual;
                        else
                            pagina = 1;
                    }
                    vm.progressbar.start();
                    businessAdminFactory.getData(constantes.endpoints.buscarInvolucradoFiltro.replace("{tipoagrup}", vm.filtroTipoAgrup || "").replace("{tipodoc}", vm.filtroTipodoc || "").replace("{numdoc}", vm.filtroNumdoc || "")
                            .replace("{consec}", vm.filtroConsec || "").replace("{nombre}", vm.filtroNombre || "").replace("{fiduc}", vm.filtroFiduc || ""), constantes.noCache, pagina)
                        .then(
                            function (result) {
                                vm.datosTabla = result.data;
                                vm.paginasInvolucrados = businessAdminServiciosComunes.calcularPaginas(result.data);
                                vm.progressbar.complete();
                            },
                            function (error) {
                                vm.datosTabla = {};
                                businessAdminServiciosComunes.showAlert(error);
                                vm.progressbar.complete();
                            }
                        );
                };

                vm.paginaSeleccionada = function (pagina, accion) {
                    var existePag;
                    var buscaPag;
                    if (accion == constantes.accionPaginacion.siguiente) {
                        buscaPag = vm.paginasInvolucrados.paginaActual + 1;
                        existePag = vm.paginasInvolucrados.arrayTotalPaginas.indexOf(buscaPag);
                        if (existePag >= 0)
                            vm.consultarInvolucradoFiltro(buscaPag);
                    } else if (accion == constantes.accionPaginacion.anterior) {
                        buscaPag = vm.paginasInvolucrados.paginaActual - 1;
                        existePag = vm.paginasInvolucrados.arrayTotalPaginas.indexOf(buscaPag);
                        if (existePag >= 0)
                            vm.consultarInvolucradoFiltro(buscaPag);
                    } else {
                        if (pagina != vm.paginasInvolucrados.paginaActual)
                            vm.consultarInvolucradoFiltro(pagina);
                    }
                };

                vm.doSort = function (propName, subPropName) {
                    if (propName != undefined) {
                        if (subPropName != undefined) {
                            vm.sortBy = propName + "." + subPropName;
                        } else {
                            vm.sortBy = propName;
                        }
                        vm.reverse = !vm.reverse;
                    }
                };

                vm.cambiarTipo = function () {
                    if (vm.filtroTipoAgrup != vm.tipoPatrimonio){
                        vm.filtroConsec = "";
                    }
                };

                vm.irEdicionCUTPA = function (inv) {
                    $window.sessionStorage.setItem("involucradoPadre", angular.toJson(inv));
                    $location.path(constantes.url.editarCUTPA);

                };

                vm.crearCUTPA = function () {
                    $location.path(constantes.url.crearCUTPA);
                };

                vm.salirMenu = function () {
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