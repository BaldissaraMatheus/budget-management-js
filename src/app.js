const dataCtrl = (function dataController() {

  class Group {
    constructor(name, type, text, total_value) {
      this.name = name;
      this.type = type;
      this.text = text;
      this.total_value = total_value;
      this.items = [];
    }
  }

  class Item {
    constructor(id, desc, value, date) {
      this.id = id;
      this.desc = desc;
      this.value = value;
      this.date = date;
    }
  }

  const data = {
    groups: [],
    totals : {
      exp: 0,
      inc: 0
    }
  };

  const options = {
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
    getOptions: () => {
      return options;
    },

    addGroup: (name, type, text) => {
      let pos;

      if (data.groups.length != 0) {
        pos = data.groups.findIndex((obj, index) => (obj.name === name));
      }

      if (pos < 0 || pos === undefined) {
        const newGroup = new Group(name, type, text, 0);
        data.groups.push(newGroup);
        
        return newGroup;

      } else {
        return data.groups[pos];     
      }
    },

    addItem: (group, type, desc, value) => {
      const date = moment().format("DD/MM/YYYY");
      let id = 0;
      let newItem;
      
      const pos = data.groups.findIndex((obj, index) => (obj.name === group));

      if (data.groups[pos].items.length > 0) {
        id = data.groups[pos].items[data.groups[pos].items.length - 1].id + 1;
      }

      newItem = new Item(id, desc, value, date);
      data.groups[pos].items.push(newItem);

      return newItem;
    },

    updateGroupValue: (group, item) => {
      const total = group.total_value;
      const sum = (total + item.value);

      group.total_value = parseFloat(sum.toFixed(2));

      return group.total_value;
    },

    updateTotals: (item, group) => {
      const type = group.type;
      data.totals[type] += item.value;

      return data.totals;
    },

    getItemData: (item) => {
      let id = item.id;

      id = id.split(`${item.group}-`);
      id = parseInt(id[1]);

      const groupIndex = data.groups.findIndex((group, i) => (group.name === item.group));
      const itemIndex = data.groups[groupIndex].items.findIndex((groupItem, i) => (groupItem.id === id));
      let itemValue = data.groups[groupIndex].items[itemIndex].value;

      const itemData = {
        groupIndex: groupIndex,
        itemIndex: itemIndex,
        value: itemValue * -1,
        id: id,
        group: item.group,
        type: item.type
      };

      return itemData;
    },

    getGroupData(item) {
      const group = data.groups[item.groupIndex];
      const groupObj = {
        name: group.name,
        type: group.type,
        text: group.text,
        total_value: group.total_value
      };

      return groupObj;
    },

    verGroup: (item) => {
      if (data.groups[item.groupIndex].items.length === 0) {
        return true;

      } else {
        return false;
      }
    },

    deleteItem: (item) => {
      data.groups[item.groupIndex].items.splice(item.itemIndex, 1);
    },

    deleteGroup: (item, proceed) => {
      if (proceed) data.groups.splice(item.groupIndex, 1);
    },

  };
}());

const UICtrl = (function UIController() {
  
  const DOMstrings = {
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
    getDOMstrings: () => {
      return DOMstrings;
    },

    getInput: () => {
      let inputValue = document.getElementById(DOMstrings.inputValue).value;
      if (inputValue.includes(',')) {
        inputValue = inputValue.replace(',','.');
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

    clearFields: () => {
      document.getElementById(DOMstrings.inputDesc).value = '';
      document.getElementById(DOMstrings.inputValue).value = '';
      document.getElementById(DOMstrings.filterSelect).value = 'all';
    },

    setTypeInc: () => {
      document.getElementById(DOMstrings.selectType).selectedIndex = 0;
    },

    displayCharts: (winWidth) => {
      let chartGnrlEl = document.getElementById('chart--general').getContext('2d');
      let chartExpEl = document.getElementById('chart--exp').getContext('2d');
      let chartIncEl = document.getElementById('chart--inc').getContext('2d');
      const green = ['#50CC80', '#4E9CBA', '#B0EF5E', '#76BAD4', '#6260C7'];
      const red = ['#F8545F', '#FFAA56', '#E42E3B', '#FFD856', '#BA121E', '#EA8C30', '#FA7781', '#FFE079', '#FFBC79', '#EABF30', '#FFD2A5'];
  
      let legDisplay = true;
  
      if (winWidth >= 768) legDisplay = false;      
  
      Chart.defaults.global.responsive = true;
      Chart.defaults.global.legend.display = legDisplay;

      let chartGnrl = new Chart(chartGnrlEl, {
        type: 'pie',
        data:{
          labels:['Rendas', 'Despesas'],
          datasets:[{
            data: [
              0,
              0
            ],
    
          backgroundColor:[
            green[0],
            red[0],
          ]
          }]
        }
      });

      let chartInc = new Chart(chartIncEl, {
        type: 'pie',
        data:{
          labels:[],
          datasets:[{
            data: [],
    
          backgroundColor:[
            green[0],
            green[1],
            green[2],
            green[3],
            green[4]
          ]
          }]
        }
      });

      let chartExp = new Chart(chartExpEl, {
        type: 'pie',
        data:{
          labels:[],
          datasets:[{
            data: [],
    
          backgroundColor:[
            red[0],
            red[1],
            red[2],
            red[3],
            red[4],
            red[5],
            red[6],
            red[7],
            red[8],
            red[9],
            red[10]
          ]
          }]
        }
      });

      const charts = [chartGnrl, chartInc, chartExp];
      return charts;
    },

    addGroupUI: (group, mobileDevice, icon) => {
      const containerInc = DOMstrings.containerInc;
      const containerExp = DOMstrings.containerExp;
      let html;

      if(!document.getElementById(group.name)) {
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

    addItemUI: (item, group) => {
      const container = `.${group.name}`;
      let html;
      let sign;
      let id;

      if (group.type === 'inc') {
        sign = '+';

      } else {
        sign = '-';
      }

      id = `${group.name}-${item.id}` ;

      html = "<li class='card__list__item' id='$ID'><div class='item__main-data'><h3>$DESC</h3><h4 class='data__value'>$SIGNR$$VALUE</h4></div><div><h6>$DATE</h6><h2><a href='javascript:' class='del-btn'>-</a></h2></div></li>";

      html = html.replace('$DESC', item.desc);
      html = html.replace('$VALUE', item.value);
      html = html.replace('$SIGN', sign);
      html = html.replace('$DATE', item.date);
      html = html.replace('$ID', id);
      
      document.querySelector(container).insertAdjacentHTML('beforeend', html);
    },

    updateGroupValueUI: (group) => {
      let value = document.getElementById(group.name).getElementsByClassName('data__value')[0];
      let sign;

      if (group.type === 'inc') {
        sign = '+';
      } else {
        sign = '-';
      }

      value.innerHTML = `${sign}R$${group.total_value}`;
    },

    updateOptions: (options, type) => {
      const optionSelector = document.getElementById('group');
      const names = options[type].names;
      const values = options[type].values;

      for (let i = optionSelector.options.length-1; i >= 0; i--) {
        optionSelector.options.remove(i);
      }

      for (let i = 0; i < names.length; i++) {
        let option = document.createElement('option');  
        option.text = names[i];
        option.value = values[i];
        optionSelector.options.add(option);
      }
    },

    updateCharts: (charts, item, group, totals) => {
      let i;
      let balance;

      if (totals.exp > totals.inc) {
        balance = 100;
      } else {
        balance = totals.exp/totals.inc * 100;
        balance = balance.toFixed(2);
      }
      
      charts[0].data.datasets[0].data[1] = balance;
      charts[0].data.datasets[0].data[0] = 100 - balance;

      if (group.type === 'inc') {
        i = 1;
      } else {
        i = 2;
      }

      const index = charts[i].data.labels.findIndex((el, index) => (el === group.text));

      if (index !== -1) {
        charts[i].data.datasets[0].data[index] += item.value;
      
      } else {
        charts[i].data.labels.push(group.text);
        charts[i].data.datasets[0].data.push(item.value);
      }

      charts.forEach((el) => {
        el.update();
      });
    },

    updateBudget: (inc, exp) => {
      const budgetContainer = document.getElementById('display-budget');
      const expContainer = document.getElementById('display-exp');
      const incContainer = document.getElementById('display-inc');
      const expPercent = document.getElementById('display-percent');
      let percent;

      if (inc !== 0) {
        percent = exp/inc*100;
        percent = percent.toFixed(2);

      } else {
        percent = 0;
      }

      expContainer.innerHTML = `R$${exp.toFixed(2)}`;
      incContainer.innerHTML = `R$${inc.toFixed(2)}`;
      budgetContainer.innerHTML = `R$${(inc - exp).toFixed(2)}`;
      expPercent.innerHTML = `${percent}% do saldo gasto`;
    },

    deleteItem: (item) => {
      const DOMitem = document.getElementById(`${item.group}-${item.id}`);
      DOMitem.parentNode.removeChild(DOMitem);
    },

    deleteGroup: (item, proceede) => {
      const card = document.getElementById(item.group);
      if (proceede) card.parentNode.removeChild(card);  
    },

    displayForm: () => {
      const form = document.getElementById(DOMstrings.addForm);
      form.classList.toggle('js-hide');
    },

    hideForm: () => {
      const form = document.getElementById(DOMstrings.addForm);
      form.classList.add('js-hide');
    },

    showForm: () => {
      const form = document.getElementById(DOMstrings.addForm);
      form.classList.remove('js-hide');
    },

    showSelectedItems: (selection) => {
      const containerInc = document.getElementById(DOMstrings.containerInc);
      const containerExp = document.getElementById(DOMstrings.containerExp);

      containerInc.classList.remove('js-hide');
      containerExp.classList.remove('js-hide');

      if (selection === 'inc') {
        containerExp.classList.add('js-hide');

      } else if (selection === 'exp') {
        containerInc.classList.add('js-hide');
      }
    }

  };
}());

const mainCtrl = (function generalController(dataCtrl, UICtrl) {
  const options = dataCtrl.getOptions();
  let winWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  let mobileDevice = false;
  let charts;

  const setMobileUI = function setUIForMobileUsers() {
    if (mobileDevice === true && winWidth > 768) {
      mobileDevice = false;
      UICtrl.showForm();

    } else if (mobileDevice === false && winWidth < 768) {
      mobileDevice = true;
      UICtrl.hideForm();
    }
  };

  const createCharts = function createAndGetChartsFromTheUIController(winWidth) {
    const charts = UICtrl.displayCharts(winWidth);

    return charts;
  };


  const formatNum = function formatNumber(input) {
    let outputValue = input;

    outputValue = Math.abs(outputValue);
    outputValue = parseFloat(outputValue.toFixed(2));

    return outputValue;
  };

  const ctrlAddItem = function addGroupAndItemToTheDataStructureAndUI() {
    const input = UICtrl.getInput();
    let totals;
    let newItem;
    let newGroup;
    
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

  const restartFields = function setTheDefaultValuesToFields() {
    UICtrl.clearFields();
    UICtrl.updateBudget(0, 0);
    UICtrl.setTypeInc();
    UICtrl.updateOptions(dataCtrl.getOptions(), 'inc');
    UICtrl.showSelectedItems('all');
  };

  const getItemUI = function getSelectedItem(e) {
    let selector = e.target;
    
    if (selector.classList.contains('del-btn')) {
      selector = selector.parentNode.parentNode.parentNode;
      
      // get ID
      const id = selector.id;

      // get Group
      let group = selector.parentNode;
      group = group.className.split(' ');
      group = group[group.length - 1];

      // get Type
      let type = selector.parentNode.parentNode;
      type = type.className.split(' ');
      type = type[type.length - 1];

      const item = {
        id: id,
        group: group,
        type: type
      };

      return item;
    } 
  };

  const ctrlDelItem = function deleteItemFromDataAndUI(e) {
    
    let item = getItemUI(e);
    item = dataCtrl.getItemData(item);
    let group = dataCtrl.getGroupData(item);
    let totals = dataCtrl.updateTotals(item, group);
    let emptyGroup;

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

  const setEvtLst = function setEventListeners() {
    const DOMobj = UICtrl.getDOMstrings();
    document.getElementById(DOMobj.addBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', (event) => {
      if (event.keycode === 13 || event.which === 13) ctrlAddItem();                   
    });
    
    document.getElementById(DOMobj.selectType).addEventListener('change', () => {
      const input = UICtrl.getInput();
      UICtrl.updateOptions(options, input.type);
    });

    document.getElementById(DOMobj.filterSelect).addEventListener('change', () => {
      const input = UICtrl.getInput();
      UICtrl.showSelectedItems(input.filter);
    });

    document.getElementById(DOMobj.createBtn).addEventListener('click', () => {
      UICtrl.displayForm();
    });

    document.getElementById(DOMobj.container).addEventListener('click', ctrlDelItem);

    window.addEventListener('resize', () => {
      winWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      setMobileUI();
    });
  };

  return {
    init: () => {
      charts = createCharts(winWidth);
      restartFields();
      setEvtLst();
    }
  };
}(dataCtrl, UICtrl));

mainCtrl.init();
