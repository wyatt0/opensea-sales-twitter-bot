# OpenSea Sales Twitter Bot

Hello! This is a twitter bot to automatically tweet @Colorglyph sales from OpenSea. The base for this project was forked from @dsgriffin.

How mine is different:
- OpenSea's API is often down for minutes at a time, especially when sales are popping off. My bot polls in a unique way such that every window of time in which a sale occurs is constantly polled until it is polled without error, that way no sales are missed even if the API is down for a long period of time.
- Twitter is not capable of tweeting SVGs, however the Colorglyphs are SVG files and that is what is returned by the API. Rather than re-writing my bot in a language with image conversion libraries such as python, with help from online, I wrote a function to programatically convert SVGs to PNGs using bit trasformations.
