(function(){
	angular.module('adminBusinessModule')
      .controller('agregarEmpresasController', ['$scope', '$rootScope', '$location', '$routeParams','businessAdminFactory', "$filter", "$window", "businessAdminServiciosComunes", 'ngProgressFactory', 'MENSAJES', 'constantes',
      		function($scope, $rootScope, $location, $routeParams ,businessAdminFactory, $filter, $window, businessAdminServiciosComunes, ngProgressFactory, MENSAJES, constantes) {
        
        var vm = this;
        var urlRetorno = $window.sessionStorage.getItem("urlRetorno");
        vm.selectedRow = null;

        var marcadosObjs = JSON.parse($window.sessionStorage.getItem("involucradosDataMarcados"));
        if(marcadosObjs === null){
            marcadosObjs = [];
        }
        
        vm.marcados = [];
        vm.showAgregarSeleccion = false;
        vm.alertaAgregarMiembro = false;
        
        $window.sessionStorage.removeItem("involucradosDataMarcados");

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
				}
			);

        vm.consultar = function(page){
           
             $rootScope.$emit("alertEvent", {"show": false});
            if(page === undefined || (page >= 1 && page <= vm.datosTabla.totalPaginas) ){
                 vm.progressbar.start();
                businessAdminFactory.getData(constantes.endpoints.consultarEmpresasFiltro.replace("{tipoidenti}", vm.filtroTipodoc || "").replace("{numidenti}", vm.filtroNumdoc || "").replace("{nombre}", vm.filtroNombre || ""), constantes.noCache, page)
                    .then(
                        function(result){
                            vm.progressbar.complete();
                            vm.datosTabla = result.data;
                            if(vm.marcados.length){
                                for(var i in vm.datosTabla.datos){
                                    if(vm.marcados.indexOf(vm.datosTabla.datos[i].idInvolucrado) !== -1)
                                        vm.datosTabla.datos[i].marcado = true;
                                }
                            }
                            iniPaginas(vm.datosTabla.totalPaginas);
                        }, 
                        function(error){
                            vm.progressbar.complete();
                            vm.datosTabla = {};
                        }
                    );
            }
        };
        /*
        var confirmarAgregarSeleccion = function(){      
            vm.datosTabla.datos.forEach(function(item, index){
                if(item.marcado){
                    marcadosObjs.push({involucrado:item});
                }
            });

            vm.limpiar();
        };
        */

        vm.agregarSeleccion = function () {    
      		/*	Descripción: Función que permite agregar las filas seleccionadas al objeto de negocio recibido en el parámetro.
      			Entrada: objeto: parámetro con toda la información de la tabla.      					
	        	Salida: NA 	*/         	
        	var algunAgregado = false;
        	var yaAgregado = false;
        	var algunAgregadoAntes = false;
			vm.datosTabla.datos.forEach(function(item, index) {
				yaAgregado = false;
				if(item.selected){
					for (var i = marcadosObjs.length - 1; i >= 0 ; i--) {
                        if(marcadosObjs[i].involucrado.idInvolucrado == item.idInvolucrado){
                            if(item.deleted === undefined || item.deleted === false){
                                yaAgregado = true;
                                algunAgregadoAntes = true;
                            }								
                        }
                    }
					if(!yaAgregado){
						algunAgregado = true;
						var itemMiembro = {involucrado:item};
						itemMiembro.accion = "I";
						itemMiembro.selected = false;
						marcadosObjs.push(itemMiembro);
					}
				}
			});
			var pos= $(window).scrollTop();
            $("body").css({
              "margin-top": -pos+"px",
              "overflow-y": "scroll", 
            });
            $(window).scrollTop(0);
            $("body").css("transition", "all 1s ease");
            $("body").css("margin-top", "0");
            $("body").on("webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd", function(){
              $("body").css("transition", "none");
            });
			if(!algunAgregadoAntes && algunAgregado){
				vm.classAlerta = "alert-success";
				vm.classIconAlerta = "glyphicon-ok";
	            vm.msgAlertaAgregarMiembro = MENSAJES.CUTPA.AGREGAR_EMPRESAS.AGREGADOS;
			}else if(algunAgregadoAntes && algunAgregado){
				vm.classAlerta = "alert-info";
				vm.classIconAlerta = "glyphicon-exclamation-sign";
				vm.msgAlertaAgregarMiembro = MENSAJES.CUTPA.AGREGAR_EMPRESAS.ALGUNAS_AGREGADOS;
				
			}else{
				vm.classAlerta = "alert-warning";
				vm.classIconAlerta = "glyphicon-warning-sign";
				vm.msgAlertaAgregarMiembro = MENSAJES.CUTPA.AGREGAR_EMPRESAS.TODOS_YA_AGREGADOS;
			}
            vm.alertaAgregarMiembro = true;
            vm.showAgregarSeleccion = false;
            vm.checkAllFlag = false;
            vm.limpiar();
        };
        /*
        vm.agregarSeleccion = function(){
          var sihayMarcados=false;
          vm.datosTabla.datos.forEach(function(item,index){
            if (item.selected) {
               sihayMarcados=true;
            } 
          }) ;

        	if(sihayMarcados){
        		$rootScope.$emit("gaModalEvent", {
	     			"title": "AGREGAR PERSONAS JURIDICAS",
					"msg": "¿Esta seguro que desea agregar los involucrados seleccionados?", 
					"button1Action": confirmarAgregarSeleccion
				});
        	}else{
                 var alertObject= {data: {descripcionError: "No se han seleccionado involucrados para agregar al C/UT/PA."}, status: "412"};
                 businessAdminServiciosComunes.showAlert(alertObject);
            }

        };
        */

        vm.checkAll = function (objeto) {
      		/*	Descripción: Función que controla el flag que permite marcar o desmarcar todas las filas de la tabla presentada en el html.
      			Entrada: objeto: parámetro con toda la información de la tabla. 
      					flag: parámetro que indica si se va a marcar o desmarcar.
	        	Salida: NA 	*/
	        vm.checkAllFlag = !vm.checkAllFlag;
            objeto.forEach(function(item, index){
                if(vm.checkAllFlag){
                    item.selected = true;
                    vm.showAgregarSeleccion = true;
                }
                else{
                    item.selected = false;
                    vm.showAgregarSeleccion = false;
                }
            });
            
        };

        vm.checkItem = function (objeto, dato) {
      		/*	Descripción: Función que controla el flag que permite mostrar o no el botón de Agregar Selección. Lo muestra si hay por lo menos una fila seleccionada en la tabla presentada en el html.
      			Entrada: objeto: parámetro con toda la información de la tabla.      					
	        	Salida: NA 	*/
	        dato.selected = !dato.selected;
            for (var i = 0; i < objeto.length; i++) {
            	if(objeto[i].selected){
            		vm.showAgregarSeleccion = true;
            		break;
            	}else{
            		vm.showAgregarSeleccion = false;
            	}
            }
        };

        vm.salir = function(){
            $window.sessionStorage.setItem("involucradosDataMarcados", angular.toJson(marcadosObjs));
            $location.path(urlRetorno);
        };

        vm.doSort = function (propName) {
            vm.sortBy = propName;
            vm.reverse = !vm.reverse;
        };

        vm.limpiar = function () {
            vm.marcados = [];
            vm.datosTabla = {};
            vm.filtroTipodoc = "";
            vm.filtroNumdoc = "";
            vm.filtroNombre = "";

        }

        $rootScope.$emit('menuEvent', true);

      }]);

})();