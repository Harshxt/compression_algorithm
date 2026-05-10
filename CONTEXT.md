I am building a file compressor website. I need suggestions and feedback on my plan. In the current prompt, I will be explaining my plan and how I plan to implement it. 

Overview of the project:
The project is a file compressing website/web-app where I can upload one of the supported file and convert it to a compressed version. I am mainly building this to compress my video files to a smaller size while losing minimal quality. Later on I’ll add more file types if I plan to open the website to other users. I plan to do on-device processing (and maybe add a toggle in the future for on-device or cloud processing). The initial website will be basic, having only a single page to select file and download the converted one. The data will not persist (maybe in the future, we could add an option to see conversion history. 

Coming to the UI:
I would like a sleek and minimal dark-mode first design. I do not plan to add dark and light theme initially. 

Coming to the compression feature:
I would use a library to run the converter on the browser. There will be a batch feature so multiple files can be uploaded and they would be in queue and eventually compressed.

The tech stack I plan to use:
1. Next.js and tailwind for frontend.
2. Backend- Not sure if I should use next.js itself, go or springboot. (I am particularly interested  in learning go and/or springboot, but I could learn that after learning to make backend using next.js)
3. Compression library: I need your help as I don’t know what to use. 

My plan for now:
1. Find a design or create a wireframe myself (basic one) 
2. Build the basic UI using next.js and tailwind
3. Implement backend (No idea what I’ll add to it, but I could add some logging for practice, will be needed for future development)
4. Implement compression algorithm

Some additional suggestions that I need from you:
1. Should it be a web-app or a PWA?
2. Should I keep the compression processing in the backend on the client side?
3. What library should be used for compression