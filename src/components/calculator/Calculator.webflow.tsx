import { Calculator } from "./index";
import { props } from "@webflow/data-types";
import { declareComponent } from "@webflow/react";

import "../main.css";

export default declareComponent(Calculator, {
  name: "Calculator",
  description:
    "The official Leuchtenstadt pricing calculator for lead generation.",
  props: {
    visibility: props.Visibility({
      name: "Visibility",
      group: "Visibility",
      tooltip: "Control the visibility of the entire component.",
      defaultValue: true,
    }),
  },
  options: {
    ssr: false,
  },
});
