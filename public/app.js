'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dataCtrl = function dataController() {

  // Card e item vão ficar no banco de dados
  // Expenses e Incomes vão ficar na estrutura de datos interna

  // O group do item vai ser o name do card que ele ficará
  var Card = function Card(name, type, total_value, items) {
    _classCallCheck(this, Card);

    this.name = name;
    this.type = type;
    this.total_value = total_value;
    this.items = items;
  };

  var Item = function Item(id, type, desc, group, value, date) {
    _classCallCheck(this, Item);

    this.id = id;
    this.type = type;
    this.desc = desc;
    this.group = group;
    this.value = value;
    this.date = date;
  };

  var data = {
    groups: [],
    totals: {
      exp: 0,
      inc: 0
    }
  };

  var group1 = {
    name: 'hehehe',
    value: 50
  };

  var group2 = {
    name: 'rsrsrs',
    value: 150
  };

  // Add new item to database
  // Calculate budget
  return {};
}();

var UICtrl = function UIController() {

  // Get input values
  // add new item to UI
  // Update budget on UI

  return {
    displayCharts: function displayCharts(winWidth) {
      var chartGnrlEl = document.getElementById('chart--general').getContext('2d');
      var chartExpEl = document.getElementById('chart--exp').getContext('2d');
      var chartIncEl = document.getElementById('chart--inc').getContext('2d');
      var green = '#50CC80';
      var red = '#F8545F';

      var legDisplay = true;

      if (winWidth >= 768) {
        legDisplay = false;
      }

      Chart.defaults.global.responsive = true;
      Chart.defaults.global.legend.display = legDisplay;

      var chartGnrl = new Chart(chartGnrlEl, {
        type: 'pie',
        data: {
          labels: ['Rendas', 'Despesas'],
          datasets: [{
            data: [50, 27],

            backgroundColor: [green, red]
          }]
        }
      });

      var chartExp = new Chart(chartExpEl, {
        type: 'pie',
        data: {
          labels: ['Entreterimento', 'Transporte', 'Comida'],
          datasets: [{
            data: [1, 2, 3],

            backgroundColor: [green, red]
          }]
        }
      });

      var chartInc = new Chart(chartIncEl, {
        type: 'pie',
        data: {
          labels: ['Salário'],
          datasets: [{
            data: [100],

            backgroundColor: [green]
          }]
        }
      });

      var charts = [chartGnrl, chartExp, chartInc];
      return charts;
    }
  };
}();

var mainCtrl = function generalController(dataCtrl, UICtrl) {
  var winWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

  if (winWidth < 768) {
    var mobileDevice = true;
  } else {
    var _mobileDevice = false;
  }

  var createCharts = function createAndGetChartsFromTheUIController(winWidth) {
    var charts = UICtrl.displayCharts(winWidth);
    return charts;
  };

  var charts = void 0;

  var setEvtLst = function setEventListeners() {};

  console.log(charts);

  return {
    init: function init() {
      console.log('Js rodandoooo');
      charts = createCharts(winWidth);
      setEvtLst();
    }
  };
}(dataCtrl, UICtrl);

mainCtrl.init();
