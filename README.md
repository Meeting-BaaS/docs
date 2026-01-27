# Meeting BaaS Documentation

<p align="center"><a href="https://discord.com/invite/dsvFgDTr6c"><img height="60px" src="https://user-images.githubusercontent.com/31022056/158916278-4504b838-7ecb-4ab9-a900-7dc002aade78.png" alt="Join our Discord!"></a></p>

This is the official GitHub repository for Meeting BaaS documentation and mirror of: https://docs.meetingbaas.com

This is a Next.js application using Fumadocs for generating and maintaining Meeting BaaS service documentation.

## Contributing

Found an issue in our production documentation? Please open a Pull Request on any content file directly -- we'll take care of the rest.

You can edit any of the following files in the `/content/docs/api/reference/` directory:

- bots_with_metadata.mdx
- delete_data.mdx
- get_meeting_data.mdx
- get_screenshots.mdx
- join.mdx
- leave.mdx
- retranscribe_bot.mdx
- webhooks/ (directory)
- calendars/ (directory)

And more!
Your contributions - even small fixes for typos or unclear explanations - are greatly appreciated.

## What is Meeting BaaS?

Meeting BaaS provides one API for Google Meet, Zoom, and Microsoft Teams. Integrate all of your tools automatically with just two HTTP requests to record meetings across platforms.

## API References

The compiled API reference files in this repository are the official reference for our API endpoints.

You can find them here:

- `/openapi.json` - OpenAPI specification (automatically downloaded from api.meetingbaas.com)
- `/content/docs/api/reference/` - API reference documentation files

## Running This Repository

Want to run the documentation locally? It's easy to get started:

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Then open http://localhost:3000 in your browser to see the documentation site.

For more detailed development instructions, check the `DEVELOPPEMENT.md` file.

### Enhancing Update Files with AI

The project includes an AI-powered enhancement script that uses OpenRouter (with Anthropic's Claude models) to improve automatically generated documentation:

```bash
# Enhance the most recent update file
pnpm enhance:updates --key=your_openrouter_api_key

# Process all update files
pnpm enhance:updates --key=your_openrouter_api_key --all

# Process updates for a specific service
pnpm enhance:updates --key=your_openrouter_api_key --service=api

# Process updates for a specific date
pnpm enhance:updates --key=your_openrouter_api_key --date=2023-10-15

# and more...

## Links

- [Website](https://meetingbaas.com)
- [Documentation](https://docs.meetingbaas.com)
- [Join our Discord](https://discord.com/invite/dsvFgDTr6c)
- [v2 Dashboard](https://dashboard.meetingbaas.com)
```
