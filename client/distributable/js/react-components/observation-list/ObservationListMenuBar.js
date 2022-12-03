"use strict";

import { ll_assert_native_type } from "../../assert.js";
import { BirdSearch } from "../bird-search/BirdSearch.js";
import { MenuButton } from "../buttons/MenuButton.js";
import { CheckBoxButton } from "../buttons/CheckBoxButton.js";
import { ObservationList_MenuBar_LoginButton } from "../buttons/ObservationList_MenuBar_LoginButton.js";
import { tr } from "../../translator.js";
import { ll_hash_navigate } from "../../hash-router.js";
export function ObservationListMenuBar(props = {}) {
  ObservationListMenuBar.validate_props(props);
  const is100LajiaMode = ReactRedux.useSelector(state => state.is100LajiaMode);
  const setIs100LajiaMode = ReactRedux.useDispatch();
  const [isBarSticky, setIsBarSticky] = React.useState(false);
  React.useEffect(() => {
    update_sticky_scroll();
    window.addEventListener("scroll", update_sticky_scroll);
    return () => {
      window.removeEventListener("scroll", update_sticky_scroll);
    };
    function update_sticky_scroll() {
      const stickThresholdY = 220;
      if (!isBarSticky && window.scrollY > stickThresholdY) {
        setIsBarSticky(true);
      } else if (isBarSticky && window.scrollY <= stickThresholdY) {
        setIsBarSticky(false);
      }
    }
  });
  return React.createElement("div", {
    className: `ObservationListMenuBar ${isBarSticky ? "sticky" : "non-sticky"}`
  }, React.createElement(BirdSearch, {
    backend: props.backend
  }), React.createElement("div", {
    className: "buttons"
  }, React.createElement(CheckBoxButton, {
    iconChecked: "fas fa-check-square fa-fw fa-lg",
    iconUnchecked: "fas fa-square fa-fw fa-lg",
    tooltip: tr("100 Species Challenge"),
    showTooltip: !isBarSticky,
    title: tr("See your standing in the 100 Species Challenge"),
    isChecked: is100LajiaMode,
    callbackOnButtonClick: isChecked => setIs100LajiaMode({
      type: "set-100-lajia-mode",
      isEnabled: isChecked
    })
  })));
}
ObservationListMenuBar.validate_props = function (props) {
  ll_assert_native_type("object", props, props.backend);
  return;
};