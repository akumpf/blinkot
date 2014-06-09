blinkot
=======

Blinkot is a decentralized, democratized, and robust way to collect and distribute short-form information.

Think of a blinkot as somewhere between a tweet and a blog post that anyone can edit and re-share with their changes (i.e. post of twitter, facebook, google+, or embed).

See the blinkot homepage for more info:
http://www.blinkot.com

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

Here's a [real-world, correctly formed example URL](http://a.blinkot.com/#SW50cm9kdWNpbmcgQmxpbmtvdA==_a_h_PGgyPkhleSB0aGVyZSE8L2gyPgoKVGhpcyBpcyBhIGJsaW5rb3QuIFRoaW5rIG9mIGl0IGFzIGEgbGlnaHR3ZWlnaHQgYmxvZyBwb3N0IHRoYXQgZG9lc24ndCByZXF1aXJlIHVzZXIgYWNjb3VudHMgb3Igc2VydmVyIHN0b3JhZ2UuIFRoYXQncyBiZWNhdXNlIGFsbCBvZiBpdHMgY29udGVudCBpcyBjb250YWluZWQgZW50aXJlbHkgd2l0aGluIHRoZSBVUkwgaXRzZWxmICZtZGFzaDsgaXQncyB0cnVseSBkZWNlbnRyYWxpemVkLgoKQmxpbmtvdHMgY2FuIHNob3cgYW55dGhpbmcgYnVpbHQgb3V0IG9mIEhUTUwgYW5kIGFyZSBlYXNpbHkgc2hhcmVkIG9uIHNvY2lhbCBtZWRpYSBzaXRlcy4gQW5kIHVubGlrZSBvdGhlciBzaGFyZWQgY29udGVudCwgYmxpbmtvdHMgYXJlIGRpcmVjdGx5IDxiPmVkaXRhYmxlIGJ5IGV2ZXJ5b25lPC9iPi4gCgpTaW1wbHkgcHJlc3MgdGhlICJFZGl0IiBidXR0b24gYXQgdGhlIGJvdHRvbSBvZiB0aGlzIHBhZ2UgdG8gbWFrZSBzb21lIGNoYW5nZXMgYW5kIGZvcmsgbWUgaW50byBzb21ldGhpbmcgbmV3LgoKWW91IGNhbiBldmVuIGVtYmVkIHZpZGVvcywgbXVzaWMsIGFuZCBpbWFnZXMgZnJvbSBwbGFjZXMgbGlrZSBZb3VUdWJlLCBWaW1lbywgYW5kIFNvdW5kQ2xvdWQuIAoKPGk+VGhhdCdzIHlvdXIgY3VlLCBrZXlib2FyZCBjYXQhPC9pPgoKPGlmcmFtZSBzcmM9Ii8vd3d3LnlvdXR1YmUuY29tL2VtYmVkL0szNlRjR3AyWE84Ij48L2lmcmFtZT4KCkFuZCBzaW5jZSB0aGUgY29udGVudCBpcyBjb250YWluZWQgaW4gdGhlIFVSTCdzIDxpPmhhc2g8L2k+ICh0aGUgcGFydCBvZiB0aGUgVVJMIGFmdGVyICIjIiksIGl0J3MgbmV2ZXIgc2VudCB0byBhbnkgYmxpbmtvdCBzZXJ2ZXIuIFRoZSBtYWluIGJsaW5rb3QgcGFnZSBpcyBqdXN0IGEgc2ltcGxlIHZpZXdlci9lZGl0b3IgZm9yIHlvdXIgY29udGVudCwgYWxsIGNvbWJpbmVkIGludG8gYSBzaW5nbGUsIHN0YXRpYyBIVE1MIG1pbmktYXBwLgoKVG8ga2VlcCB0aGUgYmxpbmtvdCBVUkwgd2l0aGluIGEgcmVhc29uYWJsZSBzaXplIGZvciBzaGFyaW5nLCB0aGVyZSBpcyBhIGxpbWl0IG9mIDE0NDAgY2hhcmFjdGVycyBvZiBjb250ZW50LiBUaGF0J3Mgc29tZXdoZXJlIGJldHdlZW4gYSBzaG9ydCBibG9nIHBvc3QgYW5kIGEgbG9uZyB0d2l0dGVyIGNvbnZlcnNhdGlvbi4gTWFrZSBvZiB0aGF0IHdoYXQgeW91IHdpc2guIDopCgpBbGwgYmxpbmtvdCBjb2RlIGlzIGNvbXBsZXRlbHkgb3BlbiBzb3VyY2UuIExlYXJuIG1vcmUgYXQgaHR0cDovL3d3dy5ibGlua290LmNvbQoKRmVlbCBmcmVlIHRvIGVkaXQvZm9yayB0aGlzIHBhZ2UgYW5kIHNoYXJlIGl0IHdpdGggeW91ciBmcmllbmRzIHVzaW5nIHRoZSBidXR0b25zIGJlbG93LiAKClBhcnR5IG9uIQ==_18psn24df). 


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


