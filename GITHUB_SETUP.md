# GitHub Repository Setup Instructions

Follow these steps to create a GitHub repository for this project:

## 1. Create a new repository on GitHub

1. Go to https://github.com/new
2. Enter a repository name (e.g., `task-bookmark-manager`)
3. Add a description (optional): "A Chrome extension that helps manage tasks and save associated URLs as bookmarks"
4. Choose whether the repository should be public or private
5. Do NOT initialize the repository with a README, .gitignore, or license (since we already have these files)
6. Click "Create repository"

## 2. Connect your local repository to GitHub

After creating the repository, GitHub will display commands to push an existing repository. Run the following commands in your terminal from the task-bkm-mgr directory:

```bash
# Make sure you're in the task-bkm-mgr directory
cd task-bkm-mgr

# Add the remote repository URL
git remote add origin https://github.com/YOUR_USERNAME/task-bookmark-manager.git

# Push your local repository to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username and `task-bookmark-manager` with the actual repository name you created.

## 3. Verify the repository

After pushing, refresh your GitHub repository page to verify that all files were uploaded successfully.

## 4. Future updates

For future changes, use the standard Git workflow:

```bash
# Make your changes
# ...

# Add the changes
git add .

# Commit the changes
git commit -m "Description of changes"

# Push the changes to GitHub
git push
