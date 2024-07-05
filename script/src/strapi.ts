import createClient from "openapi-fetch";
import qs from "qs";
import type { paths } from "./document";
import "dotenv/config";

const token =
  "4753681914f768519b75a94c7b27fd44304eee42d173c86f84a95c38b782f89d0ecb3111d08bfa0e65bf3ec808bd5037e4756e7d271bb5feb96a0bc4d88bcf7bb052ce5a410917421680259271d7f34699ac9e3b2df69ca5af3b7f6f1240fa4219b6ec8acc7e7962655d6098caf77d8d96937709558169bd813b0b78a62ac4c9";

export const strapi = createClient<paths>({
  baseUrl: `${process.env.API_HOST ?? "http://127.0.0.1:1337"}/api`,
  headers: {
    Accept: "application/json",
    token: `Bearer ${token}`,
  },
  querySerializer(params) {
    return qs.stringify(params, { encodeValuesOnly: true });
  },
});
