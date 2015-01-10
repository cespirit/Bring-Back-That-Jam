# Bring Back That Jam
<p>Enter in a <a href="https://www.thisismyjam.com/">This Is My Jam</a> username to see up to three random songs they have jammed to. Can be viewed here: http://cespirit.github.io/bring-back-that-jam/</p>

<h2>Update: 10 Jan 2015 </h2>
<p>Turns out the API does not accurately return the total jams count of a user. Possibly deleted jams are still counted (look into). This breaks how random indices are choosen.</p>
<p>Current fix for this is if the jam at an index is undefined, don't show it. Displays a message to the user to try again if all selected indices have undefined values.</p>

<h2>TODO</h2>
<ul>
  <li>Handle case of no jams returned for a user with only one page of jams when jam count is inaccurately > 0. Display message that username has no jams.</li>
  <li>If jamsToDisplay is larger than jamsPerPage or totalJams on a page, may take time to select indices with current solution. Find a faster way to create a randomized sequence.</li>
</ul>

<h2>How It Works</h2>
<ul>
  <li>Uses the number of total jams associated with a username to calculate how many pages of jams they have.</li>
  <li>Selects a random page. Then selects three random songs from that page to display.</li>
  <li>Handles cases of username not found and no jams with a message to the user.</li>
  <li>Handles case when a username has less than three jams by displaying what they do have.</li>
  <li>Can easily change the number of jams to display by changing the jamsToDisplay variable in the code.</li>
  <li>Dependent on knowing how many jams are on each page.</li>
</ul>