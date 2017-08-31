(function(){
    angular.module('adminBusinessModule')
	.filter('filterMiembrosGrupo', function() {
	   return function(items) {
	    var filtered = [];
	    angular.forEach(items, function(item) {		      
	       if(item.deleted === undefined || item.deleted === false){
	         filtered.push(item);
	       }
	    });	 
    	return filtered;
	  };
	})
	.filter("filtroMod", function () {
            return function (items) {
                var array = [];
                items.forEach(function (item, index) {
                    if (item.deleted === undefined || item.deleted === false) {
                        array.push(item);
                    }
                });
                return array;
            };
        })
    .filter("filterPlantillas", function () {
            return function (items) {
                var array = [];
                angular.forEach(items, function(item) {
                    if (item.accion != "D") {
                        array.push(item);
                    }
                });
                return array;
            };
        });
  })();