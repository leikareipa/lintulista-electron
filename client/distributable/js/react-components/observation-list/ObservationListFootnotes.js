"use strict";

import { ll_assert_native_type } from "../../assert.js";
import { tr } from "../../translator.js";
import { lla_export_observations_to_csv } from "../../action-export-obs-to-csv.js";
export function ObservationListFootnotes(props = {}) {
  ObservationListFootnotes.validate_props(props);
  const observations = ReactRedux.useSelector(state => state.observations);
  const obsCount = observations.length ? React.createElement("span", null, "Listassa ", React.createElement("strong", null, props.backend.listKey), " on ", React.createElement("strong", null, observations.length), " havaintoa.") : React.createElement("span", null, "Listassa ", React.createElement("strong", null, props.backend.listKey), " ei viel\xE4 ole havaintoja.");
  const obsDownload = observations.length ? React.createElement("span", {
    onClick: async () => await lla_export_observations_to_csv.async({
      observations
    }),
    style: {
      textDecoration: "underline",
      cursor: "pointer",
      fontVariant: "normal"
    }
  }, tr("Download them as CSV")) : React.createElement(React.Fragment, null);
  return React.createElement("div", {
    className: "ObservationListFootnotes"
  }, React.createElement("div", {
    className: "observation-count"
  }, obsCount, "\xA0", obsDownload));
}
ObservationListFootnotes.validate_props = function (props) {
  ll_assert_native_type("object", props);
  return;
};