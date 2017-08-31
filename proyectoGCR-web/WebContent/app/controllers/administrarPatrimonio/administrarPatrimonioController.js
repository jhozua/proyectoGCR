(function () {
    angular.module('adminBusinessModule')

        .controller('administrarPatrimonioController', ['$rootScope', '$location', '$scope', 'businessAdminFactory', '$window', 'ngProgressFactory', 'businessAdminServiciosComunes', 'constantes',
            function ($rootScope, $location, $scope, businessAdminFactory, $window, ngProgressFactory, businessAdminServiciosComunes, constantes) {
                var vm = this;
                /* Inicio declaracion de progress bar en las consultas REST */
                vm.progressbar = ngProgressFactory.createInstance();
                vm.progressbar.setHeight(constantes.progressBar.height);
                vm.progressbar.setColor(constantes.progressBar.color);
                var codParamPT = {valor: "VLR", porcentaje: "PCT"};
                /* Fin Declaración */
                vm.patrimonio = {};

                /* descargar datos */
                vm.progressbar.start();
                businessAdminFactory.getData(constantes.endpoints.consultarPatrimonioTecnico, constantes.noCache)
                    .then(                        
                        function (result) {
                            vm.progressbar.complete();
                            vm.patrimonio = result.data.datos[0];
                            vm.patrimonio.forEach(function(element, index) {
                                if (element.codigoParametro == codParamPT.valor) {
                                    vm.indexValorPT = index;
                                } else if (element.codigoParametro == codParamPT.porcentaje) {
                                    vm.indexPorcentajePT = index;
                                }
                            });
                        },
                        function (error) {
                            vm.progressbar.complete();
                        }
                    )

                vm.guardarDatosPatrimonio = function () {
                    vm.progressbar.start();
                    businessAdminFactory.postData(constantes.endpoints.actualizarPatrimonioTecnico, vm.patrimonio)
                        .then(
                            function (result) {
                                businessAdminServiciosComunes.showAlert(result);
                                vm.progressbar.complete();
                            },
                            function (error) {
                                businessAdminServiciosComunes.showAlert(error);
                                vm.progressbar.complete();
                            }
                        );
                    
                };

                vm.salirMenu = function(){
                    $rootScope.$emit("alertEvent", {"show": false});
                    $window.sessionStorage.clear();
                    $location.path(constantes.url.main);
                };

                $rootScope.$emit('menuEvent', true);

            }
        ]);
})();