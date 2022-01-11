import Controller from "@ember/controller";

export default Controller.extend({
  actions: {
    transaction() {
      const actualAmount = $("#actual-total-amount").val(),
        num = parseInt(actualAmount, 10),
        num_percent = num * 0.05,
        result = parseInt(num - num_percent, 10);

      if (num === "" || isNaN(num)) {
        if (!$(".fc-right.show-result").hasClass("hidden")) {
          $(".fc-right.show-result").addClass("hidden");
        }
      } else {
        $(".fc-right.show-result").removeClass("hidden");
        $(".fc-final-amount").html("$" + result + ".0");
      }
    },
  },
});
