// making sure you get all imports in is very (import)ant!!! hah
// similarly, making sure all exports are right is just as im(ex)portant!!! haha
import { getUsers, getPosts, usePostCollection, getLoggedInUser, createPost, deletePost, getSinglePost, updatePost, logoutUser, loginUser, registerUser, setLoggedInUser, postLike } from "./data/DataManager.js"
import { PostList } from "./feed/PostList.js"
import { NavBar } from "./nav/NavBar.js"
import { Footer } from "./nav/Footer.js"
import { PostEntry } from "./feed/PostEntry.js"
import { PostEdit } from "./feed/PostEdit.js"
import { LoginForm } from "./auth/LoginForm.js"
import { RegisterForm } from "./auth/RegisterForm.js"

/**
 * Main logic module for what should happen on initial page load for Giffygram
 */

//Get a reference to the location on the DOM where the app will display
//let postElement = document.querySelector(".postList");
//let navElement = document.querySelector("nav");
//let entryElement = document.querySelector(".entryForm")

const applicationElement = document.querySelector(".giffygram");
// targets logout id which logs out the user; sessionStorage stores data for only one session; data deleted after logged out 
applicationElement.addEventListener("click", event => {
    if (event.target.id === "logout") {
        logoutUser();
        console.log(getLoggedInUser());
        sessionStorage.clear();
        checkForUser();
    }
})

applicationElement.addEventListener("click", event => {
    if (event.target.id === "directMessageIcon") {
        console.log("You clicked on the fountain pen")
    }
})

applicationElement.addEventListener("click", event => {
        if (event.target.id === "pbjar") {
            console.log("You're going home")
        }
    })
    // this targets the edit button with an id that starts with edit.
    // 
applicationElement.addEventListener("click", event => {
    event.preventDefault();
    if (event.target.id.startsWith("edit")) {
        const postId = event.target.id.split("__")[1];
        getSinglePost(postId)
            .then(response => {
                showEdit(response);
            })
    }
})

applicationElement.addEventListener("change", event => {
    if (event.target.id === "yearSelection") {
        const yearAsNumber = parseInt(event.target.value)

        console.log(`User wants to see posts since ${yearAsNumber}`)
    }
})

applicationElement.addEventListener("change", event => {
    if (event.target.id === "yearSelection") {
        const yearAsNumber = parseInt(event.target.value)
        console.log(`User wants to see posts since ${yearAsNumber}`)
            //invoke a filter function passing the year as an argument
        showFilteredPosts(yearAsNumber);
    }
})

applicationElement.addEventListener("click", event => {
    if (event.target.id === "newPost__cancel") {
        //clear the input fields
    }
})

applicationElement.addEventListener("click", event => {
        event.preventDefault();
        if (event.target.id === "newPost__submit") {
            //collect the input values into an object to post to the DB
            const title = document.querySelector("input[name='postTitle']").value
            const url = document.querySelector("input[name='postURL']").value
            const description = document.querySelector("textarea[name='postDescription']").value
                //we have not created a user yet - for now, we will hard code `1`.
                //we can add the current time as well
            const postObject = {
                title: title,
                imageURL: url,
                description: description,
                userId: getLoggedInUser().id,
                timestamp: Date.now()
            }

            // be sure to import from the DataManager
            createPost(postObject)
        }
    })
    // targets logout button to log the user out & clear their sessionStorage
applicationElement.addEventListener("click", event => {
    if (event.target.id === "logout") {
        logoutUser();
        console.log(getLoggedInUser());
    }
})

applicationElement.addEventListener("click", event => {
    event.preventDefault();
    if (event.target.id.startsWith("delete")) {
        const postId = event.target.id.split("__")[1];
        deletePost(postId)
            .then(response => {
                showPostList();
            })
    }
})

applicationElement.addEventListener("click", event => {
    event.preventDefault();
    if (event.target.id.startsWith("like")) {
        const likeObject = {
            postId: event.target.id.split("__")[1],
            userId: getLoggedInUser().id
        }
        postLike(likeObject)
            .then(response => {
                showPostList();
            })
    }
})

applicationElement.addEventListener("click", event => {
        event.preventDefault();
        if (event.target.id.startsWith("updatePost")) {
            const postId = event.target.id.split("__")[1];
            //collect all the details into an object
            const title = document.querySelector("input[name='postTitle']").value
            const url = document.querySelector("input[name='postURL']").value
            const description = document.querySelector("textarea[name='postDescription']").value
            const timestamp = document.querySelector("input[name='postTime']").value

            const postObject = {
                title: title,
                imageURL: url,
                description: description,
                userId: getLoggedInUser().id,
                timestamp: parseInt(timestamp),
                id: parseInt(postId)
            }

            showPostEntry();

            updatePost(postObject)
                .then(response => {
                    showPostList();
                })
        }
    })
    // preventDefault keeps user from submitting anything until all fields are complete
    // targets the login submit button to log a user in
applicationElement.addEventListener("click", event => {
        event.preventDefault();
        if (event.target.id === "login__submit") {
            //collect all the details into an object
            const userObject = {
                    // these store the name and email of the user 
                    name: document.querySelector("input[name='name']").value,
                    email: document.querySelector("input[name='email']").value
                }
                // this allows the user to log in & puts them in a sessionStorage
            loginUser(userObject)
                .then(dbUserObj => {
                    if (dbUserObj) {
                        // turns the user obj to a string then starts giffygram if user is valid
                        sessionStorage.setItem("user", JSON.stringify(dbUserObj));
                        startGiffyGram();
                    } else {
                        //got a false value - no user
                        const entryElement = document.querySelector(".entryForm");
                        entryElement.innerHTML = `<p class="center">That user does not exist. Please try again or register for your free account.</p> ${LoginForm()} <hr/> <hr/> ${RegisterForm()}`;
                    }
                })
        }
    })
    // basically the same as the login submit, the preventDefault keeps the form from submitting until all fields are complete
applicationElement.addEventListener("click", event => {
        event.preventDefault();
        // targets the register submit button
        if (event.target.id === "register__submit") {
            //collect all the details into an object
            const userObject = {
                    // stores the name & email; in other words, registers the user
                    name: document.querySelector("input[name='registerName']").value,
                    email: document.querySelector("input[name='registerEmail']").value
                }
                // allows user to register & puts them in a sessionStorage
            registerUser(userObject)
                .then(dbUserObj => {
                    // turns the user obj to a string then starts giffygram if user is valid
                    sessionStorage.setItem("user", JSON.stringify(dbUserObj));
                    startGiffyGram();
                })
        }
    })
    // define checkForUser; first step in sessionstoring something 
const checkForUser = () => {
    if (sessionStorage.getItem("user")) {
        //this is expecting an object. Need to fix
        // this is setting the logged in user, parsing (converting), sessionstoring an item (the user in this case), then giffygram can start
        setLoggedInUser(JSON.parse(sessionStorage.getItem("user")));
        startGiffyGram();
    } else {
        //show login/register
        showLoginRegister();
    }
}

/*const authorCanEdit = () => {
    if ()
} else {

}*/ // still thinking abt this

// if user does not have acc, they must get registered first 
const showLoginRegister = () => {
    showNavBar();
    const entryElement = document.querySelector(".entryForm");
    //template strings can be used here too
    // hr = horizontal rule: used to separate content (here, it separates login from register)
    entryElement.innerHTML = `${LoginForm()} <hr/> <hr/> ${RegisterForm()}`;
    //make sure the post list is cleared out too
    const postElement = document.querySelector(".postList");
    postElement.innerHTML = "";
}

const showEdit = (postObj) => {
    const entryElement = document.querySelector(".entryForm");
    entryElement.innerHTML = PostEdit(postObj);
}

const showFilteredPosts = (year) => {
    //get a copy of the post collection
    const epoch = Date.parse(`01/01/${year}`);
    //filter the data
    const filteredData = usePostCollection().filter(singlePost => {
        if (singlePost.timestamp >= epoch) {
            return singlePost
        }
    })
    const postElement = document.querySelector(".postList");
    postElement.innerHTML = PostList(filteredData);
}

const showPostList = () => {
    const postElement = document.querySelector(".postList");
    getPosts().then((allPosts) => {
        postElement.innerHTML = PostList(allPosts);
    })
}

const showPostEntry = () => {
    //Get a reference to the location on the DOM where the nav will display
    const entryElement = document.querySelector(".entryForm");
    entryElement.innerHTML = PostEntry();
}

const showNavBar = () => {
    //Get a reference to the location on the DOM where the nav will display
    const navElement = document.querySelector("nav");
    navElement.innerHTML = NavBar();
}

const showFooter = () => {
    const footerElement = document.querySelector("footer");
    footerElement.innerHTML = Footer();
}

/*
    This function performs one, specific task.

    1. Can you explain what that task is?
    2. Are you defining the function here or invoking it?
*/
const startGiffyGram = () => {
        showNavBar();
        showPostList();
        showFooter();
        showPostEntry();
    }
    // Are you defining the function here or invoking it?
    // invoking it ^^
checkForUser();