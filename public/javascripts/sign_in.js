const url = 'http://222.20.105.151:4396';

/* 绑定注册按钮 */
document.getElementsByClassName('div_sixth_word2')[0].addEventListener('click', function () {
  //window.open(url+'/signin');
  window.location.href = url + '/signup'
},true);

/* 绑定登录按钮 */
document.getElementsByClassName('div_fifth_button')[0].addEventListener('click', function () {
  //console.log(getInput())
  let args =  getInput();
  //check input is or not illegal
  for(let prop in args) {
    if(!args[prop]) {
      alert('empty '+prop+'!');
      return;
    }
  }

  //创建异步对象
  let ajaxObj = new XMLHttpRequest();
  //设置请求的参数。包括：请求的方法、请求的url。
  ajaxObj.open('post', url+'/login');
  ajaxObj.setRequestHeader("Content-type", "application/json");

  //注册事件。 onreadystatechange事件，状态改变时就会调用。如果要在数据完整请求回来的时候才调用，我们需要手动写一些判断的逻辑。
  ajaxObj.onreadystatechange = function () {
    // 为了保证数据完整返回，我们一般会判断两个值. 如果能够进到这个判断说明数据完美的回来了,并且请求的页面是存在的
    if (ajaxObj.readyState === 4 && ajaxObj.status === 200) {

      // 数据是保存在 异步对象的 属性中
      //console.log(ajaxObj.responseText);
      let response = JSON.parse(ajaxObj.responseText); //string to json
      if(response.status === 'success') {
        alert(response.msg);
        window.open(url+`/main?name=${args["name"]}`);
      } else {
        alert(response.msg)
      }

      // 修改页面的显示
      //document.querySelector('h1').innerHTML = ajaxObj.responseText;
    }
  };

  //发送请求
  ajaxObj.send(JSON.stringify(args)); //json to string

},true);

/* 获取输入参数 */
function getInput() {
  //[0]name, [1]password, [2]email
  let inputs = document.getElementsByClassName('input_sign');

  let data = {};
  let index = ['name', 'password'];
  for(let i=0, size=inputs.length; i<size; i++) {
    data[index[i]] = inputs[i].value;
  }

  return data
}
