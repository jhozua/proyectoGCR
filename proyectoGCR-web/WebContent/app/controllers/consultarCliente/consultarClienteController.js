/*
** Autor: Daniel Rodríguez
** Empresa: IBM
** Fecha: 18 Enero 2017
** Archivo: consultarClienteController.js
** Descripción: Archivo JS en el que se define la funcionalidad del controlador "consultarClienteController" asociado al html "consultarPCGrupo.html".
*/
(function () {
    "use strict";
    angular.module('adminBusinessModule')
        .controller('consultarClienteController', ['$window', '$rootScope', '$location', 'businessAdminFactory', 'businessAdminServiciosComunes', 'ngProgressFactory', 'constantes', 'MENSAJES', function ($window, $rootScope, $location, businessAdminFactory, businessAdminServiciosComunes, ngProgressFactory, constantes, MENSAJES) {

            /* Inicio Declaración variables */
            var vm = this;
            /* Fin Declaración variables */

            /* Inicio Sección Funciones Controlador */

            vm.consultarPCGrupo = function (tipoIdentificacion, numIdentificacion) {
                /*  Descripción: Función que permite realizar la consulta del Proyecto Crediticio de cada miembro del grupo al que pertenece la empresa recibida consumiendo un servicio REST.
                    Entrada: tipoIdentificacion: parámetro que se envía en el consumo del servicio.
                            numIdentificacion: parámetro que se envía en el consumo del servicio.
                    Salida: NA  */
                vm.progressbar.start();
                businessAdminFactory.getData(constantes.endpoints.consultarGrupoPC + constantes.separador + numIdentificacion + constantes.separador + tipoIdentificacion.codigoParametro, constantes.noCache)
                    .then(
                        function (result) {
                            vm.progressbar.complete();
                            $rootScope.$emit("alertEvent", {"show": false});
                            vm.paramsConsulta = {numIdentificacion: numIdentificacion, tipoIdentificacion: tipoIdentificacion};
                            $window.sessionStorage.setItem("objParamsConsulta", angular.toJson(vm.paramsConsulta));
                            if (result.data.datos && result.data.datos.length > 0) {
                                vm.arbolPCGrupo = result.data.datos[0];
                                $window.sessionStorage.setItem("objArbolPCGrupo", angular.toJson(vm.arbolPCGrupo));
                                $location.path(constantes.url.consultarPCGrupo);
                            } else {
                                var alertObject = {
                                    data: {
                                        descripcionError: MENSAJES.PC_GRUPOS.CONSULTAR.SIN_REGISTROS
                                    },
                                    status: MENSAJES.TIPO.INFO
                                };
                                businessAdminServiciosComunes.showAlert(alertObject);                                
                            }
                        },
                        function (error) {
                            vm.progressbar.complete();
                            businessAdminServiciosComunes.showAlert(error);
                        }
                    );
            };

            vm.compararPC = function (tipoIdentificacion, numIdentificacion) {
                /*  Descripción: Función que permite realizar la consulta del Proyecto Crediticio de cada miembro del grupo al que pertenece la empresa recibida consumiendo un servicio REST.
                    Entrada: tipoIdentificacion: parámetro que se envía en el consumo del servicio.
                            numIdentificacion: parámetro que se envía en el consumo del servicio.
                    Salida: NA  */
                vm.progressbar.start();
                businessAdminFactory.getData(constantes.endpoints.compararPCInput + numIdentificacion + constantes.separador + tipoIdentificacion.codigoParametro, constantes.noCache)
                    .then(
                        function (result) {
                            vm.progressbar.complete();
                            $rootScope.$emit("alertEvent", {"show": false});
                            vm.empresaPC = result.data.datos[0];
                            vm.paramsConsulta = {numIdentificacion: numIdentificacion, tipoIdentificacion: tipoIdentificacion};
                            $window.sessionStorage.setItem("objParamsConsulta", angular.toJson(vm.paramsConsulta));
                            $window.sessionStorage.setItem("objEmpresaPC", angular.toJson(vm.empresaPC));
                            $location.path(constantes.url.compararPCInput);
                        },
                        function (error) {
                            vm.progressbar.complete();
                            businessAdminServiciosComunes.showAlert(error);
                        }
                    );                
            };
            /* Fin Sección Funciones Controlador */

            /* Inicio Lógica Controlador (ejecutada al cargar este controlador) */

            vm.progressbar = ngProgressFactory.createInstance();
            vm.progressbar.setHeight(constantes.progressBar.height);
            vm.progressbar.setColor(constantes.progressBar.color);
            $rootScope.$emit("alertEvent", {"show": false});
            vm.paramsConsulta = JSON.parse($window.sessionStorage.getItem("objParamsConsulta"));

            businessAdminFactory.getData(constantes.endpoints.consultarListaProceso + constantes.parametrias.listaTiposDocumentoId)
                .then(
                    function (result) {
                        vm.listaTipoIdentificacion = result.data.datos;
                    },
                    function (error) {
                        console.log("Error en la consulta: " + JSON.stringify(error));
                    }
                );

            /* Fin Lógica Controlador (ejecutada al cargar este controlador) */

            vm.salir = function () {
                /*  Descripción: Función que permite salir de la funcionalidad Administarcion de Catalogos y que lleva al usuario al menú principal de la aplicación SOR Corporativos.
                    Entrada: NA
                    Salida: NA  */

                $rootScope.$emit("alertEvent", {"show": false});
                $window.sessionStorage.clear();
                $location.path(constantes.url.main);
            };

            $rootScope.$emit('menuEvent', true);

        }]);
})();