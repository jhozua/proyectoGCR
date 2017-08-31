(function(){
    angular.module('adminBusinessModule')
      .factory("businessAdminServiciosComunes", function($rootScope, MENSAJES, constantes){

			var calcularPaginas = function(data){
	            var arrayTotalPaginas = [];
	            var paginaActual = Number(data.paginaSolicitada);
	            var totalPaginas = Number(data.totalPaginas);
	            for (var i = 1; i <= totalPaginas; i++) {
	                arrayTotalPaginas.push(i);
	            }
	            return ({paginaActual: paginaActual, totalPaginas: totalPaginas, arrayTotalPaginas: arrayTotalPaginas});
			};
			var showAlert = function(object){
				var type = constantes.tipoAlerta.error;
                var icon = constantes.iconAlerta.error;
                var msg = MENSAJES.ERROR.GENERAL;
                
                if(object.status == -1)
                    msg = MENSAJES.ERROR.COMUNICACION;
                else if(object.status == 404){
                    type = constantes.tipoAlerta.info;
                    icon = constantes.iconAlerta.info;
                    msg = object.data.descripcionError;
                }
                else if(object.status == 406){
                    type = constantes.tipoAlerta.warning;
                    icon = constantes.iconAlerta.warning;
                    msg = object.data.descripcionError;
                }
                else if(object.status == 412){
                    type = constantes.tipoAlerta.warning;
                    icon = constantes.iconAlerta.warning;
                    msg = object.data.descripcionError;                	
                }
                else if(object.status == 500){
                    msg = object.data.descripcionError;                	
                }
                else if(object.status == 200 || object.status == 201){
                    type = constantes.tipoAlerta.success;
                    icon = constantes.iconAlerta.success;
                    msg = object.data.mensaje;                	
                }

                $rootScope.$emit("alertEvent", {
                    "message": msg, 
                    "type": type, 
                    "icon": icon, 
                    "show": true});                    
                //console.log("Respuesta Servicio: " + JSON.stringify(object));
			};
            var isObjectEmpty = function(object){
                return Object.keys(object).length === 0 && object.constructor === Object;
            };
            var checkedInList = function(object, property){
                var checked = false;
                if(object !== undefined && object !== null && property !== undefined && property !== null){
                    object.forEach(function(item, index){
                        if(item[property])
                            checked = true;
                    });
                }
                return checked;
            };
            var checkedInListNumber = function(object, property){
                var checked = 0;
                if(object !== undefined && object !== null && property !== undefined && property !== null){
                    object.forEach(function(item, index){
                        if(item[property])
                            checked++;
                    });
                }
                return checked;
            };
            var checkAll = function (list, property, flag, trueValue, falseValue) {
                if(list !== undefined && list !== null && property !== undefined && property !== null){
                    if(trueValue === undefined || trueValue === null)
                        trueValue = true;
                    if(falseValue === undefined || falseValue === null)
                        falseValue = false;
                    list.forEach(function(item, index){
                        item[property] = (flag) ? trueValue : falseValue;
                    });
                }
                return list;
            };
            var checkUndefined = function (value) {
            /*  Descripción: Función encargada de validar si el valor que llega corresponde a alguna homologación del valor undefinido. En caso afirmativo retorna 'false'.
                Entrada: value: Valor a homologar.
                Salida: Boolean con el resultado de la validación de la homologación.  */
                switch(value){
                    case "undefined":
                    case "null":
                    case "":
                    case false:
                    case null:
                    case undefined:
                        return false;
                    default:
                        return true;
                }
            };
            var isTrue = function (value){
            /*  Descripción: Función encargada de validar si el valor que llega corresponde a alguna homologación del valor true. En caso afirmativo retorna 'true'.
                Entrada: value: String, number ó boolean con el valor a homologar.
                Salida: Boolean con el resultado de la validación de la homologación.  */
                if (typeof(value) == 'string'){
                    value = value.toLowerCase();
                }

                switch(value){
                    case true:
                    case "true":
                    case 1:
                    case "1":
                    case "on":
                    case "yes":
                    case "s":
                        return true;
                    default:
                        return false;
                }
            };
            var validarComiteUnipersonal = function (comite) {
                var respuesta = 0;
                if (comite && isTrue(comite.fUnipersonal) && comite.comiteXParticipanteComites && comite.comiteXParticipanteComites.length > 0) {
                    comite.comiteXParticipanteComites.forEach(function(item){
                        if (item.participanteComite.accion != constantes.accionServiciosRest.eliminar) {
                            respuesta++;
                        }
                    });
                }
                return respuesta;
            }
        return {
            calcularPaginas: calcularPaginas,
            showAlert: showAlert,
            isObjectEmpty: isObjectEmpty,
            checkedInList: checkedInList,
            checkedInListNumber: checkedInListNumber,
            checkAll: checkAll,
            checkUndefined: checkUndefined,
            isTrue: isTrue,
            validarComiteUnipersonal: validarComiteUnipersonal
        };
	});
})();