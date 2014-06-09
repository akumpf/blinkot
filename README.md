blinkot
=======

Blinkot is a decentralized, democratized, and robust way to collect and distribute short-form information.

Think of a blinkot as somewhere between a tweet and a blog post that anyone can edit and re-share with their changes (i.e. post of twitter, facebook, google+, or embed).

- - - - - - - - - - - - - - - -

Blinkot Overview 
--
In a nutshell, a blinkot is a simple way to embed 
arbitrary HTML in a URL-contained wrapper that can 
be easily shared.

Requiring the link to remain < 2048 characters
allows it to be posted on most social media sites
and URL shorteners with minimal overhead.
This leads to ~1440 characters of content.

Inherent in each blinkot is also the ability to
modify and create new blinkots. Since the content
is contained in the URL's hash ("#..."), no data
needs to be transferred to the minimalistic site
hosting the blinkot's viewer/editor code.


Blinkot URL Structure
--
The URL's hash has 4 parts and looks like this...

    http://.../#TITLE_THEME_CONTENTTYPE_CONTENT_DATE
    TITLE:       base64 encoded title text
    THEME:       single letter (l,d)   - see: themeNames
    CONTENTTYPE: single letter (h,r,t) - see: typeNames
    TITLE:       base64 encoded content text
    DATE:        base32 -- new Date().getTime().toString(32);

For more details, view comments in the src/blinkot.js file.

Design Considerations
--
Blinkot is served from a single, static index.html file. This makes
scaling up crazy simple since it can be uploaded anywhere are used
immediately.

Blinkot is designed to be super lightweight. It doesn't even need jQuery.

Blinkots can always be edited / forked by anyone. 

Blinkots are easy to share, either directly via the full URL, or indirectly via a URL shortener (such as goo.gl when requested by the user).

- - - - - - - - - - - - - - - -
 
Open Source
--
Blinkot is released as open source under The MIT License (MIT).

If you run into problems or have suggestions for improvement, please file an issue.


