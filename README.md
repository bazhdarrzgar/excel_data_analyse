# 📊 Excel Data Analysis & Comparison Tool

A powerful, cross-platform web application built with Next.js for extracting, analyzing, and comparing Excel data with high precision and performance.

## 🚀 Quick Start

This project includes automated scripts to handle installation and execution on both Windows and Linux environments.

### 📋 Prerequisites

- **Node.js**: Version 18.x or higher (LTS recommended)
- **Package Manager**: npm (bundled with Node.js) or Yarn

---

## 💻 Installation

Choose the script corresponding to your operating system to automatically install all dependencies (including Node.js if missing).

### **Windows**
1. Open the **`Run`** folder.
2. **Double-click** `install_requirements.bat` to run it.
3. The script will check for Node.js, install it if necessary, and run `npm install`.

### **Linux**
1. Open your terminal in the project directory.
2. Make the script executable:
   ```bash
   chmod +x Run/install_requirements.sh
   ```
3. Run the script:
   ```bash
   ./Run/install_requirements.sh
   ```

---

## 🛠️ Running the Application

There are two ways to run the application. We recommend using the **Launcher** for a better user experience.

### **Option 1: Using the Launcher (Recommended)**
The launcher provides a visual Dashboard to start/stop the server and monitor logs.

- **Windows**: Double-click **`Run/launcher.bat`**
- **Linux**: Run **`./Run/launcher.sh`**

Once started, the **Control Panel** will open automatically at:  
👉 **[http://localhost:4999](http://localhost:4999)**

### **Option 2: Direct Command Line**
If you prefer the standard development mode:

```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```
The application will be available at **http://localhost:3000** (or the next available port).

---

## 📁 Project Structure

- `app/`: Next.js app router components and pages.
- `scripts/`: System scripts including the custom launcher logic.
- `Run/`: **User-facing scripts for installation and launching.**
- `components/`: Reusable UI components.
- `public/`: Static assets and images.

## 🔄 Git Synchronization
For developers, use the provided script to quickly push changes to GitHub:
```bash
./upload_github.sh
```

---

## ✨ Key Features
- **Smart Port Selection**: Automatically finds an available port if 3000 is busy.
- **Visual Dashboard**: Manage your app lifecycle without touching the terminal.
- **Cross-Platform Support**: Seamless experience across Windows and Linux.
- **Excel Formatting Preservation**: Exports maintain original document styling.
