import React, { Component } from 'react';

import Image from '../../../components/Image/Image';
import './SinglePost.css';

class SinglePost extends Component {
  state = {
    title: '',
    author: '',
    date: '',
    image: '',
    content: ''
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;
    const graphqlQuery = {
      query: `{
        getSinglePost(postId:"${postId}") {
          _id
          content
          title
          creator { email name _id }
          createdAt
          imageUrl
        }
      }`
    }
    fetch('http://localhost:8080/graphql', {
      headers: {
        "Authorization": "Bearer " + this.props.token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(graphqlQuery),
      method: "POST"
    })
      .then(res => {
        return res.json();
      })
      .then(resData => {
        // if (res.status !== 200) {
        //   throw new Error('Failed to fetch status');
        // }
        console.log(("http://localhost:8080" + resData.data.getSinglePost.imageUrl));
        this.setState({
          title: resData.data.getSinglePost.title,
          author: resData.data.getSinglePost.creator.name,
          date: new Date(resData.data.getSinglePost.createdAt).toLocaleDateString('en-US'),
          image: "http://localhost:8080/images/" + resData.data.getSinglePost.imageUrl,
          content: resData.data.getSinglePost.content
        });
        console.log(this.state);
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className="single-post__image">
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

export default SinglePost;