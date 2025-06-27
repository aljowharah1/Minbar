# Minbar (منبر) – AI-Powered Presentation Coaching Platform

<p align="center">
  <img src="./public/images/A.png" alt="Minbar Logo" width="150"/>
</p>

## Overview

Minbar (meaning “platform” in Arabic) is an AI-powered web platform designed to help users refine their public speaking skills. By allowing presenters to select their target audience, upload slides, and record live presentations via webcam, Minbar analyzes delivery using computer vision and audio processing. It then generates a detailed feedback dashboard to help improve clarity, confidence, and engagement.

## Key Features

- Audience Targeting – Choose the type of audience you're presenting to.
- Slide Upload – Upload your PDF or PPT slides before presenting.
- Webcam-Based Presentation – Present live through the browser.
- AI Feedback Dashboard – Get insights on body language, vocal pacing, filler words, slide alignment, and more. *(to be added)*
- Integrated NLP and Computer Vision – Uses natural language processing and computer vision to evaluate delivery. *(to be added)*

## Project Structure

<pre>
minbar/
├── app.js
├── package.json
├── package-lock.json
├── desktop.ini

├── views/
│   ├── index.ejs
│   ├── login.ejs
│   ├── acc.ejs
│   └── admin.ejs

├── public/
│   ├── css/
│   │   ├── acc.css
│   │   ├── admin.css
│   │   ├── login.css
│   │   └── style.css
│   ├── images/
│   │   ├── A.jpg
│   │   └── A.png

├── config/
│   └── database.js

├── models/
│   ├── feedback.js
│   ├── plans.js
│   └── users.js

├── js/
│   ├── acc.js
│   ├── admin.js
│   └── script.js

├── videos/
│   ├── blackhole.mp4
│   ├── galaxy.mp4
│   └── krumzi-video.mp4

├── assets/
│   ├── A.png
│   ├── character (1).png
│   ├── character (2).png
│   ├── character (3).png
│   ├── logo.png
│   └── logo2.png
</pre>

<details>
<summary><strong>Installation & Setup</strong></summary>

### Prerequisites

- Node.js v14+
- npm or yarn
- MySQL or SQLite database

### Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/aljowharah1/minbar.git
   cd minbar

	2.	Install dependencies:

npm install


	3.	Configure the database:
	•	Open config/database.js and update your DB settings.
	4.	Run the application:

node app.js


	5.	Open your browser and go to:

http://localhost:3000

</details>


<details>
<summary><strong>Project Contributors</strong></summary>


	•	Sarah Alkahwaji – 222410358
	•	Aljawharah Aljubair – 222410187
	•	Prince Sultan University
	•	Instructor: Ms. Alhanouf Almutairi

</details>
