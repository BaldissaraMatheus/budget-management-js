'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dataCtrl = function dataController() {
  var Group = function Group(name, type, total_value, items) {
    _classCallCheck(this, Group);

    this.name = name;
    this.type = type;
    this.total_value = total_value;
    this.items = items;
  };

  var Item = function Item(id, group, desc, value, date) {
    _classCallCheck(this, Item);

    this.id = id;
    this.group = group;
    this.desc = desc;
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

  // Add new item to database
  // Calculate budget
  return {

    // Fazer isso aqui funcionar, acho q precisa de polyfill
    addGroup: function addGroup(group, type) {
      var newGroup = void 0;
      var pos = void 0;

      if (data.groups) {
        pos = data.groups.find(function (el, index, array) {
          if (el.name === group) {
            console.log(index);
            return index;
          } else {
            console.log('false');
            return false;
          }
        });
        console.log(pos);
      }

      if (!pos) {
        //console.log('pos = undefined');
        newGroup = new Group(group, type, 0);
        data.groups.push(newGroup);
        console.log(newGroup + ' na posicao 0');
        return newGroup;
      } else {
        console.log(newGroup + ' na posicao ' + pos);
        return data.groups[pos];
      }
    },

    addItem: function addItem(group, type, desc, val) {
      var newItem = void 0;
      var id = 0;
      var date = new Date();

      // Usar o metodo find pra achar o grupo que tenha o nome como group
      /*
      if (data.groups[group].length > 0){
        id = data.groups[group][data.groups[group].length - 1].id + 1;
      }    
      */

      newItem = new Item(id, group, desc, val, date);
      // data.groups[group].push(newItem);

      return newItem;
    }
  };
}();

var UICtrl = function UIController() {

  // Get input values
  // add new item to UI
  // Update budget on UI

  var DOMstrings = {
    addBtn: '#add-btn',
    inputValue: '#value',
    selectGroup: '#group',
    inputDesc: '#desc',
    selectType: '#type'
  };

  return {
    getDOMstrings: function getDOMstrings() {
      return DOMstrings;
    },

    getInput: function getInput() {
      return {
        group: document.querySelector(DOMstrings.selectGroup).value,
        desc: document.querySelector(DOMstrings.inputDesc).value,
        type: document.querySelector(DOMstrings.selectType).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

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
  var charts = void 0;

  if (winWidth < 768) {
    var mobileDevice = true;
  } else {
    var _mobileDevice = false;
  }

  var createCharts = function createAndGetChartsFromTheUIController(winWidth) {
    var charts = UICtrl.displayCharts(winWidth);
    return charts;
  };

  var foo = function foo() {
    var input = UICtrl.getInput();
    var newItem = void 0;
    var newGroup = void 0;
    if (!isNaN(input.value)) {
      if (input.desc === '') input.desc = 'Sem descrição';
      newGroup = dataCtrl.addGroup(input.group, input.type);
      newItem = dataCtrl.addItem(input.group, input.type, input.desc, input.value);
      //console.log(newGroup, newItem);
    }
    //console.log('foo');
  };

  var setEvtLst = function setEventListeners() {
    var DOMobj = UICtrl.getDOMstrings();
    document.querySelector(DOMobj.addBtn).addEventListener('click', foo);
  };

  return {
    init: function init() {
      charts = createCharts(winWidth);
      setEvtLst();
    }
  };
}(dataCtrl, UICtrl);

mainCtrl.init();
