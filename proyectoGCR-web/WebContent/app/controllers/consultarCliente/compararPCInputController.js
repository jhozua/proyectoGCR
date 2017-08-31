/*
** Autor: Daniel Rodríguez
** Empresa: IBM
** Fecha: 31 Mayo 2017
** Archivo: compararPCInputController.js
** Descripción: Archivo JS en el que se define la funcionalidad del controlador "compararPCInputController" asociado al html "compararPCInput.html".
*/
(function () {
    "use strict";
    angular.module('adminBusinessModule')
        .controller('compararPCInputController', ['$timeout', '$window', '$rootScope', '$location', 'businessAdminFactory', 'businessAdminServiciosComunes', 'ngProgressFactory', 'constantes', function ($timeout, $window, $rootScope, $location, businessAdminFactory, businessAdminServiciosComunes, ngProgressFactory, constantes) {

            /* Inicio Declaración variables */
            var vm = this;
            vm.columnasSolicitud = [{
                label: "Tipo",
                property: "tipo"
            },
            {
                label: "Versión",
                property: "version"
            },
            {
                label: "Usuario Modificación",
                property: "ususarioMod"
            },
            {
                label: "Fecha Modificación",
                property: "fechaMod"
            }];

            vm.tableDataLeft = [{
                tipo: "DRAFT",
                version: "1.0",
                ususarioMod: "USERX",
                fechaMod: "05/04/2017"
            },
            {
                tipo: "DRAFT",
                version: "2.0",
                ususarioMod: "USERZ",
                fechaMod: "27/01/2017"
            }];

            vm.tableDataRight = [{
                tipo: "EN FIRME",
                version: "1.0",
                ususarioMod: "USERA",
                fechaMod: "05/04/2017"
            },
            {
                tipo: "DRAFT",
                version: "3.0",
                ususarioMod: "USERB",
                fechaMod: "27/01/2017"
            },
            {
                tipo: "EN FIRME",
                version: "2.0",
                ususarioMod: "USERA",
                fechaMod: "05/04/2017"
            },
            {
                tipo: "DRAFT",
                version: "4.0",
                ususarioMod: "USERB",
                fechaMod: "27/01/2017"
            }];

            vm.listaSolicitudesLeft = [{
                id: "1",
                numero: "001"
            },
            {
                id: "2",
                numero: "002"
            },
            {
                id: "3",
                numero: "003"
            }];

            vm.listaSolicitudesRight = [{
                id: "1",
                numero: "001"
            },
            {
                id: "2",
                numero: "002"
            },
            {
                id: "3",
                numero: "003"
            }];
            /* Fin Declaración variables */

            /* Inicio Sección Funciones Controlador */
            vm.atrasConsultarCliente = function () {
                /*  Descripción: Función que permite navegar a la página anterior.
                    Entrada: NA
                    Salida: NA  */
                $location.path(constantes.url.consultarCliente);
            };
            /* Fin Sección Funciones Controlador */

            /* Inicio Lógica Controlador (ejecutada al cargar este controlador) */
            vm.progressbar = ngProgressFactory.createInstance();
            vm.progressbar.setHeight(constantes.progressBar.height);
            vm.progressbar.setColor(constantes.progressBar.color);
            $rootScope.$emit("alertEvent", {"show": false});
            vm.paramsConsulta = JSON.parse($window.sessionStorage.getItem("objParamsConsulta"));
            vm.empresaPC = JSON.parse($window.sessionStorage.getItem("objEmpresaPC"));

            if (vm.empresaPC === null) {
                if (vm.paramsConsulta !== null) {
                    vm.progressbar.start();
                    businessAdminFactory.getData(constantes.endpoints.compararPCInput + vm.paramsConsulta.numIdentificacion + constantes.separador + vm.paramsConsulta.tipoIdentificacion.codigoParametro, constantes.noCache)
                        .then(
                            function (result) {
                                vm.progressbar.complete();
                                $rootScope.$emit("alertEvent", {"show": false});
                                vm.empresaPC = result.data.datos[0];
                            },
                            function (error) {
                                vm.progressbar.complete();
                                businessAdminServiciosComunes.showAlert(error);
                            }
                        );
                } else {
                    $location.path(constantes.url.consultarCliente);
                }
            } else {
                $window.sessionStorage.removeItem("objEmpresaPC");
            }

            $rootScope.$emit('menuEvent', true);
            /* Fin Lógica Controlador (ejecutada al cargar este controlador) */
        }]);
    })();