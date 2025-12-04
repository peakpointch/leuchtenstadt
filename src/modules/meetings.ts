import { CalClient } from "peakflow";

const namespaces = ["welcomeMeeting", "welcomeMeetingTwo"];

export default async function initMeetings(): Promise<void> {
  window.addEventListener("load", async () => {
    const client = await CalClient.create();

    client.namespaceAll(namespaces, {
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

    for (let namespace of namespaces) {
      client.cal.ns[namespace]("on", {
        action: "bookingSuccessfulV2",
        callback: (event) => {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: "welcome_meeting_cal_bookingSuccessfulV2",
            cal_uid: event.detail.data.uid,
            cal_video_call_url: event.detail.data.videoCallUrl,
            cal_namespace: event.detail.namespace,
          });
        },
      });
    }
  });
}
