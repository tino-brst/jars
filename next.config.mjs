/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/accounts',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
