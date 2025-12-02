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
  });
}
