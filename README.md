# Task & Bookmark Manager Chrome Extension

A Chrome extension that helps manage tasks and save associated URLs as bookmarks when tasks are completed.

## Features

- Create and manage tasks with title, description, deadline, and status
- Associate relevant URLs with each task
- Automatic page title extraction for URLs (when no title is provided)
- Track task status (Not Started, In Progress, Completed)
- Automatic bookmark creation when tasks are completed
- Modern UI built with Material UI components
- Local data storage for enhanced privacy and security

## Why Use This Extension?

- **Productivity**: Organize your web browsing around specific tasks and goals
- **Focus**: Reduce aimless browsing by associating URLs with specific purposes
- **Efficiency**: Auto-fetches webpage titles when adding URLs to tasks
- **Organization**: Automatically organize your bookmarks based on completed tasks
- **Privacy**: All data is stored locally, ensuring your information stays on your device

## Installation

1. Clone this repository or download the source code
2. Install dependencies with `npm install`
3. Build the extension with `npm run build`
4. Open Chrome and navigate to `chrome://extensions/`
5. Enable "Developer mode" in the top right corner
6. Click "Load unpacked" and select the `dist` directory
7. The extension is now installed and ready to use

## Development

- `npm install` - Install dependencies
- `npm run build` - Build for production
- `npm run dev` - Build with watch mode for development

## Using the Extension

- Click the extension icon in the Chrome toolbar to open the task manager
- Add a new task with a title, description, deadline, and status
- Associate relevant URLs with the task (titles are automatically fetched if not provided)
- Quickly change task status by clicking on the status badge in the task list
- Access Google search via the home icon in the top-left corner
- Edit tasks by clicking on them in the task list
- Mark tasks as completed to automatically save associated URLs as bookmarks
- Bookmarks are saved in a folder named after the task and creation date

## Technologies Used

- React.js
- Material UI
- Chrome Extension API
- Webpack

## License

MIT
