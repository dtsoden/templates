import { Output, randomPassword, Services } from "~templates-utils";
import { Input } from "./meta";

export function generate(input: Input): Output {
  const services: Services = [];
  const databasePassword = randomPassword();
  const databaseName = "osticket";
  const databaseUser = "osticket";

  services.push({
    type: "app",
    data: {
      serviceName: input.appServiceName,
      env: [
        `DB_HOST=$(PROJECT_NAME)_${input.databaseServiceName}`,
        `DB_NAME=${databaseName}`,
        `DB_USER=${databaseUser}`,
        `DB_PASS=${databasePassword}`,

        `INSTALL_NAME=${input.helpdeskName}`,
        `INSTALL_EMAIL=${input.helpdeskEmail}`,
        `INSTALL_URL=https://$(PRIMARY_DOMAIN)`,
        `INSTALL_SECRET=${randomPassword()}`,

        `ADMIN_FIRSTNAME=${input.adminFirstName}`,
        `ADMIN_LASTNAME=${input.adminLastName}`,
        `ADMIN_EMAIL=${input.adminEmail}`,
        `ADMIN_USER=${input.adminUsername}`,
        `ADMIN_PASS=${input.adminPassword || randomPassword()}`,

        `TIMEZONE=${input.timezone}`,
        `CRON_INTERVAL=5`,
        `TRUSTED_PROXIES=10.0.0.0/8,172.16.0.0/12,192.168.0.0/16`,

        `SMTP_HOST=${input.smtpServerHost || ""}`,
        `SMTP_PORT=${input.smtpServerPort}`,
        `SMTP_SECURITY=${input.smtpSecurity}`,
        `SMTP_USER=${input.smtpServerUsername || ""}`,
        `SMTP_PASS=${input.smtpServerPassword || ""}`,
        `SMTP_FROM=${input.smtpFromEmail || ""}`,
      ].join("\n"),
      source: {
        type: "image",
        image: input.appServiceImage,
      },
      domains: [
        {
          host: "$(EASYPANEL_DOMAIN)",
          port: 80,
        },
      ],
      mounts: [
        {
          type: "volume",
          name: "data",
          mountPath: "/data",
        },
      ],
    },
  });

  services.push({
    type: "mariadb",
    data: {
      serviceName: input.databaseServiceName,
      databaseName,
      user: databaseUser,
      password: databasePassword,
      rootPassword: randomPassword(),
    },
  });

  return { services };
}
