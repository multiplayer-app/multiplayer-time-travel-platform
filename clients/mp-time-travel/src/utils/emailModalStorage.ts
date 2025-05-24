export const markEmailSubmitted = () => {
  localStorage.setItem("mtt-emailSubmitted", "true");
};

export const hasSubmittedEmail = () =>
  localStorage.getItem("mtt-emailSubmitted") === "true";
