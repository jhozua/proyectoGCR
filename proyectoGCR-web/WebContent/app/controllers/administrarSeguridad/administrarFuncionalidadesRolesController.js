(function () {
    angular.module('adminBusinessModule')
        .controller('administrarFuncionalidadesRolesController', ['$rootScope', '$scope', '$location', 'businessAdminFactory', "$window", 'businessAdminServiciosComunes', 'MENSAJES', 'ngProgressFactory', 'constantes',
            function ($rootScope, $scope, $location, businessAdminFactory, $window, businessAdminServiciosComunes, MENSAJES, ngProgressFactory, constantes) {

                var vm = this;
                vm.selectedRole = {};
                vm.progressbar = ngProgressFactory.createInstance();
                vm.progressbar.setHeight(constantes.progressBar.height);
                vm.progressbar.setColor(constantes.progressBar.color);
                $rootScope.$emit("alertEvent", {
                    "show": false
                });
                vm.progressbar.start();
                businessAdminFactory.getData(constantes.endpoints.consultarRoles, constantes.noCache)
                    .then(
                        function (result) {
                            vm.roles = result.data.datos;
                            vm.progressbar.complete();
                        },
                        function (error) {
                            vm.progressbar.complete();
                            businessAdminServiciosComunes.showAlert(error);
                        }
                    );

                vm.editarRol = function (rol, index) {
                    rol.edit = !rol.edit;
                    if (!vm.selectedRole || vm.selectedRole.idRol != rol.idRol) {
                        vm.cargarFuncionalidadesRol(rol, index);
                    }
                };

                vm.cargarFuncionalidadesRol = function (rol, index) {
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    vm.progressbar.start();
                    if (rol.idRol != vm.selectedRole && vm.selectedRole.edit) {
                        vm.editarRol(vm.selectedRole);
                    }
                    vm.selectedRole = rol;
                    vm.selectedIndex = index;
                    vm.funcRol = [];
                    businessAdminFactory.getData(constantes.endpoints.funcionalidadesRol.replace("{idRol}", vm.selectedRole.idRol), constantes.noCache)
                        .then(
                            function (result) {
                                vm.funcRol = result.data.datos;
                                vm.funcRol.forEach(function (item, index) {
                                    delete item.idFuncionalidadXRol;
                                });
                                vm.progressbar.complete();
                                vm.cargarFuncDisponiblesRol();
                            },
                            function (error) {
                                vm.progressbar.complete();
                                businessAdminServiciosComunes.showAlert(error);
                            }
                        );
                };

                vm.cargarFuncDisponiblesRol = function () {
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    vm.funcDisponibles = [];
                    businessAdminFactory.getData(constantes.endpoints.funcionalidadesDisponiblesRol.replace("{idRol}", vm.selectedRole.idRol), constantes.noCache)
                        .then(
                            function (result) {
                                vm.funcDisponibles = result.data.datos;
                                vm.progressbar.complete();
                            },
                            function (error) {
                                vm.progressbar.complete();
                                if (error.status != 404) {
                                    var alertObject = {
                                        data: {
                                            descripcionError: MENSAJES.SEGURIDAD.ROLES.NO_FUNCIONALIDADES_DISPONIBLES
                                        },
                                        status: MENSAJES.TIPO.WARNING
                                    };
                                    businessAdminServiciosComunes.showAlert(alertObject);
                                }
                            }
                        );
                };

                vm.agregarFuncionalidad = function () {
                    if (vm.nuevaFunc) {
                        var index = vm.funcDisponibles.indexOf(vm.nuevaFunc);
                        vm.funcDisponibles.splice(index, 1);
                        //saca el objeto de la lista de funcionalidades disponibles
                        var objRelacion = {};
                        objRelacion.nombreFuncionalidad = vm.nuevaFunc.nombre;
                        objRelacion.idFuncionalidad = vm.nuevaFunc.idFuncionalidad;
                        objRelacion.idRol = vm.selectedRole.idRol;
                        objRelacion.fCrear = 'N';
                        objRelacion.fconsultar = 'N';
                        objRelacion.fActualizae = 'N';
                        objRelacion.fEliminar = 'N';
                        //lo inserta en la lista de funcionalidades asociadas
                        vm.funcRol.push(objRelacion);
                    }
                };

                vm.eliminarFuncionalidades = function () {

                    if (businessAdminServiciosComunes.checkedInList(vm.funcRol, "remove")) {
                        var confirmacionEliminarFuncionalidad = function () {
                            vm.checkAllFlag = false;
                            for (var i = 0; i < vm.funcRol.length; i++) {
                                if (vm.funcRol[i].remove) {
                                    var objFunc = {};
                                    objFunc.nombre = vm.funcRol[i].nombreFuncionalidad;
                                    objFunc.idFuncionalidad = vm.funcRol[i].idFuncionalidad;
                                    //regresa la funcionalidad a la lista de disponibles
                                    vm.funcDisponibles.push(objFunc);
                                    //la elimina de la lista de funcionalidades asociadas
                                    vm.funcRol.splice(i, 1);
                                    i--;
                                }
                            }
                        };
                        $rootScope.$emit("alertEvent", {
                            "show": false
                        });
                        $rootScope.$emit("gaModalEvent", {
                            "title": MENSAJES.SEGURIDAD.ROLES.ELIMINAR_FUNCIONALIDADES.TITULO_CONFIRMAR_ELIMINAR,
                            "msg": MENSAJES.SEGURIDAD.ROLES.ELIMINAR_FUNCIONALIDADES.CONFIRMAR_ELIMINAR,
                            "button1Action": confirmacionEliminarFuncionalidad,
                            "button1Text": MENSAJES.BOTON_CONFIRMACION.SI,
                            "button2Text": MENSAJES.BOTON_CONFIRMACION.NO
                        });
                    } else {
                        var alertObject = {
                            data: {
                                descripcionError: MENSAJES.SEGURIDAD.ROLES.ELIMINAR_FUNCIONALIDADES.SIN_ELEMENTOS_ELIMINAR
                            },
                            status: MENSAJES.TIPO.WARNING
                        };
                        businessAdminServiciosComunes.showAlert(alertObject);
                    }
                };

                vm.guardarRolConFunc = function () {
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    var objRolConRelaciones = {};
                    objRolConRelaciones.rol = vm.selectedRole;
                    objRolConRelaciones.funcionalidades = vm.funcRol;
                    businessAdminFactory.postData(constantes.endpoints.funcionalidadesRol.replace("{idRol}", vm.selectedRole.idRol), objRolConRelaciones)
                        .then(
                            function (result) {
                                vm.selectedRole = result.data.datos[0].rol;
                                vm.funcRol = result.data.datos[0].funcionalidades;
                                vm.selectedRole.edit = false;
                                vm.progressbar.complete();
                                var alertObject = {
                                    data: {
                                        mensaje: MENSAJES.SEGURIDAD.ROLES.ACTUALIZAR_FUNCIONALIDADES.EXITO
                                    },
                                    status: MENSAJES.TIPO.SUCCESS
                                };
                                businessAdminServiciosComunes.showAlert(alertObject);
                            },
                            function (error) {
                                vm.progressbar.complete();
                                businessAdminServiciosComunes.showAlert(error);
                            }
                        );
                };

                vm.salir = function () {
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    $window.sessionStorage.clear();
                    $location.path(constantes.url.main);
                };

                $rootScope.$emit('menuEvent', true);
            }
        ]);

})();