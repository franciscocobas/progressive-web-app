<h1 align="center">
  Progressive Web Apps and Service Workers
</h1>

## What are Progressive Web Apps? 
If you think about native apps and web apps in terms of capabilities and reach, native apps represent the best of capabilities whereas web apps represent the best of reach. So where do Progressive Web Apps fit in?

Progressive Web Apps (PWA) are built and enhanced with modern APIs to deliver native-like capabilities, reliability, and installability while reaching anyone, anywhere, on any device with a single codebase.

At their heart, Progressive Web Apps are just web applications. Using progressive enhancement, new capabilities are enabled in modern browsers. Using service workers and a web app manifest, your web application becomes reliable and installable. If the new capabilities aren't available, users still get the core experience.

You can read more about it in the following link: https://web.dev/what-are-pwas/

## How to transform a web app into a PWA?

In order to build a PWA we need to do two things. 
1. First one, use **Service Workers** for caching all the pages and resources in order to enable offline mode (and more capabilities like push notifications, background sync, etc.). 
2. And second add a `manifest.webmanifest` file in order to enable Mobile App capabilities, such as Mobile App Icon, Mobile App shortcuts, and many more.

## What are Service Workers about?

**A brief introduction:**

Service worker is a script that your browser runs in the background, separate from a web page, opening the door to features that don't need a web page or user interaction. Today, they already include features like [push notifications](https://developers.google.com/web/updates/2015/03/push-notifications-on-the-open-web "Push Notifications") and [background sync](https://developers.google.com/web/updates/2015/12/background-sync "Background Sync"). In the future, service workers might support other things like periodic sync or geofencing. The core feature discussed in this tutorial is the ability to intercept and handle network requests, including programmatically managing a cache of responses.

You can read more about it in the following link: https://developers.google.com/web/fundamentals/primers/service-workers


I highly recommend you to read two things about Service Workers
1. How the Service Workers **life cycle** works. 
2. Which **prerequisites** we need to have in order to work with Services Workers. 

Google documentation is pretty well explained, so I prefer to link to it instead of writing the same thing again. 

**Service Workers Life cycle:** [Life cycle](https://developers.google.com/web/fundamentals/primers/service-workers#the_service_worker_life_cycle "The service worker life cycle")


**Service Workers Prerequisites:** [Prerequisites](https://developers.google.com/web/fundamentals/primers/service-workers#prerequisites "Prerequisites")

### Let's begin 🚀 this tutorial by creating a regular Web App
 

To start we are going to create two pages. `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <header>
    <nav>
      <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/about.html">About</a></li>
        <li><a href="#">Contact</a></li>
      </ol>
    </nav>
  </header>
  <main>
    <h1>Welcome!</h1>
    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
  </main>
  <script src="./js/main.js"></script>
</body>
</html>
```

and `about.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <header>
    <nav>
      <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/about.html">About</a></li>
        <li><a href="#">Contact</a></li>
      </ol>
    </nav>
  </header>
  <main>
    <h1>About</h1>
    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
  </main>
  <script src="./js/main.js"></script>
</body>
</html>
```

Notice how in both pages we link a stylesheet and a javascript file.

Create the `css/styles.css` stylesheet by copying the code from this Github Gist: [css/styles.css](https://gist.github.com/franciscocobas/295e164d4918e9e49dd82693d99c6040)

Create an empty Javascript file named: `js/main.js`

#### At this point in time we have a regular web app, let's begin the construction of the Progressive Web App

Now, we are going to register the service worker in our main javascript file. For doing that we need to do two things, first create our service worker file, second modify the `js/main.js` file. 

The service worker file is just a regular javascript file, in our case we are going to name it `service-worker.js`. This file should be in the root folder. 

in your prefered terminal window, run the following command: 

`touch service-worker.js`

then we are going to modify the `js/main.js` file with the following code: 

```javascript
// Make sure Service Worker is supported
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
      // Register our recently created file
      navigator.serviceWorker.register('../service-worker.js').then( registration => {
        console.log('Registration was successfully completed');
      })
      .catch( err => {
        console.log('There was an error during the registration of the Service Worker');
      });
  });
}
```

After registering/installing the service worker we are going to modify the `service-worker.js` file in order to add the cache into it. 

```javascript
// service-worker.js

// Name of the cache bucket.
const cacheName = 'wpa-sw-cache-v1';

const urlsToCache = [
  '/',
  '/css/styles.css',
  '/js/main.js',
  'index.html',
  'about.html'
];

// In the install life cycle event add the resources into the cache bucket. 
self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(cacheName)
      .then( cache => {
        // Add resources to cache
        return cache.addAll(urlsToCache);
      })
  );
});
```

Fetch the resources from the cache once they are present, in order to do that add this code to the `service-worker.js` file
```javascript

// ... install event

// When the Service Worker fetch a request, respond with caches resources if they are available. 
// If not then respond with the original request.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request.url).then( response => {
      return response || fetch(response.request.url);
    )
  );
});
```

Delete unused caches 

```javascript
// You can have many cache buckets in your PWA, but if you have unused buckets is a good practice to 
// delete them in order to remove unused data. 
self.addEventListener('activate', event => {

  // Add all caches that you want to keep
  const cacheWhiteList = ['wpa-sw-cache-v1'];

  event.waitUntil(
    caches.keys().then( cacheNames => {
      return Promise.all(
        cacheNames.map( cacheName => {
          if (cacheWhiteList.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

### Now is time to work on the manifest.webmanifest file 🏹

This file should be created on the root folder. To do that we can run the following command on the terminal: 

I'll write a brief description of each key of the manifest.json. If you want to read more details please check the following URL: https://web.dev/add-manifest/

`touch manifest.webmanifest`

```json
{
  "short_name": "PWA App",
  "name": "PWA App",
  "description": "App to show how PWA works",
  "icons": [
    {
      "src": "/images/pwa-192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "/images/pwa-512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": "/",
  "background_color": "#E74C3C",
  "display": "standalone",
  "scope": "/",
  "theme_color": "#E74C3C",
  "shortcuts": [
    {
      "name": "Who we are?",
      "short_name": "About",
      "description": "",
      "url": "/about.html",
      "icons": [{ "src": "/images/pwa-192.png", "sizes": "192x192" }]
    }
  ]
}
```

Explanation of each property: 
- `short_name` : Is used on the user's home screen, launcher, or other places where space may be limited.
- `name` : Is used when the app is installed.
- `description` : Description of your app
- `icons` : The icons property is an array of image objects. Each object must include the src, a sizes property, and the type of image.
- `start_url` : Is required and tells the browser where your application should start when it is launched.
- `background_color` : Is used on the splash screen when the application is first launched on mobile.
- `display` : You can customize what browser UI is shown when your app is launched. For example, you can hide the address bar and Chrome browser.
- `scope` : Defines the set of URLs that the browser considers to be within your app, and is used to decide when the user has left the app.
- `theme_color` : Sets the color of the tool bar, and may be reflected in the app's preview in task switchers.
- `shortcuts` : Is an array of app shortcut objects whose goal is to provide quick access to key tasks within your app.

Once we have the `manfiest.webmanifest` file then we need to link this file and add some required tags in our `index.html` and `about.html` pages.

```html
<head>
  ...
  <meta name="theme-color" content="#E74C3C"> <!-- Sets a theme color for the address bar -->
  <meta name="description" content="App to show how PWA works"> <!-- Sets a theme color for the address bar -->
  ... 
  <link rel="manifest" href="/manifest.webmanifest" /> <!-- Link our recenctly created manifest.webmanifest file -->
  <link rel="apple-touch-icon" href="pwa-192.png"> <!-- Provide a valid apple-touch-icon -->
  ...
</head>
```