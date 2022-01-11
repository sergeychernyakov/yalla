import Component from "@ember/component";
import { ajax } from "discourse/lib/ajax";

export default Component.extend({
  keyUp(event) {
    validateFormFields($(event.target), "keyUp");
    return true;
  },
  change(event) {
    validateFormFields($(event.target), "change");
    return true;
  },
});

// @ return: VOID
// @ define: transaction ticket form validation handling
// @ scope: ONLY transaction.js component
function validateFormFields(object, eventType) {
  let stepNumber = whichStep();
  if (stepNumber === 1 && eventType === "change") {
    testNull(object); // step # 1 form fields validation handling
  } else if (stepNumber === 2) {
    testEmail(object, eventType); // step # 2 form fields validation handling
  } else if (stepNumber === 3) {
    testFields(object); // step # 3 form fields validation handling
  }
}

// step # 1 form fields validation handling
function testNull(object) {
  let value = object.val();

  if (value === null) {
    object.nextAll("span").css("visibility", "visible");
  } else {
    object.nextAll("span").css("visibility", "hidden");
  }
}

// step # 2 form fields validation handling
function testEmail(object, eventType) {
  let value = object.val();
  if (
    value === "" ||
    !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
  ) {
    object
      .nextAll("span")
      .css("visibility", "visible")
      .text("Enter valid email");
  } else {
    object.nextAll("span").css("visibility", "hidden");
    if (eventType === "change") {
      verifyEmail(object);
    }
  }
}

// step # 3 form fields validation handling
function testFields(object) {
  let value = object.val();

  if (value === "") {
    object.nextAll("span").css("visibility", "visible");
    $("#lastStep").css("visibility", "hidden");
  } else {
    object.nextAll("span").css("visibility", "hidden");
  }
}

// @ return: the step # of transaction ticket
// @ define: calculate the step # for multi step form
// @ scope: ONLY transaction.js component
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

// @ return: VOID
// @ define:
//   -  verifies email from the backend, if its an existed user's email or not
//   -  validates the 2nd step form field
// @ scope: ONLY transaction.js component
function verifyEmail(userObject) {
  userObject
    .next()
    .css({ visibility: "visible", color: "green" })
    .text("waiting...");

  let errors = true,
    user_id = false,
    message = "";

  ajax({
    url: "/transaction_tickets/find_user",
    type: "POST",
    data: {
      email: userObject.val(),
    },
  })
    .then((result) => {
      user_id = result.user_id;
      errors = false;
    })
    .catch((result) => {
      message = result.jqXHR.responseJSON.error[0];
    })
    .finally(() => {
      userObject
        .next()
        .css({
          visibility: "visible",
          color: errors === true ? "red" : "green",
        })
        .text(errors === true ? message : "Verified!");
      if (errors === false) {
        userObject.attr("disabled", "disabled");
        userObject.nextAll("input").val(user_id);
      }
    });
}
