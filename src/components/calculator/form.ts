import * as crypto from "crypto";

export async function submitFormData(
  siteId: string,
  formData: any
): Promise<boolean> {
  const url = `https://webflow.com/api/v1/form/${siteId}`;
  const request: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/javascript, */*; q=0.01",
    },
    body: JSON.stringify(formData),
  };

  try {
    const response = await fetch(url, request);

    if (!response.ok) {
      throw new Error(`Network response "${response.status}" was not okay`);
    }
    return true;
  } catch (error) {
    console.error("Form submission failed:", error);
    return false;
  }
}

export function createSubmissionHash(data: any, timestamp: number): string {
  const dataWithTimestamp = { ...data, timestamp };
  const jsonString = JSON.stringify(dataWithTimestamp);
  return crypto.createHash("sha256").update(jsonString).digest("hex");
}
