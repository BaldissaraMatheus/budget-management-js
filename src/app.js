const dataCtrl = (function dataController() {

  class Group {
    constructor(name, type, total_value, items) {
      this.name = name;
      this.type = type;
      this.total_value = total_value;
      this.items = items;
    }
  }

  class Item {
    constructor(id, group, desc, value, date) {
      this.id = id;
      this.group = group;
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

  // Add new item to database
  // Calculate budget
  return {

    // Fazer isso aqui funcionar, acho q precisa de polyfill
    addGroup: (group, type) => {
      let newGroup;
      let pos;

      if (data.groups) {
        pos = data.groups.find((el, index, array) => {
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
        console.log(`${newGroup} na posicao 0`);
        return newGroup;

      } else {
        console.log(`${newGroup} na posicao ${pos}`);
        return data.groups[pos];     
      }
    },

    addItem: (group, type, desc, val) => {
      let newItem;
      let id = 0;
      const date = new Date();

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
}());

const UICtrl = (function UIController() {

  // Get input values
  // add new item to UI
  // Update budget on UI
  
  const DOMstrings = {
    addBtn: '#add-btn',
    inputValue: '#value',
    selectGroup: '#group',
    inputDesc: '#desc',
    selectType: '#type'
  };

  return {
    getDOMstrings: () => {
      return DOMstrings;
    },

    getInput: () => {
      return {
        group: document.querySelector(DOMstrings.selectGroup).value,
        desc: document.querySelector(DOMstrings.inputDesc).value,
        type: document.querySelector(DOMstrings.selectType).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
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

  };
}());

const mainCtrl = (function generalController(dataCtrl, UICtrl) {
  let winWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  let charts;

  if (winWidth < 768) {
    let mobileDevice = true;

  } else {
    let mobileDevice = false;
  }

  const createCharts = function createAndGetChartsFromTheUIController(winWidth) {
    const charts = UICtrl.displayCharts(winWidth);
    return charts;
  };

  const foo = function() {
    const input = UICtrl.getInput();
    let newItem;
    let newGroup;
    if (!isNaN(input.value)) {
      if (input.desc === '') input.desc = 'Sem descrição';        
      newGroup = dataCtrl.addGroup(input.group, input.type);
      newItem = dataCtrl.addItem(input.group, input.type, input.desc, input.value);
      //console.log(newGroup, newItem);
    }
    //console.log('foo');
  };

  const setEvtLst = function setEventListeners() {
    const DOMobj = UICtrl.getDOMstrings();
    document.querySelector(DOMobj.addBtn).addEventListener('click', foo);
  
  };

  return {
    init: function() {
      charts = createCharts(winWidth);
      setEvtLst();
    }
  };
}(dataCtrl, UICtrl));

mainCtrl.init();
