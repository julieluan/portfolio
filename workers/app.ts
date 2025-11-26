type JsonInit = ResponseInit & { headers?: HeadersInit };

const withCors = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin ?? "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
});

const jsonResponse = <T>(data: T, init: JsonInit = {}) => {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json");
  return new Response(JSON.stringify(data), { ...init, headers });
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: withCors(origin) });
    }

    if (url.pathname === "/api/worker/message" && request.method === "GET") {
      return jsonResponse(
        {
          ok: true,
          message: env.VALUE_FROM_CLOUDFLARE ?? "Hello from Cloudflare Worker",
          timestamp: new Date().toISOString(),
        },
        { headers: withCors(origin) },
      );
    }

    if (url.pathname === "/api/worker/echo" && request.method === "POST") {
      const payload = await request.json().catch(() => ({}));
      return jsonResponse(
        { ok: true, echo: payload },
        { headers: withCors(origin) },
      );
    }

    return jsonResponse(
      { ok: false, error: "Not found" },
      { status: 404, headers: withCors(origin) },
    );
  },
} satisfies ExportedHandler<Env>;
