"use client";

import React from "react";
import AuthGate from "./AuthGate";
import { ConvexClientProvider } from "./ConvexClientProvider";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <ConvexClientProvider>{children}</ConvexClientProvider>
    </AuthGate>
  );
}
