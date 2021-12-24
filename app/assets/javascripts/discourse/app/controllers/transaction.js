import Controller from "@ember/controller";

export default Controller.extend({
  actions: {
    transaction() {
      if ($(".row-step-2").hasClass("hidden")) {
        stepOneProcess();
      } else {
        stepTwoProcess();
      }
    },
  },
});

function stepOneProcess() {
  if (
    $("#sellers-email").next().css("visibility") === "hidden" &&
    $("#buyer-email").next().css("visibility") === "hidden"
  ) {
    $(".row-step-1").addClass("hidden");
    $(".row-step-2").removeClass("hidden");
  }
}

function stepTwoProcess() {
  if (
    $("#total-amount").next().css("visibility") === "hidden" &&
    $("#ticket-type").next().css("visibility") === "hidden" &&
    $("#payment-method").next().css("visibility") === "hidden"
  ) {
    $("#lastStep").css("visibility", "visible");
  }
}
