import { getPlatformEnv } from "./environment";

export const markSandboxClosed = () => {
  localStorage.setItem("mtt-sandbox-closed", "true");
};

export const isSandboxClosed = () =>
  localStorage.getItem("mtt-sandbox-closed") === "true";

export const getSandboxLink = (): string => {
  const env = getPlatformEnv().toLowerCase();

  const domainMap: Record<string, string> = {
    staging: "https://sandbox.staging-multiplayer.com/",
    production: "https://sandbox.multiplayer.app/",
    development: "https://sandbox.staging-multiplayer.com/",
  };

  return domainMap[env] || domainMap.production;
};
