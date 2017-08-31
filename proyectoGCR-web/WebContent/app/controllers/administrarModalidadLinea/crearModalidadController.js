/*

** Autor: Brayam Ruiz
** Empresa: IBM
** Fecha: 28 Diciembre 2016
** Archivo: crearModalidadController.js
** Descripción: Archivo JS en el que se define la funcionalidad del controlador "crearModalidadController" asociado al html "crearModalidad.html".

*/

(function () {
    angular.module('adminBusinessModule')
        .controller('crearModalidadController', ['$rootScope', '$location', '$scope', 'businessAdminFactory', 'businessAdminServiciosComunes', 'ngProgressFactory', '$window', 'MENSAJES', 'constantes',
            function ($rootScope, $location, $scope, businessAdminFactory, businessAdminServiciosComunes, ngProgressFactory, $window, MENSAJES, constantes) {

                /* Inicio Declaración variables */
                var vm = this;
                vm.dataArrayLineasR = [];
                vm.nuevaModalidad = {};
                vm.tipoModalidadCrear = {};
                vm.tableColumns = {
                    modalidades: [
                        {id:1, label: "Código", property: "codigoModalidad", length:15, type:"text"},
                        {id:2, label: "Nombre", property: "nombreLargo", length:200, type:"text"},
                        {id:3, label: "Nombre corto", property: "nombreCorto", length:30, type:"text"},
                        {id:4, label: "Naturaleza", property: "naturalezaModalidad", subProperty: "descripcion", type:"select"},
                        {id:5, label: "Orden", property: "ordenPresentacionModalidad", type:"number", length:2, min:0},
                        {id:6, label: "Estado", property: "estado", subProperty: "descripcion", type:"select"},
                        {id:7, label: "Tipo radicación", property: "tipoRadicacion", subProperty: "descripcion", type:"select"},
                        {id:8, label: "Paquete", property: "fPaquete", check: true},
                        {id:9, label: "Indicador de monto", property: "indicadorMonto", subProperty: "descripcion", type:"select"},
                        {id:11, label: "Permite duplicidad", property: "fPermiteDuplicidad", check: true},
                        {id:10, label: "Permite restricción", property: "fRestriccionPlazo", check: true},
                        {id:14, label: "Constructor", property: "fConstructor", check: true},
                        {id:12, label: "Padre", property: "fPadre", norepeat:true, check: true},
                        {id:13, label: "Modalidad padre", property: "modalidadPadre", subProperty:"idModalidadPadre", norepeat:true, type:"select"}
                    ],
                    lineas: [
                        {id:14, label: "Código", property: "codigoLinea"}, 
                        {id:15, label: "Nombre", property: "nombreLargo"}
                    ]
                };
                vm.ldap = constantes.rolLdap;
                vm.idFunc = constantes.funcionalidades.modalidades;
                /* Fin Declaración variables */
                /* Inicio declaracion de progress bar en las consultas REST */
                vm.progressbar = ngProgressFactory.createInstance();
                vm.progressbar.setHeight(constantes.progressBar.height);
                vm.progressbar.setColor(constantes.progressBar.color);
                /* Fin Declaración */

                vm.progressbar.start();


                businessAdminFactory.getData(constantes.endpoints.consultaOperacionesFuncionalidad.replace("{idMapeo}", vm.ldap), constantes.noCache)
                    .then(
                        function (result) {
                            vm.opFunc = result.data.opFuncionalidades;
                            for (var i = 0; i < vm.opFunc.length && (!vm.func || !vm.funcLineas); i++) {
                                var obj = vm.opFunc[i];
                                if (obj.funcionalidad.idFuncionalidad == vm.idFunc) {
                                    vm.func = obj;
                                }
                                else if(obj.funcionalidad.idFuncionalidad == constantes.funcionalidades.lineas){
                                    vm.funcLineas = obj;
                                }
                            }
                            vm.cargarCampos();
                        },
                        function (error) {
                            vm.error = true;
                            businessAdminServiciosComunes.showAlert(error);
                        }
                    );
                vm.cargarCampos = function(){  
                    if(vm.func && vm.func.fCrear == 'S'){
                        businessAdminFactory.getData(constantes.endpoints.consultaOperacionesCampos.replace("{idMapeo}", vm.ldap)
                                .replace("{idFunc}", constantes.funcionalidades.modalidades).replace("{idPan}", constantes.pantallas.crearMod), constantes.noCache)
                            .then(
                                function (result) {
                                    vm.opCampos = result.data.opCampos;
                                    vm.asignarOperaciones();
                                },
                                function (error) {
                                    vm.error = true;
                                    error.data.descripcionError = MENSAJES.SEGURIDAD.CAMPOS.ERROR_CARGADO;
                                    businessAdminServiciosComunes.showAlert(error);
                                }
                            );

                        /*  Descripción: Función que permite realizar la consulta de los Modalidades existentes en el sistema consumiendo un servicio REST. 
                                Entrada: id_estado: parámetro que se envía en el consumo del servicio.
                                        id_naturaleza: parámetro que se envía en el consumo del servicio.
                                        ID_tipo_radicacion: parámetro que se envía en el consumo del servicio.
                                        ID_indicador_monto: parámetro que se envía en el consumo del servicio.
                                        id_naturaleza: parámetro que se envía en el consumo del servicio.
                                        pagina: parámetro que se envía en el consumo del servicio.
                                Salida: NA  */

                        businessAdminFactory.getData(constantes.endpoints.consultarListaProceso + constantes.parametrias.idEstado)
                            .then(
                                function (result) {

                                    vm.estado = result.data.datos;
                                },
                                function (error) {

                                }
                            );
                        businessAdminFactory.getData(constantes.endpoints.consultarListaProceso + constantes.parametrias.idNaturaleza)
                            .then(
                                function (result) {
                                    vm.naturalezaModalidad = result.data.datos;
                                },
                                function (error) {
                                }
                            );
                        businessAdminFactory.getData(constantes.endpoints.consultarListaProceso + constantes.parametrias.idTipoRadicacion)
                            .then(
                                function (result) {
                                    vm.tipoRadicacion = result.data.datos;
                                },
                                function (error) {
                                }
                            );
                        businessAdminFactory.getData(constantes.endpoints.consultarListaProceso + constantes.parametrias.idIndicadorMonto)
                            .then(
                                function (result) {
                                    vm.indicadorMonto = result.data.datos;
                                },
                                function (error) {
                                }
                            );
                        businessAdminFactory.getData(constantes.endpoints.consultarLineasDisponibles)
                            .then(
                                function (result) {
                                    vm.tableData = result.data.datos;
                                    vm.tablaDataOrigin = JSON.parse(JSON.stringify(vm.tableData));
                                },
                                function (error) {
                                }
                            );
                        businessAdminFactory.getData(constantes.endpoints.consultarModalidadPadre)
                            .then(
                                function (result) {
                                    vm.tableData_mod_padre = result.data.datos;
                                    vm.progressbar.complete();
                                },
                                function (error) {
                                    vm.progressbar.complete();
                                }
                            );
                    }
                    else{
                        vm.progressbar.complete();
                    } 
                };

                vm.asignarOperaciones = function () {
                    for (var i = 0; i < vm.tableColumns.modalidades.length; i++) {
                        for (var j = 0; j < vm.opCampos.length; j++) {
                            if(vm.opCampos[j].campo.idCampo == vm.tableColumns.modalidades[i].id){
                                vm.tableColumns.modalidades[i].visible = vm.opCampos[j].fVisible;
                                vm.tableColumns.modalidades[i].editable = vm.opCampos[j].fEditable;
                                vm.tableColumns.modalidades[i].obligatorio = vm.opCampos[j].fCrear;
                            }
                        }
                    }
                };

                vm.guardarDb = function () {

                    /*  Descripción: Función que envia la informacion del formulario y la lineas relacionadas hacia el REST.
                        Entrada: NA. 
                        Salida: Objeto (tipomodalidad, lineas relacionadas) en formato json hacia el REST */
                    vm.nuevaModalidad.fDummy = 'N';
                    vm.tipoModalidadCrear.tipoModalidad = vm.nuevaModalidad;
                    if (vm.nuevaModalidad.fPadre == 'S') {
                        vm.tipoModalidadCrear.lineasRelacionadas = [];
                    } else {
                        vm.tipoModalidadCrear.lineasRelacionadas = vm.dataArrayLineasR;
                    }
                    //console.log(vm.tipoModalidadCrear);

                    businessAdminFactory.putData(constantes.endpoints.crearModalidades, vm.tipoModalidadCrear)
                        .then(
                            function (result) {
                                var split = result.data.mensaje.split(": ");
                                result.data.mensaje = split[0];
                                businessAdminServiciosComunes.showAlert(result);
                                vm.tipoModalidadCrear.tipoModalidad.idTipoModalidad = split[1];
                                vm.progressbar.complete();
                                vm.irEdicionModalidad(vm.tipoModalidadCrear.tipoModalidad);
                            },
                            function (error) {
                                vm.progressbar.complete();
                                businessAdminServiciosComunes.showAlert(error);
                            }
                        );

                };

                vm.copiarTodo_array = function () {
                    /*  Descripción: Función que agrega la lineas relacionadas en el objeto copia.
                        Entrada: NA. 
                        Salida: Objeto (tipomodalidad, lineas relacionadas) en formato json hacia el REST */
                    vm.tableData = [];
                    vm.dataArrayLineasR = JSON.parse(JSON.stringify(vm.tablaDataOrigin));



                };
                vm.borrarTodo_array = function () {
                    /* Descripción: Función que elimina la lineas relacionadas en el objeto.
                       Entrada: NA. 
                       Salida: Objeto (tipomodalidad, lineas relacionadas) en formato json hacia el REST */

                    vm.dataArrayLineasR = [];
                    vm.tableData = JSON.parse(JSON.stringify(vm.tablaDataOrigin));

                };

                vm.doSort = function (propName) {
                    /*  Descripción: Función que setea las variables referentes al manejo del ordenamiento de la tabla presentada en el html.
                        Entrada: propName: parámetro correspondiente al nombre de la propiedad de la columna a ordenar. 
                        Salida: NA  */
                    vm.sortBy = propName;
                    vm.reverse = !vm.reverse;
                };


                vm.guardarArray = function (item, index) {
                    /*  Descripción: Función que permite agregar al objeto de las lineas disponibles y lineas relacionadas. 
                        Entrada: item id de la tabla e index
                        Salida: imprime la lista de lineas relacionadas que se van clickeando en el objeto original  */
                    vm.dataArrayLineasR.push(item);
                    vm.tableData.splice(index, 1);
                };
                vm.borrarArray = function (item, index) {
                    /*  Descripción: Función que permite eliminar las lineas disponibles y lineas relacionadas al objeto. 
                        Entrada: item id de la tabla e index
                        Salida: borra la lista de lineas relacionadas que se van clickeando en el objeto copia  */
                    vm.tableData.push(item);
                    vm.dataArrayLineasR.splice(index, 1);



                };

                vm.verificarPadre = function () {
                    /*  Descripción: Función que permite verificar que no se pueda asignar una modalidad padre si esta ya la tiene. 
                    Entrada: Flag de modalidad Padre
                    Salida: N/A  */
                    if (vm.nuevaModalidad.fPadre == 'S') {
                        vm.tableData_mod_padre = [];
                        vm.nuevaModalidad.idModalidadPadre = null;
                    } else {
                        businessAdminFactory.getData(constantes.endpoints.consultarModalidadPadre + constantes.separador, constantes.noCache)
                            .then(
                                function (result) {
                                    vm.tableData_mod_padre = result.data.datos;
                                },
                                function (error) {

                                }
                            );
                    }
                };

                vm.irCrearLinea = function () {
                    /*  Descripción: Función que permite Redireccionar a la vista crear Linea. 
                        Entrada: NA
                        Salida: NA  */
                    $rootScope.$emit("alertEvent", {"show": false}); 
                    $location.path(constantes.url.crearLinea);
                };

                vm.irEdicionModalidad = function (dato) {
                    $window.sessionStorage.setItem("itemModalidad", angular.toJson(dato))
                    $location.path(constantes.url.editarModalidad);
                };

                vm.salirGestionModalidad = function () {
                    /*  Descripción: Función que permite Redireccionar a la vista Administrar Molidalidad. 
                        Entrada: NA
                        Salida: NA  */
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    $location.path(constantes.url.gestionModalidades);
                };

                $rootScope.$emit('menuEvent', true);

            }
        ]);


})();