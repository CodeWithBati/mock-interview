# Mock Interview

Mock Interview is a web application built with Next.js to help users prepare for technical interviews. It offers a simulated interview environment with features like random question prompts, timers, and a responsive interface to enhance interview readiness. Leveraging Next.js for server-side rendering and static site generation, the app provides a fast and seamless user experience.

## Features

- Simulated interview environment with random question prompts, timers, and a responsive interface.
- Next.js for server-side rendering and static site generation for optimal performance.
- Responsive design for a consistent user experience across devices.
- Integration with Firebase for user authentication and data storage.
- Tailwind CSS for styling and responsive layout.

## Tech Stack

- Next.js
- Firebase
- Tailwind CSS
- TypeScript
- Vercel

## Prerequisites

Before running the project, ensure you have the following installed:

- Node.js (v16 or higher)
- npm, yarn, or pnpm for package management
- A modern web browser (e.g., Chrome, Firefox)

## Installation

Clone the repository and navigate to the project directory:

```bash
git clone https://github.com/CodeWithBati/mock-interview.git
cd mock-interview
```

## Project Structure

The project is structured as follows:

```bash
mock-interview/
├── app/                  # Next.js App Router (pages, layouts, and routes)
│   ├── layout.jsx        # Root layout for the app
│   ├── page.jsx          # Main page component
│   └── components/       # Reusable React components
├── public/               # Static assets (images, fonts, etc.)
├── styles/               # Global styles or Tailwind CSS setup
├── package.json          # Project dependencies and scripts
├── next.config.js        # Next.js configuration
└── tailwind.config.js    # Tailwind CSS configuration
```

## Running the Project

To run the project locally, follow these steps:

1. Install dependencies: `npm install` or `yarn install` or `pnpm install`
2. Start the development server: `npm run dev` or `yarn dev` or `pnpm dev`
3. Open your browser and navigate to `http://localhost:3000`

## Deployment

To deploy the project to Vercel, follow these steps:

1. Install Vercel CLI: `npm install -g vercel`
2. Login to Vercel: `vercel login`
3. Initialize Vercel project: `vercel init`
4. Deploy the project: `vercel deploy`

## Contributing

Contributions are welcome! Please fork the repository and create a pull request.

## License

MIT License

## Author

[CodeWithBati](https://github.com/CodeWithBati)

## Acknowledgments

Special thanks to [Vercel](https://vercel.com) for providing hosting and deployment services.
