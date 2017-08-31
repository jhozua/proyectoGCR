/*
** Autor: Daniel Rodríguez
** Empresa: IBM
** Fecha: 31 Mayo 2017
** Archivo: treeTableService.js
** Descripción: Archivo JS en el que se define la factoria 'treeTableService', correspondiente al módulo treeTable.
*/
(function () {
    "use strict";
    angular.module("treeTable")
        .factory('treeTableService', ["$http", "$q", function ($http, $q) {

            var getData = function (path, relativePath, file) {
            /*  Descripción: Función que ejecuta una petición GET para consultar el contenido de un archivo JSON que se encuentra en este proyecto.
                Entrada: path: Valor con el path general donde se ubica el archivo JSON a leer.
                        relativePath: Valor con el path relativo donde se ubica el archivo JSON a leer.
                        file: nombre del archivo JSON a recuperar.
                Salida: Resultado promise de la petición http.  */
                var response = {};
                var deferred = $q.defer();
                $http({
                    method: "GET",
                    url: path + relativePath + file
                })
                .then(function (data) {
                    deferred.resolve(data.data);
                },
                function (data, status) {
                    response.data = data;
                    response.status = status;
                    deferred.reject(response);
                });
                return deferred.promise;
            };

            var calculateWidth = function (data) {
            /*  Descripción: Función que retorna el valor de ancho de columna calculado según la longitud del string de entrada.
                Entrada: data: Dato al que se le aplicará un cálculo para conocer el ancho.
                Salida: width: Valor del ancho de columna calculado.  */
                var width = 5;
                var consDecimal = 2;
                var thousandSeparator = 3;
                var pxWidthChar = 7;
                var pxWidthPoint = 4;
                var separator = 1;
                var longChar = String(data).length;
                var numberData = Number(data);
                var longCharSeparator = longChar;
                var decimal = (String(data).split('.')[1] || []).length;

                if (isNaN(data)) {

                } else {
                    if (numberData < 0) {
                        longCharSeparator--;
                    }
                    if (decimal === 0) {
                        longChar += consDecimal;
                    } else if (decimal > 0) {
                        longChar -= (decimal - consDecimal + separator);
                        longCharSeparator -= decimal + separator;
                    }
                    separator += Math.floor((longCharSeparator - 1) / thousandSeparator);
                    width += (longChar * pxWidthChar) + (separator * pxWidthPoint);
                }
                return width;
            };

            var validateWidth = function (row, col) {
            /*  Descripción: Función que asigna el ancho de toda la columna para el String más largo.
                Entrada: row: Objeto con las propiedades de la fila en particular.
                        col: Objeto con las propiedades de la columna en particular.
                Salida: Objeto con los atributos CSS asignados.  */
                if(row[col.propiedad] && calculateWidth(row[col.propiedad]) > Number(col.width)) {
                    col.width = calculateWidth(row[col.propiedad]);
                }
            };

            var cellStyle = function(firstElement, col, row, level, metadata){
            /*  Descripción: Función que asigna el estilo a las celdas recibidas como entrada.
                Entrada: firstElement: Longitud del String, al que se le aplicará un cálculo para conocer el ancho.
                        col: Objeto con las propiedades de la columna en particular.
                        row: Objeto con las propiedades de la fila en particular.
                        level: Valor con el nivel en la estructura jerarquica del árbol.
                        metadata: Metadata del componente.
                Salida: Objeto con los atributos CSS asignados.  */
                var color = "";
                var padding = 19 + (12 * Number(level));
                var styleAll = {};

                styleAll.width = col.width + "px";
                styleAll["min-width"] = col.width + "px";
                if(firstElement){
                    styleAll["padding-left"] = padding + "px";
                    if(metadata.modeColor && row.color !== undefined){
                        metadata.colorNode.forEach(function(item){
                            if(item.id == row.color){
                                color = item.color;
                            }
                        });
                        if(color !== ""){
                            styleAll.color = color;
                            styleAll["font-weight"] = "bold";
                        }
                    }
                }else{
                    validateWidth(row, col);
                    styleAll["text-align"] = "center";
                }
                if(row[col.propiedad] < 0) {
                    styleAll.color = metadata.colorNegativeCellValue;
                }
                return styleAll;
            };

            return {
                getData: getData,
                cellStyle: cellStyle
            };
        }]);
})();