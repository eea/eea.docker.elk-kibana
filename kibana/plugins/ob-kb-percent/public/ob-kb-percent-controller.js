import { uiModules } from 'ui/modules';
const module = uiModules.get('kibana/ob-kb-percent', ['kibana']);
var numeral = require('numeral');

module.controller('PercentController', function($scope, Private) {

    var ratio = null;
    var percRatio = null;

    $scope.getValueFromAggs = function (tableGroups, type, params) {
        if (type === 'total') {
            return 
            return tableGroups.tables[0].rows.length;
        }
        if (type === 'namedBucket') {
            for (var i = 0; i < tableGroups.tables.length; i++) {
                const table = tableGroups.tables[i];
                for (var j = 0; j < table.rows.length; j++) {
                    const row = table.rows[j];      
                    const bucketName = row[0];
                    const bucketValue = row[1];
                    if (bucketName.toString() === params.namedBucket) {
                        return bucketValue;
                    }
                }
            }
          return 0.0;
        }
        if (type === 'nthBucket') {
            const table = tableGroups.tables[0];
            const bucket = table.rows[params.nthBucket - 1]; // one based.
            return bucket[1];
        }
        return 0;
    };

    $scope.$watch('esResponse', function (resp) {
      if (resp) {

		var numeratorType = $scope.vis.params.numeratorType;
		var numeratorParams = $scope.vis.params.numerator;
		var numerator = $scope.getValueFromAggs(resp, numeratorType, numeratorParams);

		var denominatorType = $scope.vis.params.denominatorType;
		var denominatorParams = $scope.vis.params.denominator;
		var denominator = $scope.getValueFromAggs(resp, denominatorType, denominatorParams);

        console.log("numerator = ", numerator);
        console.log("denominator = ", denominator);

		ratio = numerator / denominator;
        var arrowFlag =  percRatio = ratio - 1;
        ratio = numeral(ratio).format($scope.vis.params.format);
        percRatio = numeral(percRatio).format($scope.vis.params.format);
        
        var arrowSymbol = '';
        if ($scope.vis.params.displayArrow == true) {
            if (arrowFlag > 0) { 
                arrowSymbol = '➚'; //▲ ↑ ⇗
            } else if (arrowFlag < 0) {
                arrowSymbol = '➘'; //▼ ↓ ⇘
            }
            ratio = ratio.toString().concat(arrowSymbol);
            percRatio = percRatio.toString().concat(arrowSymbol);
        }
        if ($scope.vis.params.displayIncrement == true) { ratio = percRatio };
        $scope.ratio = ratio;
      }
    });

  });
