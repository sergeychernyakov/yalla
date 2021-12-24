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
    //  ajax POST (1st api call)
    //    success: run the following code:
    //    wait: show the processing ... text in green
    //    failure: show in red that "user does not exist please register first"
    $(".row-step-1").addClass("hidden");
    $(".row-step-2").removeClass("hidden");
    $(".transaction-button").text("Finish Transaction");
  }
}

function stepTwoProcess() {
  if (
    $("#total-amount").next().css("visibility") === "hidden" &&
    $("#ticket-type").next().css("visibility") === "hidden" &&
    $("#payment-method").next().css("visibility") === "hidden"
  ) {
    //  ajax POST (2nd api call)
    //    success: redirect to root page with alert success message
    //    wait: show -> "processing ..." text in green
    $("#lastStep").css("visibility", "visible");
  }
}
