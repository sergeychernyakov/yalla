import Controller from "@ember/controller";
import { ajax } from "discourse/lib/ajax";

const sellerOrBuyerField = "#userSellerOrBuyer",
  missingStepOneField = "Select 1 Option";

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
          stepThreeProcess(this);
          break;
      }
    },
  },
});

function stepOneProcess() {
  let sellerOrBuyer = $(sellerOrBuyerField);

  if (sellerOrBuyer.val() !== null) {
    $(".row-step-1").addClass("hidden");
    $(".row-step-2").removeClass("hidden");
    $(".transaction-button").text("Continue");

    setSellerOrBuyerField(sellerOrBuyer);
  } else {
    sellerOrBuyer.nextAll("span").text(missingStepOneField);
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

function stepThreeProcess($thisObject) {
  if (
    $("#amount").val() !== "" &&
    $("#ticket_type").val() !== null &&
    $("#payment_method").val() !== null
  ) {
    // ajax post to create transaction ticket
    let message = null,
      errorExists = {},
      success = false;
    ajax({
      url: "/transaction_tickets",
      type: "POST",
      data: {
        transaction_ticket: {
          buyer_id: $("#buyer_id").val(),
          seller_id: $("#seller_id").val(),
          creator_id:
            $("#creator_id").val() === undefined
              ? $("#buyer_id").val()
              : $("#creator_id").val(),
          ticket_type: $("#ticket_type").val(),
          payment_method: $("#payment_method").val(),
          amount: $("#amount").val(),
        },
      },
    })
      .then((result) => {
        message = result.message;
        errorExists = { color: "green" };
        success = true;
      })
      .catch((result) => {
        if (result.jqXHR.responseJSON.error === undefined) {
          message = result.jqXHR.responseJSON.errors.join(" ");
        } else {
          message = result.jqXHR.responseJSON.error.join(" ");
        }
        errorExists = { color: "red" };
      })
      .finally(() => {
        $("#lastStep").css(errorExists).text(message);
        if (success) {
          $thisObject.transitionToRoute("discovery.latest");
        }
      });
  } else {
    if ($("#ticket_type").val() === null) {
      $("#ticket_type").nextAll("span").css("visibility", "visible");
    }
    if ($("#payment_method").val() === null) {
      $("#payment_method").nextAll("span").css("visibility", "visible");
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
    user_id = $("#creator_id").val(),
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
