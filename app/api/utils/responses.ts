export default function errorMessage(errorMsg: string, statusCode: number) {
  return Response.json({ error: errorMsg }, { status: statusCode });
}
