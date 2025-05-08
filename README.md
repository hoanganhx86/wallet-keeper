# Wallet Keeper

This project is a **single-page application** (SPA) built with modern web technologies, designed to manage cryptocurrency wallets efficiently. It leverages a robust architecture and cutting-edge tools to ensure scalability, maintainability, and performance.

---

## 🚀 Key Features

- **Wallet Management**: Create, view, and manage cryptocurrency wallets.
- **Blockchain Interaction**: Seamless integration with Ethereum and other EVM-compatible networks.
- **Modern UI/UX**: Built with Tailwind CSS for a responsive and visually appealing interface.
- **State Management**: Redux Toolkit for predictable and scalable state management.
- **Type Safety**: Fully typed with TypeScript for enhanced developer productivity and fewer runtime errors.

---

## 🏗️ Architecture and Design Decisions

### **Tech Stack**
- **React**: A declarative, component-based library for building user interfaces.
- **TypeScript**: Ensures type safety and reduces runtime errors.
- **Vite**: A fast build tool for modern web applications, chosen for its blazing-fast HMR and optimized builds.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Redux Toolkit**: Simplifies state management with less boilerplate and better scalability.
- **Ether.js**: A lightweight library for interacting with Ethereum and other blockchain networks.
- **React Testing Library**: Ensures robust and maintainable unit tests.
- **GitHub Actions**: Automates CI/CD pipelines for testing and deployment.

### **Why These Choices?**
1. **Performance**: Vite ensures fast builds and HMR, making development seamless.
2. **Scalability**: Redux Toolkit and TypeScript provide a solid foundation for scaling the app.
3. **Developer Experience**: Tailwind CSS and React Testing Library improve productivity and maintainability.
4. **Blockchain Integration**: Ether.js is lightweight and developer-friendly, making it ideal for wallet operations.

---

## 🛠️ **Project Structure**

The project follows a modular and scalable architecture:



🚧 **Out of Scope Features**
While the current implementation focuses on core functionality, the following features are planned for future iterations:

- **Password Lock Screen**: Enhance security by adding a password-protected lock screen.
- **Additional EVM Networks**: Support for Polygon, Optimism, Arbitrum, and more.
- **Optimized Wallet List**: Implement lazy loading and optimize API calls for wallet balances.
- **UI/UX Improvements**: Refine the design and user experience for better usability.

**And more...**

🧪 **Testing Strategy**
- **Unit Tests**: Written using React Testing Library to ensure component reliability.
- **Integration Tests**: Validate interactions between components and Redux store.
- **End-to-End Tests**: Planned for future iterations using tools like Playwright or Cypress.