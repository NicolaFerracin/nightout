#NightOut
A FreeCodeCamp Basejump

Repository made for the following FreeCodeCamp Basejump http://www.freecodecamp.com/challenges/basejump-build-a-nightlife-coordination-app

##User Stories
- As an unauthenticated user, I can view all bars in my area.
- As an authenticated user, I can add myself to a bar to indicate I am going there tonight.
- As an authenticated user, I can remove myself from a bar if I no longer want to go there.
- As an unauthenticated user, when I login I should not have to search again.
- Try using the Yelp API to find venues in the cities your users search for. If you use Yelp's API, be sure to mention so in your app.


##Settings
- passport user DB to store email + pw + bars where the user is going
- Bars DB to store bars with number of attendants (starting at 1)

USER STORY 1
- User gets to web page
- User sees list of bars in his zone
- User can search for bars in a different zone
- When user tries to attend a bar he's redirected to login page

USER STORY 2
- user logs in
- user sees on the top the list of bars where he's going with the SignOut button
- user sees on the bottom the list of bars in his zone with the SignUp button
- user can also search for bars in a differnt zone

USER STORY 3
- when user clicks on the SignUp button of a bar:
  - if bar is not there, bar is added to the user.bars list of bars where the users is attending
  - the user.bars list is updated in the DB
  - if bar is in DB, the counter of attendants goes +1
  - else the bar is added to the DB with counter at 1
  - client is updated the SignUp button becomes a SignOut button and the number of attendants goes +1

USER STORY 4
- when user clicks on teh SignOut button of a bar:
  - bar is removed from the user.bars list
  - the user.bars list is updated in the DB
  - lower counter of attendants for the entry of the bar in the DB by -1
  - client is updated and the SignOut button becomes a SignUp button and the number of attendants goes -1
