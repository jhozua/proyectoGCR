(function(){
    angular.module("adminBusinessModule")
        .directive("gaModal", function(){
            return {
                restrict : 'E',
                scope : {},
                bindToController : {},
                templateUrl : "app/directives/gaModal/gaModalTmpl.html",
                controller : function($element, $rootScope){
                	var vm = this;
                	
                	vm.modalOpen = false;
                	
                	$rootScope.$on('gaModalEvent',function(event, args){
                        if(!vm.modalOpen){
                            vm.modalConfig = args;
                            vm.modalOpen = true;
                            $element.children(".modal").addClass("in");
                            $element.children(".modal").show();
                        }
                	});
                	
                	vm.closeModal = function(){
                		vm.modalOpen = false;
                		$element.children(".modal").hide();
                		$element.children(".modal").removeClass("in");
                	};
                	
                	vm.button1Action = function(){
                		if(typeof vm.modalConfig.button1Action === "function")	vm.modalConfig.button1Action();
                		vm.closeModal();
                	};
                	
                	vm.button2Action = function(){
                		if(typeof vm.modalConfig.button2Action === "function")	vm.modalConfig.button1Action();
                		vm.closeModal();
                	};
                	
                },
                controllerAs: "modal"
            }
        });
})();