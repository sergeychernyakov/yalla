import Component from "@ember/component";

export default Component.extend({
  keyPress() {
    let num = parseInt($("#actual-total-amount").val(), 10);

    if (num === "" || isNaN(num)) {
      $(".hiddenErrorMessage").show();
    } else {
      $(".hiddenErrorMessage").hide();
    }
    return true;
  },
});
