import Component from "@ember/component";

export default Component.extend({
  keyUp(e) {
    if ($(".row-step-2").hasClass("hidden")) {
      testEmail($(e.target), $(e.target).val());
    } else {
      testFields($(e.target), $(e.target).val());
    }
    return true;
  },
});

function testEmail(obj, val) {
  if (
    val === "" ||
    !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)
  ) {
    obj.next().css("visibility", "visible");
  } else {
    obj.next().css("visibility", "hidden");
  }
}

function testFields(obj, val) {
  if (val === "") {
    obj.next().css("visibility", "visible");
    $("#lastStep").css("visibility", "hidden");
  } else {
    obj.next().css("visibility", "hidden");
  }
}
