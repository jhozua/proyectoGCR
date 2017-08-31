/*

** Autor: Jhonatan Zuluaga
** Empresa: IBM
** Fecha: 11 Agosto 2017
** Archivo: administrarGruposController.js
** Descripción: Archivo JS en el que se define la funcionalidad del controlador "AdministrarGruposController" asociado al html "administrarGrupos.html".

*/

(function () {
    angular.module('adminBusinessModule')
        .controller('administrarGruposSeguridadController', ['$window', '$rootScope', '$location', '$scope', 'businessAdminFactory', 'businessAdminServiciosComunes', 'ngProgressFactory','MENSAJES', 'constantes',
        function ($window, $rootScope, $location, $scope, businessAdminFactory, businessAdminServiciosComunes, ngProgressFactory, MENSAJES, constantes) {

            /* Inicio Declaración variables */
            var vm = this;

            vm.tableColumns = {
                grupo: [{
                    label: "Nombre",
                    property: "nombreGrupoSeguridad"
                }, {
                    label: "Consultar"
                }]
            };
            vm.accionesAlerta = {
                success: "success",
                error: "danger",
                info: "info",
                warning: "warning"
            };
            vm.paginasAdminGrupos = {};
            /* Fin Declaración variables */

            /* Inicio Lógica Controlador (ejecutada al cargar este controlador) */
            vm.objVariables = JSON.parse($window.sessionStorage.getItem("flags"));
            vm.objGrupos = $window.sessionStorage.getItem("objGrupos");
            vm.progressbar = ngProgressFactory.createInstance();
            vm.progressbar.setHeight(constantes.progressBar.height);
            vm.progressbar.setColor(constantes.progressBar.color);

            if (vm.objVariables === null || vm.objVariables === undefined) {
                vm.variables = {
                    AlertaConsultarGrupo: false,
                    showDetalleGrupo: false,
                    disabledConsultarGrupo: true,
                    alertaConsultarGrupo: false,
                    checkAllFlag: false,
                    flagCrearGrupo: false
                };
            } else {
                vm.variables = vm.objVariables;
            }

            if (vm.objGrupos !== null && vm.objGrupos !== "undefined") {
                vm.tableData = JSON.parse(vm.objGrupos);
            }

            /* Fin Lógica Controlador (ejecutada al cargar este controlador) */

            /* Inicio Sección Funciones Controlador */
            vm.consultarGruposSeguridad = function (nombreGrupo, pagina) {
                /*  Descripción: Función que permite realizar la consulta de los grupos existentes en el sistema consumiendo un servicio REST. 
                    Entrada: Nombre de Grupo: parámetro que se envía en el consumo del servicio.
                    Salida: NA  */

                $rootScope.$emit("alertEvent", {
                    "show": false
                });
                vm.tableData = "";
                vm.variables.alertaConsultarGrupo = false;
                if (nombreGrupo === undefined)
                    nombreGrupo = "";
                if (pagina === undefined) {
                    if (vm.paginasAdminGrupos.paginaActual !== undefined || vm.paginasAdminGrupos.paginaActual !== null)
                        pagina = vm.paginasAdminGrupos.paginaActual;
                    else
                        pagina = 1;
                }
                vm.progressbar.start();
                vm.variables.alertaConsultarGrupo = false;
                businessAdminFactory.getData(constantes.endpoints.consultarGruposSeguridad + nombreGrupo, constantes.noCache, pagina)
                    .then(
                        function (result) {
                            vm.variables.showDetalleGrupo = false;
                            vm.variables.disabledConsultarGrupo = true;
                            vm.tableData = result.data;
                            vm.paginasAdminGrupos = businessAdminServiciosComunes.calcularPaginas(vm.tableData);
                            vm.variables.disabledConsultarGrupo = true;
                            $window.sessionStorage.setItem("objGrupos", angular.toJson(vm.tableData));
                            $window.sessionStorage.setItem("flags", angular.toJson(vm.variables));
                            $window.sessionStorage.setItem("objPaginasAdminGrupos", angular.toJson(vm.paginasAdminGrupos));
                            vm.progressbar.complete();
                        },
                        function (error) {
                            vm.progressbar.complete();
                            businessAdminServiciosComunes.showAlert(error);
                        }
                    );
            };

            vm.doSort = function (propName, subPropName) {
                if (propName != undefined) {
                    if(subPropName != undefined){
                        vm.sortBy = propName+"."+subPropName;
                    }
                    else{
                        vm.sortBy = propName;
                    }
                    vm.reverse = !vm.reverse;
                }
            };

            vm.salirAdminGrupos = function () {
                /*  Descripción: Función que permite salir del módulo de Administración de Grupos.
                    Entrada: NA
                    Salida: NA  */
                $window.sessionStorage.clear();
            };


            vm.crearGrupoSeguridad = function () {
                //$window.sessionStorage.setItem("urlRetorno", "/administrarGrupos/");
                $rootScope.$emit("alertEvent", {
                    "show": false
                });
                $location.path(constantes.url.crearGrupoSeguridad);
            };

            vm.editarGrupoSeguridad = function (data) {
                $window.sessionStorage.setItem("itemDatoGrupo", angular.toJson(data))
                $location.path(constantes.url.editarGrupoSeguridad);
            };

            vm.eliminarGrupoSeguridad = function () {
                var button1Fn = function () {
                    for (var i = 0; i < vm.tableData.datos.length; i++) {
                        if (vm.tableData.datos[i].selected) {

                            vm.tableData.datos[i].deleted = true;
                            vm.tableData.datos[i].accion = "D";

                        }
                    }
                };
                $rootScope.$emit("gaModalEvent", {
                    "title": MENSAJES.GRUPOS_SEGURIDAD.ELIMINAR.TITULO_CONFIRMAR_ELIMINAR,
                    "msg": MENSAJES.GRUPOS_SEGURIDAD.ELIMINAR.CONFIRMAR_ELIMINAR,
                    "button1Action": button1Fn,
                    "button1Text": MENSAJES.BOTON_CONFIRMACION.SI,
                    "button2Text": MENSAJES.BOTON_CONFIRMACION.NO
                });
            };


            vm.guardarEliminarGruposSeguridad = function () {
                $rootScope.$emit("alertEvent", {
                    "show": false
                });

                businessAdminFactory.deleteData(constantes.endpoints.eliminarGrupoSeguridad, vm.tableData.datos)
                    .then(
                        function (result) {

                            businessAdminServiciosComunes.showAlert(result);
                            $window.sessionStorage.clear();

                        },
                        function (error) {
                            businessAdminServiciosComunes.showAlert(error);
                        }
                    );


            };

            vm.checkAll = function (flag) {
                /*  Descripción: Función que controla el flag que permite marcar o desmarcar todas las filas de la tabla presentada en el html.
                    Entrada: flag: parámetro que indica si se va a marcar o desmarcar.
                    Salida: NA  */
                vm.tableData.datos.forEach(function (item, index) {
                    if (flag)
                        item.selected = true;
                    else
                        item.selected = false;
                });
            };

            vm.irGrupos = function () {
                $rootScope.$emit("alertEvent", {
                    "show": false
                });
                vm.variables.showDetalleGrupo = false;
                vm.consultarGruposSeguridad();
            };

            vm.salirMenu = function(){
                $rootScope.$emit("alertEvent", {"show": false});
                $window.sessionStorage.clear();
                $location.path(constantes.url.main);
            };

            /* Fin Sección Funciones Controlador */
        }]);
})();