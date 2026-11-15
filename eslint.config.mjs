import next from "eslint-config-next";

const config = [...next, { ignores: [".next/**", "google-apps-script/**"] }];

export default config;
