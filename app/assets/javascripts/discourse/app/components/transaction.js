import Component from "@ember/component";

export default Component.extend({
  keyUp(event) {
    if ($(".row-step-2").hasClass("hidden")) {
      testEmail($(event.target), $(event.target).val());
    } else {
      testFields($(event.target), $(event.target).val());
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

function testFields(object, value) {
  if (value === "") {
    object.next().css("visibility", "visible");
    $("#lastStep").css("visibility", "hidden");
  } else {
    object.next().css("visibility", "hidden");
  }
}
