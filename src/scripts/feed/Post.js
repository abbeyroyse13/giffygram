import { getLikes, getLoggedInUserPosts } from "../data/DataManager.js"

const getNumberOfLikes = (postId) => {
    getLikes(postId)
        .then(response => {
            document.querySelector(`#likes__${postId}`).innerHTML = `👍 ${response.length}`;
        })
}

export const Post = (postObject) => {
        return `
    <section class="post">
      <header>
          <h2 class="post__title">${postObject.title}</h2>
          <h3 class="post__author">${postObject.author}</h3>
      </header>
      <img class="post__image" src="${postObject.imageURL}" />
      <button id="edit__${postObject.id}">Edit</button>
      <button id="delete__${postObject.id}">Delete</button>
      <button id="like__${postObject.id}">Like</button>
      <p id="likes__${postObject.id}">👍 ${getNumberOfLikes(postObject.id)}</p>
    </section>
  `
    }
    // figure out how to properly separate like from delete & edit