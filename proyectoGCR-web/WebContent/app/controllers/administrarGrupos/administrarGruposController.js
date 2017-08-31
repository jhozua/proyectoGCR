/*

** Autor: Daniel Rodríguez
** Empresa: IBM
** Fecha: 28 Diciembre 2016
** Archivo: administrarGruposController.js
** Descripción: Archivo JS en el que se define la funcionalidad del controlador "agregarMiembrosGrupoController" asociado al html "administrarGrupos.html".

*/

(function () {
    angular.module('adminBusinessModule')
        .controller('administrarGruposController', ['$window', '$rootScope', '$location', '$scope', 'businessAdminFactory', 'businessAdminServiciosComunes', 'ngProgressFactory', 'MENSAJES', 'constantes',
            function ($window, $rootScope, $location, $scope, businessAdminFactory, businessAdminServiciosComunes, ngProgressFactory, MENSAJES, constantes) {

                /* Inicio Declaración variables */
                var vm = this;
                vm.radioColumn = "fPrincipal";
                vm.checkColumn = "fExisteCRM";
                vm.tipoLEACalculado = "C";
                vm.tableColumns = {
                    grupos: [{
                        label: "Código",
                        property: "codigo"
                    }, {
                        label: "Nombre",
                        property: "nombre"
                    }],
                    detalleGrupo: [{
                            label: "Grupo/Empresa Líder",
                            property: "fPrincipal"
                        },
                        {
                            label: "Código Grupo",
                            property: "miembro",
                            subProperty: "codigo"
                        },
                        {
                            label: "Tipo Identificación",
                            property: "miembro",
                            subProperty: "tipoIdentInvlucrado",
                            subProperty2: "descripcion"
                        },
                        {
                            label: "No. Identificación",
                            property: "miembro",
                            subProperty: "numIdentificInvolucrado"
                        },
                        {
                            label: "Dígito ver.",
                            property: "miembro",
                            subProperty: "digitoVerificacionInvolucr"
                        },
                        {
                            label: "Nombre",
                            property: "miembro",
                            subProperty: "nombreRazonSocial"
                        },
                        {
                            label: "Empresa en CRM?",
                            property: "miembro",
                            subProperty: "fExisteCRM",
                            disabled: true
                        }
                    ]
                };
                vm.paginasAdminGrupos = {};
                /*
                vm.paginasMiembrosGrupo = {};
                */
                vm.tipoLEA = true;
                vm.valorLEA = true;
                vm.hayLider = true;
                /* Fin Declaración variables */

                /* Inicio Lógica Controlador (ejecutada al cargar este controlador) */
                $rootScope.$emit("alertEvent", {
                    "show": false
                });
                vm.objVariables = JSON.parse($window.sessionStorage.getItem("flags"));
                vm.objGrupos = $window.sessionStorage.getItem("objGrupos");
                vm.objMiembrosGrupo = $window.sessionStorage.getItem("objMiembrosGrupo");
                vm.progressbar = ngProgressFactory.createInstance();
                vm.progressbar.setHeight(constantes.progressBar.height);
                vm.progressbar.setColor(constantes.progressBar.color);

                if (vm.objVariables === null || vm.objVariables === undefined) {
                    vm.variables = {
                        showDetalleGrupo: false,
                        disabledConsultarGrupo: true,
                        checkAllFlag: false,
                        flagCrearGrupo: false,
                        LEArequerido: false
                    };
                } else {
                    vm.variables = vm.objVariables;
                }

                if (vm.objGrupos !== null && vm.objGrupos !== "undefined") {
                    vm.tableData = JSON.parse(vm.objGrupos);
                    vm.paginasAdminGrupos = JSON.parse($window.sessionStorage.getItem("objPaginasAdminGrupos"));
                }
                vm.grupo = JSON.parse($window.sessionStorage.getItem("objGrupoPadre"));

                if (vm.objMiembrosGrupo !== null && vm.objMiembrosGrupo !== undefined) {
                    vm.itemDetalleGrupo = JSON.parse(vm.objMiembrosGrupo);
                    if (vm.itemDetalleGrupo && vm.itemDetalleGrupo.datos)
                        vm.hayMiembros = vm.itemDetalleGrupo.datos.length > 0;
                    else
                        vm.hayMiembros = false;
                    /*
                    if ($window.sessionStorage.getItem("objPaginasMiembrosGrupo") !== null)
                        vm.paginasMiembrosGrupo = JSON.parse($window.sessionStorage.getItem("objPaginasMiembrosGrupo")); 
                    */
                }
                /* Fin Lógica Controlador (ejecutada al cargar este controlador) */

                /* Inicio Sección Funciones Controlador */
                vm.consultarGrupos = function (codigoGrupo, nombreGrupo, pagina) {
                    /*  Descripción: Función que permite realizar la consulta de los grupos existentes en el sistema consumiendo un servicio REST. 
                        Entrada: codigoGrupo: parámetro que se envía en el consumo del servicio.
                                nombreGrupo: parámetro que se envía en el consumo del servicio.
                                pagina: parámetro que se envía en el consumo del servicio.
                        Salida: NA  */
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    vm.tableData = [];
                    if (codigoGrupo === undefined)
                        codigoGrupo = "";
                    if (nombreGrupo === undefined)
                        nombreGrupo = "";
                    if (pagina === undefined) {
                        if (vm.paginasAdminGrupos !== undefined && vm.paginasAdminGrupos !== null && vm.paginasAdminGrupos.paginaActual !== undefined && vm.paginasAdminGrupos.paginaActual !== null)
                            pagina = vm.paginasAdminGrupos.paginaActual;
                        else
                            pagina = 1;
                    }
                    vm.progressbar.start();
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    businessAdminFactory.getData(constantes.endpoints.consultarGrupos + nombreGrupo + constantes.separador + codigoGrupo + constantes.separador, constantes.noCache, pagina)
                        .then(
                            function (result) {
                                vm.progressbar.complete();
                                vm.variables.showDetalleGrupo = false;
                                vm.variables.disabledConsultarGrupo = true;
                                vm.tableData = result.data;
                                vm.paginasAdminGrupos = businessAdminServiciosComunes.calcularPaginas(vm.tableData);
                                vm.variables.disabledConsultarGrupo = true;
                                $window.sessionStorage.setItem("objGrupos", angular.toJson(vm.tableData));
                                $window.sessionStorage.setItem("flags", angular.toJson(vm.variables));
                                $window.sessionStorage.setItem("objPaginasAdminGrupos", angular.toJson(vm.paginasAdminGrupos));
                            },
                            function (error) {
                                vm.progressbar.complete();
                                if (error.status != 404) {
                                    businessAdminServiciosComunes.showAlert(error);
                                }
                            }
                        );
                };

                vm.changeTipoLEA = function (item) {
                    if (item == vm.tipoLEACalculado) {
                        vm.variables.LEArequerido = true;
                        vm.grupo.amtTopeAvalGrupo = "";
                    } else
                        vm.variables.LEArequerido = false;
                };

                vm.doSort = function (propName, subPropName) {
                    /*  Descripción: Función que setea las variables referentes al manejo del ordenamiento de la tabla presentada en el html.
                        Entrada: propName: parámetro correspondiente al nombre de la propiedad de la columna a ordenar. 
                        Salida: NA  */
                    if (propName != undefined) {
                        if (subPropName != undefined) {
                            vm.sortBy = propName + "." + subPropName;
                        } else {
                            vm.sortBy = propName;
                        }
                        vm.reverse = !vm.reverse;
                    }
                };

                vm.irGrupoDetalle = function (grupo) {
                    /*  Descripción: Función que recibe y setea una variable con la información del grupo seleccionado, que luego ejecuta la consulta de los miembros asociados a dicho grupo.
                        Entrada: grupo: parámetro correspondiente a la información del grupo seleccionado. 
                        Salida: NA  */
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    vm.grupo = grupo;
                    vm.changeTipoLEA(vm.grupo.fIndicadorMonto);
                    vm.consultarGrupoPadre(vm.grupo.idGrupoRiesgo);
                    vm.consultarGrupoDetalle(vm.grupo.codigo);
                };

                vm.consultarGrupoPadre = function (id) {
                    businessAdminFactory.getData(constantes.endpoints.consultarGrupoPadre + id, constantes.noCache)
                        .then(
                            function (result) {
                                //consulta si el grupo tiene grupo padre
                                vm.grupo.grupoPadre = result.data.datos[0];
                            }
                        )
                };

                vm.consultarGrupoDetalle = function (codigoGrupoDetalle, pagina, agregar) {
                    /*  Descripción: Función que permite realizar la consulta de los miembros del grupo recibido como parámetro consumiendo un servicio REST. 
                        Entrada: codigoGrupoDetalle: parámetro que se enviará en el consumo del servicio.
                                pagina: parámetro que se enviará en el consumo del servicio.
                                data: parámetro con la información del objeto grupo. Se utilizará en la funcionalidad Eliminar Grupo.
                                agregar: parámetro que indica si el llamado de esta función la realiza el agregar Miembro.
                        Salida: NA  */
                    vm.progressbar.start();
                    vm.variables.checkAllFlag = false;
                    vm.variables.flagCrearGrupo = false;
                    if (agregar === undefined || agregar === false)
                        vm.itemDetalleGrupo = {
                            datos: []
                        };
                    /*
                    vm.paginasMiembrosGrupo = {};
                    */
                    var ir = function () {
                        vm.progressbar.complete();
                        vm.variables.showDetalleGrupo = true;
                        $window.sessionStorage.setItem("objGrupoPadre", angular.toJson(vm.grupo));
                        $window.sessionStorage.setItem("objMiembrosGrupo", angular.toJson(vm.itemDetalleGrupo));
                        $window.sessionStorage.setItem("flags", angular.toJson(vm.variables));
                        /*
                        $window.sessionStorage.setItem("objPaginasMiembrosGrupo", angular.toJson(vm.paginasMiembrosGrupo));
                        */
                    };

                    businessAdminFactory.getData(constantes.endpoints.consultarMiembrosGrupo + codigoGrupoDetalle, constantes.noCache)
                        .then(
                            function (result) {
                                vm.hayMiembros = true;
                                vm.itemDetalleGrupo = result.data;
                                /*
                                vm.paginasMiembrosGrupo = businessAdminServiciosComunes.calcularPaginas(vm.itemDetalleGrupo);
                                */
                                ir();
                            },
                            function (error) {
                                ir();
                                if (error.status !== 404) {
                                    businessAdminServiciosComunes.showAlert(error);
                                } else {
                                    vm.hayMiembros = false;
                                    vm.itemDetalleGrupo = {
                                        datos: []
                                    };
                                }
                            }
                        );
                };

                vm.crearGrupo = function () {
                    /*  Descripción: Función que presenta la pantalla de crear Grupo. 
                        Entrada: NA
                        Salida: NA  */
                    $window.sessionStorage.clear();
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    vm.grupo = {
                        nombre: ""
                    };
                    vm.itemDetalleGrupo = {
                        datos: []
                    };
                    /*
                    vm.paginasMiembrosGrupo = {};
                    */
                    vm.variables.disabledConsultarGrupo = false;
                    vm.variables.checkAllFlag = false;
                    vm.variables.flagCrearGrupo = true;
                    vm.variables.showDetalleGrupo = true;
                    $window.sessionStorage.setItem("objMiembrosGrupo", angular.toJson(vm.itemDetalleGrupo));
                    $window.sessionStorage.setItem("flags", angular.toJson(vm.variables));
                    /*
                    $window.sessionStorage.setItem("objPaginasMiembrosGrupo", angular.toJson(vm.paginasMiembrosGrupo));
                    */
                };

                vm.editarGrupo = function () {
                    /*  Descripción: Función que permite manejar el flag que controla la funcionalidad "Habilitado o Deshabilitado" del formulario. 
                        Entrada: NA
                        Salida: NA  */
                    vm.variables.disabledConsultarGrupo = false;
                    $window.sessionStorage.setItem("flags", angular.toJson(vm.variables));
                };

                vm.eliminarGrupo = function () {
                    /*  Descripción: Función que permite eliminar el grupo consumiendo un servicio REST. 
                        Entrada: NA
                        Salida: NA  */
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    var button1Fn = function () {
                        vm.progressbar.start();
                        vm.agregarPadreAMiembros();
                        businessAdminFactory.postData(constantes.endpoints.eliminarGrupo, vm.itemDetalleGrupo.datos)
                            .then(
                                function (result) {
                                    vm.progressbar.complete();
                                    vm.atrasConsultarGrupos();
                                    result.data.mensaje = MENSAJES.GRUPOS.ELIMINAR.EXITO;
                                    businessAdminServiciosComunes.showAlert(result);
                                    $window.sessionStorage.setItem("flags", angular.toJson(vm.variables));
                                },
                                function (error) {
                                    vm.progressbar.complete();
                                    businessAdminServiciosComunes.showAlert(error);
                                }
                            );
                    };
                    $rootScope.$emit("gaModalEvent", {
                        "title": MENSAJES.GRUPOS.ELIMINAR.TITULO_CONFIRMAR_ELIMINAR,
                        "msg": MENSAJES.GRUPOS.ELIMINAR.CONFIRMAR_ELIMINAR.replace("{{nombreGrupo}}", vm.grupo.nombre),
                        "button1Action": button1Fn,
                        "button1Text": MENSAJES.BOTON_CONFIRMACION.SI,
                        "button2Text": MENSAJES.BOTON_CONFIRMACION.NO
                    });
                };

                vm.consultarGrupoEspecifico = function (codigoGrupo, pagina, agregar) {
                    /*  Descripción: Función que permite realizar la consulta de los miembros del grupo recibido como parámetro consumiendo un servicio REST. 
                        Entrada: codigoGrupo: parámetro que se enviará en el consumo del servicio.
                                pagina: parámetro que se enviará en el consumo del servicio.
                                agregar: parámetro que indica si el llamado de esta función la realiza el agregar Miembro.
                        Salida: NA  */
                    businessAdminFactory.getData(constantes.endpoints.consultarGrupos + constantes.separador + codigoGrupo + constantes.separador, constantes.noCache)
                        .then(
                            function (result) {
                                vm.grupo = result.data.datos[0];
                                vm.consultarGrupoPadre(vm.grupo.idGrupoRiesgo);
                                $window.sessionStorage.setItem("objGrupos", angular.toJson(vm.tableData));
                                vm.consultarGrupoDetalle(codigoGrupo, null, agregar); //sin paginación
                                /*
                                vm.paginasAdminGrupos = businessAdminServiciosComunes.calcularPaginas(vm.tableData);
                                if (agregar)
                                    vm.consultarGrupoDetalle(codigoGrupo, pagina, agregar);
                                else
                                    vm.consultarGrupoDetalle(codigoGrupo, pagina, true);
                                $window.sessionStorage.setItem("objPaginasAdminGrupos", angular.toJson(vm.paginasAdminGrupos));
                                */
                            },
                            function (error) {
                                if (error.status !== 404) {
                                    businessAdminServiciosComunes.showAlert(error);
                                }
                            }
                        );
                };

                vm.guardarDetalleGrupo = function (pagina) {
                    /*  Descripción: Función que permite guardar los cambios en los miembros del Grupo consumiendo un servicio REST. 
                        Entrada: pagina: Corresponde a la página que se debe consultar luego de Guardar cambios.
                        Salida: NA  */

                    vm.hayLider = vm.validarExisteLider(); //VALIDACIÓN EXISTE LIDER (MIEMBRO PRINCIPAL)
                    if (vm.hayLider) {
                        if (vm.validarEmpresasCRM()) {
                            vm.progressbar.start();
                            vm.agregarPadreAMiembros();
                            if (vm.variables.flagCrearGrupo) {
                                businessAdminFactory.putData(constantes.endpoints.crearGrupo, vm.itemDetalleGrupo.datos)
                                    .then(
                                        function (result) {
                                            vm.variables.flagCrearGrupo = false;
                                            vm.progressbar.complete();
                                            vm.grupo.codigo = result.data.mensaje.split(": ")[1];
                                            vm.consultarGrupoEspecifico(vm.grupo.codigo, pagina, true);
                                            $window.sessionStorage.setItem("flags", angular.toJson(vm.variables));
                                            $window.sessionStorage.setItem("objMiembrosGrupo", angular.toJson(vm.itemDetalleGrupo));
                                            result.data.mensaje = MENSAJES.GRUPOS.GUARDAR.EXITO;
                                            businessAdminServiciosComunes.showAlert(result);

                                        },
                                        function (error) {
                                            vm.progressbar.complete();
                                            if (error.status !== 404) {
                                                businessAdminServiciosComunes.showAlert(error);
                                            }
                                        }
                                    );
                            } else {
                                $window.sessionStorage.setItem("objGrupos", angular.toJson(vm.tableData));
                                vm.agregarPadreAMiembros();
                                businessAdminFactory.postData(constantes.endpoints.actualizarGrupo, vm.itemDetalleGrupo.datos)
                                    .then(
                                        function (result) {
                                            vm.progressbar.complete();
                                            vm.consultarGrupoEspecifico(vm.grupo.codigo, pagina);
                                            $window.sessionStorage.setItem("flags", angular.toJson(vm.variables));
                                            $window.sessionStorage.setItem("objMiembrosGrupo", angular.toJson(vm.itemDetalleGrupo));
                                            result.data.mensaje = MENSAJES.GRUPOS.GUARDAR.EXITO;
                                            businessAdminServiciosComunes.showAlert(result);
                                        },
                                        function (error) {
                                            vm.progressbar.complete();
                                            businessAdminServiciosComunes.showAlert(error);
                                        }
                                    );
                            }
                        } else {
                            var msg = {
                                data: {
                                    descripcionError: MENSAJES.GRUPOS.GUARDAR.NO_CRM
                                },
                                status: MENSAJES.TIPO.WARNING
                            };
                            businessAdminServiciosComunes.showAlert(msg);
                        }
                    } else {
                        var msg = {
                            data: {
                                descripcionError: MENSAJES.GRUPOS.GUARDAR.SIN_LIDER
                            },
                            status: MENSAJES.TIPO.WARNING
                        };
                        businessAdminServiciosComunes.showAlert(msg);
                    }
                };

                vm.validarExisteLider = function () {
                    /*  Descripción: Función que permite verificar si existe una fila del objeto de negocio marcada como Líder.
                        Entrada: NA
                        Salida: existeLider: valor boolean que indica si existe o no un miembro lider en el objeto de negocio.  */
                    var existeLider = false;
                    if (vm.itemDetalleGrupo.datos.length == 0 || vm.itemDetalleGrupo.datos[0].miembro == undefined) {
                        //es valido si no hay miembros
                        existeLider = true;
                    }
                    var countDeleted = 0;
                    for (var i = 0; i < vm.itemDetalleGrupo.datos.length; i++) {
                        var item = vm.itemDetalleGrupo.datos[i];
                        if (item.deleted === true)
                            countDeleted++;
                    }
                    if (countDeleted == vm.itemDetalleGrupo.datos.length) {
                        existeLider = true;
                    }
                    for (var i = 0; i < vm.itemDetalleGrupo.datos.length && !existeLider; i++) {
                        var item = vm.itemDetalleGrupo.datos[i];
                        if ((item.fPrincipal === constantes.si) && (item.deleted === undefined || item.deleted === false))
                            existeLider = true;
                    }
                    return existeLider;
                };

                vm.validarEmpresasCRM = function () {
                    for (var i = 0; i < vm.itemDetalleGrupo.datos.length; i++) {
                        var item = vm.itemDetalleGrupo.datos[i];
                        if (!item.deleted && item.miembro.numIdentificInvolucrado && item.miembro.fExisteCRM != constantes.si)
                            return false;
                    }
                    return true;
                };

                vm.checkRadio = function (data) {
                    /*  Descripción: Función que permite setear la fila seleccionada (miembro) como Líder.
                        Entrada: data: Información de cada fila del objeto de negocio.
                        Salida: NA  */
                    vm.itemDetalleGrupo.datos.forEach(function (item, index) {
                        if (item.miembro.nombreRazonSocial == data.miembro.nombreRazonSocial)
                            item.fPrincipal = constantes.si;
                        else
                            item.fPrincipal = constantes.no;
                    });
                };

                vm.validateRadio = function () {
                    vm.hayLider = false;
                    vm.itemDetalleGrupo.datos.forEach(function (item, index) {
                        if (item.fPrincipal == constantes.si) {
                            vm.hayLider = true;
                        }
                    });
                    if (vm.hayLider) {
                        vm.guardarDetalleGrupo();
                    }
                };

                vm.checkAll = function (flag) {
                    /*  Descripción: Función que controla el flag que permite marcar o desmarcar todas las filas de la tabla presentada en el html.
                        Entrada: flag: parámetro que indica si se va a marcar o desmarcar.
                        Salida: NA  */
                    vm.itemDetalleGrupo.datos.forEach(function (item, index) {
                        if (!item.deleted) {
                            if (flag)
                                item.selected = true;
                            else
                                item.selected = false;
                        }
                    });
                };

                vm.atrasConsultarGrupos = function () {
                    /*  Descripción: Función que permite presentar la tabla de grupos consultados, consumiendo el servicio de consulta nuevamente.
                        Entrada: NA
                        Salida: NA  */
                    //vm.progressbar.complete();
                    vm.hayLider = true;
                    $window.sessionStorage.clear();
                    $scope.consultarGrupo.$setUntouched();
                    //vm.consultarGrupos(vm.codigoGrupo, vm.nombreGrupo);
                    vm.variables.showDetalleGrupo = false;
                    vm.variables.disabledConsultarGrupo = true;
                };

                vm.salirAdminGrupos = function () {
                    /*  Descripción: Función que permite salir del módulo de Administración de Grupos.
                        Entrada: NA
                        Salida: NA  */
                    $window.sessionStorage.clear();
                };

                vm.agregarMiembrosGrupo = function () {
                    /*  Descripción: Función que permite ir a la pantalla Agregar Miembros al Grupo.
                        Entrada: NA                         
                        Salida: NA  */
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    vm.variables.checkAllFlag = false;
                    /*
                    if (vm.paginasMiembrosGrupo.arrayTotalPaginas) {
                        var ultimaPag = vm.paginasMiembrosGrupo.arrayTotalPaginas.length;
                        if (ultimaPag > 0)
                            vm.paginaSeleccionadaMiembrosGrupo(ultimaPag, constantes.accionPaginacion.agregar);
                    }
                    */
                    $window.sessionStorage.setItem("objGrupoPadre", angular.toJson(vm.grupo));
                    $window.sessionStorage.setItem("flags", angular.toJson(vm.variables));
                    $window.sessionStorage.setItem("objMiembrosGrupo", angular.toJson(vm.itemDetalleGrupo));
                    $location.path(constantes.url.gruposAgregarMiembro);
                };

                vm.eliminarMiembrosGrupo = function (objeto) {
                    /*  Descripción: Función que permite marcar como eliminados los miembros seleccionados. 
                       Entrada: objeto: Objeto con la información de los miembros del grupo para iterar.
                       Salida: NA  */
                    var seleccionado = false;
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    for (var i = 0; i < objeto.length; i++) {
                        if (objeto[i].selected) {
                            seleccionado = true;
                            break;
                        }
                    }
                    if (seleccionado) {
                        var button1Fn = function () {
                            vm.variables.checkAllFlag = false;
                            if (vm.itemDetalleGrupo.datos) {
                                for (var i = 0; i < vm.itemDetalleGrupo.datos.length; i++) {
                                    if (vm.itemDetalleGrupo.datos[i].selected) {
                                        if (vm.itemDetalleGrupo.datos[i].accion == "I") {
                                            vm.itemDetalleGrupo.datos.splice(i, 1);
                                            i--;
                                        } else {
                                            vm.itemDetalleGrupo.datos[i].selected = false;
                                            vm.itemDetalleGrupo.datos[i].deleted = true;
                                            vm.itemDetalleGrupo.datos[i].accion = "D";
                                        }
                                    }
                                }
                                if (vm.itemDetalleGrupo.datos.length == 0) {
                                    vm.hayMiembros = false;
                                }
                            }
                        };
                        $rootScope.$emit("gaModalEvent", {
                            "title": MENSAJES.GRUPOS.MIEMBROS.ELIMINAR.TITULO_CONFIRMAR_ELIMINAR,
                            "msg": MENSAJES.GRUPOS.MIEMBROS.ELIMINAR.CONFIRMAR_ELIMINAR,
                            "button1Action": button1Fn,
                            "button1Text": MENSAJES.BOTON_CONFIRMACION.SI,
                            "button2Text": MENSAJES.BOTON_CONFIRMACION.NO
                        });
                    } else {
                        var result = {
                            status: MENSAJES.TIPO.WARNING,
                            data: {
                                descripcionError: MENSAJES.GRUPOS.MIEMBROS.ELIMINAR.SIN_ELEMENTOS_ELIMINAR
                            }
                        };
                        businessAdminServiciosComunes.showAlert(result);
                    }
                };

                vm.paginaSeleccionada = function (pagina, accion) {
                    /*  Descripción: Función que permite realizar el manejo de la paginación de la tabla presentada en el html (Grupos).
                        Entrada: pagina: parámetro con la información de la página seleccionada.   
                                accion: parámetro con la información de la acción a ejecutar en la paginación (anterior ó siguiente).
                        Salida: NA  */
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    var existePag;
                    var buscaPag;
                    if (accion == constantes.accionPaginacion.siguiente) {
                        buscaPag = vm.paginasAdminGrupos.paginaActual + 1;
                        existePag = vm.paginasAdminGrupos.arrayTotalPaginas.indexOf(buscaPag);
                        if (existePag >= 0)
                            vm.consultarGrupos(vm.codigoGrupo, vm.nombreGrupo, buscaPag);
                    } else if (accion == constantes.accionPaginacion.anterior) {
                        buscaPag = vm.paginasAdminGrupos.paginaActual - 1;
                        existePag = vm.paginasAdminGrupos.arrayTotalPaginas.indexOf(buscaPag);
                        if (existePag >= 0)
                            vm.consultarGrupos(vm.codigoGrupo, vm.nombreGrupo, buscaPag);
                    } else {
                        if (pagina != vm.paginasAdminGrupos.paginaActual)
                            vm.consultarGrupos(vm.codigoGrupo, vm.nombreGrupo, pagina);
                    }
                };

                vm.paginaSeleccionadaMiembrosGrupo = function (pagina, accion) {
                    /*  Descripción: Función que permite realizar el manejo de la paginación de la tabla presentada en el html (miembros Grupo).
                        Entrada: pagina: parámetro con la información de la página seleccionada.   
                                accion: parámetro con la información de la acción a ejecutar en la paginación (anterior ó siguiente).
                        Salida: NA  */
                    var existePag;
                    var buscaPag;
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });

                    if (accion == constantes.accionPaginacion.siguiente) {
                        buscaPag = vm.paginasMiembrosGrupo.paginaActual + 1;
                        existePag = vm.paginasMiembrosGrupo.arrayTotalPaginas.indexOf(buscaPag);
                        if (existePag >= 0) {
                            if (vm.variables.disabledConsultarGrupo === false)
                                vm.guardarDetalleGrupo(buscaPag);
                            else
                                vm.consultarGrupoDetalle(vm.grupo.codigo, buscaPag);
                        }
                    } else if (accion == constantes.accionPaginacion.anterior) {
                        buscaPag = vm.paginasMiembrosGrupo.paginaActual - 1;
                        existePag = vm.paginasMiembrosGrupo.arrayTotalPaginas.indexOf(buscaPag);
                        if (existePag >= 0) {
                            if (vm.variables.disabledConsultarGrupo === false)
                                vm.guardarDetalleGrupo(buscaPag);
                            else
                                vm.consultarGrupoDetalle(vm.grupo.codigo, buscaPag);
                        }
                    } else if (accion == constantes.accionPaginacion.agregar) {
                        vm.consultarGrupoDetalle(vm.grupo.codigo, pagina, true);
                    } else {
                        if (pagina != vm.paginasMiembrosGrupo.paginaActual)
                            if (vm.variables.disabledConsultarGrupo === false)
                                vm.guardarDetalleGrupo(pagina);
                            else
                                vm.consultarGrupoDetalle(vm.grupo.codigo, pagina);
                    }
                };

                vm.agregarPadreAMiembros = function () {
                    if (vm.itemDetalleGrupo.datos === undefined || vm.itemDetalleGrupo.datos.length == 0) {
                        vm.itemDetalleGrupo.datos.push({
                            grupoRiesgo: vm.grupo
                        });
                    }
                    vm.itemDetalleGrupo.datos.forEach(function (item, index) {
                        item.grupoRiesgo = vm.grupo;
                    });
                };

                vm.salirMenu = function () {
                    $rootScope.$emit("alertEvent", {
                        "show": false
                    });
                    $window.sessionStorage.clear();
                    $location.path(constantes.url.main);
                };

                $rootScope.$emit('menuEvent', true);

                /* Fin Sección Funciones Controlador */
            }
        ]);
})();