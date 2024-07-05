import createClient from "openapi-fetch";
import qs from "qs";
import type { paths } from "./document";
import { config } from "dotenv";

config();

export const strapi = createClient<paths>({
  baseUrl: `${process.env.API_HOST ?? "http://127.0.0.1:1337"}/api`,
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${process.env.API_TOKEN}`,
  },
  querySerializer(params) {
    return qs.stringify(params, { encodeValuesOnly: true });
  },
});
