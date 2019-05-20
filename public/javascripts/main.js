const url = 'http://222.20.105.151:4396';
const name = document.getElementById('name').innerHTML;
//const layui = {layer:''}; //只是为了调试写代码方便

layui.use(['layer','form'], function () {
  const layer = layui.layer;
  const form = layui.form;

  /* transfer 表单提交绑定 */
  form.on('submit(formTransfer)', function(data){
    //console.log(data.field);
    let ajaxObj = new XMLHttpRequest();
    ajaxObj.open('post', url+'/pay');
    ajaxObj.setRequestHeader("Content-type", "application/json");

    ajaxObj.onreadystatechange = function () {

      if (ajaxObj.readyState === 4 && ajaxObj.status === 200) {

        //console.log(ajaxObj.responseText);
        let response = JSON.parse(ajaxObj.responseText); //string to json
        if(response.status === 'success') {
          document.getElementById('button_refresh_balance').click();
          alert(response.msg)
          //window.open(url+'/signin');
        } else {
          alert(response.msg)
        }

        //document.querySelector('h1').innerHTML = ajaxObj.responseText;
      }
    };

    //发送请求
    const args = data.field;
    if(isNaN(parseFloat(args.amount))) {
      alert('illegal amount!');
      return false
    }
    //args.amount = parseFloat(args.amount);
    args.flag = 1;
    args.payer = name; //document.get
    //args.owner = 'uzi112'; //city
    console.log(args);
    ajaxObj.send(JSON.stringify(args)); //json to string
    return false;
  });

  /* transfer表单渲染 */
  const html = document.getElementById('form_transfer');
  //console.log(html);
  document.getElementById('button_transfer').addEventListener('click', function () {
    layer.open({
      type: 1,
      title: 'transfer',
      content: html.outerHTML,
      //content: html
      //btn: ['确定', '取消'],
      success: function(layero, index){
        // 加载title数据
        form.render();
      },
    });

  },true);


  /* coin 表单提交绑定 */
  form.on('submit(formCoin)', function(data){
    //console.log(data.field);
    let ajaxObj = new XMLHttpRequest();
    ajaxObj.open('post', url+'/pay');
    ajaxObj.setRequestHeader("Content-type", "application/json");

    ajaxObj.onreadystatechange = function () {

      if (ajaxObj.readyState === 4 && ajaxObj.status === 200) {

        //console.log(ajaxObj.responseText);
        let response = JSON.parse(ajaxObj.responseText); //string to json
        if(response.status === 'success') {
          document.getElementById('button_refresh_balance').click();
          alert(response.msg);
          //window.open(url+'/signin');
        } else {
          alert(response.msg)
        }
      }
    };

    //发送请求
    const args = data.field;
    if(isNaN(parseFloat(args.amount))) {
      alert('illegal amount!');
      return false
    }
    args.flag = 0;
    args.payer = 'admin';
    args.owner = name;
    console.log(args);
    ajaxObj.send(JSON.stringify(args)); //json to string
    return false;
  });

  /* coin表单渲染 */
  const html2 = document.getElementById('form_coin');
  document.getElementById('button_coin').addEventListener('click', function () {
    layer.open({
      type: 1,
      title: 'coin',
      content: html2.outerHTML,
      success: function(layero, index){
        form.render();
      },
    });

  },true);

  /* refresh balance */
  document.getElementById('button_refresh_balance').addEventListener('click', function () {

    let ajaxObj = new XMLHttpRequest();
    ajaxObj.open('get', url+`/test?api=3&name=${name}`);
    //ajaxObj.setRequestHeader("Content-type", "application/json");

    ajaxObj.onreadystatechange = function () {

      if (ajaxObj.readyState === 4 && ajaxObj.status === 200) {

        let response = JSON.parse(ajaxObj.responseText); //string to json
        document.getElementById('balance').innerHTML = 'Num: '+response.balance;

        //document.querySelector('h1').innerHTML = ajaxObj.responseText;
      }
    };

    //发送请求
    ajaxObj.send(); //json to string
  },true);
});
