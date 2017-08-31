/*

** Autor: Brayam Ruiz
** Empresa: IBM
** Fecha: 4 Enero 2017
** Archivo: agregarPlantillasController.js
** Descripción: Archivo JS en el que se define la funcionalidad del controlador "agregarPlantillasController" asociado al html "agregarPlantillas.html".

*/

(function () {
    angular.module('adminBusinessModule')
        .controller('editarPlantillasController', ['$window', '$rootScope', '$location', '$scope', 'businessAdminFactory', 'businessAdminServiciosComunes','ngProgressFactory','MENSAJES', 'constantes',
        function ($window, $rootScope, $location, $scope, businessAdminFactory, businessAdminServiciosComunes, ngProgressFactory,MENSAJES, constantes) {

            /* Inicio Declaración variables */
            var vm = this;
            vm.variables = {
                tabla_modalidades:"tabla_modalidades",
                tabla_lineas:"tabla_lineas"
            }
            vm.selectedRow = -1;
            vm.opcionesAgregar = [{
                label: "Grupo",
                opc: "grupo"
            }, {
                label: "Empresa",
                opc: "empresa"
            }];
            vm.opcionSeleccionada = vm.opcionesAgregar[0].opc;
            vm.tableColumns = {
                lineas: [{
                    label: "Código",
                    property: "codigoLinea"
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
            vm.tableColumnsModalidad = {
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

            vm.nuevaPlantilla = {};
            vm.tipoModalidadCrear = [];
            vm.modalidadesObj = [];
            vm.lineas = [];
            vm.plantillaObj = {};
            var inc = 0;
            vm.progressbar = ngProgressFactory.createInstance();
            vm.progressbar.setHeight(constantes.progressBar.height);
            vm.progressbar.setColor(constantes.progressBar.color);
            /* Fin Declaración variables */

            /* Inicio Lógica Controlador (ejecutada al cargar este controlador) */
            vm.progressbar.start();
            vm.datoPlantilla = JSON.parse($window.sessionStorage.getItem("itemDatoPlantilla"));

            businessAdminFactory.getData(constantes.endpoints.consultarListaNegocio + constantes.parametrias.listaTiposSegmentoId)
                .then(
                    function (result) {
                        vm.listaTipoSegmento = result.data.datos;

                    },
                    function (error) {}
                );

            businessAdminFactory.getData(constantes.endpoints.modalidadesActivasNoDummy, constantes.noCache)
                .then(
                    function (result) {
                        vm.modalidades = result.data.datos;
                    },
                    function (error) {

                    }
                );

            businessAdminFactory.getData(constantes.endpoints.consultarLineasDisponibles, constantes.noCache)
                .then(
                    function (result) {
                        vm.tableData_LineaRelacion = result.data.datos;
                    },
                    function (error) {

                    }
                );

            businessAdminFactory.getData(constantes.endpoints.plantillaModLinea + vm.datoPlantilla.idPlantilla, constantes.noCache)
                .then(
                    function (result) {
                        vm.tData_edicion = result.data.datos;
                        vm.progressbar.complete();
                    },
                    function (error) {
                        vm.tData_edicion = [];
                        vm.progressbar.complete();
                    }
                );



            /* Fin Salir a la pagina anterior */
            vm.irsalir = function () {
                //$window.history.back();

                $rootScope.$emit("alertEvent", {
                    "show": false
                });
                $window.sessionStorage.clear();
                $location.path(constantes.url.gestionPlantillas);
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

            vm.agregarModalidad = function () { 

                if (vm.nuevaPlantilla.idTipoModalidad.fPermiteDuplicidad == 'N') {

                    var selec_existe_mod = true;
                    var msg = {
                        data: {descripcionError : MENSAJES.PLANTILLAS.ADVERTENCIA.DUPLICIDAD},
                        status: 404
                    };
                    businessAdminServiciosComunes.showAlert(msg);

                    for (var i = 0; i < vm.tData_edicion.length; i++) {
                        if (vm.nuevaPlantilla.idTipoModalidad.codigoModalidad == vm.tData_edicion[i].codigoModalidad) {
                            selec_existe_mod = false;
                            break;
                        }
                    }

                    if (selec_existe_mod) {


                        vm.nuevaPlantilla.idTipoModalidad.lineas = [];
                        vm.nuevaPlantilla.idTipoModalidad.accion = "I";
                        inc++;
                        vm.nuevaPlantilla.idTipoModalidad.indref = inc;
                        //vm.nuevaPlantilla = JSON.parse(JSON.stringify(vm.nuevaPlantilla));
                        vm.tData_edicion.push(vm.nuevaPlantilla.idTipoModalidad);

                    }
                }

                else {

                    vm.nuevaPlantilla.idTipoModalidad.lineas = [];
                    vm.nuevaPlantilla.idTipoModalidad.accion = "I";
                    inc++;
                    vm.nuevaPlantilla.idTipoModalidad.indref = inc;
                    vm.nuevaPlantilla = JSON.parse(JSON.stringify(vm.nuevaPlantilla));
                    vm.tData_edicion.push(vm.nuevaPlantilla.idTipoModalidad);
                }


            };

            vm.agregarLinea = function (index) {
                var seleccionado_existe = true;

                for (var i = 0; i < vm.selectedMod.lineas.length; i++) {
                    if (vm.nuevaPlantilla.idTipoLinea.codigoLinea == vm.selectedMod.lineas[i].codigoLinea) {
                        seleccionado_existe = false;
                        break;
                    }
                }

                if (seleccionado_existe) {
                    vm.nuevaPlantilla.idTipoLinea.accion = "I";
                    vm.selectedMod.lineas.push(vm.nuevaPlantilla.idTipoLinea);
                }

            };


            vm.insertIdModalidad = function (data) {
                // $window.sessionStorage.setItem("itemModalidad", angular.toJson(dato))
                // vm.setClickedRow(index);
                vm.selectedMod = data;
                businessAdminFactory.getData(constantes.endpoints.consultarLineasRelacionadasActivas + data.idTipoModalidad, constantes.noCache)
                    .then(
                        function (result) {
                            //los tipos de lineas asociadas al tipo de modalidad que se pueden asociar en la plantilla
                            vm.tLineaRelacionModa = result.data.datos;
                        },
                        function (error) {

                        }
                    );
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
                                    if(objeto[i].idTipoModalidad == vm.selectedMod.idTipoModalidad){
                                        vm.selectedMod = null;
                                    }
                                    objeto.splice(i, 1);
                                    i--;

                                }
                            }
                            vm.checkAllFlag = false;
                            vm.checkAllFlagLineas = false;

                        }
                    };
                    var title;
                    if(tabla == vm.variables.tabla_modalidades){
                        title = MENSAJES.PLANTILLAS.ELIMINAR.TITULO_CONFIRMAR_ELIMINAR_MODALIDADES;
                    }
                    else{
                        title = MENSAJES.PLANTILLAS.ELIMINAR.TITULO_CONFIRMAR_ELIMINAR_LINEAS;
                    }
                    $rootScope.$emit("gaModalEvent", {
                        "title": title,
                        "msg": MENSAJES.PLANTILLAS.ELIMINAR.ELIMINAR_MODALIDADES,
                        "button1Action": button1Fn,
                        "button1Text": MENSAJES.BOTON_CONFIRMACION.SI,
                        "button2Text": MENSAJES.BOTON_CONFIRMACION.NO
                    });
                } else {
                    var result = {
                        status: 412,
                        data: {
                            descripcionError: MENSAJES.PLANTILLAS.ADVERTENCIA.NO_ELIMINADO
                        }
                    };
                    businessAdminServiciosComunes.showAlert(result);
                }
            };


            vm.guardarDB = function () {
                //console.log(vm.plantillaObj);


                vm.datoPlantilla.modalidades = vm.tData_edicion;
                vm.datoPlantilla.fkIdSegmento = vm.datoPlantilla.listaNegocio.idListaNegocio;
                vm.progressbar.start();
                businessAdminFactory.postData(constantes.endpoints.editarPlantilla, vm.datoPlantilla)
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

            $rootScope.$emit('menuEvent', true);

            /* Fin Sección Funciones Controlador */
        }]);
})();