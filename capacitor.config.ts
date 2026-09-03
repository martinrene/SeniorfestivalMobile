import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "dk.fdf.seniorfestival.g2",
  appName: "Seniorfestival",
  webDir: "dist",

  android: {
    allowMixedContent: true,
    // Matches the app background so the status bar strip blends in.
    backgroundColor: "#f2ece3",
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
};

export default config;
