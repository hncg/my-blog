function rawMarkup(txt) {
  rawMark = marked(txt, {sanitize: false});
  return { __html: rawMark };
};


function getcookie(objname){
    var ck=document.cookie.split(';');
    for(var i=0;i<ck.length;i++){
        temp=ck[i].split("=");
        if(temp[0].substr(1)==objname)
            return decodeURI(unescape(temp[1]));
      // if(temp[0]==objname) return decodeURI(unescape(temp[1]));
    }
    return false;
}


function setcookie(name,value)
{
    var exp = new Date();
    exp.setTime(exp.getTime() +3600*24*30);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
function delcookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() -3600);
    if(getck(name))
    document.cookie = name + "="+ getck(name) + ";expires=" + exp.toGMTString();
}


String.prototype.format=function()
{
  if(arguments.length==0) return this;
  for(var s=this, i=0; i<arguments.length; i++)
    s=s.replace(new RegExp("\\{"+i+"\\}","g"), arguments[i]);
  return s;
};

var Login = React.createClass({
  close: function() {
    $('#passport-login-pop').hide(500);
  },
  login: function() {
    username = $('#username').val();
    passwd = $('#passwd').val();
    data = JSON.stringify({
        "username": username,
        "passwd": passwd
    });
    $.ajax({
        url: this.props.url,
        dataType: 'json',
        cache: false,
        type: 'post',
        data: data,
        success: function(data) {
            $('#passport-login-pop').hide(500);
            alert("登录成功");
            // success
        }.bind(this),
        error: function(xhr, status,err) {
            if (xhr.status == 422) {
                alert('请注意格式');
            }else if (xhr.status == 403){
                alert('帐号或密码错误');
            } else {
                alert('网络错误');
            }
            // console.error(this.props.url, status, err.toString());
        }.bind(this)
    });
  },
  render: function() {
    return (
        <div id="passport-login-pop" style={{display: 'none'}} >
            <div className='close'>
            <span className='title' >cg`s 博客登录</span>
            <span className='x' onClick={this.close}>✗</span>
            </div>
            <div className="login-form">
                <input id="username" type='text' placeholder="用户名" />
                <input id="passwd" type='password' placeholder="密码" />
                <button id="login" onClick={this.login} >登录</button>
            </div>
            <div className="login-other">
                可以使用以下方式登录
                <a id='login_by_qq' href='./api/v1/login_by_3' ></a>
            </div>
        </div>
      );
    }
});

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
    current = $(this.refs.myCommentButton);
    niker = getcookie('niker');
    sid = getcookie('sid');
    user_id = getcookie('user_id');
    console.log(niker, sid, user_id);
    if (!niker || !sid || !user_id) {
        $('#passport-login-pop').show(500);
        $('#username')[0].focus();
    } else {
        content = current.prev().text();
        parent_id = this.props.parent_id;
        if (!content || !parent_id)
            return false;
        comment = {
            "content": content,
            "parent_id": parent_id,
            "user_niker": niker
        };
        current.prev().text('');
        // console.log(current.parent('div').next().prop('aa'));
        this.props.onCommentSubmit(comment);
    }
  },
  render: function() {
    return (
      <button className="commentSubmit w-input-submit" type="button" onClick={this.handleSubmit} ref='myCommentButton'>评论</button>
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
          <CommentSubmit onCommentSubmit={this.props.onCommentSubmit} parent_id={this.props.parent_id}></CommentSubmit>
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
            data:JSON.stringify(comment),
            success: function(data) {
            }.bind(this),
            error: function(xhr, status, err) {
                if (xhr.status == 422) {
                    alert('请注意格式');
                } else {
                    alert('网络错误');
                }
                this.setState({data: comments});
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {data: this.props.data};
    },
    render: function() {
        return (
          <div className='commentBox'>
              <CommentForm onCommentSubmit={this.handleCommentSubmit} parent_id={this.props.parent_id}></CommentForm>
              <CommentList data={this.state.data}></CommentList>
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
          <CommentBox url='./api/v1/user/1/comment' data={this.props.data.comment} parent_id={this.props.data.id}></CommentBox>
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
                            scroll_auto += 2;
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
        <Login url='./api/v1/login'></Login>
      </div>
      );
  }
});
ReactDOM.render(
  <Blog url='./api/v1/user/1/article' ></Blog>,
  document.getElementById('blogs')
);

