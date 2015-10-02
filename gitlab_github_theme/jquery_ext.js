/* globals unsafeWindow */

let $ = unsafeWindow.$;

(function(old){
  $.fn.attr = function(){
    if(arguments.length === 0){
      if(this.length === 0)
        return null;
      let obj ={};
      $.each(this[0].attributes, function(){
        if(this.specified){
          obj[this.name] = this.value;
        }
      });
      return obj;
    }
    return old.apply(this, arguments);
  };
})($.fn.attr);
