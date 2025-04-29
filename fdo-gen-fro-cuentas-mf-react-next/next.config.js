const path = require("path");
const NextFederationPlugin = require("@module-federation/nextjs-mf");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: ["localhost"],
  },
  publicRuntimeConfig: {},
  webpack(config, options) {
    const { isServer } = options;

    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    config.plugins.push(
      new NextFederationPlugin({
        name: "fdo-gen-fro-cuentas-mf-react-next",
        remotes: {},
        filename: "static/chunks/remoteEntry.js",
        exposes: {
          "./consultaAfiliadoMain": "./src/pages/consulta-afiliado/index.tsx",
          "./consultaAfiliado":
            "./src/pages/cuentas-consulta-afiliado/index.tsx",
          "./transferenciaRezago":
            "./src/pages/cuentas-transferencia-rezago/index.tsx",
          "./transferenciaDeposito":
            "./src/pages/transferencia-deposito/index.tsx",
          "./consultaCasos": "./src/pages/consulta-caso/index.tsx",
          "./validaciones": "./src/pages/validaciones/index.tsx",
          "./consultaRezago": "./src/pages/cuentas-consulta-rezago/index.tsx",
        },
        extraOptions: {
          exposePages: true,
          enableImageLoaderFix: true,
          enableUrlLoaderFix: true,
        },
      })
    );
    return config;
  },
};

module.exports = nextConfig;
