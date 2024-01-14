
# Movie club

## Links

Test version without authentication, open for testing: 
[https://movie-club-1337-demo.vercel.app/](https://movie-club-1337-demo.vercel.app/)

Production version for actual use:
[https://movie-club-1337.vercel.app/](https://movie-club-1337.vercel.app/)

## Description

A website for personal use for a movie watching group. Used for planning, organizing and immortilizing the activity of the club. 

From a technical point of view, a playground for me to experiment with modern Next.js, React, Vercel and combining server-side + client-side rendering solutions. Primarily for learning and enjoyment purposes, but a usable product is in cards in the future, too...


## Run locally

Make sure to have Docker installed and running. Run `npm run local-test`, possibly modifying the host port.  Also create a `.env` file where you set up the connetion strings (see: `.env.testing`).Once the container is running, Run `npm run prisma-build` to set up the schema and constraints. Optionally seed with initial data by running `npx prisma db seed`.

To test without the need to authenticate, set the environment variable `DISABLE_AUTH=true`. 

Finally, run `npm run dev` and the app should open at [http://localhost:3000](http://localhost:3000).


## Status and next steps

Quite unfinished, especially on the UX side. Some of the next improvement steps: 

* gather css rules in fewer places, since similar combinations are currently spread across components
* more pleasant-looking site
* mobile-friendlier version
* CRUD operations for most resources from the website without needing to execute database queries
* Possibility to invite only certain people to join events
* Ability to add movies not existing in my database directly to an event, without needing to use the 'movies' page in between
* Reminder before event + after event to leave reviews via optional email reminders

Sharing the site with other members of our movie club should elicit further ideas for improvements and long-term goals... 

