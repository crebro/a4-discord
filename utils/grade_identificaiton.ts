export default function gradeIdentify(email: string): number | undefined {
  if (email.startsWith("023")) {
    return 12;
  } else if (email.startsWith("024")) {
    return 11;
  }

  return undefined;
}
