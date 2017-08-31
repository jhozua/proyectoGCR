/*
** Autor: Daniel Rodríguez
** Empresa: IBM
** Fecha: 11 Enero 2017
** Archivo: consultarPCGrupoController.js
** Descripción: Archivo JS en el que se define la funcionalidad del controlador "consultarPCGrupoController" asociado al html "consultarPCGrupo.html".
*/
(function () {
    "use strict";
    angular.module('adminBusinessModule')
        .controller('consultarPCGrupoController', ['$scope', '$timeout', '$window', '$rootScope', '$location', 'businessAdminFactory', 'businessAdminServiciosComunes', 'ngProgressFactory', 'constantes', function ($scope, $timeout, $window, $rootScope, $location, businessAdminFactory, businessAdminServiciosComunes, ngProgressFactory, constantes) {

            /* Inicio Declaración variables */
            var vm = this;
            vm.path = "app/directives";
            /* Fin Declaración variables */

            /* Inicio Sección Funciones Controlador */
            vm.atrasConsultarCliente = function () {
                /*  Descripción: Función que permite navegar a la página anterior.
                    Entrada: NA
                    Salida: NA  */
                $window.sessionStorage.removeItem("objArbolPCGrupo");
                $location.path(constantes.url.consultarCliente);
            };

            vm.treeTablecallFunction = function () {
                /*  Descripción: Función que es invocada desde el componente treeTable.
                    Entrada: NA
                    Salida: NA  */
            };
            /* Fin Sección Funciones Controlador */

            /* Inicio Lógica Controlador (ejecutada al cargar este controlador) */
            vm.progressbar = ngProgressFactory.createInstance();
            vm.progressbar.setHeight(constantes.progressBar.height);
            vm.progressbar.setColor(constantes.progressBar.color);
            $rootScope.$emit("alertEvent", {"show": false});
            var objArbolPCGrupo = $window.sessionStorage.getItem("objArbolPCGrupo");
            var objParamsConsulta = $window.sessionStorage.getItem("objParamsConsulta");

            vm.arbolPCGrupo = businessAdminServiciosComunes.checkUndefined(objArbolPCGrupo) ? JSON.parse(objArbolPCGrupo) : false;
            vm.paramsConsulta = businessAdminServiciosComunes.checkUndefined(objParamsConsulta) ? JSON.parse(objParamsConsulta) : false;

            if (!vm.arbolPCGrupo) {
                if (vm.paramsConsulta) {
                    vm.progressbar.start();
                    businessAdminFactory.getData(constantes.endpoints.consultarGrupoPC + constantes.separador + vm.paramsConsulta.numIdentificacion + constantes.separador + vm.paramsConsulta.tipoIdentificacion.codigoParametro, constantes.noCache)
                        .then(
                            function (result) {
                                vm.progressbar.complete();
                                $rootScope.$emit("alertEvent", {"show": false});
                                if (result.data.datos.length > 0) {
                                    vm.arbolPCGrupo = result.data.datos[0];
                                    vm.paramsFunction = {"id": "treeDataLoad", "params": vm.arbolPCGrupo};
                                    $timeout(function () {
                                        vm.callFunction(vm.paramsFunction);
                                    }, 0);
                                } else {
                                    $location.path(constantes.url.consultarCliente);
                                }
                            },
                            function (error) {
                                vm.progressbar.complete();
                                console.log("Error en la consulta: " + JSON.stringify(error));
                                businessAdminServiciosComunes.showAlert(error);
                            }
                        );
                } else {
                    $location.path(constantes.url.consultarCliente);
                }
            } else {
                $window.sessionStorage.removeItem("objArbolPCGrupo");
                vm.paramsFunction = {"id": "treeDataLoad", "params": vm.arbolPCGrupo};
                $timeout(function () {
                    vm.callFunction(vm.paramsFunction);
                }, 0);
            }

            $rootScope.$emit('menuEvent', true);
            /* Fin Lógica Controlador (ejecutada al cargar este controlador) */
      }]);
})();