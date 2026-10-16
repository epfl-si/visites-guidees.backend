export const siteUrls = () => ({
  fr: process.env.FRONTEND_URL_FR,
  en: process.env.FRONTEND_URL_EN,
});

export const siteUrl = (lang?: string) => {
  const urls = siteUrls();
  return urls[lang as keyof typeof urls] ?? urls.fr;
};

export const corsOrigins = () => Object.values(siteUrls()).filter(Boolean);
