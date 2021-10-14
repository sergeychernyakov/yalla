import layout from "select-kit/templates/components/selected-choice-category";
import SelectedChoiceComponent from "select-kit/components/selected-choice";
import { categoryBadgeHTML } from "discourse/helpers/category-link";
import { computed } from "@ember/object";

export default SelectedChoiceComponent.extend({
  tagName: "",
  layout,
  extraClass: "selected-choice-category",

  badge: computed("item", function () {
    return categoryBadgeHTML(this.item, {
      allowUncategorized: true,
      link: false,
    }).htmlSafe();
  }),
});
