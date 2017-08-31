(function(){
	angular.module('adminBusinessModule')
      .controller('agregarParticipanteController', ['$scope', '$rootScope', '$location', '$routeParams','businessAdminFactory', "$filter", "$window", "businessAdminServiciosComunes", 'ngProgressFactory', 'MENSAJES', 'constantes',
      		function($scope, $rootScope, $location, $routeParams ,businessAdminFactory, $filter, $window, businessAdminServiciosComunes, ngProgressFactory, MENSAJES, constantes) {
        
        var vm = this;
        var from = $window.sessionStorage.getItem("pFrom");
        vm.participantes = JSON.parse($window.sessionStorage.getItem("cTmpData"));

        if(vm.participantes === null){
            console.log("Error al cargar los datos del comité.");
        }

        vm.marcados = false;

        var iniPaginas = function(cantidad){
            vm.paginas = new Array(cantidad);
        };

        vm.progressbar = ngProgressFactory.createInstance();
        vm.progressbar.setHeight(constantes.progressBar.height);
        vm.progressbar.setColor(constantes.progressBar.color);

        businessAdminFactory.getData(constantes.endpoints.consultarListaProceso + constantes.parametrias.listaTiposDocumentoId, constantes.noCache)
			.then(
				function(result){
					vm.listaTipoDocumento = result.data.datos;
				}, 
				function(error){
					 businessAdminServiciosComunes.showAlert(error); 
				}
			);

        vm.consultar = function(page){
           
             $rootScope.$emit("alertEvent", {"show": false});
            if(page === undefined || (page >= 1 && page <= vm.datosTabla.totalPaginas) ){
                vm.progressbar.start();
                businessAdminFactory.getData(constantes.endpoints.buscarParticipantes.replace("{tipodoc}", vm.filtroTipodoc || "").replace("{numdoc}", vm.filtroNumdoc || "").replace("{nombre}", vm.filtroNombre || ""), constantes.noCache, page)
                    .then(
                        function(result){
                            vm.progressbar.complete();
                            vm.datosTabla = result.data;
                            iniPaginas(vm.datosTabla.totalPaginas);
                        }, 
                        function(error){
                            vm.progressbar.complete();
                            vm.datosTabla = {};
                            businessAdminServiciosComunes.showAlert(error); 
                        }
                    );
            }
        };

        vm.agregarSeleccion = function(){

            $rootScope.$emit("alertEvent", {"show": false});

            var confirmarAgregarSeleccion = function(){

                var algunAgregado = false;
                var yaAgregado = false;
                var algunAgregadoAntes = false;
                vm.checkAllFlag = false;

                if (businessAdminServiciosComunes.isTrue(vm.participantes.fUnipersonal) && businessAdminServiciosComunes.checkedInListNumber(vm.datosTabla.datos, "marcado") > 1) {
                    alertObject = {
                        data: {
                            descripcionError: MENSAJES.COMITES.GUARDAR.MAX_PARTICIPANTES_UNIPERSONAL
                        },
                        status: MENSAJES.TIPO.WARNING
                    };
                    businessAdminServiciosComunes.showAlert(alertObject);
                } else {
                    vm.datosTabla.datos.forEach(function(item, index) {
                        yaAgregado = false;
                        if(item.marcado){
                            if(vm.participantes.comiteXParticipanteComites !== undefined){
                                if (vm.participantes.comiteXParticipanteComites.length > 0){
                                    for (var i = vm.participantes.comiteXParticipanteComites.length - 1; i >= 0 ; i--) {
                                        if(vm.participantes.comiteXParticipanteComites[i].participanteComite.accion != constantes.accionServiciosRest.eliminar && vm.participantes.comiteXParticipanteComites[i].participanteComite.idParticipanteComite == item.idParticipanteComite){
                                            if(item.eliminar === undefined || item.eliminar === false){
                                                yaAgregado = true;
                                                algunAgregadoAntes = true;
                                            }
                                        }
                                    }
                                }
                            }else{
                                vm.participantes.comiteXParticipanteComites = [];
                            }
                            if(!yaAgregado){
                                algunAgregado = true;
                                item.selected = false;
                                item.accion = "I";
                                vm.participantes.comiteXParticipanteComites.push({participanteComite:item});
                            }
                        }
                    });
                    var alertObject;
                    if (!algunAgregadoAntes && algunAgregado) {
                        alertObject = {data: {mensaje: MENSAJES.COMITES.PARTICIPANTES.AGREGAR.TODOS}, status: MENSAJES.TIPO.SUCCESS};
                        businessAdminServiciosComunes.showAlert(alertObject);
                    } else if (algunAgregadoAntes && algunAgregado) {
                        alertObject = {data: {descripcionError: MENSAJES.COMITES.PARTICIPANTES.AGREGAR.ALGUNOS}, status: MENSAJES.TIPO.INFO};
                        businessAdminServiciosComunes.showAlert(alertObject);
                    } else {
                        alertObject = {data: {descripcionError: MENSAJES.COMITES.PARTICIPANTES.AGREGAR.NINGUNO}, status: MENSAJES.TIPO.WARNING};
                        businessAdminServiciosComunes.showAlert(alertObject);
                    }
                vm.datosTabla.datos = [];
                }
                vm.datosTabla.totalPaginas = 0;
                $window.sessionStorage.setItem("cTmpData", angular.toJson(vm.participantes));

            };

        	if(businessAdminServiciosComunes.checkedInList(vm.datosTabla.datos, "marcado")){
        		$rootScope.$emit("gaModalEvent", {
	     			"title": MENSAJES.COMITES.PARTICIPANTES.AGREGAR.TITULO_CONFIRMAR_AGREGAR,
					"msg": MENSAJES.COMITES.PARTICIPANTES.AGREGAR.CONFIRMAR_AGREGAR, 
					"button1Action": confirmarAgregarSeleccion,
                    "button1Text": MENSAJES.BOTON_CONFIRMACION.SI,
                    "button2Text": MENSAJES.BOTON_CONFIRMACION.NO
				});
        	}else{
                 var alertObject= {data: {descripcionError: MENSAJES.COMITES.PARTICIPANTES.AGREGAR.SIN_ELEMENTOS_AGREGAR}, status: MENSAJES.TIPO.WARNING};
                 businessAdminServiciosComunes.showAlert(alertObject);
            }

        };

        vm.salir = function(){
            $rootScope.$emit("alertEvent", {"show": false});
            if(from === "1") $location.path(constantes.url.crearComite);
            if(from === "2") $location.path(constantes.url.editarComite);
        };

        vm.irCrearParticipante = function(){
            $rootScope.$emit("alertEvent", {"show": false});
            $window.sessionStorage.setItem("urlRetorno", constantes.url.agregarParticipante);
            $location.path(constantes.url.crearParticipante);
        };

        vm.doSort = function (propName) {
            vm.sortBy = propName;
            vm.reverse = !vm.reverse;
        };

        vm.checkAll = function (flag) {
            vm.datosTabla.datos = businessAdminServiciosComunes.checkAll(vm.datosTabla.datos, "marcado", flag);
        };

        $rootScope.$emit('menuEvent', true);

      }]);
})();