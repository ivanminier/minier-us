---
title: When the data disappears
date: "2026-11-27"
summary: What a campus laundry tracker can tell you when its provider feed fails to refresh.
project: uvm-laundrylink
---

An earlier version of LaundryLink could open even when the feed behind it was unavailable. The interface was there, but it couldn’t answer the question someone had come to ask. That made the state of the data part of the interface.

If a room refreshed successfully on an earlier visit, LaundryLink can show that saved status with its timestamp. That time matters. A free dryer reported earlier may have a load in it now. When there is no usable status to show, the room says so and offers a link to the official LaundryConnect page. The service status page also gives the date of its last automated check.

I wanted the screen to help someone decide how much weight to put on what they were seeing. Sometimes the most useful thing it can show is when it last had an answer and where else to check.
