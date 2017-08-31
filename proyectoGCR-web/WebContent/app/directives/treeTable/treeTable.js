/*
** Autor: Daniel Rodríguez
** Empresa: IBM
** Fecha: 31 Mayo 2017
** Archivo: treeTable.js
** Descripción: Archivo JS en el que se define la directiva 'treeTableComponent', la cual va a renderizar el árbol (estructura jerárquica) en el módulo treeTable.
*/
(function(){
    "use strict";
    angular.module("treeTable",[])
    .constant("CONSTANTS", {
        "ARROW_UP_KEYCODE": 38,
        "ARROW_DOWN_KEYCODE": 40,
        "ARROW_LEFT_KEYCODE": 37,
        "ARROW_RIGHT_KEYCODE": 39,
        "relativePathTemplates": "/treeTable/templates/",
        "relativePathJSON": "/treeTable/json/",
        "treeStructureJSON": "treeStructure.json",
        "parentView": "treeTableComponentTmpl.html",
        "childView": "treeTableNodeTmpl.html"
    })
    .directive("treeTableComponent", function(){
        /* Directiva Padre*/
        return {
            restrict : "E",
            scope : {},
            bindToController : {
                callbackFunction:"=",
                treetableFunction:"=",
                path: "="
            },
            template: '<ng-include src="tTable.getTemplateUrl()"/>',
            controller : function(treeTableService, $scope, $element, $window, $rootScope, CONSTANTS){

                /* Inicio Sección para declarar variables scope del controlador. */
                var vm = this;
                var id = -1;
                vm.notFound = true;
                vm.monedaPC = "COP";
                vm.stateDefault = "DEFAULT";
                vm.nodeType = "type";
                vm.mainNode = {empresa:"empresa", totales: "totales", modalidad: "modalidad", modalidadComparte: "modComparte"};
                vm.metadataTreeProperties = {process:"process",  milestone:"milestone", reading:"reading", role: "role", state: "state"};
                vm.metadataNodeProperties = {type:"type", parentMode:"parentMode", disabled:"disabled", expired:"expired"};
                vm.foundNode = [];
                vm.foundTree = [];
                vm.tiposMoneda = [];
                /* Fin Sección para declarar variables scope del controlador. */

                /* Inicio Sección Funciones Controlador. */
                /* Inicio Sección Funciones generales controlador. */
                /* Inicio función que retorna la url y archivo html correspondiente a la directiva padre (fila). */
                vm.getTemplateUrl = function(){
                    return vm.path + CONSTANTS.relativePathTemplates + CONSTANTS.parentView;
                };
                /* Fin función que retorna la url y archivo html correspondiente a la directiva padre (fila). */
                /* Inicio función que está escuchando un evento en particular del controlador hijo. Ejecuta la función que se encarga de seleccionar la fila. */
                $rootScope.$on("clickEvent", function(e, argument){
                    vm.selectingRow(argument.row);
                });
                /* Fin función que está escuchando un evento en particular del controlador hijo. Ejecuta la función que se encarga de seleccionar la fila. */
                /* Inicio función que establece un estilo al elemento que reciba y encargada de ejecutar una función afuera de esta directiva con el fin de enviar la información del nodo seleccionado.*/
                vm.selectingRow = function(row){
                    vm.clearSelected(vm.tableData);
                    row.focused = true;
                    var newRow = JSON.parse(JSON.stringify(row));
                    if(newRow.childrens){
                        delete newRow.childrens;
                    }
                    vm.treetableFunction(newRow);
                };
                /* Fin función que establece un estilo al elemento que reciba y encargada de ejecutar una función afuera de esta directiva con el fin de enviar la información del nodo seleccionado.*/
                /* Inicio función que permite remover la clase focused de todos los elementos del árbol. */
                vm.clearSelected = function(tree){
                    tree.forEach(function(item){
                        if(item.childrens){
                            vm.clearSelected(item.childrens);
                        }
                        item.focused = false;
                    });
                };
                /* Fin función que permite remover la clase focused de todos los elementos del árbol. */
                /* Inicio Función que está escuchando un evento en particular del controlador hijo. Esta función es encargada de construir el menú contextual con las opciones que correspondam. */
                $rootScope.$on("contextMenuEvent", function(e, argument){
                    vm.selectingRow(argument.row);
                    if(argument.show && !vm.tableData[0][vm.metadataTreeProperties.reading]){
                        vm.node = argument.row;
                        vm.contextMenuOptions = [];
                        vm.contextMenu.forEach(function(item){
                            if(item[vm.metadataTreeProperties.process] == vm.tableData[0][vm.metadataTreeProperties.process]){
                                if(item[vm.metadataNodeProperties.type] == vm.node[vm.metadataNodeProperties.type]){
                                    if(item[vm.metadataTreeProperties.milestone] == vm.tableData[0][vm.metadataTreeProperties.milestone]){
                                        if(item[vm.metadataTreeProperties.role] == vm.tableData[0][vm.metadataTreeProperties.role]){
                                            item.actions.forEach(function(item1){
                                                vm.contextMenuActions.forEach(function(item2){
                                                    if(item1 == item2.action){
                                                        if(vm.node[vm.metadataNodeProperties.disabled]) {
                                                            if(vm.disabledAction[item1]){
                                                                vm.contextMenuOptions.push(item2);
                                                            }
                                                        } else {
                                                            if(vm.mainNode.modalidad == vm.node.type && vm.parentModeAction == item1){
                                                                if(vm.node[vm.metadataNodeProperties.parentMode]){
                                                                    vm.contextMenuOptions.push(item2);
                                                                }
                                                            }else{
                                                                if(vm.disabledAction[item1] || vm.disabledAction[item1] === false){
                                                                    if(!vm.node[vm.metadataNodeProperties.disabled] && !vm.disabledAction[item1]){
                                                                        vm.contextMenuOptions.push(item2);
                                                                    }
                                                                }else{
                                                                    vm.contextMenuOptions.push(item2);
                                                                }
                                                            }
                                                        }
                                                    }
                                                });
                                            });
                                        }
                                    }
                                }
                            }
                        });
                        if(vm.contextMenuOptions.length > 0){
                            vm.showContextMenu = true;
                        }
                        angular.element($element.children()[0].children[1]).css({"display": "block", "top": argument.yPosition+"px", "left": argument.xPosition+"px"});

                    }else{
                        vm.showContextMenu = false;
                    }
                });
                /* Fin Función que está escuchando un evento en particular del controlador hijo. Esta función es encargada de construir el menú contextual con las opciones que correspondam. */
                /* Inicio Función que permite ejecutar la función correspondiente al nombre que se reciba de afuera de la directiva treeTable. */
                vm.callbackFunction = function (params){
                    vm.notFound = true;
                    if(params.id){
                        switch(params.id){
                            case "treeDataLoad":
                                vm.treeDataLoad(params);
                                break;
                            case "addRow":
                                vm.addRow(vm.tableData, params.params);
                                if(vm.notFound){
                                    console.log("Id no encontrado en la estructura de datos: "+params.params.node);
                                }
                                break;
                            case "delRow":
                                vm.delRow(vm.tableData, params.params);
                                if(vm.notFound){
                                    console.log("Id no encontrado en la estructura de datos: "+params.params.node);
                                }
                                break;
                            case "disableRow":
                                vm.disableRow(vm.tableData, params.params);
                                if(vm.notFound){
                                    console.log("Id no encontrado en la estructura de datos: "+params.params.node);
                                }
                                break;
                            case "enableRow":
                                vm.enableRow(vm.tableData, params.params);
                                if(vm.notFound){
                                    console.log("Id no encontrado en la estructura de datos: "+params.params.node);
                                }
                                break;
                            case "selectRow":
                                vm.selectRow(vm.tableData, params.params);
                                if(vm.notFound){
                                    console.log("Id no encontrado en la estructura de datos: "+params.params.node);
                                }
                                break;
                            default:

                                break;
                        }
                    }
                };
                /* Fin Función que permite ejecutar la función correspondiente al nombre que se reciba de afuera de la directiva treeTable. */
                /* Inicio Función que permite borrar los cálculos realizados en el arreglo de subtotales por empresa. */
                vm.restartSubtotalColumns = function(){
                    vm.subtotalColumns.forEach(function(item){
                        item.valores = [];
                    });
                };
                /* Fin Función que permite borrar los cálculos realizados en el arreglo de subtotales por empresa. */
                /* Inicio Función que asigna el estilo a las columnas del Header del componente treeTable. */
                vm.columnStyle = function(width){
                    var styleAll = {};
                    styleAll.width = width + "px";
                    styleAll["min-width"] = width + "px";
                    return styleAll;
                };
                /* Fin Función que asigna el estilo a las columnas del Header del componente treeTable. */
                /* Fin Sección Funciones generales controlador. */

                /* Inicio Sección Funciones asociadas al Context Menu. */
                /* Inicio Función que se ejecuta al seleccionar una opción del context menu. */
                vm.itemContexMenu = function(option){
                    vm.showContextMenu = false;
                    var row = JSON.parse(JSON.stringify(vm.node));
                    row.action = vm.contextMenuOptions[option].action;
                    if(row.childrens){
                        delete row.childrens;
                    }
                    vm.treetableFunction(row);
                };
                /* Fin Función que se ejecuta al seleccionar una opción del context menu. */
                /* Inicio Función para ocultar el contextMenu cuando el puntero del mouse se sale del área de este elemento. */
                vm.mouseleaveContextMenu = function (){
                    if(vm.showContextMenu){
                        vm.showContextMenu = !vm.showContextMenu;
                    }
                };
                /* Fin Función para ocultar el contextMenu cuando el puntero del mouse se sale del área de este elemento. */
                /* Fin Sección Funciones asociadas al Context Menu. */

                /* Inicio Sección funciones que pueden ser invocadas desde afuera de la directiva treeTable. */
                /* Inicio Función que permite inicializar el árbol con la información estructurada (json) recibida cómo parámetro. */
                vm.treeDataLoad = function(data){
                    treeTableService.getData(vm.path, CONSTANTS.relativePathJSON, CONSTANTS.treeStructureJSON)
                        .then(
                            function(success){
                                vm.tableData = [];
                                vm.tableData.push(data.params);
                                vm.validateMetadata(vm.tableData, success.columns, vm.stateDefault);
                                vm.metaData = success;
                                vm.metaData.columns = vm.metaData.columns[vm.state];
                                vm.tiposMoneda = [];
                                vm.columns = success.columns;
                                vm.contextMenu = success.contextMenu;
                                vm.contextMenuActions = success.contextMenuActions;
                                vm.subtotalColumns = success.subtotalColumns;
                                vm.parentModeAction = success.parentModeAction;
                                vm.disabledAction = success.disabledAction;
                                vm.monedaTRM = success.monedaTRM;
                                vm.restartSubtotalColumns();
                                vm.iterateEmpresa(vm.tableData);
                                vm.validateExpired(vm.tableData);
                                if (data.nodeSelected) {
                                    vm.selectRow(vm.tableData, {"node": data.nodeSelected});
                                } else {
                                    vm.selectingRow(vm.tableData[0]);
                                }
                            },
                            function(error){
                                console.log(error);
                            }
                        );
                };
                /* Fin Función que permite inicializar el árbol con la información estructurada (json) recibida cómo parámetro. */
                /* Inicio Función que permite validar si el nodo empresa ya caducó. Si es así poner estilo a sus hijos. */
                vm.validateExpired = function (tree) {
                    for (var index = 0; index < tree.length; index++) {
                        if(tree[index].childrens)
                            vm.validateExpired(tree[index].childrens);
                        if(tree[index].expired && (tree[index][vm.nodeType] == vm.mainNode.empresa)) {
                            vm.applyChildren(tree[index].childrens, true, vm.metadataNodeProperties.expired);
                        }
                        /* Se aprovecha el recorrido de todos los nodos para evaluar las modalidades que son compartidas, en caso tal, se crea una fila en blanco arriba de dicha modalidad. */
                        if(tree[index][vm.nodeType] == vm.mainNode.modalidadComparte) {
                            var row = {name:" --- "};
                            row.id = id;
                            tree.splice(index,0,row);
                            id--;
                            index++;
                        }
                    }
                };
                /* Fin Función que permite validar si el nodo empresa ya caducó. Si es así poner estilo a sus hijos. */
                /* Inicio Función que permite añadir una fila hija en un nodo específico del árbol. */
                vm.addRow = function(tree, data){
                    if(tree)
                        tree.forEach(function(item){
                            if(item.childrens)
                                vm.addRow(item.childrens, data);
                            if(item.id == data.node){
                                if(item.childrens === undefined)
                                    item.childrens = [];
                                item.childrens.push(data.row);
                                vm.selectingRow(item.childrens[0]);
                                vm.notFound = false;
                            }
                        });
                };
                /* Fin Función que permite añadir una fila hija en un nodo específico del árbol. */
                /* Inicio Función que permite eliminar un nodo (y sus hijos) específico del árbol. */
                vm.delRow = function(tree, data, parent){
                    if(tree)
                        tree.forEach(function(item, index){
                            if(item.childrens){
                                vm.delRow(item.childrens, data , item);
                            }
                            if(item.id == data.node){
                                tree.splice(index,1);
                                vm.notFound = false;
                                if(parent)
                                    vm.selectingRow(parent);
                            }
                        });
                };
                /* Fin Función que permite eliminar un nodo (y sus hijos) específico del árbol. */
                /* Inicio Función que consulta el subárbol asociado al id de entrada, para deshabilitar todos sus hijos. */
                vm.disableRow = function(tree, data){
                    if(tree)
                        tree.forEach(function(item){
                            if(item.childrens)
                                vm.disableRow(item.childrens, data);
                            if(item.id == data.node){
                                vm.selectingRow(item);
                                vm.notFound = false;
                                item.disabled = true;
                                if(item.childrens)
                                    vm.applyChildren(item.childrens, true, vm.metadataNodeProperties.disabled);
                            }
                        });
                };
                /* Fin Función Función que consulta el subárbol asociado al id de entrada, para deshabilitar todos sus hijos. */
                /* Inicio Función que consulta el subárbol asociado al id de entrada, para habilitar todos sus hijos. */
                vm.enableRow = function(tree, data){
                    if(tree)
                        tree.forEach(function(item){
                            if(item.childrens)
                                vm.enableRow(item.childrens, data);
                            if(item.id == data.node){
                                vm.selectingRow(item);
                                vm.notFound = false;
                                item.disabled = false;
                                if(item.childrens)
                                    vm.applyChildren(item.childrens, false, vm.metadataNodeProperties.disabled);
                            }
                        });
                };
                /* Fin Función que consulta el subárbol asociado al id de entrada, para habilitar todos sus hijos. */
                /* Inicio Función que consulta el subárbol asociado al id de entrada, para seleccionar visualmente en el componente. */
                vm.selectRow = function(tree, data){
                    if(tree){
                        for (var i = tree.length - 1; i >= 0; i--) {
                            if(tree[i].childrens)
                                vm.selectRow(tree[i].childrens, data);
                            if(tree[i].id == data.node){
                                vm.selectingRow(tree[i]);
                                vm.notFound = false;
                                break;
                            }
                        }
                    }
                };
                /* Fin Función que consulta el subárbol asociado al id de entrada, para seleccionar visualmente en el componente. */
                /* Fin Sección funciones que pueden ser invocadas desde afuera de la directiva treeTable. */

                /* Inicio Sección funciones asociadas a operaciones sobre la estructura del árbol. */
                /* Inicio función que valida si las propiedades definidas de metadata del árbol existen en la estructura de datos entregada al componente. */
                vm.validateMetadata = function (tree, columns, stateDefault){
                    var properties = Object.keys(vm.metadataTreeProperties);
                    properties.forEach(function(item){
                        if(item == vm.metadataTreeProperties.state) {
                            if(tree[0][item] && columns[tree[0][item]]) {
                                vm.state = tree[0][item];
                            } else {
                                vm.state = stateDefault;
                            }
                        }
                    });
                };
                /* Fin función que valida si las propiedades definidas de metadata del árbol existen en la estructura de datos entregada al componente. */
                /* Inicio Función que permite recorrer todos los nodos(filas) del árbol y llamar a otra función por cada nodo. */
                vm.calculateTotals = function(tree){
                    tree.forEach(function(item){
                        if(item.childrens)
                            vm.calculateTotals(item.childrens);
                        vm.calculateSubtotals(item);
                    });
                    vm.tiposMoneda.sort();
                    vm.tiposMoneda.reverse();
                };
                /* Fin Función que permite recorrer todos los nodos(filas) del árbol y llamar a otra función por cada nodo. */
                /* Inicio Función que permite realizar las suma de los valores de cada columna por tipo de moneda. */
                vm.calculateSubtotals = function(row){
                    vm.subtotalColumns.forEach(function(item){
                        var encontrarTipoMoneda = 0;
                        if(row[item.propiedad] && row.type == vm.mainNode.modalidad){
                            item.valores.forEach(function(item1){
                                if(item1.text == row.moneda){
                                    item1.valor += Number(row[item.propiedad]);
                                    encontrarTipoMoneda = 1;
                                }
                            });
                            if(encontrarTipoMoneda === 0){
                                var existeMoneda = vm.tiposMoneda.indexOf(row.moneda);
                                if(existeMoneda == -1)
                                    vm.tiposMoneda.push(row.moneda);
                                item.valores.push({text:row.moneda, valor:Number(row[item.propiedad])});
                            }
                        }
                    });
                };
                /* Fin Función que permite realizar las suma de los valores de cada columna por tipo de moneda. */
                /* Inicio Función que permite insertar las filas de subtotales y Totales en el árbol. */
                vm.insertTotalRows = function(tree){
                    var rowTotal = {};
                    var indexTotales = 0;
                    var valor = 0;
                    if(tree[0].childrens.length > 0 && tree[0].childrens[0].type == vm.mainNode.totales){
                        indexTotales = 1;
                    }
                    vm.subtotalColumns.forEach(function(itemA){
                        rowTotal[itemA.propiedad] = 0;
                        itemA.valores.forEach(function(itemB){
                            if(itemB.text == vm.monedaTRM.moneda){
                                valor = itemB.valor * Number(tree[0][vm.monedaTRM.propiedad]);
                                rowTotal[itemA.propiedad] += Number(valor.toFixed(2));
                            }else
                                rowTotal[itemA.propiedad] += itemB.valor;
                        });
                    });
                    vm.tiposMoneda.forEach(function(item){
                        var row = {moneda: item};
                        vm.subtotalColumns.forEach(function(item1){
                            item1.valores.forEach(function(item2){
                                if(item2.text == item)
                                    row[item1.propiedad] = item2.valor;
                            });
                        });
                        row.id = id;
                        row.name = "Subtotales Empresa (" + item + ")";
                        tree[0].childrens.splice(indexTotales,0,row);
                        id--;
                    });
                    if (vm.tiposMoneda.length > 0) {
                        rowTotal.id = id;
                        rowTotal.name = "Totales Empresa";
                        rowTotal.moneda = vm.monedaPC;
                        tree[0].childrens.splice(indexTotales,0,rowTotal);
                        id--;
                    }
                };
                /* Fin Función que permite insertar las filas de subtotales y Totales en el árbol. */
                /* Inicio Función que realiza el llamado a la función de calcular totales e insertar filas totales por cada empresa existente en el árbol. */
                vm.iterateEmpresa = function (tree){
                    vm.foundNode = [];
                    var subTree = [];
                    var idEmpresa = vm.findNode(tree, vm.nodeType, vm.mainNode.empresa);
                    idEmpresa.forEach(function(item){
                        vm.foundTree = [];
                        subTree = [];
                        subTree = vm.findSubTree(tree, item);
                        vm.restartSubtotalColumns();
                        if(subTree.length == 1){
                            vm.tiposMoneda = [];
                            vm.calculateTotals(subTree);
                            vm.insertTotalRows(subTree);
                        }
                    });
                };
                /* Fin Función que realiza el llamado a la función de calcular totales e insertar filas totales por cada empresa existente en el árbol. */
                /* Inicio Función que retorna el subárbol correspondiente a un nodo (id) que recibe como parámetro de entrada. */
                vm.findSubTree = function(tree, id){
                    tree.forEach(function(item){
                        if(item.childrens)
                            vm.findSubTree(item.childrens, id);
                        if(item.id == id)
                            vm.foundTree.push(item);
                    });
                    return vm.foundTree;
                };
                /* Fin Función que retorna el subárbol correspondiente a un nodo (id) que recibe como parámetro de entrada. */
                /* Inicio Función genérica que permite ubicar el/los id de un nodo en particular en el árbol por medio de el nombre de la propiedad y su valor. */
                vm.findNode = function(tree, property, value){
                    tree.forEach(function(item){
                        if(item.childrens)
                            vm.findNode(item.childrens, property, value);
                        if(item[property] == value)
                            vm.foundNode.push(item.id);
                    });
                    return vm.foundNode;
                };
                /* Fin Función genérica que permite ubicar el/los id de un nodo en particular en el árbol por medio de el nombre de la propiedad y su valor. */
                /* Inicio Función que deshabilita visualmente en el árbol todas las filas del subarbol que se recibe como parámetro de entrada. */
                vm.applyChildren = function(tree, state, property){
                    tree.forEach(function(item){
                        if(item.childrens)
                            vm.applyChildren(item.childrens, state, property);
                        item[property] = state;
                    });
                };
                /* Fin Función que deshabilita visualmente en el árbol todas las filas del subarbol que se recibe como parámetro de entrada. */
                /* Fin Sección funciones asociadas a operaciones sobre la estructura del árbol. */
                /* Fin Sección Funciones Controlador. */
            },
            controllerAs : "tTable"
        };
    })
    .directive("treeTableNode", function($compile){
        return {
            restrict : "E",
            scope : {},
            bindToController : {
                rowData: "=",
                metaData: "=",
                path: "=",
                level: "=?"
            },
            template: '<ng-include src="tTableNode.getTemplateUrl()"/>',
            compile: function(element){
                var elementContents = element.contents().remove();
                var reLinkElementContent;
                return function (scope, elm) {
                    if (angular.isUndefined(reLinkElementContent)) {
                        reLinkElementContent = $compile(elementContents);
                    }

                    reLinkElementContent(scope, function (clonedElement) {
                        elm.append(clonedElement);
                    });
                };
            },
            controller : function($element, $rootScope, $timeout, $window, CONSTANTS, treeTableService){

                /* Inicio Sección para declarar variables scope del controlador. */
                var vm = this;
                vm.showChildrens = true;
                vm.focused = false;
                vm.selected = {};
                vm.rowClass = {enabled:"rowEnabled", disabled: "rowDisabled", focused: "rowFocused", disabledFocused: "rowDisabledFocused"};
                vm.formatProperty = "format";
                /* Fin Sección para declarar variables scope del controlador. */

                /* Inicio Lógica Controlador. */
                if(typeof vm.level === "undefined"){
                    vm.level = 1;
                }
                vm.nextLevel = vm.level + 1;
                /* Fin Lógica Controlador. */

                /* Inicio Sección Funciones Controlador. */
                /* Inicio función que retorna la url y archivo html correspondiente a la directiva hija (nodo). */
                vm.getTemplateUrl = function(){
                    return vm.path + CONSTANTS.relativePathTemplates + CONSTANTS.childView;
                };
                /* Fin función que retorna la url y archivo html correspondiente a la directiva hija (nodo). */
                /* Inicio Sección Funciones estilos treeTable. */
                /* Inicio Función que asigna el estilo a una fila (Habilitada ó Deshabilitada). */
                vm.rowStyle = function (row){
                    if(!row.focused){
                        if(row.disabled || row.expired){
                            return vm.rowClass.disabled;
                        }
                        else{
                            return vm.rowClass.enabled;
                        }
                    }else{
                        if(row.disabled || row.expired)
                            return vm.rowClass.disabledFocused;
                        else
                            return vm.rowClass.focused;
                    }
                };
                /* Fin Función que asigna el estilo a una fila (Habilitada ó Deshabilitada). */
                /* Inicio funcíón que asigna el estilo al icono que indica condición especial para una fila. */
                vm.iconMarkStyle = function (){
                    var styleAll = {};
                    var padding = (12 * Number(vm.level))+6;
                    styleAll.left = padding + "px";
                    return styleAll;
                };
                /* Fin funcíón que asigna el estilo al icono que indica condición especial para una fila. */
                /* Inicio Función que asigna el estilo a las celdas del componente treeTable. */
                vm.treeStyle = function(firstElement, col, row){
                    return treeTableService.cellStyle(firstElement, col, row, vm.level, vm.metaData);
                };
                /* Fin Función que asigna el estilo a las celdas del componente treeTable. */
                /* Inicio Función que asigna el etilo al icono que abre o cierra una rama del árbol. */
                vm.iconStyle = function(){
                    var padding = (12 * Number(vm.level - 1) + 4);
                    return {"margin-left": padding + "px"};
                };
                /* Fin Función que asigan el etilo al icono que abre o cierra una rama del árbol. */
                /* Fin Sección Funciones estilos treeTable. */

                /* Inicio Sección Funciones eventos del treeTable. */
                /* Inicio Función que envía la data recibida como parámetro a un evento listener en el controlador padre. */
                vm.clickEvent = function (ev){
                    $rootScope.$emit("clickEvent", {"row": ev});
                };
                /* Fin Función que envía la data recibida como parámetro a un evento listener en el controlador padre. */
                /* Inicio Función que envía la data de la fila seleccionada y la ubicación del puntero en la pantalla a un evento listener en el controlador padre. */
                vm.rightClickFunction = function(e) {
                    var x = e.pageX.toString() - 20;
                    var y = e.pageY.toString() - 10;
                    if(x < 0)
                        x = 0;
                    $rootScope.$emit("contextMenuEvent", {"row":vm.rowData, "show":true, "xPosition": x, "yPosition": y});
                };
                /* Fin Función que envía la data de la fila seleccionada y la ubicación del puntero en la pantalla a un evento listener en el controlador padre. */
                /* Inicio Función que permite cambiar la variable que indica si se presentan los hijos o no de un nodo en el árbol. */
                vm.toggleNode = function(){
                    vm.showChildrens = !vm.showChildrens;
                };
                /* Fin Función que permite cambiar la variable que indica si se presentan los hijos o no de un nodo en el árbol. */
                /* Fin Sección Funciones eventos del treeTable. */
                /* Fin Sección Funciones Controlador. */
            },
            controllerAs : "tTableNode"
        };
    })
    .directive("ngRightClick", function($parse) {
        return function(scope, element, attrs) {
            var fn = $parse(attrs.ngRightClick);
            element.bind("contextmenu", function(event) {
                scope.$apply(function() {
                    event.preventDefault();
                    fn(scope, {$event:event});
                });
            });
        };
    });
})();