export default function robots() {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/'],
      },
      sitemap: 'https://themaker.in/sitemap.xml',
    }
  }