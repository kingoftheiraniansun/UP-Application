import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.upstudio.app",
  appName: "UP Studio",
  webDir: "dist",
  server: {
    // Serve the bundled web app from https://localhost so secure-context APIs (clipboard, share, SW) work.
    androidScheme: "https",
  },
  android: {
    backgroundColor: "#F7F6F3",
    allowMixedContent: false,
    webContentsDebuggingEnabled: false,
  },
};

export default config;
