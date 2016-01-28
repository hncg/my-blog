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
            <Comment key={comment.author} date={comment} />
        );
    });
    return (
        <div className='commentList'>
            {commentNodes}
        </div>
    );
  }
});

var commentForm = <div className="commentForm">
                    Hello, world! I am a CommentForm.
                  </div>
var CommentForm = React.createClass({
  render: function() {
    return commentForm;
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
                <CommentList data={this.state.data} />
                <CommentForm />
            </div>
        );
    }
});

ReactDOM.render(
  <CommentBox  url="http://test.cg/api/comment" pollInterval={20000} />,
  document.getElementById('content')
);
