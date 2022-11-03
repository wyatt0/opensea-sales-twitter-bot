# OpenSea Sales Twitter Bot

Hello! This is a twitter bot to automatically tweet @Colorglyph sales from OpenSea. The base for this project was forked from @dsgriffin.

### How mine is different:
* OpenSea's API often has delays in sales being registered (up to 1 minute long), especially when sales are popping off. My pot polls the passed 10 minutes, every 5 minutes, to collect sales that are delayed. I added logic to avoid these sales as being identified as duplicates. (this is flawed logic, see next section)
* Twitter is not capable of tweeting SVGs, however the Colorglyphs are SVG files and that is what is returned by the API. Rather than re-writing my bot in a language with image conversion libraries such as python, I:
  * converted my image URL into an image buffer using axios
  * used sharp (a node.js image processing module) to convert the SVG buffer into a PNG buffer
  * converted the PNG buffer into its base64 enconding to comply with twitter

### Known Issues:
I developed this bot with very little knowledge of JS, and was pretty much carried through by being able to debug well and look stuff up. Since learning much more about web-technologies, node, and JS, I've relooked at the project and noticed some major flaws and improvements to be made
* Currently, when detecting duplicate sales, I check to see if I have tweeted anything with the exact same glyph ID (ex: #446) within the past 10 minutes. If so, this is marked as a duplicate sale and ignored. However, this does not account for when the same glyph is actually sold twice in the same time frame. 
  * To remedy this, if we detect that the same glyph has a sale in the last 10 minutes. We can request that event from OpenSea, check the timestamp the sale occurred, and compare it to the timestamp of the current event in question. If identical, then we have a duplicate.
* OpenSea API sometimes fails and goes down, as a result we can miss sales. Currently, my bot polls the past 10 minutes every 5 minutes to help account for this, however this is pretty naive and only works assuming the subsequent request goes through.
  * To remedy this, we can create a global variable to keep track of the time of the last successful call to OpenSea. Then, instead of polling OpenSea for the past 10 minutes, we can poll it back until the time of the last successful call. This way, we never miss any sales or time.
