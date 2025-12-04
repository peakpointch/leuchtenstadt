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

function sortKeys(obj: any): any {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sortKeys);
  }

  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      result[key] = sortKeys(obj[key]);
      return result;
    }, {} as any);
}

export async function createSubmissionHash(
  data: any,
  timestamp: number
): Promise<string> {
  const dataWithTimestamp = { ...data, timestamp };
  const sortedObj = sortKeys(dataWithTimestamp);
  const jsonString = JSON.stringify(sortedObj);

  const encoder = new TextEncoder();
  const encoded = encoder.encode(jsonString);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);

  // Convert to hex string
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
