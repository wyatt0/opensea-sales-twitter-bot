# OpenSea Sales Twitter Bot

Hello! This is a twitter bot to automatically tweet @Colorglyph sales from OpenSea. The base for this project was forked from @dsgriffin.

How mine is different:
- OpenSea's API often has delays in sales being registered (up to 1 minute long), especially when sales are popping off. My pot polls the passed 10 minutes, every 5 minutes, to collect sales that are delayed. I added logic to avoid these sales as being identified as duplicates.
- Twitter is not capable of tweeting SVGs, however the Colorglyphs are SVG files and that is what is returned by the API. Rather than re-writing my bot in a language with image conversion libraries such as python, with help from online, I wrote a function to programatically convert SVGs to PNGs using bit trasformations.
