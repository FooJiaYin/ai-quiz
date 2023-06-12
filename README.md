AI Quiz Generation
==================

Demonstration of quiz generation using OpenAI's GPT-3.5 API.

Demo link: https://deephow-ai-quiz.onrender.com/

Features
--------

- Input text for generation
- Select language (default to English)
- Generate main points from text
- Generate multiple choice questions

### Limitations

- The text input is limited to 1500 characters to avoid exceeding the token limit of the OpenAI API. Longer text will be truncated.

### Future Work

- Quiz generation improvements
    - Accept longer text input
    - Auto detect language from text

- Quiz types
    - Generate true/false questions
    - Generate fill-in-the-blank questions
    - Extract keywords and its definition

- UI/UX enhancements
    - Hide main points and questions link when re-generating

Development
-----------

Built with:
- Full Stack: [Nuxt 3](https://nuxt.com/)
- Frontend: [Vue 3](https://vuejs.org/)
- UI Component: [Vuetify](https://vuetifyjs.com/)
- State Management: [Pinia](https://pinia.vuejs.org/)

### Prerequisites
1. [Node.js](https://nodejs.org/en/) >= 16.10.0
2. [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Setup
1. `git clone` this repository
2. Install the dependencies:

    ```bash
    # yarn
    yarn install

    # npm
    npm install

    # pnpm
    pnpm install
    ```
3. Create a `.env` file in the root directory and add the following environment variables:

    ```bash
    OPENAI_API_KEY=<your-openai-api-key>
    OPENAI_ORG_ID=<your-openai-org-id>
    ```

### Development Server

Start the development server on `http://localhost:3000`

```bash
npm run dev #or
yarn run dev
```

### Production

Build the application for production:

```bash
npm run build #or
yarn run build
```

Locally preview production build:

```bash
npm run preview
```

### Deployment

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

Note: Please make sure your deployment platform has sufficient timeout limit for the quiz generation API call. 

For example, free plan of [Vercel](https://vercel.com/) and [Netlify](https://www.netlify.com/) are **not recommended** for this project as they have a 10s timeout limit for serverless functions. The quiz generation process may take longer than 10s. 