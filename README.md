<p align="center">
<img src="./App/src/components/images/logo.png" width="200" height="200" alt="Intelliquiz logo"/>
</p>
<h1 align="center">
IntelliQuiz - An AI-Powered Quiz Maker App
</h1>

![Application quiz page example](https://github.com/pfang12/CPSC-2350-Project/assets/72409412/fc61b89a-c2ee-456e-bee9-9514bf8a315c)

## 🗺️ Overview
IntelliQuiz is designed for students who wish to streamline study sessions and instructors who want to simplify quiz creation for their classes. 

This project aims to offer customizable Ai-generated quizzes from text inputs or PDF documents. The quizzes are interactive and provide "Hint" buttons; they can be attempted directly in the application or can be downloaded as PDF files. Quiz results provide feedback and highlights areas needing further review. The final summary and results can also be downloaded as a report PDF.

### [-> Try out the site <-](https://pfang12.github.io/CPSC-2350-Project/)

### [-> Watch the demo <-](https://drive.google.com/file/d/1wUgf49-GWlcw_Q-dyJCF3bjznb9zp2-I/view)

**NOTE:** The report and presentation can be found under the `./reports` and `./presentations` directories of this repository.

## 🏠 Running IntelliQuiz locally

### Prerequisites
* `Node.js` version 18 or above
*  `npm` package manager

### Instructions
1. Clone this repository
   ```bash
   git clone https://github.com/pfang12/CPSC-2350-Project.git
   ```
2. Move into the application folder of the repo
   ```bash
   cd CPSC-2350-Project
   cd App
   ```
3. Install the node dependencies
   ```bash
   npm install
   ```
4. Add this **[.env file](https://drive.google.com/file/d/1qU4Bzm2J2MNSfmSJ0Dp8YTSdd_iUZPQn/view)** to the `App` directory (root directory of the application, not the repository)
   - Make sure the file contains three API keys:
     1. `VITE_OPENAI_KEY`
     2. `VITE_PDF_CLIENT_ID`
     3. `VITE_PDF_CLIENT_SECRET` 
   - **IMPORTANT:** this file link represents a security risk for our application. As soon as marking is complete, the API keys will be deactivated and the link will be removed.
5. To run the application, use the following command inside the `App` directory
   ```bash
   npm run dev
   ```
   - This should open a local development server at `http://localhost:5173/CPSC-2350-Project` (the port number might change)
     
6. To run both the unit and integration tests, run the following command inside the `App` directory
   ```bash
   npm run test
   ```
   
## 🧰 Tech Stack
IntelliQuiz was built using:

* Frontend React + Tailwind CSS
* APIs: OpenAI, Adobe PDF Services
* Testing: Vitest
* Deployment: GitHub Pages

## 🧑‍💻 Authors
* Harpreet Singh
* Miguel Fierro
* Patrick Fang
* Utsav Monga
