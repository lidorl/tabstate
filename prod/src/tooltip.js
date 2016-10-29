// super simple tooltip
//   the element needs to have a data-tooltip attr containing the tooltip text
var Tooltip = {

  // show tooltip when mouse in on
  addShowListener: function(el){
    var text, tooltip, x, y;
    el.addEventListener('mouseover', function(e){
      console.log('mouse on');
      text = e.target.dataset.tooltip;
      tooltip = _create('div', '', 'tooltip');
      tooltip.innerHTML = text;
      x = e.target.offsetLeft + e.target.offsetWidth*0.5;
      y = e.target.offsetTop + e.target.offsetHeight;
      tooltip.style.left = x + 'px';
      tooltip.style.top = y + 'px';
      document.body.appendChild(tooltip);
    })
  },

  // hide the tooltip when mouse is off
  addHideListener: function(el){
    var tooltips;
    el.addEventListener('mouseout', function(){
      console.log('mouse off');
      tooltips = [].slice.call(document.querySelectorAll('.tooltip')); //convert nodes list to array
      tooltips.forEach(function(element){ // usually, only one should exist at anytime... but just in case
        element.remove(); //remove from the DOM
      })
    })
  },

  bind: function(el){
    this.addShowListener(el);
    this.addHideListener(el);
  },

}
