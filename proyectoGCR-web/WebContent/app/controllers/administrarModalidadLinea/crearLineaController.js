(function () {
    angular.module('adminBusinessModule')
        .controller('crearLineaController', ['$rootScope', '$location', '$scope', 'businessAdminFactory','businessAdminServiciosComunes', 'ngProgressFactory', '$window', 'MENSAJES', 'constantes',
            function ($rootScope, $location, $scope, businessAdminFactory, businessAdminServiciosComunes, ngProgressFactory, $window, MENSAJES, constantes) {
                var vm = this;
                 vm.tableColumns = {
                    lineas: [
                        {id: 15, label: "Código", property: "codigoLinea", length:15, type:"text"}, 
                        {id: 17, label: "Nombre corto", property: "nombreCorto", length:30, type:"text"}, 
                        {id: 16, label: "Nombre", property: "nombreLargo", length:200, type:"text"}, 
                        {id: 18, label: "Orden", property: "ordenPresentacionLinea", type:"number", max:999999999, min:0}, 
                        {id: 19, label: "Estado", property: "estado", subProperty: "descripcion", type:"select"}, 
                        {id: 20, label: "Tipo Naturaleza", property: "tipoNaturaleza", subProperty: "descripcion", type:"select"},
                        {id: 21, label: "Naturaleza obligación", property: "tipoNaturalezaObligacion", subProperty: "descripcion", type:"select"},
                        {id: 22, label: "Clasificación línea", property: "clasificacionLinea", subProperty: "descripcion", type:"select"},
                        {id: 23, label: "Flujo desembolsador", property: "flujoDesembolsador", subProperty: "descripcion", type:"select"}, 
                        {id: 24, label: "Protegida", property: "fProtegida", check:true}, 
                        {id: 25, label: "Requiere descripción", property: "fRequiereDescripcion", check:true}, 
                        {id: 26, label: "Aplica seguro microempresas", property: "fAplicaSeguroMicroempresa", check:true}, 
                        {id: 27, label: "Constructor", property: "fConstructor", check:true}
                    ]
                 };
                vm.nuevaLinea = {};
                vm.ldap = constantes.rolLdap;
                vm.idFunc = constantes.funcionalidades.lineas;
                vm.progressbar = ngProgressFactory.createInstance();
                vm.progressbar.setHeight(constantes.progressBar.height);
                vm.progressbar.setColor(constantes.progressBar.color);
                vm.erroresInit = [];
                
                vm.progressbar.start();

                businessAdminFactory.getData(constantes.endpoints.consultaOperacionesFuncionalidad.replace("{idMapeo}", vm.ldap), constantes.noCache)
                    .then(
                        function (result) {
                            vm.opFunc = result.data.opFuncionalidades;
                            for (var i = 0; i < vm.opFunc.length && !vm.func; i++) {
                                var obj = vm.opFunc[i];
                                if (obj.funcionalidad.idFuncionalidad == vm.idFunc) {
                                    vm.func = obj;
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
                                .replace("{idFunc}", constantes.funcionalidades.lineas).replace("{idPan}", constantes.pantallas.crearLin), constantes.noCache)
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

                        businessAdminFactory.getData(constantes.endpoints.consultarListaProceso + constantes.parametrias.idEstado)
                            .then(
                                function (result) {
                                    vm.estado = result.data.datos;
                                },
                                function (error) {
                                    vm.erroresInit.push("'Estado' ");
                                }
                            );
                        businessAdminFactory.getData(constantes.endpoints.consultarListaProceso + constantes.parametrias.idNaturaleza)
                            .then(
                                function (result) {
                                    vm.tipoNaturaleza = result.data.datos;
                                },
                                function (error) {
                                    vm.erroresInit.push("'Naturaleza' ");
                                }
                            );
                        businessAdminFactory.getData(constantes.endpoints.consultarListaProceso + constantes.parametrias.idFlujoDesembolsador)
                            .then(
                                function (result) {
                                    vm.flujoDesembolsador = result.data.datos;
                                },
                                function (error) {
                                    vm.erroresInit.push("'Flujo desembolsador' ");
                                }
                            );
                        businessAdminFactory.getData(constantes.endpoints.consultarListaProceso + constantes.parametrias.idTipoObligacion)
                            .then(
                                function (result) {
                                    vm.tipoNaturalezaObligacion = result.data.datos;
                                },
                                function (error) {
                                    vm.erroresInit.push("'Tipo obligación' ");
                                    vm.progressbar.complete();
                                }
                            );
                        businessAdminFactory.getData(constantes.endpoints.consultarListaProceso + constantes.parametrias.idClasificacionLinea)
                        .then(
                            function (result) {
                                vm.clasificacionLinea = result.data.datos;
                                vm.progressbar.complete();
                            },
                            function (error) {
                                vm.erroresInit.push("'Clasificación línea' ");
                                vm.progressbar.complete();
                            }
                        );
                        if(vm.erroresInit.length > 0){
                            businessAdminServiciosComunes.showAlert("Error al cargar: "+vm.erroresInit);
                        }
                    }
                    else{
                        vm.progressbar.complete();
                    }
                };

                vm.asignarOperaciones = function () {
                    for (var i = 0; i < vm.tableColumns.lineas.length; i++) {
                        for (var j = 0; j < vm.opCampos.length; j++) {
                            if(vm.opCampos[j].campo.idCampo == vm.tableColumns.lineas[i].id){
                                vm.tableColumns.lineas[i].visible = vm.opCampos[j].fVisible;
                                vm.tableColumns.lineas[i].editable = vm.opCampos[j].fEditable;
                                vm.tableColumns.lineas[i].obligatorio = vm.opCampos[j].fCrear;
                            }
                        }
                    }
                };
                    
                vm.crearNuevaLinea = function () {
                    vm.nuevaLinea.fDummy = 'N';
                    vm.progressbar.start();
                    businessAdminFactory.putData(constantes.endpoints.crearLinea, vm.nuevaLinea)
                        .then(
                            function (result) {
                                var split = result.data.mensaje.split(": ");
                                result.data.mensaje = split[0];
                                vm.progressbar.complete();
                                businessAdminServiciosComunes.showAlert(result);
                                vm.nuevaLinea.idTipoLinea = split[1];
                                vm.irEdicionLinea(vm.nuevaLinea);
                            },
                            function (error) {
                                vm.progressbar.complete();
                                businessAdminServiciosComunes.showAlert(error);
                            }
                        );
                };

                vm.irEdicionLinea = function (dato) {
                    $window.sessionStorage.setItem("itemLinea", angular.toJson(dato))
                    $location.path(constantes.url.editarLinea);
                };

                vm.salir = function () {
                    $window.history.back();
                    $rootScope.$emit("alertEvent", {"show": false}); 
                };

                $rootScope.$emit('menuEvent', true);

            }
        ]);
})();