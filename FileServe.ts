import { serve } from "http/mod.ts";
import { typeByExtension } from "media_types/mod.ts";

const BASE_PATH = "./Scripts";

const requestHandler = async (request: Request) => {
  const filePath = BASE_PATH + new URL(request.url).pathname;
  let fileSize;
  try {
    fileSize = (await Deno.stat(filePath)).size;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return new Response(null, { status: 404 });
    } else {
      return new Response(null, { status: 500 });
    }
  }
  const body = (await Deno.open(filePath)).readable;
  return new Response(body, {
    headers: {
      "content-length": fileSize.toString(),
      "content-type": typeByExtension(filePath) || "application/octet-stream",
    },
  });
};

serve(requestHandler, { port: 8080 });
