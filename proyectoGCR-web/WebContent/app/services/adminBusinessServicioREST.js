(function(){
    angular.module('adminBusinessModule')
      .factory("businessAdminFactory", function($http){
        return {

            getData: function(reqUrl, nocache, pagina){
                var hData = {'Content-type': 'application/json; charset=UTF-8'};
                var pData = {};
                if(pagina !== undefined) pData.paginaSolicitada = pagina;
                if(nocache) {
                    hData['Cache-Control'] = 'no-cache, no-store, must-revalidate';
                    hData['Pragma'] = 'no-cache';
                    hData['Expires'] = '0';
                }
                return $http({
                    method : 'GET',
                    params: pData,
                    headers: hData,
                    url: reqUrl
                })
            },
            putData: function(reqUrl, datos){
                return $http({
                    method : 'PUT',
                    data: datos,
                    headers: {
                          'Content-type': 'application/json; charset=UTF-8'
                    },
                    url: reqUrl
                })
            },
            postData: function(reqUrl, datos){
                return $http({
                    method : 'POST',
                    data: datos,
                    headers: {
                          'Content-type': 'application/json; charset=UTF-8'
                    },
                    url: reqUrl
                })
            },

            deleteData: function(reqUrl, datos){
                return $http({
                    method : 'DELETE',
                    data: datos,
                    headers: {
                          'Content-type': 'application/json; charset=UTF-8'
                    },
                    url: reqUrl
                })
            },
            fileUpload: function(reqUrl, data){
                return $http({
                    method : 'POST',
                    headers: {
                          'Content-type':  undefined 
                    },
                    url: reqUrl,
                    data: data,
                    transformRequest: angular.identity
                });
            },
            fileDownload: function(reqUrl){
                return $http({
                    method : 'GET',
                    responseType: 'arraybuffer',
                    headers: {
                          'Content-type':  undefined 
                    },
                    url: reqUrl,
                    transformRequest: angular.identity
                });
            }
        };
    });
})();
