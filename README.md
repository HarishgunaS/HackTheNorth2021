# HackTheNorth2021

### Description

Renshu is a Google Assistant Action that generates easy and enjoyable quiz questions from textbook sections or notes. Simply enter your text with relevant content into our website and then ask Google Assistant to talk to Renshu helper! Renshu helper will ask you a question, and after you think you know the answer, you can prompt it for the correct answer.

Note: the demo uses `commit 29173984dd5f7ea48ec1b2b5c29348ca7e14de37`, since the remaining commits are incomplete/not stable.

### The Process/Pipeline
User opens Renshu website and clicks start. The text to be used is pasted into a form, which is then received in NodeJS and saved as a text file. A cutting edge Python neural question generator is utilized to generate meaningful question answer pairs from this text file, and the data is stored as a JSON file. Then, the user clicks the continue button, and the JSON object is uploaded to a Cockroach cloud database.

The other half of the process is fairly separated. NodeJS and the @assistant/conversation module are used to provide fulfillment for Actions on Google. When the user starts the Google action, the initialization intent is called, and the question answer pairs are retrieved from the database. Then, question and answer are alternated on the Google Assistant based on user input.

### Technologies Used

NodeJS, Python, Pytorch, Actions on Google, CockroachDB, Huggingface Transformers, Suraj Patil's Neural Question Generator

### Replication

```shell
git clone https://github.com/saumik13/HackTheNorth2021.git
cd HackTheNorth2021/
git checkout 29173984dd5f7ea48ec1b2b5c29348ca7e14de37
pip3 install -r requirements.txt
python3
>>> import nltk
>>> nltk.download('punkt')
node app.js
```
Then visit localhost:3000 to find the Renshu website. After finishing submitting your text, get the Renshu Helper action from the Actions directory for Google Assistant. Then simply say "Talk to Renshu Helper" to your Google Assistant.
