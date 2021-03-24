export const getUsers = () => {

    return fetch("http://localhost:8088/users")
        .then(response => response.json())

}

let postCollection = [];

export const usePostCollection = () => {
    //Best practice: we don't want to alter the original state, so
    //make a copy of it and then return it
    //The spread operator makes this quick work
    return [...postCollection];
}
export const getPostCollection = () => {
    return fetch("http://localhost:8088/posts")
        .then(response => response.json())
        .then(parsedResponse => {
            postCollection = parsedResponse
            return parsedResponse;
        })
}

export const getPosts = () => {
    // the logged in user's id 
    const userId = getLoggedInUser().id
        // expand is used for multiple posts, so multiple posts for one user
    return fetch(`http://localhost:8088/posts?_expand=user`)
        .then(response => response.json())
        .then(parsedResponse => {
            // convert, or parse, the data. returns parsedResponse postCollection which is everything a certain user has posted
            console.log("data with user", parsedResponse)
            postCollection = parsedResponse
            return parsedResponse;
        })
}

export const createPost = postObj => {
    return fetch("http://localhost:8088/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postObj)

        })
        .then(response => response.json())
}

export const deletePost = postId => {
    return fetch(`http://localhost:8088/posts/${postId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }

        })
        .then(response => response.json())
        .then(getPosts)
}

export const getSinglePost = (postId) => {
    return fetch(`http://localhost:8088/posts/${postId}`)
        .then(response => response.json())
}

export const updatePost = postObj => {
        return fetch(`http://localhost:8088/posts/${postObj.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(postObj)

            })
            .then(response => response.json())
            .then(getPosts)
    }
    // logs in user & fetches the local host with user name & email in template literal (allows a lot more options to be inserted this way)
export const loginUser = (userObj) => {
        return fetch(`http://localhost:8088/users?name=${userObj.name}&email=${userObj.email}`)
            .then(response => response.json())
            // parsing data (or converting it) is what's happening here
            .then(parsedUser => {
                //is there a user?
                console.log("parsedUser", parsedUser) //data is returned as an array
                    // do we have something returned? you're parsing the user length? & the zero is the first or initial element
                    // the array is made up of one object, meaning that the name and email are both together in the same object
                if (parsedUser.length > 0) {
                    // the logged in user & the parsed (converted) user is at the zero index? 
                    // we have to go inside the array to get something out, which is the reason for brackets or index
                    // refers to one object 
                    setLoggedInUser(parsedUser[0]);
                    return getLoggedInUser();
                } else {
                    //no user
                    return false;
                }
            })
    }
    // not entirely sure abt this one either, ask abt it
    // but possibly?? this registers the user & fetches the users on the local host
export const registerUser = (userObj) => {
    return fetch(`http://localhost:8088/users`, {
            // accepts data in body of a request message (registering user for example)
            method: "POST",
            // indicates media type; you're requesting to register with giffygram here
            headers: {
                "Content-Type": "application/json"
            },
            // turns new user to a string 
            body: JSON.stringify(userObj)
        })
        // parse the new user & return them so that the new user registers 
        .then(response => response.json())
        .then(parsedUser => {
            setLoggedInUser(parsedUser);
            return getLoggedInUser();
        })
}

let loggedInUser = {}

export const getLoggedInUser = () => {
    return {...loggedInUser };
}

export const logoutUser = () => {
        loggedInUser = {}
    }
    // this sets a user that already exists. userObj is essentially the name of the user
export const setLoggedInUser = (userObj) => {
    // so in this case, the logged in user equals whoever logs in 
    loggedInUser = userObj;
}