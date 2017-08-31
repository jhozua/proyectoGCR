(function(){
    angular.module('adminBusinessModule')
      .controller('compararPCController', ['$window', '$rootScope', '$location', '$scope', 'businessAdminFactory', 'businessAdminServiciosComunes', 'ngProgressFactory', 'MENSAJES', 'constantes',
	  function($window, $rootScope, $location, $scope, businessAdminFactory, businessAdminServiciosComunes, ngProgressFactory, MENSAJES, constantes) {

       /* Inicio Declaración variables */
        var vm = this;
        vm.rutaCompararPC = constantes.url.compararPC;  

        //inicializa progress bar
        vm.progressbar = ngProgressFactory.createInstance();
        vm.progressbar.setHeight(constantes.progressBar.height);
        vm.progressbar.setColor(constantes.progressBar.color);


        /**
		 * carga de archivos de la izquierda
		 */
		vm.cargarArchivoIzquierda = function(){
			vm.progressbar.start(); //inicial progress bar
			$rootScope.$emit("alertEvent", {"show": false});
			var tmpFile = document.getElementById("archivoIzquierda").files[0];
			if("undefined" === typeof tmpFile){
				vm.missingFile = true;
			} else{
				vm.missingFile = false;
				var posicionArchivo = 'izquierda';
				var filePartName = 'dataFile';
				var fd = new FormData();
				fd.append(filePartName, tmpFile);
				businessAdminFactory.fileUpload(constantes.endpoints.consultaPC + posicionArchivo, fd)
				.then(
					function(success){
						var alertObject= {data: {mensaje: MENSAJES.COMPARAR_PC.CARGA_ARCHIVO.EXITO}, status: MENSAJES.TIPO.SUCCESS};
	 					businessAdminServiciosComunes.showAlert(alertObject);
	 					vm.progressbar.complete(); //finaliza progress bar
					},
                        function (error) {
                            businessAdminServiciosComunes.showAlert(error);
                            vm.progressbar.complete(); //finaliza progress bar
                        }
					);

			}
		};

		/**
		 * carga de archivos de la derecha
		 */
		vm.cargarArchivoDerecha = function(){
			vm.progressbar.start(); //inicial progress bar
			$rootScope.$emit("alertEvent", {"show": false});
			var tmpFile = document.getElementById("archivoDerecha").files[0];
			if("undefined" === typeof tmpFile){
				vm.missingFile = true;
			} else{
				vm.missingFile = false;
				var posicionArchivo = 'derecha';
				var filePartName = 'dataFile';
				var fd = new FormData();
				fd.append(filePartName, tmpFile);
				businessAdminFactory.fileUpload(constantes.endpoints.consultaPC + posicionArchivo, fd)
				.then(
					function(success){
						var alertObject= {data: {mensaje: MENSAJES.COMPARAR_PC.CARGA_ARCHIVO.EXITO}, status: MENSAJES.TIPO.SUCCESS};
	 					businessAdminServiciosComunes.showAlert(alertObject);
	 					vm.progressbar.complete(); //finaliza progress bar
					},
                        function (error) {
                            businessAdminServiciosComunes.showAlert(error);
                            vm.progressbar.complete(); //finaliza progress bar
                        }
					);

			}
		};

		vm.compararArchivosCargados = function(){
			vm.progressbar.start(); //inicial progress bar
			$rootScope.$emit("alertEvent", {"show": false});
			var fileDer = document.getElementById("archivoDerecha").files[0];
			var fileIzq = document.getElementById("archivoIzquierda").files[0];
			if ( (undefined === fileDer) || (undefined === fileIzq) ){
				var alertObject= {data: {descripcionError: MENSAJES.COMPARAR_PC.COMPARAR_ARCHIVOS.ERROR_COMPARACION}, status: MENSAJES.TIPO.ERROR};
	 			businessAdminServiciosComunes.showAlert(alertObject);
			}else{
				businessAdminFactory.fileDownload(constantes.endpoints.compararPC)
				.then(
					function(success){
						var blob = new Blob([success.data], {'type':"application/zip"}),
										objectUrl = URL.createObjectURL(blob),
										fileName = "ResultadoCompararPC.zip",
										fileResultLink = document.createElement('a');
						if($window.navigator && $window.navigator.msSaveBlob){ //para IE
			    			$window.navigator.msSaveBlob(blob, fileName);
						}else{ //Para los demas navegadores
							fileResultLink.href = objectUrl;
							fileResultLink.download = fileName;	
							fileResultLink.click();
						}
						var alertObject= {data: {mensaje: MENSAJES.COMPARAR_PC.COMPARAR_ARCHIVOS.EXITO_COMPARACION}, status: MENSAJES.TIPO.SUCCESS};
	 					businessAdminServiciosComunes.showAlert(alertObject);
	 					vm.progressbar.complete(); //finaliza progress bar
					},
                        function (error) {
                            businessAdminServiciosComunes.showAlert(error);
                            vm.progressbar.complete(); //finaliza progress bar
                        }
					);
			}
		}

        vm.salir = function () {
            /*  Descripción: Función que permite salir de la funcionalidad Administarcion de Catalogos y que lleva al usuario al menú principal de la aplicación SOR Corporativos.
                Entrada: NA
                Salida: NA  */

            $rootScope.$emit("alertEvent", {"show": false});
            $window.sessionStorage.clear();
            $location.path(constantes.url.main);
        };

        $rootScope.$emit('menuEvent', true);
 	
 	}]);
})();