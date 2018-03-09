'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Precisa importar o polyfill
// Precisa tirar os console logs
var dataCtrl = function dataController() {
  var Group = function Group(name, type, text, total_value) {
    _classCallCheck(this, Group);

    this.name = name;
    this.type = type;
    this.text = text;
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

  var options = {
    exp: {
      names: ['Comida', 'Saúde', 'Serviços', 'Educação', 'Transporte', 'Entreterimento', 'Produtos Essenciais', 'Produtos Diversos', 'Impostos', 'Empréstimos', 'Investimentos', 'Outros'],
      values: ['food', 'health', 'serv_exp', 'educ', 'trasp', 'ent', 'prod_ess', 'prod_misc', 'tax', 'loan', 'inv_exp', 'others_exp'],
      icons: ['fa-utensils', 'fa-stethoscope', 'fa-cut', 'fa-university', 'fa-car', 'fa-gamepad', 'fa-home', 'fa-shopping-cart', 'fa-balance-scale', 'fa-money-bill-alt', 'fa-chart-pie', 'fa-bomb']
    },
    inc: {
      names: ['Salário', 'Vendas', 'Serviços', 'Investimentos', 'Outros'],
      values: ['sal', 'sales', 'serv_inc', 'inv_inc', 'others_inc'],
      icons: ['fa-money-bill-alt', 'fa-truck', 'fa-briefcase', 'fa-chart-line', 'fa-bomb']
    }
  };

  return {
    getOptions: function getOptions() {
      return options;
    },

    formatNumber: function formatNumber() {},

    addGroup: function addGroup(name, type, text) {
      var pos = void 0;

      if (data.groups.length != 0) {
        pos = data.groups.findIndex(function (obj, index) {
          return obj.name === name;
        });
      }

      if (pos < 0 || pos === undefined) {
        var newGroup = new Group(name, type, text, 0);
        data.groups.push(newGroup);
        return newGroup;
      } else {
        return data.groups[pos];
      }
    },

    addItem: function addItem(group, type, desc, val) {
      var date = moment().format("DD/MM/YYYY");
      var newItem = void 0;
      var id = 0;

      var pos = data.groups.findIndex(function (obj, index) {
        return obj.name === group;
      });

      if (data.groups[pos].items.length > 0) {
        id = data.groups[pos].items[data.groups[pos].items.length - 1].id + 1;
      }

      id = type + '-' + id;

      newItem = new Item(id, desc, val, date);
      data.groups[pos].items.push(newItem);

      return newItem;
    },

    updateGroupValue: function updateGroupValue(group, item) {
      group.total_value += item.value;
      return group.total_value;
    },

    updateTotals: function updateTotals(item, type) {
      data.totals[type] += item.value;
      return data.totals;
    },

    getItemData: function getItemData(item) {
      var groupIndex = data.groups.findIndex(function (group, i) {
        return group.name === item.group;
      });
      var itemIndex = data.groups[groupIndex].items.findIndex(function (groupItem, i) {
        return groupItem.id === item.id;
      });
      var itemValue = data.groups[groupIndex].items[itemIndex].value;

      if (item.type === 'exp') {
        itemValue *= -1;
      }

      var itemData = {
        groupIndex: groupIndex,
        itemIndex: itemIndex,
        itemValue: itemValue
      };

      return itemData;
    },

    verGroup: function verGroup(item, itemData) {
      if (data.groups[itemData.groupIndex].items.length === 0) {
        return true;
      } else {
        return false;
      }
    },

    deleteItem: function deleteItem(item, itemData) {
      var type = void 0;

      if (item.type === 'inc') {
        type = 0;
      } else {
        type = 1;
      }
      data.groups[itemData.groupIndex].total_value += itemData.value;
      data.groups[itemData.groupIndex].items.splice(itemData.itemIndex, 1);
    },

    deleteGroup: function deleteGroup(item, itemData, proceed) {
      if (proceed === true) {
        data.groups.splice(itemData.groupIndex, 1);
      }
    }

  };
}();

var UICtrl = function UIController() {

  var DOMstrings = {
    addBtn: '#add-btn',
    createBtn: '#create-btn',
    addForm: '#form-add',
    inputValue: '#value',
    selectGroup: '#group',
    inputDesc: '#desc',
    selectType: '#type',
    container: '#cards-container',
    containerInc: '#container-inc',
    containerExp: '#container-exp',
    containerMobile: '#container-mobile',
    delBtn: '.del-btn'
  };

  return {
    getDOMstrings: function getDOMstrings() {
      return DOMstrings;
    },

    getInput: function getInput() {
      return {
        groupName: document.querySelector(DOMstrings.selectGroup).value,
        selectOptionIndex: document.querySelector(DOMstrings.selectGroup).selectedIndex,
        desc: document.querySelector(DOMstrings.inputDesc).value,
        type: document.querySelector(DOMstrings.selectType).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    clearFields: function clearFields() {
      document.querySelector(DOMstrings.inputDesc).value = '';
      document.querySelector(DOMstrings.inputValue).value = '';
    },

    setTypeInc: function setTypeInc() {
      document.querySelector(DOMstrings.selectType).selectedIndex = 0;
    },

    displayCharts: function displayCharts(winWidth) {
      var chartGnrlEl = document.getElementById('chart--general').getContext('2d');
      var chartExpEl = document.getElementById('chart--exp').getContext('2d');
      var chartIncEl = document.getElementById('chart--inc').getContext('2d');
      var green = ['#50CC80', '#4E9CBA', '#B0EF5E', '#76BAD4', '#6260C7'];
      var red = ['#F8545F', '#FFAA56', '#E42E3B', '#FFD856', '#BA121E', '#EA8C30', '#FA7781', '#FFE079', '#FFBC79', '#EABF30', '#FFD2A5'];

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
            data: [0, 0],

            backgroundColor: [green[0], red[0]]
          }]
        }
      });

      var chartInc = new Chart(chartIncEl, {
        type: 'pie',
        data: {
          labels: [],
          datasets: [{
            data: [],

            backgroundColor: [green[0], green[1], green[2], green[3], green[4]]
          }]
        }
      });

      var chartExp = new Chart(chartExpEl, {
        type: 'pie',
        data: {
          labels: [],
          datasets: [{
            data: [],

            backgroundColor: [red[0], red[1], red[2], red[3], red[4], red[5], red[6], red[7], red[8], red[9], red[10]]
          }]
        }
      });

      var charts = [chartGnrl, chartInc, chartExp];
      return charts;
    },

    addGroupUI: function addGroupUI(group, mobileDevice, icon) {
      var containerInc = DOMstrings.containerInc;
      var containerExp = DOMstrings.containerExp;
      var html = void 0;

      if (!document.getElementById(group.name)) {
        /* if (mobileDevice === true) {
           html = "<div id='$ID' class='card shadow mobile-container $TYPE'><div class='card__head'><div class='card__icon card__icon--$TYPE-ICON'><i class='fas $ICON fa-2x'></i></div><div class='card__data'><h2>$NAME<h2><h2 class='data__value'>+R$$VALUE</h2></div></div><ul class='card__list $LISTCLASS'></ul></div>";
         } else {
           */
        if (group.type === 'inc') {
          html = "<div id='$ID' class='card shadow $TYPE'><div class='card__head'><div class='card__icon card__icon--$TYPE-ICON'><i class='fas $ICON fa-2x'></i></div><div class='card__data'><h2>$NAME<h2><h2 class='data__value'>+R$$VALUE</h2></div></div><ul class='card__list $LISTCLASS'></ul></div>";
        } else {
          html = "<div id='$ID' class='card shadow $TYPE'><div class='card__head'><div class='card__icon card__icon--$TYPE-ICON'><i class='fas $ICON fa-2x'></i></div><div class='card__data'><h2>$NAME<h2><h2 class='data__value'>-R$$VALUE</h2></div></div><ul class='card__list $LISTCLASS'></ul></div>";
        }

        html = html.replace('$ID', group.name);
        html = html.replace('$TYPE', group.type);
        html = html.replace('$NAME', group.text);
        html = html.replace('$VALUE', group.total_value);
        html = html.replace('$TYPE-ICON', group.type);
        html = html.replace('$ICON', icon);

        if (html.includes('$LISTCLASS')) {
          html = html.replace('$LISTCLASS', group.name);
        }
        /*
        if(mobileDevice === true) {
          document.querySelector(containerMobile).insertAdjacentHTML('beforeend', html);
        } else*/if (group.type === 'inc') {
          document.querySelector(containerInc).insertAdjacentHTML('beforeend', html);
        } else {
          document.querySelector(containerExp).insertAdjacentHTML('beforeend', html);
        }
      }
    },

    addItemUI: function addItemUI(item, group) {
      var container = '.' + group.name;
      var html = void 0;
      var sign = void 0;

      if (group.type === 'inc') {
        sign = '+';
      } else {
        sign = '-';
      }

      html = "<li class='card__list__item' id='$ID'><div class='item__main-data'><h3>$DESC</h3><h4 class='data__value'>$SIGNR$$VALUE</h4></div><div><h6>$DATE</h6><h2><a href='#' class='del-btn'>-</a></h2></div></li>";

      html = html.replace('$DESC', item.desc);
      html = html.replace('$VALUE', item.value);
      html = html.replace('$SIGN', sign);
      html = html.replace('$DATE', item.date);
      html = html.replace('$ID', item.id);

      document.querySelector(container).insertAdjacentHTML('beforeend', html);
    },

    updateGroupValueUI: function updateGroupValueUI(group) {
      var value = document.getElementById(group.name).getElementsByClassName('data__value')[0];
      var sign = void 0;

      if (group.type === 'inc') {
        sign = '+';
      } else {
        sign = '-';
      }

      value.innerHTML = sign + 'R$' + group.total_value;
    },

    updateOptions: function updateOptions(options, type) {
      var optionSelector = document.getElementById('group');
      var names = options[type].names;
      var values = options[type].values;

      for (var i = optionSelector.options.length - 1; i >= 0; i--) {
        optionSelector.options.remove(i);
      }

      for (var _i = 0; _i < names.length; _i++) {
        var option = document.createElement('option');
        option.text = names[_i];
        option.value = values[_i];
        optionSelector.options.add(option);
      }
    },

    updateCharts: function updateCharts(charts, newItem, newGroup) {
      var i = void 0;

      if (newGroup.type === 'inc') {
        i = 1;
      } else {
        i = 2;
      }

      charts[0].data.datasets[0].data[i - 1] += newItem.value;

      var index = charts[i].data.labels.findIndex(function (el, index) {
        return el === newGroup.text;
      });

      if (index !== -1) {
        charts[i].data.datasets[0].data[index] += newItem.value;
      } else {
        charts[i].data.labels.push(newGroup.text);
        charts[i].data.datasets[0].data.push(newItem.value);
      }

      charts.forEach(function (el) {
        el.update();
      });
    },

    updateBudget: function updateBudget(inc, exp) {
      var budgetContainer = document.getElementById('display-budget');
      var expContainer = document.getElementById('display-exp');
      var incContainer = document.getElementById('display-inc');
      var expPercent = document.getElementById('display-percent');
      var percent = void 0;

      if (inc !== 0) {
        percent = Math.round(exp / inc * 100);
      } else {
        percent = 0;
      }

      expContainer.innerHTML = 'R$' + exp;
      incContainer.innerHTML = 'R$' + inc;
      budgetContainer.innerHTML = 'R$' + (inc - exp);
      expPercent.innerHTML = percent + '% do saldo gasto';
    },

    deleteItem: function deleteItem(item) {
      var DOMitem = document.getElementById(item.id);
      DOMitem.innerHTML = '';
    },

    deleteGroup: function deleteGroup(item, proceede) {
      var card = document.getElementById(item.group);
      if (proceede === true) {
        card.innerHTML = '';
      }
    },

    displayForm: function displayForm() {
      var form = document.querySelector(DOMstrings.addForm);
      form.classList.toggle('js-form--hide');
    },

    hideForm: function hideForm() {
      var form = document.querySelector(DOMstrings.addForm);
      form.classList.add('js-form--hide');
    },

    showForm: function showForm() {
      var form = document.querySelector(DOMstrings.addForm);
      form.classList.remove('js-form--hide');
    }

  };
}();

var mainCtrl = function generalController(dataCtrl, UICtrl) {
  var options = dataCtrl.getOptions();
  var winWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  var mobileDevice = false;
  var charts = void 0;

  var setMobileUI = function setUIForMobileUsers() {
    if (mobileDevice === true && winWidth > 768) {
      mobileDevice = false;
      UICtrl.showForm();
    } else if (mobileDevice === false && winWidth < 768) {
      mobileDevice = true;
      UICtrl.hideForm();
    }
  };

  var createCharts = function createAndGetChartsFromTheUIController(winWidth) {
    var charts = UICtrl.displayCharts(winWidth);
    return charts;
  };

  var ctrlAddItem = function addGroupAndItemToTheDataStructureAndUI() {
    var input = UICtrl.getInput();
    var totals = void 0;
    var newItem = void 0;
    var newGroup = void 0;
    if (!isNaN(input.value)) {
      if (input.desc === '') input.desc = 'Sem descrição';
      newGroup = dataCtrl.addGroup(input.groupName, input.type, options[input.type].names[input.selectOptionIndex]);
      newItem = dataCtrl.addItem(input.groupName, input.type, input.desc, input.value);
      UICtrl.addGroupUI(newGroup, mobileDevice, options[input.type].icons[input.selectOptionIndex]);
      UICtrl.addItemUI(newItem, newGroup);
      dataCtrl.updateGroupValue(newGroup, newItem);
      UICtrl.updateGroupValueUI(newGroup);
      UICtrl.updateOptions(options, newGroup.type);
      totals = dataCtrl.updateTotals(newItem, newGroup.type);
      UICtrl.updateCharts(charts, newItem, newGroup);
      UICtrl.updateBudget(totals.inc, totals.exp);
      UICtrl.clearFields();
    }
  };

  var restartFields = function setTheDefaultValuesToFields() {
    UICtrl.clearFields();
    UICtrl.updateBudget(0, 0);
    UICtrl.setTypeInc();
    UICtrl.updateOptions(dataCtrl.getOptions(), 'inc');
  };

  var getItem = function getSelectedItem(e) {
    var selector = e.target;

    if (selector.classList.contains('del-btn')) {
      selector = selector.parentNode.parentNode.parentNode;

      // get ID
      var id = selector.id;

      // get Group
      var group = selector.parentNode;
      group = group.className.split(' ');
      group = group[group.length - 1];

      // get Type
      var type = selector.parentNode.parentNode;
      type = type.className.split(' ');
      type = type[type.length - 1];

      var item = {
        id: id,
        group: group,
        type: type
      };

      return item;
    }
  };

  var ctrlDelItem = function deleteItemFromDataAndUI(e) {
    var item = getItem(e);
    var itemData = dataCtrl.getItemData(item);
    var emptyGroup = void 0;

    dataCtrl.deleteItem(item, itemData);
    emptyGroup = dataCtrl.verGroup(item, itemData);
    UICtrl.updateGroupValueUI(item.group);
    dataCtrl.deleteGroup(item, itemData, emptyGroup);
    UICtrl.deleteItem(item);
    UICtrl.deleteGroup(item, emptyGroup);

    //UICtrl.updateCharts(charts, item, newGroup);
    //UICtrl.updateBudget(totals.inc, totals.exp);
  };

  var setEvtLst = function setEventListeners() {
    var DOMobj = UICtrl.getDOMstrings();
    document.querySelector(DOMobj.addBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function (event) {
      if (event.keycode === 13 || event.which === 13) ctrlAddItem();
    });
    document.querySelector(DOMobj.selectType).addEventListener('change', function () {
      var input = UICtrl.getInput();
      UICtrl.updateOptions(options, input.type);
    });
    document.querySelector(DOMobj.createBtn).addEventListener('click', function () {
      UICtrl.displayForm();
    });
    document.querySelector(DOMobj.container).addEventListener('click', ctrlDelItem);

    window.addEventListener('resize', function () {
      winWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      setMobileUI();
    });
  };

  return {
    init: function init() {
      charts = createCharts(winWidth);
      restartFields();
      setEvtLst();
    }
  };
}(dataCtrl, UICtrl);

mainCtrl.init();
