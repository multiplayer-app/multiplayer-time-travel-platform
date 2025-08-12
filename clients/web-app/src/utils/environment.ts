// Environment detection utilities

export const getPlatformEnv = (): string => {
  return (
    process.env.REACT_APP_PLATFORM_ENV || process.env.NODE_ENV || "development"
  );
};
