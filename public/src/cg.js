function rawMarkup(txt) {
  var rawMarkup = marked(txt, {sanitize: true});
  return { __html: rawMarkup };
};

var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
        <span className="commentUser">
          <a>{this.props.data.user_niker}</a>
        </span>
        <div dangerouslySetInnerHTML=rawMarkup({this.props.data.content})>
          {}
        </div>
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment){
        return (
            <Comment key={comment.id} data={comment} />
        );
    });
    return (
        <div className='commentList'>
            {commentNodes}
        </div>
    );
  }
});

var CommentSubmit = React.createClass({
  handleSubmit: function(e){
    e.preventDefault();
    commentContent = $('.commentInput');
    comment = {
      author: '评论者:cg',
      text: '评论内容:cgtext',
      id: '-1'
    };
    commentContent.text('');
    this.props.onCommentSubmit(comment);
  },
  render: function() {
    return (
      <button className="commentSubmit w-input-submit" type="button" onClick={this.handleSubmit}>评论</button>
      );
  }
});

var CommentInput = React.createClass({
  render: function() {
    return (
      <div className="commentInput w-input-text" contentEditable="true" maxLength="1024" ref="content">
      </div>
      );
  }
});

var CommentForm = React.createClass({
  render: function() {
    return (
      <form className="commentForm" >
          <CommentInput />
          <CommentSubmit onCommentSubmit={this.props.onCommentSubmit}/>
      </form>
      );
  }
});

var CommentBox = React.createClass({
    render: function() {
        return (
          <div className='commentBox'>
              <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
              <CommentList data={this.props.data} />
          </div>
        );
    }
});

var Article = React.createClass({
  render: function() {
      return (
        <div className="ac">
          <div className="article">
            <h2 className='title'>
              {this.props.data.title}
            </h2>
            <div className='text'>
              {this.props.data.content}
            </div>
          </div>
          <CommentBox  data={this.props.data.comment}/>
        </div>
        );
  }
});

var ArticleList = React.createClass({
  render: function() {
    var articlesNodes = this.props.data.map(function(article){
    return (
            <Article key={article.id} data={article} />
        );
    });
    return (
      <div className='articleList'>
        {articlesNodes}
      </div>
    );
    }
});

var Blog = React.createClass({
    loadCommentsFromServer: function() {
      $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
              this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
              console.error(this.props.url, status, err.toString());
            }.bind(this)
          });
    },
    handleCommentSubmit: function(comment) {
      var comments = this.state.data;
      var newComments = comments.concat(comment);
      this.setState({data: newComments});
      $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      type: 'post',
      success: function(data) {
        // success
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
        this.setState({data: comments});
      }.bind(this)
    });
    },
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        this.loadCommentsFromServer();
        // setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
  render: function() {
    return (
      <div className='blog'>
        <ArticleList data={this.state.data}/>
      </div>
      );
  }
});
ReactDOM.render(
  <Blog url='http://blog.cg.com/api/article' pollInterval={60000}/>,
  document.getElementById('blogs')
);

