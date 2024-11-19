# Web Development Final Project - *AnimeHub*

Submitted by: **Reginald Kotey Appiah-Sekyere**

This web app: **A platform where anime lovers can talk about their favorite animes and share moments they loved**

Time spent: **160** hours spent in total

## Required Features

The following **required** functionality is completed:

- [X] **A create form that allows the user to create posts**
- [X] **Posts have a title and optionally additional textual content and/or an image added as an external image URL**
- [X] **A home feed displaying previously created posts**
- [X] **By default, the time created, title, and number of upvotes for each post is shown on the feed**
- [X] **Clicking on a post shall direct the user to a new page for the selected post**
- [X] **Users can sort posts by either their created time or upvotes count**
- [X] **Users can search for posts by title**
- [X] **A separate post page for each created post, where any additional information is shown is linked whenever a user clicks a post**
- [X] **Users can leave comments underneath a post on the post's separate page**
- [X] **Each post should have an upvote button on the post's page. Each click increases its upvotes count by one and users can upvote any number of times**
- [X] **A previously created post can be edited or deleted from its post page**

The following **optional** features are implemented:

- [X] Upon registering on the web app, the user is assigned a random user ID. It will be associated with all posts and comments that they make and displayed on them.
The following **additional** features are implemented:

- [X] Password of User is stored as a bcrypted hash for security
- [X] Responsive site
- [X] User can like and unlike only once as done on most apps
      
## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='https://imgur.com/gVKv6Le.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace this with whatever GIF tool you used! -->
GIF created with LiceCap

## Notes

**Real-time Updates:**
- Handling immediate UI updates after actions like commenting and liking without requiring page refreshes
- Ensuring data consistency between local state and database updates
  
**State Management:**
- Managing complex state across multiple components
- Handling parsed and unparsed comments (stored as JSON strings in the database)
- Maintaining like status and counts accurately
  
**Authentication Flow:**
- Implementing secure password hashing with bcrypt
- Managing user sessions and protected routes
- Handling authentication errors and user feedback
  
**Data Structure:**
- Storing comments as JSON strings in the database requires constant parsing/stringifying
- Managing arrays for likes and comments in the database
- Handling timestamps and date formatting consistently
  
**Responsive Design:**
- Creating a responsive layout that works across different screen sizes
- Maintaining consistent styling between mobile and desktop views
- Handling image aspect ratios and sizes responsively
  
**Navigation:**
- Managing route transitions between pages
- Handling back/forward browser navigation
- Preventing unwanted redirects during form submissions
  
**User Experience:**
- Implementing proper loading states
- Handling error cases gracefully
- Providing immediate feedback for user actions
  
**Performance:**
- Managing re-renders efficiently
- Handling large lists of posts and comments
- Optimizing image loading and display
  
## License

    Copyright [2024] [Reginald Kotey Appiah-Sekyere]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
