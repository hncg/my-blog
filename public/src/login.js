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
        <div id="passport-login-pop">
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


ReactDOM.render(
  <Login></Login>,
  document.getElementById('login_window')
);

