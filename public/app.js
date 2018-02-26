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

  var displayCharts = function displayChartsFunction() {
    var chartGnrlEl = document.getElementById('chart--general').getContext('2d');
    var chartExpEl = document.getElementById('chart--exp').getContext('2d');
    var chartIncEl = document.getElementById('chart--inc').getContext('2d');
    var green = '#50CC80';
    var red = '#F8545F';

    Chart.defaults.global.responsive = false;

    var chartGnrl = new Chart(chartGnrlEl, {
      type: 'pie',
      data: {
        labels: ['Rendas', 'Despesas'],
        datasets: [{
          data: [50, 27],

          backgroundColor: [green, red]
        }]
      },

      options: {
        legend: {
          display: true
        }
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
      },

      options: {
        legend: {
          display: true
        }
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
      },

      options: {
        legend: {
          display: true
        }
      }
    });
  };

  return {
    batata: function batata() {
      displayCharts();
    }
  };
}();

var mainCtrl = function generalController(dataCtrl, UICtrl) {
  var evtLst = function setEventListeners() {};

  return {
    init: function init() {
      console.log('Js rodando');
      UICtrl.batata();
    }
  };
}(dataCtrl, UICtrl);

mainCtrl.init();
