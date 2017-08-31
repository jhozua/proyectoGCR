(function () {
    angular.module('adminBusinessModule')
        .controller('administrarRolesUsuariosController', ['$rootScope', '$scope', '$location', 'businessAdminFactory', "$window", 'businessAdminServiciosComunes', 'MENSAJES', 'ngProgressFactory', 'constantes',
            function ($rootScope, $scope, $location, businessAdminFactory, $window, businessAdminServiciosComunes, MENSAJES, ngProgressFactory, constantes) {

                var vm = this;
                vm.selectedUser = {};
                vm.progressbar = ngProgressFactory.createInstance();
                vm.progressbar.setHeight(constantes.progressBar.height);
                vm.progressbar.setColor(constantes.progressBar.color);
                $rootScope.$emit("alertEvent", {
                    "show": false
                });
                vm.progressbar.start();
                businessAdminFactory.getData(constantes.endpoints.consultarMapeosLdap, constantes.noCache)
                    .then(
                        function (result) {
                            vm.usuarios = result.data.datos;
                            vm.progressbar.complete();
                        },
                        function (error) {
                            vm.progressbar.complete();
                            businessAdminServiciosComunes.showAlert(error);
                        }
                    );

                vm.doSort = function (propName) {
                    if (propName != undefined) {
                        vm.sortBy = propName;
                        vm.reverse = !vm.reverse;
                    }
                };

                vm.cargarRolesUsuario = function (user, index) {
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    vm.progressbar.start();
                    vm.selectedUser = user;
                    vm.selectedIndex = index;
                    vm.rolesDisponibles = [];
                    vm.rolesAsociados = [];
                    businessAdminFactory.getData(constantes.endpoints.consultarRolesDeMapeo.replace("{idMapeo}", vm.selectedUser.idMapeoLdap), constantes.noCache)
                        .then(
                            function (result) {
                                vm.rolesAsociados = result.data.datos;
                            },
                            function (error) {
                                error.data.descripcionError = MENSAJES.SEGURIDAD.ROLES.NO_ROLES_ASOCIADOS;
                                businessAdminServiciosComunes.showAlert(error);
                            }
                        );
                    businessAdminFactory.getData(constantes.endpoints.consultarRolesDisponibles.replace("{idMapeo}", vm.selectedUser.idMapeoLdap), constantes.noCache)
                        .then(
                            function (result) {
                                vm.rolesDisponibles = result.data.datos;
                                vm.progressbar.complete();
                            },
                            function (error) {
                                vm.progressbar.complete();
                                error.data.descripcionError = MENSAJES.SEGURIDAD.ROLES.NO_ROLES_DISPONIBLES;
                                businessAdminServiciosComunes.showAlert(error);
                            }
                        );
                };

                vm.todosrolesAsociados = function () {
                    vm.rolesAsociados = vm.rolesAsociados.concat(vm.rolesDisponibles);
                    vm.rolesDisponibles = [];
                };

                vm.todosRolesDisponibles = function () {
                    vm.rolesDisponibles = vm.rolesDisponibles.concat(vm.rolesAsociados);
                    vm.rolesAsociados = [];
                };


                vm.agregarRolRelacion = function (item, index) {
                    vm.rolesAsociados.push(item);
                    vm.rolesDisponibles.splice(index, 1);
                };

                vm.quitarRolRelacion = function (item, index) {
                    vm.rolesDisponibles.push(item);
                    vm.rolesAsociados.splice(index, 1);
                };

                vm.guardar = function () {
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    vm.progressbar.start();
                    vm.mapeoConRelaciones = {};
                    vm.mapeoConRelaciones.usuario = vm.selectedUser;
                    vm.mapeoConRelaciones.roles = [];
                    vm.rolesAsociados.forEach(function (item, index) {
                        var objetoRelacion = {
                            idMapeoLdap: vm.selectedUser.idMapeoLdap,
                            idRol: item.idRol
                        };
                        vm.mapeoConRelaciones.roles.push(objetoRelacion);
                    });
                    businessAdminFactory.postData(constantes.endpoints.consultarRolesDeMapeo.replace("{idMapeo}", vm.selectedUser.idMapeoLdap), vm.mapeoConRelaciones)
                        .then(
                            function (result) {
                                vm.progressbar.complete();
                                var alertObject = {
                                    data: {
                                        mensaje: MENSAJES.SEGURIDAD.ROLES.ACTUALIZAR_EXITO
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
                    $location.path(constantes.url.seguridadMain);
                };

                $rootScope.$emit('menuEvent', true);

            }
        ]);

})();