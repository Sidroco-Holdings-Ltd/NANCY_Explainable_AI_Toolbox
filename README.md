# 🌟 NANCY Dashboard for XAI 🌟

![Nancy Dashboard](https://github.com/Sidroco-Holdings-Ltd/NANCY_XAI_Dashboard/blob/main/public/images/logo/logo.png)

Welcome to the NANCY Dashboard for XAI, a multi-app project using Next.js 14 app routing and Tailwind CSS, built with PNPM. Follow the instructions below to set up and customize your dashboard!

## 🚀 Getting Started

### Prerequisites

Before you begin, you need PNPM installed on your machine. Here's how to get it:

- **Install Node.js**: PNPM requires Node.js. Download it from [nodejs.org](https://nodejs.org/).
- **Install PNPM**: Run the following command in your terminal:
  ```bash
  npm install -g pnpm
  ```

For more details, visit the [official PNPM installation guide](https://pnpm.io/installation).

### Installation

Clone the repository and install dependencies:
```bash
git clone https://github.com/Sidroco-Holdings-Ltd/NANCY_XAI_Dashboard.git
cd nancy-dashboard
pnpm install
```

### Running the Application

To start the development server, run:
```bash
pnpm dev
```
Navigate to `http://localhost:3000/dashboard` to view the dashboard.

## 📁 File Structure

To manage your images for the dashboard, follow these guidelines:

- **Create Image Folders**: Inside the `public/images` directory, create a folder for each module name.
  - Each module folder should have at least one subfolder named either `global` or `local`.
  - Place your `.png` or `.jpg` images within these subfolders.

  Example structure:
  
``` 
public/
└─ images/
   └─ module1/
      ├─ global/
      │  └─ attack_type_1.png
      └─ local/
         └─ attack_type_2.jpg 
  ```
  

  - **Image Naming**: Name the images like `feature_type_description.format`. They will appear as options in the dropdown menu in your UI.

## 🎨 Customizing Styles

To customize your color themes:

- **Tailwind Configuration**: Edit the `tailwind.config.ts` file to add new colors. Learn more about this from [Tailwind CSS configuration](https://tailwindcss.com/docs/configuration).
- **Apply Colors in Components**: Add your color as a className in your component to use it. Check out the [Tailwind CSS documentation](https://tailwindcss.com/docs) for how to apply these classes.

## 🔗 Multi-App Navigation

This project is structured as a multi-app dashboard. Each app operates under:
```
http://localhost:3000/dashboard/<folder_name>
```

## 📜 License & Usage

All rights reserved by Sidroco Holdings Ltd and MetaMinds Innovations. 

**Powered by:** TailAdmin Next.js Free is 100% free and open-source. Feel free to use it in your personal and commercial projects!
