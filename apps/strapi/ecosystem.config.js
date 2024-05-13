module.exports = {
  apps: [
    {
      name: "strapi",
      script: "yarn start",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
