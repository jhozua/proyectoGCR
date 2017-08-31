(function () {
    angular.module('adminBusinessModule')
        .constant("constantes", (function () {
            /** Constantes para la conexión con el servidor */
            var sepPuerto = ":"; //Variable para el separador entre el host y el puerto
            var sepProtocolo = "://"; //Variable para el separador entre el protocolo y el host
            var protocolo = "http" //Variable para la asignación del protocolo
            var host = "localhost"; //Variable para la asignación del host
            var puerto = "7001"; //Variable para la asignación del puerto
            var rutaGeneral = protocolo + sepProtocolo + host + sepPuerto + puerto; //Ruta general del servidor
            var rutaAdmin = rutaGeneral + "/BusinessAdmin/rest/"; //Ruta del servidor concatenada con la ruta del proyecto

            var rutaComite = rutaAdmin + "administrarComite-v1/administrarComite/";
            var rutaParticipante = rutaAdmin + "administrarComite-v1/administrarParticipante/";
            var rutaModalidades = rutaAdmin + "administrarModalidadesLineas-v1/modalidades/";
            var rutaLineas = rutaAdmin + "administrarModalidadesLineas-v1/lineas/";
            var rutaGrupos = rutaAdmin + "administrarGrupos-v1/grupoRiesgo/";
            var rutaMiembroGrupo = rutaAdmin + "administrarGrupos-v1/miembroGrupoRiesgo/";
            var rutaParametricas = rutaAdmin + "administrarParametrias-v1/parametrias/";
            var rutaPlantillas = rutaAdmin + "administrarPlantillas-v1";
            var rutaBanco = rutaAdmin + "administrarBanco-v1/banco/";
            var rutaCUTPA = rutaAdmin + "administrarConsorcios-v1/figurasAgrupamiento/";
            var rutaSeguridad = rutaAdmin + "administrarSeguridad-v1/seguridad/";
            var rutaCompararPC = rutaAdmin + "compararPC-v1/";

            /* Urls */

            var main = "/main/";
            var crearComite = "/crearComite/";
            var editarComite = "/edicionComite/";
            var crearParticipante = "/crearParticipante/";
            var agregarParticipante = "/agregarParticipante/";
            var adminParticipante = "/administrarParticipante/";
            var gestionComite = "/gestionComite/";
            var grupos = "/grupos/";
            var gruposAgregarMiembro = "/gruposAgregarMiembro/";
            var consultarCliente = "/consultarCliente/";
            var consultarPCGrupo = "/consultarPCGrupo/";
            var compararPCInput = "/compararPCInput/";
            var gestionCUTPA = "/gestionCUTPA/";
            var editarCUTPA = "/consultarEditarCUTPA/";
            var crearCUTPA = "/crearCUTPA/";
            var agregarEmpresas = "/agregarEmpresas/";
            var gestionLineas = "/gestionLineas/";
            var crearLinea = "/crearLinea/";
            var editarLinea = "/editarLinea/";
            var gestionModalidades = "/gestionModalidades/";
            var crearModalidad = "/crearModalidad/";
            var editarModalidad = "/editarModalidad/";
            var gestionPatrimonio = "/gestionPatrimonio/";
            var gestionPlantillas = "/gestionPlantillas/";
            var crearPlantilla = "/crearPlantillas/";
            var editarPlantilla = "/editarPlantillas/";
            var gestionFuncionalidades = "/funcionalidades/";
            var gestionCamposFuncionalidades = "/camposFuncionalidades/";
            var gestionRolesUsuarios = "/rolesUsuarios/";
            var gestionFuncionalidadesRoles = "/funcionalidadesRoles/";
            var seguridadMain = "/seguridadMain/";
            var login = "/login/";
            var compararPC = "/compararPC/";
            var gestionarGrupoSeguridad = "/gestionarGrupoSeguridad/";
            var crearGrupoSeguridad = "/agregarGruposSeguridad/";

            return {
                endpoints: {
                    rutaAdmin: rutaAdmin,

                    /** Constante para administracion de comites y participantes*/
                    consultarComite: rutaComite + "buscarPorNombre/",
                    eliminarComite: rutaComite + "eliminarComite/",
                    consultarParticipantesComite: rutaParticipante + "buscarParticipantesComite/",
                    consultarParticipantesSistema: rutaParticipante + "buscarTodosParticipantes/",
                    crearComite: rutaComite + "crearComite/",
                    actualizarComite: rutaComite + "actualizarComite",
                    crearParticipanteComite: rutaParticipante + "crearParticipante",
                    actualizarParticipante: rutaParticipante + "actualizarParticipante",
                    elminarParticipantes: rutaParticipante + "eliminarParticipantes ",
                    buscarParticipanteFiltro: rutaParticipante + "buscarParticipantesFiltro/",
                    buscarParticipantes: rutaParticipante + "buscarParticipantesFiltro/{tipodoc}/{numdoc}/{nombre}/",

                    /** Constante para administracion de modalidades y líneas */
                    consultarModalidades: rutaModalidades + "consultarModalidades/",
                    consultarModalidadPadre: rutaModalidades + "consultarModalidadesPadres/",
                    crearModalidades: rutaModalidades + "crearModalidad/",
                    editarModalidades: rutaModalidades + "editarModalidad/",
                    consultarLineas: rutaLineas + "consultarLineas/",
                    crearLinea: rutaLineas + "crearLinea/",
                    editarLinea: rutaLineas + "editarLinea/",
                    modalidadesRelacionadasALinea: rutaLineas + "modalidadesRelacionadas/",
                    consultarLineasDisponibles: rutaModalidades + "lineasDisponibles/",
                    consultarLineasRelacionadas: rutaModalidades + "lineasRelacionadas/",
                    consultarLineasRelacionadasActivas: rutaModalidades + "lineasRelacionadasActivas/",
                    modalidadesActivasNoDummy: rutaModalidades + "consultarModalidadesActivas/",

                    /** Constantes para administracion de Grupos*/
                    consultarGrupos: rutaGrupos + "consultarGrupo/",
                    consultarGruposAgregar: rutaGrupos + "consultarGruposAsociar/",
                    consultarMiembrosGrupo: rutaMiembroGrupo + "consultarMiembrosGrupo/",
                    actualizarGrupo: rutaMiembroGrupo + "actualizarMiembrosGrupoRiesgo/",
                    consultarEmpresasAgregar: rutaGrupos + "consultarEmpresas/",
                    crearGrupo: rutaGrupos + "crearGrupo/",
                    eliminarGrupo: rutaGrupos + "eliminarGrupo/",
                    consultarGrupoPadre: rutaGrupos + "consultarGrupoPadre/",

                    /** Constantes para consultar parametrias*/
                    consultarListaProceso: rutaParametricas + "consultarListasProceso/",
                    consultarListaNegocio: rutaParametricas + "consultarListasNegocio/",
                    consultarFigurasAgrupamiento: rutaParametricas + "consultarFigurasAgrupamiento/",

                    /** Constantes para administracion de plantillas*/
                    consultarPlantillas: rutaPlantillas + "/consultarPlantillasPC/buscarPlantillaPorNombre/",
                    eliminarPlantillas: rutaPlantillas + "/consultarPlantillasPC/eliminarPlantilla/",
                    crearPlantilla: rutaPlantillas + "/consultarPlantillasPC/crearPlantilla/",
                    plantillaModLinea: rutaPlantillas + "/plantillaModalidad/plantillasLineasRelacionadas/",
                    editarPlantilla: rutaPlantillas + "/consultarPlantillasPC/editarPlantilla/",
                    plantillaModalidad: rutaPlantillas + "/plantillaModalidad/consultar/",
                    plantillaLinea: rutaPlantillas + "/plantillaLineas/consultar/",

                    /** Constantes para administración del patrimonio técnico del banco */
                    consultarPatrimonioTecnico: rutaBanco + "consultarPatrimonio/",
                    actualizarPatrimonioTecnico: rutaBanco + "actualizarPatrimonio/",

                    /** Constantes para consultar grupo PC*/
                    consultarGrupoPC: rutaAdmin + "infoCliente-v1/infoCliente/consultaGrupoPC/",

                    /** Constantes para la administracion de figuras de agrupamiento */
                    crearCUTPA: rutaCUTPA + "crearFiguraAgrupamiento/",
                    actualizarCUTPA: rutaCUTPA + "actualizarFiguraAgrupamiento/",
                    eliminarCUTPA: rutaCUTPA + "eliminarFiguraAgrupamiento/",
                    buscarMiembrosCUTPA: rutaCUTPA + "buscarMiembrosInvolucrado/",
                    consultarEmpresasFiltro: rutaCUTPA + "buscarEmpresasFiltro/{tipoidenti}/{numidenti}/{nombre}/",
                    buscarInvolucradoFiltro: rutaCUTPA + "buscarInvolucradoFiltro/{tipoagrup}/{tipodoc}/{numdoc}/{consec}/{nombre}/{fiduc}/",
                    buscarInvolucradoCRM: rutaCUTPA + "buscarInvolucradoCRM/",
                    validacionFiguraAgrup: rutaCUTPA + "validacionFiguraAgrup/",

                    /** Constantes para la administracion de entidades de seguridad */
                    consultarRoles: rutaSeguridad + "roles/",
                    funcionalidadesRol: rutaSeguridad + "roles/{idRol}/funcionalidades",
                    funcionalidadesDisponiblesRol: rutaSeguridad + "roles/{idRol}/funcionalidadesDisponibles",
                    consultarMapeosLdap: rutaSeguridad + "mapeosLdap/",
                    consultarRolesDeMapeo: rutaSeguridad + "mapeosLdap/{idMapeo}/roles",
                    consultarRolesDisponibles: rutaSeguridad + "mapeosLdap/{idMapeo}/rolesDisponibles",
                    funcionalidades: rutaSeguridad + "funcionalidades/",
                    consultarPantallasFuncionalidad: rutaSeguridad + "funcionalidades/{idFunc}/pantallas",
                    pantallasCampos: rutaSeguridad + "pantallas/{idPantalla}/campos",
                    consultaOperacionesFuncionalidad: rutaSeguridad + "mapeosLdap/{idMapeo}/operacionesFuncionalidades",
                    consultaOperacionesCampos: rutaSeguridad + "mapeosLdap/{idMapeo}/{idFunc}/{idPan}/operacionesCampos",
                    /**  */
                    consultarGruposSeguridad: rutaSeguridad + "buscarGrupoSeguridadPorNombre/",
                    consultarProcesoDominio: rutaSeguridad + "consultarListasProceso/",
                    crearGrupoSeguridad: rutaSeguridad + "crearGrupo/",
                    eliminarGrupoSeguridad: rutaSeguridad + "eliminarGrupo/",
                    crearProcesoSeguridad: rutaSeguridad + "crearProceso/",
                    eliminarGrupoSeguridad: rutaSeguridad + "eliminarProceso/",
                    
                    /** Constantes para Comparar PC*/
                    consultaPC: rutaCompararPC + "compararPC/cargarArchivos/",
                    compararPC: rutaCompararPC + "compararPC/compararArchivos/",
                    compararPCInput : rutaCompararPC + "compararPCSeleccion/consultarPCEmpresa/"
                },
                url: {
                    /** URLs aplicación BussinessAdmin */
                    main,
                    crearComite,
                    editarComite,
                    crearParticipante,
                    agregarParticipante,
                    adminParticipante,
                    gestionComite,
                    grupos,
                    gruposAgregarMiembro,
                    consultarCliente,
                    consultarPCGrupo,
                    compararPCInput,
                    gestionCUTPA,
                    editarCUTPA,
                    crearCUTPA,
                    agregarEmpresas,
                    gestionLineas,
                    crearLinea,
                    editarLinea,
                    gestionModalidades,
                    crearModalidad,
                    editarModalidad,
                    gestionPatrimonio,
                    gestionPlantillas,
                    crearPlantilla,
                    editarPlantilla,
                    gestionFuncionalidades,
                    gestionCamposFuncionalidades,
                    gestionRolesUsuarios,
                    gestionFuncionalidadesRoles,
                    seguridadMain,
                    login,
                    compararPC,
                    gestionarGrupoSeguridad,
                    crearGrupoSeguridad
                },
                parametrias: {
                    /** Constantes de parametrías */
                    listaTiposDocumentoId: "DOMINIO_TIPO_IDENTIFICACION",
                    listaTiposSegmentoId: "DOMINIO_SEGMENTO",
                    listaFiduciarias: "DOMINIO_FRANQUICIA",
                    listaTiposPerJuridicas: "DOMINIO_TIPO_SOLICITANTE",
                    tipoParticipante: "DOMINIO_TIPO_PARTICIPANTE",
                    rolPreparacionComite: "DOMINIO_ROL_PREPARACION",
                    rolParticipanteComite: "DOMINIO_ROL_PARTICIPANTE",
                    idEstado: "DOMINIO_ESTADO",
                    idNaturaleza: "DOMINIO_NATURALEZA",
                    idTipoObligacion: "DOMINIO_NATURALEZA_OBLIGACION",
                    idFlujoDesembolsador: "DOMINIO_FLUJO_DESEMBOLSADOR",
                    idTipoRadicacion: "DOMINIO_TIPO_RADICACION",
                    idIndicadorMonto: "DOMINIO_INDICADOR_MONTO",
                    idTipoAgrupamiento: "DOMINIO_TIPO_SOLICITANTE",
                    idClasificacionLinea: "DOMINIO_CLASIFICACION_LINEA",
                    listaProceso: "DOMINIO_PROCESO"
                },
                funcionalidades: {
                    /** Funcionalidades */
                    modalidades: 1,
                    lineas: 2,
                    grupos: 3,
                    comites: 4,
                    plantillas: 5,
                    patTec: 6,
                    figAgrup: 7,
                    seguridad: 8,
                    grupoPC: 9,
                    compararPC: 10
                },
                pantallas: {
                    adminMod: 1,
                    crearMod: 2,
                    editMod: 3,
                    adminLin: 4,
                    crearLin: 5,
                    editLin: 6
                },
                progressBar: {
                    height: "5px",
                    color: "#f6586a" //AvVillas
//                    color: "#0173da" //Bogota
//                    color: "#4192cd"   //Occidente
//                    color: "#a5e069" //Popular
                },
                /** Otras Constantes */
                separador: "/",
                accionPaginacion: {
                    anterior: "anterior",
                    siguiente: "siguiente",
                    agregar: "agregar"
                },
                tipoAlerta: {
                    success: "success",
                    error: "danger",
                    info: "info",
                    warning: "warning"
                },
                iconAlerta: {
                    success: "glyphicon-ok",
                    error: "glyphicon-remove",
                    info: "glyphicon-exclamation-sign",
                    warning: "glyphicon-warning-sign"
                },

                noCache: true,
                si: "S",
                no: "N",

                /* Control de roles*/
                rolLdap: 1,
                rolPermiteEditar: true,

                /* Validaciones con listas de proceso y negocio*/
                codParametroPatrimonio: "003",
                codParametroFiducTemporal: "PTE",
                codigoParamEmpresa: "EMP",

                /* Otras constantes */
                accionServiciosRest: {insertar: "I", actualizar: "U", eliminar: "D"}
            }
        })())
})();