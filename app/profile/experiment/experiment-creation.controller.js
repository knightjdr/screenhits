(function() {
	'use strict';

	angular.module('app')
		.controller('experimentManagement', ['helperDialog', 'helperHTTP', 'helperObject', '$http', '$scope', '$timeout', function (helperDialog, helperHTTP, helperObject, $http, $scope, $timeout) {
      var vm = this;
			vm.form = {};
      vm.protocolDetails = false;
      vm.protocolCreation = false;
			vm.reset = function() {
        $scope.form.comment = '';
        $scope.form.description = '';
        $scope.form.protocol = '';
				$scope.form.$setPristine();
				$scope.form.$setUntouched();
				vm.form = {};
			};
			vm.submit = function(valid, form, project, screen) {
        if(valid && helperObject.notEmpty(form)) {
					vm.message = '';
					var formObject = form;
          formObject.project = project;
          formObject.screen = screen;
          var success = function(response) {
            vm.reset();
            vm.message = response.data.message;
						$timeout(function() {
							vm.message = '';
						}, 10000);
          };
          var failure = function(response) {
						vm.message = response.data.message;
						$timeout(function() {
							vm.message = '';
						}, 10000);
          };
          //helperHTTP.get('project/screen', formObject, success, failure);
        }
			};
      vm.protocols = {
        CRISPR: {
          viralProduction: ['Durocher 1', 'Durocher 2'],
          cellLine: ['Durocher 1', 'Durocher 2'],
          sequencing: ['Durocher 1', 'Durocher 2']
        }
      };
      /*vm.protocols = {
        CRISPR: [
          {
            description: 'Production of viral library',
            options: [ {
                name: 'Durocher protocol (November 25, 2016)',
                details: {
                  cell: {
                    cell: 'HEK293T',
                    description: 'Packaging cell line',
                    links: []
                  },
                  cellnumber: {
                    description: 'Cell number, flask size and flask number',
                    flasks: 'T75',
                    flaskNumber: '10',
                    number: '4x10^6'
                  },
                  confluency: {
                    description: 'Cell confluency at transfection',
                    confluency: '75%'
                  },
                  growth: {
                    description: 'Growth/cell culture conditions used to generate viral library',
                    details: 'Propagation Medium was prepared by adding 50 mL FBS to 500 mL of DMEM medium ( final concentration: 10% FBS). Medium was mixed thoroughly and stored at 4 degree_C. Cells were propagated up to a maximum of 10 passages before transfection. For splitting, cells were washed once with 1X PBS and incubated with 1X Trypsin at 37 degree_C until detachment of cells. Propagation medium was added to each flask and the cells were resuspended by gently pipetting the solution up and down. The cell suspension was distributed into new T25 or T75 flasks and incubated at 37 degree_C in a 5% CO2 incubator. Cells were splitted when a confluency of approximately 80% was reached. Cell lines were split twice a week at a ratio of 1:8'
                  },
                  plasmid: {
                    description: 'Packaging plasmids',
                    links: ['www.addgene.org/12260', 'www.addgene.org/8454'],
                    plasmids: ['psPAX2, p-CMV-VSV-g']
                  },
                  supernatent: {
                    description: 'Viral supernatent procedure',
                    details: 'following transfectioin with library plasmids and packaging vectors, cells were incubated for overnight. The next day DNAase I treatment was carried out to prevent undesired carryover of plasmid to virus library. At 48 post-transfection, virus-containing supernatant was harvested and filtered through a 0.22 PES filter. Virus-containing medim was snap-frozen in liquid nitrogen and stored @ -80 degrees_C.'
                  },
                  transfection: {
                    description: 'Transfection procedure',
                    details: '24 h post transfection, using TRANS-IT'
                  }
                }
              }
            ]
          }
        ]
      };*/
    }])
  ;
})();
