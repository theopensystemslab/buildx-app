# BuildX front-end

Front-end for BuildX, built with Next.js and [@opensystemslab/buildx-core](https://github.com/theopensystemslab/buildx-core)

## Getting Started

### Development

Install dependencies:

```bash
pnpm install
```

Configure Mapbox:

Create a `.env.local` file in the root directory with your Mapbox access token:

```bash
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_access_token_here
```

You can obtain an access token from your [Mapbox access token settings](https://account.mapbox.com/access-tokens/).

Start the development server:

```bash
pnpm dev
```

Navigate to `localhost:3000`
