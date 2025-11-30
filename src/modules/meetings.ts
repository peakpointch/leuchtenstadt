import { initCal } from "peakflow";

export default async function initMeetings(): Promise<void> {
  const namespace = "welcomeMeeting";
  const element = document.querySelector<HTMLElement>(
    `[cal-id="${namespace}"]`
  );

  const Cal = await initCal({
    namespace: namespace,
    element: element,
    theme: "light",
    colors: {
      light: {
        "cal-brand": "#aa9774",
        "cal-bg-emphasis": "#f8f2eb",
        "cal-bg-subtle": "#fbf8f5",
        "cal-bg-muted": "#fbf8f5",
      },
    },
  });

  Cal.ns[namespace]("on", {
    action: "__iframeReady",
    callback: () => {
      // console.log("Cal iframe ready!");
    },
  });

  Cal.ns[namespace]("on", {
    action: "bookingSuccessfulV2",
    callback: () => {
      // console.log("Cal booking successful!");
    },
  });
}
