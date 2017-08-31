(function () {
    angular.module('adminBusinessModule')
        .controller('administrarModalidadController', ['$rootScope', '$location', '$scope', 'businessAdminServiciosComunes', 'businessAdminFactory', '$window', 'ngProgressFactory', 'MENSAJES', 'constantes',
            function ($rootScope, $location, $scope, businessAdminServiciosComunes, businessAdminFactory, $window, ngProgressFactory, MENSAJES, constantes) {
                var vm = this;
                vm.tableColumns = {
                    modalidades: [
                        {id:1, label: "Código", property: "codigoModalidad"},
                        {id:3, label: "Nombre corto", property: "nombreCorto"},
                        {id:2, label: "Nombre", property: "nombreLargo"},
                        {id:5, label: "Orden", property: "ordenPresentacionModalidad"},
                        {id:4, label: "Naturaleza", property: "naturalezaModalidad", subProperty: "descripcion"},
                        {id:6, label: "Estado", property: "estado", subProperty: "descripcion"},
                        {id:7, label: "Tipo radicación", property: "tipoRadicacion", subProperty: "descripcion"},
                        {id:8, label: "Paquete", property: "fPaquete", check: true},
                        {label: "Editar"}
                    ]
                };
                vm.ldap = constantes.rolLdap;
                vm.idFunc = constantes.funcionalidades.modalidades;
                vm.progressbar = ngProgressFactory.createInstance();
                vm.progressbar.setHeight(constantes.progressBar.height);
                vm.progressbar.setColor(constantes.progressBar.color);
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
                        },
                        function (error) {
                            vm.progressbar.complete();
                            vm.error = true;
                            businessAdminServiciosComunes.showAlert(error);
                        }
                    );

                businessAdminFactory.getData(constantes.endpoints.consultaOperacionesCampos.replace("{idMapeo}", vm.ldap)
                        .replace("{idFunc}", constantes.funcionalidades.modalidades).replace("{idPan}", constantes.pantallas.adminMod), constantes.noCache)
                    .then(
                        function (result) {
                            vm.opCampos = result.data.opCampos;
                            vm.asignarOperaciones();
                        },
                        function (error) {
                            vm.progressbar.complete();
                            vm.error = true;
                            error.data.descripcionError = MENSAJES.SEGURIDAD.CAMPOS.ERROR_CARGADO;
                            businessAdminServiciosComunes.showAlert(error);
                        }
                    );

                businessAdminFactory.getData(constantes.endpoints.consultarModalidades, constantes.noCache)
                    .then(
                        function (result) {
                            vm.modalidades = result.data.datos;
                            vm.progressbar.complete();
                        },
                        function (error) {
                            vm.progressbar.complete();
                        }
                    );

                vm.asignarOperaciones = function () {
                    for (var i = 0; i < vm.tableColumns.modalidades.length; i++) {
                        for (var j = 0; j < vm.opCampos.length; j++) {
                            if(vm.opCampos[j].campo.idCampo == vm.tableColumns.modalidades[i].id){
                                vm.tableColumns.modalidades[i].visible = vm.opCampos[j].fVisible;
                                vm.tableColumns.modalidades[i].editable = vm.opCampos[j].fEditable;
                                vm.tableColumns.modalidades[i].obligatorio = vm.opCampos[j].fObligatorio;
                            }
                        }
                    }
                };

                vm.doSort = function (propName, subPropName) {
                    if (propName != undefined) {
                        if (subPropName != undefined) {
                            vm.sortBy = propName + "." + subPropName;
                        } else {
                            vm.sortBy = propName;
                        }
                        vm.reverse = !vm.reverse;
                    }
                };

                vm.irEdicionModalidad = function (dato) {
                    $window.sessionStorage.setItem("itemModalidad", angular.toJson(dato))
                    $location.path(constantes.url.editarModalidad);
                };

                vm.irCrearModalidad = function () {
                    $location.path(constantes.url.crearModalidad);
                };

                vm.salirMenu = function () {
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    $window.sessionStorage.clear();
                    $location.path(constantes.url.main);
                };

                $rootScope.$emit('menuEvent', true);

            }
        ])
})();