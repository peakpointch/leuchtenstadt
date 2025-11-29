import { WFRoute } from "@xatom/core";
import peakflow from "peakflow";
// import {  } from "../modules";

export const app = () => {
  new WFRoute("/").execute(() => {});
  peakflow.execute("vimePlayer");
};
