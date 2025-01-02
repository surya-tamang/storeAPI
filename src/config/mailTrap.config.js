import { MailtrapClient } from "mailtrap";
export const TOKEN =
  process.env.MAILTRAP_TOKEN || "807e9dd09ed29f7f8c8cf4fc3ed8fc61";

export const client = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "Trendhop",
};
