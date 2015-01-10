# Bring Back That Jam
<p>Enter in a <a href="https://www.thisismyjam.com/">This Is My Jam</a> username to see up to three random songs they have jammed to. Can be viewed here: http://cespirit.github.io/bring-back-that-jam/</p>

<h2>How It Works</h2>
<ul>
  <li>Uses the number of total jams associated with a username to calculate how many pages of jams they have.</li>
  <li>Selects a random page. Then selects three random songs from that page to display.</li>
  <li>Handles cases of username not found and no jams with a message to the user.</li>
  <li>Handles case when a username has less than three jams by displaying what they do have.</li>
  <li>Can easily change the number of jams to display by changing the jamsToDisplay variable in the code.</li>
  <li>Dependent on knowing how many jams are on each page.</li>
</ul>

<h2>TODO</h2>
<ul>
  <li>Display last page's jams even if there are not enough to match jamsToDisplay</li>
</ul>
