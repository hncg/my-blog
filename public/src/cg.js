function rawMarkup(txt) {
  rawMark = marked(txt, {sanitize: false});
  return { __html: rawMark };
};

String.prototype.format=function()
{
  if(arguments.length==0) return this;
  for(var s=this, i=0; i<arguments.length; i++)
    s=s.replace(new RegExp("\\{"+i+"\\}","g"), arguments[i]);
  return s;
};

var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
        <span className="commentUser">
          <a>{this.props.data.user_niker}</a>
        </span>
        <span className='commentContent'>
          {this.props.data.content}
        </span>
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment){
        return (
            <Comment key={comment.id} data={comment}></Comment>
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
      <div className="commentInput w-input-text" contentEditable="true" maxLength="1024">
      </div>
      );
  }
});

var CommentForm = React.createClass({
  render: function() {
    return (
      <div className="commentForm" >
          <CommentInput ></CommentInput>
          <CommentSubmit onCommentSubmit={this.props.onCommentSubmit}></CommentSubmit>
      </div>
      );
  }
});

var CommentBox = React.createClass({
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
    render: function() {
        return (
          <div className='commentBox'>
              <CommentForm onCommentSubmit={this.handleCommentSubmit}></CommentForm>
              <CommentList data={this.props.data}></CommentList>
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
            <div className='text' dangerouslySetInnerHTML={rawMarkup(this.props.data.content)}>
            </div>
          </div>
          <CommentBox data={this.props.data.comment}></CommentBox>
        </div>
        );
  }
});

var ArticleList = React.createClass({
  render: function() {
    var articlesNodes = this.props.data.map(function(article){
    return (
            <Article key={article.id} data={article}></Article>
        );
    });
    return (
      <div className='articleList'>
        {articlesNodes}
      </div>
    );
    }
});

var limit = 3;
var offset = 0;
var remainder = limit + 1;
var times = 0;
var scroll_auto = -1;
var Blog = React.createClass({
    loadCommentsFromServer: function(url) {
      $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            async:true,
            success: function(data) {
                this.setState({data: data});
                window.onscroll = function () {
                    //监听事件内容
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
          });
    },
    test: function(url) {
        blogs = this.state.data;
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            async:true,
            success: function(data) {
                remainder = data.length;
                this.setState({data: blogs.concat(data)});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
          });
        return remainder
    },
    getInitialState: function() {
        $(window).mousewheel(function(event) {
            url = this.props.url + '?limit=' + limit +'&offset={0}';
            if (event.deltaY == -1) {
                    if (remainder < limit) {
                        $('#nothing').text('这次是真没了...');
                    } else {
                        if (scroll_auto != $(window)[0].scrollY) {
                            scroll_auto = $(window)[0].scrollY;
                        } else if (scroll_auto == $(window)[0].scrollY) {
                            offset = limit * ++times;
                            remainder = this.test(url.format(offset));
                        }
                    }
            }
        }.bind(this));
        return {data: []};
    },
    componentDidMount: function() {
        url = this.props.url + '?limit=' + limit +'&offset={0}';
        this.loadCommentsFromServer(url.format(offset));
        // setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
  render: function() {
    return (
      <div className='blog'>
        <ArticleList data={this.state.data}></ArticleList>
        <div id="nothing"></div>
      </div>
      );
  }
});
ReactDOM.render(
  <Blog url='http://blog.cg.com/api/v1/user/1/article' ></Blog>,
  document.getElementById('blogs')
);

