/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/jars',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
