/*

** Autor: Brayam Ruiz
** Empresa: IBM
** Fecha: 4 Enero 2017
** Archivo: agregarGruposController.js
** Descripción: Archivo JS en el que se define la funcionalidad del controlador "agregarGruposController" asociado al html "agregarGrupos.html".

*/

(function () {
    angular.module('adminBusinessModule')
        .controller('agregarGruposSeguridadController', ['$window', '$rootScope', '$location', '$scope', 'businessAdminFactory', 'businessAdminServiciosComunes', 'ngProgressFactory', 'MENSAJES', 'constantes',
        function ($window, $rootScope, $location, $scope, businessAdminFactory, businessAdminServiciosComunes, ngProgressFactory,MENSAJES, constantes) {

            /* Inicio Declaración variables */
            var vm = this;
            vm.variables = {
                tabla_procesos:"tabla_procesos"
            }
            vm.tableColumnsProceso = {
                procesos: [{
                    label: "Nombre",
                    property: "descripcion"
                }]
            };

            vm.nuevoGrupo = {};
            vm.procesoSeguridadCrear = [];
            vm.procesosObj = [];
            vm.grupoObj = {};
            var inc = 0;
            vm.progressbar = ngProgressFactory.createInstance();
            vm.progressbar.setHeight(constantes.progressBar.height);
            vm.progressbar.setColor(constantes.progressBar.color);
            /* Fin Declaración variables */

            vm.progressbar.start();
            businessAdminFactory.getData(constantes.endpoints.consultarProcesoDominio + constantes.parametrias.listaProceso)
                .then(
                    function (result) {
                        vm.listaProceso = result.data.datos;
                        vm.progressbar.complete();
                    },
                    function (error) {}
                );

            vm.checkAll = function (objeto, flag) {
                /*	Descripción: Función que controla el flag que permite marcar o desmarcar todas las filas de la tabla presentada en el html.
      			Entrada: objeto: parámetro con toda la información de la tabla. 
      					flag: parámetro que indica si se va a marcar o desmarcar.
	        	Salida: NA 	*/
                objeto.forEach(function (item, index) {
                    if (flag) {
                        item.selected = true;
                    } else {
                        item.selected = false;

                    }
                });
            };

            vm.agregarProceso = function () {

            	vm.nuevoGrupo.idProceso.accion = "I";
                inc++;
                vm.nuevoGrupo.idProceso.indref = inc;
                vm.procesosObj.push(vm.nuevoGrupo.idProceso);
            };

            vm.alerts = function () {
                $rootScope.$emit("alertEvent", {
                    "show": false
                });
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

            vm.doSortLin = function (propName, subPropName) {
                if (propName != undefined) {
                    if(subPropName != undefined){
                        vm.sortByLin = propName+"."+subPropName;
                    }
                    else{
                        vm.sortByLin = propName;
                    }
                    vm.reverseLin = !vm.reverseLin;
                }
            };

            vm.eliminarSeleccion = function (objeto, tabla) {
                /*  Descripción: Función que permite marcar como eliminados los miembros seleccionados. 
                   Entrada: objeto: Objeto con la información de los miembros del grupo para iterar.
                   Salida: NA  */
                var seleccionado = false;
                $rootScope.$emit("alertEvent", {
                    "show": false
                });
                for (var i = 0; i < objeto.length; i++) {
                    if (objeto[i].selected) {
                        seleccionado = true;
                        break;
                    }
                }
                if (seleccionado) {
                    var button1Fn = function () {
                        if (objeto) {
                            for (var i = 0; i < objeto.length; i++) {
                                if (objeto[i].selected) {
                                    if (objeto[i].accion == "I") {
                                        objeto.splice(i, 1);
                                        i--;
                                    } else {
                                        objeto[i].accion = "D";
                                    }
                                }
                            }
                            vm.checkAllFlag = false;
                            vm.checkAllFlagLineas = false;
                        }
                    };

                    $rootScope.$emit("gaModalEvent", {
                        "title": MENSAJES.GRUPOS_SEGURIDAD.ELIMINAR.TITULO_CONFIRMAR_ELIMINAR_PROCESOS,
                        "msg": MENSAJES.GRUPOS_SEGURIDAD.ELIMINAR.ELIMINAR_PROCESOS,
                        "button1Action": button1Fn,
                        "button1Text": MENSAJES.BOTON_CONFIRMACION.SI,
                        "button2Text": MENSAJES.BOTON_CONFIRMACION.NO
                    });
                } else {
                    var result = {
                        status: 412,
                        data: {
                            descripcionError: MENSAJES.GRUPOS_SEGURIDAD.ADVERTENCIA.NO_ELIMINADO

                        }
                    };
                    businessAdminServiciosComunes.showAlert(result);
                }
            };

            vm.guardarDB = function () {
            	
                vm.grupoObj.procesosRelacionados = vm.procesosObj;

                businessAdminFactory.putData(constantes.endpoints.crearGrupoSeguridad, vm.grupoObj)
                    .then(
                        function (result) {
                            businessAdminServiciosComunes.showAlert(result);
                            $location.path(constantes.url.gestionarGrupoSeguridad);
                        },
                        function (error) {
                            businessAdminServiciosComunes.showAlert(error);
                        }
                    );

            };

            /* Fin Salir a la pagina anterior */
            vm.irsalir = function () {
                $location.path(constantes.url.gestionarGrupoSeguridad);
                $rootScope.$emit("alertEvent", {
                    "show": false
                });
            };
            /* Fin Lógica Controlador */

            /* Fin Sección Funciones Controlador */
        }]);
})();