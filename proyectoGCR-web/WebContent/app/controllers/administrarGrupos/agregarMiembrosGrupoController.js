/*

** Autor: Daniel Rodríguez
** Empresa: IBM
** Fecha: 28 Diciembre 2016
** Archivo: administrarGruposController.js
** Descripción: Archivo JS en el que se define la funcionalidad del controlador "agregarMiembrosGrupoController" asociado al html "administrarGrupos.html".

*/

(function(){
    angular.module('adminBusinessModule')
      .controller('agregarMiembrosGrupoController', ['$window', '$rootScope', '$location', '$scope', 'businessAdminFactory', 'businessAdminServiciosComunes', 'ngProgressFactory', 'MENSAJES', 'constantes',
	  function($window, $rootScope, $location, $scope, businessAdminFactory, businessAdminServiciosComunes, ngProgressFactory, MENSAJES, constantes) {

      	/* Inicio Declaración variables */
      	var vm = this;
      	vm.opcionesAgregar = [{label:"Grupo", opc:"grupo"}, {label:"Empresa", opc:"empresa"}];
      	vm.opcionSeleccionada = vm.opcionesAgregar[0].opc;
      	vm.tableColumns = {grupos:[{label:"Código Grupo", property:"codigo"}, {label:"Nombre Grupo", property:"nombre"}],
		  empresa:[{label:"Tipo Identificación", property:"tipoIdentInvlucrado", subProperty:"descripcion"},
		  {label:"No Identificación", property:"numIdentificInvolucrado"},
		  {label:"Dígito ver.", property:"digitoVerificacionInvolucr"},
		  {label:"Nombre Empresa", property:"nombreRazonSocial"}]};
      	/* Fin Declaración variables */

      	/* Inicio Lógica Controlador (ejecutada al cargar este controlador) */
        $rootScope.$emit("alertEvent", {"show": false});
      	vm.miembrosGrupo = JSON.parse($window.sessionStorage.getItem("objMiembrosGrupo"));
      	vm.variables = JSON.parse($window.sessionStorage.getItem("flags"));
      	vm.progressbar = ngProgressFactory.createInstance();
        vm.progressbar.setHeight(constantes.progressBar.height);
        vm.progressbar.setColor(constantes.progressBar.color);

      	if (vm.variables === null || vm.variables === undefined) {
            vm.variables = {};
        }
      	if (vm.variables === null || vm.variables === undefined) {
            vm.variables = {};
        }        
        vm.variables.showGrupos = true;
        vm.variables.showAgregarSeleccion = false;

		vm.grupoPadre = JSON.parse($window.sessionStorage.getItem("objGrupoPadre"));      

      	businessAdminFactory.getData(constantes.endpoints.consultarListaProceso + constantes.parametrias.listaTiposDocumentoId, constantes.noCache)
            .then(
                function(result){
					vm.listaTipoIdentificacion = result.data.datos;                
                }, 
                function(error){
                    console.log("Error en la consulta: " + JSON.stringify(error));
                }
            );
        /* Fin Lógica Controlador */

    	/* Inicio Sección Funciones Controlador */
      	vm.tipoAgregar = function () {
      		/*	Descripción: Función que permite cambiar un flag que controla el show de las secciones de agregar Grupos ó Empresas. 
      			Entrada: NA
	        	Salida: NA 	*/
			
			
      		vm.variables.showGrupos = !vm.variables.showGrupos;
			/*  Le asigna el arreglo de resultados a vm.objNegocio, si tiene datos.
				Es decir, si se consultan grupos, se cambia el tipoAgregar a Empresas y se retorna, 
				se le asigna el arreglo de grupos previamente consultados a vm.objNegocio.
				Viceversa para empresas. */
			if(vm.variables.showGrupos && vm.gruposDisponibles.datos.length > 0){
				vm.objNegocio = vm.gruposDisponibles;
			}
			else if(vm.variables.showGrupos && vm.gruposDisponibles.datos.length === 0){
				vm.gruposDisponibles.datos = undefined;
			}
			else if(!vm.variables.showGrupos && vm.empresasDisponibles.datos.length > 0){
				vm.objNegocio = vm.empresasDisponibles;
			}
			else{
				vm.empresasDisponibles.datos = undefined;
			}
      	};
      	
        vm.consultarGrupos = function(codigoGrupo, nombreGrupo, pagina){
      		/*	Descripción: Función que permite realizar la consulta de los grupos disponibles para agregar consumiendo un servicio REST. 
      			Entrada: codigoGrupo: parámetro que se envía en el consumo del servicio.
      					nombreGrupo: parámetro que se envía en el consumo del servicio.
      					pagina: parámetro que se envía en el consumo del servicio.
	        	Salida: NA 	*/
	        $rootScope.$emit("alertEvent", {"show": false});
	        vm.gruposDisponibles = [];
	        vm.progressbar.start();
			var codigoGrupoActual = "";
			if(vm.grupoPadre !== null && vm.grupoPadre !== undefined && !businessAdminServiciosComunes.isObjectEmpty(vm.grupoPadre) && vm.grupoPadre.codigo !== undefined){
				codigoGrupoActual = vm.grupoPadre.codigo;
			}
            if(codigoGrupo === undefined)
                codigoGrupo = "";
            if(nombreGrupo === undefined)
                nombreGrupo = "";
            if(pagina === undefined)
                pagina = 1;
        	businessAdminFactory.getData(constantes.endpoints.consultarGruposAgregar+codigoGrupoActual+constantes.separador+nombreGrupo+constantes.separador+codigoGrupo, constantes.noCache, pagina)
			.then(
				function(result){
					vm.progressbar.complete();
					vm.variables.showAgregarSeleccion = false;
					vm.gruposDisponibles = result.data;
					vm.objNegocio = vm.gruposDisponibles;
                    vm.paginasAgregarGrupos = businessAdminServiciosComunes.calcularPaginas(vm.gruposDisponibles);
				}, 
				function(error){
					vm.progressbar.complete();
					businessAdminServiciosComunes.showAlert(error);
				}
			);
        };

        vm.consultarEmpresas = function (tipoIdenEmpresa, numeroIdenEmpresa, nombreEmpresa, pagina) {
      		/*	Descripción: Función que permite realizar la consulta de las empresas disponibles para agregar consumiendo un servicio REST. 
      			Entrada: tipoIdenEmpresa: parámetro que se envía en el consumo del servicio. 
      					numeroIdenEmpresa: parámetro que se envía en el consumo del servicio.
      					nombreEmpresa: parámetro que se envía en el consumo del servicio.
	        	Salida: NA 	*/
	        $rootScope.$emit("alertEvent", {"show": false});
	        vm.empresasDisponibles = [];
	        vm.progressbar.start();
        	if(tipoIdenEmpresa === undefined || tipoIdenEmpresa === null){
                tipoIdenEmpresa = "";
        	}else{
            	tipoIdenEmpresa = tipoIdenEmpresa.codigoParametro;
        	}            
        	if(numeroIdenEmpresa === undefined)
                numeroIdenEmpresa = "";

            if(nombreEmpresa === undefined)
                nombreEmpresa = "";
            if(pagina === undefined)
                pagina = 1;            
        	businessAdminFactory.getData(constantes.endpoints.consultarEmpresasAgregar+tipoIdenEmpresa+constantes.separador+numeroIdenEmpresa+constantes.separador+nombreEmpresa, constantes.noCache, pagina)
			.then(
				function(result){
					vm.progressbar.complete();
					vm.variables.showAgregarSeleccion = false;
					vm.empresasDisponibles = result.data;
					vm.objNegocio = vm.empresasDisponibles;
                    vm.paginasAgregarEmpresa = businessAdminServiciosComunes.calcularPaginas(vm.empresasDisponibles);
				}, 
				function(error){
					vm.progressbar.complete();
                    businessAdminServiciosComunes.showAlert(error);
				}
			);
        };

        vm.doSort = function (propName) {
      		/*	Descripción: Función que setea las variables referentes al manejo del ordenamiento de la tabla presentada en el html.
      			Entrada: propName: parámetro correspondiente al nombre de la propiedad de la columna a ordenar. 
	        	Salida: NA 	*/          	
            vm.sortBy = propName;
            vm.reverse = !vm.reverse;
        };

        vm.checkAll = function (objeto) {
      		/*	Descripción: Función que controla el flag que permite marcar o desmarcar todas las filas de la tabla presentada en el html.
      			Entrada: objeto: parámetro con toda la información de la tabla. 
      					flag: parámetro que indica si se va a marcar o desmarcar.
	        	Salida: NA 	*/
	        vm.checkAllFlag = !vm.checkAllFlag;
            objeto.forEach(function(item, index){
                if(vm.checkAllFlag){
                    item.selected = true;
                    vm.variables.showAgregarSeleccion = true;
                }
                else{
                    item.selected = false;
                    vm.variables.showAgregarSeleccion = false;
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
            		vm.variables.showAgregarSeleccion = true;
            		break;
            	}else{
            		vm.variables.showAgregarSeleccion = false;
            	}
            }
        };

        vm.atrasGrupo = function () {
      		/*	Descripción: Función que permite ir a la pantalla anterior.
      			Entrada: NA     					
	        	Salida: NA 	*/
        	$window.sessionStorage.setItem("objMiembrosGrupo", angular.toJson(vm.miembrosGrupo));
        	$location.path(constantes.url.grupos);
        };

        vm.paginaSeleccionada = function (pagina, accion) {
      		/*	Descripción: Función que permite realizar el manejo de la paginación de la tabla presentada en el html.
      			Entrada: pagina: parámetro con la información de la página seleccionada.   
      					accion: parámetro con la información de la acción a ejecutar en la paginación (anterior ó siguiente).
	        	Salida: NA 	*/
            var existePag;
            var buscaPag;
            if(accion == constantes.accionPaginacion.siguiente){
                buscaPag = vm.paginasAgregarGrupos.paginaActual + 1;
                existePag = vm.paginasAgregarGrupos.arrayTotalPaginas.indexOf(buscaPag);
                if(existePag >= 0)
                    vm.consultarGrupos(vm.codigoGrupo, vm.nombreGrupo, buscaPag);
            }else if(accion == constantes.accionPaginacion.anterior){
                buscaPag = vm.paginasAgregarGrupos.paginaActual - 1;
                existePag = vm.paginasAgregarGrupos.arrayTotalPaginas.indexOf(buscaPag);
                if(existePag >= 0)
                    vm.consultarGrupos(vm.codigoGrupo, vm.nombreGrupo, buscaPag);
            }else{
                if(pagina != vm.paginasAgregarGrupos.paginaActual)
                    vm.consultarGrupos(vm.codigoGrupo, vm.nombreGrupo, pagina);                
            }
        };

        vm.paginaSeleccionadaEmpresa = function (pagina, accion) {
      		/*	Descripción: Función que permite realizar el manejo de la paginación de la tabla presentada en el html.
      			Entrada: pagina: parámetro con la información de la página seleccionada.   
      					accion: parámetro con la información de la acción a ejecutar en la paginación (anterior ó siguiente).
	        	Salida: NA 	*/
            var existePag;
            var buscaPag;
            if(accion == constantes.accionPaginacion.siguiente){
                buscaPag = vm.paginasAgregarEmpresa.paginaActual + 1;
                existePag = vm.paginasAgregarEmpresa.arrayTotalPaginas.indexOf(buscaPag);
                if(existePag >= 0)
                    vm.consultarEmpresas(vm.tipo, vm.identEmpresa, vm.nombreEmpresa, buscaPag);
            }else if(accion == constantes.accionPaginacion.anterior){
                buscaPag = vm.paginasAgregarEmpresa.paginaActual - 1;
                existePag = vm.paginasAgregarEmpresa.arrayTotalPaginas.indexOf(buscaPag);
                if(existePag >= 0)
                    vm.consultarEmpresas(vm.tipo, vm.identEmpresa, vm.nombreEmpresa, buscaPag);
            }else{
                if(pagina != vm.paginasAgregarEmpresa.paginaActual)
                    vm.consultarEmpresas(vm.tipo, vm.identEmpresa, vm.nombreEmpresa, pagina);                
            }
        };        

        vm.agregarSeleccion = function (objeto) {    
      		/*	Descripción: Función que permite agregar las filas seleccionadas al objeto de negocio recibido en el parámetro.
      			Entrada: objeto: parámetro con toda la información de la tabla.      					
	        	Salida: NA 	*/         	
        	var algunAgregado = false;
        	var yaAgregado = false;
        	var algunAgregadoAntes = false;
    			objeto.datos.forEach(function(item, index) {
    				yaAgregado = false;
    				if(item.selected){
    					var id = item.idGrupoRiesgo === undefined ? "idInvolucrado" : "idGrupoRiesgo";
    					if(vm.miembrosGrupo.datos.length > 0 && vm.miembrosGrupo.datos[0].miembro !== undefined){
    						for (var i = vm.miembrosGrupo.datos.length - 1; i >= 0 ; i--) {
    							if(vm.miembrosGrupo.datos[i].miembro[id] == item[id]){
    								if(item.deleted === undefined || item.deleted === false){
    									yaAgregado = true;
    									algunAgregadoAntes = true;
    								}								
    							}
    						}
    					}
    					if(!yaAgregado){
    						algunAgregado = true;
    						if(item.nombre){
    							item.nombreRazonSocial = item.nombre;
    						}
    						var itemMiembro = {miembro:item};
    						itemMiembro.accion = "I";
    						itemMiembro.selected = false;
    						if(vm.miembrosGrupo.datos.length > 0 && vm.miembrosGrupo.datos[0].miembro === undefined ){
    							//se elimina el primer elemento del arreglo, pues únicamente contiene al padre
    							//ocurre cuando el grupo se crea sin miembros
    							vm.miembrosGrupo.datos.splice(0,1);
    						}
    						vm.miembrosGrupo.datos.push(itemMiembro);
    					}
    				}
    			});
          var alertObject;
    		if(!algunAgregadoAntes && algunAgregado){
            	alertObject = {data: {mensaje: MENSAJES.GRUPOS.MIEMBROS.AGREGAR.TODOS}, status: MENSAJES.TIPO.SUCCESS};
    		}
			else if(algunAgregadoAntes && algunAgregado){
    			alertObject = {data: {descripcionError: MENSAJES.GRUPOS.MIEMBROS.AGREGAR.ALGUNOS}, status: MENSAJES.TIPO.INFO};
    		}
			else{
    			alertObject = {data: {descripcionError: MENSAJES.GRUPOS.MIEMBROS.AGREGAR.NINGUNO}, status: MENSAJES.TIPO.WARNING};
    		}
		businessAdminServiciosComunes.showAlert(alertObject);
          vm.variables.showAgregarSeleccion = false;
          vm.checkAllFlag = false;
          vm.gruposDisponibles = [];
          vm.empresasDisponibles = [];
        };

        $rootScope.$emit('menuEvent', true);
        /* Fin Sección Funciones Controlador */
      }]);
})();