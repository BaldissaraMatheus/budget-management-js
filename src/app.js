// Precisa importar o polyfill
// Precisa tirar os console logs
const dataCtrl = (function dataController() {

  class Group {
    constructor(name, type, total_value) {
      this.name = name;
      this.type = type;
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
      names: ['Comida', 'Saúde', 'Serviços', 'Transporte', 'Entreterimento', 'Produtos Essenciais', 'Produtos Diversos', 'Impostos', 'Empréstimos', 'Investimentos', 'Outros'],
      values: ['food', 'health', 'serv_exp', 'trasp', 'ent', 'prod_ess', 'prod_misc', 'tax', 'loan', 'inv_exp', 'others_exp']
    },
    inc: {
      names: ['Salário', 'Vendas', 'Serviços', 'Investimentos', 'Outros'],
      values: ['sal', 'sales', 'serv_inc', 'inv_inc', 'others_inc']
    }
  };

  // Add new item to database
  // Calculate budget
  return {
    getOptions: () => {
      return options;
    },

    addGroup: (groupName, type) => {
      let pos;

      if (data.groups.length != 0) {
        pos = data.groups.findIndex((obj, index) => (obj.name === groupName));
      }

      if (pos < 0 || pos === undefined) {
        const newGroup = new Group(groupName, type, 0);
        data.groups.push(newGroup);
        return newGroup;

      } else {
        return data.groups[pos];     
      }
    },

    addItem: (group, type, desc, val) => {
      let newItem;
      let id = 0;
      const date = moment().format("DD/MM/YYYY");
      
      const pos = data.groups.findIndex((obj, index) => (obj.name === group));

      if (data.groups[pos].items.length > 0){
        id = data.groups[pos].items[data.groups[pos].items.length - 1].id + 1;
      }

      newItem = new Item(id, desc, val, date);
      data.groups[pos].items.push(newItem);

      return newItem;
    },

    updateTotals: (item, type) => {
      if (type === 'inc') {
        data.totals.inc += item.value;
      } else {
        data.totals.exp += item.value;
      }
    },

    updateGroupValue: (group, item) => {
      group.total_value += item.value;
      return group.total_value;
    }

  };
}());

const UICtrl = (function UIController() {
  
  const DOMstrings = {
    addBtn: '#add-btn',
    inputValue: '#value',
    selectGroup: '#group',
    inputDesc: '#desc',
    selectType: '#type',
    container: '#cards-container'
  };

  return {
    getDOMstrings: () => {
      return DOMstrings;
    },

    getInput: () => {
      return {
        groupName: document.querySelector(DOMstrings.selectGroup).value,
        selectOptionIntex: document.querySelector(DOMstrings.selectGroup).selectedIndex,
        desc: document.querySelector(DOMstrings.inputDesc).value,
        type: document.querySelector(DOMstrings.selectType).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },
    
    clearFields: () => {
      document.querySelector(DOMstrings.inputDesc).value = '';
      document.querySelector(DOMstrings.inputValue).value = '';
      document.querySelector(DOMstrings.selectType).selectedIndex = 0;
    },

    displayCharts: (winWidth) => {
      let chartGnrlEl = document.getElementById('chart--general').getContext('2d');
      let chartExpEl = document.getElementById('chart--exp').getContext('2d');
      let chartIncEl = document.getElementById('chart--inc').getContext('2d');
      const green = '#50CC80';
      const red = '#F8545F';
  
      let legDisplay = true;
  
      if (winWidth >= 768) {
        legDisplay = false;
      }
  
      Chart.defaults.global.responsive = true;
      Chart.defaults.global.legend.display = legDisplay;

      let chartGnrl = new Chart(chartGnrlEl, {
        type: 'pie',
        data:{
          labels:['Rendas', 'Despesas'],
          datasets:[{
            data: [
              50,
              27
            ],
    
          backgroundColor:[
            green,
            red,
          ]
          }]
        }
      });
    
      let chartExp = new Chart(chartExpEl, {
        type: 'pie',
        data:{
          labels:['Entreterimento', 'Transporte', 'Comida'],
          datasets:[{
            data: [
              1,
              2,
              3
            ],
    
          backgroundColor:[
            green,
            red,
          ]
          }]
        }
      });
    
      let chartInc = new Chart(chartIncEl, {
        type: 'pie',
        data:{
          labels:['Salário'],
          datasets:[{
            data: [
              100
            ],
    
          backgroundColor:[
            green,
          ]
          }]
        }
      });

      const charts = [chartGnrl, chartExp, chartInc];
      return charts;
    },

    addGroupUI: (group, title, mobileDevice) => {
      const container = DOMstrings.container;
      let elClass;
      let html;
      if(!document.getElementById(group.name)) {
        if (mobileDevice === true) {
          html = "<div id='$ID' class='card shadow mobile-container $TYPE'><div class='card__head'><img src='https://dummyimage.com/50x50/000/fff' class='card__pic'><div class='card__data'><h2>$NAMEC<h2><h2 class='data__value'>+R$$VALUE</h2></div></div><ul class='card__list $LISTCLASS'></ul></div>";
        } else {
          if (group.type === 'inc') {       
            html = "<div id='$ID' class='card shadow inc-container $TYPE'><div class='card__head'><img src='https://dummyimage.com/50x50/000/fff' class='card__pic'><div class='card__data'><h2>$NAME<h2><h2 class='data__value'>+R$$VALUE</h2></div></div><ul class='card__list $LISTCLASS'></ul></div>";
          } else {  
            html = "<div id='$ID' class='card shadow exp-container $TYPE'><div class='card__head'><img src='https://dummyimage.com/50x50/000/fff' class='card__pic'><div class='card__data'><h2>$NAME<h2><h2 class='data__value'>-R$$VALUE</h2></div></div><ul class='card__list $LISTCLASS'></ul></div>";
          }
        }
        
        html = html.replace('$ID', group.name);
        html = html.replace('$TYPE', group.type);
        html = html.replace('$NAME', title);
        html = html.replace('$VALUE', group.total_value);

        if (html.includes('$LISTCLASS')) {
          html = html.replace('$LISTCLASS', group.name);
        }
        
        document.querySelector(container).insertAdjacentHTML('beforeend', html);
      }
    },

    addItemUI: (item, group) => {
      const container = `.${group.name}`;
      let html;
      let sign;

      if (group.type === 'inc') {
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
    }
  };
}());

const mainCtrl = (function generalController(dataCtrl, UICtrl) {
  const options = dataCtrl.getOptions();
  let winWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  let mobileDevice;
  let charts;

  if (winWidth < 768) {
    mobileDevice = true;

  } else {
    mobileDevice = false;
  }

  const createCharts = function createAndGetChartsFromTheUIController(winWidth) {
    const charts = UICtrl.displayCharts(winWidth);
    return charts;
  };

  const ctrlAddItem = function addGroupAndItemToTheDataStructureAndUI() {
    const input = UICtrl.getInput();
    let newItem;
    let newGroup;
    if (!isNaN(input.value)) {
      if (input.desc === '') input.desc = 'Sem descrição';        
      newGroup = dataCtrl.addGroup(input.groupName, input.type);
      newItem = dataCtrl.addItem(input.groupName, input.type, input.desc, input.value);
      UICtrl.addGroupUI(newGroup, options[input.type].names[input.selectOptionIntex], mobileDevice);
      UICtrl.addItemUI(newItem, newGroup);
      dataCtrl.updateGroupValue(newGroup, newItem);
      UICtrl.updateGroupValueUI(newGroup);
      dataCtrl.updateTotals(newItem, newGroup.type);
      UICtrl.updateOptions(options, newGroup.type);
    }
  };

  const restartFields = function setTheDefaultValuesToFields() {
    UICtrl.updateOptions(dataCtrl.getOptions(), 'inc');
    UICtrl.clearFields();
  };

  const setEvtLst = function setEventListeners() {
    const DOMobj = UICtrl.getDOMstrings();
    document.querySelector(DOMobj.addBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', (event) => {
      if (event.keycode === 13 || event.which === 13) ctrlAddItem();                   
    });
    document.querySelector(DOMobj.selectType).addEventListener('change', () => {
      const input = UICtrl.getInput();
      UICtrl.updateOptions(options, input.type);
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
