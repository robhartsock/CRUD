# Logikcull
This is a simple, music album CRUD app that uses JsStore (http://jsstore.net/) as an IndexedDB wrapper for client side storage.

## Installation
```
git clone https://github.com/robhartsock/logikcull.git
cd logikcull
python -m SimpleHTTPServer 8000
```
Using Chrome or Safari (Firefox is being pissy), point your browser to http://localhost:8000/index.html

## Possible Issues
This is an experimental implementation with JsStore.  Every once in a while the client side "database" will fail to initialize, if this happens just clear your localStorage in the browser for **localhost** and reload the page.  Keep an eye on your console, if any errors exist then this is likely to be the issue.