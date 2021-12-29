import Controller from "@ember/controller";

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.set("user_step", 1);
  },
  actions: {
    transaction() {
      this.set("user_step", whichStep());
      switch (this.user_step) {
        case 1:
          stepOneProcess();
          break;
        case 2:
          stepTwoProcess();
          break;
        case 3:
          stepThreeProcess();
          break;
      }
    },
  },
});

function stepOneProcess() {
  let sellerOrBuyer = $("#userSellerOrBuyer");

  if (sellerOrBuyer.val() !== null) {
    $(".row-step-1").addClass("hidden");
    $(".row-step-2").removeClass("hidden");
    $(".transaction-button").text("Continue");

    setSellerOrBuyerField(sellerOrBuyer);
  } else {
    sellerOrBuyer.nextAll("span").css("visibility", "visible");
  }
}

function stepTwoProcess() {
  if (
    $("#sellers-email").nextAll("input").val() !== "" &&
    $("#buyer-email").nextAll("input").val() !== ""
  ) {
    $(".row-step-2").addClass("hidden");
    $(".row-step-3").removeClass("hidden");
    $(".transaction-button").text("Finish Transaction");
  }
}

function stepThreeProcess() {
  if (
    $("#total-amount").val() !== "" &&
    $("#ticket-type").val() !== null &&
    $("#payment-method").val() !== null
  ) {
    //  ajax POST (2nd api call)
    //    success: redirect to root page with alert success message
    //    wait: show -> "processing ..." text in green
    $("#lastStep").css("visibility", "visible").text("You're all done!");
  } else {
    if ($("#ticket-type").val() === null) {
      $("#ticket-type").nextAll("span").css("visibility", "visible");
    }
    if ($("#payment-method").val() === null) {
      $("#payment-method").nextAll("span").css("visibility", "visible");
    }
    $("#lastStep").text("");
  }
}

function whichStep() {
  if (
    !$(".row-step-1").hasClass("hidden") &&
    $(".row-step-1").val() !== undefined
  ) {
    return 1;
  } else if (!$(".row-step-2").hasClass("hidden")) {
    return 2;
  } else if (!$(".row-step-3").hasClass("hidden")) {
    return 3;
  }
}

function setSellerOrBuyerField(sellerOrBuyer) {
  let user_email = $("#initiatorEmail").val(),
    user_id = $("#initiatorId").val(),
    sellerField = $("#sellers-email"),
    buyerField = $("#buyer-email");

  if (sellerOrBuyer.val() === "seller") {
    sellerField
      .val(user_email)
      .attr("disabled", "disabled")
      .nextAll("input")
      .val(user_id);
    sellerField.nextAll("span").css("color", "green").text("Verified!");
  } else {
    buyerField
      .val(user_email)
      .attr("disabled", "disabled")
      .nextAll("input")
      .val(user_id);
    buyerField.nextAll("span").css("color", "green").text("Verified!");
  }
}
