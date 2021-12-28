import Component from "@ember/component";
import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";

export default Component.extend({
  keyUp(event) {
    switch (whichStep()) {
      case 2:
        // step 2 form validation handling
        testEmail($(event.target), $(event.target).val());
        break;
      case 3:
        // step 3 form validation handling
        testFields($(event.target), $(event.target).val());
        break;
    }
    return true;
  },
  change(event) {
    switch (whichStep()) {
      case 1:
        // step 1 form validation handling
        testNull($(event.target), $(event.target).val());
        break;
      case 2:
        // step 2 form validation handling
        testEmail($(event.target), $(event.target).val());
        testEmailAjax($(event.target), $(event.target).val());
        break;
      case 3:
        // step 3 form validation handling
        testFields($(event.target), $(event.target).val());
        break;
    }
    return true;
  },
});

function testEmail(object, value) {
  if (
    value === "" ||
    !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
  ) {
    object.next().css("visibility", "visible");
  } else {
    object.next().css("visibility", "hidden");
  }
}

function testEmailAjax(object, value) {
  if (
    value !== "" &&
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)
  ) {
    getUserId(object);
  }
}

function testFields(object, value) {
  if (value === "") {
    object.next().css("visibility", "visible");
    $("#lastStep").css("visibility", "hidden");
  } else {
    object.next().css("visibility", "hidden");
  }
}

function testNull(object, value) {
  if (value === null) {
    object.nextAll("span").css("visibility", "visible");
  } else {
    object.nextAll("span").css("visibility", "hidden");
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

function getUserId(userObject) {
  userObject
    .next()
    .css({ visibility: "visible", color: "green" })
    .text("waiting...");

  let errors = true,
    user_id = false;

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
    .catch(popupAjaxError)
    .finally(() => {
      userObject
        .next()
        .css({
          visibility: "visible",
          color: errors === true ? "red" : "green",
        })
        .text(errors === true ? "Enter valid email" : "Verified!");
      if (errors === false) {
        userObject.attr("disabled", "disabled");
        userObject.nextAll("input").val(user_id);
      }
    });
}
