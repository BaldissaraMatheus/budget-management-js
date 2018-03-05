'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Precisa importar o polyfill
// Precisa tirar os console logs
var dataCtrl = function dataController() {
  var Group = function Group(name, type, total_value) {
    _classCallCheck(this, Group);

    this.name = name;
    this.type = type;
    this.total_value = total_value;
    this.items = [];
  };

  var Item = function Item(id, desc, value, date) {
    _classCallCheck(this, Item);

    this.id = id;
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
    addGroup: function addGroup(group, type) {
      var pos = void 0;

      if (data.groups.length != 0) {
        //console.log('data.groups não está vazio');
        pos = data.groups.findIndex(function (obj, index) {
          return obj.name === group;
        });
        //console.log(`pos = ${pos}`);
      }

      if (pos < 0 || pos === undefined) {
        //console.log(`Não encontrou esse grupo, então será criado um novo gupo para ${group}`);
        var newGroup = new Group(group, type, 0);
        data.groups.push(newGroup);
        //console.log(newGroup);
        return newGroup;
      } else {
        console.log('Grupo foi encontrado na posicao ' + pos);
        return false;
      }
    },

    addItem: function addItem(group, type, desc, val) {
      var newItem = void 0;
      var id = 0;
      var date = moment().format("DD/MM/YYYY");

      var pos = data.groups.findIndex(function (obj, index) {
        return obj.name === group;
      });

      if (data.groups[pos].items.length > 0) {
        id = data.groups[pos].items[data.groups[pos].items.length - 1].id + 1;
      }

      newItem = new Item(id, desc, val, date);
      data.groups[pos].items.push(newItem);

      //console.log(data.groups[pos].items);

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
    selectType: '#type',
    container: '#cards-container'
  };

  var groupNames = {
    sal: 'Salário',
    food: 'Comida',
    ent: 'Entreterimento'
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
    },

    addGroupUI: function addGroupUI(group, mobileDevice) {
      var container = DOMstrings.container;
      var elClass = void 0;
      var html = void 0;
      if (group) {
        if (mobileDevice === true) {
          html = "<div class='card shadow mobile-container $TYPE'><div class='card__head'><img src='https://dummyimage.com/50x50/000/fff' class='card__pic'><div class='card__data'><h2>$NAMEC<h2><h2 class='data__value'>+R$$VALUE</h2></div></div><ul class='card__list $LISTCLASS'></ul></div>";
        } else {
          if (group.type === 'inc') {
            html = "<div class='card shadow inc-container $TYPE'><div class='card__head'><img src='https://dummyimage.com/50x50/000/fff' class='card__pic'><div class='card__data'><h2>$NAME<h2><h2 class='data__value'>+R$$VALUE</h2></div></div><ul class='card__list $LISTCLASS'></ul></div>";
          } else {
            html = "<div class='card shadow exp-container $TYPE'><div class='card__head'><img src='https://dummyimage.com/50x50/000/fff' class='card__pic'><div class='card__data'><h2>$NAME<h2><h2 class='data__value'>-R$$VALUE</h2></div></div><ul class='card__list $LISTCLASS'></ul></div>";
          }
        }

        html = html.replace('$TYPE', group.type);
        html = html.replace('$NAME', groupNames[group.name]);
        html = html.replace('$VALUE', group.total_value);

        if (html.includes('$LISTCLASS')) {
          html = html.replace('$LISTCLASS', group.name);
        }

        document.querySelector(container).insertAdjacentHTML('beforeend', html);
      }
    },

    addItemUI: function addItemUI(item, group, type) {
      var container = '.' + group;
      //console.log(container);
      var html = void 0;
      var sign = void 0;

      if (type === 'inc') {
        sign = '+';
      } else {
        sign = '-';
      }

      html = "<li class='card__list__item'><div class='item__main-data'><h3>$DESC</h3><h4 class='data__value'>$SIGNR$$VALUE</h4></div><div><h6>$DATE</h6></div></li>";

      html = html.replace('$DESC', item.desc);
      html = html.replace('$VALUE', item.value);
      html = html.replace('$SIGN', sign);
      html = html.replace('$DATE', item.date);

      document.querySelector(container).insertAdjacentHTML('beforeend', html);
    }

  };
}();

var mainCtrl = function generalController(dataCtrl, UICtrl) {
  var winWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  var mobileDevice = void 0;
  var charts = void 0;

  if (winWidth < 768) {
    mobileDevice = true;
  } else {
    mobileDevice = false;
  }

  var createCharts = function createAndGetChartsFromTheUIController(winWidth) {
    var charts = UICtrl.displayCharts(winWidth);
    return charts;
  };

  var ctrlAddItem = function addGroupAndItemToTheDataStructureAndUI() {
    var input = UICtrl.getInput();
    var newItem = void 0;
    var newGroup = void 0;
    if (!isNaN(input.value)) {
      if (input.desc === '') input.desc = 'Sem descrição';
      newGroup = dataCtrl.addGroup(input.group, input.type);
      newItem = dataCtrl.addItem(input.group, input.type, input.desc, input.value);
      UICtrl.addGroupUI(newGroup, mobileDevice);
      UICtrl.addItemUI(newItem, input.group, input.type);
    }
  };

  var setEvtLst = function setEventListeners() {
    var DOMobj = UICtrl.getDOMstrings();
    document.querySelector(DOMobj.addBtn).addEventListener('click', ctrlAddItem);
  };

  return {
    init: function init() {
      charts = createCharts(winWidth);
      setEvtLst();
    }
  };
}(dataCtrl, UICtrl);

mainCtrl.init();
