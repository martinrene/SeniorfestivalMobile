import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "dk.fdf.seniorfestival",
  appName: "Seniorfestival",
  webDir: "dist",

  android: {
    allowMixedContent: true,
  },

  ios: {
    // ... additional configuration
    handleApplicationNotifications: false,
  },

  server: {
    androidScheme: "http",
    // WKWebView only grants getUserMedia to secure origins, so the QR scanner
    // needs https rather than the default capacitor:// scheme.
    iosScheme: "https",
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
