//creates a DOM element
var _create = function(type, id, classList){
  var element = document.createElement(type);
  if (id)
    element.id = id;
  if (classList)
    element.classList = classList;
  return element;
}

// wait for document to load
document.addEventListener('DOMContentLoaded', function(){

  // the local storage key
  var LS_KEY = 'tabStateLSKey';

  //some consts
  var SAVE_NEW_BTN_ID = '#saveNewState',
      //LOAD_SHARED_BTN_ID = '#loadShared',
      LIST_CONT_DIV_ID = '#listContainer';

  // the component responsible to save\load data from local storage
  var dataConnector = {

    data: {},

    getData: function(){
        return this.data;
    },

    load: function(){
      var uuid = localStorage.getItem(LS_KEY);
      if (uuid && JSON.parse(uuid).uuid){
        console.log('loading data from server');
        dbConnector.get(uuid, function(response){
          if (response.status == 'ok')
            this.data = response.data;
        }.bind(this))
      }
      else {
        console.log('creating new user');
        dbConnector.create(function(response){
          if (response.status == 'ok')
            localStorage.setItem(LS_KEY, JSON.stringify({ uuid: response.data.uuid }));
        })
      }
    },

    save: function(){
      //localStorage.setItem(LS_KEY, JSON.stringify(this.data));
    },

    addItemToData: function(name, tabs){
      this.data[name] = tabs;
      this.save();
    },

    deleteItem: function(name){
      if (name != undefined){
        delete this.data[name];
        this.save();
      }

    },

    init: function(){
      var tmp = this.load();
      if (tmp)
        this.data = tmp;
      else
        this.save();
      console.log(this.data);
    }
  }

  // the logic controller
  var TabState = {

    listElement: document.querySelector(LIST_CONT_DIV_ID),

    //returns an array of all the open tabs
    getCurrentTabState: function(next){
      var queryInfo = { currentWindow: true };
      chrome.tabs.query( queryInfo , function(result){
        next(result);
      }.bind(this))
    },

    // event handlers
    saveNewState: function(){
      this.getCurrentTabState(function(result){
        var tabs = [],
            name;
        result.forEach(function(tab){
          tabs.push({ title: encodeURI(tab.title), url: encodeURI(tab.url)});
        })
        while (name == undefined || name.length == 0)
          name = prompt('Enter a name for the state');
        dataConnector.addItemToData(name, tabs);
        this.render();
      }.bind(this))
    },

    loadState: function(tabs){
      var urls = [];
      tabs.forEach(function(tab, i){
        urls.push(tab.url);
      })
      chrome.windows.create({ url: urls});
    },

    loadShared: function(){
      var sharedStr = prompt('Enter Shared Text'); //TODO prompt is shit, need something else
      while (!sharedStr)
        sharedStr = prompt('Enter Shared Text');
      sharedStr = atob(sharedStr); //TODO need to add try catch, and validate the text some how
      sharedStr = decodeURI(sharedStr);
      sharedStr = JSON.parse(sharedStr);
      this.loadState(sharedStr);
    },

    bindHandlers: function(){
      document.querySelector(SAVE_NEW_BTN_ID).addEventListener('click', this.saveNewState.bind(this));
      //maybe later...
      //document.querySelector(LOAD_SHARED_BTN_ID).addEventListener('click', this.loadShared.bind(this));
    },

    //DOM functions

    render: function(){
      var scope = this,
          data = dataConnector.getData(),
          names = Object.keys(data),
          el;

      this.listElement.innerHTML = "";

      names.forEach(function(name){
          scope.createListItem(name, data[name]);
      })
    },
    createListItem: function(name, itemObj){
      var container = _create('div', '', 'list-item'),
          btnContainer = _create('span','', 'btn-container');
      this.createListItemText(name, container);
      this.createListItemLoadBtn(itemObj, btnContainer);
      this.createListItemDeleteBtn(name, btnContainer);
      //this.createListItemShareBtn(itemObj, btnContainer);
      container.appendChild(btnContainer);
      this.listElement.appendChild(container);
    },

    createListItemText: function(name,container){
      var text = _create('span', '', 'text'),
          _name = name;
      if (name.length > 15){
        _name = name.substring(0,15) + '...'; //display only a substring
        this.addTooltip(text, name); // add the full name to the tooltip
      }
      text.innerHTML = _name;
      container.appendChild(text);
    },

    createListItemLoadBtn: function(itemObj, container){
      var btn = _create('input', '', 'pure-button button-secondary');
      btn.type = 'button';
      btn.value = 'Load';
      btn.addEventListener('click', function(){
        this.loadState(itemObj);
      }.bind(this))
      container.appendChild(btn);
    },

    createListItemDeleteBtn: function(name, container){
      var btn = _create('input', '', 'pure-button button-error');
      btn.type = 'button';
      btn.value = 'Remove';
      btn.addEventListener('click', function(){
        dataConnector.deleteItem(name);
        this.render();
      }.bind(this))
      container.appendChild(btn);
    },

    createListItemShareBtn: function(itemObj, container){
      var btn = _create('input', '', 'pure-button button-success'),
          str = JSON.stringify(itemObj);
      btn.type = 'button';
      btn.value = 'Share';
      btn.addEventListener('click', function(){
        str = btoa(str); //TODO need to add try catch
        this.createTextInputWithBase64(str);
      }.bind(this))
      container.appendChild(btn);
    },

    addTooltip: function(el, text){
      el.dataset.tooltip = text;
      Tooltip.bind(el);
    },

    createTextInputWithBase64: function(str){
      var input = _create('input', '', 'base64-input');
      input.type = "text";
      input.value = str;
      input.addEventListener('click', function(){
        this.setSelectionRange(0, this.value.length);
      })
      this.listElement.appendChild(input);
    },


    // init
    init: function(){
      dataConnector.init();
      this.bindHandlers();
      this.render();
    }
  }

  TabState.init();

});
