import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "dk.fdf.seniorfestival",
  appName: "Seniorfestival",
  webDir: "dist",

  android: {
    allowMixedContent: true,
  },
  server: {
    androidScheme: "http",
    cleartext: true,
  },

  plugins: {
    LiveUpdates: {
      appId: "ef2f7813",
      channel: "Production",
      autoUpdateMethod: "background",
      maxVersions: 2,
    },
  },
};

export default config;
