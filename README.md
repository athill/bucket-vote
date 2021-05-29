# Bucket Vote

[Current Demo](http://bucket-vote.andyhill.us/)

Premise
-----------

At my church ([United Presbyterian Church in Bloomington, IN](http://upcbloomington.org/)), a committee I am on had to choose the group that will find our next pastor. We had 15 or so prospects, but needed 7 members for the group. We did what I call a "bucket vote" (though I can't seem to find a use of this term anywhere.) The way ours worked was each voter could select 10 prospects and the 7 who got the most votes were asked first. 

This app provides a graphical way to cast and tally the votes.

How to use
--------------------

First, make sure you've installed [Composer](https://getcomposer.org/.)

Next, clone this repo:

```
git clone git@github.com:athill/bucket-vote
```

Now, `cd` into that directory, update composer, and start the PHP server:

```
cd bucket-vote
docker run -it --rm -v `pwd`:/app composer install
php -S localhost:8000
```

Finally, point your browser to (http://localhost:8000) to start.
