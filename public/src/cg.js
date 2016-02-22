var Comment = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.props.date.text.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },
  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.date.author}
        </h2>
        <span dangerouslySetInnerHTML= {this.rawMarkup()} />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment){
        return (
            <Comment key={comment.id} date={comment} />
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
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            <div className='commentBox'>
                <h1>Comments</h1>
                <CommentList checked={true} data={this.state.data} />
                <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
            </div>
        );
    }
});

ReactDOM.render(
  <CommentBox url='http://blog.cg.com/api/comment' pollInterval={60000}/>,
  document.getElementById('content')
);