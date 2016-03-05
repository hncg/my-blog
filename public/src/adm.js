var Title = React.createClass({
    componentDidMount: function() {
    },
    render: function() {
    return (
        <div id='title' >
            <input contentEditable="true" placeholder='标题' />
        </div>
    );
    }

});

var Admin = React.createClass({
    handleSubmit: function(e){
        e.preventDefault();
        content = this.state.ue.getContent();
        title = $('#title input').val();
        author = 'cg';
        data = JSON.stringify({"title": title, "content": content, "author": author});
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'post',
            cache: false,
            data: data,
            success: function(data) {
              alert('发布成功');
            }.bind(this),
            error: function(xhr, status, err) {
              console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {data: [],
                ue: UE.getEditor('container'),
            };
    },
    componentDidMount: function() {
    },
    render: function() {
    return (
        <div className='blog-edit'>
            <Title />
            <script id="container" name="content" type="text/plain"></script>
            <div className='btn'>
                <button className="btn-apply" type="button" onClick={this.handleSubmit}>提交</button>
            </div>
        </div>
    );
    }
});

ReactDOM.render(
  <Admin url='http://blog.che-cg.com/api/v1/user/1/article' pollInterval={60000}/>,
  document.getElementById('admin')
);

