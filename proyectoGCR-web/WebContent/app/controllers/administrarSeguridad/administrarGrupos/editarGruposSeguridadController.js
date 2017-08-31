/*

** Autor: Brayam Ruiz
** Empresa: IBM
** Fecha: 4 Enero 2017
** Archivo: agregarPlantillasController.js
** Descripción: Archivo JS en el que se define la funcionalidad del controlador "agregarPlantillasController" asociado al html "agregarPlantillas.html".

*/

(function () {
    angular.module('adminBusinessModule')
        .controller('editarGruposSeguridadController', ['$window', '$rootScope', '$location', '$scope', 'businessAdminFactory', 'businessAdminServiciosComunes','ngProgressFactory','MENSAJES', 'constantes',
        function ($window, $rootScope, $location, $scope, businessAdminFactory, businessAdminServiciosComunes, ngProgressFactory,MENSAJES, constantes) {

            /* Inicio Declaración variables */
            var vm = this;
            vm.variables = {
                tabla_procesos:"tabla_procesos",
            }
            vm.selectedRow = -1;
            vm.tableColumnsProceso = {
                modalidades: [{
                    label: "Código",
                    property: "codigoModalidad"
                }, {
                    label: "Nombre",
                    property: "nombreLargo"
                }],
                detalleGrupo: [{
                    label: "Grupo/Empresa Líder",
                    property: "lider"
                }, {
                    label: "Código Grupo",
                    property: "codigoGrupo"
                }, {
                    label: "Tipo Identificación",
                    property: "tipoIdent"
                }, {
                    label: "No. Identificación",
                    property: "numIdent"
                }, {
                    label: "Nombre",
                    property: "nombreGrupo"
                }]
            };

            vm.nuevoGrupo = {};
            vm.procesoCrear = [];
            vm.procesosObj = [];
            vm.grupoObj = {};
            var inc = 0;
            vm.progressbar = ngProgressFactory.createInstance();
            vm.progressbar.setHeight(constantes.progressBar.height);
            vm.progressbar.setColor(constantes.progressBar.color);
            /* Fin Declaración variables */

            /* Inicio Lógica Controlador (ejecutada al cargar este controlador) */
            vm.progressbar.start();
            vm.datoGrupo = JSON.parse($window.sessionStorage.getItem("itemDatoGrupo"));

            businessAdminFactory.getData(constantes.endpoints.consultarProcesoDominio + constantes.parametrias.listaProceso)
            .then(
                function (result) {
                    vm.listaProceso = result.data.datos;
                    vm.progressbar.complete();
                },
                function (error) {}
            );

            /* Fin Salir a la pagina anterior */
            vm.irsalir = function () {
                //$window.history.back();

                $rootScope.$emit("alertEvent", {
                    "show": false
                });
                $window.sessionStorage.clear();
                $location.path(constantes.url.gestionarGrupoSeguridad);
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

            vm.checkAll = function (objeto, flag) {
                /*  Descripción: Función que controla el flag que permite marcar o desmarcar todas las filas de la tabla presentada en el html.
                  Entrada: objeto: parámetro con toda la información de la tabla. 
                      flag: parámetro que indica si se va a marcar o desmarcar.
                  Salida: NA  */
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
                //console.log(vm.plantillaObj);


                vm.datoGrupo.modalidades = vm.tData_edicion;
                vm.datoGrupo.fkIdSegmento = vm.datoGrupo.listaNegocio.idListaNegocio;
                vm.progressbar.start();
                businessAdminFactory.postData(constantes.endpoints.editarPlantilla, vm.datoGrupo)
                    .then(
                        function (result) {
                            businessAdminServiciosComunes.showAlert(result);
                            $window.sessionStorage.clear();
                            vm.progressbar.complete();
                            $location.path(constantes.url.gestionPlantillas);
                        },
                        function (error) {
                            businessAdminServiciosComunes.showAlert(error);
                            vm.progressbar.complete();
                        }
                    );

            };

            /* Fin Sección Funciones Controlador */
        }]);
})();