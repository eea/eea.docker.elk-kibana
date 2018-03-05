import { uiModules } from 'ui/modules';
const module = uiModules.get('kibana/kibana-html-plugin', ['kibana', 'ui.ace']);

module.controller('KbnHtmlEditController', ['$scope', function($scope) {
  $scope.aceLoaded = function(_editor){
    _editor.$blockScrolling = Infinity;
  };
}]);

module.controller('KbnHtmlVisController', function ($scope, $sce) {
  $scope.$watch('renderComplete', function () {
    var html = $scope.vis.params.html;
    if ($scope.updateStatus.params && html) {
      $scope.html = $sce.trustAsHtml(html);
    }
    $scope.renderComplete();
  });
});
