export function formatString(text:string) {
    return text.replace("kr", "").replace("\u00A0", "").trim();
  }