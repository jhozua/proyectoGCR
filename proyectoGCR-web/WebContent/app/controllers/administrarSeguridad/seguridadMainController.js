(function () {
  angular.module('adminBusinessModule')
    .controller('seguridadMain', ['$rootScope', '$location', '$window', 'ngProgressFactory', 'businessAdminFactory', 'businessAdminServiciosComunes', 'constantes',
      function ($rootScope, $location, $window, ngProgressFactory, businessAdminFactory, businessAdminServiciosComunes, constantes) {

        var vm = this;
        vm.funcionalidades = constantes.url.gestionFuncionalidades;
        vm.campos = constantes.url.gestionCamposFuncionalidades;
        vm.roles = constantes.url.gestionRolesUsuarios;
        vm.funcRoles = constantes.url.gestionFuncionalidadesRoles;
        vm.grupos = constantes.url.gestionarGrupoSeguridad;
        vm.ldap = constantes.rolLdap;
        vm.progressbar = ngProgressFactory.createInstance();
        vm.progressbar.setHeight(constantes.progressBar.height);
        vm.progressbar.setColor(constantes.progressBar.color);

        $rootScope.$emit("alertEvent", {
          "show": false
        });

        vm.progressbar.start();

        businessAdminFactory.getData(constantes.endpoints.consultaOperacionesFuncionalidad.replace("{idMapeo}", vm.ldap), constantes.noCache)
            .then(
                function (result) {
                    vm.opFunc = result.data.opFuncionalidades;
                    for (var i = 0; i < vm.opFunc.length && !vm.func; i++) {
                        var obj = vm.opFunc[i];
                        if (obj.funcionalidad.idFuncionalidad == constantes.funcionalidades.seguridad) {
                            vm.func = obj;
                        }
                    }
                    vm.progressbar.complete();
                },
                function (error) {
                    vm.progressbar.complete();
                    vm.error = true;
                    businessAdminServiciosComunes.showAlert(error);
                }
            );

        vm.goTo = function (ruta) {
          $location.path(ruta);
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