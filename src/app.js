const dataCtrl = (function dataController() {

  // Card e item vão ficar no banco de dados
  // Expenses e Incomes vão ficar na estrutura de datos interna

  // O group do item vai ser o name do card que ele ficará
  class Card {
    constructor(name, type, total_value, items) {
      this.name = name;
      this.type = type;
      this.total_value = total_value;
      this.items = items;
    }
  }

  class Item {
    constructor(id, type, desc, group, value, date) {
      this.id = id;
      this.type = type;
      this.desc = desc;
      this.group = group;
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

  const group1 = {
    name: 'hehehe',
    value: 50
  };

  const group2 = {
    name: 'rsrsrs',
    value: 150
  };

  // Add new item to database
  // Calculate budget
  return {

  };
}());

const UICtrl = (function UIController() {

  // Get input values
  // add new item to UI
  // Update budget on UI

  return {
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

  if (winWidth < 768) {
    let mobileDevice = true;
  } else {
    let mobileDevice = false;
  }

  const createCharts = function createAndGetChartsFromTheUIController(winWidth) {
    const charts = UICtrl.displayCharts(winWidth);
    return charts;
  };

  let charts;

  const setEvtLst = function setEventListeners() {


  };

  console.log(charts);

  return {
    init: function() {
      console.log('Js rodandoooo');
      charts = createCharts(winWidth);
      setEvtLst();
    }
  };
}(dataCtrl, UICtrl));

mainCtrl.init();
