import { WFRoute } from "@xatom/core";
import peakflow from "peakflow";
import initMeetings from "../modules/meetings";
// import {  } from "../modules";

export const app = () => {
  peakflow.execute("vimePlayer");

  new WFRoute("/").execute(() => {
    initMeetings();
  });
};
