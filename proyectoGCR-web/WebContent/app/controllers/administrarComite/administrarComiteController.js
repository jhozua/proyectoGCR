(function(){
    angular.module('adminBusinessModule')
      .controller('administrarComiteController', ['$rootScope', '$location', '$scope', 'businessAdminFactory', '$window', 'businessAdminServiciosComunes', 'ngProgressFactory', 'constantes',
      function($rootScope, $location, $scope, businessAdminFactory, $window, businessAdminServiciosComunes, ngProgressFactory, constantes) {
        var vm = this;

        vm.varNombreComite="";
        vm.paginasComite = {};
        vm.ldap = constantes.rolLdap;
        vm.idFunc = constantes.funcionalidades.comites;
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
                    vm.progressbar.complete();
                },
                function (error) {
                    vm.progressbar.complete();
                    vm.error = true;
                    businessAdminServiciosComunes.showAlert(error);
                }
            );

        vm.consultarComite = function(varNombreComite, pagina) {
        	
             $rootScope.comites="";
             vm.paginasComite="";
             if(varNombreComite === undefined)
                varNombreComite = "";
             $rootScope.$emit("alertEvent", {"show": false});

            if(pagina === undefined){
                if(vm.paginasComite.paginaActual !== undefined || vm.paginasComite.paginaActual !== null)
                    pagina = vm.paginasComite.paginaActual;
                else
                    pagina = 1;
            }
            vm.progressbar.start();
		    businessAdminFactory.getData(constantes.endpoints.consultarComite + varNombreComite, constantes.noCache, pagina)
                    			.then(
                                  
                                  	function(result){
                                        vm.progressbar.complete();
                    					$rootScope.comites = result.data.datos;
                                        vm.paginasComite = businessAdminServiciosComunes.calcularPaginas(result.data);
                    				}, 
                    				function(error){
                                        vm.progressbar.complete();
                                        businessAdminServiciosComunes.showAlert(error);    
                    				}
                    			);   
        };

		vm.irEdicionComite = function(dato) {
            $rootScope.$emit("alertEvent", {"show": false});
            $window.sessionStorage.setItem("cTmpData", angular.toJson(dato))
		 	$location.path(constantes.url.editarComite);
        };

        vm.irCrearComite = function() {
            $window.sessionStorage.removeItem("cTmpData");
            $rootScope.$emit("alertEvent", {"show": false});
		 	$location.path(constantes.url.crearComite);
        };

        vm.irAdminParticipantes = function(){
            $rootScope.$emit("alertEvent", {"show": false});
            $location.path(constantes.url.adminParticipante);
        };

        vm.paginaSeleccionada = function (pagina, accion) {
            var existePag;
            var buscaPag;
            if(accion == constantes.accionPaginacion.siguiente){
                buscaPag = vm.paginasComite.paginaActual + 1;
                existePag = vm.paginasComite.arrayTotalPaginas.indexOf(buscaPag);
                if(existePag >= 0)
                    vm.consultarComite(vm.varNombreComite, buscaPag);
            }else if(accion == constantes.accionPaginacion.anterior){
                buscaPag = vm.paginasComite.paginaActual - 1;
                existePag = vm.paginasComite.arrayTotalPaginas.indexOf(buscaPag);
                if(existePag >= 0)
                    vm.consultarComite(vm.varNombreComite, buscaPag);
            }else{
                if(pagina != vm.paginasComite.paginaActual)
                    vm.consultarComite(vm.varNombreComite, pagina);                
            }
        };

        vm.doSort = function (propName) {
            vm.sortBy = propName;
            vm.reverse = !vm.reverse;
        };

        vm.salirMenu = function(){
            $rootScope.$emit("alertEvent", {"show": false});
            $window.sessionStorage.clear();
            $location.path(constantes.url.main);
        };

        vm.showcheckGlyphicon = function (item, property) {
        /*  Descripción: Función encargada de validar si el valor de la propiedad de un objeto es true. En caso afirmativo retorna 'true'.
            Entrada: item: Objeto al que se validará la propiedad recibida.
                     property: String con el valor de propiedad.
            Salida: Boolean con el resultado de la validación de los parámetros de entrada.  */
            var respuesta = false;
            if(item && property) {
                respuesta = businessAdminServiciosComunes.isTrue(item[property]);
            }
            return respuesta;
        };
        $rootScope.$emit('menuEvent', true);

      }])
})();
