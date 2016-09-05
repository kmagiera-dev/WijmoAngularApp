'use strict';

var app = angular.module('app');

// application controller (single)
app.controller('appCtrl', function appCtrl($scope, $routeParams, $filter, $location) {

    // create portfolio
    var p = new finance.Portfolio();

    $scope.portfolio = p;
    $scope.ctx = {
        chart: null
    };

    // update angular when portfolio items change
    p.itemsChanged.addHandler(function () {
        $scope.$apply('portfolio.items');
    });

    // show positive values in green, negative in red
    $scope.getAmountColor = function (amount) {
        return amount < -0.01 ? '#9F3912' : amount > 0.01 ? '#217648' : '#b0b0b0';
    };

    // update chart selection to match portfolio selection
    function currentChanged() {
        if ($scope.ctx.chart && p) {
            var symbol = p.view.currentItem ? p.view.currentItem.symbol : null,
                selSeries = null,
                chart = $scope.ctx.chart;
            for (var i = 0; i < chart.series.length; i++) {
                if (chart.series[i].name == symbol) {
                    selSeries = chart.series[i];
                    break;
                }
            }
            chart.selection = selSeries;
        }
    }
    p.view.currentChanged.addHandler(currentChanged);

    // selection changed event handler for FlexChart
    $scope.selectionChanged = function (sender, args) {
        var chart = sender,
            symbol = chart.selection ? chart.selection.name : null,
            selSeries = null;
        for (var i = 0; i < p.view.items.length; i++) {
            if (p.view.items[i].symbol == symbol) {
                p.view.moveCurrentToPosition(i);
                $scope.$apply('portfolio.view.currentItem');
                break;
            }
        }
    };
});
