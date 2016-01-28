var Comment = React.createClass({
  displayName: "Comment",

  rawMarkup: function () {
    var rawMarkup = marked(this.props.date.text.toString(), { sanitize: true });
    return { __html: rawMarkup };
  },
  render: function () {
    return React.createElement(
      "div",
      { className: "comment" },
      React.createElement(
        "h2",
        { className: "commentAuthor" },
        this.props.date.author
      ),
      React.createElement("span", { dangerouslySetInnerHTML: this.rawMarkup() })
    );
  }
});

var CommentList = React.createClass({
  displayName: "CommentList",

  render: function () {
    var commentNodes = this.props.data.map(function (comment) {
      return React.createElement(Comment, { key: comment.author, date: comment });
    });
    return React.createElement(
      "div",
      { className: "commentList" },
      commentNodes
    );
  }
});

var commentForm = React.createElement(
  "div",
  { className: "commentForm" },
  "Hello, world! I am a CommentForm."
);
var CommentForm = React.createClass({
  displayName: "CommentForm",

  render: function () {
    return commentForm;
  }
});

var CommentBox = React.createClass({
  displayName: "CommentBox",

  loadCommentsFromServer: function () {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function (data) {
        this.setState({ data: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function () {
    return { data: [] };
  },
  componentDidMount: function () {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function () {
    return React.createElement(
      "div",
      { className: "commentBox" },
      React.createElement(
        "h1",
        null,
        "Comments"
      ),
      React.createElement(CommentList, { data: this.state.data }),
      React.createElement(CommentForm, null)
    );
  }
});

ReactDOM.render(React.createElement(CommentBox, { url: "http://test.cg/api/comment", pollInterval: 20000 }), document.getElementById('content'));