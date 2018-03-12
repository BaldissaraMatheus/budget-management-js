'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

    addItem: function addItem(group, type, desc, value) {
      var date = moment().format("DD/MM/YYYY");
      var id = 0;
      var newItem = void 0;

      var pos = data.groups.findIndex(function (obj, index) {
        return obj.name === group;
      });

      if (data.groups[pos].items.length > 0) {
        id = data.groups[pos].items[data.groups[pos].items.length - 1].id + 1;
      }

      newItem = new Item(id, desc, value, date);
      data.groups[pos].items.push(newItem);

      return newItem;
    },

    updateGroupValue: function updateGroupValue(group, item) {
      var total = group.total_value;
      var sum = total + item.value;

      group.total_value = parseFloat(sum.toFixed(2));

      return group.total_value;
    },

    updateTotals: function updateTotals(item, group) {
      type = group.type;
      data.totals[type] += item.value;

      return data.totals;
    },

    getItemData: function getItemData(item) {
      var id = item.id;

      id = id.split(item.group + '-');
      id = parseInt(id[1]);

      var groupIndex = data.groups.findIndex(function (group, i) {
        return group.name === item.group;
      });
      var itemIndex = data.groups[groupIndex].items.findIndex(function (groupItem, i) {
        return groupItem.id === id;
      });
      var itemValue = data.groups[groupIndex].items[itemIndex].value;

      var itemData = {
        groupIndex: groupIndex,
        itemIndex: itemIndex,
        value: itemValue * -1,
        id: id,
        group: item.group,
        type: item.type
      };

      return itemData;
    },

    getGroupData: function getGroupData(item) {
      var group = data.groups[item.groupIndex];
      var groupObj = {
        name: group.name,
        type: group.type,
        text: group.text,
        total_value: group.total_value
      };

      return groupObj;
    },


    verGroup: function verGroup(item) {
      if (data.groups[item.groupIndex].items.length === 0) {
        return true;
      } else {
        return false;
      }
    },

    deleteItem: function deleteItem(item) {
      data.groups[item.groupIndex].items.splice(item.itemIndex, 1);
    },

    deleteGroup: function deleteGroup(item, proceed) {
      if (proceed) data.groups.splice(item.groupIndex, 1);
    }

  };
}();

var UICtrl = function UIController() {

  var DOMstrings = {
    addBtn: 'add-btn',
    createBtn: 'create-btn',
    addForm: 'form-add',
    inputValue: 'value',
    selectGroup: 'group',
    inputDesc: 'desc',
    selectType: 'type',
    container: 'cards-container',
    containerInc: 'container-inc',
    containerExp: 'container-exp',
    containerMobile: 'container-mobile',
    filterSelect: 'filter'
  };

  return {
    getDOMstrings: function getDOMstrings() {
      return DOMstrings;
    },

    getInput: function getInput() {
      var inputValue = document.getElementById(DOMstrings.inputValue).value;
      if (inputValue.includes(',')) {
        inputValue = inputValue.replace(',', '.');
        while (inputValue.includes(',')) {
          inputValue = inputValue.replace(',', '');
        }
      }

      return {
        groupName: document.getElementById(DOMstrings.selectGroup).value,
        selectOptionIndex: document.getElementById(DOMstrings.selectGroup).selectedIndex,
        desc: document.getElementById(DOMstrings.inputDesc).value,
        type: document.getElementById(DOMstrings.selectType).value,
        value: parseFloat(inputValue),
        filter: document.getElementById(DOMstrings.filterSelect).value
      };
    },

    clearFields: function clearFields() {
      document.getElementById(DOMstrings.inputDesc).value = '';
      document.getElementById(DOMstrings.inputValue).value = '';
      document.getElementById(DOMstrings.filterSelect).value = 'all';
    },

    setTypeInc: function setTypeInc() {
      document.getElementById(DOMstrings.selectType).selectedIndex = 0;
    },

    displayCharts: function displayCharts(winWidth) {
      var chartGnrlEl = document.getElementById('chart--general').getContext('2d');
      var chartExpEl = document.getElementById('chart--exp').getContext('2d');
      var chartIncEl = document.getElementById('chart--inc').getContext('2d');
      var green = ['#50CC80', '#4E9CBA', '#B0EF5E', '#76BAD4', '#6260C7'];
      var red = ['#F8545F', '#FFAA56', '#E42E3B', '#FFD856', '#BA121E', '#EA8C30', '#FA7781', '#FFE079', '#FFBC79', '#EABF30', '#FFD2A5'];

      var legDisplay = true;

      if (winWidth >= 768) legDisplay = false;

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

        if (group.type === 'inc') {
          document.getElementById(containerInc).insertAdjacentHTML('beforeend', html);
        } else {
          document.getElementById(containerExp).insertAdjacentHTML('beforeend', html);
        }
      }
    },

    addItemUI: function addItemUI(item, group) {
      var container = '.' + group.name;
      var html = void 0;
      var sign = void 0;
      var id = void 0;

      if (group.type === 'inc') {
        sign = '+';
      } else {
        sign = '-';
      }

      id = group.name + '-' + item.id;

      html = "<li class='card__list__item' id='$ID'><div class='item__main-data'><h3>$DESC</h3><h4 class='data__value'>$SIGNR$$VALUE</h4></div><div><h6>$DATE</h6><h2><a href='javascript:' class='del-btn'>-</a></h2></div></li>";

      html = html.replace('$DESC', item.desc);
      html = html.replace('$VALUE', item.value);
      html = html.replace('$SIGN', sign);
      html = html.replace('$DATE', item.date);
      html = html.replace('$ID', id);

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

    updateCharts: function updateCharts(charts, item, group, totals) {
      var i = void 0;
      var balance = void 0;

      if (totals.exp > totals.inc) {
        balance = 100;
      } else {
        balance = totals.exp / totals.inc * 100;
        balance = balance.toFixed(2);
      }

      charts[0].data.datasets[0].data[1] = balance;
      charts[0].data.datasets[0].data[0] = 100 - balance;

      if (group.type === 'inc') {
        i = 1;
      } else {
        i = 2;
      }

      var index = charts[i].data.labels.findIndex(function (el, index) {
        return el === group.text;
      });

      if (index !== -1) {
        charts[i].data.datasets[0].data[index] += item.value;
      } else {
        charts[i].data.labels.push(group.text);
        charts[i].data.datasets[0].data.push(item.value);
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
        percent = exp / inc * 100;
        percent = percent.toFixed(2);
      } else {
        percent = 0;
      }

      expContainer.innerHTML = 'R$' + exp.toFixed(2);
      incContainer.innerHTML = 'R$' + inc.toFixed(2);
      budgetContainer.innerHTML = 'R$' + (inc - exp).toFixed(2);
      expPercent.innerHTML = percent + '% do saldo gasto';
    },

    deleteItem: function deleteItem(item) {
      var DOMitem = document.getElementById(item.group + '-' + item.id);
      DOMitem.parentNode.removeChild(DOMitem);
    },

    deleteGroup: function deleteGroup(item, proceede) {
      var card = document.getElementById(item.group);
      if (proceede) card.parentNode.removeChild(card);
    },

    displayForm: function displayForm() {
      var form = document.getElementById(DOMstrings.addForm);
      form.classList.toggle('js-hide');
    },

    hideForm: function hideForm() {
      var form = document.getElementById(DOMstrings.addForm);
      form.classList.add('js-hide');
    },

    showForm: function showForm() {
      var form = document.getElementById(DOMstrings.addForm);
      form.classList.remove('js-hide');
    },

    showSelectedItems: function showSelectedItems(selection) {
      var containerInc = document.getElementById(DOMstrings.containerInc);
      var containerExp = document.getElementById(DOMstrings.containerExp);

      containerInc.classList.remove('js-hide');
      containerExp.classList.remove('js-hide');

      if (selection === 'inc') {
        containerExp.classList.add('js-hide');
      } else if (selection === 'exp') {
        containerInc.classList.add('js-hide');
      }
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

  var formatNum = function formatNumber(input) {
    var outputValue = input;

    outputValue = Math.abs(outputValue);
    outputValue = parseFloat(outputValue.toFixed(2));

    return outputValue;
  };

  var ctrlAddItem = function addGroupAndItemToTheDataStructureAndUI() {
    var input = UICtrl.getInput();
    var totals = void 0;
    var newItem = void 0;
    var newGroup = void 0;

    if (!isNaN(input.value)) {
      if (input.desc === '') input.desc = 'Sem descrição';
      newGroup = dataCtrl.addGroup(input.groupName, input.type, options[input.type].names[input.selectOptionIndex]);
      newItem = dataCtrl.addItem(input.groupName, input.type, input.desc, formatNum(input.value));
      UICtrl.addGroupUI(newGroup, mobileDevice, options[input.type].icons[input.selectOptionIndex]);
      UICtrl.addItemUI(newItem, newGroup);
      dataCtrl.updateGroupValue(newGroup, newItem);
      UICtrl.updateGroupValueUI(newGroup);
      UICtrl.updateOptions(options, newGroup.type);
      totals = dataCtrl.updateTotals(newItem, newGroup);
      UICtrl.updateCharts(charts, newItem, newGroup, totals);
      UICtrl.updateBudget(totals.inc, totals.exp);
      UICtrl.showSelectedItems('all');
      UICtrl.clearFields();
    }
  };

  var restartFields = function setTheDefaultValuesToFields() {
    UICtrl.clearFields();
    UICtrl.updateBudget(0, 0);
    UICtrl.setTypeInc();
    UICtrl.updateOptions(dataCtrl.getOptions(), 'inc');
    UICtrl.showSelectedItems('all');
  };

  var getItemUI = function getSelectedItem(e) {
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
      var _type = selector.parentNode.parentNode;
      _type = _type.className.split(' ');
      _type = _type[_type.length - 1];

      var item = {
        id: id,
        group: group,
        type: _type
      };

      return item;
    }
  };

  var ctrlDelItem = function deleteItemFromDataAndUI(e) {

    var item = getItemUI(e);
    item = dataCtrl.getItemData(item);
    var group = dataCtrl.getGroupData(item);
    var totals = dataCtrl.updateTotals(item, group);
    var emptyGroup = void 0;

    dataCtrl.deleteItem(item);
    emptyGroup = dataCtrl.verGroup(item);
    dataCtrl.updateGroupValue(group, item);
    UICtrl.updateGroupValueUI(group);
    dataCtrl.deleteGroup(item, emptyGroup);
    UICtrl.deleteItem(item);
    UICtrl.deleteGroup(item, emptyGroup);
    UICtrl.updateBudget(totals.inc, totals.exp);
    UICtrl.updateCharts(charts, item, group, totals);
  };

  var setEvtLst = function setEventListeners() {
    var DOMobj = UICtrl.getDOMstrings();
    document.getElementById(DOMobj.addBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function (event) {
      if (event.keycode === 13 || event.which === 13) ctrlAddItem();
    });

    document.getElementById(DOMobj.selectType).addEventListener('change', function () {
      var input = UICtrl.getInput();
      UICtrl.updateOptions(options, input.type);
    });

    document.getElementById(DOMobj.filterSelect).addEventListener('change', function () {
      var input = UICtrl.getInput();
      UICtrl.showSelectedItems(input.filter);
    });

    document.getElementById(DOMobj.createBtn).addEventListener('click', function () {
      UICtrl.displayForm();
    });

    document.getElementById(DOMobj.container).addEventListener('click', ctrlDelItem);

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
