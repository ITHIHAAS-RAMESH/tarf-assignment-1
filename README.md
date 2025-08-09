Court choosen - DELHI HIGHCOURT

Step to run the app:

1. cd into the backend folder
2. npm install
3. run index.js using the command node index.js
4. cd into the frontend folder
5. npm install
6. run the react app using npm run dev

Captcha strategy:

1. Locate the captcha text element in the webpage. (The captcha on this site is not an image, but plain text inside a .captcha-code element, so I directly read it.)
2. Using page.evaluate, I ran browser-side JavaScript to get the exact text content from the .captcha-code element.
3. I then programmatically type the extracted captcha text into the captcha input field (#captchaInput) exactly as shown on the page.
4. I then click the search button to proceed with the form submission.

Video link : https://youtu.be/nVJrNjFuoa0

Screenshots:

<img width="1440" height="820" alt="Screenshot 2025-08-09 at 2 58 33 PM" src="https://github.com/user-attachments/assets/74cad51e-138b-4667-8a5f-3735e323006f" />
