/*

** Autor: Ivan Esparragoza
** Empresa: IBM
** Fecha: 2 Enero 2016
** Archivo: administrarPlantillasController.js
** Descripción: Archivo JS en el que se define la funcionalidad del controlador "AdministrarPlantillaController" asociado al html "administrarPlantillas.html".

*/

(function () {
    angular.module('adminBusinessModule')
        .controller('administrarPlantillasController', ['$window', '$rootScope', '$location', '$scope', 'businessAdminFactory', 'businessAdminServiciosComunes', 'ngProgressFactory','MENSAJES', 'constantes',
        function ($window, $rootScope, $location, $scope, businessAdminFactory, businessAdminServiciosComunes, ngProgressFactory, MENSAJES, constantes) {

            /* Inicio Declaración variables */
            var vm = this;

            vm.tableColumns = {
                plantilla: [{
                    label: "Nombre",
                    property: "nombrePlantilla"
                }, {
                    label: "Segmento",
                    property: "listaNegocio",
                    subProperty: "descripcion"
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
            vm.paginasAdminPlantillas = {};
            /* Fin Declaración variables */

            /* Inicio Lógica Controlador (ejecutada al cargar este controlador) */
            vm.objVariables = JSON.parse($window.sessionStorage.getItem("flags"));
            vm.objPlantillas = $window.sessionStorage.getItem("objPlantillas");
            vm.progressbar = ngProgressFactory.createInstance();
            vm.progressbar.setHeight(constantes.progressBar.height);
            vm.progressbar.setColor(constantes.progressBar.color);

            if (vm.objVariables === null || vm.objVariables === undefined) {
                vm.variables = {
                    AlertaConsultarPlantilla: false,
                    showDetallePlantilla: false,
                    disabledConsultarPlantilla: true,
                    alertaConsultarPlantilla: false,
                    checkAllFlag: false,
                    flagCrearPlantilla: false
                };
            } else {
                vm.variables = vm.objVariables;
            }

            if (vm.objPlantillas !== null && vm.objPlantillas !== "undefined") {
                vm.tableData = JSON.parse(vm.objPlantillas);
            }

            /* Fin Lógica Controlador (ejecutada al cargar este controlador) */

            /* Inicio Sección Funciones Controlador */
            vm.consultarPlantillas = function (nombrePlantilla, pagina) {
                /*  Descripción: Función que permite realizar la consulta de los plantillas existentes en el sistema consumiendo un servicio REST. 
                    Entrada: Nombre de Plantilla: parámetro que se envía en el consumo del servicio.
                    Salida: NA  */

                $rootScope.$emit("alertEvent", {
                    "show": false
                });
                vm.tableData = "";
                vm.variables.alertaConsultarPlantilla = false;
                if (nombrePlantilla === undefined)
                    nombrePlantilla = "";
                if (pagina === undefined) {
                    if (vm.paginasAdminPlantillas.paginaActual !== undefined || vm.paginasAdminPlantillas.paginaActual !== null)
                        pagina = vm.paginasAdminPlantillas.paginaActual;
                    else
                        pagina = 1;
                }
                vm.progressbar.start();
                vm.variables.alertaConsultarPlantilla = false;
                businessAdminFactory.getData(constantes.endpoints.consultarPlantillas + nombrePlantilla, constantes.noCache, pagina)
                    .then(
                        function (result) {
                            vm.variables.showDetallePlantilla = false;
                            vm.variables.disabledConsultarPlantilla = true;
                            vm.tableData = result.data;
                            vm.paginasAdminPlantillas = businessAdminServiciosComunes.calcularPaginas(vm.tableData);
                            vm.variables.disabledConsultarPlantilla = true;
                            $window.sessionStorage.setItem("objPlantillas", angular.toJson(vm.tableData));
                            $window.sessionStorage.setItem("flags", angular.toJson(vm.variables));
                            $window.sessionStorage.setItem("objPaginasAdminPlantillas", angular.toJson(vm.paginasAdminPlantillas));
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

            vm.salirAdminPlantillas = function () {
                /*  Descripción: Función que permite salir del módulo de Administración de Plantillas.
                    Entrada: NA
                    Salida: NA  */
                $window.sessionStorage.clear();
            };


            vm.crearPlantilla = function () {
                //$window.sessionStorage.setItem("urlRetorno", "/administrarPlantillas/");
                $rootScope.$emit("alertEvent", {
                    "show": false
                });
                $location.path(constantes.url.crearPlantilla);
            };

            vm.editarPlantilla = function (data) {
                $window.sessionStorage.setItem("itemDatoPlantilla", angular.toJson(data))
                $location.path(constantes.url.editarPlantilla);
            };

            vm.eliminarPlantilla = function () {
                var button1Fn = function () {
                    for (var i = 0; i < vm.tableData.datos.length; i++) {
                        if (vm.tableData.datos[i].selected) {

                            vm.tableData.datos[i].deleted = true;
                            vm.tableData.datos[i].accion = "D";

                        }
                    }
                };
                $rootScope.$emit("gaModalEvent", {
                    "title": MENSAJES.PLANTILLAS.ELIMINAR.TITULO_CONFIRMAR_ELIMINAR,
                    "msg": MENSAJES.PLANTILLAS.ELIMINAR.CONFIRMAR_ELIMINAR,
                    "button1Action": button1Fn,
                    "button1Text": MENSAJES.BOTON_CONFIRMACION.SI,
                    "button2Text": MENSAJES.BOTON_CONFIRMACION.NO
                });
            };


            vm.guardarEliminarPlantillas = function () {
                $rootScope.$emit("alertEvent", {
                    "show": false
                });

                businessAdminFactory.deleteData(constantes.endpoints.eliminarPlantillas, vm.tableData.datos)
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

            vm.irPlantillas = function () {
                $rootScope.$emit("alertEvent", {
                    "show": false
                });
                vm.variables.showDetallePlantilla = false;
                vm.consultarPlantillas();
            };

            vm.salirMenu = function(){
                $rootScope.$emit("alertEvent", {"show": false});
                $window.sessionStorage.clear();
                $location.path(constantes.url.main);
            };

            $rootScope.$emit('menuEvent', true);

            /* Fin Sección Funciones Controlador */
        }]);
})();