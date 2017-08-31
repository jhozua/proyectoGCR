(function(){
    angular.module("adminBusinessModule")        
        .directive("menu", function(){
            return {
                restrict: 'E',
                templateUrl : "app/directives/menu/menuTmpl.html",
                scope:{},                
                controller : function($scope, $element,$window, $attrs, $location, $rootScope,businessAdminFactory, ngProgressFactory, constantes){
                    var vm = this;
                    vm.show = true;
                   	vm.funcionalidades = [
                      {url: constantes.url.grupos, idFunc:constantes.funcionalidades.grupos},
                      {url: constantes.url.gestionComite, idFunc:constantes.funcionalidades.comites},
                      {url: constantes.url.gestionCUTPA, idFunc:constantes.funcionalidades.figAgrup},
                      {url: constantes.url.gestionModalidades, idFunc:constantes.funcionalidades.modalidades},
                      {url: constantes.url.gestionLineas, idFunc:constantes.funcionalidades.lineas},
                      {url: constantes.url.gestionPatrimonio, idFunc:constantes.funcionalidades.patTec},
                      {url: constantes.url.gestionPlantillas, idFunc:constantes.funcionalidades.plantillas},
                      {url: constantes.url.consultarCliente, idFunc:constantes.funcionalidades.grupoPC},
                      {url: constantes.url.seguridadMain, idFunc:constantes.funcionalidades.seguridad}
                    ];

                    vm.segFuncionalidades = constantes.url.gestionFuncionalidades;
                    vm.segCampos = constantes.url.gestionCamposFuncionalidades;
                    vm.segRoles = constantes.url.gestionRolesUsuarios;
                    vm.segFuncRoles = constantes.url.gestionFuncionalidadesRoles;
                    vm.grupos = constantes.url.gestionarGrupoSeguridad;
                    vm.returnMain = constantes.url.main;

                    $rootScope.$emit("alertEvent", {
                      "show": false
                    });

                    vm.ldap = constantes.rolLdap;
                    vm.progressbar = ngProgressFactory.createInstance();
                    vm.progressbar.setHeight(constantes.progressBar.height);
                    vm.progressbar.setColor(constantes.progressBar.color);

                    vm.progressbar.start();

                    vm.cargarMenu = function (){

                      businessAdminFactory.getData(constantes.endpoints.consultaOperacionesFuncionalidad.replace("{idMapeo}", vm.ldap), constantes.noCache)
                      .then(
                        function (result) {
                          Object.freeze(result.data.opFuncionalidades);
                          vm.opFunc = result.data.opFuncionalidades;
                          Object.freeze(vm.opFunc);
                          for (var i = 0; i < vm.opFunc.length; i++) {
                              for (var j = 0; j < vm.funcionalidades.length; j++) {
                                  if(vm.funcionalidades[j].idFunc == vm.opFunc[i].funcionalidad.idFuncionalidad){
                                      vm.funcionalidades[j].nombre = vm.opFunc[i].funcionalidad.nombre;
                                      vm.funcionalidades[j].consultar = vm.opFunc[i].fConsultar;
                                      vm.funcionalidades[j].actualizar = vm.opFunc[i].fActualizar;
                                      vm.funcionalidades[j].crear = vm.opFunc[i].fCrear;
                                      vm.funcionalidades[j].eliminar = vm.opFunc[i].fEliminar;
                                      console.log(vm.funcionalidades[j].nombre);
                                  }
                              }
                          }
                          Object.freeze(vm.funcionalidades);
                          console.log(vm.funcionalidades);

                          vm.progressbar.complete();
                        },
                        function (error) {
                          vm.progressbar.complete();
                          vm.error = true;
                          businessAdminServiciosComunes.showAlert(error);
                        }
                      );

                    };

                    vm.cargarMenu();
                   
                    vm.irA = function (url) {
                    	$location.path(url);
                    };

                    vm.logout = function () {
                        $rootScope.$emit("alertEvent", {
                         "show": false
                        });
                        $window.sessionStorage.clear();
                        $location.path(constantes.url.login);
                    };

                    $rootScope.$on('menuEvent',function(event, args){
                        vm.cargarMenu();
                        vm.show = args;
                    });
                },
                controllerAs: "menuCtrl"
            };
        });
})();