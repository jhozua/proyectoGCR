(function(){
    angular.module('adminBusinessModule', ['ngRoute', 'ngProgress','treeTable'])
    .config(['$routeProvider', '$qProvider', '$compileProvider', 'constantes', function ($routeProvider, $qProvider, $compileProvider, constantes)
    {
        $compileProvider.preAssignBindingsEnabled(true);
        $qProvider.errorOnUnhandledRejections(false);
        $routeProvider.when(constantes.url.gestionComite, {
            templateUrl : "app/views/administrarComite/administrarComite.html",
            controller : "administrarComiteController",
            controllerAs: "administrarComites"
        }).when(constantes.url.editarComite, {
              templateUrl : "app/views/administrarComite/edicionComite.html",
             controller : "edicionComiteController",
             controllerAs: "edicionComites"
        }).when(constantes.url.crearComite, {
              templateUrl : "app/views/administrarComite/crearComite.html",
             controller : "crearComiteController",
             controllerAs: "creacionComite"
        }).when(constantes.url.adminParticipante, {
              templateUrl : "app/views/administrarComite/administrarParticipante.html",
             controller : "administrarParticipanteController",
             controllerAs: "adminParticipantes"
        }).when(constantes.url.agregarParticipante, {
              templateUrl : "app/views/administrarComite/agregarParticipante.html",
             controller : "agregarParticipanteController",
             controllerAs: "agregarParticipantes"
        }).when(constantes.url.crearParticipante, {
              templateUrl : "app/views/administrarComite/crearParticipante.html",
             controller : "crearParticipanteController",
             controllerAs: "crearParticipante"
        }).when(constantes.url.gestionModalidades, {
            templateUrl : "app/views/administrarModalidadLinea/administrarModalidades.html",
            controller : "administrarModalidadController",
            controllerAs: "adminModalidades"
        }).when(constantes.url.crearModalidad, {
            templateUrl : "app/views/administrarModalidadLinea/crearModalidad.html",
            controller : "crearModalidadController",
            controllerAs: "crearModalidad"
        }).when(constantes.url.editarModalidad, {
            templateUrl : "app/views/administrarModalidadLinea/editarModalidad.html",
            controller : "editarModalidadController",
            controllerAs: "editarModalidad"
        }).when(constantes.url.gestionLineas, {
            templateUrl : "app/views/administrarModalidadLinea/administrarLineas.html",
            controller : "administrarLineaController",
            controllerAs: "administrarLinea"
        }).when(constantes.url.crearLinea, {
            templateUrl : "app/views/administrarModalidadLinea/crearLinea.html",
            controller : "crearLineaController",
            controllerAs : "crearLinea"
        }).when(constantes.url.editarLinea, {
            templateUrl : "app/views/administrarModalidadLinea/editarLinea.html",
            controller : "editarLineaController",
            controllerAs : "editarLinea"
        }).when(constantes.url.grupos, {
            templateUrl : "app/views/administrarGrupos/administrarGrupos.html",
            controller : "administrarGruposController",
            controllerAs : "adminGrupos"
        }).when(constantes.url.gruposAgregarMiembro, {
            templateUrl : "app/views/administrarGrupos/agregarMiembrosGrupo.html",
            controller : "agregarMiembrosGrupoController",
            controllerAs : "agregarMiembrosGrupo"
        }).when(constantes.url.gestionPlantillas, {
            templateUrl : "app/views/administrarPlantillas/administrarPlantillas.html",
            controller : "administrarPlantillasController",
            controllerAs : "adminPlantillas"
        }).when(constantes.url.crearPlantilla, {
            templateUrl : "app/views/administrarPlantillas/agregarPlantillas.html",
            controller : "agregarPlantillasController",
            controllerAs : "crearPlantilla"
        }).when(constantes.url.editarPlantilla, {
            templateUrl : "app/views/administrarPlantillas/editarPlantillas.html",
            controller : "editarPlantillasController",
            controllerAs : "editarPlantilla"
        }).when(constantes.url.gestionPatrimonio, {
            templateUrl : "app/views/administrarPatrimonio/administrarPatrimonio.html",
            controller : "administrarPatrimonioController",
            controllerAs : "adminPatrimonio"
        }).when(constantes.url.consultarCliente, {
            templateUrl : "app/views/consultarCliente/consultarCliente.html",
            controller : "consultarClienteController",
            controllerAs : "consultarCliente"
        }).when(constantes.url.consultarPCGrupo, {
            templateUrl : "app/views/consultarCliente/consultarPCGrupo.html",
            controller : "consultarPCGrupoController",
            controllerAs : "consultarPCGrupo"
        }).when(constantes.url.agregarEmpresas, {
              templateUrl : "app/views/administrarCUTPA/agregarEmpresas.html",
            controller : "agregarEmpresasController",
            controllerAs : "agregarEmpresas"
        }).when(constantes.url.gestionCUTPA, {
              templateUrl : "app/views/administrarCUTPA/administrarCUTPA.html",
            controller : "administrarCUTPAController",
            controllerAs : "adminCUTPA"
        }).when(constantes.url.crearCUTPA, {
              templateUrl : "app/views/administrarCUTPA/crearCUTPA.html",
            controller : "crearCUTPAController",
            controllerAs : "crearCUTPA"
        }).when(constantes.url.editarCUTPA, {
              templateUrl : "app/views/administrarCUTPA/consultarEditarCUTPA.html",
            controller : "consultarEditarCUTPAController",
            controllerAs : "consultarEditarCUTPA"
        }).when(constantes.url.gestionFuncionalidades, {
              templateUrl : "app/views/administrarSeguridad/administrarFuncionalidades.html",
            controller : "administrarFuncionalidadesController",
            controllerAs : "adminFunc"
        }).when(constantes.url.gestionCamposFuncionalidades, {
              templateUrl : "app/views/administrarSeguridad/administrarCamposFuncionalidades.html",
            controller : "administrarCamposFuncionalidadesController",
            controllerAs : "adminCamposFunc"
        }).when(constantes.url.gestionRolesUsuarios, {
              templateUrl : "app/views/administrarSeguridad/administrarRolesUsuarios.html",
            controller : "administrarRolesUsuariosController",
            controllerAs : "adminRolesUsuarios"
        }).when(constantes.url.gestionFuncionalidadesRoles, {
              templateUrl : "app/views/administrarSeguridad/administrarFuncionalidadesRoles.html",
            controller : "administrarFuncionalidadesRolesController",
            controllerAs : "adminFuncRoles"
        }).when(constantes.url.login, {
              templateUrl : "app/views/main/login.html",
            controller: "loginController",
            controllerAs: "login"
        }).when(constantes.url.seguridadMain, {
              templateUrl : "app/views/administrarSeguridad/seguridadMain.html",
            controller: "seguridadMain",
            controllerAs: "segMain"
        }).when(constantes.url.compararPC, {
              templateUrl : "app/views/compararPC/compararPC.html",
            controller: "compararPCController",
            controllerAs: "compararPC"
        }).when(constantes.url.main, {
              templateUrl : "app/views/main/main.html",
            controller: "mainController",
            controllerAs: "main"
        }).when(constantes.url.compararPCInput, {
              templateUrl : "app/views/consultarCliente/compararPCInput.html",
            controller: "compararPCInputController",
            controllerAs: "compararPCInput"
        }).when(constantes.url.gestionarGrupoSeguridad, {
              templateUrl : "app/views/administrarSeguridad/administrarGrupos.html",
            controller: "administrarGruposSeguridadController",
            controllerAs: "adminGruposSeguridad"
        }).when(constantes.url.crearGrupoSeguridad, {
              templateUrl : "app/views/administrarSeguridad/agregarGruposSeguridad.html",
            controller: "agregarGruposSeguridadController",
            controllerAs: "crearGrupoSeguridad"
        })
        .otherwise({ redirectTo : constantes.url.login});
    }]);
})();