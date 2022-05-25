// Breaking the component into seprate parts 
import ReactDOM from 'react-dom'
import React from 'react'
// import { Router, Route, browserHistory, IndexRoute  } from 'react-router'
function formatDate(date) {
  return date.toLocaleDateString();
}

function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <img className="Avatar"
          src={props.author.avatarUrl}
          alt={props.author.name} />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
      <div className="User-comment">
        {props.userComment}
      </div>
    </div>
  );
}

const comment = {
  date: new Date(),
  text: 'I hope you enjoy learning React!',
  author: {
    name: 'Hello Kitty',
    avatarUrl: 'http://placekitten.com/g/64/64',
  },
  userComment: 'This was very nice article I found it so useful exactly what I was looking for'
}

function Demo() {
  return (
    <div id='root'></div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Comment
    date={comment.date}
    text={comment.text}
    author={comment.author}
    userComment={comment.userComment}
  />
);
